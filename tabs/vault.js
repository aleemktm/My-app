// tabs/vault.js — Native iOS-style Assets tab.
(function () {
  const h = React.createElement;
  function VaultAssets(props) {
    const { applyLiveGoldRate, assets, darkMode, goldSyncMsg, liveGoldAEDPerGram, numFmt, openAddModal, openEditModal, setDeleteTarget, syncLiveGoldRate, syncingGold, selectionKey, setActiveTab, goldChangeAED, goldChangePct, convertToBaseCurrency, settings } = props;
    const total = assets.reduce((s,a)=>s+convertToBaseCurrency(Number(a.currentPriceAED||0), a.currency||"AED"),0);
    const gain = assets.reduce((s,a)=>s+convertToBaseCurrency(Number(a.currentPriceAED||0)-Number(a.purchasePriceAED||0), a.currency||"AED"),0);
    const baseCurrency = settings?.defaultCurrency || "AED";
    const goldCount = assets.filter(a=>a.category === "Gold").length;
    const categoryTotals = assets.reduce((map, a) => { const key = a.category || "Other"; map[key] = (map[key] || 0) + convertToBaseCurrency(Number(a.currentPriceAED || 0), a.currency || "AED"); return map; }, {});
    const topCategory = Object.entries(categoryTotals).sort((a,b) => b[1] - a[1])[0];
    const topCategoryShare = total > 0 && topCategory ? Math.round(topCategory[1] / total * 100) : 0;
    const categoryBorderColor = category => {
      switch (category) {
        case "Gold": return "#D4AF37";
        case "Property": return "#8B5CF6";
        case "Vehicle": return "#3B82F6";
        default: return "#8E8E93";
      }
    };
    return h("div", { className: `assets-native ${darkMode ? "is-dark" : ""}` },
      h("section", { className: "assets-hero" },
        h("div", { className:"assets-hero-copy" },
          h("span", { className:"assets-eyebrow" }, "WEALTH & ASSETS"),
          h("h2", { className:"assets-title" }, "Assets"),
          h("p", { className:"assets-subtitle" }, `${assets.length} asset${assets.length===1?"":"s"} · Track physical value and growth in one place.`)
        ),
        h("button", { className:"assets-add", onClick:()=>openAddModal("asset"), "aria-label":"Add asset" }, h(Icons.IconPlus,{className:"w-4 h-4"}), "Add")
      ),
      h("section", { className:"assets-summary-grid" },
        h("div", { className:"assets-summary-card assets-summary-main" }, h("span",null,"Total value"), h("strong",null,baseCurrency," ",numFmt(total)), h("small",null,`${assets.length} tracked asset${assets.length===1?"":"s"}`)),
        h("div", { className:`assets-summary-card ${gain>=0?"is-positive":"is-negative"}` }, h("span",null,"Gain / loss"), h("strong",null,(gain>=0?"+":"-")+baseCurrency+" "+numFmt(Math.abs(gain))), h("small",null,total?((gain/(total-gain||1))*100).toFixed(1)+"% change":"—")),
        h("div", { className:"assets-summary-card" }, h("span",null,"Gold holdings"), h("strong",null,String(goldCount)), h("small",null,goldCount?"Live rate available":"No gold tracked"))
      ),
      h("section", { className:`assets-control-card ${darkMode ? "is-dark" : ""}` },
        h("div", { className:"assets-section-head" }, h("div",null,h("span",null,"PORTFOLIO CHECK"),h("strong",null,"What to keep under control")), h("span", { className:"assets-control-badge" }, gain >= 0 ? "On track" : "Review")),
        h("div", { className:"assets-control-grid" },
          h("div",null,h("span",null,"Largest holding group"),h("b",null,topCategory ? `${topCategory[0]} · ${topCategoryShare}%` : "No data"),h("small",null,"Avoid one category dominating the portfolio.")),
          h("div",null,h("span",null,"Portfolio movement"),h("b",{className:gain>=0?"is-positive":"is-negative"},`${gain>=0?"+":"-"}${baseCurrency} ${numFmt(Math.abs(gain))}`),h("small",null,"Keep purchase values and current values up to date.")),
          h("div",null,h("span",null,"Next action"),h("b",null,goldCount ? "Refresh gold rate" : "Add an asset"),h("small",null,goldCount ? "Use the live benchmark before reviewing P/L." : "A complete portfolio gives better net-worth context."))
        )
      ),
      goldCount>0 && h("section", { className:"assets-gold-card" },
        h("div", { className:"assets-section-head" }, h("div",null,h("span",null,"MARKET RATE"),h("strong",null,"24k Gold spot")), h("button",{onClick:syncLiveGoldRate,disabled:syncingGold,className:"assets-icon-button","aria-label":"Refresh gold rate"},h(Icons.IconSync,{className:`w-4 h-4 ${syncingGold?"animate-pulse":""}`}))),
        h("div",{className:"assets-gold-rate"}, h("div",null,h("span",null,liveGoldAEDPerGram?`AED ${numFmt(liveGoldAEDPerGram)} / g`:"Rate not synced"),h("small",null,goldSyncMsg||"Market benchmark; local jeweler rates may differ.")), liveGoldAEDPerGram&&h("button",{onClick:applyLiveGoldRate,className:"assets-apply"},"Apply rate"))
      ),
      goldCount>0 && h("button", { type:"button", className:"assets-insight-shortcut", onClick:()=>setActiveTab("analytics") },
        h("div", { className:"assets-insight-copy" }, h("span",null,"GOLD INSIGHT"), h("strong",null,"See your gold gain & loss"), h("small",null,`${goldChangePct == null ? "Live market movement" : `${goldChangePct >= 0 ? "+" : "-"}${Math.abs(goldChangePct).toFixed(1)}% since purchase`}`)),
        h(Icons.IconChevron,{className:"w-4 h-4"})
      ),
      h("section", { className:"assets-list-section" },
        h("div",{className:"assets-section-head"},h("div",null,h("span",null,"YOUR ASSETS"),h("strong",null,assets.length?"Portfolio":"Get started"))),
        assets.length===0 ? h("div",{className:"assets-empty"},h(Icons.IconWallet,{className:"w-7 h-7"}),h("strong",null,"No assets yet"),h("span",null,"Add gold, property, vehicles or other fixed assets to track your net worth."),h("button",{onClick:()=>openAddModal("asset"),className:"assets-add"},h(Icons.IconPlus,{className:"w-4 h-4"}),"Add asset")) :
        h("div",{className:"assets-list"},assets.map(ast=>{const g=Number(ast.currentPriceAED||0)-Number(ast.purchasePriceAED||0);const pct=Number(ast.purchasePriceAED||0)>0?(g/Number(ast.purchasePriceAED))*100:0;const borderColor=categoryBorderColor(ast.category);return h(window.SwipeRow,{key:ast.id,onEdit:()=>openEditModal("asset",ast),onDelete:()=>setDeleteTarget({type:"asset",id:ast.id,name:ast.name}),selectionKey:selectionKey("asset",ast.id)},h("article",{className:"asset-row-card",style:{borderLeftWidth:"3px",borderLeftStyle:"solid",borderLeftColor:borderColor}},h("div",{className:"asset-row-icon"}, ast.category==="Gold"?h(Icons.IconSparkles,{className:"w-5 h-5"}):ast.category==="Vehicle"?h(Icons.IconCar,{className:"w-5 h-5"}):ast.category==="Property"?h(Icons.IconHome,{className:"w-5 h-5"}):h(Icons.IconWallet,{className:"w-5 h-5"})),h("div",{className:"asset-row-main"},h("div",{className:"asset-row-title"},h("h3",null,ast.name),h("span",null,ast.category)),h("p",null,ast.weightGrams?`${ast.weightGrams}g · `:"",ast.currency||"AED"," · Purchased ",numFmt(ast.purchasePriceAED||0)),h("div",{className:"asset-row-progress"},h("span",{style:{width:`${Math.max(0,Math.min(100,Math.abs(pct)))}%`}}))),h("div",{className:"asset-row-value"},h("strong",null,ast.currency||"AED"," ",numFmt(ast.currentPriceAED||0)),h("small",{className:g>=0?"is-positive":"is-negative"},(g>=0?"+":"-")+numFmt(Math.abs(g))+` · ${Math.abs(pct).toFixed(1)}%`))));}))
      )
    );
  }
  window.Tabs=window.Tabs||{}; window.Tabs.VaultAssets=VaultAssets;

  function Vault(props) {
    const [subTab, setSubTab] = React.useState(props.activeTab === "rates" ? "rates" : "assets");
    const touchStartRef = React.useRef(null);
    const onSubTabTouchStart = e => { if (!e.touches || e.touches.length !== 1) return; const t = e.touches[0]; touchStartRef.current = { x: t.clientX, y: t.clientY }; };
    const onSubTabTouchEnd = e => { const start = touchStartRef.current; touchStartRef.current = null; if (!start || !e.changedTouches || !e.changedTouches.length) return; const t = e.changedTouches[0]; const dx = t.clientX - start.x; const dy = t.clientY - start.y; if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.35) return; setSubTab(dx < 0 ? "rates" : "assets"); };
    const Rates = window.Tabs && window.Tabs.Rates;
    const ratesView = typeof Rates === "function"
      ? h(Rates, props)
      : h("div", { className: "assets-empty" }, h("strong", null, "FX & Convert is unavailable"), h("span", null, "Please reload AleemFin."));
    return h("div", { className: `assets-native ${props.darkMode ? "is-dark" : ""}`, style: { overflowX: "hidden" } },
      h("div", { className: "loan-filter-segment is-two assets-subtabs", role: "tablist", "aria-label": "Assets sections", onTouchStart: onSubTabTouchStart, onTouchEnd: onSubTabTouchEnd },
        h("button", { type: "button", role: "tab", "aria-selected": subTab === "assets", onClick: () => setSubTab("assets"), className: `loan-filter-tab ${subTab === "assets" ? "is-active" : ""}` }, "Assets"),
        h("button", { type: "button", role: "tab", "aria-selected": subTab === "rates", onClick: () => setSubTab("rates"), className: `loan-filter-tab ${subTab === "rates" ? "is-active" : ""}` }, "Rates")
      ),
      subTab === "assets" ? h(VaultAssets, props) : ratesView
    );
  }

  window.Tabs.Vault=Vault;
})();
