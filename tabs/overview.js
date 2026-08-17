// tabs/overview.js — Overview tab, extracted from the original App() render tree.
(function () {
  function Overview(props) {
    const { DashCard, accent, accounts, assets, cardCls, currency, currentMonthLabel, darkMode, exchangeRates, fmt, greeting, liveGoldAEDPerGram, momDeltaPct, monthlyExpenseAED, monthlyIncomeAED, monthlySavingsAED, netWorthTotal, numFmt, openAddModal, openRatesModal, refreshLiveRates, renderTxRow, runwayStatus, savingsRate, setActiveTab, setCurrency, settings, syncingGold, syncingRates, totalLiquidAED, totalLoansBorrowedAED, totalLoansLentAED, totalPhysicalAED, transactions } = props;
    return /* @__PURE__ */React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-6"
  }, /* @__PURE__ */React.createElement("div", {
    className: "md:col-span-2 space-y-5"
  }, settings.showGreeting && /* @__PURE__ */React.createElement("p", {
    className: "text-xs font-semibold text-zinc-400 px-1"
  }, greeting, ", Aleem"), /* @__PURE__ */React.createElement("div", {
    className: "p-6 rounded-3xl bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-2xl space-y-4"
  }, /* @__PURE__ */React.createElement("div", {
    className: "flex justify-between items-start"
  }, /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /* @__PURE__ */React.createElement("p", {
    className: "text-xs font-bold uppercase tracking-wider text-zinc-400"
  }, settings.heroMetric === "networth" ? "Net Worth" : "Total In Hand"), /* @__PURE__ */React.createElement("select", {
    value: currency,
    onChange: e => setCurrency(e.target.value),
    className: `text-[11px] px-2 py-0.5 rounded-lg border font-semibold outline-none bg-zinc-800 border-zinc-700 ${accent.text400} cursor-pointer`
  }, /* @__PURE__ */React.createElement("option", {
    value: "AED"
  }, "AED"), /* @__PURE__ */React.createElement("option", {
    value: "USD"
  }, "USD"), /* @__PURE__ */React.createElement("option", {
    value: "PKR"
  }, "PKR")), /* @__PURE__ */React.createElement("button", {
    onClick: openRatesModal,
    title: "Edit exchange rates",
    className: "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white font-semibold"
  }, /* @__PURE__ */React.createElement(Icons.IconRates, {
    className: "w-3 h-3"
  }), " Rates")), /* @__PURE__ */React.createElement("h2", {
    className: `text-3xl md:text-4xl font-extrabold mt-1 ${accent.text400}`
  }, fmt(settings.heroMetric === "networth" ? netWorthTotal : totalLiquidAED)), /* @__PURE__ */React.createElement("p", {
    className: "text-[11px] text-zinc-500 mt-1"
  }, settings.heroMetric === "networth" ? "Including gold, property & loans, right now" : "Across all accounts & wallets, right now")), /* @__PURE__ */React.createElement("div", {
    className: "text-right"
  }, /* @__PURE__ */React.createElement("p", {
    className: "text-[9px] font-bold uppercase tracking-wider text-zinc-500"
  }, settings.heroMetric === "networth" ? "Total In Hand" : "Net Worth (incl. assets)"), /* @__PURE__ */React.createElement("h3", {
    className: "text-sm font-bold text-zinc-400 mt-1"
  }, fmt(settings.heroMetric === "networth" ? totalLiquidAED : netWorthTotal)))), /* @__PURE__ */React.createElement("div", {
    className: "pt-3 border-t border-zinc-800 space-y-2"
  }, /* @__PURE__ */React.createElement("div", {
    className: "flex justify-between items-center text-xs"
  }, /* @__PURE__ */React.createElement("span", {
    className: `font-bold px-2 py-0.5 rounded-lg ${runwayStatus.cls}`
  }, runwayStatus.label), /* @__PURE__ */React.createElement("span", {
    className: `font-bold ${savingsRate === null ? "text-zinc-400" : savingsRate < 0 ? "text-rose-500" : "text-emerald-500"}`
  }, "Savings Rate: ", savingsRate === null ? "N/A" : `${savingsRate}%`)), /* @__PURE__ */React.createElement("div", {
    className: "flex items-center justify-between gap-2"
  }, /* @__PURE__ */React.createElement("p", {
    className: "text-[11px] text-zinc-500 leading-relaxed"
  }, syncingGold || syncingRates ? /* @__PURE__ */React.createElement(React.Fragment, null, "Fetching today's gold & exchange rates\\u2026") : liveGoldAEDPerGram ? /* @__PURE__ */React.createElement(React.Fragment, null, "Today's 24k gold: ", /* @__PURE__ */React.createElement("strong", {
    className: "text-zinc-300"
  }, "AED ", liveGoldAEDPerGram.toFixed(2), "/g"), " \xB7 1 AED = ", /* @__PURE__ */React.createElement("strong", {
    className: "text-zinc-300"
  }, (1 / exchangeRates.PKR).toFixed(2), " PKR")) : /* @__PURE__ */React.createElement(React.Fragment, null, "1 AED = ", /* @__PURE__ */React.createElement("strong", {
    className: "text-zinc-300"
  }, (1 / exchangeRates.PKR).toFixed(2), " PKR"), " (last saved rate) \xB7 gold rate not synced yet")), /* @__PURE__ */React.createElement("button", {
    type: "button",
    onClick: refreshLiveRates,
    disabled: syncingGold || syncingRates,
    title: "Refresh live rates",
    className: "shrink-0 p-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 disabled:opacity-40 transition-colors"
  }, /* @__PURE__ */React.createElement(Icons.IconSync, {
    className: `w-3.5 h-3.5 ${syncingGold || syncingRates ? "animate-spin" : ""}`
  }))))), /* @__PURE__ */React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /* @__PURE__ */React.createElement(DashCard, {
    tabId: "accounts",
    icon: Icons.IconWallet,
    iconWrapCls: "bg-teal-500/20 text-teal-600",
    tintCls: "bg-teal-500/10 border-teal-500/20 hover:bg-teal-500/15 text-current",
    label: "Accounts",
    big: fmt(totalLiquidAED),
    bigCls: "text-teal-600",
    sub: `${accounts.length} account${accounts.length === 1 ? "" : "s"}`
  }), /* @__PURE__ */React.createElement(DashCard, {
    tabId: "vault",
    icon: Icons.IconVault,
    iconWrapCls: "bg-amber-500/20 text-amber-600",
    tintCls: "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15 text-current",
    label: "Assets (Gold / Property)",
    big: fmt(totalPhysicalAED),
    bigCls: "text-amber-600",
    sub: `${assets.length} item${assets.length === 1 ? "" : "s"}`
  }), /* @__PURE__ */React.createElement(DashCard, {
    tabId: "loans",
    icon: Icons.IconLoan,
    iconWrapCls: "bg-violet-500/20 text-violet-600",
    tintCls: "bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/15 text-current",
    label: "Lent Out (Owed To You)",
    big: fmt(totalLoansLentAED),
    bigCls: "text-violet-600",
    sub: fmt(totalLoansBorrowedAED) + " borrowed",
    chip: totalLoansLentAED > 0 ? "Outstanding" : null,
    chipCls: "bg-violet-500/15 text-violet-700"
  }), /* @__PURE__ */React.createElement(DashCard, {
    tabId: "analytics",
    icon: Icons.IconAnalytics,
    iconWrapCls: "bg-blue-500/20 text-blue-600",
    tintCls: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15 text-current",
    label: `${currentMonthLabel.split(" ")[0]} Snapshot`,
    big: fmt(monthlySavingsAED),
    bigCls: monthlySavingsAED < 0 ? "text-rose-500" : "text-blue-600",
    sub: `In ${fmt(monthlyIncomeAED)} \xB7 Out ${fmt(monthlyExpenseAED)}`,
    chip: momDeltaPct !== null ? `${momDeltaPct >= 0 ? "\u25B2" : "\u25BC"} ${Math.abs(momDeltaPct)}% vs last mo` : null,
    chipCls: momDeltaPct !== null && momDeltaPct >= 0 ? "bg-emerald-500/15 text-emerald-600" : "bg-rose-500/15 text-rose-600"
  })), /* @__PURE__ */React.createElement("div", {
    className: `p-5 ${cardCls} shadow-sm space-y-3`
  }, /* @__PURE__ */React.createElement("span", {
    className: "text-xs font-bold uppercase tracking-wider text-zinc-500 block px-1"
  }, "Quick Actions"), /* @__PURE__ */React.createElement("div", {
    className: "grid grid-cols-4 gap-2.5"
  }, /* @__PURE__ */React.createElement("button", {
    onClick: () => openAddModal("income", {
      category: "Salary"
    }),
    className: `p-3 rounded-2xl border text-center flex flex-col items-center justify-center shadow-sm ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800" : "bg-white border-zinc-200/80 text-zinc-800 hover:bg-zinc-50"}`
  }, /* @__PURE__ */React.createElement("div", {
    className: "w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-1.5"
  }, /* @__PURE__ */React.createElement(Icons.IconPlus, {
    className: "w-4 h-4 text-emerald-600"
  })), /* @__PURE__ */React.createElement("span", {
    className: "text-xs font-semibold"
  }, "Income")), /* @__PURE__ */React.createElement("button", {
    onClick: () => openAddModal("expense", {
      category: "Groceries"
    }),
    className: `p-3 rounded-2xl border text-center flex flex-col items-center justify-center shadow-sm ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800" : "bg-white border-zinc-200/80 text-zinc-800 hover:bg-zinc-50"}`
  }, /* @__PURE__ */React.createElement("div", {
    className: "w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center mb-1.5"
  }, /* @__PURE__ */React.createElement(Icons.IconPlus, {
    className: "w-4 h-4 text-rose-600"
  })), /* @__PURE__ */React.createElement("span", {
    className: "text-xs font-semibold"
  }, "Expense")), /* @__PURE__ */React.createElement("button", {
    onClick: () => openAddModal("transfer"),
    className: `p-3 rounded-2xl border text-center flex flex-col items-center justify-center shadow-sm ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800" : "bg-white border-zinc-200/80 text-zinc-800 hover:bg-zinc-50"}`
  }, /* @__PURE__ */React.createElement("div", {
    className: "w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center mb-1.5"
  }, /* @__PURE__ */React.createElement(Icons.IconTransfer, {
    className: "w-4 h-4 text-blue-600"
  })), /* @__PURE__ */React.createElement("span", {
    className: "text-xs font-semibold"
  }, "Transfer")), /* @__PURE__ */React.createElement("button", {
    onClick: () => openAddModal("loan"),
    className: `p-3 rounded-2xl border text-center flex flex-col items-center justify-center shadow-sm ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800" : "bg-white border-zinc-200/80 text-zinc-800 hover:bg-zinc-50"}`
  }, /* @__PURE__ */React.createElement("div", {
    className: "w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center mb-1.5"
  }, /* @__PURE__ */React.createElement(Icons.IconLoan, {
    className: "w-4 h-4 text-teal-600"
  })), /* @__PURE__ */React.createElement("span", {
    className: "text-xs font-semibold"
  }, "Loan")))), /* @__PURE__ */React.createElement("div", {
    className: "space-y-3"
  }, /* @__PURE__ */React.createElement("div", {
    className: "flex justify-between items-center px-1"
  }, /* @__PURE__ */React.createElement("span", {
    className: "text-xs font-bold uppercase tracking-wider text-zinc-500"
  }, "Recent Ledger Activity"), /* @__PURE__ */React.createElement("button", {
    onClick: () => setActiveTab("transactions"),
    className: `text-xs font-bold ${accent.text} hover:underline`
  }, "View All \u2192")), /* @__PURE__ */React.createElement("div", {
    className: "space-y-2"
  }, transactions.slice(0, 5).map(renderTxRow)))), /* @__PURE__ */React.createElement("div", {
    className: "space-y-6"
  }, /* @__PURE__ */React.createElement("div", {
    className: `p-5 ${cardCls} shadow-sm space-y-3`
  }, /* @__PURE__ */React.createElement("div", {
    className: "flex justify-between items-center px-1"
  }, /* @__PURE__ */React.createElement("span", {
    className: "text-xs font-bold uppercase tracking-wider text-zinc-500"
  }, "Accounts & Wallets"), /* @__PURE__ */React.createElement("button", {
    onClick: () => setActiveTab("accounts"),
    className: `text-xs font-bold ${accent.text} hover:underline`
  }, "Manage \u2192")), /* @__PURE__ */React.createElement("div", {
    className: "space-y-2"
  }, accounts.map(acc => /* @__PURE__ */React.createElement("div", {
    key: acc.id,
    className: `p-3.5 rounded-2xl border bg-gradient-to-br ${acc.color || "from-zinc-500/10 to-zinc-500/5 border-zinc-500/20"} flex justify-between items-center`
  }, /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("span", {
    className: "text-[9px] font-bold uppercase tracking-wider opacity-60"
  }, acc.type), /* @__PURE__ */React.createElement("h4", {
    className: "font-bold text-xs mt-0.5"
  }, acc.name)), /* @__PURE__ */React.createElement("div", {
    className: "text-right"
  }, /* @__PURE__ */React.createElement("span", {
    className: "text-[9px] font-bold opacity-60 block"
  }, acc.currency), /* @__PURE__ */React.createElement("span", {
    className: `font-extrabold text-xs ${darkMode ? "text-emerald-400" : "text-emerald-600"}`
  }, numFmt(acc.balance)))))))));
  }

  window.Tabs = window.Tabs || {};
  window.Tabs.Overview = Overview;
})();
