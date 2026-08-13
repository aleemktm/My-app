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

  window.Storage = {
    SETTINGS_KEY,
    STORAGE_KEY,
    DEFAULT_SETTINGS,
    loadSettings,
    saveSettings,
    loadStoredData,
    persistAllData
  };
})();
