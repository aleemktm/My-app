// AleemFin Intelligence Engine — Phase 1
// Deterministic, local-only financial observations. No AI/LLM/network calls.
(function () {
  const n = v => Number(v || 0) || 0;
  const safeDate = value => {
    const d = value ? new Date(value) : null;
    return d && !Number.isNaN(d.getTime()) ? d : null;
  };
  const isoDay = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const monthKey = d => isoDay(d).slice(0, 7);
  const monthDiff = (a, b) => (a.getFullYear() - b.getFullYear()) * 12 + a.getMonth() - b.getMonth();
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function analyse(input) {
    const now = safeDate(input.now) || new Date();
    const transactions = Array.isArray(input.transactions) ? input.transactions.filter(Boolean) : [];
    const loans = Array.isArray(input.loans) ? input.loans.filter(Boolean) : [];
    const accounts = Array.isArray(input.accounts) ? input.accounts.filter(Boolean) : [];
    const recurringItems = Array.isArray(input.recurringItems) ? input.recurringItems.filter(Boolean) : [];
    const convertTxToAED = typeof input.convertTxToAED === "function" ? input.convertTxToAED : t => n(t.amount) * n(t.rateToAED || 1);
    const excluded = new Set(Array.isArray(input.excludedCategories) ? input.excludedCategories : ["Loan", "Loan Repayment", "Balance Adjustment"]);
    const isAnalytic = t => !excluded.has(t.category);
    const tx = transactions.filter(t => t.date && isAnalytic(t));
    const currentKey = monthKey(now);
    const current = tx.filter(t => String(t.date).slice(0, 7) === currentKey);
    const income = current.filter(t => t.type === "income").reduce((s, t) => s + convertTxToAED(t), 0);
    const expense = current.filter(t => t.type === "expense").reduce((s, t) => s + convertTxToAED(t), 0);
    const savings = income - expense;
    const savingsRate = income > 0 ? savings / income : null;

    const monthly = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = monthKey(d);
      const rows = tx.filter(t => String(t.date).slice(0, 7) === key);
      const inc = rows.filter(t => t.type === "income").reduce((s, t) => s + convertTxToAED(t), 0);
      const exp = rows.filter(t => t.type === "expense").reduce((s, t) => s + convertTxToAED(t), 0);
      monthly.push({ key, income: inc, expense: exp, net: inc - exp });
    }
    const history = monthly.slice(1);
    const avgExpense = history.length ? history.reduce((s, m) => s + m.expense, 0) / history.length : 0;
    const avgIncome = history.length ? history.reduce((s, m) => s + m.income, 0) / history.length : 0;
    const lastFull = monthly[1];

    const categoryMap = {};
    current.filter(t => t.type === "expense").forEach(t => {
      const key = String(t.category || "Other");
      categoryMap[key] = (categoryMap[key] || 0) + convertTxToAED(t);
    });
    const categories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
    const categorySignals = categories.map(([category, value]) => {
      const previous = history.map(m => {
        const rows = tx.filter(t => String(t.date).slice(0, 7) === m.key && t.type === "expense" && String(t.category || "Other") === category);
        return rows.reduce((s, t) => s + convertTxToAED(t), 0);
      });
      const base = previous.length ? previous.reduce((s, v) => s + v, 0) / previous.length : 0;
      return { category, value, average: base, changePct: base > 0 ? (value - base) / base * 100 : null };
    });

    const totalLiquidAED = n(input.totalLiquidAED);
    const runwayMonths = expense > 0 ? totalLiquidAED / expense : totalLiquidAED > 0 ? 12 : 0;
    const lentOutstanding = loans.filter(l => l.type === "lent").reduce((s, l) => s + Math.max(0, n(l.amount) - n(l.repaid)) * n(input.rateForLoan ? input.rateForLoan(l.currency) : 1), 0);
    const borrowedOutstanding = loans.filter(l => l.type === "borrowed").reduce((s, l) => s + Math.max(0, n(l.amount) - n(l.repaid)) * n(input.rateForLoan ? input.rateForLoan(l.currency) : 1), 0);

    const overdueLoanRows = loans.filter(l => l.dueDate && l.dueDate < isoDay(now) && n(l.amount) - n(l.repaid) > 0);
    const overdueLoans = overdueLoanRows.length;
    const dueSoonLoanRows = loans.filter(l => {
      if (!l.dueDate || n(l.amount) - n(l.repaid) <= 0) return false;
      const d = safeDate(l.dueDate);
      return d && d >= new Date(now.getFullYear(), now.getMonth(), now.getDate()) && d <= new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
    });
    const dueSoonLoans = dueSoonLoanRows.length;

    const activeRecurring = recurringItems.filter(r => r.active !== false);
    const recurringMonthlyEquivalent = activeRecurring.reduce((sum, item) => {
      const amount = n(item.amount);
      const frequency = String(item.frequency || "monthly").toLowerCase();
      if (frequency === "weekly") return sum + amount * 52 / 12;
      if (frequency === "biweekly" || frequency === "fortnightly") return sum + amount * 26 / 12;
      if (frequency === "yearly" || frequency === "annual" || frequency === "annually") return sum + amount / 12;
      return sum + amount;
    }, 0);

    const observations = [];
    const add = (id, severity, title, detail, score, meta = {}) => observations.push({ id, severity, title, detail, score, meta });

    if (overdueLoans > 0) add("overdue-loans", "serious", "Overdue money needs attention", `${overdueLoans} loan${overdueLoans === 1 ? " is" : "s are"} past its due date with money still outstanding.`, 95, { overdueLoans, loanId: overdueLoanRows[0]?.id || null, action: "open-loan" });
    if (runwayMonths < 1 && expense > 0) add("low-runway", "serious", "Cash buffer is very low", `Your current liquid balance covers about ${runwayMonths.toFixed(1)} months of recent spending.`, 92, { runwayMonths });
    else if (runwayMonths < 3 && expense > 0) add("thin-runway", "warning", "Your cash buffer is getting thin", `At your current spending pace, liquid funds cover about ${runwayMonths.toFixed(1)} months.`, 78, { runwayMonths });
    if (dueSoonLoans > 0) add("loan-due-soon", "warning", "A repayment is coming up", `${dueSoonLoans} outstanding loan${dueSoonLoans === 1 ? " is" : "s are"} due within the next 7 days.`, 72, { dueSoonLoans, loanId: dueSoonLoanRows[0]?.id || null, action: "open-loan" });

    const largestCategory = categorySignals[0];
    const unusualCategory = categorySignals.filter(c => c.average >= 50 && c.changePct >= 25).sort((a, b) => b.changePct - a.changePct)[0];
    if (unusualCategory) add("category-spike", "warning", `${unusualCategory.category} is running higher than usual`, `This month is about ${Math.round(unusualCategory.changePct)}% above your recent average for this category.`, 68, unusualCategory);

    if (avgExpense > 0 && expense > avgExpense * 1.2) add("spending-pace", "warning", "Spending pace is above normal", `This month is currently about ${Math.round((expense / avgExpense - 1) * 100)}% above your recent monthly spending average.`, 65, { expense, avgExpense });
    if (income > 0 && savings > 0 && savingsRate >= 0.25) add("strong-savings", "positive", "Your savings pace is strong", `You're currently keeping about ${Math.round(savingsRate * 100)}% of this month's income.`, 48, { savingsRate });
    if (lastFull && savings !== 0 && lastFull.net !== 0 && savings > lastFull.net * 1.15) add("savings-improving", "positive", "Savings improved", "Your current monthly net is ahead of the previous full month.", 44, { currentNet: savings, previousNet: lastFull.net });
    if (lentOutstanding > 0 && loans.filter(l => l.type === "lent" && n(l.amount) - n(l.repaid) > 0).length >= 3) add("loan-exposure", "info", "A meaningful amount is still out on loan", "Several outstanding lent balances are tying up part of your available wealth.", 38, { lentOutstanding });
    if (recurringMonthlyEquivalent > 0 && expense > 0 && recurringMonthlyEquivalent / expense > 0.5) add("recurring-load", "info", "Recurring commitments are significant", `Your active recurring commitments are roughly ${Math.round(recurringMonthlyEquivalent / expense * 100)}% of this month's spending pace.`, 35, { recurringMonthlyEquivalent });
    if (!observations.length) add("quiet-day", "neutral", "Everything looks steady", "No unusual financial pattern needs your attention right now.", 10);

    observations.sort((a, b) => b.score - a.score);
    const top = observations[0];
    return {
      version: 1,
      generatedAt: now.toISOString(),
      severity: top.severity,
      headline: top.title,
      detail: top.detail,
      observations,
      metrics: { income, expense, savings, savingsRate, avgIncome, avgExpense, runwayMonths, lentOutstanding, borrowedOutstanding, overdueLoans, dueSoonLoans, recurringMonthlyEquivalent, largestCategory: largestCategory ? { category: largestCategory.category, value: largestCategory.value } : null },
      monthly
    };
  }

  window.AleemFinIntelligence = { analyse };
})();
