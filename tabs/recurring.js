// tabs/recurring.js — Recurring items tab, originally renderRecurring().
(function () {
  function Recurring(props) {
    const { accent, accounts, advanceRecurringDate, cardCls, dateFmt, deleteRecurringItem, inputCls, numFmt, openRecurringEditor, recordRecurringOccurrence, recurringEditor, recurringForm, recurringItems, saveRecurringItem, setRecurringEditor, setRecurringForm, settings, subCardCls, updateRecurringItem } = props;
    const h = React.createElement;
    const categoryList = recurringForm.type === "income" ? settings.customCategories.income || ["Salary"] : settings.customCategories.expense || ["Groceries"];
    const upcoming = recurringItems.filter(item => item.active).slice().sort((a, b) => a.nextDate.localeCompare(b.nextDate)).slice(0, 5);
    return h("div", {
    className: "space-y-5 max-w-xl mx-auto w-full"
  }, h("div", {
    className: "flex items-start justify-between px-1 gap-3"
  }, h("div", null, h("h2", {
    className: `text-sm font-bold uppercase tracking-wider ${accent.textStrong}`
  }, "Recurring"), h("p", {
    className: "text-xs text-zinc-400 mt-1"
  }, "Scheduled items only affect balances when you record them.")), h("button", {
    onClick: () => openRecurringEditor(),
    className: `shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold ${accent.solidBtn} text-white`
  }, "+ Add")), recurringEditor && h("form", {
    onSubmit: saveRecurringItem,
    className: `p-4 ${cardCls} space-y-3`
  }, h("div", {
    className: "flex justify-between items-center"
  }, h("h3", {
    className: "font-bold text-sm"
  }, recurringForm.id ? "Edit recurring item" : "New recurring item"), h("button", {
    type: "button",
    onClick: () => setRecurringEditor(null),
    className: "p-1 text-zinc-400"
  }, h(Icons.IconClose, {
    className: "w-4 h-4"
  }))), h("div", {
    className: "grid grid-cols-2 gap-3"
  }, h("div", null, h("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Type"), h("select", {
    value: recurringForm.type,
    onChange: e => setRecurringForm({
      ...recurringForm,
      type: e.target.value,
      category: (e.target.value === "income" ? settings.customCategories.income : settings.customCategories.expense || [""])[0] || ""
    }),
    className: inputCls
  }, h("option", {
    value: "expense"
  }, "Expense"), h("option", {
    value: "income"
  }, "Income"))), h("div", null, h("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Frequency"), h("select", {
    value: recurringForm.frequency,
    onChange: e => setRecurringForm({
      ...recurringForm,
      frequency: e.target.value
    }),
    className: inputCls
  }, h("option", {
    value: "monthly"
  }, "Monthly"), h("option", {
    value: "weekly"
  }, "Weekly"), h("option", {
    value: "yearly"
  }, "Yearly")))), h("div", null, h("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Title"), h("input", {
    required: true,
    value: recurringForm.title,
    onChange: e => setRecurringForm({
      ...recurringForm,
      title: e.target.value
    }),
    placeholder: "Salary, Rent, Internet…",
    className: inputCls
  })), h("div", {
    className: "grid grid-cols-2 gap-3"
  }, h("div", null, h("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Amount"), h("input", {
    type: "number",
    inputMode: "decimal",
    min: "0.01",
    step: "0.01",
    required: true,
    value: recurringForm.amount,
    onChange: e => setRecurringForm({
      ...recurringForm,
      amount: e.target.value
    }),
    className: inputCls
  })), h("div", null, h("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Next date"), h("input", {
    type: "date",
    required: true,
    value: recurringForm.nextDate,
    onChange: e => setRecurringForm({
      ...recurringForm,
      nextDate: e.target.value
    }),
    className: inputCls
  }))), h("div", {
    className: "grid grid-cols-2 gap-3"
  }, h("div", null, h("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Account"), h("select", {
    required: true,
    value: recurringForm.accountId,
    onChange: e => setRecurringForm({
      ...recurringForm,
      accountId: e.target.value
    }),
    className: inputCls
  }, accounts.map(account => h("option", {
    key: account.id,
    value: account.id
  }, `${account.name} (${account.currency})`)))), h("div", null, h("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Currency"), h("select", {
    value: recurringForm.currency,
    onChange: e => setRecurringForm({
      ...recurringForm,
      currency: e.target.value
    }),
    className: inputCls
  }, h("option", {
    value: "AED"
  }, "AED"), h("option", {
    value: "USD"
  }, "USD"), h("option", {
    value: "PKR"
  }, "PKR")))), h("div", null, h("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Category"), h("select", {
    value: recurringForm.category,
    onChange: e => setRecurringForm({
      ...recurringForm,
      category: e.target.value
    }),
    className: inputCls
  }, categoryList.map(name => h("option", {
    key: name,
    value: name
  }, name)))), h("div", {
    className: "flex justify-end gap-2 pt-1"
  }, h("button", {
    type: "button",
    onClick: () => setRecurringEditor(null),
    className: "px-3 py-2 rounded-xl text-xs font-bold text-zinc-400"
  }, "Cancel"), h("button", {
    type: "submit",
    className: `px-3 py-2 rounded-xl text-xs font-bold ${accent.solidBtn} text-white`
  }, "Save"))), h("section", {
    className: "space-y-2"
  }, h("h3", {
    className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-1"
  }, "Upcoming"), upcoming.length === 0 ? h("div", {
    className: `p-5 text-center ${subCardCls}`
  }, h("p", {
    className: "text-xs text-zinc-400"
  }, "No active scheduled transactions.")) : h("div", {
    className: "space-y-2"
  }, upcoming.map(item => h("div", {
    key: item.id,
    className: `p-3.5 ${subCardCls} flex items-center justify-between gap-3`
  }, h("div", null, h("p", {
    className: "text-xs font-bold"
  }, item.title), h("p", {
    className: "text-[10px] text-zinc-400 mt-0.5"
  }, `${dateFmt(item.nextDate)} · ${item.frequency}`)), h("span", {
    className: `text-xs font-bold ${item.type === "income" ? "text-emerald-500" : "text-rose-500"}`
  }, `${item.type === "income" ? "+" : "-"}${item.currency} ${numFmt(item.amount)}`))))), h("section", {
    className: "space-y-2"
  }, h("h3", {
    className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-1"
  }, "Scheduled items"), recurringItems.length === 0 ? h("div", {
    className: `p-6 text-center ${cardCls}`
  }, h("p", {
    className: "text-xs font-semibold"
  }, "Add salary, rent, or subscriptions."), h("p", {
    className: "text-[10px] text-zinc-400 mt-1"
  }, "You stay in control—nothing is automatically recorded.")) : h("div", {
    className: "space-y-2"
  }, recurringItems.slice().sort((a, b) => a.nextDate.localeCompare(b.nextDate)).map(item => h(window.SwipeRow, {
    key: item.id,
    onEdit: () => openRecurringEditor(item),
    onDelete: () => deleteRecurringItem(item)
  }, h("div", {
    className: `swipe-content-card p-4 ${subCardCls} space-y-3`
  }, h("div", {
    className: "flex items-start justify-between gap-2"
  }, h("div", null, h("div", {
    className: "flex gap-2 items-center"
  }, h("span", {
    className: `px-2 py-0.5 rounded text-[9px] font-bold uppercase ${item.type === "income" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`
  }, item.type), !item.active && h("span", {
    className: "px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-zinc-500/10 text-zinc-400"
  }, "Paused")), h("h4", {
    className: "text-sm font-bold mt-1"
  }, item.title), h("p", {
    className: "text-[10px] text-zinc-400 mt-0.5"
  }, `Next ${dateFmt(item.nextDate)} · ${item.frequency}`)), h("span", {
    className: `text-sm font-bold ${item.type === "income" ? "text-emerald-500" : "text-rose-500"}`
  }, `${item.type === "income" ? "+" : "-"}${item.currency} ${numFmt(item.amount)}`)), h("div", {
    className: "flex flex-wrap gap-2 pt-1"
  }, item.active && h("button", {
    onClick: () => recordRecurringOccurrence(item),
    className: `px-3 py-2 rounded-xl text-xs font-bold ${accent.solidBtn} text-white`
  }, "Record now"), h("button", {
    onClick: () => updateRecurringItem(item, {
      active: !item.active
    }),
    className: "px-3 py-2 rounded-xl text-xs font-bold bg-zinc-500/10 text-zinc-500"
  }, item.active ? "Pause" : "Resume"), item.active && h("button", {
    onClick: () => updateRecurringItem(item, {
      nextDate: advanceRecurringDate(item.nextDate, item.frequency)
    }),
    className: "px-3 py-2 rounded-xl text-xs font-bold bg-zinc-500/10 text-zinc-500"
  }, "Skip next"))))))));
  }

  window.Tabs = window.Tabs || {};
  window.Tabs.Recurring = Recurring;
})();
