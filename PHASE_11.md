# AleemFin Phase 11 — One simple automatic iCloud backup

## What this version does

AleemFin now has one simple automatic-backup setting:

**Settings → Data & Backup → Automatic iCloud backup**

When ON (default):
1. A new Inflow or Outflow is successfully saved.
2. AleemFin creates a complete backup of the current data.
3. The backup is written to:
   **iCloud Drive / AleemFin / AleemFin_Backup.json**
4. The new file replaces the previous file.

The backup is kept outside the app's private storage, so it can survive an uninstall/reinstall.

The existing manual Backup and Restore controls remain available.

## Important iOS setup

The web app cannot create an iCloud ubiquity container by itself. The native iOS host must expose the iCloud Documents container to the WebView.

This ZIP includes:
`ios-native/AleemFinICloudBackupHandler.swift`

Add that file to the iOS App target.

In Xcode:
1. Open the AleemFin iOS project.
2. Target → Signing & Capabilities → + Capability → **iCloud**.
3. Enable **iCloud Documents**.
4. Add an iCloud container, for example:
   `iCloud.com.aleemfin.prototype`
5. In the WebView setup, register the included handler once before the AleemFin page loads:

```swift
let handler = AleemFinICloudBackupHandler(
    containerIdentifier: "iCloud.com.aleemfin.prototype"
)
webView.configuration.userContentController.add(handler, name: "iCloudBackup")
```

Use the exact container identifier shown in your Xcode iCloud capability.

## Verify

After building on the iPhone:

1. Turn **Automatic iCloud backup** ON.
2. Record an Inflow or Outflow.
3. Open the iPhone **Files** app.
4. Open **iCloud Drive → AleemFin**.
5. Confirm:
   `AleemFin_Backup.json`
6. Record another Inflow/Outflow.
7. The same file should be updated/replaced rather than a second backup being created.

## Reinstall / restore

Because the backup is in iCloud Drive, uninstalling AleemFin does not delete the iCloud file.

After reinstalling:
**Settings → Data & Backup → Restore**

Choose:
**iCloud Drive → AleemFin → AleemFin_Backup.json**

The existing Restore function will restore the latest saved data.

## Important

The ZIP is the updated web/source portion. The iCloud capability and native bridge must be present in the iOS Xcode project. Without that native iCloud configuration, iOS will not permit a web page to silently write into an iCloud Drive folder.
