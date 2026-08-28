// tabs/overview.js — redesigned Home / Overview dashboard.
(function () {
  const h = React.createElement;

  function OverviewHome(props) {
    const {
      DashCard, accent, accounts, assets, cardCls, currency, currentMonthLabel, darkMode,
      exchangeRates, fmt, greeting, liveGoldAEDPerGram, momDeltaPct, monthlyExpenseAED,
      monthlyIncomeAED, monthlySavingsAED, netWorthTotal, numFmt, openAddModal, openRatesModal,
      refreshLiveRates, renderTxRow, runwayStatus, savingsRate, setActiveTab, setCurrency,
      heroWealthHidden, toggleHeroWealthVisibility, settings, syncingGold, syncingRates, totalLiquidAED, totalLoansBorrowedAED,
      totalLoansLentAED, totalPhysicalAED, transactions, budgets, goals, recurringItems, emergencyRunwayMonths,
      goldChangePct, goldChangeAED, selectionToolbar, subTab, setSubTab, insightsView, onSubTabTouchStart, onSubTabTouchEnd, intelligence
    } = props;

    const isPositive = monthlySavingsAED >= 0;
    const heroValue = settings.heroMetric === "networth" ? netWorthTotal : totalLiquidAED;
    const heroLabel = settings.heroMetric === "networth" ? "Net worth" : "Available wealth";
    const secondaryLabel = settings.heroMetric === "networth" ? "Liquid cash" : "Net worth";
    const accountColor = acc => {
      const name = String(acc.name || "").toLowerCase();
      const type = String(acc.type || "").toLowerCase();
      if (name.includes("fiverr")) return "#3B82F6";
      if (name.includes("paypal")) return "#6366F1";
      if (name.includes("ubl")) return "#F59E0B";
      if (name.includes("dib")) return "#1DBF73";
      if (name.includes("cash") || type === "cash") return "#8E8E93";
      return acc.color || "#1DBF73";
    };
    const secondaryValue = settings.heroMetric === "networth" ? totalLiquidAED : netWorthTotal;
    const rateText = exchangeRates && exchangeRates.PKR ? (1 / exchangeRates.PKR).toFixed(2) : "—";

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

    const intelligenceMetrics = intelligence?.metrics || {};
    const overdueCount = Number(intelligenceMetrics.overdueLoans || 0);
    const dueSoonCount = Number(intelligenceMetrics.dueSoonLoans || 0);
    const currentExpense = Number(intelligenceMetrics.expense || monthlyExpenseAED || 0);
    const recentExpense = Number(intelligenceMetrics.avgExpense || 0);
    const savingsRateNow = intelligenceMetrics.savingsRate == null ? savingsRate : Number(intelligenceMetrics.savingsRate);
    const topObservation = Array.isArray(intelligence?.observations) ? intelligence.observations[0] : null;

    const stat = (label, value, note, cls, onClick) => h("button", {
      type: "button", onClick, className: `home-stat ${darkMode ? "home-stat-dark" : ""}`
    }, h("span", { className: "home-stat-label" }, label), h("strong", { className: cls || "" }, value), h("span", { className: "home-stat-note" }, note));

    const homeAction = (label, icon, tone, onClick) => h("button", {
      type: "button", onClick, className: `home-action home-action-${tone}`
    }, h("span", { className: "home-action-icon" }, h(icon, { className: "w-4 h-4" })), h("span", null, label));

    return h("div", { className: "home-dashboard" },
      h("section", { className: `home-hero ${((settings.heroCardTheme || "dark") === "auto" ? darkMode : settings.heroCardTheme !== "light") ? "home-hero-dark" : ""}`, "data-hero-flash": isPositive ? "gain" : "loss" },
        h("div", { className: "home-hero-glow" }),
        h("div", { className: "home-hero-top" },
          h("div", null,
            h("div", { className: "home-hero-greeting-row" },
              settings.showGreeting && h("p", { className: "home-eyebrow" }, greeting + ", Aleem"),
              h("span", { className: "home-hero-date" }, now.toLocaleDateString(undefined, { day: "numeric", month: "short" }))
            ),
            settings.heroQuoteEnabled === true && h("p", { className: "home-subtitle home-quote-of-day" }, h("span", { className: "home-quote-mark", "aria-hidden": "true" }, "“"), quoteOfDay, h("span", { className: "home-quote-mark home-quote-mark-end", "aria-hidden": "true" }, "”"))
          ),
          h("div", { className: "home-currency" },
            h("select", { value: currency, onChange: e => setCurrency(e.target.value), "aria-label": "Display currency" },
              ["AED","USD","EUR","GBP","SAR","INR","PKR","CAD","AUD"].map(code => h("option", { key: code, value: code }, code))
            ),
            h("button", { type: "button", onClick: openRatesModal, title: "Edit exchange rates", className: "home-rate-button" }, h(Icons.IconRates, { className: "w-3.5 h-3.5" }), "Rates")
          )
        ),
        h("div", { className: "home-hero-main" },
          h("div", null,
            h("span", { className: "home-metric-label" }, heroLabel),
            h("div", { className: "home-metric-amount-row" },
              h("div", { className: "home-metric" }, heroWealthHidden ? "••••••" : fmt(heroValue)),
              h("button", { type: "button", onClick: toggleHeroWealthVisibility, title: heroWealthHidden ? "Show wealth" : "Hide wealth", "aria-label": heroWealthHidden ? "Show wealth" : "Hide wealth", className: "home-hero-visibility-button" }, heroWealthHidden ? h(Icons.IconEyeOff, { className: "w-4 h-4" }) : h(Icons.IconEye, { className: "w-4 h-4" }))
            ),
            h("div", { className: "home-secondary-metric" }, secondaryLabel + " · " + (heroWealthHidden ? "••••" : fmt(secondaryValue))),
            h("div", { className: "home-health-row" },
              h("span", { className: `home-health-chip ${runwayStatus.cls || ""}` }, runwayStatus.label),
              h("span", { className: isPositive ? "home-positive" : "home-negative" }, savingsRate === null ? "Savings rate N/A" : `${savingsRate}% saved this month`)
            )
          ),
        ),
        h("div", { className: "home-rate-strip" },
          h("span", null, syncingGold || syncingRates ? "Updating live market data…" : liveGoldAEDPerGram ? `24k gold AED ${liveGoldAEDPerGram.toFixed(2)}/g` : "Gold rate not synced"),
          h("span", null, `1 AED = ${rateText} PKR`),
          h("div", { className: "home-rate-actions" },
            h("button", { type: "button", onClick: refreshLiveRates, disabled: syncingGold || syncingRates, title: "Refresh live rates", className: "home-rate-icon-button" }, h(Icons.IconSync, { className: `w-3.5 h-3.5 ${syncingGold || syncingRates ? "animate-spin" : ""}` }))
          )
        )
      ),


      (() => {
        const pulseDismissKey=`aleemfin_pulse_dismissed_v120_${new Date().toISOString().slice(0,10)}`;
        let pulseDismissed=false;
        try{pulseDismissed=localStorage.getItem(pulseDismissKey)==="1";}catch(_){ }
        const cardRef=React.useRef(null);
        const drag=React.useRef(null);
        const suppressClick=React.useRef(false);
        const [dismissed,setDismissed]=React.useState(false);
        if(pulseDismissed||dismissed)return h(React.Fragment,null);

        let chosen=null, tone="neutral", icon=Icons.IconSparkles, eyebrow="ALEEMFIN PULSE";
        try {
          const observations=Array.isArray(intelligence?.observations)?intelligence.observations.filter(Boolean):[];
          const serious=observations.find(o=>o.severity==="serious");
          const warning=observations.find(o=>o.severity==="warning");
          const candidates=observations.filter(o=>o.severity!=="neutral"&&o.severity!=="serious"&&o.severity!=="warning");
          const dayKey=`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
          let hash=0; for(let i=0;i<dayKey.length;i++)hash=(hash*31+dayKey.charCodeAt(i))>>>0;
          chosen=serious||warning||(candidates.length?candidates[hash%candidates.length]:observations[0])||null;
          const severity=chosen?.severity||"neutral";
          tone=severity==="serious"?"serious":severity==="warning"?"warning":severity==="positive"?"positive":"neutral";
          icon=tone==="serious"?Icons.IconBell:tone==="warning"?Icons.IconInfo:Icons.IconSparkles;
          eyebrow=tone==="serious"?"NEEDS YOUR ATTENTION":tone==="warning"?"WORTH NOTICING":tone==="positive"?"GOOD NEWS":"ALEEMFIN PULSE";
        } catch (_) {}

        const rubberBand=(dx,limit)=>{
          const sign=dx<0?-1:1;
          const distance=Math.abs(dx);
          const resistance=1-Math.exp(-distance/(limit*1.05));
          return sign*limit*resistance;
        };
        const renderDrag=(node,x,scale=1,opacity=1,transition="none")=>{
          if(!node)return;
          node.style.transition=transition;
          node.style.transform=`translate3d(${x}px,0,0) scale(${scale})`;
          node.style.opacity=String(opacity);
        };
        const begin=e=>{
          if(e.pointerType==="mouse"&&e.button!==0)return;
          const node=e.currentTarget;
          drag.current={id:e.pointerId,startX:e.clientX,startY:e.clientY,dx:0,dy:0,moved:false,locked:false};
          node.style.animation="none";
          node.style.transition="none";
          try{node.setPointerCapture(e.pointerId);}catch(_){ }
        };
        const move=e=>{
          const d=drag.current;
          if(!d||d.id!==e.pointerId)return;
          const dx=e.clientX-d.startX;
          const dy=e.clientY-d.startY;
          if(!d.locked){
            if(Math.abs(dx)<6&&Math.abs(dy)<6)return;
            if(Math.abs(dy)>Math.abs(dx)*1.18){d.locked=true;return;}
            d.moved=true;
          }
          if(d.locked)return;
          d.dx=dx; d.dy=dy;
          e.preventDefault();
          const resistanceLimit=dx<0?150:70;
          const x=dx<0?rubberBand(dx,resistanceLimit):dx*0.28;
          const scale=Math.max(.94,1-Math.min(Math.abs(x),150)/3600);
          const opacity=Math.max(.55,1-Math.abs(x)/700);
          renderDrag(e.currentTarget,x,scale,opacity);
        };
        const finish=e=>{
          const d=drag.current;
          if(!d||d.id!==e.pointerId)return;
          drag.current=null;
          const node=e.currentTarget;
          try{node.releasePointerCapture(e.pointerId);}catch(_){ }
          if(d.locked){
            renderDrag(node,0,1,1,"transform .42s cubic-bezier(.22,1,.36,1),opacity .28s ease");
            return;
          }
          const commit=d.moved&&d.dx<-72&&Math.abs(d.dx)>Math.abs(d.dy)*1.12;
          if(commit){
            suppressClick.current=true;
            try{localStorage.setItem(pulseDismissKey,"1");}catch(_){ }
            const fling=-Math.max(window.innerWidth*1.08,520);
            renderDrag(node,fling,.94,0,"transform .46s cubic-bezier(.22,1,.36,1),opacity .28s ease");
            window.setTimeout(()=>setDismissed(true),300);
            window.setTimeout(()=>{suppressClick.current=false;},500);
          }else if(d.moved){
            suppressClick.current=true;
            renderDrag(node,0,1,1,"transform .5s cubic-bezier(.34,1.56,.64,1),opacity .3s ease");
            window.setTimeout(()=>{suppressClick.current=false;},380);
          }
        };
        const cancel=e=>{
          const node=e.currentTarget;
          drag.current=null;
          renderDrag(node,0,1,1,"transform .5s cubic-bezier(.34,1.56,.64,1),opacity .3s ease");
        };
        const click=e=>{
          if(suppressClick.current)return;
          const meta=chosen?.meta&&typeof chosen.meta==="object"?chosen.meta:{};
          if(meta.action==="open-loan"&&meta.loanId){
            setActiveTab("loans");
            window.setTimeout(()=>{
              const target=document.querySelector(`[data-loan-id="${String(meta.loanId).replace(/[^a-zA-Z0-9_-]/g,"")}"]`);
              if(target)target.scrollIntoView({behavior:"smooth",block:"center"});
            },220);
          }else if(meta.action==="open-analytics")setActiveTab("analytics");
          else if(meta.action==="open-planning")setActiveTab("planning");
          else if(meta.action==="open-accounts")setActiveTab("accounts");
          else if(meta.action==="open-loans")setActiveTab("loans");
        };
        return h("button",{
          ref:cardRef,type:"button",className:`home-pulse home-pulse-${tone} ${darkMode?"home-pulse-dark":""}`,
          role:"status",onClick:click,onPointerDown:begin,onPointerMove:move,onPointerUp:finish,onPointerCancel:cancel,
          style:{touchAction:"none",WebkitUserSelect:"none",userSelect:"none"},
          "aria-label":chosen?`${chosen.title}. Tap to open related area. Swipe left to dismiss for today.`:"AleemFin Pulse. Swipe left to dismiss for today."
        },
          h("div",{className:"home-pulse-icon","aria-hidden":"true"},h(icon,{className:"w-5 h-5"})),
          h("div",{className:"home-pulse-copy"},h("span",{className:"home-pulse-eyebrow"},eyebrow),h("strong",null,chosen?.title||"Everything looks steady"),h("p",null,chosen?.detail||"No unusual financial pattern needs your attention right now.")),
          h("span",{className:"home-pulse-dot","aria-hidden":"true"})
        );
      })(),

      h("section", { className: "home-actions-section" },
        h("div", { className: "home-actions-grid", onTouchStart: e => e.stopPropagation(), onTouchEnd: e => e.stopPropagation(), onTouchMove: e => e.stopPropagation() },
          homeAction("Income", Icons.IconPlus, "income", () => openAddModal("income", { category: "Salary" })),
          homeAction("Expense", Icons.IconPlus, "expense", () => openAddModal("expense", { category: "Groceries" })),
          homeAction("Transfer", Icons.IconTransfer, "transfer", () => openAddModal("transfer")),
          homeAction("Loan", Icons.IconLoan, "loan", () => openAddModal("loan"))
        )
      ),


            h("section", { className: "home-stats-grid" }, (() => {
        const cardCount = settings.dashboardCardCount === 2 ? 2 : 4;
        const selected = (Array.isArray(settings.dashboardCards) ? settings.dashboardCards : []).slice(0, cardCount);
        const cards = {
          accounts: { label: "Cash & accounts", value: fmt(totalLiquidAED), note: `${accounts.length} account${accounts.length === 1 ? "" : "s"}`, cls: "home-positive", tab: "accounts" },
          vault: { label: "Assets", value: fmt(totalPhysicalAED), note: `${assets.length} holding${assets.length === 1 ? "" : "s"}`, cls: "home-amber", tab: "vault" },
          loans: { label: "Money lent", value: fmt(totalLoansLentAED), note: totalLoansBorrowedAED ? `${fmt(totalLoansBorrowedAED)} borrowed` : "Nothing borrowed", cls: "home-violet", tab: "loans" },
          analytics: { label: "This month", value: fmt(monthlySavingsAED), note: momDeltaPct === null ? "No comparison yet" : `${momDeltaPct >= 0 ? "▲" : "▼"} ${Math.abs(momDeltaPct)}% vs last month`, cls: isPositive ? "home-positive" : "home-negative", tab: "analytics" },
          planning: { label: "Plans & goals", value: `${budgets.length + goals.length}`, note: `${budgets.length} budget${budgets.length === 1 ? "" : "s"} · ${goals.length} goal${goals.length === 1 ? "" : "s"}`, cls: "home-positive", tab: "planning" },
          recurring: { label: "Upcoming", value: `${recurringItems.filter(item => item.active).length}`, note: "Scheduled items", cls: "home-blue", tab: "recurring" },
          gold: { label: "24k gold rate", value: liveGoldAEDPerGram ? `AED ${liveGoldAEDPerGram.toFixed(2)}/g` : "—", note: liveGoldAEDPerGram ? "Live market benchmark" : "Tap to refresh", cls: "home-amber", tab: "vault" },
          rates: { label: "FX · AED / PKR", value: `1 AED = ${rateText} PKR`, note: `1 USD = AED ${exchangeRates.USD.toFixed(2)}`, cls: "home-blue", tab: "settings" },
          "gold-performance": { label: "Gold performance", value: goldChangePct === null ? "—" : `${goldChangePct >= 0 ? "▲ +" : "▼ "}${Math.abs(goldChangePct).toFixed(1)}%`, note: goldChangePct === null ? "Add gold assets to track it" : `${goldChangeAED >= 0 ? "Up" : "Down"} AED ${numFmt(Math.abs(goldChangeAED))}`, cls: goldChangePct === null ? "home-muted" : goldChangePct >= 0 ? "home-positive" : "home-negative", tab: "vault" },
          runway: { label: "Cash buffer", value: `${emergencyRunwayMonths} mo`, note: "At this month’s spending pace", cls: "home-blue", tab: "analytics" },
          spending: { label: "Spending pace", value: fmt(monthlyExpenseAED), note: `${currentMonthLabel} expenses`, cls: "home-negative", tab: "analytics" }
        };
        return selected.slice(0, 4).map(id => {
          const c = cards[id];
          return c ? stat(c.label, c.value, c.note, c.cls, () => setActiveTab(c.tab)) : null;
        });
      })()),

      h("div", {
        className: "loan-filter-segment is-two home-subtabs home-subtabs-under-hero",
        role: "tablist",
        "aria-label": "Home sections",
        onTouchStart: onSubTabTouchStart,
        onTouchEnd: onSubTabTouchEnd
      },
        h("button", {
          type: "button", role: "tab", "aria-selected": subTab === "recent",
          onClick: () => setSubTab("recent"),
          onKeyDown: e => { if (e.key === "ArrowRight") setSubTab("insights"); },
          className: `loan-filter-tab ${subTab === "recent" ? "is-active" : ""}`
        }, "Recent Activity"),
        h("button", {
          type: "button", role: "tab", "aria-selected": subTab === "insights",
          onClick: () => setSubTab("insights"),
          onKeyDown: e => { if (e.key === "ArrowLeft") setSubTab("recent"); },
          className: `loan-filter-tab ${subTab === "insights" ? "is-active" : ""}`
        }, "Insights")
      ),
      subTab === "recent" ? h("div", { className: "home-subtab-content" },
        h("section", { className: `home-panel ${darkMode ? "home-panel-dark" : ""}` },
          selectionToolbar && h("div", { className: "home-selection-toolbar-wrap" }, selectionToolbar),
          h("div", { className: "home-panel-heading" }, h("div", null, h("span", null, "RECENT ACTIVITY"), h("h2", null, "Latest transactions")), h("button", { type: "button", onClick: () => setActiveTab("transactions"), className: `home-text-link ${accent.text}` }, "View all →")),
          transactions.length ? h("div", { className: "home-transaction-list" }, transactions.slice(0, 5).map(renderTxRow)) : h("div", { className: "home-empty" }, h("div", { className: "home-empty-icon" }, h(Icons.IconLedger, { className: "w-5 h-5" })), h("strong", null, "No transactions yet"), h("span", null, "Your latest income and expenses will appear here."))
        ),
        h("section", { className: `home-panel ${darkMode ? "home-panel-dark" : ""}` },
          h("div", { className: "home-panel-heading" }, h("div", null, h("span", null, "WHERE YOUR MONEY LIVES"), h("h2", null, "Accounts")), h("button", { type: "button", onClick: () => setActiveTab("accounts"), className: `home-text-link ${accent.text}` }, "Manage →")),
          h("div", { className: "home-account-list" }, accounts.slice(0, 5).map(acc => h("button", { key: acc.id, type: "button", onClick: () => setActiveTab("accounts"), className: "home-account" },
            h("span", { className: "home-account-dot", style: { backgroundColor: accountColor(acc), boxShadow: `0 0 0 4px ${accountColor(acc)}18` } }),
            h("span", { className: "home-account-info" }, h("strong", null, acc.name), h("small", null, `${acc.type} · ${acc.currency}`)),
            h("span", { className: "home-account-balance" }, numFmt(acc.balance))
          )))
        )
      ) : h("div", { className: "home-subtab-content home-insights-content" }, insightsView)
    );
  }

  window.Tabs = window.Tabs || {};
  window.Tabs.OverviewHome = OverviewHome;

  function Overview(props) {
    const [subTab, setSubTab] = React.useState(props.activeTab === "analytics" ? "insights" : "recent");
    const touchStartRef = React.useRef(null);
    const Analytics = window.Tabs && window.Tabs.Analytics;
    const AnalyticsSummary = window.Tabs && window.Tabs.AnalyticsSummary;
    const insightsView = h(React.Fragment, null,
      typeof Analytics === "function" ? h(Analytics, props) : h("div", { className: "home-empty" }, h("strong", null, "Insights are unavailable"), h("span", null, "Please reload AleemFin.")),
      typeof AnalyticsSummary === "function" ? h(AnalyticsSummary, props) : null
    );

    const onSubTabTouchStart = e => {
      if (!e.touches || e.touches.length !== 1) return;
      const t = e.touches[0];
      touchStartRef.current = { x: t.clientX, y: t.clientY };
    };
    const onSubTabTouchEnd = e => {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (!start || !e.changedTouches || !e.changedTouches.length) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.35) return;
      if (dx < 0) setSubTab("insights");
      else setSubTab("recent");
    };

    const homeProps = Object.assign({}, props, {
      subTab, setSubTab, insightsView, onSubTabTouchStart, onSubTabTouchEnd
    });

    return h("div", {
      className: "max-w-2xl mx-auto w-full overview-shell",
      style: { overflowX: "hidden" }
    }, h(OverviewHome, homeProps));
  }

  window.Tabs.Overview = Overview;
})();
