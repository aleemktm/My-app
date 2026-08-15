// tabs/planning.js — Planning tab (budgets & goals), originally renderPlanning().
(function () {
  function Planning(props) {
    const { accent, budgetForm, budgets, cardCls, convertFromAED, convertTxToAED, currentMonthLabel, darkMode, dateFmt, deleteBudget, deleteGoal, goalForm, goals, inputCls, monthlyTransactions, numFmt, openBudgetEditor, openGoalEditor, planningEditor, saveBudget, saveGoal, setBudgetForm, setGoalForm, setPlanningEditor, settings, subCardCls } = props;
    const h = React.createElement;
    const expenseCategories = settings.customCategories.expense || ["Groceries"];
    const budgetSpent = budget => convertFromAED(monthlyTransactions.filter(tx => tx.type === "expense" && (tx.category || "").toLowerCase() === budget.category.toLowerCase()).reduce((sum, tx) => sum + convertTxToAED(tx), 0), budget.currency);
    const goalMonthlyNeed = goal => {
    if (!goal.targetDate || goal.currentAmount >= goal.targetAmount) return null;
    const months = Math.max(1, Math.ceil((new Date(`${goal.targetDate}T12:00:00`).getTime() - new Date().getTime()) / (30.44 * 864e5)));
    return {
      months,
      amount: Math.max(0, goal.targetAmount - goal.currentAmount) / months
    };
  };
    return h("div", {
    className: "space-y-6 max-w-xl mx-auto w-full"
  }, h("div", {
    className: "flex items-start justify-between px-1 gap-3"
  }, h("div", null, h("h2", {
    className: `text-sm font-bold uppercase tracking-wider ${accent.textStrong}`
  }, "Planning"), h("p", {
    className: "text-xs text-zinc-400 mt-1"
  }, `Simple plans for ${currentMonthLabel}. They never change your balances.`))), h("section", {
    className: "space-y-3"
  }, h("div", {
    className: "flex items-center justify-between px-1"
  }, h("h3", {
    className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500"
  }, "Monthly budgets"), h("button", {
    onClick: () => openBudgetEditor(),
    className: `px-3 py-1.5 rounded-xl text-xs font-bold ${accent.solidBtn} text-white`
  }, "+ Add budget")), budgets.length === 0 && !planningEditor && h("div", {
    className: `p-6 text-center ${cardCls}`
  }, h("p", {
    className: "text-xs font-semibold"
  }, "Set a spending limit for a category."), h("p", {
    className: "text-[10px] text-zinc-400 mt-1"
  }, "Budgets are only a guide—transactions remain unchanged.")), planningEditor === "budget" && h("form", {
    onSubmit: saveBudget,
    className: `p-4 ${cardCls} space-y-3`
  }, h("div", {
    className: "flex justify-between items-center"
  }, h("h4", {
    className: "font-bold text-sm"
  }, budgetForm.id ? "Edit budget" : "New monthly budget"), h("button", {
    type: "button",
    onClick: () => setPlanningEditor(null),
    className: "p-1 text-zinc-400"
  }, h(Icons.IconClose, {
    className: "w-4 h-4"
  }))), h("div", {
    className: "grid grid-cols-2 gap-3"
  }, h("div", null, h("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Category"), h("select", {
    value: budgetForm.category,
    onChange: e => setBudgetForm({
      ...budgetForm,
      category: e.target.value
    }),
    className: inputCls
  }, expenseCategories.map(name => h("option", {
    key: name,
    value: name
  }, name)))), h("div", null, h("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Monthly budget"), h("input", {
    type: "number",
    inputMode: "decimal",
    min: "0.01",
    step: "0.01",
    required: true,
    value: budgetForm.amount,
    onChange: e => setBudgetForm({
      ...budgetForm,
      amount: e.target.value
    }),
    className: inputCls
  }))), h("div", {
    className: "flex justify-end gap-2 pt-1"
  }, h("button", {
    type: "button",
    onClick: () => setPlanningEditor(null),
    className: "px-3 py-2 rounded-xl text-xs font-bold text-zinc-400"
  }, "Cancel"), h("button", {
    type: "submit",
    className: `px-3 py-2 rounded-xl text-xs font-bold ${accent.solidBtn} text-white`
  }, "Save budget"))), h("div", {
    className: "space-y-2"
  }, budgets.map(budget => {
    const spent = budgetSpent(budget);
    const remaining = budget.amount - spent;
    const progress = Math.min(100, Math.round(spent / budget.amount * 100));
    const status = progress >= 100 ? "text-rose-500" : progress >= 80 ? "text-amber-500" : accent.textStrong;
    const bar = progress >= 100 ? "bg-rose-500" : progress >= 80 ? "bg-amber-500" : accent.swatch;
    return h(window.SwipeRow, {
      key: budget.id,
      onEdit: () => openBudgetEditor(budget),
      onDelete: () => deleteBudget(budget)
    }, h("div", {
      className: `swipe-content-card p-4 ${subCardCls} space-y-3`
    }, h("div", {
      className: "flex items-start justify-between gap-2"
    }, h("div", null, h("h4", {
      className: "text-sm font-bold"
    }, budget.category), h("p", {
      className: `text-[10px] font-semibold mt-0.5 ${status}`
    }, progress >= 100 ? "Over budget" : progress >= 80 ? "Almost at budget" : "On track")), h("div", {
      className: "text-xs font-bold text-zinc-400"
    }, `${budget.currency} ${numFmt(budget.amount)}`), h("div", {
      className: "flex justify-between text-xs"
    }, h("span", {
      className: "text-zinc-400"
    }, "Budget ", h("strong", {
      className: darkMode ? "text-zinc-100" : "text-zinc-800"
    }, `${budget.currency} ${numFmt(budget.amount)}`)), h("span", {
      className: status
    }, "Spent ", `${budget.currency} ${numFmt(spent)}`)), h("div", {
      className: "h-2 rounded-full overflow-hidden bg-zinc-800/20"
    }, h("div", {
      className: `${bar} h-full transition-all`,
      style: {
        width: `${progress}%`
      }
    })), h("div", {
      className: "flex justify-between text-[10px] text-zinc-400"
    }, h("span", null, `${progress}% used`), h("span", {
      className: remaining < 0 ? "text-rose-500 font-bold" : ""
    }, remaining < 0 ? `${budget.currency} ${numFmt(Math.abs(remaining))} over` : `${budget.currency} ${numFmt(remaining)} remaining`)))));
  }))), h("section", {
    className: "space-y-3"
  }, h("div", {
    className: "flex items-center justify-between px-1"
  }, h("h3", {
    className: "text-[10px] font-bold uppercase tracking-wider text-zinc-500"
  }, "Savings goals"), h("button", {
    onClick: () => openGoalEditor(),
    className: `px-3 py-1.5 rounded-xl text-xs font-bold ${accent.solidBtn} text-white`
  }, "+ Add goal")), goals.length === 0 && planningEditor !== "goal" && h("div", {
    className: `p-6 text-center ${cardCls}`
  }, h("p", {
    className: "text-xs font-semibold"
  }, "Plan for the things that matter."), h("p", {
    className: "text-[10px] text-zinc-400 mt-1"
  }, "Try an emergency fund, travel, or a major purchase.")), planningEditor === "goal" && h("form", {
    onSubmit: saveGoal,
    className: `p-4 ${cardCls} space-y-3`
  }, h("div", {
    className: "flex justify-between items-center"
  }, h("h4", {
    className: "font-bold text-sm"
  }, goalForm.id ? "Edit goal" : "New savings goal"), h("button", {
    type: "button",
    onClick: () => setPlanningEditor(null),
    className: "p-1 text-zinc-400"
  }, h(Icons.IconClose, {
    className: "w-4 h-4"
  }))), h("div", null, h("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Name"), h("input", {
    required: true,
    value: goalForm.name,
    onChange: e => setGoalForm({
      ...goalForm,
      name: e.target.value
    }),
    placeholder: "Emergency Fund, Car, Travel…",
    className: inputCls
  })), h("div", {
    className: "grid grid-cols-2 gap-3"
  }, h("div", null, h("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Target amount"), h("input", {
    type: "number",
    inputMode: "decimal",
    min: "0.01",
    step: "0.01",
    required: true,
    value: goalForm.targetAmount,
    onChange: e => setGoalForm({
      ...goalForm,
      targetAmount: e.target.value
    }),
    className: inputCls
  })), h("div", null, h("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Current amount"), h("input", {
    type: "number",
    inputMode: "decimal",
    min: "0",
    step: "0.01",
    required: true,
    value: goalForm.currentAmount,
    onChange: e => setGoalForm({
      ...goalForm,
      currentAmount: e.target.value
    }),
    className: inputCls
  }))), h("div", null, h("label", {
    className: "block text-[11px] font-medium mb-1"
  }, "Target date (optional)"), h("input", {
    type: "date",
    value: goalForm.targetDate,
    onChange: e => setGoalForm({
      ...goalForm,
      targetDate: e.target.value
    }),
    className: inputCls
  })), h("div", {
    className: "flex justify-end gap-2 pt-1"
  }, h("button", {
    type: "button",
    onClick: () => setPlanningEditor(null),
    className: "px-3 py-2 rounded-xl text-xs font-bold text-zinc-400"
  }, "Cancel"), h("button", {
    type: "submit",
    className: `px-3 py-2 rounded-xl text-xs font-bold ${accent.solidBtn} text-white`
  }, "Save goal"))), h("div", {
    className: "space-y-2"
  }, goals.map(goal => {
    const progress = Math.min(100, Math.round(goal.currentAmount / goal.targetAmount * 100));
    const monthly = goalMonthlyNeed(goal);
    return h(window.SwipeRow, {
      key: goal.id,
      onEdit: () => openGoalEditor(goal),
      onDelete: () => deleteGoal(goal)
    }, h("div", {
      className: `swipe-content-card p-4 ${subCardCls} space-y-3`
    }, h("div", {
      className: "flex items-start justify-between gap-2"
    }, h("div", null, h("h4", {
      className: "text-sm font-bold"
    }, goal.name), goal.targetDate && h("p", {
      className: "text-[10px] text-zinc-400 mt-0.5"
    }, `Target ${dateFmt(goal.targetDate)}`)), h("div", {
      className: "text-xs font-bold text-zinc-400"
    }, `${goal.currency} ${numFmt(goal.currentAmount)}`), h("div", {
      className: "flex justify-between text-xs"
    }, h("span", {
      className: "text-zinc-400"
    }, `${goal.currency} ${numFmt(goal.currentAmount)} saved`), h("span", {
      className: accent.textStrong
    }, `${goal.currency} ${numFmt(goal.targetAmount)} target`)), h("div", {
      className: "h-2 rounded-full overflow-hidden bg-zinc-800/20"
    }, h("div", {
      className: `${accent.swatch} h-full`,
      style: {
        width: `${progress}%`
      }
    })), h("div", {
      className: "flex justify-between text-[10px] text-zinc-400"
    }, h("span", null, `${progress}% complete`), monthly ? h("span", null, `~${goal.currency} ${numFmt(monthly.amount)}/month for ${monthly.months} mo`) : h("span", null, goal.currentAmount >= goal.targetAmount ? "Goal reached" : "No target date")))));
  }))));
  }

  window.Tabs = window.Tabs || {};
  window.Tabs.Planning = Planning;
})();
