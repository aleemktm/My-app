// AleemFin Loan Engine — v73
// Pure relationship helpers for the Loan domain. UI/state handlers supply the
// current account/rate conversion functions and then persist the resulting
// collections together. Loans, Ledger and Home therefore share one movement
// relationship instead of maintaining separate loan-specific calculations.
(function () {
  const num = v => Number(v || 0) || 0;

  function normalizeLoan(loan) {
    const movements = Array.isArray(loan?.movements) ? loan.movements : [];
    const principal = movements.filter(m => m.kind === "principal").reduce((s, m) => s + num(m.amount), 0);
    const repaid = movements.filter(m => m.kind === "repayment").reduce((s, m) => s + num(m.amount), 0);
    const firstPrincipal = movements.find(m => m.kind === "principal");
    return {
      ...loan,
      amount: principal,
      repaid: Math.min(repaid, principal),
      accountId: firstPrincipal?.accountId || null,
      date: firstPrincipal?.date || loan.date
    };
  }

  function movementToTransaction(loan, movement, opts) {
    const convertFromAED = opts.convertFromAED;
    const convertToAED = opts.convertToAED;
    const exchangeRates = opts.exchangeRates || {};
    const account = opts.account || null;
    const amount = num(movement.amount);
    const loanCurrency = loan.currency || "AED";
    const accountAmount = account
      ? convertFromAED(convertToAED(amount, loanCurrency), account.currency)
      : null;
    const repayment = movement.kind === "repayment";
    const incoming = repayment ? loan.type === "lent" : loan.type === "borrowed";
    return {
      id: opts.id || makeId(),
      title: repayment
        ? `${loan.type === "lent" ? "Repayment from" : "Repayment to"} ${loan.name}`
        : `${loan.type === "lent" ? "Loan to" : "Loan from"} ${loan.name}`,
      type: incoming ? "income" : "expense",
      category: repayment ? "Loan Repayment" : "Loan",
      amount,
      currency: loanCurrency,
      rateToAED: exchangeRates[loanCurrency] || 1,
      accountAmount,
      accountId: account?.id || movement.accountId || null,
      date: movement.date || loan.date || todayISO(),
      recordedAt: opts.recordedAt || new Date().toISOString(),
      loanId: loan.id,
      movementId: movement.id
    };
  }

  function appendMovement(loan, movement) {
    return normalizeLoan({
      ...loan,
      movements: [...(Array.isArray(loan.movements) ? loan.movements : []), movement]
    });
  }

  function removeMovement(loan, movementId) {
    const movements = (loan.movements || []).filter(m => String(m.id) !== String(movementId));
    const hasPrincipal = movements.some(m => m.kind === "principal" && num(m.amount) > 1e-9);
    return hasPrincipal ? normalizeLoan({ ...loan, movements }) : null;
  }

  function removeMovementsForTransactions(loans, txs) {
    const idsByLoan = new Map();
    (txs || []).forEach(tx => {
      if (!tx?.loanId) return;
      const key = String(tx.loanId);
      const set = idsByLoan.get(key) || new Set();
      set.add(String(tx.movementId || tx.id));
      idsByLoan.set(key, set);
    });
    return (loans || []).reduce((out, loan) => {
      const ids = idsByLoan.get(String(loan.id));
      if (!ids) { out.push(loan); return out; }
      let next = loan;
      for (const id of ids) {
        if ((next.movements || []).some(m => String(m.id) === id)) next = removeMovement(next, id);
        if (!next) break;
      }
      if (next) out.push(next);
      return out;
    }, []);
  }

  window.AleemFinLoanEngine = {
    normalizeLoan,
    movementToTransaction,
    appendMovement,
    removeMovement,
    removeMovementsForTransactions
  };
})();
