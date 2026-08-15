// tabs/settings.js — Settings tab, originally renderSettings() (SettingsSection
// and SettingsRow are bundled in since they were only ever used here).
(function () {
  function Settings(props) {
    const { DEFAULT_SETTINGS, accent, accounts, addCategory, assets, budgets, categoryManagerOpen, categoryName, categoryType, confirmDangerAction, currency, dangerAction, dangerPhrase, darkMode, exchangeRates, exportBackup, exportCSV, goals, importBackup, inputCls, loans, openDangerAction, openRatesModal, recurringItems, removeCategory, setCategoryManagerOpen, setCategoryName, setCategoryType, setCurrency, setDangerAction, setDangerPhrase, settings, subCardCls, transactions, updateSettings } = props;
    const SettingsSection = ({
    title,
    children,
    tone = "text-zinc-500"
  }) => /* @__PURE__ */React.createElement("section", {
    className: "space-y-2"
  }, /* @__PURE__ */React.createElement("h3", {
    className: `text-[10px] font-bold uppercase tracking-wider px-1 ${tone}`
  }, title), children);
    const SettingsRow = ({
    icon: Icon,
    title,
    detail,
    children,
    danger = false
  }) => /* @__PURE__ */React.createElement("div", {
    className: `p-4 ${subCardCls} flex items-center gap-3`
  }, Icon && /* @__PURE__ */React.createElement("div", {
    className: `w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${danger ? "bg-rose-500/10 text-rose-500" : `${accent.activeBg10} ${accent.textStrong}`}`
  }, /* @__PURE__ */React.createElement(Icon, {
    className: "w-4 h-4"
  })), /* @__PURE__ */React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /* @__PURE__ */React.createElement("p", {
    className: `text-xs font-bold ${danger ? "text-rose-500" : ""}`
  }, title), detail && /* @__PURE__ */React.createElement("p", {
    className: "text-[10px] text-zinc-400 mt-0.5 leading-relaxed"
  }, detail)), children && /* @__PURE__ */React.createElement("div", {
    className: "shrink-0"
  }, children));
    const h = React.createElement;
    const dataSize = new Blob([JSON.stringify({
    accounts,
    assets,
    loans,
    transactions,
    rates: exchangeRates,
    budgets,
    goals,
    recurringItems
  })]).size;
    const dataSizeLabel = dataSize < 1024 ? `${dataSize} bytes` : `${(dataSize / 1024).toFixed(1)} KB`;
    const categories = settings.customCategories || DEFAULT_SETTINGS.customCategories;
    const dashboardOptions = [{
    id: "accounts",
    label: "Accounts"
  }, {
    id: "vault",
    label: "Assets"
  }, {
    id: "loans",
    label: "Lent"
  }, {
    id: "analytics",
    label: "Month Snapshot"
  }, {
    id: "planning",
    label: "Plans"
  }, {
    id: "recurring",
    label: "Upcoming"
  }, {
    id: "gold",
    label: "24k Gold Rate"
  }, {
    id: "rates",
    label: "FX Rates"
  }, {
    id: "gold-performance",
    label: "Gold Performance"
  }, {
    id: "runway",
    label: "Cash Buffer"
  }, {
    id: "spending",
    label: "Spending Pace"
  }];
    const selectedDashboardCards = Array.isArray(settings.dashboardCards) && settings.dashboardCards.length <= 4 ? settings.dashboardCards : DEFAULT_SETTINGS.dashboardCards;
    const toggleDashboardCard = id => {
    if (selectedDashboardCards.includes(id)) updateSettings({
      dashboardCards: selectedDashboardCards.filter(cardId => cardId !== id)
    });else if (selectedDashboardCards.length < 4) updateSettings({
      dashboardCards: [...selectedDashboardCards, id]
    });
  };
    return h(React.Fragment, null, h("div", {
    className: "space-y-6 max-w-xl mx-auto w-full"
  }, h("div", {
    className: "px-1"
  }, h("h2", {
    className: `text-sm font-bold uppercase tracking-wider ${accent.textStrong}`
  }, "Settings"), h("p", {
    className: "text-xs text-zinc-400 mt-1"
  }, "Preferences and data stored on this device.")), h(SettingsSection, {
    title: "Appearance"
  }, h(SettingsRow, {
    icon: Icons.IconTune,
    title: "Theme",
    detail: "Choose how AleemFin looks on this device."
  }, h("select", {
    value: settings.theme,
    onChange: e => updateSettings({
      theme: e.target.value
    }),
    className: `${inputCls} w-auto py-2 text-xs font-bold`
  }, h("option", {
    value: "light"
  }, "Light"), h("option", {
    value: "dark"
  }, "Dark"), h("option", {
    value: "auto"
  }, "System")))), h(SettingsSection, {
    title: "Home dashboard"
  }, h("div", {
    className: `p-4 ${subCardCls} space-y-3`
  }, h("div", null, h("p", {
    className: "text-xs font-bold"
  }, "Choose four cards"), h("p", {
    className: "text-[10px] text-zinc-400 mt-0.5"
  }, `${selectedDashboardCards.length}/4 selected. Choose from your finance totals, plans, upcoming items, or live market information.`)), h("div", {
    className: "grid grid-cols-2 gap-2"
  }, dashboardOptions.map(option => {
    const selected = selectedDashboardCards.includes(option.id);
    const unavailable = !selected && selectedDashboardCards.length >= 4;
    return h("button", {
      key: option.id,
      onClick: () => toggleDashboardCard(option.id),
      disabled: unavailable,
      className: `px-3 py-2.5 rounded-xl border text-left text-xs font-bold disabled:opacity-40 ${selected ? `${accent.activeBg} ${accent.textStrong} border-current` : darkMode ? "bg-zinc-950 border-zinc-800 text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-500"}`
    }, selected ? "✓ " : "", option.label);
  })))), h(SettingsSection, {
    title: "Currency"
  }, h("div", {
    className: "space-y-2"
  }, h(SettingsRow, {
    icon: Icons.IconWallet,
    title: "Base currency",
    detail: "Used for summaries and dashboard totals."
  }, h("select", {
    value: currency,
    onChange: e => {
      setCurrency(e.target.value);
      updateSettings({
        defaultCurrency: e.target.value
      });
    },
    className: `${inputCls} w-auto py-2 text-xs font-bold`
  }, h("option", {
    value: "AED"
  }, "AED"), h("option", {
    value: "USD"
  }, "USD"), h("option", {
    value: "PKR"
  }, "PKR"))), h(SettingsRow, {
    icon: Icons.IconRates,
    title: "Exchange rates",
    detail: "Manage AED, USD, and PKR rates or refresh them from the live source."
  }, h("button", {
    onClick: openRatesModal,
    className: `px-3 py-2 rounded-xl text-xs font-bold ${accent.activeBg10} ${accent.textStrong}`
  }, "Manage")), h(SettingsRow, {
    icon: Icons.IconSync,
    title: "Sync live rates",
    detail: "Check AED, USD, and PKR rates when AleemFin opens. You can always sync manually."
  }, h("button", {
    onClick: () => updateSettings({
      liveRateSync: settings.liveRateSync === false
    }),
    className: `px-3 py-2 rounded-xl text-xs font-bold ${settings.liveRateSync === false ? "bg-zinc-500/10 text-zinc-500" : `${accent.activeBg10} ${accent.textStrong}`}`
  }, settings.liveRateSync === false ? "Off" : "On")))), h(SettingsSection, {
    title: "Data & backup"
  }, h("div", {
    className: "space-y-2"
  }, h(SettingsRow, {
    icon: Icons.IconDownload,
    title: "Backup data",
    detail: `${accounts.length} accounts · ${transactions.length} transactions · ${budgets.length} budgets · ${goals.length} goals · ${dataSizeLabel}`
  }, h("button", {
    onClick: exportBackup,
    className: `px-3 py-2 rounded-xl text-xs font-bold ${accent.solidBtn} text-white`
  }, "Backup")), h(SettingsRow, {
    icon: Icons.IconUpload,
    title: "Restore data",
    detail: "Replace this device’s data with a previous AleemFin backup."
  }, h("label", {
    className: "px-3 py-2 rounded-xl text-xs font-bold bg-zinc-500/10 text-zinc-500 cursor-pointer"
  }, "Restore", h("input", {
    type: "file",
    accept: ".json",
    onChange: importBackup,
    className: "hidden"
  }))), h(SettingsRow, {
    icon: Icons.IconCSV,
    title: "Export transactions",
    detail: "Download your ledger as a CSV file."
  }, h("button", {
    onClick: exportCSV,
    className: "px-3 py-2 rounded-xl text-xs font-bold bg-zinc-500/10 text-zinc-500"
  }, "Export")))), h(SettingsSection, {
    title: "Categories"
  }, h("div", {
    className: "space-y-2"
  }, h(SettingsRow, {
    icon: Icons.IconTag,
    title: "Manage categories",
    detail: `${(categories.income || []).length} income and ${(categories.expense || []).length} expense categories.`
  }, h("button", {
    onClick: () => setCategoryManagerOpen(open => !open),
    className: `px-3 py-2 rounded-xl text-xs font-bold ${accent.activeBg10} ${accent.textStrong}`
  }, categoryManagerOpen ? "Done" : "Manage")), categoryManagerOpen && h("div", {
    className: `p-4 ${subCardCls} space-y-3`
  }, h("div", {
    className: "flex gap-2"
  }, ["expense", "income"].map(type => h("button", {
    key: type,
    onClick: () => setCategoryType(type),
    className: `flex-1 py-2 rounded-xl text-xs font-bold capitalize ${categoryType === type ? `${accent.activeBg} ${accent.textStrong}` : "bg-zinc-500/10 text-zinc-400"}`
  }, type))), h("div", {
    className: "space-y-2"
  }, (categories[categoryType] || []).map(name => h("div", {
    key: name,
    className: `px-3 py-2 rounded-xl flex items-center justify-between ${darkMode ? "bg-zinc-950" : "bg-zinc-50"}`
  }, h("span", {
    className: "text-xs font-semibold"
  }, name), h("button", {
    onClick: () => removeCategory(categoryType, name),
    className: "p-1 rounded-lg text-zinc-400 hover:text-rose-500",
    title: `Remove ${name}`
  }, h(Icons.IconTrash, {
    className: "w-3.5 h-3.5"
  }))))), h("form", {
    onSubmit: addCategory,
    className: "flex gap-2"
  }, h("input", {
    value: categoryName,
    onChange: e => setCategoryName(e.target.value),
    placeholder: "New category",
    className: `${inputCls} flex-1`
  }), h("button", {
    type: "submit",
    className: `px-3 py-2 rounded-xl text-xs font-bold ${accent.solidBtn} text-white`
  }, "Add"))))), h(SettingsSection, {
    title: "App"
  }, h("div", {
    className: "space-y-2"
  }, h(SettingsRow, {
    icon: Icons.IconOverview,
    title: "App name",
    detail: "AleemFin"
  }), h(SettingsRow, {
    icon: Icons.IconSettings,
    title: "Version",
    detail: "1.0.0 · Personal prototype"
  }), h(SettingsRow, {
    icon: Icons.IconWallet,
    title: "Device storage",
    detail: `${dataSizeLabel} used by your finance data. Data stays on this device.`
  }))), h(SettingsSection, {
    title: "Danger zone",
    tone: "text-rose-500"
  }, h("div", {
    className: "space-y-2"
  }, h(SettingsRow, {
    icon: Icons.IconTrash,
    title: "Reset all data",
    detail: "Remove all accounts, transactions, loans and assets, while keeping your preferences.",
    danger: true
  }, h("button", {
    onClick: () => openDangerAction("reset"),
    className: "px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-500"
  }, "Reset")), h(SettingsRow, {
    icon: Icons.IconTrash,
    title: "Clear all data",
    detail: "Permanently remove all AleemFin data and preferences from this device.",
    danger: true
  }, h("button", {
    onClick: () => openDangerAction("clear"),
    className: "px-3 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white"
  }, "Clear"))))), dangerAction && h("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm"
  }, h("div", {
    className: `w-full max-w-xs rounded-3xl border p-5 shadow-2xl space-y-4 ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"}`
  }, h("div", {
    className: "w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center"
  }, h(Icons.IconTrash, {
    className: "w-5 h-5"
  })), h("div", {
    className: "space-y-1"
  }, h("h3", {
    className: "font-bold text-sm"
  }, dangerAction === "reset" ? "Reset all data?" : "Clear all data?"), h("p", {
    className: "text-xs text-zinc-400 leading-relaxed"
  }, dangerAction === "reset" ? "This will permanently remove your accounts, transactions, loans, assets and other stored AleemFin data. Your preferences will remain." : "This will permanently remove your accounts, transactions, loans, assets and all AleemFin preferences from this device.")), h("div", null, h("label", {
    className: "block text-[11px] font-medium mb-1"
  }, `Type ${dangerAction === "reset" ? "RESET" : "CLEAR"} to continue`), h("input", {
    autoFocus: true,
    value: dangerPhrase,
    onChange: e => setDangerPhrase(e.target.value.toUpperCase()),
    className: inputCls
  })), h("div", {
    className: "pt-1 flex justify-end gap-2"
  }, h("button", {
    type: "button",
    onClick: () => setDangerAction(null),
    className: `px-3.5 py-2 rounded-xl text-xs font-semibold border ${darkMode ? "border-zinc-800 hover:bg-zinc-800" : "border-zinc-200 hover:bg-zinc-100"}`
  }, "Cancel"), h("button", {
    type: "button",
    onClick: confirmDangerAction,
    disabled: dangerPhrase !== (dangerAction === "reset" ? "RESET" : "CLEAR"),
    className: "px-3.5 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold"
  }, dangerAction === "reset" ? "Reset" : "Clear")))));
  }

  window.Tabs = window.Tabs || {};
  window.Tabs.Settings = Settings;
})();
