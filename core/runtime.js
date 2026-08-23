// app.js — App container: state, computed values, event handlers, and the
// top-level render tree. Tab bodies and modals live in tabs/*.js and modals.js;
// this file wires them together via a shared `tabProps` object.
// src/app.jsx — shared runtime helpers
var {
  useState,
  useEffect,
  useMemo,
  useRef
} = React;
var hapticFeedback = function(duration) {
  try {
    if (window.__aleemFinHapticsEnabled === false) return;
    var cap = window.Capacitor;
    var haptics = cap && cap.Plugins && cap.Plugins.Haptics ? cap.Plugins.Haptics : null;
    if (!haptics && cap && typeof cap.registerPlugin === "function") {
      try { haptics = cap.registerPlugin("Haptics"); } catch (_) {}
    }
    if (haptics && typeof haptics.impact === "function") {
      var d = Number(duration || 10);
      var style = d >= 16 ? "MEDIUM" : d >= 11 ? "LIGHT" : "LIGHT";
      haptics.impact({ style: style });
      return;
    }
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.hapticFeedback) {
      window.webkit.messageHandlers.hapticFeedback.postMessage({ duration: duration || 10 });
      return;
    }
    if (navigator && typeof navigator.vibrate === "function") navigator.vibrate(duration || 10);
  } catch (_) {}
};
var actionSound = function(kind) {
  try {
    if (window.__aleemFinSoundEnabled !== true) return;
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.actionSound) {
      window.webkit.messageHandlers.actionSound.postMessage({ kind: kind || "tap" });
      return;
    }
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    var ctx = window.__aleemFinAudioCtx || (window.__aleemFinAudioCtx = new AudioCtx());
    if (ctx.state === "suspended") ctx.resume();
    var osc = ctx.createOscillator(), gain = ctx.createGain();
    var now = ctx.currentTime, freq = kind === "delete" ? 180 : kind === "success" ? 720 : 420;
    osc.type = "sine"; osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(0.035, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
    osc.connect(gain); gain.connect(ctx.destination); osc.start(now); osc.stop(now + 0.06);
  } catch (_) {}
};
if (!window.__aleemFinHapticsInstalled) {
  window.__aleemFinHapticsInstalled = true;
  document.addEventListener("click", function(e) {
    var target = e.target && e.target.closest ? e.target.closest("button, a, [role=button], input[type=checkbox], input[type=radio]") : null;
    if (target && !target.disabled && target.getAttribute("aria-disabled") !== "true") { hapticFeedback(8); actionSound(target.dataset.soundKind || (target.classList.contains("text-rose-500") || target.classList.contains("swipe-action-delete") ? "delete" : "tap")); }
  }, true);
  document.addEventListener("change", function(e) {
    var target = e.target;
    if (target && target.matches && target.matches("select, input[type=checkbox], input[type=radio]")) hapticFeedback(7);
  }, true);
}
window.__aleemSelection = window.__aleemSelection || new Set();
var selectionEvent = "aleem-selection-updated";
var SwipeRow = ({ children, onEdit, onDelete, onLeftAction, onLeftAction2, onLeftAction3, onRightAction, onRightAction2, onRightAction3, editLabel = "Edit", deleteLabel = "Delete", rightActionLabel = "Edit", rightAction2Label = "Delete", rightAction3Label = "More", leftActionLabel = "Record payment", leftAction2Label = "Add more", leftAction3Label = "Skip next", leftActionKind = "record", leftAction2Kind = "add-more", leftAction3Kind = "skip", selectionKey }) => {
  const [side, setSide] = useState(0); // -1 = left-side actions, 1 = right-side actions
  const startX = useRef(0);
  const startY = useRef(0);
  const dragging = useRef(false);
  const moved = useRef(false);
  const longPress = useRef(null);
  const longPressed = useRef(false);
  const suppressNextClick = useRef(false);
  const contentRef = useRef(null);
  const key = selectionKey || null;
  const isSelected = key ? !!(window.__aleemSelection && window.__aleemSelection.has(key)) : false;
  const hasLeftActions = !!(onLeftAction || onLeftAction2 || onLeftAction3);
  const RIGHT_ACTION_COUNT = [onRightAction, onRightAction2, onRightAction3].filter(Boolean).length || 2;
  const RIGHT_ACTION_WIDTH = 72 * RIGHT_ACTION_COUNT;
  const LEFT_ACTION_COUNT = [onLeftAction, onLeftAction2, onLeftAction3].filter(Boolean).length;
  const LEFT_ACTION_WIDTH = hasLeftActions ? 72 * Math.max(2, LEFT_ACTION_COUNT) : 0;

  const clearLongPress = () => { if (longPress.current) { clearTimeout(longPress.current); longPress.current = null; } };
  const widthForSide = s => s === -1 ? LEFT_ACTION_WIDTH : RIGHT_ACTION_WIDTH;
  const close = () => { setSide(0); if (contentRef.current) contentRef.current.style.transform = ""; };
  const setOffset = value => { if (contentRef.current) contentRef.current.style.transform = `translate3d(${value}px,0,0)`; };

  const onPointerDown = e => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const selectionMode = key && window.__aleemSelection && window.__aleemSelection.size > 0;
    startX.current = e.clientX; startY.current = e.clientY;
    dragging.current = true; moved.current = false; longPressed.current = false; clearLongPress();
    if (key && !selectionMode) {
      longPress.current = setTimeout(() => {
        if (!dragging.current || moved.current) return;
        longPressed.current = true;
        suppressNextClick.current = true;
        dragging.current = false;
        clearLongPress();
        close();
        hapticFeedback(18);
        window.dispatchEvent(new CustomEvent("aleem-select", { detail: { key } }));
      }, 520);
    }
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = e => {
    if (!dragging.current) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    if (!moved.current && Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
    if (!moved.current && Math.abs(dy) > Math.abs(dx)) { clearLongPress(); dragging.current = false; return; }
    moved.current = true; clearLongPress();

    const base = side === -1 ? LEFT_ACTION_WIDTH : side === 1 ? -RIGHT_ACTION_WIDTH : 0;
    const raw = base + dx;
    const min = hasLeftActions ? -8 : 0;
    const max = RIGHT_ACTION_WIDTH + 12;
    let resisted = raw;
    if (raw < -LEFT_ACTION_WIDTH) resisted = -LEFT_ACTION_WIDTH - (Math.abs(raw + LEFT_ACTION_WIDTH) * 0.18);
    else if (raw > RIGHT_ACTION_WIDTH) resisted = RIGHT_ACTION_WIDTH + (Math.abs(raw - RIGHT_ACTION_WIDTH) * 0.18);
    setOffset(Math.max(-LEFT_ACTION_WIDTH - 12, Math.min(RIGHT_ACTION_WIDTH + 12, resisted)));
  };

  const onPointerUp = e => {
    clearLongPress();
    if (!dragging.current) return;
    dragging.current = false;
    const dx = e.clientX - startX.current;
    if (longPressed.current) {
      longPressed.current = false;
      suppressNextClick.current = true;
      clearLongPress();
      return;
    }
    if (!moved.current && key && window.__aleemSelection && window.__aleemSelection.size > 0) {
      window.dispatchEvent(new CustomEvent("aleem-select", { detail: { key } }));
      moved.current = true; return;
    }

    if (side === 0) {
      if (dx > 55 && hasLeftActions) {
        hapticFeedback(16); setSide(-1); setOffset(LEFT_ACTION_WIDTH);
      } else if (dx < -55) {
        hapticFeedback(16); setSide(1); setOffset(-RIGHT_ACTION_WIDTH);
      } else setOffset(0);
    } else if (side === -1) {
      // When the left-side actions are open, an opposite swipe closes them.
      // Do not jump directly to the other action side; this prevents the two
      // action panels from fighting each other when the user swipes back.
      if (dx < -35) {
        hapticFeedback(16); close();
      } else if (dx < 35) {
        close();
      } else setOffset(LEFT_ACTION_WIDTH);
    } else {
      // When the right-side actions are open, an opposite swipe closes them
      // instead of switching straight to the left-side actions.
      if (dx > 35) {
        hapticFeedback(16); close();
      } else if (dx < -35) {
        setOffset(-RIGHT_ACTION_WIDTH);
      } else setOffset(-RIGHT_ACTION_WIDTH);
    }
  };

  useEffect(() => {
    if (!side) return;
    const onDoc = e => { if (contentRef.current && !contentRef.current.parentElement?.contains(e.target)) close(); };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [side]);

  const invokeSwipeAction = fn => { close(); if (typeof fn === "function") fn(); };

  return React.createElement("div", { className: `swipe-row${isSelected ? " is-selected" : ""}`, "data-selection-key": key || undefined },
    hasLeftActions && React.createElement("div", { className: `swipe-actions swipe-actions-left${LEFT_ACTION_COUNT >= 3 ? " swipe-actions-left-three" : ""}${side === -1 ? " is-open" : ""}`, "aria-hidden": side !== -1 },
      React.createElement("button", { type: "button", className: `swipe-action swipe-action-${leftActionKind}`, onClick: () => invokeSwipeAction(onLeftAction), tabIndex: side === -1 ? 0 : -1, "aria-label": leftActionLabel, disabled: !onLeftAction },
        leftActionKind === "comment" ? React.createElement(Icons.IconMessage, { className: "w-[18px] h-[18px]" }) : leftActionKind === "pin" ? React.createElement(Icons.IconPin, { className: "w-[18px] h-[18px]" }) : leftActionKind === "category" ? React.createElement(Icons.IconTag, { className: "w-[18px] h-[18px]" }) : leftActionKind === "record" ? React.createElement(Icons.IconRepayment, { className: "w-[18px] h-[18px]" }) : React.createElement(Icons.IconAddMore, { className: "w-[18px] h-[18px]" }),
        React.createElement("span", null, leftActionLabel)),
      React.createElement("button", { type: "button", className: `swipe-action swipe-action-${leftAction2Kind}`, onClick: () => invokeSwipeAction(onLeftAction2), tabIndex: side === -1 ? 0 : -1, "aria-label": leftAction2Label, disabled: !onLeftAction2 },
        leftAction2Kind === "pin" ? React.createElement(Icons.IconPin, { className: "w-[18px] h-[18px]" }) : leftAction2Kind === "comment" ? React.createElement(Icons.IconMessage, { className: "w-[18px] h-[18px]" }) : React.createElement(Icons.IconAddMore, { className: "w-[18px] h-[18px]" }),
        React.createElement("span", null, leftAction2Label)),
      onLeftAction3 && React.createElement("button", { type: "button", className: `swipe-action swipe-action-${leftAction3Kind}`, onClick: () => invokeSwipeAction(onLeftAction3), tabIndex: side === -1 ? 0 : -1, "aria-label": leftAction3Label },
        leftAction3Kind === "category" ? React.createElement(Icons.IconTag, { className: "w-[18px] h-[18px]" }) : leftAction3Kind === "pin" ? React.createElement(Icons.IconPin, { className: "w-[18px] h-[18px]" }) : React.createElement(Icons.IconHistory, { className: "w-[18px] h-[18px]" }),
        React.createElement("span", null, leftAction3Label))
    ),
    React.createElement("div", { className: `swipe-actions swipe-actions-right swipe-actions-right-dynamic${RIGHT_ACTION_COUNT >= 3 ? " swipe-actions-right-three" : ""}${side === 1 ? " is-open" : ""}`, "aria-hidden": side !== 1 },
      onRightAction ? React.createElement("button", { type: "button", className: "swipe-action swipe-action-edit", onClick: () => invokeSwipeAction(onRightAction), tabIndex: side === 1 ? 0 : -1, "aria-label": rightActionLabel }, React.createElement(Icons.IconEdit, { className: "w-[14px] h-[14px]" }), React.createElement("span", null, rightActionLabel)) : React.createElement("button", { type: "button", className: "swipe-action swipe-action-edit", onClick: () => invokeSwipeAction(onEdit), tabIndex: side === 1 ? 0 : -1, "aria-label": editLabel, disabled: !onEdit }, React.createElement(Icons.IconEdit, { className: "w-[14px] h-[14px]" })),
      onRightAction2 ? React.createElement("button", { type: "button", className: "swipe-action swipe-action-delete", onClick: () => invokeSwipeAction(onRightAction2), tabIndex: side === 1 ? 0 : -1, "aria-label": rightAction2Label }, "💬", React.createElement("span", null, rightAction2Label)) : React.createElement("button", { type: "button", className: "swipe-action swipe-action-delete", onClick: () => invokeSwipeAction(onDelete), tabIndex: side === 1 ? 0 : -1, "aria-label": deleteLabel, disabled: !onDelete }, React.createElement(Icons.IconTrash, { className: "w-[14px] h-[14px]" })),
      onRightAction3 && React.createElement("button", { type: "button", className: "swipe-action swipe-action-more", onClick: () => invokeSwipeAction(onRightAction3), tabIndex: side === 1 ? 0 : -1, "aria-label": rightAction3Label }, "📌", React.createElement("span", null, rightAction3Label))
    ),
    React.createElement("div", {
      ref: contentRef, className: `swipe-content${side ? " is-swiped" : ""}`,
      onPointerDown, onPointerMove, onPointerUp,
      onPointerCancel: () => { clearLongPress(); dragging.current = false; longPressed.current = false; suppressNextClick.current = false; setOffset(side === -1 ? LEFT_ACTION_WIDTH : side === 1 ? -RIGHT_ACTION_WIDTH : 0); },
      onClickCapture: e => {
        // A long press has already selected the item. Suppress the synthetic
        // click that iOS emits afterwards so it cannot expand the loan or
        // immediately toggle the selection back off.
        if (suppressNextClick.current) {
          suppressNextClick.current = false;
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        // Capture the tap before child card handlers. Once selection mode is
        // active, every normal tap is exclusively select/deselect.
        if (key && window.__aleemSelection && window.__aleemSelection.size > 0) {
          e.preventDefault();
          e.stopPropagation();
          if (!moved.current) window.dispatchEvent(new CustomEvent("aleem-select", { detail: { key } }));
          moved.current = false;
          return;
        }
        if (moved.current) { e.preventDefault(); e.stopPropagation(); moved.current = false; }
      },
      onClick: e => {
        if (moved.current) { e.preventDefault(); e.stopPropagation(); moved.current = false; }
      }
    }, children)
  );
};
window.SwipeRow = SwipeRow;
var ACCOUNT_COLORS = ["#1DBF73", "#3B82F6", "#6366F1", "#F59E0B", "#8B5CF6", "#EF5DA8", "#14B8A6", "#F97316"];
var toLocalISO = d => {
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 6e4);
  return local.toISOString().slice(0, 10);
};
var todayISO = () => toLocalISO(/* @__PURE__ */new Date());
var ACCENT_PALETTE = {
  emerald: {
    name: "Original",
    grad: "from-emerald-500 to-teal-400 af-accent-grad",
    text: "text-emerald-500 af-accent-text",
    text400: "text-emerald-400 af-accent-text400",
    textStrong: "text-emerald-600 af-accent-textStrong",
    solidBtn: "bg-emerald-600 hover:bg-emerald-500 af-accent-solid",
    activeBg: "bg-emerald-500/15 af-accent-bg15",
    activeBg10: "bg-emerald-500/10 af-accent-bg10",
    activeBg20: "bg-emerald-500/20 af-accent-bg20",
    swatch: "bg-emerald-500"
  },
  teal: {
    name: "Teal",
    grad: "from-teal-500 to-cyan-400 af-accent-grad",
    text: "text-teal-500 af-accent-text",
    text400: "text-teal-400 af-accent-text400",
    textStrong: "text-teal-600 af-accent-textStrong",
    solidBtn: "bg-teal-600 hover:bg-teal-500 af-accent-solid",
    activeBg: "bg-teal-500/15 af-accent-bg15",
    activeBg10: "bg-teal-500/10 af-accent-bg10",
    activeBg20: "bg-teal-500/20 af-accent-bg20",
    swatch: "bg-teal-500"
  },
  blue: {
    name: "Blue",
    grad: "from-blue-500 to-indigo-400 af-accent-grad",
    text: "text-blue-500 af-accent-text",
    text400: "text-blue-400 af-accent-text400",
    textStrong: "text-blue-600 af-accent-textStrong",
    solidBtn: "bg-blue-600 hover:bg-blue-500 af-accent-solid",
    activeBg: "bg-blue-500/15 af-accent-bg15",
    activeBg10: "bg-blue-500/10 af-accent-bg10",
    activeBg20: "bg-blue-500/20 af-accent-bg20",
    swatch: "bg-blue-500"
  },
  violet: {
    name: "Violet",
    grad: "from-violet-500 to-purple-400 af-accent-grad",
    text: "text-violet-500 af-accent-text",
    text400: "text-violet-400 af-accent-text400",
    textStrong: "text-violet-600 af-accent-textStrong",
    solidBtn: "bg-violet-600 hover:bg-violet-500 af-accent-solid",
    activeBg: "bg-violet-500/15 af-accent-bg15",
    activeBg10: "bg-violet-500/10 af-accent-bg10",
    activeBg20: "bg-violet-500/20 af-accent-bg20",
    swatch: "bg-violet-500"
  },
  amber: {
    name: "Amber",
    grad: "from-amber-500 to-orange-400 af-accent-grad",
    text: "text-amber-500 af-accent-text",
    text400: "text-amber-400 af-accent-text400",
    textStrong: "text-amber-600 af-accent-textStrong",
    solidBtn: "bg-amber-600 hover:bg-amber-500 af-accent-solid",
    activeBg: "bg-amber-500/15 af-accent-bg15",
    activeBg10: "bg-amber-500/10 af-accent-bg10",
    activeBg20: "bg-amber-500/20 af-accent-bg20",
    swatch: "bg-amber-500"
  }
};
var NAV_ITEMS = [{
  id: "overview",
  label: "Home",
  icon: Icons.IconOverview
}, {
  id: "transactions",
  label: "Ledger",
  icon: Icons.IconLedger
}, {
  id: "accounts",
  label: "Accounts",
  icon: Icons.IconAccounts
}, {
  id: "vault",
  label: "Assets",
  icon: Icons.IconVault
}, {
  id: "loans",
  label: "Loans",
  icon: Icons.IconLoan
}, {
  id: "planning",
  label: "Planning",
  icon: Icons.IconTarget
}, {
  id: "settings",
  label: "Settings",
  icon: Icons.IconMenu
}];


