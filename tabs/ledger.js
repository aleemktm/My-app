// tabs/ledger.js — Transactions/Ledger tab.
(function () {
  function Ledger(props) {
    const { accent, darkMode, dateFmt, exportCSV, filteredTransactions, ledgerFilter, ledgerSearch, ledgerSort, numFmt, openAddModal, openEditModal, setDeleteTarget, setLedgerFilter, setLedgerSearch, setLedgerSort, subCardCls, transactions } = props;
    return /* @__PURE__ */React.createElement("div", {
    className: "space-y-4 max-w-2xl mx-auto w-full"
  }, /* @__PURE__ */React.createElement("div", {
    className: "flex justify-between items-center px-1 gap-2"
  }, /* @__PURE__ */React.createElement("h2", {
    className: "text-sm font-bold uppercase tracking-wider text-emerald-500"
  }, "Connected Transactions Ledger"), /* @__PURE__ */React.createElement("div", {
    className: "flex items-center gap-2"
  }, /* @__PURE__ */React.createElement("button", {
    onClick: exportCSV,
    title: "Export CSV",
    className: `p-2 rounded-xl border ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700"}`
  }, /* @__PURE__ */React.createElement(Icons.IconCSV, {
    className: "w-4 h-4"
  })), /* @__PURE__ */React.createElement("button", {
    onClick: () => openAddModal("income", {
      category: "Salary"
    }),
    className: `px-3 py-1.5 ${accent.solidBtn} text-white rounded-xl text-xs font-semibold whitespace-nowrap`
  }, "+ Add Entry"))), /* @__PURE__ */React.createElement("div", {
    className: "flex gap-2"
  }, /* @__PURE__ */React.createElement("div", {
    className: `flex-1 flex items-center gap-2 px-3 rounded-xl border ${darkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"}`
  }, /* @__PURE__ */React.createElement(Icons.IconSearch, {
    className: "w-3.5 h-3.5 text-zinc-400 shrink-0"
  }), /* @__PURE__ */React.createElement("input", {
    type: "text",
    placeholder: "Search title or category\\u2026",
    value: ledgerSearch,
    onChange: e => setLedgerSearch(e.target.value),
    className: "w-full py-2 text-[16px] bg-transparent outline-none"
  })), /* @__PURE__ */React.createElement("select", {
    value: ledgerFilter,
    onChange: e => setLedgerFilter(e.target.value),
    className: `px-2 rounded-xl text-[16px] border outline-none ${darkMode ? "bg-zinc-950 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"}`
  }, /* @__PURE__ */React.createElement("option", {
    value: "all"
  }, "All Types"), /* @__PURE__ */React.createElement("option", {
    value: "income"
  }, "Income"), /* @__PURE__ */React.createElement("option", {
    value: "expense"
  }, "Expense"), /* @__PURE__ */React.createElement("option", {
    value: "transfer"
  }, "Transfer")), /* @__PURE__ */React.createElement("select", {
    value: ledgerSort,
    onChange: e => setLedgerSort(e.target.value),
    className: `px-2 rounded-xl text-[16px] border outline-none ${darkMode ? "bg-zinc-950 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"}`
  }, /* @__PURE__ */React.createElement("option", {
    value: "date_desc"
  }, "Newest First"), /* @__PURE__ */React.createElement("option", {
    value: "date_asc"
  }, "Oldest First"), /* @__PURE__ */React.createElement("option", {
    value: "amount_desc"
  }, "Amount: High-Low"), /* @__PURE__ */React.createElement("option", {
    value: "amount_asc"
  }, "Amount: Low-High"))), /* @__PURE__ */React.createElement("div", {
    className: "space-y-2.5"
  }, filteredTransactions.length === 0 && /* @__PURE__ */React.createElement("div", {
    className: `p-12 text-center rounded-3xl border ${darkMode ? "bg-zinc-900/40 border-zinc-800 text-zinc-400" : "bg-white border-zinc-200 text-zinc-500"}`
  }, /* @__PURE__ */React.createElement("p", {
    className: "text-xs font-medium"
  }, transactions.length === 0 ? "No transactions recorded yet." : "No transactions match your search.")), filteredTransactions.map(tx => /* @__PURE__ */React.createElement("div", {
    key: tx.id,
    className: `p-4 rounded-2xl border flex justify-between items-center ${subCardCls}`
  }, /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("div", {
    className: "flex items-center gap-2"
  }, /* @__PURE__ */React.createElement("span", {
    className: `px-2 py-0.5 rounded text-[9px] font-bold uppercase ${tx.type === "income" ? "bg-emerald-500/10 text-emerald-500" : tx.type === "expense" ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"}`
  }, tx.category), /* @__PURE__ */React.createElement("span", {
    className: "text-[10px] text-zinc-400"
  }, dateFmt(tx.date))), /* @__PURE__ */React.createElement("h3", {
    className: "font-bold text-sm mt-1"
  }, tx.title)), /* @__PURE__ */React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /* @__PURE__ */React.createElement("span", {
    className: `font-bold text-sm ${tx.type === "income" ? "text-emerald-500" : tx.type === "expense" ? "text-rose-500" : "text-blue-500"}`
  }, tx.type === "income" ? "+" : tx.type === "expense" ? "-" : "", tx.currency, " ", numFmt(tx.amount)), tx.type !== "transfer" && /* @__PURE__ */React.createElement(React.Fragment, null, /* @__PURE__ */React.createElement("button", {
    onClick: () => openEditModal(tx.type, tx),
    title: "Edit",
    className: "p-2 -m-0.5 rounded-xl text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 active:scale-95"
  }, /* @__PURE__ */React.createElement(Icons.IconEdit, {
    className: "w-4 h-4"
  })), /* @__PURE__ */React.createElement("button", {
    onClick: () => setDeleteTarget({
      type: "transaction",
      id: tx.id,
      name: tx.title
    }),
    title: "Delete",
    className: "p-2 -m-0.5 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 active:scale-95"
  }, /* @__PURE__ */React.createElement(Icons.IconTrash, {
    className: "w-4 h-4"
  }))))))));
  }

  window.Tabs = window.Tabs || {};
  window.Tabs.Ledger = Ledger;
})();
