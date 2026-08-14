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

  window.Modals = window.Modals || {};
  window.Modals.MoreSheet = MoreSheet;
  window.Modals.DeleteConfirm = DeleteConfirm;
  window.Modals.RatesModal = RatesModal;
  window.Modals.RepaymentModal = RepaymentModal;
  window.Modals.LoanAddMoreModal = LoanAddMoreModal;
  window.Modals.MainFormModal = MainFormModal;
})();
