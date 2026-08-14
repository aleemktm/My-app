// tabs/accounts.js — Accounts tab.
(function () {
  function Accounts(props) {
    const { accounts, askDeleteAccount, darkMode, dateFmt, describeAccountMovement, getLastInflow, getLastOutflow, numFmt, openAddModal, openEditModal } = props;
    return /* @__PURE__ */React.createElement("div", {
    className: "space-y-4 max-w-2xl mx-auto w-full"
  }, /* @__PURE__ */React.createElement("div", {
    className: "flex justify-between items-center px-1"
  }, /* @__PURE__ */React.createElement("h2", {
    className: "text-sm font-bold uppercase tracking-wider text-teal-500"
  }, "Bank & Wallets"), /* @__PURE__ */React.createElement("button", {
    onClick: () => openAddModal("account"),
    className: "px-3 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-semibold"
  }, "+ New Account")), /* @__PURE__ */React.createElement("div", {
    className: "space-y-2.5"
  }, accounts.map(acc => {
    const inflow = getLastInflow(acc.id);
    const outflow = getLastOutflow(acc.id);
    const inflowInfo = inflow ? describeAccountMovement(inflow, acc) : null;
    const outflowInfo = outflow ? describeAccountMovement(outflow, acc) : null;
    return /* @__PURE__ */React.createElement("div", {
      key: acc.id,
      className: `p-4 rounded-2xl border bg-gradient-to-br ${acc.color || "from-zinc-500/10 to-zinc-500/5 border-zinc-500/20"} space-y-2.5`
    }, /* @__PURE__ */React.createElement("div", {
      className: "flex justify-between items-center"
    }, /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("span", {
      className: "text-[10px] font-bold uppercase tracking-wider opacity-60"
    }, acc.type || "Bank Account"), /* @__PURE__ */React.createElement("h3", {
      className: "font-bold text-base mt-0.5"
    }, acc.name)), /* @__PURE__ */React.createElement("div", {
      className: "flex items-center space-x-2"
    }, /* @__PURE__ */React.createElement("div", {
      className: "text-right mr-1"
    }, /* @__PURE__ */React.createElement("span", {
      className: "text-[10px] font-bold opacity-60 block"
    }, acc.currency), /* @__PURE__ */React.createElement("span", {
      className: `font-extrabold text-base ${darkMode ? "text-emerald-400" : "text-emerald-600"}`
    }, numFmt(acc.balance))), /* @__PURE__ */React.createElement("button", {
      onClick: () => openEditModal("account", acc),
      title: "Edit",
      className: "p-2 -m-0.5 rounded-xl text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 active:scale-95"
    }, /* @__PURE__ */React.createElement(Icons.IconEdit, {
      className: "w-4 h-4"
    })), /* @__PURE__ */React.createElement("button", {
      onClick: () => askDeleteAccount(acc),
      title: "Delete",
      className: "p-2 -m-0.5 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 active:scale-95"
    }, /* @__PURE__ */React.createElement(Icons.IconTrash, {
      className: "w-4 h-4"
    })))), /* @__PURE__ */React.createElement("div", {
      className: "pt-2 border-t border-black/10 space-y-1.5"
    }, /* @__PURE__ */React.createElement("div", {
      className: "flex items-center gap-1.5 text-[10px] opacity-70"
    }, /* @__PURE__ */React.createElement(Icons.IconInflow, {
      className: "w-3.5 h-3.5 text-emerald-500 shrink-0"
    }), inflowInfo ? /* @__PURE__ */React.createElement("span", null, "Last inflow: ", /* @__PURE__ */React.createElement("strong", {
      className: "text-emerald-500"
    }, "+", inflowInfo.cur, " ", numFmt(inflowInfo.amt)), " on ", dateFmt(inflow.date), inflowInfo.note) : /* @__PURE__ */React.createElement("span", null, "No inflow recorded for this account yet.")), /* @__PURE__ */React.createElement("div", {
      className: "flex items-center gap-1.5 text-[10px] opacity-70"
    }, /* @__PURE__ */React.createElement(Icons.IconInflow, {
      className: "w-3.5 h-3.5 text-rose-500 shrink-0 rotate-180"
    }), outflowInfo ? /* @__PURE__ */React.createElement("span", null, "Last outflow: ", /* @__PURE__ */React.createElement("strong", {
      className: "text-rose-500"
    }, "-", outflowInfo.cur, " ", numFmt(outflowInfo.amt)), " on ", dateFmt(outflow.date), outflowInfo.note) : /* @__PURE__ */React.createElement("span", null, "No outflow recorded for this account yet."))));
  })));
  }

  window.Tabs = window.Tabs || {};
  window.Tabs.Accounts = Accounts;
})();
