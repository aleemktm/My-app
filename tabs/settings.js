// tabs/settings.js — AleemFin v30 Settings tab
// Phase 1 UI/UX refinement. Uses the existing app.js state/handlers.
(function () {
  function Settings(props) {
    const {
      DEFAULT_SETTINGS, accent, accounts, addCategory, assets, budgets, categoryManagerOpen,
      categoryName, categoryType, confirmDangerAction, currency, dangerAction, darkMode,
      exchangeRates, exportBackup, exportCSV, goals, importBackup, inputCls, loans,
      openDangerAction, openRatesModal, recurringItems, removeCategory, setCategoryManagerOpen,
      setCategoryName, setCategoryType, setCurrency, setDangerAction, settings, subCardCls,
      transactions, updateSettings, dashboardCardsSheetOpen, setDashboardCardsSheetOpen,
      securitySheetOpen, setSecuritySheetOpen, syncingRates, syncingGold, rateSyncMsg,
      goldSyncMsg, syncLiveExchangeRates, syncLiveGoldRate, refreshLiveRates,
      dashboardCardOptions, selectedDashboardCardsForSheet, toggleDashboardCardForSheet
    } = props;

    const h = React.createElement;

    const SettingsSection = ({ title, subtitle, tone = "text-zinc-500", children }) => h("section", {
      className: "settings-section space-y-2"
    }, h("div", { className: "px-1" },
      h("h3", { className: `text-[10px] font-bold uppercase tracking-wider ${tone}` }, title),
      subtitle && h("p", { className: "text-[10px] text-zinc-400 mt-0.5 leading-relaxed" }, subtitle)
    ), children);

    const SettingsRow = ({ icon: Icon, title, detail, children, danger = false }) => h("div", {
      className: `settings-row ${danger ? "settings-row-danger" : ""} ${subCardCls} flex items-center gap-3`
    }, Icon && h("div", {
      className: `settings-icon w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${danger ? "bg-rose-500/10 text-rose-500" : `${accent.activeBg10} ${accent.textStrong}`}`
    }, h(Icon, { className: "w-4 h-4" })), h("div", { className: "min-w-0 flex-1" },
      h("p", { className: `text-xs font-bold ${danger ? "text-rose-500" : ""}` }, title),
      detail && h("p", { className: "text-[10px] text-zinc-400 mt-0.5 leading-relaxed" }, detail)
    ), children && h("div", { className: "shrink-0" }, children));

    const IOSSwitch = ({ checked, onChange, label }) => h("button", {
      type: "button", role: "switch", "aria-checked": checked, "aria-label": label,
      onClick: onChange, className: `ios-settings-switch ${checked ? "is-on" : "is-off"}`
    }, h("span", { className: "ios-settings-switch-thumb" }));

    const ActionButton = ({ children, onClick, primary = false, danger = false, disabled = false }) => h("button", {
      type: "button", onClick, disabled,
      className: `px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.98] disabled:opacity-45 ${
        danger ? "bg-rose-600 text-white" : primary ? `${accent.solidBtn} text-white` : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-300"
      }`
    }, children);

    const dataSize = new Blob([JSON.stringify({ accounts, assets, loans, transactions, rates: exchangeRates, budgets, goals, recurringItems })]).size;
    const dataSizeLabel = dataSize < 1024 ? `${dataSize} bytes` : `${(dataSize / 1024).toFixed(1)} KB`;
    const categories = settings.customCategories || DEFAULT_SETTINGS.customCategories;

    const dashboardOptions = [
      { id: "accounts", label: "Accounts" }, { id: "vault", label: "Assets" },
      { id: "loans", label: "Lent" }, { id: "analytics", label: "Month Snapshot" },
      { id: "planning", label: "Plans" }, { id: "recurring", label: "Upcoming" },
      { id: "gold", label: "24k Gold Rate" }, { id: "rates", label: "FX Rates" },
      { id: "gold-performance", label: "Gold Performance" }, { id: "runway", label: "Cash Buffer" },
      { id: "spending", label: "Spending Pace" }
    ];
    const selectedDashboardCards = Array.isArray(settings.dashboardCards) && settings.dashboardCards.length <= 4
      ? settings.dashboardCards : DEFAULT_SETTINGS.dashboardCards;

    const accentOptions = [
      ["emerald", "Emerald"], ["blue", "Blue"], ["violet", "Violet"],
      ["amber", "Amber"], ["rose", "Rose"]
    ];
    const accentClasses = {
      emerald: "bg-emerald-500", blue: "bg-blue-500", violet: "bg-violet-500",
      amber: "bg-amber-500", rose: "bg-rose-500"
    };

    const currencyOptions = [
      ["AED", "AED · UAE Dirham"], ["USD", "USD · US Dollar"], ["EUR", "EUR · Euro"],
      ["GBP", "GBP · Pound"], ["SAR", "SAR · Saudi Riyal"], ["INR", "INR · Indian Rupee"],
      ["PKR", "PKR · Pakistani Rupee"], ["CAD", "CAD · Canadian Dollar"], ["AUD", "AUD · Australian Dollar"]
    ];

    const currentAccent = settings.accentColor || DEFAULT_SETTINGS.accentColor;

    return h(React.Fragment, null,
      h("div", { className: "settings-native" },
        h("div", { className: "settings-hero" },
          h("div", { className: "flex items-start justify-between gap-3" },
            h("div", null,
              h("h2", { className: `text-sm font-bold uppercase tracking-wider ${accent.textStrong}` }, "Settings"),
              h("p", { className: "text-xs text-zinc-400 mt-1" }, "Personalise AleemFin. Your preferences stay on this device.")
            ),
            h("div", { className: `settings-hero-badge ${accent.activeBg10} ${accent.textStrong}` }, "v30")
          )
        ),

        h(SettingsSection, { title: "Appearance", subtitle: "Keep the interface consistent with how you use your iPhone." },
          h(SettingsRow, { icon: Icons.IconTune, title: "Theme", detail: "Choose Light, Dark or follow your device." },
            h("select", { value: settings.theme, onChange: e => updateSettings({ theme: e.target.value }), className: `${inputCls} w-auto py-2 text-xs font-bold` },
              h("option", { value: "light" }, "Light"), h("option", { value: "dark" }, "Dark"), h("option", { value: "auto" }, "System")
            )
          ),
          h("div", { className: `${subCardCls} p-3.5` },
            h("div", { className: "flex items-center justify-between gap-3" },
              h("div", null, h("p", { className: "text-xs font-bold" }, "Accent colour"), h("p", { className: "text-[10px] text-zinc-400 mt-0.5" }, "Used for active controls and highlights.")),
              h("span", { className: "text-[10px] font-bold text-zinc-400" }, currentAccent.charAt(0).toUpperCase() + currentAccent.slice(1))
            ),
            h("div", { className: "flex flex-wrap gap-2 mt-3" }, accentOptions.map(([id, label]) => h("button", {
              key: id, type: "button", title: label, "aria-label": label,
              onClick: () => updateSettings({ accentColor: id }),
              className: `w-9 h-9 rounded-xl ${accentClasses[id]} border-2 transition-all active:scale-95 ${currentAccent === id ? "border-white ring-2 ring-emerald-500/40 scale-105" : "border-transparent"}`
            }, currentAccent === id ? h("span", { className: "text-white text-sm font-black" }, "✓") : null)))
          ),
          h(SettingsRow, { icon: Icons.IconTune, title: "Greeting", detail: "Show the personalised greeting on Home." },
            IOSSwitch({ checked: settings.showGreeting !== false, onChange: () => updateSettings({ showGreeting: settings.showGreeting === false }), label: "Greeting" })
          ),
          h(SettingsRow, { icon: Icons.IconTune, title: "Hero metric", detail: "Choose the main wealth figure shown on Home." },
            h("select", { value: settings.heroMetric || "liquid", onChange: e => updateSettings({ heroMetric: e.target.value }), className: `${inputCls} w-auto py-2 text-xs font-bold` },
              h("option", { value: "liquid" }, "Liquid wealth"), h("option", { value: "networth" }, "Net worth"), h("option", { value: "physical" }, "Physical assets")
            )
          )
        ),

        h(SettingsSection, { title: "Home dashboard", subtitle: "Choose the four cards you want to see first." },
          h("button", { type: "button", onClick: () => setDashboardCardsSheetOpen(true), className: `w-full text-left ${subCardCls} p-4 rounded-2xl border transition-all active:scale-[0.99]` },
            h("div", { className: "flex items-center justify-between gap-3" },
              h("div", { className: "min-w-0" }, h("p", { className: "text-xs font-bold" }, "Home cards"), h("p", { className: "text-[10px] text-zinc-400 mt-0.5" }, `${selectedDashboardCards.length}/4 selected · Tap to customise.`)),
              h("div", { className: `shrink-0 px-2.5 py-1.5 rounded-xl text-[10px] font-bold ${accent.activeBg10} ${accent.textStrong}` }, `${selectedDashboardCards.length}/4`)
            ),
            h("div", { className: "mt-3 flex flex-wrap gap-1.5" }, selectedDashboardCards.map(id => {
              const option = dashboardOptions.find(item => item.id === id);
              return option ? h("span", { key: id, className: `px-2.5 py-1 rounded-lg text-[10px] font-semibold ${darkMode ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-600"}` }, option.label) : null;
            }))
          )
        ),

        h(SettingsSection, { title: "Experience", subtitle: "Small touches that make AleemFin feel responsive." },
          h(SettingsRow, { icon: Icons.IconTune, title: "Haptic feedback", detail: "Subtle feedback for taps and important actions." }, IOSSwitch({ checked: settings.hapticsEnabled !== false, onChange: () => updateSettings({ hapticsEnabled: settings.hapticsEnabled === false }), label: "Haptic feedback" })),
          h(SettingsRow, { icon: Icons.IconTune, title: "Action sounds", detail: "Optional subtle sounds for supported actions." }, IOSSwitch({ checked: settings.soundEnabled === true, onChange: () => updateSettings({ soundEnabled: settings.soundEnabled !== true }), label: "Action sounds" })),
          h(SettingsRow, { icon: Icons.IconTune, title: "Live exchange rates", detail: "Allow AleemFin to refresh FX rates when the app requests them." }, IOSSwitch({ checked: settings.liveRateSync !== false, onChange: () => updateSettings({ liveRateSync: settings.liveRateSync === false }), label: "Live exchange rates" }))
        ),

        h(SettingsSection, { title: "Currency & formats", subtitle: "Control how money, dates and numbers are displayed." },
          h(SettingsRow, { icon: Icons.IconWallet, title: "Base currency", detail: "Used for summaries and dashboard totals." },
            h("select", { value: currency, onChange: e => { setCurrency(e.target.value); updateSettings({ defaultCurrency: e.target.value }); }, className: `${inputCls} w-auto py-2 text-xs font-bold` }, currencyOptions.map(([id, label]) => h("option", { key: id, value: id }, label)))
          ),
          h(SettingsRow, { icon: Icons.IconTune, title: "Date format", detail: "Used throughout transactions and planning." },
            h("select", { value: settings.dateFormat || "YYYY-MM-DD", onChange: e => updateSettings({ dateFormat: e.target.value }), className: `${inputCls} w-auto py-2 text-xs font-bold` },
              h("option", { value: "YYYY-MM-DD" }, "2026-08-17"), h("option", { value: "DD/MM/YYYY" }, "17/08/2026"), h("option", { value: "MM/DD/YYYY" }, "08/17/2026")
            )
          ),
          h(SettingsRow, { icon: Icons.IconTune, title: "Number format", detail: "Choose your preferred thousands separator." },
            h("select", { value: settings.numberFormat || "comma", onChange: e => updateSettings({ numberFormat: e.target.value }), className: `${inputCls} w-auto py-2 text-xs font-bold` },
              h("option", { value: "comma" }, "1,234,567"), h("option", { value: "period" }, "1.234.567")
            )
          )
        ),

        h(SettingsSection, { title: "Data & backup", subtitle: "Back up before moving to another device or clearing data." },
          h("div", { className: "space-y-2" },
            h(SettingsRow, { icon: Icons.IconDownload, title: "Backup data", detail: `${accounts.length} accounts · ${transactions.length} transactions · ${budgets.length} budgets · ${goals.length} goals · ${dataSizeLabel}` }, h(ActionButton, { onClick: exportBackup, primary: true }, "Backup")),
            h(SettingsRow, { icon: Icons.IconUpload, title: "Restore data", detail: "Replace this device’s data with a previous AleemFin backup." }, h("label", { className: "px-3 py-2 rounded-xl text-xs font-bold bg-zinc-500/10 text-zinc-500 cursor-pointer" }, "Restore", h("input", { type: "file", accept: ".json", onChange: importBackup, className: "hidden" }))),
            h(SettingsRow, { icon: Icons.IconCSV, title: "Export transactions", detail: "Download your ledger as a CSV file." }, h(ActionButton, { onClick: exportCSV }, "Export"))
          )
        ),

        h(SettingsSection, { title: "Categories", subtitle: "Keep income and expense categories relevant to you." },
          h(SettingsRow, { icon: Icons.IconTag, title: "Manage categories", detail: `${(categories.income || []).length} income and ${(categories.expense || []).length} expense categories.` }, h(ActionButton, { onClick: () => setCategoryManagerOpen(true) }, "Manage"))
        ),

        h(SettingsSection, { title: "Rates", subtitle: "Refresh reference data when you need the latest values." },
          h(SettingsRow, { icon: Icons.IconRates, title: "Exchange rates", detail: rateSyncMsg || "Update FX rates used by AleemFin." }, h(ActionButton, { onClick: syncLiveExchangeRates || refreshLiveRates, disabled: syncingRates, primary: true }, syncingRates ? "Updating…" : "Update")),
          h(SettingsRow, { icon: Icons.IconRates, title: "24k gold rate", detail: goldSyncMsg || "Update the reference gold price." }, h(ActionButton, { onClick: syncLiveGoldRate, disabled: syncingGold }, syncingGold ? "Updating…" : "Update"))
        ),

        h(SettingsSection, { title: "Security", subtitle: "Native biometric protection will be handled in the iOS phase." },
          h(SettingsRow, { icon: Icons.IconSettings, title: "Biometrics", detail: "Face ID / Touch ID is intentionally not activated by this UI update." },
            IOSSwitch({ checked: settings.biometricEnabled === true, onChange: () => updateSettings({ biometricEnabled: settings.biometricEnabled !== true }), label: "Biometrics" })
          ),
          h(SettingsRow, { icon: Icons.IconSettings, title: "PIN Lock", detail: settings.pinLockEnabled ? "Enabled · App locks when it becomes inactive." : "Protect AleemFin with a local PIN." },
            h("button", { type: "button", onClick: () => setSecuritySheetOpen(true), className: `px-3 py-2 rounded-xl text-xs font-bold ${settings.pinLockEnabled ? "bg-emerald-500/15 text-emerald-600" : "bg-zinc-500/10 text-zinc-500"}` }, settings.pinLockEnabled ? "Manage" : "Set Up")
          )
        ),

        h(SettingsSection, { title: "About AleemFin" },
          h("div", { className: "settings-plain-info" },
            h("div", null, h("span", null, "App name"), h("strong", null, "AleemFin")),
            h("div", null, h("span", null, "Version"), h("strong", null, "v30 · Personal prototype")),
            h("div", null, h("span", null, "Storage"), h("strong", null, `${dataSizeLabel} · Data stays on this device.`))
          )
        ),

        h(SettingsSection, { title: "Danger zone", tone: "text-rose-500", subtitle: "Permanent actions. Export a backup first." },
          h(SettingsRow, { icon: Icons.IconTrash, title: "Erase all data", detail: "Permanently remove accounts, transactions, loans, assets and preferences.", danger: true },
            h(ActionButton, { onClick: () => openDangerAction(), danger: true }, "Erase")
          )
        )
      ),

      dangerAction && h("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm" },
        h("div", { className: `w-full max-w-xs rounded-3xl border p-5 shadow-2xl space-y-4 ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"}` },
          h("div", { className: "w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center" }, h(Icons.IconTrash, { className: "w-5 h-5" })),
          h("div", { className: "space-y-1" }, h("h3", { className: "font-bold text-sm" }, "Erase all data?"), h("p", { className: "text-xs text-zinc-400 leading-relaxed" }, "This permanently removes your accounts, transactions, loans, assets and AleemFin preferences from this device. This cannot be undone unless you have a backup.")),
          h("div", { className: "pt-1 flex justify-end gap-2" },
            h("button", { type: "button", onClick: () => setDangerAction(null), className: `px-3.5 py-2 rounded-xl text-xs font-semibold border ${darkMode ? "border-zinc-800 hover:bg-zinc-800" : "border-zinc-200 hover:bg-zinc-100"}` }, "Cancel"),
            h("button", { type: "button", onClick: confirmDangerAction, className: "px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold" }, "Erase")
          )
        )
      )
    );
  }

  window.Tabs = window.Tabs || {};
  window.Tabs.Settings = Settings;
})();
