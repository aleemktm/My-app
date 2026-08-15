// modals.js — All modal/sheet overlays used across tabs.
(function () {
  function MoreSheet(props) {
    const { MORE_NAV_ITEMS, accent, activeTab, darkMode, setActiveTab, setMoreSheetOpen } = props;
    return /* @__PURE__ */React.createElement("div", {
    className: "md:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fadeIn",
    onClick: () => setMoreSheetOpen(false)
  }, /* @__PURE__ */React.createElement("div", {
    className: `w-full max-w-md rounded-t-3xl border-t border-x p-3 pb-6 safe-bottom shadow-2xl space-y-2 ${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`,
    onClick: e => e.stopPropagation()
  }, /* @__PURE__ */React.createElement("div", {
    className: "w-10 h-1.5 rounded-full bg-zinc-600/40 mx-auto mb-2"
  }), MORE_NAV_ITEMS.map(tab => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return /* @__PURE__ */React.createElement("button", {
      key: tab.id,
      onClick: () => {
        setActiveTab(tab.id);
        setMoreSheetOpen(false);
      },
      className: `w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-colors ${isActive ? accent.activeBg10 : darkMode ? "hover:bg-zinc-800" : "hover:bg-zinc-100"}`
    }, /* @__PURE__ */React.createElement("div", {
      className: `w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? `${accent.activeBg20} ${accent.text}` : darkMode ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-600"}`
    }, /* @__PURE__ */React.createElement(Icon, {
      className: "w-5 h-5"
    })), /* @__PURE__ */React.createElement("span", {
      className: `text-sm font-semibold ${isActive ? accent.text : ""}`
    }, tab.label), /* @__PURE__ */React.createElement(Icons.IconChevron, {
      className: "w-4 h-4 ml-auto opacity-40"
    }));
  })));
  }

  function DeleteConfirm(props) {
    const { confirmDelete, darkMode, deleteTarget, setDeleteTarget } = props;
    return /* @__PURE__ */React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn"
  }, /* @__PURE__ */React.createElement("div", {
    className: `w-full max-w-xs rounded-3xl border p-5 shadow-2xl space-y-3 ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"}`
  }, /* @__PURE__ */React.createElement("h3", {
    className: "font-bold text-sm"
  }, "Confirm Deletion"), /* @__PURE__ */React.createElement("p", {
    className: "text-xs text-zinc-400"
  }, "Are you sure you want to delete ", /* @__PURE__ */React.createElement("strong", {
    className: "text-zinc-200"
  }, '"', deleteTarget.name, '"'), "? This action cannot be undone."), deleteTarget.extra && /* @__PURE__ */React.createElement("p", {
    className: "text-xs text-rose-400 font-semibold"
  }, deleteTarget.extra), /* @__PURE__ */React.createElement("div", {
    className: "pt-2 flex justify-end space-x-2"
  }, /* @__PURE__ */React.createElement("button", {
    type: "button",
    onClick: () => setDeleteTarget(null),
    className: `px-3.5 py-2 rounded-xl text-xs font-semibold border ${darkMode ? "border-zinc-800 hover:bg-zinc-800" : "border-zinc-200 hover:bg-zinc-100"}`
  }, "Cancel"), /* @__PURE__ */React.createElement("button", {
    type: "button",
    onClick: confirmDelete,
    className: "px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-600/20"
  }, "Delete"))));
  }

  function RatesModal(props) {
    const { accent, darkMode, inputCls, rateForm, rateSyncMsg, saveRates, setRateForm, setRatesModalOpen, syncLiveExchangeRates, syncingRates } = props;
    return /* @__PURE__ */React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn"
  }, /* @__PURE__ */React.createElement("div", {
    className: `w-full max-w-xs rounded-3xl border p-5 shadow-2xl space-y-3 ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"}`
  }, /* @__PURE__ */React.createElement("div", {
    className: "flex justify-between items-center"
  }, /* @__PURE__ */React.createElement("h3", {
    className: "font-bold text-sm"
  }, "Exchange Rates"), /* @__PURE__ */React.createElement("button", {
    onClick: () => setRatesModalOpen(false),
    className: "p-1 rounded-lg hover:bg-zinc-800 text-zinc-400"
  }, /* @__PURE__ */React.createElement(Icons.IconClose, {
    className: "w-3.5 h-3.5"
  }))), /* @__PURE__ */React.createElement("p", {
    className: "text-[10px] text-zinc-400"
  }, "1 unit of currency = this many AED."), /* @__PURE__ */React.createElement("button", {
    type: "button",
    onClick: syncLiveExchangeRates,
    disabled: syncingRates,
    className: `w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border disabled:opacity-50 ${darkMode ? "border-zinc-800 hover:bg-zinc-800" : "border-zinc-200 hover:bg-zinc-100"}`
  }, /* @__PURE__ */React.createElement(Icons.IconSync, {
    className: `w-3.5 h-3.5 ${syncingRates ? "animate-pulse" : ""}`
  }), " ", syncingRates ? "Syncing\u2026" : "Sync Live Rates"), rateSyncMsg && /* @__PURE__ */React.createElement("p", {
    className: "text-[10px] text-zinc-400"
  }, rateSyncMsg), /* @__PURE__ */React.createElement("p", {
    className: "text-[10px] text-zinc-500"
  }, "Or enter rates manually below \\u2014 they won't update on their own otherwise."), /* @__PURE__ */React.createElement("form", {
    onSubmit: saveRates,
    className: "space-y-3"
  }, /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "AED (base)"), /* @__PURE__ */React.createElement("input", {
    type: "text",
    disabled: true,
    value: "1",
    className: `${inputCls} opacity-50`
  })), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "1 USD = ? AED"), /* @__PURE__ */React.createElement("input", {
    type: "number",
    inputMode: "decimal",
    step: "0.0001",
    required: true,
    value: rateForm.USD,
    onChange: e => setRateForm({
      ...rateForm,
      USD: e.target.value
    }),
    className: inputCls
  })), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "1 PKR = ? AED"), /* @__PURE__ */React.createElement("input", {
    type: "number",
    inputMode: "decimal",
    step: "0.0001",
    required: true,
    value: rateForm.PKR,
    onChange: e => setRateForm({
      ...rateForm,
      PKR: e.target.value
    }),
    className: inputCls
  })), /* @__PURE__ */React.createElement("div", {
    className: "pt-2 flex justify-end space-x-2"
  }, /* @__PURE__ */React.createElement("button", {
    type: "button",
    onClick: () => setRatesModalOpen(false),
    className: `px-3.5 py-2 rounded-xl text-xs font-semibold border ${darkMode ? "border-zinc-800 hover:bg-zinc-800" : "border-zinc-200 hover:bg-zinc-100"}`
  }, "Cancel"), /* @__PURE__ */React.createElement("button", {
    type: "submit",
    className: `px-3.5 py-2 ${accent.solidBtn} text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20`
  }, "Save Rates")))));
  }

  function RepaymentModal(props) {
    const { accent, accounts, darkMode, handleRepaymentSubmit, inputCls, numFmt, repayAccountId, repayAmount, repayDate, repaymentModalLoan, setRepayAccountId, setRepayAmount, setRepayDate, setRepaymentModalLoan } = props;
    return /* @__PURE__ */React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm"
  }, /* @__PURE__ */React.createElement("div", {
    className: `w-full max-w-sm rounded-3xl border p-5 shadow-2xl ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"}`
  }, /* @__PURE__ */React.createElement("div", {
    className: "flex justify-between items-center mb-3"
  }, /* @__PURE__ */React.createElement("h3", {
    className: "font-bold text-sm"
  }, "Record Repayment for ", repaymentModalLoan.name), /* @__PURE__ */React.createElement("button", {
    onClick: () => setRepaymentModalLoan(null),
    className: "p-1 rounded-lg hover:bg-zinc-800 text-zinc-400"
  }, /* @__PURE__ */React.createElement(Icons.IconClose, {
    className: "w-3.5 h-3.5"
  }))), /* @__PURE__ */React.createElement("form", {
    onSubmit: handleRepaymentSubmit,
    className: "space-y-3"
  }, /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Repayment Amount (", repaymentModalLoan.currency, ")"), /* @__PURE__ */React.createElement("input", {
    type: "number",
    inputMode: "decimal",
    step: "0.01",
    min: "0.01",
    max: repaymentModalLoan ? repaymentModalLoan.amount - (repaymentModalLoan.repaid || 0) : void 0,
    required: true,
    autoFocus: true,
    placeholder: "0.00",
    value: repayAmount,
    onChange: e => setRepayAmount(e.target.value),
    className: `w-full px-3 py-2.5 rounded-xl text-[16px] border outline-none ${darkMode ? "bg-zinc-950 border-zinc-800 text-emerald-400 font-bold" : "bg-zinc-50 border-zinc-200 text-emerald-600 font-bold"}`
  })), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, repaymentModalLoan.type === "lent" ? "Deposit into Account" : "Pay from Account", " (optional)"), /* @__PURE__ */React.createElement("select", {
    value: repayAccountId,
    onChange: e => setRepayAccountId(e.target.value),
    className: inputCls
  }, /* @__PURE__ */React.createElement("option", {
    value: ""
  }, "Don't record a cash movement"), accounts.map(acc => /* @__PURE__ */React.createElement("option", {
    key: acc.id,
    value: acc.id
  }, acc.name, " (", numFmt(acc.balance), " ", acc.currency, ")"))), /* @__PURE__ */React.createElement("p", {
    className: "text-[10px] text-zinc-400 mt-1"
  }, "Choosing an account also adds a matching ledger entry.")), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Date"), /* @__PURE__ */React.createElement("input", {
    type: "date",
    value: repayDate,
    onChange: e => setRepayDate(e.target.value),
    className: inputCls
  })), /* @__PURE__ */React.createElement("div", {
    className: "pt-2 flex justify-end space-x-2"
  }, /* @__PURE__ */React.createElement("button", {
    type: "button",
    onClick: () => setRepaymentModalLoan(null),
    className: `px-3.5 py-2 rounded-xl text-xs font-semibold border ${darkMode ? "border-zinc-800" : "border-zinc-200"}`
  }, "Cancel"), /* @__PURE__ */React.createElement("button", {
    type: "submit",
    className: `px-3.5 py-2 ${accent.solidBtn} text-white rounded-xl text-xs font-semibold`
  }, "Confirm Repayment")))));
  }

  function LoanAddMoreModal(props) {
    const { accounts, addMoreAccountId, addMoreAmount, addMoreDate, darkMode, handleAddMoreSubmit, inputCls, loanAddMoreTarget, numFmt, setAddMoreAccountId, setAddMoreAmount, setAddMoreDate, setLoanAddMoreTarget } = props;
    return /* @__PURE__ */React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm"
  }, /* @__PURE__ */React.createElement("div", {
    className: `w-full max-w-sm rounded-3xl border p-5 shadow-2xl ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"}`
  }, /* @__PURE__ */React.createElement("div", {
    className: "flex justify-between items-center mb-3"
  }, /* @__PURE__ */React.createElement("h3", {
    className: "font-bold text-sm"
  }, loanAddMoreTarget.type === "lent" ? "Lend More to " : "Borrow More from ", loanAddMoreTarget.name), /* @__PURE__ */React.createElement("button", {
    onClick: () => setLoanAddMoreTarget(null),
    className: "p-1 rounded-lg hover:bg-zinc-800 text-zinc-400"
  }, /* @__PURE__ */React.createElement(Icons.IconClose, {
    className: "w-3.5 h-3.5"
  }))), /* @__PURE__ */React.createElement("form", {
    onSubmit: handleAddMoreSubmit,
    className: "space-y-3"
  }, /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Additional Amount (", loanAddMoreTarget.currency, ")"), /* @__PURE__ */React.createElement("input", {
    type: "number",
    inputMode: "decimal",
    step: "0.01",
    min: "0.01",
    required: true,
    autoFocus: true,
    placeholder: "0.00",
    value: addMoreAmount,
    onChange: e => setAddMoreAmount(e.target.value),
    className: `w-full px-3 py-2.5 rounded-xl text-[16px] border outline-none ${darkMode ? "bg-zinc-950 border-zinc-800 text-blue-400 font-bold" : "bg-zinc-50 border-zinc-200 text-blue-600 font-bold"}`
  })), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, loanAddMoreTarget.type === "lent" ? "Pay from Account" : "Deposit into Account", " (optional)"), /* @__PURE__ */React.createElement("select", {
    value: addMoreAccountId,
    onChange: e => setAddMoreAccountId(e.target.value),
    className: inputCls
  }, /* @__PURE__ */React.createElement("option", {
    value: ""
  }, "Don't record a cash movement"), accounts.map(acc => /* @__PURE__ */React.createElement("option", {
    key: acc.id,
    value: acc.id
  }, acc.name, " (", numFmt(acc.balance), " ", acc.currency, ")"))), /* @__PURE__ */React.createElement("p", {
    className: "text-[10px] text-zinc-400 mt-1"
  }, "Choosing an account also adds a matching ledger entry.")), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Date"), /* @__PURE__ */React.createElement("input", {
    type: "date",
    value: addMoreDate,
    onChange: e => setAddMoreDate(e.target.value),
    className: inputCls
  })), /* @__PURE__ */React.createElement("div", {
    className: "pt-2 flex justify-end space-x-2"
  }, /* @__PURE__ */React.createElement("button", {
    type: "button",
    onClick: () => setLoanAddMoreTarget(null),
    className: `px-3.5 py-2 rounded-xl text-xs font-semibold border ${darkMode ? "border-zinc-800" : "border-zinc-200"}`
  }, "Cancel"), /* @__PURE__ */React.createElement("button", {
    type: "submit",
    className: "px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
  }, "Confirm")))));
  }

  function MainFormModal(props) {
    const { accent, accounts, closeModal, darkMode, editingId, formInput, handleFormSubmit, inputCls, modalType, numFmt, setFormInput } = props;
    return /* @__PURE__ */React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm"
  }, /* @__PURE__ */React.createElement("div", {
    className: `w-full max-w-sm rounded-3xl border p-5 shadow-2xl max-h-[90vh] overflow-y-auto ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"}`
  }, /* @__PURE__ */React.createElement("div", {
    className: "flex justify-between items-center mb-3"
  }, /* @__PURE__ */React.createElement("h3", {
    className: "font-bold text-sm capitalize"
  }, editingId ? "Edit" : "Add", " ", modalType), /* @__PURE__ */React.createElement("button", {
    onClick: closeModal,
    className: "p-1 rounded-lg hover:bg-zinc-800 text-zinc-400"
  }, /* @__PURE__ */React.createElement(Icons.IconClose, {
    className: "w-3.5 h-3.5"
  }))), /* @__PURE__ */React.createElement("form", {
    onSubmit: handleFormSubmit,
    className: "space-y-3"
  }, modalType !== "transfer" && /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Title / Name"), /* @__PURE__ */React.createElement("input", {
    type: "text",
    required: true,
    placeholder: "e.g. Salary, Groceries, Gold Bar",
    value: formInput.title,
    onChange: e => setFormInput({
      ...formInput,
      title: e.target.value
    }),
    className: inputCls
  })), modalType === "account" && /* @__PURE__ */React.createElement(React.Fragment, null, /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Account Type"), /* @__PURE__ */React.createElement("select", {
    value: formInput.accType,
    onChange: e => setFormInput({
      ...formInput,
      accType: e.target.value
    }),
    className: inputCls
  }, /* @__PURE__ */React.createElement("option", {
    value: "Bank"
  }, "Bank"), /* @__PURE__ */React.createElement("option", {
    value: "Wallet"
  }, "Wallet"), /* @__PURE__ */React.createElement("option", {
    value: "Cash"
  }, "Cash"), /* @__PURE__ */React.createElement("option", {
    value: "Credit Card"
  }, "Credit Card"), /* @__PURE__ */React.createElement("option", {
    value: "Other"
  }, "Other"))), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, editingId ? "Balance" : "Initial Balance"), /* @__PURE__ */React.createElement("input", {
    type: "number",
    inputMode: "decimal",
    step: "0.01",
    required: true,
    placeholder: "0.00",
    value: formInput.amount,
    onChange: e => setFormInput({
      ...formInput,
      amount: e.target.value
    }),
    className: inputCls
  }))), modalType === "transfer" && /* @__PURE__ */React.createElement(React.Fragment, null, /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "From Account"), /* @__PURE__ */React.createElement("select", {
    value: formInput.accountId,
    onChange: e => setFormInput({
      ...formInput,
      accountId: e.target.value
    }),
    className: inputCls
  }, accounts.map(acc => /* @__PURE__ */React.createElement("option", {
    key: acc.id,
    value: acc.id
  }, acc.name, " (", numFmt(acc.balance), " ", acc.currency, ")")))), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "To Account"), /* @__PURE__ */React.createElement("select", {
    value: formInput.toAccountId,
    onChange: e => setFormInput({
      ...formInput,
      toAccountId: e.target.value
    }),
    className: inputCls
  }, accounts.map(acc => /* @__PURE__ */React.createElement("option", {
    key: acc.id,
    value: acc.id
  }, acc.name, " (", numFmt(acc.balance), " ", acc.currency, ")")))), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Amount"), /* @__PURE__ */React.createElement("input", {
    type: "number",
    inputMode: "decimal",
    step: "0.01",
    min: "0.01",
    required: true,
    placeholder: "0.00",
    value: formInput.amount,
    onChange: e => setFormInput({
      ...formInput,
      amount: e.target.value
    }),
    className: inputCls
  }))), modalType === "asset" && /* @__PURE__ */React.createElement(React.Fragment, null, /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Category"), /* @__PURE__ */React.createElement("select", {
    value: formInput.assetCategory,
    onChange: e => setFormInput({
      ...formInput,
      assetCategory: e.target.value
    }),
    className: inputCls
  }, /* @__PURE__ */React.createElement("option", {
    value: "Gold"
  }, "Gold"), /* @__PURE__ */React.createElement("option", {
    value: "Property"
  }, "Property"), /* @__PURE__ */React.createElement("option", {
    value: "Vehicle"
  }, "Vehicle"), /* @__PURE__ */React.createElement("option", {
    value: "Other"
  }, "Other"))), formInput.assetCategory === "Gold" && /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Weight (grams)"), /* @__PURE__ */React.createElement("input", {
    type: "number",
    inputMode: "decimal",
    step: "0.01",
    placeholder: "0.00",
    value: formInput.weightGrams,
    onChange: e => setFormInput({
      ...formInput,
      weightGrams: e.target.value
    }),
    className: inputCls
  })), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Purchase Price"), /* @__PURE__ */React.createElement("input", {
    type: "number",
    inputMode: "decimal",
    step: "0.01",
    min: "0",
    required: true,
    placeholder: "0.00",
    value: formInput.purchasePriceAED,
    onChange: e => setFormInput({
      ...formInput,
      purchasePriceAED: e.target.value
    }),
    className: inputCls
  })), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Current Price"), /* @__PURE__ */React.createElement("input", {
    type: "number",
    inputMode: "decimal",
    step: "0.01",
    min: "0",
    required: true,
    placeholder: "0.00",
    value: formInput.currentPriceAED,
    onChange: e => setFormInput({
      ...formInput,
      currentPriceAED: e.target.value
    }),
    className: inputCls
  }))), modalType === "loan" && /* @__PURE__ */React.createElement(React.Fragment, null, /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Loan Type"), /* @__PURE__ */React.createElement("select", {
    value: formInput.loanType,
    onChange: e => setFormInput({
      ...formInput,
      loanType: e.target.value
    }),
    className: inputCls
  }, /* @__PURE__ */React.createElement("option", {
    value: "lent"
  }, "Lent Out (they owe you)"), /* @__PURE__ */React.createElement("option", {
    value: "borrowed"
  }, "Borrowed (you owe them)"))), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Amount"), /* @__PURE__ */React.createElement("input", {
    type: "number",
    inputMode: "decimal",
    step: "0.01",
    min: "0.01",
    required: true,
    placeholder: "0.00",
    value: formInput.amount,
    onChange: e => setFormInput({
      ...formInput,
      amount: e.target.value
    }),
    className: inputCls
  })), !editingId && /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Account (optional)"), /* @__PURE__ */React.createElement("select", {
    value: formInput.accountId,
    onChange: e => setFormInput({
      ...formInput,
      accountId: e.target.value
    }),
    className: inputCls
  }, /* @__PURE__ */React.createElement("option", {
    value: ""
  }, "Don't record a cash movement"), accounts.map(acc => /* @__PURE__ */React.createElement("option", {
    key: acc.id,
    value: acc.id
  }, acc.name, " (", numFmt(acc.balance), " ", acc.currency, ")"))), /* @__PURE__ */React.createElement("p", {
    className: "text-[10px] text-zinc-400 mt-1"
  }, "Choosing an account deducts/credits it now and logs a matching ledger entry.")), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "WhatsApp Number (optional)"), /* @__PURE__ */React.createElement("input", {
    type: "text",
    placeholder: "+9715XXXXXXXX",
    value: formInput.whatsapp,
    onChange: e => setFormInput({
      ...formInput,
      whatsapp: e.target.value
    }),
    className: inputCls
  })), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Due Date (optional)"), /* @__PURE__ */React.createElement("input", {
    type: "date",
    value: formInput.dueDate,
    onChange: e => setFormInput({
      ...formInput,
      dueDate: e.target.value
    }),
    className: inputCls
  }))), ["income", "expense"].includes(modalType) && /* @__PURE__ */React.createElement(React.Fragment, null, /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Category"), /* @__PURE__ */React.createElement("input", {
    type: "text",
    required: true,
    placeholder: "e.g. Salary, Groceries, Family",
    value: formInput.category,
    onChange: e => setFormInput({
      ...formInput,
      category: e.target.value
    }),
    className: inputCls
  })), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Account"), /* @__PURE__ */React.createElement("select", {
    value: formInput.accountId,
    onChange: e => setFormInput({
      ...formInput,
      accountId: e.target.value
    }),
    className: inputCls
  }, accounts.map(acc => /* @__PURE__ */React.createElement("option", {
    key: acc.id,
    value: acc.id
  }, acc.name, " (", numFmt(acc.balance), " ", acc.currency, ")"))))), ["income", "expense"].includes(modalType) && /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Amount"), /* @__PURE__ */React.createElement("input", {
    type: "number",
    inputMode: "decimal",
    step: "0.01",
    min: "0.01",
    required: true,
    placeholder: "0.00",
    value: formInput.amount,
    onChange: e => setFormInput({
      ...formInput,
      amount: e.target.value
    }),
    className: inputCls
  })), ["income", "expense", "account", "asset"].includes(modalType) && /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Currency"), /* @__PURE__ */React.createElement("select", {
    value: formInput.currency,
    onChange: e => setFormInput({
      ...formInput,
      currency: e.target.value
    }),
    className: inputCls
  }, /* @__PURE__ */React.createElement("option", {
    value: "AED"
  }, "AED"), /* @__PURE__ */React.createElement("option", {
    value: "USD"
  }, "USD"), /* @__PURE__ */React.createElement("option", {
    value: "PKR"
  }, "PKR"))), modalType === "loan" && /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Currency"), /* @__PURE__ */React.createElement("select", {
    value: formInput.currency,
    onChange: e => setFormInput({
      ...formInput,
      currency: e.target.value
    }),
    className: inputCls
  }, /* @__PURE__ */React.createElement("option", {
    value: "AED"
  }, "AED"), /* @__PURE__ */React.createElement("option", {
    value: "USD"
  }, "USD"), /* @__PURE__ */React.createElement("option", {
    value: "PKR"
  }, "PKR"))), ["income", "expense", "transfer"].includes(modalType) && /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Date"), /* @__PURE__ */React.createElement("input", {
    type: "date",
    value: formInput.date,
    onChange: e => setFormInput({
      ...formInput,
      date: e.target.value
    }),
    className: inputCls
  })), modalType === "loan" && !editingId && /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Date"), /* @__PURE__ */React.createElement("input", {
    type: "date",
    value: formInput.date,
    onChange: e => setFormInput({
      ...formInput,
      date: e.target.value
    }),
    className: inputCls
  })), /* @__PURE__ */React.createElement("div", {
    className: "pt-2 flex justify-end space-x-2"
  }, /* @__PURE__ */React.createElement("button", {
    type: "button",
    onClick: closeModal,
    className: `px-3.5 py-2 rounded-xl text-xs font-semibold border ${darkMode ? "border-zinc-800 hover:bg-zinc-800" : "border-zinc-200 hover:bg-zinc-100"}`
  }, "Cancel"), /* @__PURE__ */React.createElement("button", {
    type: "submit",
    className: `px-3.5 py-2 ${accent.solidBtn} text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20`
  }, "Save")))));
  }

  // Native Camera Receipt Scanner Modal with AI OCR
  function ReceiptScanModal(props) {
    const { accent, darkMode, inputCls, isOpen, onClose, onApplyScannedExpense, accounts = [], defaultCurrency = "AED" } = props;
    const [imagePreview, setImagePreview] = React.useState(null);
    const [isScanning, setIsScanning] = React.useState(false);
    const [scanResult, setScanResult] = React.useState(null);
    const [errorMsg, setErrorMsg] = React.useState("");
    const fileInputRef = React.useRef(null);

    if (!isOpen) return null;

    const handleFileSelect = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      setErrorMsg("");
      setScanResult(null);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target.result;
        setImagePreview(base64Data);
        processReceipt(base64Data, file.type || "image/jpeg");
      };
      reader.readAsDataURL(file);
    };

    const processReceipt = async (base64, mimeType) => {
      setIsScanning(true);
      setErrorMsg("");
      try {
        if (window.triggerHaptic) window.triggerHaptic("medium");
        const res = await fetch("/api/ocr-receipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64, mimeType })
        });
        const data = await res.json();
        if (data && data.parsed) {
          setScanResult(data.parsed);
          if (window.triggerHaptic) window.triggerHaptic("success");
        } else {
          // Fallback parsing
          setScanResult({
            merchant: "Store Purchase",
            amount: 0,
            currency: defaultCurrency,
            date: new Date().toISOString().slice(0, 10),
            category: "Shopping",
            notes: "Scanned receipt"
          });
        }
      } catch (err) {
        console.error("Scan error:", err);
        setErrorMsg("Could not parse receipt automatically. You can fill details manually.");
        setScanResult({
          merchant: "Store Receipt",
          amount: 0,
          currency: defaultCurrency,
          date: new Date().toISOString().slice(0, 10),
          category: "Shopping",
          notes: "Scanned receipt attachment"
        });
      } finally {
        setIsScanning(false);
      }
    };

    const handleSave = () => {
      if (!scanResult) return;
      onApplyScannedExpense({
        ...scanResult,
        receiptImage: imagePreview
      });
      onClose();
    };

    return /* @__PURE__ */React.createElement("div", {
      className: "fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn"
    }, /* @__PURE__ */React.createElement("div", {
      className: `w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl border p-5 shadow-2xl space-y-4 ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"}`
    },
      /* Header */
      /* @__PURE__ */React.createElement("div", {
        className: "flex justify-between items-center pb-2 border-b border-zinc-800/40"
      }, /* @__PURE__ */React.createElement("div", {
        className: "flex items-center gap-2"
      }, /* @__PURE__ */React.createElement("div", {
        className: `w-8 h-8 rounded-xl flex items-center justify-center ${accent.activeBg10} ${accent.text}`
      }, /* @__PURE__ */React.createElement(Icons.IconCamera, { className: "w-4 h-4" })), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("h3", {
        className: "font-bold text-sm"
      }, "AI Receipt Scanner"), /* @__PURE__ */React.createElement("p", {
        className: "text-[10px] text-zinc-400"
      }, "Snap or upload a paper bill to auto-extract details"))), /* @__PURE__ */React.createElement("button", {
        onClick: onClose,
        className: "p-1 rounded-lg hover:bg-zinc-800 text-zinc-400"
      }, /* @__PURE__ */React.createElement(Icons.IconClose, { className: "w-4 h-4" }))),

      /* Hidden Camera input */
      /* @__PURE__ */React.createElement("input", {
        ref: fileInputRef,
        type: "file",
        accept: "image/*",
        capture: "environment",
        onChange: handleFileSelect,
        className: "hidden"
      }),

      /* Body */
      !imagePreview ? /* @__PURE__ */React.createElement("div", {
        className: `border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 transition-colors ${darkMode ? "border-zinc-800 hover:border-zinc-700 bg-zinc-950/40" : "border-zinc-300 hover:border-zinc-400 bg-zinc-50"}`
      }, /* @__PURE__ */React.createElement("div", {
        className: "w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shadow-inner"
      }, /* @__PURE__ */React.createElement(Icons.IconReceipt, { className: "w-7 h-7" })), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("p", {
        className: "text-xs font-semibold"
      }, "Capture or Upload Receipt"), /* @__PURE__ */React.createElement("p", {
        className: "text-[11px] text-zinc-400 mt-0.5"
      }, "Smart AI extracts Merchant, Total, Date & Category")), /* @__PURE__ */React.createElement("div", {
        className: "flex gap-2 mt-2"
      }, /* @__PURE__ */React.createElement("button", {
        type: "button",
        onClick: () => fileInputRef.current && fileInputRef.current.click(),
        className: `px-4 py-2.5 ${accent.solidBtn} text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20`
      }, /* @__PURE__ */React.createElement(Icons.IconCamera, { className: "w-4 h-4" }), " Take Photo / Upload"))) : /* @__PURE__ */React.createElement("div", {
        className: "space-y-3"
      },
        /* Viewport */
        /* @__PURE__ */React.createElement("div", {
          className: "scanner-viewport h-44 bg-black/80 rounded-2xl flex items-center justify-center border border-zinc-800 relative overflow-hidden"
        }, /* @__PURE__ */React.createElement("img", {
          src: imagePreview,
          alt: "Scanned Receipt",
          className: "max-h-full max-w-full object-contain"
        }), isScanning && /* @__PURE__ */React.createElement("div", { className: "scanner-laser" })),

        /* Scanning indicator */
        isScanning && /* @__PURE__ */React.createElement("div", {
          className: "flex items-center justify-center gap-2 py-2 text-xs font-semibold text-emerald-400 animate-pulse"
        }, /* @__PURE__ */React.createElement(Icons.IconSparkles, { className: "w-4 h-4" }), " Scanning receipt details..."),

        /* Form fields */
        scanResult && /* @__PURE__ */React.createElement("div", {
          className: `p-3.5 rounded-2xl border space-y-2.5 ${darkMode ? "bg-zinc-950/60 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`
        },
          /* Result Header */
          /* @__PURE__ */React.createElement("div", {
            className: "flex items-center justify-between text-xs font-bold text-emerald-400 border-b border-zinc-800/40 pb-1.5"
          }, /* @__PURE__ */React.createElement("span", { className: "flex items-center gap-1.5" }, /* @__PURE__ */React.createElement(Icons.IconCheck, { className: "w-3.5 h-3.5" }), " Extracted Details"), /* @__PURE__ */React.createElement("button", {
            type: "button",
            onClick: () => fileInputRef.current && fileInputRef.current.click(),
            className: "text-[10px] text-zinc-400 hover:text-zinc-200 underline"
          }, "Retake")),

          /* Merchant & Amount */
          /* @__PURE__ */React.createElement("div", { className: "grid grid-cols-2 gap-2" },
            /* @__PURE__ */React.createElement("div", null,
              /* @__PURE__ */React.createElement("label", { className: "block text-[10px] font-medium text-zinc-400 mb-0.5" }, "Merchant / Store"),
              /* @__PURE__ */React.createElement("input", {
                type: "text",
                value: scanResult.merchant || "",
                onChange: e => setScanResult({ ...scanResult, merchant: e.target.value }),
                className: inputCls
              })
            ),
            /* @__PURE__ */React.createElement("div", null,
              /* @__PURE__ */React.createElement("label", { className: "block text-[10px] font-medium text-zinc-400 mb-0.5" }, "Total Amount"),
              /* @__PURE__ */React.createElement("input", {
                type: "number",
                step: "0.01",
                value: scanResult.amount || 0,
                onChange: e => setScanResult({ ...scanResult, amount: parseFloat(e.target.value) || 0 }),
                className: inputCls
              })
            )
          ),

          /* Category & Date */
          /* @__PURE__ */React.createElement("div", { className: "grid grid-cols-2 gap-2" },
            /* @__PURE__ */React.createElement("div", null,
              /* @__PURE__ */React.createElement("label", { className: "block text-[10px] font-medium text-zinc-400 mb-0.5" }, "Category"),
              /* @__PURE__ */React.createElement("input", {
                type: "text",
                value: scanResult.category || "Shopping",
                onChange: e => setScanResult({ ...scanResult, category: e.target.value }),
                className: inputCls
              })
            ),
            /* @__PURE__ */React.createElement("div", null,
              /* @__PURE__ */React.createElement("label", { className: "block text-[10px] font-medium text-zinc-400 mb-0.5" }, "Date"),
              /* @__PURE__ */React.createElement("input", {
                type: "date",
                value: scanResult.date || new Date().toISOString().slice(0, 10),
                onChange: e => setScanResult({ ...scanResult, date: e.target.value }),
                className: inputCls
              })
            )
          )
        ),

        errorMsg && /* @__PURE__ */React.createElement("p", {
          className: "text-xs text-amber-400"
        }, errorMsg)
      ),

      /* Footer Buttons */
      /* @__PURE__ */React.createElement("div", {
        className: "flex justify-end gap-2 pt-2"
      }, /* @__PURE__ */React.createElement("button", {
        type: "button",
        onClick: onClose,
        className: `px-3.5 py-2 rounded-xl text-xs font-semibold border ${darkMode ? "border-zinc-800 hover:bg-zinc-800" : "border-zinc-200 hover:bg-zinc-100"}`
      }, "Cancel"), scanResult && /* @__PURE__ */React.createElement("button", {
        type: "button",
        onClick: handleSave,
        className: `px-4 py-2 ${accent.solidBtn} text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20`
      }, /* @__PURE__ */React.createElement(Icons.IconCheck, { className: "w-3.5 h-3.5" }), " Record Expense"))
    ));
  }

  // Native Biometrics & PIN App Lock Screen
  function SecurityLockOverlay(props) {
    const { accent, darkMode, isLocked, onUnlock, onSetPin, settings } = props;
    const [pinInput, setPinInput] = React.useState("");
    const [errorMsg, setErrorMsg] = React.useState("");
    const [shake, setShake] = React.useState(false);

    if (!isLocked) return null;

    const handleDigit = (digit) => {
      if (pinInput.length >= 4) return;
      const next = pinInput + digit;
      setPinInput(next);
      if (window.triggerHaptic) window.triggerHaptic("tap");

      if (next.length === 4) {
        verifyPin(next);
      }
    };

    const verifyPin = async (enteredPin) => {
      const hash = await Storage.hashPin(enteredPin);
      if (hash === settings.securityPinHash || enteredPin === "1234" && !settings.securityPinHash) {
        if (window.triggerHaptic) window.triggerHaptic("success");
        onUnlock();
        setPinInput("");
        setErrorMsg("");
      } else {
        if (window.triggerHaptic) window.triggerHaptic("warning");
        setErrorMsg("Incorrect passcode");
        setShake(true);
        setTimeout(() => {
          setPinInput("");
          setShake(false);
        }, 500);
      }
    };

    const handleBiometric = async () => {
      if (window.triggerHaptic) window.triggerHaptic("medium");
      const res = await Storage.promptBiometricAuth("Unlock AleemFin");
      if (res.success) {
        if (window.triggerHaptic) window.triggerHaptic("success");
        onUnlock();
      } else {
        setErrorMsg("Biometric verification failed. Please enter PIN.");
      }
    };

    return /* @__PURE__ */React.createElement("div", {
      className: `security-lock-screen ${darkMode ? "bg-zinc-950/95 text-zinc-100" : "bg-white/95 text-zinc-900"}`
    }, /* @__PURE__ */React.createElement("div", {
      className: "w-full max-w-xs flex flex-col items-center text-center space-y-6"
    }, /* @__PURE__ */React.createElement("div", {
      className: "flex flex-col items-center gap-2"
    }, /* @__PURE__ */React.createElement("div", {
      className: `w-14 h-14 rounded-2xl flex items-center justify-center ${accent.activeBg10} ${accent.text} shadow-lg shadow-emerald-500/10`
    }, /* @__PURE__ */React.createElement(Icons.IconLock, { className: "w-7 h-7" })), /* @__PURE__ */React.createElement("h2", {
      className: "text-lg font-bold tracking-tight"
    }, "AleemFin Locked"), /* @__PURE__ */React.createElement("p", {
      className: "text-xs text-zinc-400"
    }, "Enter your 4-digit security PIN or use biometrics")),

    /* PIN Dots */
    /* @__PURE__ */React.createElement("div", {
      className: `flex items-center gap-4 py-2 ${shake ? "animate-bounce" : ""}`
    }, [0, 1, 2, 3].map(i => /* @__PURE__ */React.createElement("div", {
      key: i,
      className: `pin-dot ${pinInput.length > i ? "filled text-emerald-500 border-emerald-500" : "border-zinc-500/50"}`
    }))),

    errorMsg && /* @__PURE__ */React.createElement("p", {
      className: "text-xs text-rose-500 font-semibold"
    }, errorMsg),

    /* Keypad */
    /* @__PURE__ */React.createElement("div", {
      className: "grid grid-cols-3 gap-3 w-full max-w-[240px]"
    }, [1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => /* @__PURE__ */React.createElement("button", {
      key: num,
      type: "button",
      onClick: () => handleDigit(String(num)),
      className: `pin-pad-btn ${darkMode ? "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100 border border-zinc-800/80" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200"}`
    }, num)),

    /* Bottom Row: Biometric, 0, Backspace */
    /* @__PURE__ */React.createElement("button", {
      type: "button",
      onClick: handleBiometric,
      className: `pin-pad-btn ${darkMode ? "bg-zinc-900/50 hover:bg-zinc-800 text-emerald-400 border border-zinc-800/50" : "bg-zinc-100/60 hover:bg-zinc-200 text-emerald-600 border border-zinc-200"}`
    }, /* @__PURE__ */React.createElement(Icons.IconFaceID, { className: "w-6 h-6" })),

    /* @__PURE__ */React.createElement("button", {
      type: "button",
      onClick: () => handleDigit("0"),
      className: `pin-pad-btn ${darkMode ? "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100 border border-zinc-800/80" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200"}`
    }, "0"),

    /* @__PURE__ */React.createElement("button", {
      type: "button",
      onClick: () => {
        setPinInput(pinInput.slice(0, -1));
        if (window.triggerHaptic) window.triggerHaptic("tap");
      },
      className: `pin-pad-btn ${darkMode ? "bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 border border-zinc-800/50" : "bg-zinc-100/60 hover:bg-zinc-200 text-zinc-600 border border-zinc-200"}`
    }, "\u232B"))));
  }

  // Interactive Simulated Widgets Modal (iOS/Android Native Lock Screen & Home Screen widgets)
  function WidgetsModal(props) {
    const { accent, darkMode, isOpen, onClose, netWorth, liquidNetWorth, defaultCurrency, accounts = [], loans = [] } = props;
    if (!isOpen) return null;

    const numFmt = (n) => typeof n === "number" ? n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : "0";

    return /* @__PURE__ */React.createElement("div", {
      className: "fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn"
    }, /* @__PURE__ */React.createElement("div", {
      className: `w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border p-5 shadow-2xl space-y-4 ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"}`
    }, /* @__PURE__ */React.createElement("div", {
      className: "flex justify-between items-center pb-2 border-b border-zinc-800/40"
    }, /* @__PURE__ */React.createElement("div", {
      className: "flex items-center gap-2"
    }, /* @__PURE__ */React.createElement("div", {
      className: `w-8 h-8 rounded-xl flex items-center justify-center ${accent.activeBg10} ${accent.text}`
    }, /* @__PURE__ */React.createElement(Icons.IconWidget, { className: "w-4 h-4" })), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("h3", {
      className: "font-bold text-sm"
    }, "Live Widgets & Quick Actions"), /* @__PURE__ */React.createElement("p", {
      className: "text-[10px] text-zinc-400"
    }, "Home Screen & Lock Screen widget simulations"))), /* @__PURE__ */React.createElement("button", {
      onClick: onClose,
      className: "p-1 rounded-lg hover:bg-zinc-800 text-zinc-400"
    }, /* @__PURE__ */React.createElement(Icons.IconClose, { className: "w-4 h-4" }))),

    /* Widget Grid Preview */
    /* @__PURE__ */React.createElement("div", { className: "space-y-4" },
      /* Small Widget */
      /* @__PURE__ */React.createElement("div", { className: "space-y-1.5" },
        /* @__PURE__ */React.createElement("p", { className: "text-xs font-semibold text-zinc-400" }, "Small Widget (2x2)"),
        /* @__PURE__ */React.createElement("div", {
          className: "w-44 h-44 rounded-3xl p-4 flex flex-col justify-between shadow-xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 to-zinc-950 text-white relative overflow-hidden"
        },
          /* @__PURE__ */React.createElement("div", { className: "flex justify-between items-start" },
            /* @__PURE__ */React.createElement("div", { className: "w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs" }, "AF"),
            /* @__PURE__ */React.createElement("span", { className: "text-[10px] text-zinc-400 font-medium" }, "AleemFin")
          ),
          /* @__PURE__ */React.createElement("div", { className: "space-y-0.5" },
            /* @__PURE__ */React.createElement("p", { className: "text-[10px] text-zinc-400 font-medium uppercase tracking-wider" }, "Liquid Net Worth"),
            /* @__PURE__ */React.createElement("p", { className: "text-lg font-extrabold text-emerald-400" }, `${numFmt(liquidNetWorth)} `, /* @__PURE__ */React.createElement("span", { className: "text-xs font-medium text-zinc-400" }, defaultCurrency)),
            /* @__PURE__ */React.createElement("p", { className: "text-[10px] text-zinc-400" }, `Total: ${numFmt(netWorth)} ${defaultCurrency}`)
          )
        )
      ),

      /* Medium Widget */
      /* @__PURE__ */React.createElement("div", { className: "space-y-1.5" },
        /* @__PURE__ */React.createElement("p", { className: "text-xs font-semibold text-zinc-400" }, "Medium Widget (4x2)"),
        /* @__PURE__ */React.createElement("div", {
          className: "w-full rounded-3xl p-4 flex justify-between items-center shadow-xl border border-zinc-800/80 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 text-white"
        },
          /* @__PURE__ */React.createElement("div", { className: "space-y-1" },
            /* @__PURE__ */React.createElement("div", { className: "flex items-center gap-1.5 text-xs text-zinc-400 font-medium" },
              /* @__PURE__ */React.createElement(Icons.IconWallet, { className: "w-3.5 h-3.5 text-emerald-400" }), " Total Net Worth"
            ),
            /* @__PURE__ */React.createElement("p", { className: "text-xl font-extrabold text-zinc-100" }, `${numFmt(netWorth)} `, /* @__PURE__ */React.createElement("span", { className: "text-xs text-zinc-400" }, defaultCurrency)),
            /* @__PURE__ */React.createElement("p", { className: "text-[11px] text-emerald-400 font-medium" }, `Liquid: ${numFmt(liquidNetWorth)} ${defaultCurrency}`)
          ),
          /* @__PURE__ */React.createElement("div", { className: "flex flex-col gap-1 text-right" },
            /* @__PURE__ */React.createElement("span", { className: "text-[11px] text-zinc-400" }, `${accounts.length} Accounts Active`),
            /* @__PURE__ */React.createElement("span", { className: "text-[11px] text-amber-400" }, `${loans.length} Loans Tracked`)
          )
        )
      )
    ),

    /* @__PURE__ */React.createElement("div", {
      className: "pt-2 flex justify-end"
    }, /* @__PURE__ */React.createElement("button", {
      type: "button",
      onClick: onClose,
      className: `px-4 py-2 ${accent.solidBtn} text-white rounded-xl text-xs font-semibold`
    }, "Done"))));
  }

  // Enhanced Bank SMS Parser with clipboard & OCR support
  function BankSmsModal(props) {
    const { accent, darkMode, inputCls, isOpen, onClose, onAddParsedTransaction, defaultCurrency = "AED", accounts = [] } = props;
    const [smsText, setSmsText] = React.useState("");
    const [parsedResult, setParsedResult] = React.useState(null);
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [selectedAccountId, setSelectedAccountId] = React.useState(accounts[0] ? accounts[0].id : "");

    if (!isOpen) return null;

    const handlePasteClipboard = async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          setSmsText(text);
          if (window.triggerHaptic) window.triggerHaptic("tap");
          analyzeSms(text);
        }
      } catch (err) {
        console.warn("Clipboard access denied:", err);
      }
    };

    const analyzeSms = async (textToParse) => {
      const text = textToParse || smsText;
      if (!text.trim()) return;
      setIsAnalyzing(true);
      if (window.triggerHaptic) window.triggerHaptic("medium");

      try {
        const res = await fetch("/api/parse-bank-sms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        });
        const data = await res.json();
        if (data && data.parsed) {
          setParsedResult(data.parsed);
          if (window.triggerHaptic) window.triggerHaptic("success");
        } else {
          fallbackLocalParse(text);
        }
      } catch (e) {
        fallbackLocalParse(text);
      } finally {
        setIsAnalyzing(false);
      }
    };

    const fallbackLocalParse = (text) => {
      // Regex heuristics for UAE & international banks (ADCB, ENBD, FAB, etc.)
      const amtMatch = text.match(/(?:AED|USD|PKR|Rs\.?|EUR|GBP|\$)\s*([\d,]+\.?\d*)|([\d,]+\.?\d*)\s*(?:AED|USD|PKR)/i);
      const amount = amtMatch ? parseFloat((amtMatch[1] || amtMatch[2]).replace(/,/g, "")) : 0;
      const isCredit = /credited|received|deposit|refund/i.test(text);
      const isDebit = /debited|purchase|spent|withdrawn|paid/i.test(text);
      const merchantMatch = text.match(/at\s+([^,.\n]+)|to\s+([^,.\n]+)|from\s+([^,.\n]+)/i);
      const merchant = merchantMatch ? (merchantMatch[1] || merchantMatch[2] || merchantMatch[3]).trim() : "Bank Alert";

      setParsedResult({
        bankName: /ADCB/i.test(text) ? "ADCB" : /Emirates NBD|ENBD/i.test(text) ? "Emirates NBD" : /FAB/i.test(text) ? "FAB" : /Mashreq/i.test(text) ? "Mashreq" : "Bank",
        type: isCredit ? "income" : "expense",
        amount: amount,
        currency: defaultCurrency,
        merchant: merchant,
        date: new Date().toISOString().slice(0, 10),
        category: isCredit ? "Salary" : "Shopping",
        notes: text.slice(0, 80)
      });
    };

    const handleConfirm = () => {
      if (!parsedResult) return;
      onAddParsedTransaction({
        ...parsedResult,
        accountId: selectedAccountId || (accounts[0] && accounts[0].id)
      });
      onClose();
    };

    return /* @__PURE__ */React.createElement("div", {
      className: "fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn"
    }, /* @__PURE__ */React.createElement("div", {
      className: `w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border p-5 shadow-2xl space-y-4 ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"}`
    }, /* @__PURE__ */React.createElement("div", {
      className: "flex justify-between items-center pb-2 border-b border-zinc-800/40"
    }, /* @__PURE__ */React.createElement("div", {
      className: "flex items-center gap-2"
    }, /* @__PURE__ */React.createElement("div", {
      className: `w-8 h-8 rounded-xl flex items-center justify-center ${accent.activeBg10} ${accent.text}`
    }, /* @__PURE__ */React.createElement(Icons.IconSparkles, { className: "w-4 h-4" })), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("h3", {
      className: "font-bold text-sm"
    }, "Bank SMS / Notification Parser"), /* @__PURE__ */React.createElement("p", {
      className: "text-[10px] text-zinc-400"
    }, "Instant conversion of SMS alerts into Ledger entries"))), /* @__PURE__ */React.createElement("button", {
      onClick: onClose,
      className: "p-1 rounded-lg hover:bg-zinc-800 text-zinc-400"
    }, /* @__PURE__ */React.createElement(Icons.IconClose, { className: "w-4 h-4" }))),

    /* Paste & Input Box */
    /* @__PURE__ */React.createElement("div", { className: "space-y-2" },
      /* @__PURE__ */React.createElement("div", { className: "flex justify-between items-center" },
        /* @__PURE__ */React.createElement("label", { className: "text-xs font-semibold text-zinc-400" }, "Bank SMS Text"),
        /* @__PURE__ */React.createElement("button", {
          type: "button",
          onClick: handlePasteClipboard,
          className: `text-[11px] font-semibold flex items-center gap-1 ${accent.text} hover:underline`
        }, /* @__PURE__ */React.createElement(Icons.IconClipboard, { className: "w-3 h-3" }), " Paste from Clipboard")
      ),
      /* @__PURE__ */React.createElement("textarea", {
        rows: 3,
        value: smsText,
        onChange: e => setSmsText(e.target.value),
        placeholder: "e.g. Purchase of AED 85.50 on card ending 4321 at STARBUCKS on 14/08/2026. Avail bal AED 12,450.00",
        className: `${inputCls} resize-none text-xs`
      }),
      /* @__PURE__ */React.createElement("button", {
        type: "button",
        disabled: !smsText.trim() || isAnalyzing,
        onClick: () => analyzeSms(),
        className: `w-full py-2 ${accent.solidBtn} text-white rounded-xl text-xs font-semibold disabled:opacity-50 flex items-center justify-center gap-1.5`
      }, isAnalyzing ? "Analyzing SMS..." : "Parse Transaction")
    ),

    /* Result Preview */
    parsedResult && /* @__PURE__ */React.createElement("div", {
      className: `p-3.5 rounded-2xl border space-y-2 ${darkMode ? "bg-zinc-950/60 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`
    }, /* @__PURE__ */React.createElement("p", {
      className: "text-xs font-bold text-emerald-400 flex items-center gap-1"
    }, /* @__PURE__ */React.createElement(Icons.IconCheck, { className: "w-3.5 h-3.5" }), " Recognized Transaction"),
    /* @__PURE__ */React.createElement("div", { className: "grid grid-cols-2 gap-2 text-xs" },
      /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("span", { className: "text-zinc-500" }, "Type: "), /* @__PURE__ */React.createElement("strong", { className: "capitalize text-zinc-200" }, parsedResult.type)),
      /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("span", { className: "text-zinc-500" }, "Amount: "), /* @__PURE__ */React.createElement("strong", { className: "text-emerald-400" }, `${parsedResult.amount} ${parsedResult.currency || defaultCurrency}`)),
      /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("span", { className: "text-zinc-500" }, "Merchant: "), /* @__PURE__ */React.createElement("strong", { className: "text-zinc-200" }, parsedResult.merchant)),
      /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("span", { className: "text-zinc-500" }, "Category: "), /* @__PURE__ */React.createElement("strong", { className: "text-zinc-200" }, parsedResult.category))
    ),
    /* Account selector */
    /* @__PURE__ */React.createElement("div", { className: "pt-1" },
      /* @__PURE__ */React.createElement("label", { className: "block text-[10px] font-medium text-zinc-400 mb-0.5" }, "Target Account"),
      /* @__PURE__ */React.createElement("select", {
        value: selectedAccountId,
        onChange: e => setSelectedAccountId(e.target.value),
        className: inputCls
      }, accounts.map(a => /* @__PURE__ */React.createElement("option", { key: a.id, value: a.id }, `${a.name} (${a.currency})`)))
    )),

    /* @__PURE__ */React.createElement("div", {
      className: "flex justify-end gap-2 pt-2"
    }, /* @__PURE__ */React.createElement("button", {
      type: "button",
      onClick: onClose,
      className: `px-3.5 py-2 rounded-xl text-xs font-semibold border ${darkMode ? "border-zinc-800 hover:bg-zinc-800" : "border-zinc-200 hover:bg-zinc-100"}`
    }, "Cancel"), parsedResult && /* @__PURE__ */React.createElement("button", {
      type: "button",
      onClick: handleConfirm,
      className: `px-4 py-2 ${accent.solidBtn} text-white rounded-xl text-xs font-semibold`
    }, "Add to Ledger"))));
  }

  window.Modals = window.Modals || {};
  window.Modals.MoreSheet = MoreSheet;
  window.Modals.DeleteConfirm = DeleteConfirm;
  window.Modals.RatesModal = RatesModal;
  window.Modals.RepaymentModal = RepaymentModal;
  window.Modals.LoanAddMoreModal = LoanAddMoreModal;
  window.Modals.MainFormModal = MainFormModal;
  window.Modals.ReceiptScanModal = ReceiptScanModal;
  window.Modals.SecurityLockOverlay = SecurityLockOverlay;
  window.Modals.WidgetsModal = WidgetsModal;
  window.Modals.BankSmsModal = BankSmsModal;
})();
