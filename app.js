// app.js — App container: state, computed values, event handlers, and the
// top-level render tree. Tab bodies and modals live in tabs/*.js and modals.js;
// this file wires them together via a shared `tabProps` object.
(function () {
// src/app.jsx
var {
  useState,
  useEffect,
  useMemo,
  useRef
} = React;
var ACCOUNT_COLORS = ["from-emerald-500/10 to-teal-500/10 border-emerald-500/20", "from-blue-500/10 to-indigo-500/10 border-blue-500/20", "from-sky-500/10 to-blue-500/10 border-sky-500/20", "from-amber-500/10 to-orange-500/10 border-amber-500/20", "from-violet-500/10 to-purple-500/10 border-violet-500/20", "from-rose-500/10 to-pink-500/10 border-rose-500/20"];
var toLocalISO = d => {
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 6e4);
  return local.toISOString().slice(0, 10);
};
var todayISO = () => toLocalISO(/* @__PURE__ */new Date());
var ACCENT_PALETTE = {
  emerald: {
    name: "Emerald",
    grad: "from-emerald-500 to-teal-400",
    text: "text-emerald-500",
    text400: "text-emerald-400",
    textStrong: "text-emerald-600",
    solidBtn: "bg-emerald-600 hover:bg-emerald-500",
    activeBg: "bg-emerald-500/15",
    activeBg10: "bg-emerald-500/10",
    activeBg20: "bg-emerald-500/20",
    swatch: "bg-emerald-500"
  },
  teal: {
    name: "Teal",
    grad: "from-teal-500 to-cyan-400",
    text: "text-teal-500",
    text400: "text-teal-400",
    textStrong: "text-teal-600",
    solidBtn: "bg-teal-600 hover:bg-teal-500",
    activeBg: "bg-teal-500/15",
    activeBg10: "bg-teal-500/10",
    activeBg20: "bg-teal-500/20",
    swatch: "bg-teal-500"
  },
  blue: {
    name: "Blue",
    grad: "from-blue-500 to-indigo-400",
    text: "text-blue-500",
    text400: "text-blue-400",
    textStrong: "text-blue-600",
    solidBtn: "bg-blue-600 hover:bg-blue-500",
    activeBg: "bg-blue-500/15",
    activeBg10: "bg-blue-500/10",
    activeBg20: "bg-blue-500/20",
    swatch: "bg-blue-500"
  },
  violet: {
    name: "Violet",
    grad: "from-violet-500 to-purple-400",
    text: "text-violet-500",
    text400: "text-violet-400",
    textStrong: "text-violet-600",
    solidBtn: "bg-violet-600 hover:bg-violet-500",
    activeBg: "bg-violet-500/15",
    activeBg10: "bg-violet-500/10",
    activeBg20: "bg-violet-500/20",
    swatch: "bg-violet-500"
  },
  amber: {
    name: "Amber",
    grad: "from-amber-500 to-orange-400",
    text: "text-amber-500",
    text400: "text-amber-400",
    textStrong: "text-amber-600",
    solidBtn: "bg-amber-600 hover:bg-amber-500",
    activeBg: "bg-amber-500/15",
    activeBg10: "bg-amber-500/10",
    activeBg20: "bg-amber-500/20",
    swatch: "bg-amber-500"
  },
  rose: {
    name: "Rose",
    grad: "from-rose-500 to-pink-400",
    text: "text-rose-500",
    text400: "text-rose-400",
    textStrong: "text-rose-600",
    solidBtn: "bg-rose-600 hover:bg-rose-500",
    activeBg: "bg-rose-500/15",
    activeBg10: "bg-rose-500/10",
    activeBg20: "bg-rose-500/20",
    swatch: "bg-rose-500"
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
  id: "analytics",
  label: "Insights",
  icon: Icons.IconAnalytics
}, {
  id: "planning",
  label: "Planning",
  icon: Icons.IconTarget
}, {
  id: "recurring",
  label: "Recurring",
  icon: Icons.IconCalendar
}, {
  id: "settings",
  label: "Settings",
  icon: Icons.IconMenu
}];

  function App() {
const SETTINGS_KEY = "aleemfin_settings_v1";
const DEFAULT_SETTINGS = {
  theme: "dark",
  accentColor: "emerald",
  heroMetric: "liquid",
  dashboardCards: ["accounts", "vault", "loans", "analytics"],
  hiddenDashboardCards: [],
  liveRateSync: true,
  hapticFeedback: true,
  showGreeting: true,
  primaryNavIds: ["overview", "transactions", "accounts", "loans"],
  defaultCurrency: "AED",
  dateFormat: "YYYY-MM-DD",
  numberFormat: "comma",
  customCategories: {
    income: ["Salary", "Freelance", "Gift", "Other"],
    expense: ["Groceries", "Family", "Rent", "Utilities", "Transport", "Dining", "Shopping", "Other"]
  }
};
const [settings, setSettings] = useState(() => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(saved),
      customCategories: {
        ...DEFAULT_SETTINGS.customCategories,
        ...(JSON.parse(saved).customCategories || {})
      }
    };
  } catch (e) {}
  return DEFAULT_SETTINGS;
});
const updateSettings = partial => {
  setSettings(prev => {
    const next = {
      ...prev,
      ...partial
    };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch (e) {}
    return next;
  });
};
const accent = ACCENT_PALETTE[settings.accentColor] || ACCENT_PALETTE.emerald;
const settingsRef = useRef(settings);
settingsRef.current = settings;
const primaryNavIds = settings.primaryNavIds && settings.primaryNavIds.length === 4 ? settings.primaryNavIds : DEFAULT_SETTINGS.primaryNavIds;
const PRIMARY_NAV_ITEMS = NAV_ITEMS.filter(t => primaryNavIds.includes(t.id));
const MORE_NAV_ITEMS = NAV_ITEMS.filter(t => !primaryNavIds.includes(t.id));
const MOBILE_NAV_ITEMS = NAV_ITEMS.filter(t => t.id !== "settings");
const numFmt = (n, opts) => Number(n || 0).toLocaleString(settings.numberFormat === "period" ? "de-DE" : "en-US", opts);
const dateFmt = iso => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  if (settings.dateFormat === "DD/MM/YYYY") return `${d}/${m}/${y}`;
  if (settings.dateFormat === "MM/DD/YYYY") return `${m}/${d}/${y}`;
  return iso;
};
const [darkMode, setDarkMode] = useState(true);
useEffect(() => {
  const resolveTheme = () => {
    if (settings.theme === "auto") {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    } else {
      setDarkMode(settings.theme === "dark");
    }
  };
  resolveTheme();
  if (settings.theme === "auto" && window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => resolveTheme();
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }
}, [settings.theme]);
const triggerHaptic = (type = "light") => {
  if (settings && settings.soundEffects !== false && window.playSound) {
    if (type === "light" || type === "tab" || type === "tap") window.playSound("click");
    else if (type === "success" || type === "transaction") window.playSound("success");
    else if (type === "delete" || type === "warning") window.playSound("delete");
  }
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  if (settings && settings.hapticFeedback === false) return;
  try {
    if (type === "light" || type === "tab" || type === "tap") {
      navigator.vibrate(10);
    } else if (type === "medium" || type === "action") {
      navigator.vibrate(20);
    } else if (type === "success" || type === "transaction") {
      navigator.vibrate([15, 45, 25]);
    } else if (type === "delete" || type === "warning") {
      navigator.vibrate([30, 50, 25]);
    } else if (Array.isArray(type) || typeof type === "number") {
      navigator.vibrate(type);
    } else {
      navigator.vibrate(10);
    }
  } catch (e) {}
};
const [toasts, setToasts] = useState([]);
const showToast = (message, tone = "default") => {
  const id = `${Date.now()}_${Math.random()}`;
  setToasts(prev => [...prev, { id, message, tone }]);
  window.setTimeout(() => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, 2400);
};
const [activeTabState, setActiveTabState] = useState("overview");
const setActiveTab = nextTab => {
  setActiveTabState(prev => {
    const target = typeof nextTab === "function" ? nextTab(prev) : nextTab;
    if (target !== prev) {
      triggerHaptic("tab");
    }
    return target;
  });
};
const activeTab = activeTabState;
const activeTabRef = useRef(activeTab);
activeTabRef.current = activeTab;
useEffect(() => {
  if (typeof window === "undefined" || window.innerWidth > 767) return;
  let startX = 0, startY = 0, startTarget = null, tracking = false;
  const onStart = e => {
    const t = e.touches && e.touches[0];
    if (!t) return;
    const targetEl = e.target;
    // Exclude touches intended for the quick entry card, bottom nav, form inputs, buttons, or dialogs
    if (targetEl && targetEl.closest && targetEl.closest(".home-actions-section, .home-actions-grid, .home-action, [data-swipe-exclude=\"true\"], nav, .mobile-bottom-bar, .mobile-nav-swipe, .ios-swipe-row, input, textarea, select, [contenteditable=\"true\"], button, a, [role=\"dialog\"], .fixed.inset-0")) {
      tracking = false;
      return;
    }
    startX = t.clientX; startY = t.clientY; startTarget = targetEl; tracking = true;
  };
  const onEnd = e => {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches && e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - startX, dy = t.clientY - startY;
    if (Math.abs(dx) < 45 || Math.abs(dx) <= Math.abs(dy) * 1.25) return;
    const target = startTarget && startTarget.closest && startTarget.closest(".home-actions-section, .home-actions-grid, .home-action, [data-swipe-exclude=\"true\"], input, textarea, select, [contenteditable=\"true\"], nav, .mobile-bottom-bar, .mobile-nav-swipe, .ios-swipe-row, [role=\"dialog\"], .fixed.inset-0");
    if (target) return;
    const tabs = NAV_ITEMS;
    const index = tabs.findIndex(tab => tab.id === activeTab);
    if (index < 0) return;
    const nextIndex = dx < 0 ? index + 1 : index - 1;
    if (nextIndex < 0 || nextIndex >= tabs.length) return;
    document.documentElement.dataset.tabSwipe = dx < 0 ? "left" : "right";
    setActiveTab(tabs[nextIndex].id);
    window.setTimeout(() => delete document.documentElement.dataset.tabSwipe, 240);
  };
  window.addEventListener("touchstart", onStart, { passive: true });
  window.addEventListener("touchend", onEnd, { passive: true });
  return () => { window.removeEventListener("touchstart", onStart); window.removeEventListener("touchend", onEnd); };
}, [activeTab]);
const [insightTrendPeriod, setInsightTrendPeriod] = useState("monthly");
const [insightTrendStyle, setInsightTrendStyle] = useState("line");
const [greetingTypingStarted, setGreetingTypingStarted] = useState(false);
const [heroFlash, setHeroFlash] = useState(null);
const [currency, setCurrency] = useState(() => settings.defaultCurrency || "AED");
const STORAGE_KEY = "aleemfin_data_v8";
const loadStoredData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed[key]) return parsed[key];
    }
  } catch (e) {}
  return fallback;
};
const [exchangeRates, setExchangeRates] = useState(() => loadStoredData("rates", {
  AED: 1,
  USD: 3.67,
  PKR: 0.013
}));
const convertToAED = (amt, curr) => amt * (exchangeRates[curr] || 1);
const convertFromAED = (amtAED, targetCurr) => amtAED / (exchangeRates[targetCurr] || 1);
const convertTxToAED = t => t.amount * (t.rateToAED || exchangeRates[t.currency] || 1);
const [accounts, setAccounts] = useState(() => loadStoredData("accounts", [{
  id: "1",
  name: "DIB (UAE)",
  type: "Bank",
  balance: 14500,
  currency: "AED",
  color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20"
}, {
  id: "2",
  name: "Fiverr",
  type: "Wallet",
  balance: 1250,
  currency: "USD",
  color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20"
}, {
  id: "3",
  name: "PayPal",
  type: "Wallet",
  balance: 850,
  currency: "USD",
  color: "from-sky-500/10 to-blue-500/10 border-sky-500/20"
}, {
  id: "4",
  name: "UBL Pakistan",
  type: "Bank",
  balance: 25e4,
  currency: "PKR",
  color: "from-amber-500/10 to-orange-500/10 border-amber-500/20"
}]));
const [assets, setAssets] = useState(() => loadStoredData("assets", [{
  id: "1",
  name: "Physical Gold (24k)",
  category: "Gold",
  weightGrams: 50,
  currency: "AED",
  purchasePriceAED: 11e3,
  currentPriceAED: 13750
}, {
  id: "2",
  name: "Downtown Apartment",
  category: "Property",
  currency: "AED",
  purchasePriceAED: 1e6,
  currentPriceAED: 12e5
}]));
const [loans, setLoans] = useState(() => loadStoredData("loans", [{
  id: "1",
  type: "lent",
  name: "Ahmad Khan",
  amount: 5e3,
  repaid: 2e3,
  currency: "AED",
  whatsapp: "+971501234567",
  dueDate: "2026-09-30"
}, {
  id: "2",
  type: "borrowed",
  name: "Family Support",
  amount: 2e4,
  repaid: 0,
  currency: "AED",
  whatsapp: "+971509876543",
  dueDate: "2026-12-31"
}]));
const [transactions, setTransactions] = useState(() => loadStoredData("transactions", [{
  id: "t1",
  title: "Monthly Salary",
  type: "income",
  category: "Salary",
  amount: 18e3,
  currency: "AED",
  accountId: "1",
  date: "2026-08-01"
}, {
  id: "t2",
  title: "Groceries",
  type: "expense",
  category: "Groceries",
  amount: 1200,
  currency: "AED",
  accountId: "1",
  date: "2026-08-03"
}, {
  id: "t3",
  title: "Wife Allowance",
  type: "expense",
  category: "Family",
  amount: 3e3,
  currency: "AED",
  accountId: "1",
  date: "2026-08-02"
}]));
const [budgets, setBudgets] = useState(() => loadStoredData("budgets", []));
const [goals, setGoals] = useState(() => loadStoredData("goals", []));
const [recurringItems, setRecurringItems] = useState(() => loadStoredData("recurringItems", []));
const [storageError, setStorageError] = useState(false);
const persistAllData = (newAccs, newAsts, newLoans, newTxns, newRates, newBudgets, newGoals, newRecurringItems) => {
  try {
    let existing = {};
    try {
      existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
    } catch (e) {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      accounts: newAccs,
      assets: newAsts,
      loans: newLoans,
      transactions: newTxns,
      rates: newRates || exchangeRates,
      budgets: newBudgets === void 0 ? Array.isArray(existing.budgets) ? existing.budgets : budgets : newBudgets,
      goals: newGoals === void 0 ? Array.isArray(existing.goals) ? existing.goals : goals : newGoals,
      recurringItems: newRecurringItems === void 0 ? Array.isArray(existing.recurringItems) ? existing.recurringItems : recurringItems : newRecurringItems
    }));
    if (storageError) setStorageError(false);
  } catch (e) {
    setStorageError(true);
  }
};
const [ratesModalOpen, setRatesModalOpen] = useState(false);
const [rateForm, setRateForm] = useState({
  USD: String(exchangeRates.USD),
  PKR: String(exchangeRates.PKR)
});
const openRatesModal = () => {
  setRateForm({
    USD: String(exchangeRates.USD),
    PKR: String(exchangeRates.PKR)
  });
  setRatesModalOpen(true);
};
const saveRates = e => {
  e.preventDefault();
  const usd = Number(rateForm.USD);
  const pkr = Number(rateForm.PKR);
  if (!usd || usd <= 0 || !pkr || pkr <= 0) {
    alert("Please enter valid positive rates.");
    return;
  }
  const newRates = {
    AED: 1,
    USD: usd,
    PKR: pkr
  };
  flashHeroForRateUpdate(newRates);
  setExchangeRates(newRates);
  persistAllData(accounts, assets, loans, transactions, newRates);
  setRatesModalOpen(false);
};
useEffect(() => {
  document.documentElement.classList.toggle("dark", darkMode);
  document.documentElement.classList.toggle("oled-dark", darkMode && Boolean(settings.oledBlack));
}, [darkMode, settings.oledBlack]);

// Shake-to-Mask / Shake-to-Undo hardware gesture detector
useEffect(() => {
  if (typeof window === "undefined" || !window.DeviceMotionEvent) return;
  let lastX = 0, lastY = 0, lastZ = 0, lastTime = 0;
  const SHAKE_THRESHOLD = 22; // m/s^2 delta

  const handleDeviceMotion = (e) => {
    if (settings.shakeToMask === false) return;
    const acc = e.accelerationIncludingGravity || e.acceleration;
    if (!acc) return;
    const now = Date.now();
    if (now - lastTime < 700) return; // Debounce shake triggers

    const deltaX = Math.abs(acc.x - lastX);
    const deltaY = Math.abs(acc.y - lastY);
    const deltaZ = Math.abs(acc.z - lastZ);

    if (deltaX + deltaY + deltaZ > SHAKE_THRESHOLD) {
      lastTime = now;
      if (triggerHaptic) triggerHaptic("medium");
      if (window.playSound) window.playSound("refresh");
      // On the Ledger tab with something to undo, shake undoes the last
      // recorded transaction instead of toggling privacy mode.
      if (activeTabRef.current === "transactions" && historyRef.current.length > 0) {
        handleUndoRef.current();
        showToast("Last transaction undone", "info");
      } else {
        const nextDiscrete = !settingsRef.current.discreteMode;
        updateSettings({ discreteMode: nextDiscrete });
        showToast(nextDiscrete ? "Discrete Mode enabled" : "Discrete Mode disabled", "info");
      }
    }

    lastX = acc.x || 0;
    lastY = acc.y || 0;
    lastZ = acc.z || 0;
  };

  window.addEventListener("devicemotion", handleDeviceMotion, { passive: true });
  return () => window.removeEventListener("devicemotion", handleDeviceMotion);
}, [settings.shakeToMask]);
const [history, setHistory] = useState([]);
const historyRef = useRef(history);
historyRef.current = history;
const [redoStack, setRedoStack] = useState([]);
const saveStateToHistory = () => {
  setHistory(prev => [...prev.slice(-15), {
    accounts,
    assets,
    loans,
    transactions
  }]);
  setRedoStack([]);
};
const handleUndo = () => {
  if (history.length === 0) return;
  triggerHaptic("medium");
  const previousState = history[history.length - 1];
  setRedoStack(prev => [{
    accounts,
    assets,
    loans,
    transactions
  }, ...prev]);
  setHistory(prev => prev.slice(0, prev.length - 1));
  setAccounts(previousState.accounts);
  setAssets(previousState.assets);
  setLoans(previousState.loans);
  setTransactions(previousState.transactions);
  persistAllData(previousState.accounts, previousState.assets, previousState.loans, previousState.transactions);
};
const handleUndoRef = useRef(handleUndo);
handleUndoRef.current = handleUndo;
const handleRedo = () => {
  if (redoStack.length === 0) return;
  triggerHaptic("medium");
  const nextState = redoStack[0];
  setHistory(prev => [...prev, {
    accounts,
    assets,
    loans,
    transactions
  }]);
  setRedoStack(redoStack.slice(1));
  setAccounts(nextState.accounts);
  setAssets(nextState.assets);
  setLoans(nextState.loans);
  setTransactions(nextState.transactions);
  persistAllData(nextState.accounts, nextState.assets, nextState.loans, nextState.transactions);
};
const [smsOpen, setSmsOpen] = useState(false);
const [smsText, setSmsText] = useState("");
const [smsParsed, setSmsParsed] = useState(null);
const [receiptModalOpen, setReceiptModalOpen] = useState(false);
const [widgetsModalOpen, setWidgetsModalOpen] = useState(false);
const [bankSmsModalOpen, setBankSmsModalOpen] = useState(false);
const [isAppLocked, setIsAppLocked] = useState(() => Boolean(settings.securityLockEnabled));

// Privacy Screen Blur and Auto-lock timer
useEffect(() => {
  let hideTimestamp = 0;
  const onVisibilityChange = () => {
    if (document.hidden) {
      hideTimestamp = Date.now();
      if (settings.privacyScreenBlur !== false) {
        document.documentElement.classList.add("privacy-blurred");
      }
    } else {
      document.documentElement.classList.remove("privacy-blurred");
      if (settings.securityLockEnabled && hideTimestamp > 0) {
        const elapsedMinutes = (Date.now() - hideTimestamp) / (1000 * 60);
        if (elapsedMinutes >= (settings.lockTimeoutMinutes || 1)) {
          setIsAppLocked(true);
        }
      }
    }
  };

  const onWindowBlur = () => {
    if (settings.privacyScreenBlur !== false) {
      document.documentElement.classList.add("privacy-blurred");
    }
  };

  const onWindowFocus = () => {
    document.documentElement.classList.remove("privacy-blurred");
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("blur", onWindowBlur);
  window.addEventListener("focus", onWindowFocus);

  return () => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("blur", onWindowBlur);
    window.removeEventListener("focus", onWindowFocus);
    document.documentElement.classList.remove("privacy-blurred");
  };
}, [settings.privacyScreenBlur, settings.securityLockEnabled, settings.lockTimeoutMinutes]);

// Push notifications due check on startup
useEffect(() => {
  if (settings.notificationsEnabled && typeof Notification !== "undefined" && Notification.permission === "granted") {
    // Check upcoming loans due or bills
    const dueLoans = loans.filter(l => l.dueDate && l.dueDate >= todayISO());
    if (dueLoans.length > 0) {
      const firstDue = dueLoans[0];
      const today = new Date();
      const dueDate = new Date(firstDue.dueDate);
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      if (diffDays <= 3 && diffDays >= 0) {
        Storage.sendLocalNotification("Upcoming Payment Alert", {
          body: `Reminder: Loan "${firstDue.person}" has a due date in ${diffDays} day${diffDays === 1 ? "" : "s"}.`
        });
      }
    }
  }
}, [settings.notificationsEnabled]);

const openReceiptScanner = () => setReceiptModalOpen(true);
const openWidgetsModal = () => setWidgetsModalOpen(true);
const openBankSmsModal = () => setBankSmsModalOpen(true);

const handleApplyScannedExpense = (parsed) => {
  const defaultAcc = accounts[0] || { id: "1", currency: "AED" };
  const amt = Number(parsed.amount) || 0;
  const newTx = {
    id: String(Date.now()),
    type: "expense",
    amount: amt,
    currency: parsed.currency || currency || "AED",
    accountId: defaultAcc.id,
    category: parsed.category || "Shopping",
    notes: parsed.merchant ? `Receipt: ${parsed.merchant}${parsed.notes ? ` (${parsed.notes})` : ""}` : "Scanned Receipt",
    date: parsed.date || todayISO(),
    receiptImage: parsed.receiptImage || null
  };
  const updatedAccounts = accounts.map(acc => {
    if (acc.id === defaultAcc.id) {
      return { ...acc, balance: Math.max(0, acc.balance - amt) };
    }
    return acc;
  });
  const nextTxns = [newTx, ...transactions];
  pushHistory();
  setAccounts(updatedAccounts);
  setTransactions(nextTxns);
  persistAllData(updatedAccounts, assets, loans, nextTxns);
  if (triggerHaptic) triggerHaptic("transaction");
};

const handleAddParsedTransaction = (parsed) => {
  const accId = parsed.accountId || (accounts[0] && accounts[0].id) || "1";
  const targetAcc = accounts.find(a => a.id === accId) || accounts[0];
  const amt = Number(parsed.amount) || 0;
  const isIncome = parsed.type === "income";
  const newTx = {
    id: String(Date.now()),
    type: isIncome ? "income" : "expense",
    amount: amt,
    currency: parsed.currency || (targetAcc && targetAcc.currency) || "AED",
    accountId: accId,
    category: parsed.category || (isIncome ? "Salary" : "Shopping"),
    notes: parsed.merchant ? `${parsed.merchant}${parsed.notes ? ` · ${parsed.notes}` : ""}` : (parsed.notes || "Bank SMS Alert"),
    date: parsed.date || todayISO()
  };
  const updatedAccounts = accounts.map(acc => {
    if (acc.id === accId) {
      const delta = isIncome ? amt : -amt;
      return { ...acc, balance: acc.balance + delta };
    }
    return acc;
  });
  const nextTxns = [newTx, ...transactions];
  pushHistory();
  setAccounts(updatedAccounts);
  setTransactions(nextTxns);
  persistAllData(updatedAccounts, assets, loans, nextTxns);
  if (triggerHaptic) triggerHaptic("transaction");
};

const [modalOpen, setModalOpen] = useState(false);
const [modalType, setModalType] = useState("income");
const [editingId, setEditingId] = useState(null);
const [repaymentModalLoan, setRepaymentModalLoan] = useState(null);
const [repayAmount, setRepayAmount] = useState("");
const [repayAccountId, setRepayAccountId] = useState("");
const [repayDate, setRepayDate] = useState(() => todayISO());
const [loanAddMoreTarget, setLoanAddMoreTarget] = useState(null);
const [addMoreAmount, setAddMoreAmount] = useState("");
const [addMoreAccountId, setAddMoreAccountId] = useState("");
const [addMoreDate, setAddMoreDate] = useState(() => todayISO());
const [expandedLoanHistory, setExpandedLoanHistory] = useState({});
const [ledgerSort, setLedgerSort] = useState("date_desc");
const [loanSort, setLoanSort] = useState("date_desc");
const [deleteTarget, setDeleteTarget] = useState(null);
const [loanView, setLoanView] = useState("lent");
const [ledgerSearch, setLedgerSearch] = useState("");
const [ledgerFilter, setLedgerFilter] = useState("all");
const [moreSheetOpen, setMoreSheetOpen] = useState(false);
const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
const [categoryType, setCategoryType] = useState("expense");
const [categoryName, setCategoryName] = useState("");
const [dangerAction, setDangerAction] = useState(null);
const [dangerPhrase, setDangerPhrase] = useState("");
const [planningEditor, setPlanningEditor] = useState(null);
const [budgetForm, setBudgetForm] = useState({
  id: null,
  category: "Groceries",
  amount: "",
  currency: "AED"
});
const [goalForm, setGoalForm] = useState({
  id: null,
  name: "",
  targetAmount: "",
  currentAmount: "",
  currency: "AED",
  targetDate: ""
});
const [recurringEditor, setRecurringEditor] = useState(null);
const [recurringForm, setRecurringForm] = useState({
  id: null,
  type: "expense",
  title: "",
  amount: "",
  currency: "AED",
  accountId: "",
  category: "Groceries",
  frequency: "monthly",
  nextDate: todayISO()
});
const [syncingRates, setSyncingRates] = useState(false);
const [rateSyncMsg, setRateSyncMsg] = useState("");
const [syncingGold, setSyncingGold] = useState(false);
const [goldSyncMsg, setGoldSyncMsg] = useState("");
const [liveGoldAEDPerGram, setLiveGoldAEDPerGram] = useState(null);
const netWorthWithRates = rates => {
  const liquid = accounts.reduce((sum, account) => sum + account.balance * (rates[account.currency] || 1), 0);
  const fixedAssets = assets.reduce((sum, asset) => sum + (asset.currentPriceAED || 0) * (rates[asset.currency || "AED"] || 1), 0);
  const lent = loans.filter(loan => loan.type === "lent").reduce((sum, loan) => sum + (loan.amount - (loan.repaid || 0)) * (rates[loan.currency] || 1), 0);
  const borrowed = loans.filter(loan => loan.type === "borrowed").reduce((sum, loan) => sum + (loan.amount - (loan.repaid || 0)) * (rates[loan.currency] || 1), 0);
  return liquid + fixedAssets + lent - borrowed;
};
const flashHeroForRateUpdate = nextRates => setHeroFlash(netWorthWithRates(nextRates) >= netWorthWithRates(exchangeRates) ? "gain" : "loss");
const flashHeroForGoldRate = nextRate => {
  const goldWeight = assets.filter(asset => asset.category === "Gold" && asset.weightGrams).reduce((sum, asset) => sum + Number(asset.weightGrams), 0);
  const savedGoldRate = goldWeight > 0 ? assets.filter(asset => asset.category === "Gold" && asset.weightGrams).reduce((sum, asset) => sum + convertToAED(asset.currentPriceAED || 0, asset.currency || "AED"), 0) / goldWeight : 0;
  setHeroFlash(nextRate >= (liveGoldAEDPerGram || savedGoldRate || nextRate) ? "gain" : "loss");
};
const syncLiveExchangeRates = async () => {
  setSyncingRates(true);
  setRateSyncMsg("");
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/AED");
    const json = await res.json();
    if (!json || !json.rates || !json.rates.USD || !json.rates.PKR) throw new Error("bad response");
    const newRates = {
      AED: 1,
      USD: 1 / json.rates.USD,
      PKR: 1 / json.rates.PKR
    };
    flashHeroForRateUpdate(newRates);
    setExchangeRates(newRates);
    setRateForm({
      USD: newRates.USD.toFixed(4),
      PKR: newRates.PKR.toFixed(4)
    });
    persistAllData(accounts, assets, loans, transactions, newRates);
    setRateSyncMsg("Synced live rates just now.");
    return newRates;
  } catch (err) {
    setRateSyncMsg("Couldn't fetch live rates \u2014 check your internet connection and try again.");
    return exchangeRates;
  } finally {
    setSyncingRates(false);
  }
};
const syncLiveGoldRate = async (rates = exchangeRates) => {
  setSyncingGold(true);
  setGoldSyncMsg("");
  try {
    const res = await fetch("https://api.gold-api.com/price/XAU");
    const json = await res.json();
    const pricePerOzUSD = json && json.price;
    if (!pricePerOzUSD) throw new Error("bad response");
    const aedPerUsd = rates.USD || 3.67;
    const aedPerGram = pricePerOzUSD * aedPerUsd / 31.1034768;
    flashHeroForGoldRate(aedPerGram);
    setLiveGoldAEDPerGram(aedPerGram);
    setGoldSyncMsg(`Live 24k spot rate: AED ${aedPerGram.toFixed(2)} / gram`);
  } catch (err) {
    setLiveGoldAEDPerGram(null);
    setGoldSyncMsg("Couldn't fetch a live gold rate \u2014 check your internet connection and try again.");
  } finally {
    setSyncingGold(false);
  }
};
const applyLiveGoldRate = () => {
  if (!liveGoldAEDPerGram) return;
  saveStateToHistory();
  const previousGoldValue = assets.filter(a => a.category === "Gold").reduce((sum, a) => sum + convertToAED(a.currentPriceAED || 0, a.currency || "AED"), 0);
  const updated = assets.map(a => a.category === "Gold" && a.weightGrams ? {
    ...a,
    currentPriceAED: Math.round(convertFromAED(a.weightGrams * liveGoldAEDPerGram, a.currency || "AED") * 100) / 100
  } : a);
  const updatedGoldValue = updated.filter(a => a.category === "Gold").reduce((sum, a) => sum + convertToAED(a.currentPriceAED || 0, a.currency || "AED"), 0);
  setHeroFlash(updatedGoldValue >= previousGoldValue ? "gain" : "loss");
  setAssets(updated);
  persistAllData(accounts, updated, loans, transactions);
  setGoldSyncMsg(`Applied AED ${liveGoldAEDPerGram.toFixed(2)}/gram to your gold holdings.`);
};
const refreshLiveRates = async () => {
  const freshRates = await syncLiveExchangeRates();
  await syncLiveGoldRate(freshRates);
};
useEffect(() => {
  if (settings.liveRateSync !== false) refreshLiveRates();
}, [settings.liveRateSync]);
const getDefaultFormInput = (overrides = {}) => ({
  title: "",
  category: "Salary",
  amount: "",
  currency: "AED",
  accountId: (accounts[0] ? accounts[0].id : "") || "",
  toAccountId: (accounts[1] ? accounts[1].id : "") || (accounts[0] ? accounts[0].id : "") || "",
  weightGrams: "",
  purchasePriceAED: "",
  currentPriceAED: "",
  assetCategory: "Gold",
  loanType: "lent",
  whatsapp: "",
  dueDate: "",
  accType: "Bank",
  date: todayISO(),
  ...overrides
});
const [formInput, setFormInput] = useState(() => getDefaultFormInput());
const openAddModal = (type, overrides = {}) => {
  triggerHaptic("light");
  if (["income", "expense", "transfer"].includes(type) && accounts.length === 0) {
    alert("Add an account first before recording transactions.");
    setActiveTab("accounts");
    return;
  }
  if (type === "transfer" && accounts.length < 2) {
    alert("You need at least two accounts to make a transfer.");
    setActiveTab("accounts");
    return;
  }
  setEditingId(null);
  setModalType(type);
  setFormInput(getDefaultFormInput(overrides));
  setModalOpen(true);
};
const openEditModal = (type, item) => {
  setEditingId(item.id);
  setModalType(type);
  const base = getDefaultFormInput();
  if (type === "account") {
    setFormInput({
      ...base,
      title: item.name,
      amount: String(item.balance),
      currency: item.currency,
      accType: item.type || "Bank"
    });
  } else if (type === "asset") {
    setFormInput({
      ...base,
      title: item.name,
      assetCategory: item.category,
      weightGrams: item.weightGrams ? String(item.weightGrams) : "",
      currency: item.currency || "AED",
      purchasePriceAED: String(item.purchasePriceAED),
      currentPriceAED: String(item.currentPriceAED)
    });
  } else if (type === "loan") {
    setFormInput({
      ...base,
      title: item.name,
      amount: String(item.amount),
      currency: item.currency,
      loanType: item.type,
      whatsapp: item.whatsapp || "",
      dueDate: item.dueDate || ""
    });
  } else if (type === "income" || type === "expense") {
    setFormInput({
      ...base,
      title: item.title,
      category: item.category,
      amount: String(item.amount),
      currency: item.currency,
      accountId: item.accountId,
      date: item.date
    });
  } else if (type === "transfer") {
    setFormInput({
      ...base,
      amount: String(item.amount),
      accountId: item.accountId,
      toAccountId: item.toAccountId,
      date: item.date
    });
  }
  setModalOpen(true);
};
const closeModal = () => {
  setModalOpen(false);
  setEditingId(null);
  setFormInput(getDefaultFormInput());
};
const totalLiquidAED = accounts.reduce((acc, item) => acc + convertToAED(item.balance, item.currency), 0);
const totalPhysicalAED = assets.reduce((acc, item) => acc + convertToAED(item.currentPriceAED || 0, item.currency || "AED"), 0);
const goldAssets = assets.filter(item => item.category === "Gold");
const goldPurchaseAED = goldAssets.reduce((acc, item) => acc + convertToAED(item.purchasePriceAED || 0, item.currency || "AED"), 0);
const goldCurrentAED = goldAssets.reduce((acc, item) => acc + convertToAED(item.currentPriceAED || 0, item.currency || "AED"), 0);
const goldChangeAED = goldCurrentAED - goldPurchaseAED;
const goldChangePct = goldPurchaseAED > 0 ? goldChangeAED / goldPurchaseAED * 100 : null;
const totalLoansLentAED = loans.filter(l => l.type === "lent").reduce((acc, l) => acc + convertToAED(l.amount - (l.repaid || 0), l.currency), 0);
const totalLoansBorrowedAED = loans.filter(l => l.type === "borrowed").reduce((acc, l) => acc + convertToAED(l.amount - (l.repaid || 0), l.currency), 0);
const sortedLoans = useMemo(() => {
  const list = [...loans];
  if (loanSort === "date_asc") list.sort((a, b) => (a.date || "").localeCompare(b.date || ""));else if (loanSort === "date_desc") list.sort((a, b) => (b.date || "").localeCompare(a.date || ""));else if (loanSort === "amount_desc") list.sort((a, b) => b.amount - (b.repaid || 0) - (a.amount - (a.repaid || 0)));else if (loanSort === "amount_asc") list.sort((a, b) => a.amount - (a.repaid || 0) - (b.amount - (b.repaid || 0)));else if (loanSort === "name") list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  return list;
}, [loans, loanSort]);
const netWorthWithoutFixedAssets = totalLiquidAED + totalLoansLentAED - totalLoansBorrowedAED;
const netWorthTotal = totalLiquidAED + totalPhysicalAED + totalLoansLentAED - totalLoansBorrowedAED;
const now = /* @__PURE__ */new Date();
const currentMonthPrefix = toLocalISO(now).slice(0, 7);
const currentMonthLabel = now.toLocaleString("en-US", {
  month: "long",
  year: "numeric"
});
const todayStr = todayISO();
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = toLocalISO(tomorrow);
const recurringReminders = recurringItems.filter(item => item.active && item.nextDate === tomorrowStr && !(item.reminderDoneDates || []).includes(tomorrowStr));
const monthlyTransactions = transactions.filter(t => t.date && t.date.startsWith(currentMonthPrefix));
const monthlyIncomeAED = monthlyTransactions.filter(t => t.type === "income").reduce((acc, t) => acc + convertTxToAED(t), 0);
const monthlyExpenseAED = monthlyTransactions.filter(t => t.type === "expense").reduce((acc, t) => acc + convertTxToAED(t), 0);
const monthlySavingsAED = monthlyIncomeAED - monthlyExpenseAED;
const savingsRate = monthlyIncomeAED > 0 ? Math.round(monthlySavingsAED / monthlyIncomeAED * 100) : null;
const emergencyRunwayMonths = monthlyExpenseAED > 0 ? (totalLiquidAED / monthlyExpenseAED).toFixed(1) : totalLiquidAED > 0 ? "12+" : "0";
const runwayMonthsNum = emergencyRunwayMonths === "12+" ? 12 : Number(emergencyRunwayMonths);
const runwayStatus = monthlyExpenseAED <= 0 ? {
  label: "No spending logged yet",
  cls: "bg-zinc-500/10 text-zinc-400"
} : runwayMonthsNum >= 6 ? {
  label: "Healthy buffer",
  cls: "bg-emerald-500/10 text-emerald-500"
} : runwayMonthsNum >= 3 ? {
  label: "Moderate buffer",
  cls: "bg-amber-500/10 text-amber-500"
} : {
  label: "Low buffer",
  cls: "bg-rose-500/10 text-rose-500"
};
const categoryBreakdown = useMemo(() => {
  const map = {};
  monthlyTransactions.filter(t => t.type === "expense").forEach(t => {
    map[t.category] = (map[t.category] || 0) + convertTxToAED(t);
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}, [monthlyTransactions, currency]);
const fmt = amtAED => {
  const converted = convertFromAED(amtAED, currency);
  return `${currency} ${numFmt(converted, {
    maximumFractionDigits: 0
  })}`;
};
const getLastInflow = accId => {
  const accountKey = String(accId);
  const inflows = transactions.filter(t => (t.type === "income" && String(t.accountId) === accountKey) || (t.type === "transfer" && String(t.toAccountId) === accountKey));
  if (inflows.length === 0) return null;
  const latest = inflows.slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  return latest.date >= toLocalISO(cutoff) ? latest : null;
};
const getLastOutflow = accId => {
  const accountKey = String(accId);
  const outflows = transactions.filter(t => (t.type === "expense" && String(t.accountId) === accountKey) || (t.type === "transfer" && String(t.accountId) === accountKey));
  if (outflows.length === 0) return null;
  const latest = outflows.slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  return latest.date >= toLocalISO(cutoff) ? latest : null;
};
const describeAccountMovement = (tx, acc) => {
  if (tx.type === "transfer") {
    if (tx.toAccountId === acc.id) return {
      amt: tx.toAmount ?? tx.amount,
      cur: tx.toCurrency || acc.currency,
      note: " (transfer in)"
    };
    return {
      amt: tx.amount,
      cur: tx.currency,
      note: " (transfer out)"
    };
  }
  return {
    amt: tx.accountAmount ?? tx.amount,
    cur: acc.currency,
    note: ""
  };
};
const monthlyHistory = useMemo(() => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-US", {
      month: "short"
    });
    const txns = transactions.filter(t => t.date && t.date.startsWith(prefix));
    const inc = txns.filter(t => t.type === "income").reduce((a, t) => a + convertTxToAED(t), 0);
    const exp = txns.filter(t => t.type === "expense").reduce((a, t) => a + convertTxToAED(t), 0);
    months.push({
      key: prefix,
      label,
      inc,
      exp,
      net: inc - exp
    });
  }
  return months;
}, [transactions, exchangeRates]);
const maxMonthlyVal = Math.max(1, ...monthlyHistory.map(m => Math.max(m.inc, m.exp)));
const yearlyHistory = useMemo(() => {
  const years = [];
  for (let i = 4; i >= 0; i--) {
    const year = now.getFullYear() - i;
    const prefix = `${year}-`;
    const txns = transactions.filter(t => t.date && t.date.startsWith(prefix));
    const inc = txns.filter(t => t.type === "income").reduce((a, t) => a + convertTxToAED(t), 0);
    const exp = txns.filter(t => t.type === "expense").reduce((a, t) => a + convertTxToAED(t), 0);
    years.push({
      key: String(year),
      label: String(year),
      inc,
      exp,
      net: inc - exp
    });
  }
  return years;
}, [transactions, exchangeRates]);
const avgMonthlyNet = monthlyHistory.reduce((a, m) => a + m.net, 0) / monthlyHistory.length;
const bestMonth = monthlyHistory.reduce((best, m) => best === null || m.net > best.net ? m : best, null);
const lastFullMonth = monthlyHistory[monthlyHistory.length - 2];
const momDeltaPct = lastFullMonth && lastFullMonth.net !== 0 ? Math.round((monthlySavingsAED - lastFullMonth.net) / Math.abs(lastFullMonth.net) * 100) : null;
const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";
const biggestExpenseThisMonth = monthlyTransactions.filter(t => t.type === "expense").reduce((biggest, t) => {
  const aed = convertTxToAED(t);
  return !biggest || aed > biggest.aed ? {
    ...t,
    aed
  } : biggest;
}, null);
const filteredTransactions = useMemo(() => {
  const q = ledgerSearch.trim().toLowerCase();
  const list = transactions.filter(t => {
    const matchesType = ledgerFilter === "all" || t.type === ledgerFilter;
    const matchesSearch = !q || t.title.toLowerCase().includes(q) || (t.category || "").toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });
  const sorted = [...list];
  if (ledgerSort === "date_asc") sorted.sort((a, b) => (a.date || "").localeCompare(b.date || ""));else if (ledgerSort === "date_desc") sorted.sort((a, b) => (b.date || "").localeCompare(a.date || ""));else if (ledgerSort === "amount_desc") sorted.sort((a, b) => (b.amount || 0) - (a.amount || 0));else if (ledgerSort === "amount_asc") sorted.sort((a, b) => (a.amount || 0) - (b.amount || 0));
  return sorted;
}, [transactions, ledgerSearch, ledgerFilter, ledgerSort]);
const parseBankTransactionSMS = sms => {
  const text = String(sms || "").replace(/\s+/g, " ").trim();
  if (!text) return null;
  const lower = text.toLowerCase();
  const amountMatch = text.match(/(?:aed|dhs?|dirhams?|usd|\$|pkr|rs\.?|inr|sar|qar)\s*([0-9][0-9,]*(?:\.\d{1,2})?)/i) || text.match(/(?:amount|amt|for|of|debited|credited|spent|paid|received)\s*(?:is|:|-)?\s*([0-9][0-9,]*(?:\.\d{1,2})?)/i);
  if (!amountMatch) return null;
  const amount = Number(amountMatch[1].replace(/,/g, ""));
  if (!(amount > 0)) return null;
  const currencyMatch = text.match(/\b(AED|DHS?|USD|PKR|INR|SAR|QAR)\b|\$/i);
  const rawCurrency = currencyMatch ? currencyMatch[0].toUpperCase() : null;
  const currency = rawCurrency === "DHS" || rawCurrency === "DHS?" ? "AED" : rawCurrency === "$" ? "USD" : ["AED","USD","PKR"].includes(rawCurrency) ? rawCurrency : (accounts[0]?.currency || "AED");
  const isTransfer = /transfer|transferred|funds transfer|internal transfer|iban transfer/i.test(lower);
  const isCredit = /salary|payroll|wage|credited|credit(ed)?|received|deposit|cash deposit|inward/i.test(lower);
  const isDebit = /debit(ed)?|purchase|spent|payment|withdraw|paid/i.test(lower);
  const type = isTransfer ? (isCredit && !isDebit ? "income" : "expense") : isCredit && !isDebit ? "income" : "expense";
  let category = type === "income" ? (/salary|payroll|wage/i.test(lower) ? "Salary" : isTransfer ? "Transfer" : "Other") : isTransfer ? "Transfer" : "Other";
  if (type === "expense") {
    if (/grocery|supermarket|lulu|carrefour|spinneys|union coop/i.test(lower)) category = "Groceries";
    else if (/rent|property|housing/i.test(lower)) category = "Rent";
    else if (/restaurant|cafe|coffee|dining|talabat|deliveroo/i.test(lower)) category = "Dining";
    else if (/fuel|petrol|salik|taxi|uber|careem|transport/i.test(lower)) category = "Transport";
    else if (/shopping|mall|amazon|noon/i.test(lower)) category = "Shopping";
    else if (/utility|dewa|etisalat|du\b|internet|electric/i.test(lower)) category = "Utilities";
    else if (/family|wife|allowance/i.test(lower)) category = "Family";
  }
  const dateMatch = text.match(/\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})\b/);
  const date = dateMatch ? `${String(dateMatch[3]).length === 2 ? `20${dateMatch[3]}` : dateMatch[3]}-${String(dateMatch[2]).padStart(2,"0")}-${String(dateMatch[1]).padStart(2,"0")}` : todayISO();
  const accountHint = text.match(/(?:card|a\/c|account|acct|ending|xx|\*{2,})[^0-9]{0,8}(\d{3,6})/i)?.[1] || text.match(/\b(\d{4})\b/)?.[1] || "";
  let account = accountHint ? accounts.find(a => String(a.name).toLowerCase().includes(lower.match(/[a-z]{2,}/)?.[0] || "never") || String(a.id).endsWith(accountHint) || String(a.name).toLowerCase().includes(accountHint)) : null;
  if (!account && accounts.length === 1) account = accounts[0];
  if (!account) account = accounts.find(a => a.currency === currency) || accounts[0] || null;
  let title = type === "income" ? (category === "Salary" ? "Salary" : isTransfer ? "Bank transfer" : "Bank income") : isTransfer ? "Bank transfer" : "Bank transaction";
  const merchantMatch = text.match(/(?:at|to|from|merchant|pos|purchase|payment)\s*[:\-]?\s*([A-Za-z][A-Za-z0-9 &'._-]{2,40})/i);
  if (merchantMatch) title = merchantMatch[1].trim().replace(/[.,;:]+$/, "");
  return { type, category, amount, currency, accountId: account?.id || "", accountName: account?.name || "Select account", date, title, source: text };
};
const importBankTransactionFromSMS = parsed => {
  if (!parsed || !parsed.accountId) {
    alert("I couldn't confidently match this SMS to an account. Please add/select the bank account first.");
    return false;
  }
  const targetAcc = accounts.find(a => a.id === parsed.accountId);
  if (!targetAcc) return false;
  const amount = Number(parsed.amount);
  if (!(amount > 0)) return false;
  saveStateToHistory();
  const accountAmt = convertFromAED(convertToAED(amount, parsed.currency), targetAcc.currency);
  const tx = {
    id: makeId(), title: parsed.title || "Bank transaction", type: parsed.type, category: parsed.category || "Other",
    amount, currency: parsed.currency, rateToAED: exchangeRates[parsed.currency] || 1, accountAmount: accountAmt,
    accountId: targetAcc.id, date: parsed.date || todayISO(), source: "bank-sms"
  };
  const updatedAccs = accounts.map(a => a.id === targetAcc.id ? { ...a, balance: a.balance + (parsed.type === "income" ? accountAmt : parsed.type === "expense" ? -accountAmt : 0) } : a);
  const updatedTxns = [tx, ...transactions];
  setAccounts(updatedAccs); setTransactions(updatedTxns);
  persistAllData(updatedAccs, assets, loans, updatedTxns, exchangeRates, budgets, goals, recurringItems);
  triggerHaptic("success");
  return true;
};
const handleFormSubmit = e => {
  e.preventDefault();
  const amt = Number(formInput.amount);
  if (["income", "expense", "transfer", "loan"].includes(modalType) && !(amt > 0)) {
    alert("Please enter an amount greater than zero.");
    return;
  }
  if (modalType === "asset") {
    if (Number(formInput.purchasePriceAED) < 0 || Number(formInput.currentPriceAED) < 0) {
      alert("Asset prices cannot be negative.");
      return;
    }
  }
  if (modalType === "transfer") {
    const fromAcc = accounts.find(a => a.id === formInput.accountId);
    const toAcc = accounts.find(a => a.id === formInput.toAccountId);
    if (!fromAcc || !toAcc) {
      alert("Please select valid accounts.");
      return;
    }
    if (fromAcc.id === toAcc.id) {
      alert("From and To accounts must be different.");
      return;
    }
  }
  if (["income", "expense"].includes(modalType) && !accounts.find(a => a.id === formInput.accountId)) {
    alert("Please select a valid account.");
    return;
  }
  saveStateToHistory();
  let updatedAccs = [...accounts];
  let updatedAsts = [...assets];
  let updatedLoans = [...loans];
  let updatedTxns = [...transactions];
  if (modalType === "account") {
    if (editingId) {
      const prevAcc = accounts.find(acc => acc.id === editingId);
      updatedAccs = accounts.map(acc => acc.id === editingId ? {
        ...acc,
        name: formInput.title,
        type: formInput.accType,
        balance: amt,
        currency: formInput.currency
      } : acc);
      if (prevAcc && prevAcc.currency === formInput.currency && Math.abs(amt - prevAcc.balance) > 1e-9) {
        const delta = amt - prevAcc.balance;
        const adjTx = {
          id: makeId(),
          title: `Balance adjustment: ${formInput.title}`,
          type: delta > 0 ? "income" : "expense",
          category: "Balance Adjustment",
          amount: Math.abs(delta),
          currency: formInput.currency,
          rateToAED: exchangeRates[formInput.currency] || 1,
          accountAmount: Math.abs(delta),
          accountId: editingId,
          date: todayISO()
        };
        updatedTxns = [adjTx, ...transactions];
        setTransactions(updatedTxns);
      }
    } else {
      updatedAccs.push({
        id: makeId(),
        name: formInput.title,
        type: formInput.accType,
        balance: amt,
        currency: formInput.currency,
        color: ACCOUNT_COLORS[accounts.length % ACCOUNT_COLORS.length]
      });
    }
    setAccounts(updatedAccs);
  } else if (modalType === "asset") {
    const curVal = Number(formInput.currentPriceAED) || 0;
    const purVal = Number(formInput.purchasePriceAED) || 0;
    if (editingId) {
      updatedAsts = assets.map(a => a.id === editingId ? {
        ...a,
        name: formInput.title,
        category: formInput.assetCategory,
        weightGrams: Number(formInput.weightGrams) || 0,
        currency: formInput.currency,
        purchasePriceAED: purVal,
        currentPriceAED: curVal
      } : a);
    } else {
      updatedAsts.push({
        id: makeId(),
        name: formInput.title,
        category: formInput.assetCategory,
        weightGrams: Number(formInput.weightGrams) || 0,
        currency: formInput.currency,
        purchasePriceAED: purVal,
        currentPriceAED: curVal
      });
    }
    setAssets(updatedAsts);
  } else if (modalType === "loan") {
    if (editingId) {
      updatedLoans = loans.map(l => l.id === editingId ? {
        ...l,
        type: formInput.loanType,
        name: formInput.title,
        amount: amt,
        repaid: Math.min(l.repaid || 0, amt),
        currency: formInput.currency,
        whatsapp: formInput.whatsapp,
        dueDate: formInput.dueDate
      } : l);
      setLoans(updatedLoans);
    } else {
      const newLoanId = makeId();
      const loanAcc = formInput.accountId ? accounts.find(a => a.id === formInput.accountId) : null;
      const movements = [{
        id: makeId(),
        kind: "principal",
        amount: amt,
        date: formInput.date,
        accountId: loanAcc ? loanAcc.id : null
      }];
      if (loanAcc) {
        const accAmt = convertFromAED(convertToAED(amt, formInput.currency), loanAcc.currency);
        const delta = formInput.loanType === "lent" ? -accAmt : accAmt;
        updatedAccs = accounts.map(a => a.id === loanAcc.id ? {
          ...a,
          balance: a.balance + delta
        } : a);
        setAccounts(updatedAccs);
        const loanTx = {
          id: makeId(),
          title: `${formInput.loanType === "lent" ? "Loan to" : "Loan from"} ${formInput.title}`,
          type: formInput.loanType === "lent" ? "expense" : "income",
          category: "Loan",
          amount: accAmt,
          currency: loanAcc.currency,
          rateToAED: exchangeRates[loanAcc.currency] || 1,
          accountAmount: accAmt,
          accountId: loanAcc.id,
          date: formInput.date,
          loanId: newLoanId
        };
        updatedTxns = [loanTx, ...transactions];
        setTransactions(updatedTxns);
      }
      updatedLoans.push({
        id: newLoanId,
        type: formInput.loanType,
        name: formInput.title,
        amount: amt,
        repaid: 0,
        currency: formInput.currency,
        whatsapp: formInput.whatsapp,
        dueDate: formInput.dueDate,
        date: formInput.date,
        movements
      });
      setLoans(updatedLoans);
    }
  } else if (modalType === "transfer") {
    const fromAcc = accounts.find(a => a.id === formInput.accountId);
    const toAcc = accounts.find(a => a.id === formInput.toAccountId);
    let accsWorking = [...accounts];
    if (editingId) {
      const oldTx = transactions.find(t => t.id === editingId);
      if (oldTx) {
        accsWorking = accsWorking.map(acc => {
          if (acc.id === oldTx.accountId) return {
            ...acc,
            balance: acc.balance + oldTx.amount
          };
          if (acc.id === oldTx.toAccountId) return {
            ...acc,
            balance: acc.balance - (oldTx.toAmount != null ? oldTx.toAmount : oldTx.amount)
          };
          return acc;
        });
      }
    }
    const convertedAmt = convertFromAED(convertToAED(amt, fromAcc.currency), toAcc.currency);
    updatedAccs = accsWorking.map(acc => {
      if (acc.id === fromAcc.id) return {
        ...acc,
        balance: acc.balance - amt
      };
      if (acc.id === toAcc.id) return {
        ...acc,
        balance: acc.balance + convertedAmt
      };
      return acc;
    });
    setAccounts(updatedAccs);
    const txPayload = {
      id: editingId || makeId(),
      title: `Transfer: ${fromAcc.name} \u2192 ${toAcc.name}`,
      type: "transfer",
      category: "Transfer",
      amount: amt,
      currency: fromAcc.currency,
      rateToAED: exchangeRates[fromAcc.currency] || 1,
      accountId: fromAcc.id,
      toAmount: convertedAmt,
      toCurrency: toAcc.currency,
      toAccountId: toAcc.id,
      date: formInput.date
    };
    updatedTxns = editingId ? transactions.map(t => t.id === editingId ? txPayload : t) : [txPayload, ...transactions];
    setTransactions(updatedTxns);
  } else if (["income", "expense"].includes(modalType)) {
    const targetAcc = accounts.find(a => a.id === formInput.accountId);
    let accsWorking = [...accounts];
    if (editingId) {
      const oldTx = transactions.find(t => t.id === editingId);
      if (oldTx && oldTx.accountId) {
        const oldAccAmt = oldTx.accountAmount != null ? oldTx.accountAmount : oldTx.amount;
        accsWorking = accsWorking.map(acc => {
          if (acc.id === oldTx.accountId) {
            const revDelta = oldTx.type === "income" ? -oldAccAmt : oldAccAmt;
            return {
              ...acc,
              balance: acc.balance + revDelta
            };
          }
          return acc;
        });
      }
    }
    const accountAmt = convertFromAED(convertToAED(amt, formInput.currency), targetAcc.currency);
    const txPayload = {
      id: editingId || makeId(),
      title: formInput.title,
      type: modalType,
      category: formInput.category,
      amount: amt,
      currency: formInput.currency,
      rateToAED: exchangeRates[formInput.currency] || 1,
      accountAmount: accountAmt,
      accountId: formInput.accountId,
      date: formInput.date
    };
    updatedAccs = accsWorking.map(acc => {
      if (acc.id === targetAcc.id) {
        const delta = modalType === "income" ? accountAmt : -accountAmt;
        return {
          ...acc,
          balance: acc.balance + delta
        };
      }
      return acc;
    });
    setAccounts(updatedAccs);
    updatedTxns = editingId ? transactions.map(t => t.id === editingId ? txPayload : t) : [txPayload, ...transactions];
    setTransactions(updatedTxns);
  }
  persistAllData(updatedAccs, updatedAsts, updatedLoans, updatedTxns);
  if (["income", "expense", "transfer"].includes(modalType)) {
    triggerHaptic("success");
  } else if (["loan", "account", "asset"].includes(modalType)) {
    triggerHaptic("medium");
  }
  closeModal();
};
const handleRepaymentSubmit = e => {
  e.preventDefault();
  if (!repaymentModalLoan) return;
  const amt = Number(repayAmount);
  if (!(amt > 0)) {
    alert("Please enter a repayment amount greater than zero.");
    return;
  }
  const outstanding = repaymentModalLoan.amount - (repaymentModalLoan.repaid || 0);
  if (amt > outstanding + 1e-4) {
    alert(`This repayment (${repaymentModalLoan.currency} ${amt.toLocaleString()}) is more than the outstanding balance (${repaymentModalLoan.currency} ${outstanding.toLocaleString()}). Please enter an amount up to the outstanding balance.`);
    return;
  }
  saveStateToHistory();
  const loan = repaymentModalLoan;
  const repayDateVal = repayDate || todayISO();
  const updatedLoans = loans.map(l => l.id === loan.id ? {
    ...l,
    repaid: (l.repaid || 0) + amt,
    movements: [...(l.movements || []), {
      id: makeId(),
      kind: "repayment",
      amount: amt,
      date: repayDateVal,
      accountId: repayAccountId || null
    }]
  } : l);
  let updatedAccs = accounts;
  let updatedTxns = transactions;
  if (repayAccountId) {
    const acc = accounts.find(a => a.id === repayAccountId);
    if (acc) {
      const accAmt = convertFromAED(convertToAED(amt, loan.currency), acc.currency);
      const delta = loan.type === "lent" ? accAmt : -accAmt;
      updatedAccs = accounts.map(a => a.id === acc.id ? {
        ...a,
        balance: a.balance + delta
      } : a);
      const newTx = {
        id: makeId(),
        title: `${loan.type === "lent" ? "Repayment from" : "Repayment to"} ${loan.name}`,
        type: loan.type === "lent" ? "income" : "expense",
        category: "Loan Repayment",
        amount: accAmt,
        currency: acc.currency,
        rateToAED: exchangeRates[acc.currency] || 1,
        accountId: acc.id,
        date: repayDateVal,
        loanId: loan.id
      };
      updatedTxns = [newTx, ...transactions];
    }
  }
  setLoans(updatedLoans);
  setAccounts(updatedAccs);
  setTransactions(updatedTxns);
  persistAllData(updatedAccs, assets, updatedLoans, updatedTxns);
  triggerHaptic("success");
  setRepaymentModalLoan(null);
  setRepayAmount("");
  setRepayAccountId("");
};
const handleAddMoreSubmit = e => {
  e.preventDefault();
  if (!loanAddMoreTarget) return;
  const amt = Number(addMoreAmount);
  if (!(amt > 0)) {
    alert("Please enter an amount greater than zero.");
    return;
  }
  saveStateToHistory();
  const loan = loanAddMoreTarget;
  const addDateVal = addMoreDate || todayISO();
  const updatedLoans = loans.map(l => l.id === loan.id ? {
    ...l,
    amount: l.amount + amt,
    movements: [...(l.movements || []), {
      id: makeId(),
      kind: "principal",
      amount: amt,
      date: addDateVal,
      accountId: addMoreAccountId || null
    }]
  } : l);
  let updatedAccs = accounts;
  let updatedTxns = transactions;
  if (addMoreAccountId) {
    const acc = accounts.find(a => a.id === addMoreAccountId);
    if (acc) {
      const accAmt = convertFromAED(convertToAED(amt, loan.currency), acc.currency);
      const delta = loan.type === "lent" ? -accAmt : accAmt;
      updatedAccs = accounts.map(a => a.id === acc.id ? {
        ...a,
        balance: a.balance + delta
      } : a);
      const newTx = {
        id: makeId(),
        title: `${loan.type === "lent" ? "Loan to" : "Loan from"} ${loan.name}`,
        type: loan.type === "lent" ? "expense" : "income",
        category: "Loan",
        amount: accAmt,
        currency: acc.currency,
        rateToAED: exchangeRates[acc.currency] || 1,
        accountId: acc.id,
        date: addDateVal,
        loanId: loan.id
      };
      updatedTxns = [newTx, ...transactions];
    }
  }
  setLoans(updatedLoans);
  setAccounts(updatedAccs);
  setTransactions(updatedTxns);
  persistAllData(updatedAccs, assets, updatedLoans, updatedTxns);
  triggerHaptic("success");
  setLoanAddMoreTarget(null);
  setAddMoreAmount("");
  setAddMoreAccountId("");
};
const confirmDelete = () => {
  if (!deleteTarget) return;
  saveStateToHistory();
  let updatedAccs = [...accounts];
  let updatedAsts = [...assets];
  let updatedLoans = [...loans];
  let updatedTxns = [...transactions];
  if (deleteTarget.type === "transaction") {
    const tx = transactions.find(t => t.id === deleteTarget.id);
    if (tx) {
      if (tx.type === "transfer") {
        updatedAccs = accounts.map(acc => {
          if (acc.id === tx.accountId) return {
            ...acc,
            balance: acc.balance + tx.amount
          };
          if (acc.id === tx.toAccountId) return {
            ...acc,
            balance: acc.balance - (tx.toAmount != null ? tx.toAmount : tx.amount)
          };
          return acc;
        });
      } else if (tx.accountId) {
        const accAmt = tx.accountAmount != null ? tx.accountAmount : tx.amount;
        updatedAccs = accounts.map(acc => {
          if (acc.id === tx.accountId) {
            const revDelta = tx.type === "income" ? -accAmt : accAmt;
            return {
              ...acc,
              balance: acc.balance + revDelta
            };
          }
          return acc;
        });
      }
      setAccounts(updatedAccs);
    }
    updatedTxns = transactions.filter(t => t.id !== deleteTarget.id);
    setTransactions(updatedTxns);
  } else if (deleteTarget.type === "account") {
    const accId = deleteTarget.id;
    let accs = accounts.filter(a => a.id !== accId);
    const relatedTxns = transactions.filter(t => t.accountId === accId || t.toAccountId === accId);
    relatedTxns.forEach(t => {
      if (t.type === "transfer") {
        if (t.accountId === accId && t.toAccountId !== accId) {
          accs = accs.map(a => a.id === t.toAccountId ? {
            ...a,
            balance: a.balance - (t.toAmount ?? t.amount)
          } : a);
        } else if (t.toAccountId === accId && t.accountId !== accId) {
          accs = accs.map(a => a.id === t.accountId ? {
            ...a,
            balance: a.balance + t.amount
          } : a);
        }
      }
    });
    updatedAccs = accs;
    updatedTxns = transactions.filter(t => t.accountId !== accId && t.toAccountId !== accId);
    setAccounts(updatedAccs);
    setTransactions(updatedTxns);
  } else if (deleteTarget.type === "asset") {
    updatedAsts = assets.filter(ast => ast.id !== deleteTarget.id);
    setAssets(updatedAsts);
  } else if (deleteTarget.type === "loan") {
    updatedLoans = loans.filter(l => l.id !== deleteTarget.id);
    setLoans(updatedLoans);
  }
  persistAllData(updatedAccs, updatedAsts, updatedLoans, updatedTxns);
  triggerHaptic("delete");
  setDeleteTarget(null);
};
const askDeleteAccount = acc => {
  const linkedCount = transactions.filter(t => t.accountId === acc.id || t.toAccountId === acc.id).length;
  setDeleteTarget({
    type: "account",
    id: acc.id,
    name: acc.name,
    extra: linkedCount > 0 ? `This will also remove ${linkedCount} linked transaction${linkedCount > 1 ? "s" : ""}.` : null
  });
};
const exportBackup = () => {
  const data = {
    version: 2,
    createdAt: /* @__PURE__ */new Date().toISOString(),
    accounts,
    assets,
    loans,
    transactions,
    rates: exchangeRates,
    budgets,
    goals,
    recurringItems,
    settings
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aleemfin_backup_${todayISO()}.json`;
  a.click();
};
const exportCSV = () => {
  const header = ["Date", "Title", "Type", "Category", "Amount", "Currency", "Account", "To Account", "To Amount", "To Currency"];
  const rows = transactions.map(t => {
    const acc = accounts.find(a2 => a2.id === t.accountId);
    const toAcc = t.type === "transfer" ? accounts.find(a2 => a2.id === t.toAccountId) : null;
    return [t.date, t.title, t.type, t.category, t.amount, t.currency, acc ? acc.name : "", toAcc ? toAcc.name : "", t.type === "transfer" ? t.toAmount ?? t.amount : "", t.type === "transfer" ? t.toCurrency || t.currency : ""];
  });
  const csv = [header, ...rows].map(r => r.map(v => `"${String(v != null ? v : "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], {
    type: "text/csv"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aleemfin_transactions_${todayISO()}.csv`;
  a.click();
};
const importBackup = e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = event => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (!parsed.accounts || !parsed.transactions) throw new Error("Invalid structure");
      if (!window.confirm("Restore this backup? It will replace the accounts, transactions, loans, assets and exchange rates currently stored on this device.")) {
        e.target.value = "";
        return;
      }
      saveStateToHistory();
      setAccounts(parsed.accounts);
      if (parsed.assets) setAssets(parsed.assets);
      if (parsed.loans) setLoans(parsed.loans);
      setTransactions(parsed.transactions);
      if (parsed.rates) setExchangeRates(parsed.rates);
      setBudgets(Array.isArray(parsed.budgets) ? parsed.budgets : []);
      setGoals(Array.isArray(parsed.goals) ? parsed.goals : []);
      setRecurringItems(Array.isArray(parsed.recurringItems) ? parsed.recurringItems : []);
      if (parsed.settings) updateSettings({
        ...parsed.settings,
        customCategories: {
          ...DEFAULT_SETTINGS.customCategories,
          ...(parsed.settings.customCategories || {})
        }
      });
      if (parsed.settings && parsed.settings.defaultCurrency) setCurrency(parsed.settings.defaultCurrency);
      persistAllData(parsed.accounts, parsed.assets || assets, parsed.loans || loans, parsed.transactions, parsed.rates || exchangeRates, Array.isArray(parsed.budgets) ? parsed.budgets : [], Array.isArray(parsed.goals) ? parsed.goals : [], Array.isArray(parsed.recurringItems) ? parsed.recurringItems : []);
      alert("Backup restored successfully.");
    } catch (err) {
      alert("Invalid or corrupted backup file.");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
};
const persistPlanning = (nextBudgets = budgets, nextGoals = goals, nextRecurringItems = recurringItems) => {
  persistAllData(accounts, assets, loans, transactions, exchangeRates, nextBudgets, nextGoals, nextRecurringItems);
};
const advanceRecurringDate = (date, frequency) => {
  const next = new Date(`${date}T12:00:00`);
  if (frequency === "weekly") {
    next.setDate(next.getDate() + 7);
  } else if (frequency === "yearly") {
    const day = next.getDate();
    next.setFullYear(next.getFullYear() + 1);
    if (next.getDate() !== day) next.setDate(0);
  } else {
    const day = next.getDate();
    next.setDate(1);
    next.setMonth(next.getMonth() + 2, 0);
    next.setDate(Math.min(day, next.getDate()));
  }
  return toLocalISO(next);
};
const makeId = (prefix = "") => {
  const rand = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  return prefix ? `${prefix}${rand}` : rand;
};
const openBudgetEditor = (budget = null) => {
  setBudgetForm(budget ? {
    id: budget.id,
    category: budget.category,
    amount: String(budget.amount),
    currency: budget.currency
  } : {
    id: null,
    category: (settings.customCategories.expense || ["Groceries"])[0] || "Groceries",
    amount: "",
    currency
  });
  setPlanningEditor("budget");
};
const saveBudget = e => {
  e.preventDefault();
  const amount = Number(budgetForm.amount);
  if (!budgetForm.category.trim() || !(amount > 0)) {
    alert("Choose a category and enter a positive monthly budget.");
    return;
  }
  const budget = {
    id: budgetForm.id || `budget_${Date.now()}`,
    category: budgetForm.category.trim(),
    amount,
    currency: budgetForm.currency
  };
  const updated = budgetForm.id ? budgets.map(item => item.id === budgetForm.id ? budget : item) : [...budgets, budget];
  setBudgets(updated);
  persistPlanning(updated, goals, recurringItems);
  setPlanningEditor(null);
};
const deleteBudget = budget => {
  if (!window.confirm(`Remove the ${budget.category} budget? This does not affect transactions or balances.`)) return;
  const updated = budgets.filter(item => item.id !== budget.id);
  setBudgets(updated);
  persistPlanning(updated, goals, recurringItems);
};
const openGoalEditor = (goal = null) => {
  setGoalForm(goal ? {
    id: goal.id,
    name: goal.name,
    targetAmount: String(goal.targetAmount),
    currentAmount: String(goal.currentAmount),
    currency: goal.currency,
    targetDate: goal.targetDate || ""
  } : {
    id: null,
    name: "",
    targetAmount: "",
    currentAmount: "",
    currency,
    targetDate: ""
  });
  setPlanningEditor("goal");
};
const saveGoal = e => {
  e.preventDefault();
  const targetAmount = Number(goalForm.targetAmount);
  const currentAmount = Number(goalForm.currentAmount) || 0;
  if (!goalForm.name.trim() || !(targetAmount > 0) || currentAmount < 0) {
    alert("Enter a goal name, a positive target, and a valid current amount.");
    return;
  }
  const goal = {
    id: goalForm.id || `goal_${Date.now()}`,
    name: goalForm.name.trim(),
    targetAmount,
    currentAmount,
    currency: goalForm.currency,
    targetDate: goalForm.targetDate || ""
  };
  const updated = goalForm.id ? goals.map(item => item.id === goalForm.id ? goal : item) : [...goals, goal];
  setGoals(updated);
  persistPlanning(budgets, updated, recurringItems);
  setPlanningEditor(null);
};
const deleteGoal = goal => {
  if (!window.confirm(`Remove “${goal.name}”? This does not affect transactions or balances.`)) return;
  const updated = goals.filter(item => item.id !== goal.id);
  setGoals(updated);
  persistPlanning(budgets, updated, recurringItems);
};
const openRecurringEditor = (item = null) => {
  setRecurringForm(item ? {
    id: item.id,
    type: item.type,
    title: item.title,
    amount: String(item.amount),
    currency: item.currency,
    accountId: item.accountId,
    category: item.category,
    frequency: item.frequency,
    nextDate: item.nextDate
  } : {
    id: null,
    type: "expense",
    title: "",
    amount: "",
    currency,
    accountId: (accounts[0] || {}).id || "",
    category: (settings.customCategories.expense || ["Groceries"])[0] || "Groceries",
    frequency: "monthly",
    nextDate: todayISO()
  });
  setRecurringEditor(true);
};
const saveRecurringItem = e => {
  e.preventDefault();
  const amount = Number(recurringForm.amount);
  if (!recurringForm.title.trim() || !(amount > 0) || !recurringForm.accountId || !recurringForm.category.trim() || !recurringForm.nextDate) {
    alert("Complete the title, amount, account, category, and next date.");
    return;
  }
  const existing = recurringItems.find(item => item.id === recurringForm.id);
  const item = {
    id: recurringForm.id || makeId("recurring_"),
    type: recurringForm.type,
    title: recurringForm.title.trim(),
    amount,
    currency: recurringForm.currency,
    accountId: recurringForm.accountId,
    category: recurringForm.category.trim(),
    frequency: recurringForm.frequency,
    nextDate: recurringForm.nextDate,
    active: existing ? existing.active : true,
    recordedDates: existing ? existing.recordedDates || [] : [],
    reminderDoneDates: existing ? existing.reminderDoneDates || [] : []
  };
  const updated = existing ? recurringItems.map(entry => entry.id === item.id ? item : entry) : [...recurringItems, item];
  setRecurringItems(updated);
  persistPlanning(budgets, goals, updated);
  setRecurringEditor(null);
};
const updateRecurringItem = (item, partial) => {
  const updated = recurringItems.map(entry => entry.id === item.id ? {
    ...entry,
    ...partial
  } : entry);
  setRecurringItems(updated);
  persistPlanning(budgets, goals, updated);
};
const markRecurringReminderDone = item => {
  const updated = recurringItems.map(entry => entry.id === item.id ? {
    ...entry,
    reminderDoneDates: [...new Set([...(entry.reminderDoneDates || []), tomorrowStr])]
  } : entry);
  setRecurringItems(updated);
  persistPlanning(budgets, goals, updated);
};
const deleteRecurringItem = item => {
  if (!window.confirm(`Delete the “${item.title}” schedule? Previously recorded transactions will remain unchanged.`)) return;
  const updated = recurringItems.filter(entry => entry.id !== item.id);
  setRecurringItems(updated);
  persistPlanning(budgets, goals, updated);
};
const recordRecurringOccurrence = item => {
  const date = item.nextDate;
  if ((item.recordedDates || []).includes(date)) {
    alert("This occurrence has already been recorded.");
    return;
  }
  const account = accounts.find(entry => entry.id === item.accountId);
  if (!account) {
    alert("Choose a valid account before recording this occurrence.");
    return;
  }
  saveStateToHistory();
  const accountAmount = convertFromAED(convertToAED(item.amount, item.currency), account.currency);
  const updatedAccounts = accounts.map(entry => entry.id === account.id ? {
    ...entry,
    balance: entry.balance + (item.type === "income" ? accountAmount : -accountAmount)
  } : entry);
  const transaction = {
    id: makeId("rec_tx_"),
    title: item.title,
    type: item.type,
    category: item.category,
    amount: item.amount,
    currency: item.currency,
    rateToAED: exchangeRates[item.currency] || 1,
    accountAmount,
    accountId: account.id,
    date,
    recurringId: item.id,
    recurringDate: date
  };
  const updatedTransactions = [transaction, ...transactions];
  const updatedRecurring = recurringItems.map(entry => entry.id === item.id ? {
    ...entry,
    nextDate: advanceRecurringDate(date, item.frequency),
    recordedDates: [...(entry.recordedDates || []), date]
  } : entry);
  setAccounts(updatedAccounts);
  setTransactions(updatedTransactions);
  setRecurringItems(updatedRecurring);
  persistAllData(updatedAccounts, assets, loans, updatedTransactions, exchangeRates, budgets, goals, updatedRecurring);
};
const addCategory = e => {
  e.preventDefault();
  const name = categoryName.trim();
  if (!name) return;
  const existing = settings.customCategories[categoryType] || [];
  if (existing.some(item => item.toLowerCase() === name.toLowerCase())) {
    alert("That category already exists.");
    return;
  }
  updateSettings({
    customCategories: {
      ...settings.customCategories,
      [categoryType]: [...existing, name]
    }
  });
  setCategoryName("");
};
const removeCategory = (type, name) => {
  if (!window.confirm(`Remove “${name}” from ${type} categories? Existing transactions will keep their category.`)) return;
  updateSettings({
    customCategories: {
      ...settings.customCategories,
      [type]: (settings.customCategories[type] || []).filter(item => item !== name)
    }
  });
};
const openDangerAction = action => {
  setDangerAction(action);
  setDangerPhrase("");
};
const confirmDangerAction = () => {
  if (!dangerAction || dangerPhrase !== (dangerAction === "reset" ? "RESET" : "CLEAR")) return;
  const emptyData = {
    accounts: [],
    assets: [],
    loans: [],
    transactions: [],
    rates: {
      AED: 1,
      USD: 3.67,
      PKR: 0.013
    },
    budgets: [],
    goals: [],
    recurringItems: []
  };
  setAccounts(emptyData.accounts);
  setAssets(emptyData.assets);
  setLoans(emptyData.loans);
  setTransactions(emptyData.transactions);
  setExchangeRates(emptyData.rates);
  setBudgets(emptyData.budgets);
  setGoals(emptyData.goals);
  setRecurringItems(emptyData.recurringItems);
  setHistory([]);
  setRedoStack([]);
  if (dangerAction === "clear") {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    setSettings(DEFAULT_SETTINGS);
    setCurrency(DEFAULT_SETTINGS.defaultCurrency);
  } else {
    persistAllData(emptyData.accounts, emptyData.assets, emptyData.loans, emptyData.transactions, emptyData.rates, emptyData.budgets, emptyData.goals, emptyData.recurringItems);
  }
  setDangerAction(null);
  setDangerPhrase("");
  setActiveTab("overview");
};
const inputCls = `w-full px-3 py-2 rounded-xl text-[16px] border outline-none ${darkMode ? "bg-zinc-950 border-zinc-800 text-zinc-100" : "bg-zinc-50 border-zinc-200 text-zinc-900"}`;
const cardCls = `rounded-3xl border ${darkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-zinc-200"}`;
const subCardCls = `rounded-2xl border ${darkMode ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200"}`;
const renderTxRow = tx => {
  const isTransfer = tx.type === "transfer";
  return /* @__PURE__ */React.createElement("div", {
    key: tx.id,
    className: `p-3.5 rounded-2xl border flex justify-between items-center text-xs ${subCardCls}`
  }, /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("div", {
    className: "flex items-center gap-2"
  }, /* @__PURE__ */React.createElement("span", {
    className: `px-2 py-0.5 rounded text-[9px] font-bold uppercase ${tx.type === "income" ? "bg-emerald-500/10 text-emerald-500" : tx.type === "expense" ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"}`
  }, tx.category), /* @__PURE__ */React.createElement("span", {
    className: "text-[10px] text-zinc-400"
  }, dateFmt(tx.date))), /* @__PURE__ */React.createElement("p", {
    className: "font-bold mt-1 text-sm"
  }, tx.title)), /* @__PURE__ */React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /* @__PURE__ */React.createElement("span", {
    className: `font-bold text-sm ${tx.type === "income" ? "text-emerald-500" : tx.type === "expense" ? "text-rose-500" : "text-blue-500"}`
  }, tx.type === "income" ? "+" : tx.type === "expense" ? "-" : "", tx.currency, " ", numFmt(tx.amount)), !isTransfer && /* @__PURE__ */React.createElement(React.Fragment, null, /* @__PURE__ */React.createElement("button", {
    onClick: () => openEditModal(tx.type, tx),
    title: "Edit",
    className: "p-2 -m-0.5 rounded-xl text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 active:scale-95"
  }, /* @__PURE__ */React.createElement(Icons.IconEdit, {
    className: "w-4 h-4"
  })), /* @__PURE__ */React.createElement("button", {
    onClick: () => setDeleteTarget({
      type: "transaction",
      id: tx.id,
      name: tx.title
    }),
    title: "Delete",
    className: "p-2 -m-0.5 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 active:scale-95"
  }, /* @__PURE__ */React.createElement(Icons.IconTrash, {
    className: "w-4 h-4"
  })))));
};

const DashCard = ({
  tabId,
  cardId = tabId,
  icon: Icon,
  iconWrapCls,
  tintCls,
  label,
  big,
  bigCls,
  sub,
  chip,
  chipCls
}) => {
  const selected = Array.isArray(settings.dashboardCards) ? settings.dashboardCards : DEFAULT_SETTINGS.dashboardCards;
  if (!selected.includes(cardId) && cardId !== "analytics") return null;
  const card = selected.includes(cardId) && /* @__PURE__ */React.createElement("button", {
    onClick: () => setActiveTab(tabId),
    className: `text-left p-4 rounded-3xl border shadow-sm active:scale-[0.97] transition-transform flex flex-col gap-2 ${tintCls}`
  }, /* @__PURE__ */React.createElement("div", {
    className: "flex items-center justify-between"
  }, /* @__PURE__ */React.createElement("div", {
    className: `w-8 h-8 rounded-xl flex items-center justify-center ${iconWrapCls}`
  }, /* @__PURE__ */React.createElement(Icon, {
    className: "w-4 h-4"
  })), /* @__PURE__ */React.createElement(Icons.IconChevron, {
    className: "w-3.5 h-3.5 opacity-50"
  })), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("span", {
    className: "text-[10px] font-bold uppercase tracking-wider opacity-60 block"
  }, label), /* @__PURE__ */React.createElement("span", {
    className: `font-extrabold text-base leading-tight block mt-0.5 ${bigCls}`
  }, big), sub && /* @__PURE__ */React.createElement("span", {
    className: "text-[10px] opacity-70 mt-0.5 block"
  }, sub), chip && /* @__PURE__ */React.createElement("span", {
    className: `inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${chipCls}`
  }, chip)));
  if (cardId !== "analytics") return card;
  return /* @__PURE__ */React.createElement(React.Fragment, null, card, selected.includes("planning") && /* @__PURE__ */React.createElement(DashCard, {
    cardId: "planning",
    tabId: "planning",
    icon: Icons.IconTarget,
    iconWrapCls: "bg-emerald-500/20 text-emerald-600",
    tintCls: "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15 text-current",
    label: "Plans & Goals",
    big: `${budgets.length + goals.length}`,
    bigCls: "text-emerald-600",
    sub: `${budgets.length} budget${budgets.length === 1 ? "" : "s"} · ${goals.length} goal${goals.length === 1 ? "" : "s"}`
  }), selected.includes("recurring") && /* @__PURE__ */React.createElement(DashCard, {
    cardId: "recurring",
    tabId: "recurring",
    icon: Icons.IconCalendar,
    iconWrapCls: "bg-blue-500/20 text-blue-600",
    tintCls: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15 text-current",
    label: "Upcoming",
    big: `${recurringItems.filter(item => item.active).length}`,
    bigCls: "text-blue-600",
    sub: "Scheduled items"
  }), selected.includes("gold") && /* @__PURE__ */React.createElement(DashCard, {
    cardId: "gold",
    tabId: "vault",
    icon: Icons.IconVault,
    iconWrapCls: "bg-amber-500/20 text-amber-600",
    tintCls: "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15 text-current",
    label: "24k Gold Rate",
    big: liveGoldAEDPerGram ? `AED ${liveGoldAEDPerGram.toFixed(2)}/g` : "Check live rate",
    bigCls: "text-amber-600",
    sub: liveGoldAEDPerGram ? "Today's live market benchmark" : "Tap to refresh from Assets"
  }), selected.includes("rates") && /* @__PURE__ */React.createElement(DashCard, {
    cardId: "rates",
    tabId: "settings",
    icon: Icons.IconRates,
    iconWrapCls: "bg-sky-500/20 text-sky-600",
    tintCls: "bg-sky-500/10 border-sky-500/20 hover:bg-sky-500/15 text-current",
    label: "FX · AED / PKR",
    big: `1 AED = ${(1 / exchangeRates.PKR).toFixed(2)} PKR`,
    bigCls: "text-sky-600",
    sub: `1 USD = AED ${exchangeRates.USD.toFixed(2)}`
  }), selected.includes("gold-performance") && /* @__PURE__ */React.createElement(DashCard, {
    cardId: "gold-performance",
    tabId: "vault",
    icon: Icons.IconVault,
    iconWrapCls: "bg-amber-500/20 text-amber-600",
    tintCls: "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15 text-current",
    label: "Gold Performance",
    big: goldChangePct === null ? "No gold assets" : `${goldChangePct >= 0 ? "▲ +" : "▼ "}${Math.abs(goldChangePct).toFixed(1)}%`,
    bigCls: goldChangePct === null ? "text-zinc-500" : goldChangePct >= 0 ? "text-emerald-600" : "text-rose-500",
    sub: goldChangePct === null ? "Add gold assets to track it" : `${goldChangeAED >= 0 ? "Up" : "Down"} AED ${numFmt(Math.abs(goldChangeAED))} since purchase`
  }), selected.includes("runway") && /* @__PURE__ */React.createElement(DashCard, {
    cardId: "runway",
    tabId: "analytics",
    icon: Icons.IconAnalytics,
    iconWrapCls: "bg-teal-500/20 text-teal-600",
    tintCls: "bg-teal-500/10 border-teal-500/20 hover:bg-teal-500/15 text-current",
    label: "Cash Buffer",
    big: `${emergencyRunwayMonths} mo`,
    bigCls: "text-teal-600",
    sub: "At this month’s spending pace"
  }), selected.includes("spending") && /* @__PURE__ */React.createElement(DashCard, {
    cardId: "spending",
    tabId: "analytics",
    icon: Icons.IconLedger,
    iconWrapCls: "bg-rose-500/20 text-rose-500",
    tintCls: "bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/15 text-current",
    label: "Spending Pace",
    big: fmt(monthlyExpenseAED),
    bigCls: "text-rose-500",
    sub: `${currentMonthLabel} expenses`
  }));
};
useEffect(() => {
  const timer = window.setTimeout(() => setGreetingTypingStarted(true), 2000);
  return () => window.clearTimeout(timer);
}, []);
useEffect(() => {
  document.documentElement.dataset.greetingTyping = greetingTypingStarted ? "ready" : "waiting";
  return () => delete document.documentElement.dataset.greetingTyping;
}, [greetingTypingStarted]);
useEffect(() => {
  if (!heroFlash || activeTab !== "overview") return;
  const timer = window.setTimeout(() => setHeroFlash(null), 950);
  return () => window.clearTimeout(timer);
}, [activeTab, heroFlash]);
useEffect(() => {
  document.querySelectorAll("[data-hero-flash]").forEach(node => delete node.dataset.heroFlash);
  if (activeTab !== "overview" || !heroFlash) return;
  const heroMetric = [...document.querySelectorAll("main h2")].find(node => (node.className || "").includes("text-3xl"));
  const heroCard = heroMetric && heroMetric.closest("div.p-6.rounded-3xl");
  if (heroCard) heroCard.dataset.heroFlash = heroFlash;
}, [activeTab, heroFlash]);
useEffect(() => {
  document.querySelectorAll("[data-home-recurring-reminder]").forEach(node => node.remove());
  if (activeTab !== "overview" || recurringReminders.length === 0) return;
  const greetingLine = [...document.querySelectorAll("main p")].find(node => /^(Good morning|Good afternoon|Good evening),? Aleem$/.test(node.textContent || ""));
  if (!greetingLine) return;
  if (greetingLine.firstChild) greetingLine.firstChild.textContent = (greetingLine.firstChild.textContent || "").replace(", Aleem", " Aleem");
  const reminder = document.createElement("span");
  reminder.dataset.homeRecurringReminder = "true";
  reminder.className = "inline-flex items-center gap-1.5 ml-1";
  const summary = document.createElement("span");
  summary.textContent = `— ${recurringReminders[0].title} is due tomorrow${recurringReminders.length > 1 ? ` +${recurringReminders.length - 1}` : ""}`;
  const done = document.createElement("button");
  done.type = "button";
  done.setAttribute("aria-label", "Mark recurring reminder done");
  done.title = "Mark reminder done";
  done.className = "w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 text-[11px] font-extrabold leading-none hover:bg-emerald-500 hover:text-white active:scale-95";
  done.textContent = "✓";
  done.onclick = () => recurringReminders.forEach(markRecurringReminderDone);
  reminder.append(summary, done);
  greetingLine.append(reminder);
}, [activeTab, recurringReminders, darkMode]);

useEffect(() => {
  document.querySelectorAll("[data-loan-subtabs]").forEach(node => node.remove());
  if (activeTab !== "loans") return;
  const heading = [...document.querySelectorAll("h2")].find(node => node.textContent === "Loans & Liabilities");
  const loanRoot = heading && heading.parentElement && heading.parentElement.parentElement;
  if (!loanRoot || loanRoot.children.length < 3) return;
  const list = loanRoot.children[2];
  const tabs = document.createElement("div");
  tabs.dataset.loanSubtabs = "true";
  tabs.className = `grid grid-cols-2 gap-2 p-1 rounded-2xl ${darkMode ? "bg-zinc-900" : "bg-zinc-200/70"}`;
  [["lent", "Lent-out"], ["borrowed", "Borrowed"]].forEach(([type, label]) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.textContent = label;
    tab.className = `py-2.5 rounded-xl text-xs font-bold ${loanView === type ? `${accent.activeBg} ${accent.textStrong}` : "text-zinc-400"}`;
    tab.onclick = () => setLoanView(type);
    tabs.append(tab);
  });
  loanRoot.insertBefore(tabs, list);
  let visible = 0;
  loans.forEach(loan => {
    const name = [...list.querySelectorAll("h3")].find(node => node.textContent === loan.name);
    const card = name && name.closest("div.space-y-3");
    if (!card) return;
    const show = loan.type === loanView;
    card.style.display = show ? "" : "none";
    if (show) visible += 1;
  });
  if (visible === 0) {
    const empty = document.createElement("p");
    empty.dataset.loanSubtabsEmpty = "true";
    empty.className = "text-center text-xs text-zinc-400 py-8";
    empty.textContent = loanView === "lent" ? "No lent-out entries." : "No borrowed entries.";
    list.append(empty);
  }
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    if (link.dataset.whatsappIcon) return;
    link.dataset.whatsappIcon = "true";
    link.setAttribute("aria-label", "Open WhatsApp reminder");
    link.title = "Open WhatsApp";
    link.className = "inline-flex w-7 h-7 rounded-lg bg-emerald-500 text-white items-center justify-center hover:bg-emerald-600 shrink-0";
    const loanCard = link.closest("div.space-y-3");
    const loanName = loanCard && loanCard.querySelector("h3");
    if (loanName && loanName.parentElement) {
      const titleRow = document.createElement("div");
      titleRow.className = "flex items-center gap-2";
      loanName.parentElement.insertBefore(titleRow, loanName);
      titleRow.append(loanName, link);
    }
    link.textContent = "";
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("fill", "none");
    icon.setAttribute("stroke", "currentColor");
    icon.setAttribute("stroke-width", "2");
    icon.setAttribute("stroke-linecap", "round");
    icon.setAttribute("stroke-linejoin", "round");
    icon.setAttribute("class", "w-4 h-4");
    const bubble = document.createElementNS("http://www.w3.org/2000/svg", "path");
    bubble.setAttribute("d", "M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z");
    const phone = document.createElementNS("http://www.w3.org/2000/svg", "path");
    phone.setAttribute("d", "M9.4 8.2c.3 2.4 1.7 3.8 4.1 4.1l1.2-1.2 1.5.7c.2.1.3.4.2.6l-.7 1.2c-.1.2-.4.3-.6.2-4.3-1.2-6.7-3.6-7.9-7.9-.1-.2 0-.5.2-.6l1.2-.7c.2-.1.5 0 .6.2l.7 1.5-1.2 1.2Z");
    icon.append(bubble, phone);
    link.append(icon);
  });
}, [activeTab, loanView, loans, darkMode, accent.activeBg, accent.textStrong]);
useEffect(() => {
  if (activeTab === "settings" || typeof window === "undefined" || window.innerWidth > 767) return;
  const timer = setTimeout(() => {
    const scroller = document.querySelector("[data-mobile-nav-scroll]");
    const activeButton = scroller && scroller.querySelector(`[data-mobile-nav-tab="${activeTab}"]`);
    if (activeButton && scroller) {
      const scrollerRect = scroller.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      const targetScroll = scroller.scrollLeft + (buttonRect.left - scrollerRect.left) - (scrollerRect.width / 2) + (buttonRect.width / 2);
      scroller.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: "smooth"
      });
    }
  }, 25);
  return () => clearTimeout(timer);
}, [activeTab]);

useEffect(() => {
  document.querySelectorAll("[data-settings-scrim]").forEach(node => node.remove());
  if (activeTab !== "settings") return;
  const heading = [...document.querySelectorAll("main h2")].find(node => node.textContent === "Settings");
  const headingWrap = heading && heading.parentElement;
  const panel = headingWrap && headingWrap.parentElement;
  if (!headingWrap || !panel) return;
  const scrim = document.createElement("div");
  scrim.dataset.settingsScrim = "true";
  scrim.className = "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fadeIn";
  scrim.onclick = () => setActiveTab("overview");
  document.getElementById("root").append(scrim);
  panel.classList.add("settings-drawer");
  Object.assign(panel.style, {
    position: "fixed",
    left: "0",
    top: "0",
    zIndex: "50",
    width: "min(92vw, 30rem)",
    maxWidth: "30rem",
    height: "100dvh",
    overflowY: "auto",
    margin: "0",
    padding: "calc(1.25rem + env(safe-area-inset-top)) 1rem calc(2rem + env(safe-area-inset-bottom))",
    background: darkMode ? "rgb(9,9,11)" : "rgb(250,250,250)",
    borderRight: darkMode ? "1px solid rgb(39,39,42)" : "1px solid rgb(228,228,231)"
  });
  headingWrap.style.display = "flex";
  headingWrap.style.alignItems = "flex-start";
  headingWrap.style.justifyContent = "space-between";
  headingWrap.style.gap = "0.75rem";
  const close = document.createElement("button");
  close.type = "button";
  close.title = "Close Settings";
  close.setAttribute("aria-label", "Close Settings");
  close.className = `p-2 -m-1 rounded-xl border shrink-0 ${darkMode ? "border-zinc-800 text-zinc-300 hover:bg-zinc-800" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"}`;
  close.innerHTML = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
  close.onclick = () => setActiveTab("overview");
  headingWrap.append(close);
  return () => {
    scrim.remove();
    close.remove();
    panel.classList.remove("settings-drawer");
    panel.removeAttribute("style");
    headingWrap.removeAttribute("style");
  };
}, [activeTab, darkMode]);

    const tabProps = { DEFAULT_SETTINGS, DashCard, MORE_NAV_ITEMS, accent, accounts, activeTab, addCategory, addMoreAccountId, addMoreAmount, addMoreDate, advanceRecurringDate, applyLiveGoldRate, askDeleteAccount, assets, avgMonthlyNet, bestMonth, biggestExpenseThisMonth, budgetForm, budgets, cardCls, categoryBreakdown, categoryManagerOpen, categoryName, categoryType, closeModal, confirmDangerAction, confirmDelete, convertFromAED, convertTxToAED, currency, currentMonthLabel, dangerAction, dangerPhrase, darkMode, dateFmt, deleteBudget, deleteGoal, deleteRecurringItem, deleteTarget, describeAccountMovement, editingId, emergencyRunwayMonths, exchangeRates, expandedLoanHistory, exportBackup, exportCSV, filteredTransactions, fmt, formInput, getLastInflow, getLastOutflow, goalForm, goals, goldChangeAED, goldChangePct, goldSyncMsg, greeting, handleAddMoreSubmit, handleFormSubmit, handleRepaymentSubmit, importBackup, importBankTransactionFromSMS, parseBankTransactionSMS, inputCls, insightTrendPeriod, insightTrendStyle, ledgerFilter, ledgerSearch, ledgerSort, liveGoldAEDPerGram, loanAddMoreTarget, loanSort, loans, maxMonthlyVal, modalType, momDeltaPct, monthlyExpenseAED, monthlyHistory, monthlyIncomeAED, monthlySavingsAED, monthlyTransactions, netWorthTotal, numFmt, openAddModal, openBudgetEditor, openDangerAction, openEditModal, openGoalEditor, openRatesModal, openRecurringEditor, planningEditor, rateForm, rateSyncMsg, recordRecurringOccurrence, recurringEditor, recurringForm, recurringItems, refreshLiveRates, removeCategory, renderTxRow, repayAccountId, repayAmount, repayDate, repaymentModalLoan, runwayStatus, saveBudget, saveGoal, saveRates, saveRecurringItem, savingsRate, setActiveTab, smsOpen, setSmsOpen, smsText, setSmsText, smsParsed, setSmsParsed, setAddMoreAccountId, setAddMoreAmount, setAddMoreDate, setBudgetForm, setCategoryManagerOpen, setCategoryName, setCategoryType, setCurrency, setDangerAction, setDangerPhrase, setDeleteTarget, setExpandedLoanHistory, setFormInput, setGoalForm, setInsightTrendPeriod, setInsightTrendStyle, setLedgerFilter, setLedgerSearch, setLedgerSort, setLoanAddMoreTarget, setLoanSort, setMoreSheetOpen, setPlanningEditor, setRateForm, setRatesModalOpen, setRecurringEditor, setRecurringForm, setRepayAccountId, setRepayAmount, setRepayDate, setRepaymentModalLoan, settings, sortedLoans, subCardCls, syncLiveExchangeRates, syncLiveGoldRate, syncingGold, syncingRates, todayISO, todayStr, totalLiquidAED, totalLoansBorrowedAED, totalLoansLentAED, totalPhysicalAED, transactions, triggerHaptic, updateRecurringItem, updateSettings, yearlyHistory,
      isAppLocked, setIsAppLocked, receiptModalOpen, setReceiptModalOpen, widgetsModalOpen, setWidgetsModalOpen, bankSmsModalOpen, setBankSmsModalOpen, openReceiptScanner, openWidgetsModal, openBankSmsModal, handleApplyScannedExpense, handleAddParsedTransaction };

    return (
      /* @__PURE__ */React.createElement("div", {
      className: `min-h-screen transition-colors duration-300 pb-24 md:pb-8 flex flex-col ${darkMode ? "bg-zinc-950 text-zinc-100" : "bg-zinc-100/80 text-zinc-900"}`
    }, /* @__PURE__ */React.createElement("header", {
      className: `sticky top-0 z-40 backdrop-blur-xl border-b safe-top ${darkMode ? "bg-zinc-900/80 border-zinc-800" : "bg-white/80 border-zinc-200"}`
    }, /* @__PURE__ */React.createElement("div", {
      className: "max-w-5xl mx-auto px-4 h-16 flex items-center justify-between safe-x"
    }, /* @__PURE__ */React.createElement("div", {
      className: "flex items-center space-x-2 min-w-0"
    }, /* @__PURE__ */React.createElement("div", {
      className: `p-2 bg-gradient-to-tr ${accent.grad} rounded-2xl text-white shadow-md shadow-emerald-500/20`
    }, /* @__PURE__ */React.createElement("svg", {
      className: "w-5 h-5",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /* @__PURE__ */React.createElement("path", {
      d: "M21 12V7H5a2 2 0 0 1 0-4h14v4"
    }), /* @__PURE__ */React.createElement("path", {
      d: "M3 5v14a2 2 0 0 0 2 2h16v-5"
    }), /* @__PURE__ */React.createElement("path", {
      d: "M18 12a2 2 0 0 0 0 4h4v-4Z"
    }))), /* @__PURE__ */React.createElement("div", null, /* @__PURE__ */React.createElement("h1", {
      className: "font-bold text-base leading-tight tracking-tight truncate"
    }, "AleemFin"), /* @__PURE__ */React.createElement("p", {
      className: `text-[10px] truncate ${darkMode ? "text-zinc-400" : "text-zinc-500"}`
    }, "Wealth ", /* @__PURE__ */React.createElement("span", {
      className: "opacity-60"
    }, "\u2014 Created by Aleem")))), /* @__PURE__ */React.createElement("nav", {
      className: "hidden md:flex items-center space-x-1 p-1 rounded-2xl border bg-zinc-900/90 border-zinc-700/50"
    }, NAV_ITEMS.map(tab => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.id;
      return /* @__PURE__ */React.createElement("button", {
        key: tab.id,
        onClick: () => setActiveTab(tab.id),
        className: `flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isActive ? `bg-zinc-800 ${accent.text400} shadow-sm` : "text-zinc-400 hover:text-white"}`
      }, /* @__PURE__ */React.createElement(Icon, {
        className: "w-3.5 h-3.5"
      }), /* @__PURE__ */React.createElement("span", null, tab.label));
    })), /* @__PURE__ */React.createElement("div", {
      className: "flex items-center space-x-2"
    }, /* @__PURE__ */React.createElement("button", {
      onClick: handleUndo,
      disabled: history.length === 0,
      title: "Undo",
      className: `min-w-[44px] min-h-[44px] p-2.5 rounded-2xl border text-xs disabled:opacity-30 ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700"}`
    }, /* @__PURE__ */React.createElement(Icons.IconUndo, {
      className: "w-4 h-4"
    })), /* @__PURE__ */React.createElement("button", {
      onClick: handleRedo,
      disabled: redoStack.length === 0,
      title: "Redo",
      className: `min-w-[44px] min-h-[44px] p-2.5 rounded-2xl border text-xs disabled:opacity-30 ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700"}`
    }, /* @__PURE__ */React.createElement(Icons.IconRedo, {
      className: "w-4 h-4"
    })), /* @__PURE__ */React.createElement("button", {
      onClick: exportBackup,
      title: "Backup (JSON)",
      className: `p-2 rounded-xl border text-xs ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700"}`
    }, /* @__PURE__ */React.createElement(Icons.IconDownload, {
      className: "w-4 h-4"
    })), /* @__PURE__ */React.createElement("label", {
      className: `p-2 rounded-xl border text-xs cursor-pointer ${darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700"}`,
      title: "Restore backup"
    }, /* @__PURE__ */React.createElement(Icons.IconUpload, {
      className: "w-4 h-4"
    }), /* @__PURE__ */React.createElement("input", {
      type: "file",
      accept: ".json",
      onChange: importBackup,
      className: "hidden"
    })), /* @__PURE__ */React.createElement("button", {
      type: "button",
      onClick: () => {
        updateSettings({ discreteMode: !settings.discreteMode });
        if (typeof triggerHaptic === "function") triggerHaptic("action");
      },
      title: settings.discreteMode ? "Show balances" : "Hide balances (Discrete Mode)",
      "aria-label": settings.discreteMode ? "Show balances" : "Hide balances",
      className: `p-2 rounded-xl border transition-all active:scale-95 ${settings.discreteMode ? `${accent.activeBg10} ${accent.textStrong} border-emerald-500/30 font-bold` : darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200" : "bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900"}`
    }, /* @__PURE__ */React.createElement(settings.discreteMode ? Icons.IconEyeOff : Icons.IconEye, {
      className: "w-4 h-4"
    })), /* @__PURE__ */React.createElement("button", {
      onClick: () => setDarkMode(!darkMode),
      className: `p-2 rounded-xl border ${darkMode ? "bg-zinc-900 border-zinc-800 text-amber-400" : "bg-white border-zinc-200 text-zinc-600"}`
    }, darkMode ? /* @__PURE__ */React.createElement(Icons.IconSun, {
      className: "w-4 h-4"
    }) : /* @__PURE__ */React.createElement(Icons.IconMoon, {
      className: "w-4 h-4"
    }))))), storageError && /* @__PURE__ */React.createElement("div", {
      className: "bg-rose-600 text-white text-xs font-semibold text-center py-2 px-4 safe-x"
    }, "Couldn't save your last change to this device's storage (it may be full or in private-browsing mode). Please export a backup soon so nothing is lost."), /* @__PURE__ */React.createElement("main", {
      className: "max-w-5xl mx-auto px-4 py-5 sm:py-6 space-y-5 sm:space-y-6 flex-1 w-full safe-x"
    }, activeTab === "overview" && React.createElement(Tabs.Overview, tabProps),
       activeTab === "transactions" && React.createElement(Tabs.Ledger, tabProps),
       activeTab === "accounts" && React.createElement(Tabs.Accounts, tabProps),
       activeTab === "vault" && React.createElement(Tabs.Vault, tabProps),
       activeTab === "loans" && React.createElement(Tabs.Loans, tabProps),
       activeTab === "analytics" && React.createElement(Tabs.Analytics, tabProps)),
       activeTab === "analytics" && React.createElement(Tabs.AnalyticsSummary, tabProps),
       activeTab === "planning" && React.createElement(Tabs.Planning, tabProps),
       activeTab === "recurring" && React.createElement(Tabs.Recurring, tabProps),
       activeTab === "settings" && React.createElement(Tabs.Settings, tabProps), /* @__PURE__ */React.createElement("nav", {
      className: "md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t safe-bottom bg-zinc-900/95 border-zinc-800",
      style: {
        position: "fixed"
      }
    }, /* @__PURE__ */React.createElement("div", {
      className: "mobile-bottom-bar max-w-5xl mx-auto px-1 py-1 h-[70px] safe-x"
    }, /* @__PURE__ */React.createElement("div", {
      className: "mobile-nav-swipe",
      "data-mobile-nav-scroll": "true"
    }, NAV_ITEMS.filter(tab => tab.id !== "settings").map(tab => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.id;
      return /* @__PURE__ */React.createElement("button", {
        key: tab.id,
        onClick: () => {
          setActiveTab(tab.id);
          setMoreSheetOpen(false);
        },
        "data-mobile-nav-tab": tab.id,
        "aria-label": tab.label,
        className: `mobile-nav-tab flex flex-col items-center justify-center rounded-2xl transition-all active:scale-95 ${isActive ? `${accent.text400} font-bold` : "text-zinc-400 hover:text-zinc-200"}`
      }, /* @__PURE__ */React.createElement("div", {
        className: `flex items-center justify-center w-9 h-9 rounded-xl mb-1 ${isActive ? accent.activeBg : ""}`
      }, /* @__PURE__ */React.createElement(Icon, {
        className: "w-5 h-5"
      })), /* @__PURE__ */React.createElement("span", {
        className: "text-[10px] leading-none whitespace-nowrap"
      }, tab.label));
    })), /* @__PURE__ */React.createElement("div", {
      className: "mobile-settings-fixed"
    }, (() => {
      const tab = NAV_ITEMS.find(item => item.id === "settings");
      const Icon = tab.icon;
      const isActive = activeTab === "settings";
      return /* @__PURE__ */React.createElement("button", {
        onClick: () => {
          setActiveTab("settings");
          setMoreSheetOpen(false);
        },
        "data-mobile-nav-tab": "settings",
        "aria-label": "Settings",
        title: "Settings",
        className: `mobile-nav-tab flex flex-col items-center justify-center rounded-2xl transition-all active:scale-95 ${isActive ? `${accent.text400} font-bold` : "text-zinc-400 hover:text-zinc-200"}`
      }, /* @__PURE__ */React.createElement("div", {
        className: `flex items-center justify-center w-9 h-9 rounded-xl mb-1 ${isActive ? accent.activeBg : ""}`
      }, /* @__PURE__ */React.createElement(Icon, {
        className: "w-5 h-5"
      })), /* @__PURE__ */React.createElement("span", {
        className: "text-[10px] leading-none whitespace-nowrap"
      }, "Settings"));
    })()))),
moreSheetOpen && React.createElement(Modals.MoreSheet, tabProps),
deleteTarget && React.createElement(Modals.DeleteConfirm, tabProps),
ratesModalOpen && React.createElement(Modals.RatesModal, tabProps),
repaymentModalLoan && React.createElement(Modals.RepaymentModal, tabProps),
loanAddMoreTarget && React.createElement(Modals.LoanAddMoreModal, tabProps),
modalOpen && React.createElement(Modals.MainFormModal, tabProps),
receiptModalOpen && React.createElement(Modals.ReceiptScanModal, { ...tabProps, isOpen: receiptModalOpen, onClose: () => setReceiptModalOpen(false), onApplyExpense: handleApplyScannedExpense }),
widgetsModalOpen && React.createElement(Modals.WidgetsModal, { ...tabProps, isOpen: widgetsModalOpen, onClose: () => setWidgetsModalOpen(false) }),
bankSmsModalOpen && React.createElement(Modals.BankSmsModal, { ...tabProps, isOpen: bankSmsModalOpen, onClose: () => setBankSmsModalOpen(false), onAddTransaction: handleAddParsedTransaction }),
isAppLocked && React.createElement(Modals.SecurityLockOverlay, { ...tabProps, settings, onUnlock: () => setIsAppLocked(false) }),
/* @__PURE__ */React.createElement("div", {
  className: "privacy-blur-shield",
  "aria-hidden": "true"
}, /* @__PURE__ */React.createElement("div", {
  className: "w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md border border-white/20 shadow-2xl"
}, /* @__PURE__ */React.createElement(Icons.IconShield || Icons.IconLock, {
  className: "w-6 h-6"
})), /* @__PURE__ */React.createElement("p", {
  className: "text-xs font-bold text-white/90 tracking-wide"
}, "Privacy Protected")),
toasts.length > 0 && /* @__PURE__ */React.createElement("div", {
  className: "native-toast-container"
}, toasts.map(t => /* @__PURE__ */React.createElement("div", {
  key: t.id,
  className: `native-toast px-4 py-2.5 rounded-2xl border shadow-2xl text-xs font-semibold flex items-center gap-2 backdrop-blur-xl ${darkMode ? "bg-zinc-900/95 border-zinc-800 text-zinc-100" : "bg-white/95 border-zinc-200 text-zinc-900"}`
}, /* @__PURE__ */React.createElement(Icons.IconSparkles, { className: "w-3.5 h-3.5 text-emerald-500 shrink-0" }), t.message))))
    );
  }

  var root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(/* @__PURE__ */ React.createElement(App, null));
})();
