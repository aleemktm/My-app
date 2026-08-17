// AleemFin Native Bridge — browser-safe now, Capacitor-ready for iOS.
// This file intentionally does not require Capacitor to be present.
(function () {
  const getCapacitor = () => window.Capacitor || null;
  const getPlugins = () => {
    const c = getCapacitor();
    return c && c.Plugins ? c.Plugins : null;
  };

  const haptic = async (kind) => {
    try {
      if (window.__aleemFinHapticsEnabled === false) return;
      const plugins = getPlugins();
      const h = plugins && plugins.Haptics;
      if (h) {
        const style = kind === "heavy" || kind === "delete" ? "HEAVY" : kind === "medium" ? "MEDIUM" : "LIGHT";
        if (h.impact) { await h.impact({ style }); return; }
        if (h.vibrate) { await h.vibrate({ duration: kind === "heavy" ? 25 : 10 }); return; }
      }
      if (navigator && typeof navigator.vibrate === "function") navigator.vibrate(kind === "heavy" ? 25 : 10);
    } catch (_) {}
  };

  const getBiometricPlugin = () => {
    const plugins = getPlugins();
    return plugins && (plugins.BiometricAuth || plugins.Biometrics || plugins.BiometricAuthentication);
  };

  const isNativeIOS = () => {
    try {
      const c = getCapacitor();
      return !!(c && c.isNativePlatform && c.isNativePlatform() && c.getPlatform && c.getPlatform() === "ios");
    } catch (_) { return false; }
  };

  window.AleemFinNative = window.AleemFinNative || {
    isNativeIOS,
    haptic,
    async authenticate(reason) {
      try {
        const plugin = getBiometricPlugin();
        if (!plugin || !plugin.authenticate) return { available: false, success: false };
        const result = await plugin.authenticate({ reason: reason || "Unlock AleemFin" });
        return { available: true, success: result && result.success !== false, result };
      } catch (error) {
        return { available: true, success: false, error };
      }
    },
    async requestNotifications() {
      try {
        const plugins = getPlugins();
        const notifications = plugins && plugins.LocalNotifications;
        if (!notifications || !notifications.requestPermissions) return { available: false };
        return { available: true, result: await notifications.requestPermissions() };
      } catch (error) { return { available: true, error }; }
    }
  };
})();
