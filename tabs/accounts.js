// tabs/accounts.js — Accounts tab.
(function () {
  const h = React.createElement;

  function Accounts(props) {
    const { accounts, askDeleteAccount, darkMode, dateFmt, describeAccountMovement, getLastInflow, getLastOutflow, numFmt, openAddModal, openEditModal } = props;

    return h("div", { className: "space-y-4 max-w-2xl mx-auto w-full" },
      h("div", { className: "flex justify-between items-center px-1" },
        h("h2", { className: "text-sm font-bold uppercase tracking-wider text-teal-500" }, "Bank & Wallets"),
        h("button", { onClick: () => openAddModal("account"), className: "px-3 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-semibold" }, "+ New Account")
      ),
      h("div", { className: "space-y-2.5" }, accounts.map(acc => {
        const inflow = getLastInflow(acc.id);
        const outflow = getLastOutflow(acc.id);
        const inflowInfo = inflow ? describeAccountMovement(inflow, acc) : null;
        const outflowInfo = outflow ? describeAccountMovement(outflow, acc) : null;

        return h("div", {
          key: acc.id,
          className: `p-4 rounded-2xl border bg-gradient-to-br ${acc.color || "from-zinc-500/10 to-zinc-500/5 border-zinc-500/20"} space-y-2.5`
        },
          h("div", { className: "flex justify-between items-center" },
            h("div", null,
              h("span", { className: "text-[10px] font-bold uppercase tracking-wider opacity-60" }, acc.type || "Bank Account"),
              h("h3", { className: "font-bold text-base mt-0.5" }, acc.name)
            ),
            h("div", { className: "flex items-center space-x-2" },
              h("div", { className: "text-right mr-1" },
                h("span", { className: "text-[10px] font-bold opacity-60 block" }, acc.currency),
                h("span", { className: `font-extrabold text-base ${darkMode ? "text-emerald-400" : "text-emerald-600"}` }, numFmt(acc.balance))
              ),
              h("button", {
                onClick: () => openEditModal("account", acc),
                title: "Edit",
                className: "p-2 -m-0.5 rounded-xl text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 active:scale-95"
              }, h(Icons.IconEdit, { className: "w-4 h-4" })),
              h("button", {
                onClick: () => askDeleteAccount(acc),
                title: "Delete",
                className: "p-2 -m-0.5 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 active:scale-95"
              }, h(Icons.IconTrash, { className: "w-4 h-4" }))
            )
          ),
          (inflowInfo || outflowInfo) && h("div", { className: "pt-2 border-t border-black/10 space-y-1.5" },
            inflowInfo && h("div", { className: "flex items-center gap-1.5 text-[10px] opacity-70" },
              h(Icons.IconInflow, { className: "w-3.5 h-3.5 text-emerald-500 shrink-0" }),
              h("span", null,
                "Last inflow: ",
                h("strong", { className: "text-emerald-500" }, "+", inflowInfo.cur, " ", numFmt(inflowInfo.amt)),
                " on ", dateFmt(inflow.date), inflowInfo.note
              )
            ),
            outflowInfo && h("div", { className: "flex items-center gap-1.5 text-[10px] opacity-70" },
              h(Icons.IconInflow, { className: "w-3.5 h-3.5 text-rose-500 shrink-0 rotate-180" }),
              h("span", null,
                "Last outflow: ",
                h("strong", { className: "text-rose-500" }, "-", outflowInfo.cur, " ", numFmt(outflowInfo.amt)),
                " on ", dateFmt(outflow.date), outflowInfo.note
              )
            )
          )
        );
      }))
    );
  }

  window.Tabs = window.Tabs || {};
  window.Tabs.Accounts = Accounts;
})();
