// AleemFin — Planning & Recurring. Stable two-sub-tab implementation.
(function () {
  function BottomSheet({ title, onClose, children, onSubmit, submitLabel, darkMode }) {
    const h = React.createElement;
    return h("div", { className: "ios-form-sheet-backdrop", role: "dialog", "aria-modal": "true", onMouseDown: e => { if (e.target === e.currentTarget) onClose(); } },
      h("form", { className: `ios-form-bottom-sheet ${darkMode ? "is-dark" : ""}`, onSubmit: e => { e.preventDefault(); onSubmit(e); } },
        h("div", { className: "ios-form-sheet-handle" }),
        h("div", { className: "ios-form-sheet-header" }, h("div", null, h("p", { className: "sheet-eyebrow" }, "ALEEMFIN"), h("h3", null, title)), h("button", { type: "button", className: "ios-form-sheet-close", onClick: onClose, "aria-label": "Close" }, h(Icons.IconClose, { className: "w-4 h-4" }))),
        h("div", { className: "ios-form-sheet-body" }, children),
        h("div", { className: "ios-form-sheet-actions" }, h("button", { type: "button", className: "ios-form-secondary", onClick: onClose }, "Cancel"), h("button", { type: "submit", className: "ios-form-primary" }, submitLabel))
      )
    );
  }

  function Planning(props) {
    const { accent, budgetForm, budgets, convertFromAED, convertToBaseCurrency, convertTxToAED, darkMode, dateFmt, deleteBudget, deleteGoal, goalForm, goals, inputCls, monthlyTransactions, numFmt, openBudgetEditor, openGoalEditor, planningEditor, saveBudget, saveGoal, setBudgetForm, setGoalForm, setPlanningEditor, settings, selectionKey, recurringItems } = props;
    const h = React.createElement;
    const [subTab, setSubTab] = React.useState("planning");
    const safeSettings = settings || {};
    const customCategories = safeSettings.customCategories || {};
    const expenseCategories = Array.isArray(customCategories.expense) && customCategories.expense.length ? customCategories.expense : ["Groceries"];
    const currencies = ["AED", "USD", "EUR", "GBP", "SAR", "INR", "PKR", "CAD", "AUD"];
    const safeBudgets = Array.isArray(budgets) ? budgets : [];
    const safeGoals = Array.isArray(goals) ? goals : [];
    const safeRecurring = Array.isArray(recurringItems) ? recurringItems : [];
    const safeTransactions = Array.isArray(monthlyTransactions) ? monthlyTransactions : [];
    const budgetSpent = budget => {
      try { return convertFromAED(safeTransactions.filter(tx => tx.type === "expense" && (tx.category || "").toLowerCase() === String(budget.category || "").toLowerCase()).reduce((sum, tx) => sum + convertTxToAED(tx), 0), budget.currency); }
      catch (_) { return 0; }
    };
    const baseCurrency = safeSettings.defaultCurrency || "AED";
    const totalBudget = safeBudgets.reduce((s, b) => s + convertToBaseCurrency(Number(b.amount || 0), b.currency || baseCurrency), 0);
    const totalSpent = safeBudgets.reduce((s, b) => s + convertToBaseCurrency(budgetSpent(b), b.currency || baseCurrency), 0);
    const goalTarget = safeGoals.reduce((s, g) => s + convertToBaseCurrency(Number(g.targetAmount || 0), g.currency || baseCurrency), 0);
    const goalSaved = safeGoals.reduce((s, g) => s + convertToBaseCurrency(Number(g.currentAmount || 0), g.currency || baseCurrency), 0);
    const budgetHealth = totalBudget ? Math.min(100, Math.round(totalSpent / totalBudget * 100)) : 0;
    const goalProgress = goalTarget ? Math.min(100, Math.round(goalSaved / goalTarget * 100)) : 0;
    const status = budgetHealth >= 100 ? "Needs attention" : budgetHealth >= 80 ? "Watch your pace" : "On track";
    const goalMonthlyNeed = goal => {
      if (!goal.targetDate || Number(goal.currentAmount || 0) >= Number(goal.targetAmount || 0)) return null;
      const months = Math.max(1, Math.ceil((new Date(`${goal.targetDate}T12:00:00`).getTime() - Date.now()) / (30.44 * 864e5)));
      return { amount: Math.max(0, Number(goal.targetAmount || 0) - Number(goal.currentAmount || 0)) / months };
    };

    const budgetSheet = planningEditor === "budget" ? h(BottomSheet, {
      title: budgetForm.id ? "Edit budget" : "New budget", onClose: () => setPlanningEditor(null), onSubmit: saveBudget,
      submitLabel: budgetForm.id ? "Save changes" : "Save budget", darkMode
    },
      h("div", { className: "grid grid-cols-2 gap-3" },
        h("label", null, h("span", null, "Category"), h("select", { value: budgetForm.category, onChange: e => setBudgetForm({ ...budgetForm, category: e.target.value }), className: inputCls }, expenseCategories.map(name => h("option", { key: name, value: name }, name)))) ,
        h("label", null, h("span", null, "Monthly limit"), h("input", { type: "number", inputMode: "decimal", min: "0.01", step: "0.01", required: true, value: budgetForm.amount, onChange: e => setBudgetForm({ ...budgetForm, amount: e.target.value }), className: inputCls })),
        h("label", null, h("span", null, "Currency"), h("select", { value: budgetForm.currency, onChange: e => setBudgetForm({ ...budgetForm, currency: e.target.value }), className: inputCls }, currencies.map(c => h("option", { key: c, value: c }, c))))
      )
    ) : null;
    const goalSheet = planningEditor === "goal" ? h(BottomSheet, {
      title: goalForm.id ? "Edit goal" : "New goal", onClose: () => setPlanningEditor(null), onSubmit: saveGoal,
      submitLabel: goalForm.id ? "Save changes" : "Save goal", darkMode
    },
      h("label", null, h("span", null, "Goal name"), h("input", { required: true, value: goalForm.name, onChange: e => setGoalForm({ ...goalForm, name: e.target.value }), placeholder: "Emergency fund, travel…", className: inputCls })),
      h("div", { className: "grid grid-cols-2 gap-3" },
        h("label", null, h("span", null, "Target"), h("input", { type: "number", inputMode: "decimal", min: "0.01", step: "0.01", required: true, value: goalForm.targetAmount, onChange: e => setGoalForm({ ...goalForm, targetAmount: e.target.value }), className: inputCls })),
        h("label", null, h("span", null, "Saved"), h("input", { type: "number", inputMode: "decimal", min: "0", step: "0.01", required: true, value: goalForm.currentAmount, onChange: e => setGoalForm({ ...goalForm, currentAmount: e.target.value }), className: inputCls })),
        h("label", null, h("span", null, "Currency"), h("select", { value: goalForm.currency, onChange: e => setGoalForm({ ...goalForm, currency: e.target.value }), className: inputCls }, currencies.map(c => h("option", { key: c, value: c }, c)))) ,
        h("label", null, h("span", null, "Target date · optional"), h("input", { type: "date", value: goalForm.targetDate, onChange: e => setGoalForm({ ...goalForm, targetDate: e.target.value }), className: inputCls }))
      )
    ) : null;

    const planningView = h(React.Fragment, null,
      h("section", { className: "planning-summary-grid" },
        h("div", { className: "planning-summary-card planning-summary-budget" }, h("div", { className: "planning-summary-top" }, h(Icons.IconTune, { className: "w-4 h-4" }), h("span", null, "Budget pace")), h("strong", null, `${budgetHealth}%`), h("small", null, status)),
        h("div", { className: "planning-summary-card planning-summary-goal" }, h("div", { className: "planning-summary-top" }, h(Icons.IconTarget, { className: "w-4 h-4" }), h("span", null, "Goals funded")), h("strong", null, `${goalProgress}%`), h("small", null, `${safeGoals.length} active goal${safeGoals.length === 1 ? "" : "s"}`))
      ),
      h("section", { className: "planning-section" },
        h("div", { className: "planning-section-head" }, h("div", null, h("p", { className: "planning-kicker" }, "THIS MONTH"), h("h3", null, "Budgets")), h("button", { type: "button", onClick: () => openBudgetEditor(), className: "planning-add-button" }, h(Icons.IconPlus, { className: "w-4 h-4" }), "Add budget")),
        safeBudgets.length === 0 && h("div", { className: "planning-empty" }, h(Icons.IconTune, { className: "w-5 h-5" }), h("strong", null, "Give your spending a lane"), h("p", null, "Set a monthly limit for any expense category.")),
        h("div", { className: "planning-list" }, safeBudgets.map(budget => {
          const spent = budgetSpent(budget), remaining = Number(budget.amount || 0) - spent;
          const progress = Number(budget.amount || 0) > 0 ? Math.min(100, Math.round(spent / Number(budget.amount) * 100)) : 0;
          const tone = progress >= 100 ? "danger" : progress >= 80 ? "warning" : "good";
          return h(window.SwipeRow, { key: budget.id, selectionKey: selectionKey("budget", budget.id), onEdit: () => openBudgetEditor(budget), onDelete: () => deleteBudget(budget) },
            h("article", { className: `planning-item ${tone}` },
              h("div", { className: "planning-item-top" }, h("div", { className: "planning-item-title" }, h("span", { className: "planning-item-icon" }, h(window.Icons.getCategoryIcon(budget.category, "expense"), { className: "w-4 h-4" })), h("div", null, h("h4", null, budget.category), h("p", null, progress >= 100 ? "Over budget" : progress >= 80 ? "Close to limit" : "On track"))), h("strong", null, `${budget.currency} ${numFmt(budget.amount)}`)),
              h("div", { className: "planning-progress" }, h("div", { style: { width: `${progress}%` } })),
              h("div", { className: "planning-item-meta" }, h("span", null, `${progress}% used`), h("span", { className: remaining < 0 ? "danger-text" : "" }, remaining < 0 ? `${budget.currency} ${numFmt(Math.abs(remaining))} over` : `${budget.currency} ${numFmt(remaining)} left`))
            )
          );
        }))
      ),
      h("section", { className: "planning-section" },
        h("div", { className: "planning-section-head" }, h("div", null, h("p", { className: "planning-kicker" }, "LONG TERM"), h("h3", null, "Savings goals")), h("button", { type: "button", onClick: () => openGoalEditor(), className: "planning-add-button" }, h(Icons.IconPlus, { className: "w-4 h-4" }), "Add goal")),
        safeGoals.length === 0 && h("div", { className: "planning-empty" }, h(Icons.IconTarget, { className: "w-5 h-5" }), h("strong", null, "Turn a goal into a plan"), h("p", null, "Track the amount, target date and pace in one place.")),
        h("div", { className: "planning-list" }, safeGoals.map(goal => {
          const target = Number(goal.targetAmount || 0), saved = Number(goal.currentAmount || 0), progress = target > 0 ? Math.min(100, Math.round(saved / target * 100)) : 0, monthly = goalMonthlyNeed(goal);
          return h(window.SwipeRow, { key: goal.id, selectionKey: selectionKey("goal", goal.id), onEdit: () => openGoalEditor(goal), onDelete: () => deleteGoal(goal) },
            h("article", { className: "planning-goal-card" },
              h("div", { className: "planning-goal-head" }, h("div", { className: "planning-goal-icon" }, h(Icons.IconTarget, { className: "w-5 h-5" })), h("div", { className: "min-w-0 flex-1" }, h("h4", null, goal.name), h("p", null, goal.targetDate ? `Target ${dateFmt(goal.targetDate)}` : "No target date")), h("strong", null, `${progress}%`)),
              h("div", { className: "planning-progress goal-progress" }, h("div", { style: { width: `${progress}%` } })),
              h("div", { className: "planning-item-meta" }, h("span", null, `${goal.currency} ${numFmt(saved)} saved`), h("span", null, `${goal.currency} ${numFmt(target)} target`)),
              h("div", { className: "planning-goal-footer" }, monthly ? h("span", null, `Need ~${goal.currency} ${numFmt(monthly.amount)}/mo`) : h("span", null, saved >= target ? "Goal reached" : "Add a target date"), h("span", { className: progress >= 100 ? "goal-reached" : "" }, progress >= 100 ? "Complete" : "In progress"))
            )
          );
        }))
      ),
      budgetSheet,
      goalSheet
    );

    const recurringView = window.Tabs && typeof window.Tabs.Recurring === "function"
      ? h(window.Tabs.Recurring, { ...props, recurringItems: safeRecurring })
      : h("div", { className: "planning-empty" }, h("strong", null, "Recurring section unavailable"), h("p", null, "Please reload AleemFin."));

    return h("div", { className: "planning-premium max-w-2xl mx-auto w-full", style: { touchAction: "pan-y", overflowX: "hidden" } },
      h("header", { className: `planning-hero ${darkMode ? "is-dark" : ""}` },
        h("div", { className: "planning-hero-copy" }, h("p", { className: "planning-eyebrow" }, "YOUR PLANNING"), h("h2", { className: "planning-title" }, "Planning & Recurring"), h("p", { className: "planning-subtitle" }, "Organise budgets, goals and predictable money in one place.")),
        h("div", { className: "planning-hero-mark" }, h(Icons.IconTarget, { className: "w-6 h-6" }))
      ),
      h("div", { className: "loan-filter-segment planning-subtabs", role: "tablist", "aria-label": "Planning sections" },
        h("button", { type: "button", role: "tab", "aria-selected": subTab === "planning", onClick: () => setSubTab("planning"), className: `loan-filter-tab ${subTab === "planning" ? "is-active" : ""}` }, "Planning"),
        h("button", { type: "button", role: "tab", "aria-selected": subTab === "recurring", onClick: () => setSubTab("recurring"), className: `loan-filter-tab ${subTab === "recurring" ? "is-active" : ""}` }, "Recurring")
      ),
      subTab === "planning" ? planningView : recurringView
    );
  }
  window.Tabs = window.Tabs || {};
  window.Tabs.Planning = Planning;
})();
