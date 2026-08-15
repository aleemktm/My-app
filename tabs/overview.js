// tabs/overview.js — redesigned Home / Overview dashboard.
(function () {
  const h = React.createElement;

  function Overview(props) {
    const {
      DashCard, accent, accounts, assets, cardCls, currency, currentMonthLabel, darkMode,
      exchangeRates, fmt, greeting, liveGoldAEDPerGram, momDeltaPct, monthlyExpenseAED,
      monthlyIncomeAED, monthlySavingsAED, netWorthTotal, numFmt, openAddModal, openRatesModal,
      refreshLiveRates, renderTxRow, runwayStatus, savingsRate, setActiveTab, setCurrency,
      settings, updateSettings, syncingGold, syncingRates, totalLiquidAED, totalLoansBorrowedAED,
      totalLoansLentAED, totalPhysicalAED, transactions, budgets, goals, recurringItems, emergencyRunwayMonths,
      goldChangePct, goldChangeAED, parseBankTransactionSMS, importBankTransactionFromSMS,
      smsOpen, setSmsOpen, smsText, setSmsText, smsParsed, setSmsParsed,
      openReceiptScanner, openWidgetsModal, openBankSmsModal
    } = props;

    const [pullDist, setPullDist] = React.useState(0);
    const [isPulling, setIsPulling] = React.useState(false);
    const touchStartRef = React.useRef(0);

    const handleTouchStart = (e) => {
      if (window.scrollY === 0 && e.touches[0]) {
        touchStartRef.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling || !e.touches[0]) return;
      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartRef.current;
      if (diff > 0 && window.scrollY === 0) {
        // Apply spring dampening physics
        const dampened = Math.min(65, diff * 0.45);
        setPullDist(dampened);
      }
    };

    const handleTouchEnd = () => {
      if (pullDist >= 45) {
        if (window.triggerHaptic) window.triggerHaptic("medium");
        if (window.playSound) window.playSound("refresh");
        refreshLiveRates && refreshLiveRates();
      }
      setIsPulling(false);
      setPullDist(0);
    };

    const isPositive = monthlySavingsAED >= 0;
    const heroValue = settings.heroMetric === "networth" ? netWorthTotal : totalLiquidAED;
    const heroLabel = settings.heroMetric === "networth" ? "Net worth" : "Available wealth";
    const secondaryLabel = settings.heroMetric === "networth" ? "Liquid cash" : "Net worth";
    const secondaryValue = settings.heroMetric === "networth" ? totalLiquidAED : netWorthTotal;
    const rateText = exchangeRates && exchangeRates.PKR ? (1 / exchangeRates.PKR).toFixed(2) : "—";

    const displayFmt = (val) => {
      if (settings.discreteMode) return "••••••";
      return fmt(val);
    };

    // Deterministic quote-of-the-day: changes automatically with the local calendar day.
    const quotes = [
      ["Small steps still move you forward.", ""],
      ["Do something today your future self will thank you for.", ""],
      ["Consistency beats intensity when it comes to building a good life.", ""],
      ["You do not need to have it all figured out. Just keep moving.", ""],
      ["Protect your peace, then build from there.", ""],
      ["Progress is often quiet before it becomes visible.", ""],
      ["Make today useful, not perfect.", ""],
      ["Discipline creates the freedom motivation cannot promise.", ""],
      ["A calm mind makes better decisions.", ""],
      ["Keep going. The version of you you're building is worth it.", ""],
      ["Focus on what you can control, and let the rest be background noise.", ""],
      ["Your pace is allowed to be your own.", ""],
      ["Build a life that feels good, not just one that looks good.", ""],
      ["One good decision can change the direction of an entire day.", ""],
      ["Be patient with the process and honest with yourself.", ""]
    ];
    const now = new Date();
    const quoteDayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    let quoteHash = 0;
    for (let i = 0; i < quoteDayKey.length; i++) quoteHash = (quoteHash * 31 + quoteDayKey.charCodeAt(i)) >>> 0;
    const quoteOfDay = quotes[quoteHash % quotes.length][0];

    const stat = (label, value, note, cls, onClick) => h("button", {
      type: "button", onClick, className: `home-stat ${darkMode ? "home-stat-dark" : ""}`
    }, h("span", { className: "home-stat-label" }, label), h("strong", { className: cls || "" }, value), h("span", { className: "home-stat-note" }, note));

    const action = (label, icon, tone, onClick) => h("button", {
      type: "button", onClick, className: `home-action home-action-${tone}`
    }, h("span", { className: "home-action-icon" }, h(icon, { className: "w-4 h-4" })), h("span", null, label));

    return h("div", {
      className: "home-dashboard",
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
      pullDist > 0 && h("div", {
        className: "pull-refresh-container",
        style: { height: `${pullDist}px` }
      }, h("div", {
        className: "pull-refresh-spinner",
        style: { transform: `rotate(${pullDist * 8}deg)`, opacity: Math.min(1, pullDist / 35) }
      })),
      h("section", { className: `home-hero ${darkMode ? "home-hero-dark" : ""}`, "data-hero-flash": isPositive ? "gain" : "loss" },
        h("div", { className: "home-hero-glow" }),
        h("div", { className: "home-hero-top" },
          h("div", null,
            settings.showGreeting && h("p", { className: "home-eyebrow" }, greeting + ", Aleem"),
            h("div", { className: "home-title-row" },
              h("span", { className: "home-month-pill" }, currentMonthLabel)
            ),
            h("p", { className: "home-subtitle home-quote-of-day" }, h("span", { className: "home-quote-mark", "aria-hidden": "true" }, "“"), quoteOfDay, h("span", { className: "home-quote-mark home-quote-mark-end", "aria-hidden": "true" }, "”"))
          ),
          h("div", { className: "home-currency" },
            h("button", {
              type: "button",
              onClick: () => {
                updateSettings({ discreteMode: !settings.discreteMode });
                if (window.triggerHaptic) window.triggerHaptic("action");
              },
              title: settings.discreteMode ? "Show balances" : "Hide balances (Privacy Mode)",
              className: "home-rate-button"
            }, h(settings.discreteMode ? Icons.IconEyeOff : Icons.IconEye, { className: "w-3.5 h-3.5" })),
            h("select", { value: currency, onChange: e => setCurrency(e.target.value), "aria-label": "Display currency" },
              h("option", { value: "AED" }, "AED"), h("option", { value: "USD" }, "USD"), h("option", { value: "PKR" }, "PKR")
            ),
            h("button", { type: "button", onClick: openRatesModal, title: "Edit exchange rates", className: "home-rate-button" }, h(Icons.IconRates, { className: "w-3.5 h-3.5" }), "Rates")
          )
        ),
        h("div", { className: "home-hero-main" },
          h("div", null,
            h("span", { className: "home-metric-label" }, heroLabel),
            h("div", { className: "home-metric" }, displayFmt(heroValue)),
            h("div", { className: "home-secondary-metric" }, secondaryLabel + " · " + displayFmt(secondaryValue)),
            h("div", { className: "home-health-row" },
              h("span", { className: `home-health-chip ${runwayStatus.cls || ""}` }, runwayStatus.label),
              h("span", { className: isPositive ? "home-positive" : "home-negative" }, savingsRate === null ? "Savings rate N/A" : `${savingsRate}% saved this month`)
            )
          ),
          h("div", { className: "home-hero-ring", style: { "--ring-progress": `${Math.max(0, Math.min(100, Number(savingsRate) || 0))}%` }, "aria-hidden": "true" },
            h("div", { className: "home-ring-inner" }, h("span", null, "MONTHLY"), h("strong", { className: isPositive ? "home-positive" : "home-negative" }, displayFmt(monthlySavingsAED)), h("small", null, "net flow"))
          )
        ),
        h("div", { className: "home-rate-strip" },
          h("span", null, syncingGold || syncingRates ? "Updating live market data…" : liveGoldAEDPerGram ? `24k gold AED ${liveGoldAEDPerGram.toFixed(2)}/g` : "Gold rate not synced"),
          h("span", null, `1 AED = ${rateText} PKR`),
          h("button", { type: "button", onClick: refreshLiveRates, disabled: syncingGold || syncingRates, title: "Refresh live rates" }, h(Icons.IconSync, { className: `w-3.5 h-3.5 ${syncingGold || syncingRates ? "animate-spin" : ""}` }))
        )
      ),

      h("section", { className: "home-actions-section", "data-swipe-exclude": "true" },
        h("div", { className: "home-section-heading" }, h("div", null, h("span", null, "QUICK ACTIONS"), h("h2", null)), h("button", { type: "button", onClick: () => setActiveTab("transactions"), className: `home-text-link ${accent.text}` }, "Open ledger →")),
        h("div", { className: "home-actions-grid", "data-swipe-exclude": "true", onTouchStart: e => e.stopPropagation(), onTouchEnd: e => e.stopPropagation(), onTouchMove: e => e.stopPropagation() },
          action("Income", Icons.IconPlus, "income", () => openAddModal("income", { category: "Salary" })),
          action("Expense", Icons.IconPlus, "expense", () => openAddModal("expense", { category: "Groceries" })),
          action("Scan", Icons.IconCamera, "ai", () => openReceiptScanner && openReceiptScanner()),
          action("SMS Alert", Icons.IconSparkles, "ai", () => openBankSmsModal ? openBankSmsModal() : (setSmsOpen(true), setSmsParsed(null))),
          action("Widgets", Icons.IconWidget, "transfer", () => openWidgetsModal && openWidgetsModal()),
          action("Transfer", Icons.IconTransfer, "transfer", () => openAddModal("transfer")),
          action("Loan", Icons.IconLoan, "loan", () => openAddModal("loan"))
        )
      ),

      smsOpen && ReactDOM.createPortal(h("div", { className: "home-ai-modal fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm" },
        h("div", { className: `w-full max-w-md rounded-3xl border p-5 shadow-2xl ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"}` },
          h("div", { className: "flex items-center justify-between mb-3" },
            h("div", null, h("h3", { className: "font-bold text-sm" }, "AI Spark"), h("p", { className: "text-[10px] text-zinc-400 mt-1" }, "Paste a bank SMS and AleemFin will detect the transaction.")),
            h("button", { type: "button", onClick: () => { setSmsOpen(false); setSmsParsed(null); }, className: "p-2 rounded-xl text-zinc-400" }, h(Icons.IconClose, { className: "w-4 h-4" }))
          ),
          !smsParsed && h(React.Fragment, null,
            h("textarea", { value: smsText, onChange: e => setSmsText(e.target.value), placeholder: "Paste your bank transaction SMS here…", rows: 6, className: `w-full rounded-2xl border p-3 text-sm outline-none resize-none ${darkMode ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"}` }),
            h("button", { type: "button", disabled: !smsText.trim(), onClick: () => setSmsParsed(parseBankTransactionSMS(smsText)), className: `home-ai-btn w-full mt-3 rounded-2xl text-sm font-bold text-white ${accent.solidBtn} disabled:opacity-40` }, "Analyze transaction")
          ),
          smsParsed && h("div", { className: "space-y-3" },
            h("div", { className: `rounded-2xl border p-4 ${darkMode ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"}` },
              smsParsed.type === "income" ? h("span", { className: "text-[10px] font-bold uppercase text-emerald-500" }, "Salary / Income") : smsParsed.type === "expense" ? h("span", { className: "text-[10px] font-bold uppercase text-rose-500" }, "Expense") : h("span", { className: "text-[10px] font-bold uppercase text-blue-500" }, "Transfer"),
              h("div", { className: "text-2xl font-extrabold mt-1" }, `${smsParsed.currency} ${numFmt(smsParsed.amount)}`),
              h("p", { className: "text-xs mt-1" }, smsParsed.title),
              h("p", { className: "text-[10px] text-zinc-400 mt-2" }, `${smsParsed.category} · ${smsParsed.date} · ${smsParsed.accountName}`)
            ),
            h("div", { className: "flex gap-2" },
              h("button", { type: "button", onClick: () => setSmsParsed(parseBankTransactionSMS(smsText)), className: `home-ai-btn flex-1 rounded-2xl text-sm font-bold border ${darkMode ? "border-zinc-700 text-zinc-300" : "border-zinc-200 text-zinc-600"}` }, "Re-analyze"),
              h("button", { type: "button", onClick: () => { if (importBankTransactionFromSMS(smsParsed)) { setSmsOpen(false); setSmsText(""); setSmsParsed(null); } }, className: `home-ai-btn flex-1 rounded-2xl text-sm font-bold text-white ${accent.solidBtn}` }, "Confirm & save")
            )
          ),
          smsText && !smsParsed && h("p", { className: "text-[9px] text-zinc-500 mt-2" }, "Nothing is saved until you confirm the detected transaction.")
        )
      ), document.body),

      h("section", { className: "home-stats-grid" }, (() => {
        const selected = Array.isArray(settings.dashboardCards) ? settings.dashboardCards : [];
        const cards = {
          accounts: { label: "Cash & accounts", value: displayFmt(totalLiquidAED), note: `${accounts.length} account${accounts.length === 1 ? "" : "s"}`, cls: "home-positive", tab: "accounts" },
          vault: { label: "Assets", value: displayFmt(totalPhysicalAED), note: `${assets.length} holding${assets.length === 1 ? "" : "s"}`, cls: "home-amber", tab: "vault" },
          loans: { label: "Money lent", value: displayFmt(totalLoansLentAED), note: totalLoansBorrowedAED ? `${displayFmt(totalLoansBorrowedAED)} borrowed` : "Nothing borrowed", cls: "home-violet", tab: "loans" },
          analytics: { label: "This month", value: displayFmt(monthlySavingsAED), note: momDeltaPct === null ? "No comparison yet" : `${momDeltaPct >= 0 ? "▲" : "▼"} ${Math.abs(momDeltaPct)}% vs last month`, cls: isPositive ? "home-positive" : "home-negative", tab: "analytics" },
          planning: { label: "Plans & goals", value: `${budgets.length + goals.length}`, note: `${budgets.length} budget${budgets.length === 1 ? "" : "s"} · ${goals.length} goal${goals.length === 1 ? "" : "s"}`, cls: "home-positive", tab: "planning" },
          recurring: { label: "Upcoming", value: `${recurringItems.filter(item => item.active).length}`, note: "Scheduled items", cls: "home-blue", tab: "recurring" },
          gold: { label: "24k gold rate", value: liveGoldAEDPerGram ? `AED ${liveGoldAEDPerGram.toFixed(2)}/g` : "—", note: liveGoldAEDPerGram ? "Live market benchmark" : "Tap to refresh", cls: "home-amber", tab: "vault" },
          rates: { label: "FX · AED / PKR", value: `1 AED = ${rateText} PKR`, note: `1 USD = AED ${exchangeRates.USD.toFixed(2)}`, cls: "home-blue", tab: "settings" },
          "gold-performance": { label: "Gold performance", value: goldChangePct === null ? "—" : `${goldChangePct >= 0 ? "▲ +" : "▼ "}${Math.abs(goldChangePct).toFixed(1)}%`, note: goldChangePct === null ? "Add gold assets to track it" : `${goldChangeAED >= 0 ? "Up" : "Down"} ${settings.discreteMode ? "••••••" : `AED ${numFmt(Math.abs(goldChangeAED))}`}`, cls: goldChangePct === null ? "home-muted" : goldChangePct >= 0 ? "home-positive" : "home-negative", tab: "vault" },
          runway: { label: "Cash buffer", value: `${emergencyRunwayMonths} mo`, note: "At this month’s spending pace", cls: "home-blue", tab: "analytics" },
          spending: { label: "Spending pace", value: displayFmt(monthlyExpenseAED), note: `${currentMonthLabel} expenses`, cls: "home-negative", tab: "analytics" }
        };
        return selected.slice(0, 4).map(id => {
          const c = cards[id];
          return c ? stat(c.label, c.value, c.note, c.cls, () => setActiveTab(c.tab)) : null;
        });
      })()),

      h("div", { className: "home-content-grid" },
        h("section", { className: `home-panel ${darkMode ? "home-panel-dark" : ""}` },
          h("div", { className: "home-panel-heading" }, h("div", null, h("span", null, "RECENT ACTIVITY"), h("h2", null, "Latest transactions")), h("button", { type: "button", onClick: () => setActiveTab("transactions"), className: `home-text-link ${accent.text}` }, "View all →")),
          transactions.length ? h("div", { className: "home-transaction-list" }, transactions.slice(0, 5).map(renderTxRow)) : h("div", { className: "home-empty" }, h("div", { className: "home-empty-icon" }, h(Icons.IconLedger, { className: "w-5 h-5" })), h("strong", null, "No transactions yet"), h("span", null, "Your latest income and expenses will appear here."))
        ),
        h("section", { className: `home-panel ${darkMode ? "home-panel-dark" : ""}` },
          h("div", { className: "home-panel-heading" }, h("div", null, h("span", null, "WHERE YOUR MONEY LIVES"), h("h2", null, "Accounts")), h("button", { type: "button", onClick: () => setActiveTab("accounts"), className: `home-text-link ${accent.text}` }, "Manage →")),
          h("div", { className: "home-account-list" }, accounts.slice(0, 5).map(acc => h("button", { key: acc.id, type: "button", onClick: () => setActiveTab("accounts"), className: "home-account" },
            h("span", { className: `home-account-dot ${acc.color || ""}` }),
            h("span", { className: "home-account-info" }, h("strong", null, acc.name), h("small", null, `${acc.type} · ${acc.currency}`)),
            h("span", { className: "home-account-balance" }, settings && settings.discreteMode ? "••••••" : `${acc.currency} ${numFmt(acc.balance)}`)
          )))
        )
      )
    );
  }

  window.Tabs = window.Tabs || {};
  window.Tabs.Overview = Overview;
})();
