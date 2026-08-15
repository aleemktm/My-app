// tabs/loans.js — Loans & Liabilities tab.
(function () {
  function Loans(props) {
    const { accounts, darkMode, dateFmt, expandedLoanHistory, fmt, loanSort, numFmt, openAddModal, openEditModal, setAddMoreAccountId, setAddMoreAmount, setAddMoreDate, setDeleteTarget, setExpandedLoanHistory, setLoanAddMoreTarget, setLoanSort, setRepayAccountId, setRepayAmount, setRepayDate, setRepaymentModalLoan, sortedLoans, subCardCls, todayISO, todayStr, totalLoansBorrowedAED, totalLoansLentAED, selectionKey } = props;
    const h = React.createElement;
    return h("div", { className: "space-y-4 max-w-2xl mx-auto w-full" },
      h("div", { className: "flex justify-between items-center px-1 gap-2" },
        h("h2", { className: "text-sm font-bold uppercase tracking-wider text-emerald-600" }, "Loans & Liabilities"),
        h("div", { className: "flex items-center gap-2" },
          h("label", { className: `icon-select ${darkMode ? "icon-select-dark" : ""}`, title: "Sort loans", "aria-label": "Sort loans" },
            h(Icons.IconSort, { className: "w-4 h-4" }),
            h("select", { value: loanSort, onChange: e => setLoanSort(e.target.value), "aria-label": "Sort loans" },
              h("option", { value: "date_desc" }, "Newest First"), h("option", { value: "date_asc" }, "Oldest First"), h("option", { value: "amount_desc" }, "Amount: High-Low"), h("option", { value: "amount_asc" }, "Amount: Low-High"), h("option", { value: "name" }, "Name A-Z")
            )
          ),
          h("button", { onClick: () => openAddModal("loan"), className: "px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold whitespace-nowrap" }, "+ Add Entry")
        )
      ),
      h("div", { className: "loan-overview-grid" },
        h("div", { className: `loan-overview-card loan-overview-lent ${darkMode ? "loan-overview-dark" : ""}` },
          h("div", { className: "loan-overview-icon" }, h(Icons.IconArrowUp45, { className: "w-5 h-5" })),
          h("div", { className: "min-w-0" }, h("span", { className: "loan-overview-label" }, "Lent out"), h("strong", { className: "loan-overview-value" }, fmt(totalLoansLentAED)), h("small", { className: "loan-overview-note" }, "Money others owe you"))
        ),
        h("div", { className: `loan-overview-card loan-overview-borrowed ${darkMode ? "loan-overview-dark" : ""}` },
          h("div", { className: "loan-overview-icon" }, h(Icons.IconArrowDown45, { className: "w-5 h-5" })),
          h("div", { className: "min-w-0" }, h("span", { className: "loan-overview-label" }, "Borrowed"), h("strong", { className: "loan-overview-value" }, fmt(totalLoansBorrowedAED)), h("small", { className: "loan-overview-note" }, "Money you owe"))
        )
      ),
      h("div", { className: "space-y-3" }, sortedLoans.map(loan => {
        const repaid = loan.repaid || 0;
        const outstanding = loan.amount - repaid;
        const percentPaid = Math.round(repaid / loan.amount * 100) || 0;
        const isFullyPaid = outstanding <= 0;
        const isOverdue = !isFullyPaid && loan.dueDate && loan.dueDate < todayStr;
        return h(window.SwipeRow, {
          key: loan.id,
          onEdit: () => openEditModal("loan", loan),
          onDelete: () => setDeleteTarget({ type: "loan", id: loan.id, name: loan.name }),
          selectionKey: selectionKey("loan", loan.id)
        },
          h("div", { className: `swipe-content-card p-4 rounded-2xl border space-y-3 ${subCardCls}` },
            h("div", { className: "flex justify-between items-start" },
              h("div", null,
                h("div", { className: "flex items-center gap-2 flex-wrap" },
                  h("span", { className: `px-2 py-0.5 rounded text-[9px] font-bold uppercase ${loan.type === "lent" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-500"}` }, loan.type === "lent" ? "Lent Out" : "Borrowed Liability"),
                  isFullyPaid && h("span", { className: "px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded text-[9px] font-bold uppercase" }, "Fully Paid"),
                  isOverdue && h("span", { className: "px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded text-[9px] font-bold uppercase animate-pulse" }, "Overdue")
                ),
                h("h3", { className: "font-bold text-sm mt-1" }, loan.name),
                loan.dueDate && h("p", { className: "text-[10px] opacity-50 mt-0.5" }, "Due: ", dateFmt(loan.dueDate)),
                loan.whatsapp && !isFullyPaid && h("a", { href: `https://wa.me/${loan.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${loan.name}, reminder regarding the outstanding balance of ${loan.currency} ${numFmt(outstanding)}`)}`, target: "_blank", rel: "noreferrer", className: "text-[10px] text-emerald-500 hover:underline block mt-0.5" }, "WhatsApp Reminder →")
              ),
              h("div", { className: "text-right mr-1" }, h("span", { className: `font-bold text-sm block ${isFullyPaid ? "text-zinc-400 line-through" : loan.type === "lent" ? "text-emerald-600" : "text-rose-500"}` }, loan.currency, " ", numFmt(outstanding)), h("span", { className: "text-[10px] opacity-50" }, "Orig: ", numFmt(loan.amount)))
            ),
            h("div", { className: "space-y-1" },
              h("div", { className: "flex justify-between text-[10px] text-zinc-400" }, h("span", null, "Repaid: ", loan.currency, " ", numFmt(repaid), " (", percentPaid, "%)"), h("span", null, outstanding === 0 ? "Settled" : `${percentPaid}% Paid`)),
              h("div", { className: "w-full bg-zinc-800/20 h-2 rounded-full overflow-hidden" }, h("div", { className: "bg-emerald-500 h-full transition-all duration-300", style: { width: `${percentPaid}%` } }))
            ),
            h("div", { className: "pt-1 flex flex-wrap gap-2 justify-end" },
              !isFullyPaid && h("button", { onClick: () => { setRepaymentModalLoan(loan); setRepayAmount(outstanding.toString()); setRepayAccountId((accounts[0] ? accounts[0].id : "") || ""); setRepayDate(todayISO()); }, className: "loan-text-action loan-text-action-repay", title: "Record repayment", "aria-label": "Record repayment" }, "+Repayment"),
              h("button", { onClick: () => { setLoanAddMoreTarget(loan); setAddMoreAmount(""); setAddMoreAccountId((accounts[0] ? accounts[0].id : "") || ""); setAddMoreDate(todayISO()); }, className: "loan-text-action loan-text-action-add", title: "Add more to loan", "aria-label": "Add more to loan" }, "+Add more"),
              h("button", { onClick: () => setExpandedLoanHistory(prev => ({ ...prev, [loan.id]: !prev[loan.id] })), className: "loan-icon-action loan-icon-action-history", title: expandedLoanHistory[loan.id] ? "Hide history" : "Show history", "aria-label": expandedLoanHistory[loan.id] ? "Hide history" : "Show history" }, h(Icons.IconHistory, { className: "w-4 h-4" })),
              expandedLoanHistory[loan.id] && h("div", { className: "w-full pt-2 space-y-1.5" },
                (loan.movements && loan.movements.length > 0 ? [...loan.movements].slice().sort((a,b) => (b.date || "").localeCompare(a.date || "")) : []).map(mv => h("div", { key: mv.id, className: "flex justify-between items-center text-[11px] px-2.5 py-1.5 rounded-lg bg-zinc-500/5" }, h("span", { className: "text-zinc-400" }, dateFmt(mv.date), " · ", mv.kind === "principal" ? loan.type === "lent" ? "Given" : "Received" : "Repaid"), h("span", { className: `font-bold ${mv.kind === "principal" ? loan.type === "lent" ? "text-rose-500" : "text-emerald-600" : loan.type === "lent" ? "text-emerald-600" : "text-rose-500"}` }, mv.kind === "principal" ? "+" : "-", loan.currency, " ", numFmt(mv.amount)))),
                (!loan.movements || loan.movements.length === 0) && h("p", { className: "text-[10px] text-zinc-400 text-center py-2" }, "No dated movements logged yet for this entry.")
              )
            )
          )
        );
      }))
    );
  }
  window.Tabs = window.Tabs || {};
  window.Tabs.Loans = Loans;
})();
