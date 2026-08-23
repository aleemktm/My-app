// AleemFin Phase 9 bootstrap — app logic is modularized under app/ and core/.
(function () {
  if (!window.AleemFinApp || !window.AleemFinApp.App) {
    throw new Error("AleemFin app modules failed to load.");
  }

  class AleemFinErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
      return { hasError: true };
    }
    componentDidCatch(error, info) {
      try {
        console.error("AleemFin render error", error, info);
      } catch (_) {}
    }
    handleReload = () => {
      try { window.location.reload(); } catch (_) {}
    };
    render() {
      if (!this.state.hasError) return this.props.children;
      return React.createElement(
        "div",
        { style: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "#09090b", color: "#f4f4f5", fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" } },
        React.createElement(
          "div",
          { style: { width: "100%", maxWidth: "420px", textAlign: "center" } },
          React.createElement("div", { style: { fontSize: "42px", marginBottom: "16px" } }, "⚠️"),
          React.createElement("h1", { style: { fontSize: "22px", margin: "0 0 8px", fontWeight: 700 } }, "Something went wrong"),
          React.createElement("p", { style: { color: "#a1a1aa", lineHeight: 1.5, margin: "0 0 22px" } }, "AleemFin could not display this screen. Your stored financial data has not been erased."),
          React.createElement("button", { type: "button", onClick: this.handleReload, style: { border: 0, borderRadius: "14px", padding: "12px 18px", fontWeight: 700, cursor: "pointer", background: "#22c55e", color: "#052e16" } }, "Reload AleemFin")
        )
      );
    }
  }

  var root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(React.createElement(AleemFinErrorBoundary, null, React.createElement(window.AleemFinApp.App, null)));
})();
