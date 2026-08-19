import Foundation
import WebKit

/// AleemFin iCloud Drive backup bridge.
/// Add this handler to the WKWebView used by the Capacitor App, and enable
/// iCloud Documents + an iCloud ubiquity container in Signing & Capabilities.
final class AleemFinICloudBackupHandler: NSObject, WKScriptMessageHandler {
    private let containerIdentifier: String

    init(containerIdentifier: String) {
        self.containerIdentifier = containerIdentifier
        super.init()
    }

    func userContentController(_ userContentController: WKUserContentController,
                                didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any],
              (body["action"] as? String) == "save",
              let folder = body["folder"] as? String,
              let fileName = body["fileName"] as? String,
              let data = body["data"] as? String else { return }

        guard let containerURL = FileManager.default.url(forUbiquityContainerIdentifier: containerIdentifier) else {
            print("AleemFin: iCloud container unavailable.")
            return
        }

        let folderURL = containerURL.appendingPathComponent("Documents", isDirectory: true)
            .appendingPathComponent(folder, isDirectory: true)
        let fileURL = folderURL.appendingPathComponent(fileName, isDirectory: false)

        DispatchQueue.global(qos: .utility).async {
            do {
                try FileManager.default.createDirectory(at: folderURL,
                                                         withIntermediateDirectories: true)
                try data.write(to: fileURL, atomically: true, encoding: .utf8)
                print("AleemFin: iCloud backup updated at \(fileURL.path)")
            } catch {
                print("AleemFin: iCloud backup failed: \(error)")
            }
        }
    }
}

/*
Integration in the Capacitor WKWebView:
    let handler = AleemFinICloudBackupHandler(containerIdentifier: "iCloud.com.aleemfin.prototype")
    webView.configuration.userContentController.add(handler, name: "iCloudBackup")

Add the handler once, before the WebView loads the AleemFin page.

In Xcode → Signing & Capabilities → + Capability → iCloud:
- Enable iCloud Documents
- Add the ubiquity container: iCloud.com.aleemfin.prototype

The exact container identifier must match the iCloud container configured
for the app's bundle identifier.
*/
