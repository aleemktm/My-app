// tabs/loans.js — Loans & Liabilities tab.
(function () {
  function Loans(props) {
    const { accounts, darkMode, dateFmt, expandedLoanHistory, fmt, loanSort, numFmt, openAddModal, openEditModal, setAddMoreAccountId, setAddMoreAmount, setAddMoreDate, setDeleteTarget, setExpandedLoanHistory, setLoanAddMoreTarget, setLoanSort, setRepayAccountId, setRepayAmount, setRepayDate, setRepaymentModalLoan, sortedLoans, subCardCls, todayISO, todayStr, totalLoansBorrowedAED, totalLoansLentAED } = props;
    return /* @__PURE__ */React.createElement("div", {
    className: "space-y-4 max-w-2xl mx-auto w-full"
  }, /* @__PURE__ */React.createElement("div", {
    className: "flex justify-between items-center px-1 gap-2"
  }, /* @__PURE__ */React.createElement("h2", {
    className: "text-sm font-bold uppercase tracking-wider text-emerald-600"
  }, "Loans & Liabilities"), /* @__PURE__ */React.createElement("div", {
    className: "flex items-center gap-2"
  }, /* @__PURE__ */React.createElement("label", {
    className: `icon-select ${darkMode ? "icon-select-dark" : ""}`,
    title: "Sort loans",
    "aria-label": "Sort loans"
  }, /* @__PURE__ */React.createElement(Icons.IconSort, { className: "w-4 h-4" }), /* @__PURE__ */React.createElement("select", {
    value: loanSort,
    onChange: e => setLoanSort(e.target.value),
    "aria-label": "Sort loans"
  }, /* @__PURE__ */React.createElement("option", { value: "date_desc" }, "Newest First"), /* @__PURE__ */React.createElement("option", { value: "date_asc" }, "Oldest First"), /* @__PURE__ */React.createElement("option", { value: "amount_desc" }, "Amount: High-Low"), /* @__PURE__ */React.createElement("option", { value: "amount_asc" }, "Amount: Low-High"), /* @__PURE__ */React.createElement("option", { value: "name" }, "Name A-Z"))), /* @__PURE__ */React.createElement("button", {
    onClick: () => openAddModal("loan"),
    className: "px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold whitespace-nowrap"
  }, "+ Add Entry"))), /* @__PURE__ */React.createElement("div", {
    className: `p-4 ${subCardCls} grid grid-cols-2 gap-3 text-center`
  }, /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("span", {
    className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500 block"
  }, "Lent Out"), /* @__PURE__ */React.createElement("span", {
    className: "font-extrabold text-lg text-emerald-600"
  }, fmt(totalLoansLentAED))), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("span", {
    className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500 block"
  }, "Borrowed"), /* @__PURE__ */React.createElement("span", {
    className: "font-extrabold text-lg text-rose-500"
  }, fmt(totalLoansBorrowedAED)))), /* @__PURE__ */React.createElement("div", {
    className: "space-y-3"
  }, sortedLoans.map(loan => {
    const repaid = loan.repaid || 0;
    const outstanding = loan.amount - repaid;
    const percentPaid = Math.round(repaid / loan.amount * 100) || 0;
    const isFullyPaid = outstanding <= 0;
    const isOverdue = !isFullyPaid && loan.dueDate && loan.dueDate < todayStr;
    return /* @__PURE__ */React.createElement(window.SwipeRow, {
      key: loan.id,
      onEdit: () => openEditModal("loan", loan),
      onDelete: () => setDeleteTarget({ type: "loan", id: loan.id, name: loan.name })
    }, /* @__PURE__ */React.createElement("div", {
      className: `swipe-content-card p-4 rounded-2xl border space-y-3 ${subCardCls}`
    }, /* @__PURE__ */React.createElement("div", {
      className: "flex justify-between items-start"
    }, /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("div", {
      className: "flex items-center gap-2 flex-wrap"
    }, /* @__PURE__ */React.createElement("span", {
      className: `px-2 py-0.5 rounded text-[9px] font-bold uppercase ${loan.type === "lent" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-500"}`
    }, loan.type === "lent" ? "Lent Out" : "Borrowed Liability"), isFullyPaid && /* @__PURE__ */React.createElement("span", {
      className: "px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded text-[9px] font-bold uppercase"
    }, "Fully Paid"), isOverdue && /* @__PURE__ */React.createElement("span", {
      className: "px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded text-[9px] font-bold uppercase animate-pulse"
    }, "Overdue")), /* @__PURE__ */React.createElement("h3", {
      className: "font-bold text-sm mt-1"
    }, loan.name), loan.dueDate && /* @__PURE__ */React.createElement("p", {
      className: "text-[10px] opacity-50 mt-0.5"
    }, "Due: ", dateFmt(loan.dueDate)), loan.whatsapp && !isFullyPaid && /* @__PURE__ */React.createElement("a", {
      href: `https://wa.me/${loan.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${loan.name}, reminder regarding the outstanding balance of ${loan.currency} ${numFmt(outstanding)}`)}`,
      target: "_blank",
      rel: "noreferrer",
      className: "text-[10px] text-emerald-500 hover:underline block mt-0.5"
    }, "WhatsApp Reminder \\u2192")), /* @__PURE__ */React.createElement("div", {
      className: "flex items-center space-x-2"
    }, /* @__PURE__ */React.createElement("div", {
      className: "text-right mr-1"
    }, /* @__PURE__ */React.createElement("span", {
      className: `font-bold text-sm block ${isFullyPaid ? "text-zinc-400 line-through" : loan.type === "lent" ? "text-emerald-600" : "text-rose-500"}`
    }, loan.currency, " ", numFmt(outstanding)), /* @__PURE__ */React.createElement("span", {
      className: "text-[10px] opacity-50"
    }, "Orig: ", numFmt(loan.amount))),)), /* @__PURE__ */React.createElement("div", {
      className: "space-y-1"
    }, /* @__PURE__ */React.createElement("div", {
      className: "flex justify-between text-[10px] text-zinc-400"
    }, /* @__PURE__ */React.createElement("span", null, "Repaid: ", loan.currency, " ", numFmt(repaid), " (", percentPaid, "%)"), /* @__PURE__ */React.createElement("span", null, outstanding === 0 ? "Settled" : `${percentPaid}% Paid`)), /* @__PURE__ */React.createElement("div", {
      className: "w-full bg-zinc-800/20 h-2 rounded-full overflow-hidden"
    }, /* @__PURE__ */React.createElement("div", {
      className: "bg-emerald-500 h-full transition-all duration-300",
      style: {
        width: `${percentPaid}%`
      }
    }))), /* @__PURE__ */React.createElement("div", {
      className: "pt-1 flex flex-wrap gap-2 justify-end"
    }, !isFullyPaid && /* @__PURE__ */React.createElement("button", {
      onClick: () => {
        setRepaymentModalLoan(loan);
        setRepayAmount(outstanding.toString());
        setRepayAccountId((accounts[0] ? accounts[0].id : "") || "");
        setRepayDate(todayISO());
      },
      className: "loan-text-action loan-text-action-repay", title: "Record repayment", "aria-label": "Record repayment"
    }, "+Repayment"), /* @__PURE__ */React.createElement("button", {
      onClick: () => {
        setLoanAddMoreTarget(loan);
        setAddMoreAmount("");
        setAddMoreAccountId((accounts[0] ? accounts[0].id : "") || "");
        setAddMoreDate(todayISO());
      },
      className: "loan-text-action loan-text-action-add", title: "Add more to loan", "aria-label": "Add more to loan"
    }, "+Add more"), /* @__PURE__ */React.createElement("button", {
      onClick: () => setExpandedLoanHistory(prev => ({
        ...prev,
        [loan.id]: !prev[loan.id]
      })),
      className: "loan-icon-action loan-icon-action-history", title: expandedLoanHistory[loan.id] ? "Hide history" : "Show history", "aria-label": expandedLoanHistory[loan.id] ? "Hide history" : "Show history"
    }, React.createElement(Icons.IconHistory, { className: "w-4 h-4" })), expandedLoanHistory[loan.id] && /* @__PURE__ */React.createElement("div", {
      className: "w-full pt-2 space-y-1.5"
    }, (loan.movements && loan.movements.length > 0 ? [...loan.movements].slice().sort((a, b) => (b.date || "").localeCompare(a.date || "")) : []).map(mv => /* @__PURE__ */React.createElement("div", {
      key: mv.id,
      className: "flex justify-between items-center text-[11px] px-2.5 py-1.5 rounded-lg bg-zinc-500/5"
    }, /* @__PURE__ */React.createElement("span", {
      className: "text-zinc-400"
    }, dateFmt(mv.date), " \u00B7 ", mv.kind === "principal" ? loan.type === "lent" ? "Given" : "Received" : "Repaid"), /* @__PURE__ */React.createElement("span", {
      className: `font-bold ${mv.kind === "principal" ? loan.type === "lent" ? "text-rose-500" : "text-emerald-600" : loan.type === "lent" ? "text-emerald-600" : "text-rose-500"}`
    }, mv.kind === "principal" ? "+" : "-", loan.currency, " ", numFmt(mv.amount)))), (!loan.movements || loan.movements.length === 0) && /* @__PURE__ */React.createElement("p", {
      className: "text-[10px] text-zinc-400 text-center py-2"
    }, "No dated movements logged yet for this entry.")))));
  })));
  }

  window.Tabs = window.Tabs || {};
  window.Tabs.Loans = Loans;
})();
