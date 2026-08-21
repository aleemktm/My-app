# AleemFin v1.0.77 — Native iOS Refinement Audit

Baseline: v76 (audit-remediated financial baseline).

## Scope

This release continues the native deployment plan already present in the project: Face ID / Touch ID, Capacitor Haptics, Local Notifications, and dark-mode/native presentation. It does not change the canonical Loan domain or the v76 financial remediation.

## Remediated

### 1. Biometric plugin registration hardening
The JavaScript bridge previously preferred only the legacy `BiometricAuthNative` name. v77 now prefers the official Aparajita Capacitor plugin name `BiometricAuth`, with the legacy bridge retained as a fallback. This aligns the web layer with the installed `@aparajita/capacitor-biometric-auth` package while preserving compatibility with an older native build.

### 2. Haptics plugin registration hardening
The runtime previously depended on `Capacitor.Plugins.Haptics` being populated. v77 adds a `registerPlugin("Haptics")` fallback, while retaining the existing WebKit and browser vibration fallbacks.

### 3. Local Notifications
The project already includes `@capacitor/local-notifications` and its iOS SPM dependency. The existing native notification permission and three-second test notification path was retained rather than duplicated.

### 4. Face ID usage declaration
`NSFaceIDUsageDescription` is present in the iOS Info.plist and remains unchanged.

## Preserved

- Canonical Loan Engine / Loan Domain
- v76 financial audit remediations
- Siri integration
- Settings structure and notification test control
- Dark-mode Loan History presentation
- Account, Ledger, Planning, Insights, Recurring and Vault logic

## Verification

- JavaScript syntax checks: PASS for all application JS files.
- Existing Loan Engine tests: PASS.
- Existing Canonical Loan Domain tests: PASS.
- Existing audit remediation tests: PASS.
- Native bridge static checks: PASS.
- ZIP integrity: PASS.

## Runtime limitation

A full Xcode/iPhone runtime test is not available in this build environment. The native changes were therefore verified statically and through the existing JavaScript test suite. On-device verification should specifically cover Face ID enable/unlock, haptic tap/selection feedback, notification permission, and the three-second test notification.
