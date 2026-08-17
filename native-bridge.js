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
        if (h.impact) {
          // Capacitor Haptics uses ImpactStyle enum values. String values are
          // accepted by the JS bridge in current Capacitor releases.
          await h.impact({ style });
          return;
        }
        if (h.vibrate) { await h.vibrate({ duration: kind === "heavy" ? 25 : 10 }); return; }
      }
      if (navigator && typeof navigator.vibrate === "function") navigator.vibrate(kind === "heavy" ? 25 : 10);
    } catch (_) {}
  };

  const getBiometricPlugin = () => {
    const plugins = getPlugins();
    return plugins && (plugins.BiometricAuth || plugins.Biometrics || plugins.BiometricAuthentication);
  };

  const getPlugin = (name) => {
    const plugins = getPlugins();
    return plugins && plugins[name];
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
        let result;
        try {
          result = await plugin.authenticate({ reason: reason || "Unlock AleemFin" });
        } catch (_) {
          result = await plugin.authenticate();
        }
        return { available: true, success: result && result.success !== false, result };
      } catch (error) {
        return { available: true, success: false, error };
      }
    },
    async biometricAvailability() {
      try {
        const plugin = getBiometricPlugin();
        if (!plugin) return { available: false, supported: false };
        if (plugin.checkBiometry) {
          const result = await plugin.checkBiometry();
          return {
            available: true,
            supported: !!(result && result.isAvailable),
            biometryType: result && result.biometryType,
            result
          };
        }
        return { available: true, supported: true };
      } catch (error) { return { available: true, supported: false, error }; }
    },
    async requestNotificationPermission() {
      return this.requestNotifications();
    },
    async requestNotifications() {
      try {
        const notifications = getPlugin("LocalNotifications");
        if (!notifications || !notifications.requestPermissions) return { available: false };
        return { available: true, result: await notifications.requestPermissions() };
      } catch (error) { return { available: true, error }; }
    },
    async notificationPermissionState() {
      try {
        const notifications = getPlugin("LocalNotifications");
        if (!notifications || !notifications.checkPermissions) return { available: false };
        return { available: true, result: await notifications.checkPermissions() };
      } catch (error) { return { available: true, error }; }
    },
    async setStatusBar(dark) {
      try {
        const statusBar = getPlugin("StatusBar");
        if (!statusBar) return { available: false };
        const style = dark ? "DARK" : "LIGHT";
        if (statusBar.setStyle) await statusBar.setStyle({ style });
        if (statusBar.setOverlaysWebView) await statusBar.setOverlaysWebView({ overlay: true });
        return { available: true };
      } catch (error) { return { available: true, error }; }
    },
    async setKeyboardResizeMode() {
      try {
        const keyboard = getPlugin("Keyboard");
        if (!keyboard || !keyboard.setResizeMode) return { available: false };
        return { available: true, result: await keyboard.setResizeMode({ mode: "body" }) };
      } catch (error) { return { available: true, error }; }
    },
    async getNativeState() {
      return {
        ios: isNativeIOS(),
        capacitor: !!getCapacitor(),
        haptics: !!getPlugin("Haptics"),
        biometrics: !!getBiometricPlugin(),
        notifications: !!getPlugin("LocalNotifications"),
        statusBar: !!getPlugin("StatusBar"),
        keyboard: !!getPlugin("Keyboard")
      };
    }
  };
})();
