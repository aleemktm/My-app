// tabs/ledger.js — Transactions/Ledger tab.
(function () {
  function Ledger(props) {
    const {
      accent, darkMode, dateFmt, exportCSV, filteredTransactions, ledgerFilter,
      ledgerSearch, ledgerSort, numFmt, openAddModal, openEditModal,
      setDeleteTarget, setLedgerFilter, setLedgerSearch, setLedgerSort,
      subCardCls, transactions
    } = props;
    const h = React.createElement;
    return h("div", { className: "space-y-4 max-w-2xl mx-auto w-full" },
      h("div", { className: "flex justify-between items-center px-1 gap-2" },
        h("h2", { className: "text-sm font-bold uppercase tracking-wider text-emerald-500" }, "Connected Transactions Ledger"),
        h("div", { className: "flex items-center gap-2" },
          h("button", { onClick: exportCSV, title: "Export CSV", className: `p-2 rounded-xl border ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700"}` },
            h(Icons.IconCSV, { className: "w-4 h-4" })),
          h("button", { onClick: () => openAddModal("income", { category: "Salary" }), className: `px-3 py-1.5 ${accent.solidBtn} text-white rounded-xl text-xs font-semibold whitespace-nowrap` }, "+ Add Entry")
        )
      ),
      h("div", { className: "flex gap-2" },
        h("div", { className: `flex-1 flex items-center gap-2 px-3 rounded-xl border ${darkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"}` },
          h(Icons.IconSearch, { className: "w-3.5 h-3.5 text-zinc-400 shrink-0" }),
          h("input", { type: "text", placeholder: "Search title or category…", value: ledgerSearch, onChange: e => setLedgerSearch(e.target.value), className: "w-full py-2 text-[16px] bg-transparent outline-none" })
        ),
        h("label", { className: `icon-select ${darkMode ? "icon-select-dark" : ""}`, title: "Filter transactions", "aria-label": "Filter transactions" },
          h(Icons.IconFilter, { className: "w-4 h-4" }),
          h("select", { value: ledgerFilter, onChange: e => setLedgerFilter(e.target.value), "aria-label": "Filter transactions" },
            h("option", { value: "all" }, "All Types"), h("option", { value: "income" }, "Income"), h("option", { value: "expense" }, "Expense"), h("option", { value: "transfer" }, "Transfer")
          )
        ),
        h("label", { className: `icon-select ${darkMode ? "icon-select-dark" : ""}`, title: "Sort transactions", "aria-label": "Sort transactions" },
          h(Icons.IconSort, { className: "w-4 h-4" }),
          h("select", { value: ledgerSort, onChange: e => setLedgerSort(e.target.value), "aria-label": "Sort transactions" },
            h("option", { value: "date_desc" }, "Newest First"), h("option", { value: "date_asc" }, "Oldest First"), h("option", { value: "amount_desc" }, "Amount: High-Low"), h("option", { value: "amount_asc" }, "Amount: Low-High")
          )
        )
      ),
      h("div", { className: "space-y-2.5" },
        filteredTransactions.length === 0
          ? h("div", { className: `p-12 text-center rounded-3xl border ${darkMode ? "bg-zinc-900/40 border-zinc-800 text-zinc-400" : "bg-white border-zinc-200 text-zinc-500"}` },
              h("p", { className: "text-xs font-medium" }, transactions.length === 0 ? "No transactions recorded yet." : "No transactions match your search."))
          : filteredTransactions.map(tx => h(window.SwipeRow, {
              key: tx.id,
              onEdit: tx.type === "transfer" ? null : () => openEditModal(tx.type, tx),
              onDelete: () => setDeleteTarget({ type: "transaction", id: tx.id, name: tx.title })
            },
              h("div", { className: `swipe-content-card p-4 rounded-2xl border flex justify-between items-center ${subCardCls}` },
                h("div", null,
                  h("div", { className: "flex items-center gap-2" },
                    h("span", { className: `tx-category-icon ${tx.type === "income" ? "tx-category-income" : tx.type === "expense" ? "tx-category-expense" : "tx-category-transfer"}`, title: tx.category, "aria-label": tx.category }, h((tx.type === "income" && String(tx.category).toLowerCase() === "other") ? window.Icons.IconArrowDown45 : (tx.type === "expense" && String(tx.category).toLowerCase() === "other") ? window.Icons.IconArrowUp45 : window.Icons.getCategoryIcon(tx.category), { className: "w-3.5 h-3.5" })),
                    h("span", { className: `tx-category-label ${tx.type === "income" ? "tx-category-income-text" : tx.type === "expense" ? "tx-category-expense-text" : "tx-category-transfer-text"}` }, tx.category),
                    h("span", { className: "text-[10px] text-zinc-400" }, dateFmt(tx.date))
                  ),
                  h("h3", { className: "font-bold text-sm mt-1" }, tx.title)
                ),
                h("div", { className: "flex items-center space-x-2" },
                  h("span", { className: `font-bold text-sm ${tx.type === "income" ? "text-emerald-500" : tx.type === "expense" ? "text-rose-500" : "text-blue-500"}` },
                    tx.type === "income" ? "+" : tx.type === "expense" ? "-" : "", tx.currency, " ", numFmt(tx.amount))
                )
              )
            )
          )
      )
    );
  }
  window.Tabs = window.Tabs || {};
  window.Tabs.Ledger = Ledger;
})();
