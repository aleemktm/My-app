// storage.js — localStorage keys, defaults, and read/write helpers.
//
// This logic originally lived as local consts/functions inside App() in the
// single-file version, tightly closed over React state (exchangeRates,
// budgets, goals, recurringItems, storageError). Since a function's closure
// can't be split across files, the pieces that touched live component state
// have been converted to take that state as explicit parameters instead of
// reading it from a closure, and persistAllData() now RETURNS success/failure
// instead of calling setStorageError() directly (app.js does that, since only
// the component can call its own state setter). The actual localStorage
// reads/writes, keys, and fallback rules are byte-for-byte the same.
(function () {
  const SETTINGS_KEY = "aleemfin_settings_v1";
  const STORAGE_KEY = "aleemfin_data_v8";

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
    // Native security & privacy features
    securityLockEnabled: false,
    biometricEnabled: false,
    securityPinHash: "", // SHA-256 hash of 4-digit PIN
    privacyScreenBlur: true,
    discreteMode: false,
    lockTimeoutMinutes: 1, // Auto lock after 1 min in background
    // Native Push & reminders
    notificationsEnabled: false,
    dailyReminderTime: "20:00",
    billReminderDays: 3,
    // Auto backup
    autoBackupEnabled: true,
    lastBackupDate: "",
    // Apple-native UI options
    soundEffects: true,
    shakeToMask: true,
    swipeActions: true,
    oledBlack: false,
    customCategories: {
      income: ["Salary", "Freelance", "Gift", "Other"],
      expense: ["Groceries", "Family", "Rent", "Utilities", "Transport", "Dining", "Shopping", "Other"]
    }
  };

  // Same logic as the original useState(() => { ... }) initializer for `settings`.
  function loadSettings() {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        return {
          ...DEFAULT_SETTINGS,
          ...JSON.parse(saved),
          customCategories: { ...DEFAULT_SETTINGS.customCategories, ...(JSON.parse(saved).customCategories || {}) }
        };
      }
    } catch (e) {
    }
    return DEFAULT_SETTINGS;
  }

  // Same logic as the localStorage.setItem call inside the original updateSettings().
  function saveSettings(next) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch (e) {
    }
  }

  // Identical body to the original loadStoredData(key, fallback).
  function loadStoredData(key, fallback) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[key]) return parsed[key];
      }
    } catch (e) {
    }
    return fallback;
  }

  // Same read-merge-write logic as the original persistAllData(), with the
  // closure reads (exchangeRates, budgets, goals, recurringItems) replaced by
  // explicit params (currentRates, currentBudgets, currentGoals,
  // currentRecurringItems), and setStorageError(...) replaced by a boolean
  // return value that the caller (app.js) uses to update its own state.
  function persistAllData(
    newAccs,
    newAsts,
    newLoans,
    newTxns,
    newRates,
    newBudgets,
    newGoals,
    newRecurringItems,
    currentRates,
    currentBudgets,
    currentGoals,
    currentRecurringItems
  ) {
    try {
      let existing = {};
      try {
        existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
      } catch (e) {
      }
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accounts: newAccs,
          assets: newAsts,
          loans: newLoans,
          transactions: newTxns,
          rates: newRates || currentRates,
          budgets: newBudgets === void 0 ? (Array.isArray(existing.budgets) ? existing.budgets : currentBudgets) : newBudgets,
          goals: newGoals === void 0 ? (Array.isArray(existing.goals) ? existing.goals : currentGoals) : newGoals,
          recurringItems:
            newRecurringItems === void 0
              ? Array.isArray(existing.recurringItems)
                ? existing.recurringItems
                : currentRecurringItems
              : newRecurringItems
        })
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  // Haptic feedback helper leveraging navigator.vibrate
  function triggerHaptic(type = "light") {
    if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
    try {
      const currentSettings = loadSettings();
      if (currentSettings && currentSettings.hapticFeedback === false) return;
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
    } catch (e) {
      // Ignored for environments where vibration is restricted or unsupported
    }
  }

  // SHA-256 hash helper for PIN security
  async function hashPin(pin) {
    try {
      const msgUint8 = new TextEncoder().encode(String(pin));
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {
      // Fallback simple hash for older environments
      let hash = 0;
      for (let i = 0; i < pin.length; i++) {
        hash = (hash << 5) - hash + pin.charCodeAt(i);
        hash |= 0;
      }
      return "fb_" + Math.abs(hash);
    }
  }

  // WebAuthn Biometric Authenticator check
  async function isBiometricAvailable() {
    if (typeof window === "undefined" || !window.PublicKeyCredential) return false;
    try {
      if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function") {
        return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  // WebAuthn Biometric Verification Request
  async function promptBiometricAuth(reason = "Unlock AleemFin") {
    if (typeof window === "undefined" || !window.PublicKeyCredential) {
      return { success: false, error: "WebAuthn not supported" };
    }
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: challenge,
          timeout: 60000,
          userVerification: "preferred"
        }
      });
      return { success: !!credential };
    } catch (e) {
      // If no pre-registered credential or user cancelled, let caller handle PIN fallback
      return { success: false, error: e.message || "Biometric cancelled" };
    }
  }

  // System Web Notifications trigger
  async function requestNotificationPermission() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "unsupported";
    }
    try {
      return await Notification.requestPermission();
    } catch (e) {
      return "denied";
    }
  }

  // iOS 13+ requires an explicit, user-gesture-triggered permission prompt
  // before DeviceMotionEvent will fire. Other browsers (Android Chrome,
  // desktop) have no such gate, so we resolve "granted" immediately there.
  async function requestMotionPermission() {
    if (typeof window === "undefined" || !window.DeviceMotionEvent) {
      return "unsupported";
    }
    if (typeof window.DeviceMotionEvent.requestPermission === "function") {
      try {
        return await window.DeviceMotionEvent.requestPermission();
      } catch (e) {
        return "denied";
      }
    }
    return "granted";
  }

  function sendLocalNotification(title, options = {}) {
    if (typeof window === "undefined" || !("Notification" in window)) return null;
    if (Notification.permission !== "granted") return null;
    try {
      return new Notification(title, {
        icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E",
        badge: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E",
        ...options
      });
    } catch (e) {
      return null;
    }
  }

  // Apple Web Audio synthesizers (subtle haptic clicks, success chimes, delete thuds)
  let audioCtx = null;
  function getAudioContext() {
    if (typeof window === "undefined") return null;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      if (!audioCtx) audioCtx = new AudioContext();
      if (audioCtx.state === "suspended") {
        audioCtx.resume().catch(() => {});
      }
      return audioCtx;
    } catch (e) {
      return null;
    }
  }

  function playSound(type = "click") {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "click" || type === "key") {
        // High-frequency tactile Apple tap
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.025);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        osc.start(now);
        osc.stop(now + 0.026);
      } else if (type === "success") {
        // 2-tone Apple payment/saved chime
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.08); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.setValueAtTime(0.15, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        osc.start(now);
        osc.stop(now + 0.33);
      } else if (type === "delete" || type === "trash") {
        // Subtle bass thud
        osc.type = "triangle";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.09);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.095);
      } else if (type === "refresh") {
        // Subtle airy chime
        osc.type = "sine";
        osc.frequency.setValueAtTime(784, now); // G5
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.06); // C6
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (e) {}
  }

  // Merchant brand recognition database for intelligent logos & badges
  const KNOWN_MERCHANTS = [
    { pattern: /(carrefour|luluhyper|spinneys|waitrose|choithrams|viva|al maya)/i, name: "Grocery", icon: "🛒", bg: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20" },
    { pattern: /(starbucks|costa|tim hortons|dunkin|cafe|coffee|arabica|roastery|karak)/i, name: "Cafe", icon: "☕", bg: "bg-amber-500/15 text-amber-500 border-amber-500/20" },
    { pattern: /(amazon|noon|noon\.com|shein|namshi|aliexpress)/i, name: "Shopping", icon: "📦", bg: "bg-orange-500/15 text-orange-500 border-orange-500/20" },
    { pattern: /(uber|careem|taxi|metro|rta|salik|enoc|adnoc|eppco|petrol|fuel)/i, name: "Transport", icon: "🚗", bg: "bg-blue-500/15 text-blue-500 border-blue-500/20" },
    { pattern: /(apple|netflix|spotify|youtube|icloud|google|chatgpt|openai|prime video)/i, name: "Digital", icon: "📱", bg: "bg-violet-500/15 text-violet-500 border-violet-500/20" },
    { pattern: /(dewa|sewa|fewa|etisalat|e&|du telecom|virgin mobile|empower)/i, name: "Utilities", icon: "⚡", bg: "bg-cyan-500/15 text-cyan-500 border-cyan-500/20" },
    { pattern: /(mcdonald|kfc|hardees|burger king|pizza hut|subway|talabat|deliveroo|zomato|dining|restaurant|shawarma)/i, name: "Dining", icon: "🍔", bg: "bg-rose-500/15 text-rose-500 border-rose-500/20" },
    { pattern: /(flydubai|emirates|airarabia|etihad|airline|flight|hotel|booking\.com|airbnb)/i, name: "Travel", icon: "✈️", bg: "bg-sky-500/15 text-sky-500 border-sky-500/20" },
    { pattern: /(gym|fitness|pharmacy|aster|life pharmacy|medicina|hospital|clinic)/i, name: "Health", icon: "💊", bg: "bg-teal-500/15 text-teal-500 border-teal-500/20" },
    { pattern: /(salary|payroll|wages|dividend|bonus)/i, name: "Salary", icon: "💰", bg: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20" },
    { pattern: /(gold|bullion|jewellery|malabar|joyalukkas|kalyan|damas)/i, name: "Gold", icon: "🪙", bg: "bg-amber-500/15 text-amber-500 border-amber-500/20" }
  ];

  function detectMerchantBadge(title = "", category = "") {
    const text = `${title} ${category}`;
    for (const m of KNOWN_MERCHANTS) {
      if (m.pattern.test(text)) {
        return m;
      }
    }
    return null;
  }

  // Safe inline math evaluator for iOS quick calculations (e.g. 50 + 12.50 * 2)
  function evaluateMathExpression(str = "") {
    if (!str || typeof str !== "string") return null;
    const clean = str.trim();
    // Only allow digits, decimals, +, -, *, /, (, ), and spaces
    if (!/^[0-9\.\+\-\*\/\(\)\s]+$/.test(clean)) return null;
    // Don't evaluate plain single number
    if (/^[0-9\.]+$/.test(clean)) return null;
    try {
      // Safe arithmetic parsing via Function without window access
      const result = new Function(`'use strict'; return (${clean})`)();
      if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
        return Math.round(result * 100) / 100;
      }
    } catch (e) {}
    return null;
  }

  window.triggerHaptic = triggerHaptic;
  window.playSound = playSound;

  window.Storage = {
    SETTINGS_KEY,
    STORAGE_KEY,
    DEFAULT_SETTINGS,
    loadSettings,
    saveSettings,
    loadStoredData,
    persistAllData,
    triggerHaptic,
    playSound,
    detectMerchantBadge,
    evaluateMathExpression,
    hashPin,
    isBiometricAvailable,
    promptBiometricAuth,
    requestNotificationPermission,
    requestMotionPermission,
    sendLocalNotification
  };
})();
