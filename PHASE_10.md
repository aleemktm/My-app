# AleemFin Phase 10 — Automatic JSON File Backup

This update keeps the existing internal automatic backup and adds an optional automatic JSON file backup.

## Behaviour
- After every newly saved Inflow or Outflow, AleemFin updates `AleemFin_Auto_Backup.json`.
- The latest complete AleemFin backup replaces the previous file.
- The file is written to the app's iOS Documents directory, so it can be exposed in the Files app as the AleemFin app folder.
- Settings → Data & Backup now includes **Automatic file backup** (ON by default).
- Manual Export remains available.

## One-time native setup
The web code calls the official Capacitor Filesystem plugin. In the existing AleemFin project, install it once from Terminal:

`npm install @capacitor/filesystem`

Then run:

`npx cap sync ios`

In Xcode, make sure the app's Info.plist has these keys so the app Documents folder is visible in Files:

- `UIFileSharingEnabled` = YES
- `LSSupportsOpeningDocumentsInPlace` = YES

Then build/run the app normally.

## Where to check
On the iPhone: **Files → On My iPhone → AleemFin → AleemFin_Auto_Backup.json** (the exact Files location can vary slightly depending on iOS Files presentation).

If Automatic file backup is OFF, only the internal automatic backup continues.
