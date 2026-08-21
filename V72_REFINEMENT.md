# AleemFin v1.0.72 — Unified Financial Relationship Architecture

- Loan movements are treated as the canonical principal/repayment history.
- Every loan movement has a linked Ledger transaction, including cash-only loans.
- Loan-linked Ledger edits route through the same movement relationship.
- Loan deletion, Ledger deletion, bulk transaction deletion, and account deletion reconcile linked loan movements.
- Loan totals are normalized from movements instead of trusting stale aggregate caches.
- Account-linked loan currency is constrained to the selected account currency at save time; cash-only loans retain their selected cash currency.
- Insights loan activity uses current-period linked loan transactions instead of an independent fallback reconstruction.
- Existing income/expense/transfer logic and historical FX behavior remain unchanged.
- UI/UX was not redesigned.
- Native iOS deployment files were not changed.
- About version updated to 1.0.72.
