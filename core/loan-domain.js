// AleemFin Loan Domain — v74
// Canonical collection-level Loan engine. Every Loan operation reconciles the
// Loan movements, linked Ledger transactions and account balances together.
(function () {
  const EPS = 1e-9;
  const n = v => Number(v || 0) || 0;
  const clone = v => JSON.parse(JSON.stringify(v));

  function normalise(loan) {
    const movements = Array.isArray(loan && loan.movements) ? loan.movements : [];
    const principal = movements.filter(m => m.kind === "principal").reduce((s,m) => s + n(m.amount), 0);
    const repaid = movements.filter(m => m.kind === "repayment").reduce((s,m) => s + n(m.amount), 0);
    const first = movements.find(m => m.kind === "principal");
    return { ...loan, movements, amount: principal, repaid: Math.min(repaid, principal), accountId: first ? first.accountId || null : (loan.accountId || null), date: first ? first.date || loan.date : loan.date };
  }

  function accountAmount(amount, loanCurrency, accountCurrency, toAED, fromAED) {
    if (!accountCurrency) return null;
    return fromAED(toAED(n(amount), loanCurrency || "AED"), accountCurrency);
  }

  function transactionFor(loan, movement, account, opts, overrides) {
    const currency = overrides && overrides.currency || loan.currency || "AED";
    const accountCurrency = account && account.currency;
    const amount = n(movement.amount);
    const incoming = movement.kind === "repayment" ? loan.type === "lent" : loan.type === "borrowed";
    return {
      id: overrides && overrides.id || opts.makeId(),
      title: movement.kind === "repayment"
        ? `${loan.type === "lent" ? "Repayment from" : "Repayment to"} ${loan.name}`
        : `${loan.type === "lent" ? "Loan to" : "Loan from"} ${loan.name}`,
      type: incoming ? "income" : "expense",
      category: movement.kind === "repayment" ? "Loan Repayment" : "Loan",
      amount,
      currency,
      rateToAED: (opts.exchangeRates || {})[currency] || 1,
      accountAmount: accountAmount(amount, currency, accountCurrency, opts.convertToAED, opts.convertFromAED),
      accountId: account ? account.id : (movement.accountId || null),
      date: movement.date || loan.date || opts.todayISO(),
      recordedAt: overrides && overrides.recordedAt || new Date().toISOString(),
      loanId: loan.id,
      movementId: movement.id
    };
  }

  function applyTxBalance(accounts, tx, sign) {
    if (!tx || !tx.accountId || tx.accountAmount == null) return accounts;
    const amount = n(tx.accountAmount);
    const direction = tx.type === "income" ? 1 : -1;
    return accounts.map(a => String(a.id) === String(tx.accountId) ? { ...a, balance: n(a.balance) + sign * direction * amount } : a);
  }

  function linkedTxMap(transactions, loanId) {
    const map = new Map();
    (transactions || []).forEach(t => {
      if (String(t.loanId) === String(loanId) && t.movementId) map.set(String(t.movementId), t);
    });
    return map;
  }

  function reconcileMovementTx(loan, movement, oldTx, accounts, opts, currency) {
    const selectedAccount = movement.accountId ? (opts.accounts || accounts).find(a => String(a.id) === String(movement.accountId)) : null;
    let nextAccounts = oldTx ? applyTxBalance(accounts, oldTx, -1) : accounts;
    const tx = transactionFor(loan, movement, selectedAccount, opts, oldTx ? { id: oldTx.id, recordedAt: oldTx.recordedAt, currency } : { currency });
    nextAccounts = applyTxBalance(nextAccounts, tx, 1);
    return { accounts: nextAccounts, tx };
  }

  function createLoan(input, state, opts) {
    const accounts = clone(state.accounts || []), loans = clone(state.loans || []), transactions = clone(state.transactions || []);
    const account = input.accountId ? accounts.find(a => String(a.id) === String(input.accountId)) : null;
    const currency = input.currency || account?.currency || "AED";
    const id = opts.makeId();
    const movement = { id: opts.makeId(), kind: "principal", amount: n(input.amount), date: input.date || opts.todayISO(), accountId: account ? account.id : null };
    const loan = normalise({ id, type: input.type, name: input.name, currency, whatsapp: input.whatsapp || "", dueDate: input.dueDate || "", date: movement.date, accountId: movement.accountId, movements: [movement] });
    const tx = transactionFor(loan, movement, account, opts);
    return { accounts: applyTxBalance(accounts, tx, 1), loans: [...loans, loan], transactions: tx.accountId ? [tx, ...transactions] : transactions };
  }

  function appendMovement(state, loanId, input, opts) {
    const accounts = clone(state.accounts || []), loans = clone(state.loans || []), transactions = clone(state.transactions || []);
    const loan = loans.find(l => String(l.id) === String(loanId));
    if (!loan) throw new Error("Loan not found");
    const movement = { id: opts.makeId(), kind: input.kind || "principal", amount: n(input.amount), date: input.date || opts.todayISO(), accountId: input.accountId || null };
    if (!(movement.amount > 0)) throw new Error("Amount must be greater than zero");
    if (movement.kind === "repayment" && movement.amount > Math.max(0, n(loan.amount) - n(loan.repaid)) + EPS) throw new Error("Repayment exceeds outstanding balance");
    const nextLoan = normalise({ ...loan, movements: [...(loan.movements || []), movement] });
    const account = movement.accountId ? accounts.find(a => String(a.id) === String(movement.accountId)) : null;
    const tx = transactionFor(nextLoan, movement, account, opts);
    const nextLoans = loans.map(l => String(l.id) === String(loan.id) ? nextLoan : l);
    return { accounts: applyTxBalance(accounts, tx, 1), loans: nextLoans, transactions: tx.accountId ? [tx, ...transactions] : transactions };
  }

  function removeMovement(state, loanId, movementId, opts) {
    const accounts = clone(state.accounts || []), loans = clone(state.loans || []), transactions = clone(state.transactions || []);
    const loan = loans.find(l => String(l.id) === String(loanId));
    if (!loan) throw new Error("Loan not found");
    const movement = (loan.movements || []).find(m => String(m.id) === String(movementId));
    if (!movement) return state;
    const tx = transactions.find(t => String(t.loanId) === String(loan.id) && String(t.movementId || "") === String(movement.id));
    let nextAccounts = tx ? applyTxBalance(accounts, tx, -1) : accounts;
    const nextTransactions = tx ? transactions.filter(t => t.id !== tx.id) : transactions;
    const remaining = (loan.movements || []).filter(m => String(m.id) !== String(movement.id));
    if (movement.kind === "principal" && !remaining.some(m => m.kind === "principal" && n(m.amount) > EPS)) {
      if (remaining.some(m => m.kind === "repayment")) throw new Error("Cannot remove the final principal while repayments remain");
      return { accounts: nextAccounts, loans: loans.filter(l => String(l.id) !== String(loan.id)), transactions: nextTransactions };
    }
    return { accounts: nextAccounts, loans: loans.map(l => String(l.id) === String(loan.id) ? normalise({ ...l, movements: remaining }) : l), transactions: nextTransactions };
  }

  function deleteLoan(state, loanId) {
    const accounts = clone(state.accounts || []), loans = clone(state.loans || []), transactions = clone(state.transactions || []);
    const linked = transactions.filter(t => String(t.loanId) === String(loanId));
    let nextAccounts = accounts;
    linked.forEach(t => { nextAccounts = applyTxBalance(nextAccounts, t, -1); });
    return { accounts: nextAccounts, loans: loans.filter(l => String(l.id) !== String(loanId)), transactions: transactions.filter(t => String(t.loanId) !== String(loanId)) };
  }

  function editMovement(state, loanId, movementId, input, opts) {
    const accounts = clone(state.accounts || []), loans = clone(state.loans || []), transactions = clone(state.transactions || []);
    const loan = loans.find(l => String(l.id) === String(loanId));
    if (!loan) throw new Error("Loan not found");
    const target = (loan.movements || []).find(m => String(m.id) === String(movementId));
    if (!target) throw new Error("Loan movement not found");
    const nextCurrency = input.currency || loan.currency || "AED";
    const newMovementAmount = n(input.amount);
    if (!(newMovementAmount > 0)) throw new Error("Amount must be greater than zero");
    const updatedMovements = (loan.movements || []).map(m => String(m.id) === String(target.id) ? { ...m, amount: newMovementAmount, date: input.date || m.date, accountId: input.accountId !== undefined ? (input.accountId || null) : m.accountId } : { ...m });
    const oldCurrency = loan.currency || "AED";
    const converted = oldCurrency === nextCurrency ? updatedMovements : updatedMovements.map(m => ({ ...m, amount: opts.convertFromAED(opts.convertToAED(n(m.amount), oldCurrency), nextCurrency) }));
    const candidate = normalise({ ...loan, currency: nextCurrency, movements: converted });
    if (candidate.repaid > candidate.amount + EPS) throw new Error("Repayments cannot exceed principal");
    const map = linkedTxMap(transactions, loan.id);
    let nextAccounts = accounts, nextTransactions = transactions;
    converted.forEach(m => {
      const oldTx = map.get(String(m.id));
      if (!oldTx && !m.accountId) return;
      const result = reconcileMovementTx(candidate, m, oldTx, nextAccounts, { ...opts, accounts }, nextCurrency);
      nextAccounts = result.accounts;
      if (oldTx) nextTransactions = nextTransactions.map(t => t.id === oldTx.id ? result.tx : t);
      else if (result.tx.accountId) nextTransactions = [result.tx, ...nextTransactions];
    });
    return { accounts: nextAccounts, loans: loans.map(l => String(l.id) === String(loan.id) ? candidate : l), transactions: nextTransactions };
  }

  function editLoan(state, loanId, input, opts) {
    const accounts = clone(state.accounts || []), loans = clone(state.loans || []), transactions = clone(state.transactions || []);
    const loan = loans.find(l => String(l.id) === String(loanId));
    if (!loan) throw new Error("Loan not found");
    const oldCurrency = loan.currency || "AED";
    const account = input.accountId ? accounts.find(a => String(a.id) === String(input.accountId)) : null;
    const newCurrency = input.currency || oldCurrency;
    const principals = (loan.movements || []).filter(m => m.kind === "principal");
    const repayments = (loan.movements || []).filter(m => m.kind === "repayment");
    if (!principals.length) throw new Error("Loan has no principal movement");
    const convert = v => oldCurrency === newCurrency ? n(v) : opts.convertFromAED(opts.convertToAED(n(v), oldCurrency), newCurrency);
    const otherPrincipal = principals.slice(1).reduce((s,m) => s + convert(m.amount), 0);
    const repaid = repayments.reduce((s,m) => s + convert(m.amount), 0);
    const requested = n(input.amount);
    if (requested + EPS < otherPrincipal) throw new Error("Loan amount cannot be lower than additional principal");
    if (requested + EPS < repaid) throw new Error("Loan amount cannot be lower than repaid amount");
    const firstAmount = requested - otherPrincipal;
    const updatedMovements = (loan.movements || []).map(m => {
      if (m.id === principals[0].id) return { ...m, amount: firstAmount, date: input.date || m.date, accountId: input.accountId !== undefined ? (input.accountId || null) : m.accountId };
      return { ...m, amount: convert(m.amount) };
    });
    const candidate = normalise({ ...loan, type: input.type || loan.type, name: input.name || loan.name, currency: newCurrency, whatsapp: input.whatsapp !== undefined ? input.whatsapp : loan.whatsapp, dueDate: input.dueDate !== undefined ? input.dueDate : loan.dueDate, movements: updatedMovements, accountId: input.accountId !== undefined ? (input.accountId || null) : loan.accountId });
    let nextAccounts = accounts, nextTransactions = transactions;
    const map = linkedTxMap(transactions, loan.id);
    updatedMovements.forEach(m => {
      const oldTx = map.get(String(m.id));
      if (!oldTx && !m.accountId) return;
      const result = reconcileMovementTx(candidate, m, oldTx, nextAccounts, { ...opts, accounts }, newCurrency);
      nextAccounts = result.accounts;
      if (oldTx) nextTransactions = nextTransactions.map(t => t.id === oldTx.id ? result.tx : t);
      else if (result.tx.accountId) nextTransactions = [result.tx, ...nextTransactions];
    });
    return { accounts: nextAccounts, loans: loans.map(l => String(l.id) === String(loan.id) ? candidate : l), transactions: nextTransactions };
  }

  // Convert an already-recorded plain income/expense transaction into a Loan.
  // The transaction's amount/account/date/type never change here — a Loan's
  // principal transaction already uses the same income/expense direction as
  // a plain one (lent => expense, borrowed => income), so this is a pure
  // re-tag: build the canonical Loan + linked transaction via transactionFor
  // (the same path reconcileAll uses) and swap balances old-for-new so the
  // result is byte-for-byte what the engine would have produced natively.
  function convertTransactionToLoan(state, txId, input, opts) {
    const accounts = clone(state.accounts || []), loans = clone(state.loans || []), transactions = clone(state.transactions || []);
    const tx = transactions.find(t => String(t.id) === String(txId));
    if (!tx) throw new Error("Transaction not found");
    if (tx.loanId) throw new Error("This entry is already linked to a loan");
    if (tx.type !== "income" && tx.type !== "expense") throw new Error("Only income or expense entries can be converted to a loan");
    const loanType = input.type === "borrowed" || input.type === "lent" ? input.type : (tx.type === "expense" ? "lent" : "borrowed");
    const name = (input.name || tx.title || "").trim() || "Unnamed";
    const movement = { id: opts.makeId(), kind: "principal", amount: n(tx.amount), date: tx.date, accountId: tx.accountId || null };
    const loan = normalise({
      id: opts.makeId(), type: loanType, name, currency: tx.currency || "AED",
      whatsapp: input.whatsapp || "", dueDate: input.dueDate || "",
      date: tx.date, accountId: movement.accountId, movements: [movement]
    });
    const account = movement.accountId ? accounts.find(a => String(a.id) === String(movement.accountId)) : null;
    const result = reconcileMovementTx(loan, movement, tx, accounts, { ...opts, accounts }, loan.currency);
    return {
      accounts: result.accounts,
      loans: [...loans, loan],
      transactions: transactions.map(t => t.id === tx.id ? result.tx : t)
    };
  }

  // Undo an accidental conversion: only permitted while the loan is still
  // exactly as it was created (a single principal movement, no repayments or
  // extra amounts added) so there is nothing to reconcile away — the linked
  // transaction already has the right type/amount/account, we simply drop
  // the loanId/movementId tag and remove the loan record.
  function revertLoanTransaction(state, txId, opts) {
    const accounts = clone(state.accounts || []), loans = clone(state.loans || []), transactions = clone(state.transactions || []);
    const tx = transactions.find(t => String(t.id) === String(txId));
    if (!tx || !tx.loanId) throw new Error("This entry is not linked to a loan");
    const loan = loans.find(l => String(l.id) === String(tx.loanId));
    if (!loan) throw new Error("Loan not found");
    if ((loan.movements || []).length > 1) throw new Error("Cannot revert — this loan has additional principal or repayment activity. Delete the loan instead if you want to remove it.");
    const { loanId, movementId, ...rest } = tx;
    const plainTx = { ...rest, category: loan.type === "lent" ? "Other" : "Other", title: loan.name };
    return {
      accounts,
      loans: loans.filter(l => String(l.id) !== String(loan.id)),
      transactions: transactions.map(t => t.id === tx.id ? plainTx : t)
    };
  }

  function reconcileAll(state, opts) {
    let next = { accounts: clone(state.accounts || []), loans: clone(state.loans || []), transactions: clone(state.transactions || []) };
    next.loans = next.loans.map(normalise);
    const txByMovement = new Map(next.transactions.filter(t => t && t.loanId && t.movementId).map(t => [`${t.loanId}:${t.movementId}`, t]));
    next.loans.forEach(loan => {
      (loan.movements || []).forEach(m => {
        const key = `${loan.id}:${m.id}`;
        const existing = txByMovement.get(key);
        const account = m.accountId ? next.accounts.find(a => String(a.id) === String(m.accountId)) : null;
        if (existing) {
          const result = reconcileMovementTx(loan, m, existing, next.accounts, { ...opts, accounts: next.accounts }, loan.currency || "AED");
          // Reconciliation must not double-apply balances. Reverse + reapply produces
          // the same balance while also repairing stale transaction metadata.
          next.accounts = result.accounts;
          next.transactions = next.transactions.map(t => t.id === existing.id ? result.tx : t);
        } else if (account) {
          const tx = transactionFor(loan, m, account, opts);
          next.accounts = applyTxBalance(next.accounts, tx, 1);
          next.transactions = [tx, ...next.transactions];
        }
      });
    });
    return next;
  }

  window.AleemFinLoanDomain = { normalise, transactionFor, createLoan, appendMovement, removeMovement, deleteLoan, editMovement, editLoan, reconcileAll, convertTransactionToLoan, revertLoanTransaction };
})();
