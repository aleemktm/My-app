// SwipeableTxRow.js — Apple iOS Native Swipe-to-Action transaction row component.
// Swipe physics live in SwipeableRow; this file just supplies the actions
// (gray Edit / red Delete) and the transaction content card.
(function () {
  function SwipeableTxRow(props) {
    const { tx, displayAmount, dateFmt, setViewingReceipt, openEditModal, setDeleteTarget, subCardCls, darkMode, settings } = props;

    const isTransfer = tx.type === "transfer";
    const badge = window.Storage && window.Storage.detectMerchantBadge ? window.Storage.detectMerchantBadge(tx.title || tx.notes, tx.category) : null;
    const swipeEnabled = !isTransfer && !(settings && settings.swipeActions === false);

    const actions = isTransfer ? [] : [
      {
        key: "edit",
        label: "Edit",
        icon: Icons.IconEdit,
        bg: "bg-zinc-600 hover:bg-zinc-500",
        onClick: () => openEditModal(tx.type, tx)
      },
      {
        key: "delete",
        label: "Delete",
        icon: Icons.IconTrash,
        bg: "bg-rose-600 hover:bg-rose-500",
        onClick: () => setDeleteTarget({ type: "transaction", id: tx.id, name: tx.title || tx.notes })
      }
    ];

    return React.createElement(window.SwipeableRow, {
      actions,
      enabled: swipeEnabled,
      contentClassName: `p-4 rounded-2xl border flex justify-between items-center ${subCardCls}`
    },
      React.createElement("div", { className: "flex items-center gap-3 min-w-0 pr-2" },
        badge && React.createElement("div", {
          className: `w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 border ${badge.bg}`,
          title: badge.name
        }, badge.icon),
        React.createElement("div", { className: "min-w-0" },
          React.createElement("div", { className: "flex items-center gap-1.5 flex-wrap" },
            React.createElement("span", {
              className: `px-2 py-0.5 rounded text-[9px] font-bold uppercase ${tx.type === "income" ? "bg-emerald-500/10 text-emerald-500" : tx.type === "expense" ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"}`
            }, tx.category),
            React.createElement("span", { className: "text-[10px] text-zinc-400" }, dateFmt(tx.date)),
            tx.receiptImage && React.createElement("button", {
              type: "button",
              onClick: (e) => {
                e.stopPropagation();
                setViewingReceipt(tx.receiptImage);
              },
              className: "px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-400 flex items-center gap-1 hover:bg-amber-500/25"
            },
              React.createElement(Icons.IconReceipt, { className: "w-3 h-3" }),
              "Receipt"
            )
          ),
          React.createElement("h3", { className: "font-bold text-sm mt-1 truncate" }, tx.title || tx.notes || "Transaction")
        )
      ),
      React.createElement("div", { className: "flex items-center space-x-2 shrink-0" },
        React.createElement("span", {
          className: `font-bold text-sm ${tx.type === "income" ? "text-emerald-500" : tx.type === "expense" ? "text-rose-500" : "text-blue-500"}`
        }, displayAmount(tx)),
        !isTransfer && React.createElement("div", { className: "hidden sm:flex items-center space-x-1" },
          React.createElement("button", {
            onClick: (e) => { e.stopPropagation(); openEditModal(tx.type, tx); },
            title: "Edit",
            className: "p-2 rounded-xl text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 active:scale-95"
          }, React.createElement(Icons.IconEdit, { className: "w-4 h-4" })),
          React.createElement("button", {
            onClick: (e) => {
              e.stopPropagation();
              setDeleteTarget({ type: "transaction", id: tx.id, name: tx.title || tx.notes });
            },
            title: "Delete",
            className: "p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 active:scale-95"
          }, React.createElement(Icons.IconTrash, { className: "w-4 h-4" }))
        )
      )
    );
  }

  window.SwipeableTxRow = SwipeableTxRow;
})();
