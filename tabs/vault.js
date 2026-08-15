// tabs/vault.js — Vault (physical assets) tab.
(function () {
  function Vault(props) {
    const { applyLiveGoldRate, assets, darkMode, goldSyncMsg, liveGoldAEDPerGram, numFmt, openAddModal, openEditModal, setDeleteTarget, subCardCls, syncLiveGoldRate, syncingGold } = props;
    return /* @__PURE__ */React.createElement("div", {
    className: "space-y-4 max-w-2xl mx-auto w-full"
  }, /* @__PURE__ */React.createElement("div", {
    className: "flex justify-between items-center px-1"
  }, /* @__PURE__ */React.createElement("h2", {
    className: "text-sm font-bold uppercase tracking-wider text-amber-600"
  }, "Gold & Fixed Assets"), /* @__PURE__ */React.createElement("button", {
    onClick: () => openAddModal("asset"),
    className: "px-3 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-semibold"
  }, "+ Add Asset")), assets.some(a => a.category === "Gold") && /* @__PURE__ */React.createElement("div", {
    className: `p-4 rounded-2xl border space-y-2 ${subCardCls}`
  }, /* @__PURE__ */React.createElement("div", {
    className: "flex items-center justify-between"
  }, /* @__PURE__ */React.createElement("span", {
    className: "text-xs font-bold uppercase tracking-wider text-amber-600"
  }, "Live Gold Rate (24k spot)"), /* @__PURE__ */React.createElement("button", {
    onClick: syncLiveGoldRate,
    disabled: syncingGold,
    className: `flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold border disabled:opacity-50 ${darkMode ? "border-zinc-800 hover:bg-zinc-800" : "border-zinc-200 hover:bg-zinc-100"}`
  }, /* @__PURE__ */React.createElement(Icons.IconSync, {
    className: `w-3.5 h-3.5 ${syncingGold ? "animate-pulse" : ""}`
  }), " ", syncingGold ? "Checking\u2026" : "Check Live Rate")), goldSyncMsg && /* @__PURE__ */React.createElement("p", {
    className: "text-[11px] text-zinc-400"
  }, goldSyncMsg), liveGoldAEDPerGram && /* @__PURE__ */React.createElement("button", {
    onClick: applyLiveGoldRate,
    className: "w-full text-center py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
  }, "Apply to All Gold Holdings"), /* @__PURE__ */React.createElement("p", {
    className: "text-[10px] text-zinc-500"
  }, "Spot price is a market benchmark \\u2014 your local souk/jeweler rate may differ slightly. Requires internet access.")), /* @__PURE__ */React.createElement("div", {
    className: "space-y-2.5"
  }, assets.map(ast => {
    const gain = ast.currentPriceAED - ast.purchasePriceAED;
    const gainPct = ast.purchasePriceAED > 0 ? (gain / ast.purchasePriceAED * 100).toFixed(1) : 0;
    return /* @__PURE__ */React.createElement(window.SwipeRow, {
      key: ast.id,
      onEdit: () => openEditModal("asset", ast),
      onDelete: () => setDeleteTarget({ type: "asset", id: ast.id, name: ast.name })
    }, /* @__PURE__ */React.createElement("div", {
      className: `swipe-content-card p-4 rounded-2xl border flex justify-between items-center ${subCardCls}`
    }, /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("span", {
      className: "px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded text-[9px] font-bold uppercase"
    }, ast.category), /* @__PURE__ */React.createElement("h3", {
      className: "font-bold text-sm mt-1"
    }, ast.name), ast.weightGrams ? /* @__PURE__ */React.createElement("p", {
      className: "text-[10px] opacity-60"
    }, "Weight: ", ast.weightGrams, "g") : null, /* @__PURE__ */React.createElement("p", {
      className: `text-[10px] font-bold mt-0.5 ${gain >= 0 ? "text-emerald-500" : "text-rose-500"}`
    }, gain >= 0 ? "+" : "", ast.currency || "AED", " ", numFmt(gain), " (", gainPct, "%)")), /* @__PURE__ */React.createElement("div", {
      className: "flex items-center space-x-2"
    }, /* @__PURE__ */React.createElement("span", {
      className: "font-bold text-sm text-amber-600 mr-1"
    }, ast.currency || "AED", " ", numFmt(ast.currentPriceAED)))));
  })));
  }

  window.Tabs = window.Tabs || {};
  window.Tabs.Vault = Vault;
})();
