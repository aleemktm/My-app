# AleemFin v57 — Apple-native hierarchy refinement

## Scope
- Consolidated semantic type scale and radius scale around an Apple/iOS-native visual language.
- Moved Home / Insights segmented navigation directly below the Home hero dashboard card.
- Added horizontal swipe paging for Home / Insights and generic tablists across the app; vertical scrolling remains dominant.
- Unified segmented-control geometry, card radii, button/icon hit targets, borders, and bottom-sheet presentation.
- Standardized bottom-sheet top radius, handle, safe-area padding, control heights, and action-button geometry without changing financial calculations or storage keys.
- Updated About → Version to `1.0.57`.

## Verification
- All project JavaScript files pass `node --check`.
- Overview component was rendered through a lightweight React-compatible smoke harness without throwing.
- No changes were made to financial calculations, localStorage keys, or the iCloud bridge.
- Final on-device Safari/WKWebView verification remains necessary for physical keyboard/safe-area behavior because this source-only workspace cannot emulate an actual iPhone viewport.


## v57 refinement scope
- Home: four dashboard cards now sit before Quick Entry with explicit Apple-style spacing.
- Account and loan rear/history surfaces: decorative shadows removed.
- Insights: reordered to current position → how you got here → what you can control → supporting detail/trend.
- Added actionable control guidance for savings, spending and cash buffer.
- Assets: reorganized around portfolio check and practical controls; portfolio holding cards increased by ~30%.
- Ledger: heading simplified to `Connected Transactions`; the word Ledger is removed from the visible heading.
- Added swipe navigation to Assets and Planning sub-tabs to match Home behavior.
