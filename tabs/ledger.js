// tabs/ledger.js — Transactions/Ledger tab.
(function () {
  function Ledger(props) {
    const { accent, darkMode, dateFmt, exportCSV, filteredTransactions, ledgerFilter, ledgerSearch, ledgerSort, numFmt, openAddModal, openEditModal, setDeleteTarget, setLedgerFilter, setLedgerSearch, setLedgerSort, subCardCls, transactions, openReceiptScanner, openBankSmsModal, settings, refreshLiveRates, syncingGold, syncingRates } = props;
    const [viewingReceipt, setViewingReceipt] = React.useState(null);

    const displayAmount = (tx) => {
      return `${tx.type === "income" ? "+" : tx.type === "expense" ? "-" : ""}${tx.currency} ${numFmt(tx.amount)}`;
    };

    // Apple iOS Native Pull-to-Refresh — drag down from the top of the
    // ledger to re-sync live exchange rates & 24k gold market data.
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

    return /* @__PURE__ */React.createElement(React.Fragment, null,
      /* @__PURE__ */React.createElement("div", {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd
      },
        pullDist > 0 && /* @__PURE__ */React.createElement("div", {
          className: "pull-refresh-container",
          style: { height: `${pullDist}px` }
        }, /* @__PURE__ */React.createElement("div", {
          className: "pull-refresh-spinner",
          style: { transform: `rotate(${pullDist * 8}deg)`, opacity: Math.min(1, pullDist / 35) }
        })),
        (syncingGold || syncingRates) && /* @__PURE__ */React.createElement("div", {
          className: "flex items-center justify-center gap-1.5 text-[10px] font-semibold text-emerald-500 pb-1"
        }, /* @__PURE__ */React.createElement(Icons.IconSync, { className: "w-3 h-3 animate-spin" }), "Syncing live FX & 24k gold rates\u2026"),
      /* @__PURE__ */React.createElement("div", {
        className: "space-y-4 max-w-2xl mx-auto w-full"
      }, /* @__PURE__ */React.createElement("div", {
        className: "flex justify-between items-center px-1 gap-2 flex-wrap"
      }, /* @__PURE__ */React.createElement("h2", {
        className: "text-sm font-bold uppercase tracking-wider text-emerald-500"
      }, "Connected Transactions Ledger"), /* @__PURE__ */React.createElement("div", {
        className: "flex items-center gap-1.5 sm:gap-2"
      }, /* @__PURE__ */React.createElement("button", {
        onClick: exportCSV,
        title: "Export CSV",
        className: `p-2 rounded-xl border ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700"}`
      }, /* @__PURE__ */React.createElement(Icons.IconCSV, {
        className: "w-4 h-4"
      })), /* @__PURE__ */React.createElement("button", {
        onClick: () => openReceiptScanner && openReceiptScanner(),
        title: "Scan Receipt OCR",
        className: `p-2 rounded-xl border flex items-center gap-1 text-xs font-semibold ${darkMode ? "bg-zinc-900 border-zinc-800 text-emerald-400 hover:bg-zinc-800" : "bg-white border-zinc-200 text-emerald-600 hover:bg-zinc-50"}`
      }, /* @__PURE__ */React.createElement(Icons.IconCamera, {
        className: "w-4 h-4 text-emerald-500"
      }), /* @__PURE__ */React.createElement("span", { className: "hidden sm:inline" }, "Scan")), /* @__PURE__ */React.createElement("button", {
        onClick: () => openBankSmsModal && openBankSmsModal(),
        title: "Parse Bank SMS",
        className: `p-2 rounded-xl border flex items-center gap-1 text-xs font-semibold ${darkMode ? "bg-zinc-900 border-zinc-800 text-blue-400 hover:bg-zinc-800" : "bg-white border-zinc-200 text-blue-600 hover:bg-zinc-50"}`
      }, /* @__PURE__ */React.createElement(Icons.IconSparkles, {
        className: "w-4 h-4 text-blue-500"
      }), /* @__PURE__ */React.createElement("span", { className: "hidden sm:inline" }, "SMS")), /* @__PURE__ */React.createElement("button", {
        onClick: () => openAddModal("income", {
          category: "Salary"
        }),
        className: `px-3 py-1.5 ${accent.solidBtn} text-white rounded-xl text-xs font-semibold whitespace-nowrap`
      }, "+ Add Entry"))), /* @__PURE__ */React.createElement("div", {
        className: "flex gap-2"
      }, /* @__PURE__ */React.createElement("div", {
        className: `flex-1 flex items-center gap-2 px-3 rounded-xl border ${darkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"}`
      }, /* @__PURE__ */React.createElement(Icons.IconSearch, {
        className: "w-3.5 h-3.5 text-zinc-400 shrink-0"
      }), /* @__PURE__ */React.createElement("input", {
        type: "text",
        placeholder: "Search title or category\u2026",
        value: ledgerSearch,
        onChange: e => setLedgerSearch(e.target.value),
        className: "w-full py-2 text-[16px] bg-transparent outline-none"
      })), /* @__PURE__ */React.createElement("select", {
        value: ledgerFilter,
        onChange: e => setLedgerFilter(e.target.value),
        className: `px-2 rounded-xl text-[16px] border outline-none ${darkMode ? "bg-zinc-950 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"}`
      }, /* @__PURE__ */React.createElement("option", {
        value: "all"
      }, "All Types"), /* @__PURE__ */React.createElement("option", {
        value: "income"
      }, "Income"), /* @__PURE__ */React.createElement("option", {
        value: "expense"
      }, "Expense"), /* @__PURE__ */React.createElement("option", {
        value: "transfer"
      }, "Transfer")), /* @__PURE__ */React.createElement("select", {
        value: ledgerSort,
        onChange: e => setLedgerSort(e.target.value),
        className: `px-2 rounded-xl text-[16px] border outline-none ${darkMode ? "bg-zinc-950 border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"}`
      }, /* @__PURE__ */React.createElement("option", {
        value: "date_desc"
      }, "Newest First"), /* @__PURE__ */React.createElement("option", {
        value: "date_asc"
      }, "Oldest First"), /* @__PURE__ */React.createElement("option", {
        value: "amount_desc"
      }, "Amount: High-Low"), /* @__PURE__ */React.createElement("option", {
        value: "amount_asc"
      }, "Amount: Low-High"))), /* @__PURE__ */React.createElement("div", {
        className: "space-y-2.5"
      }, filteredTransactions.length === 0 && /* @__PURE__ */React.createElement("div", {
        className: `p-12 text-center rounded-3xl border ${darkMode ? "bg-zinc-900/40 border-zinc-800 text-zinc-400" : "bg-white border-zinc-200 text-zinc-500"}`
      }, /* @__PURE__ */React.createElement("p", {
        className: "text-xs font-medium"
      }, transactions.length === 0 ? "No transactions recorded yet." : "No transactions match your search.")), filteredTransactions.map(tx => React.createElement(window.SwipeableTxRow || "div", {
        key: tx.id,
        tx,
        displayAmount,
        dateFmt,
        setViewingReceipt,
        openEditModal,
        setDeleteTarget,
        subCardCls,
        darkMode,
        settings
      })))
      )),

      viewingReceipt && /* @__PURE__ */React.createElement("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn",
        onClick: () => setViewingReceipt(null)
      }, /* @__PURE__ */React.createElement("div", {
        className: `max-w-md w-full p-4 rounded-3xl border shadow-2xl space-y-3 ${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`,
        onClick: e => e.stopPropagation()
      }, /* @__PURE__ */React.createElement("div", {
        className: "flex items-center justify-between"
      }, /* @__PURE__ */React.createElement("h3", { className: "text-sm font-bold flex items-center gap-2" }, /* @__PURE__ */React.createElement(Icons.IconReceipt, { className: "w-4 h-4 text-emerald-500" }), "Attached Receipt"), /* @__PURE__ */React.createElement("button", {
        type: "button",
        onClick: () => setViewingReceipt(null),
        className: "p-2 rounded-xl text-zinc-400 hover:text-white"
      }, /* @__PURE__ */React.createElement(Icons.IconClose, { className: "w-4 h-4" }))), /* @__PURE__ */React.createElement("img", {
        src: viewingReceipt,
        alt: "Scanned Receipt",
        className: "w-full max-h-[60vh] object-contain rounded-2xl border border-zinc-800"
      })))
    );
  }

  window.Tabs = window.Tabs || {};
  window.Tabs.Ledger = Ledger;
})();
