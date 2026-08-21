# AleemFin v1.0.73 — Canonical Loan Engine

- Added a dedicated `core/loan-engine.js` for canonical Loan movement relationships.
- Create, lend/borrow more, repayment, undo, and linked deletion now use the shared Loan engine helpers.
- **Undo repayment never deletes the parent Loan**, including legacy repayment records whose movement record is missing.
- Final principal removal deletes the Loan; additional principal removal preserves the parent Loan.
- Loan movements remain linked one-to-one with Ledger transactions through `loanId` + `movementId`.
- Account-side balances continue to use `accountAmount`; Loan amounts remain in Loan currency.
- Cross-currency lifecycle coverage added for AED, USD and PKR.
- Added automated Loan Engine lifecycle tests covering Lent and Borrowed flows, repayment undo, principal deletion and Ledger reconciliation.
- Native iOS files were not intentionally changed.
- Existing Dashboard, Ledger, Accounts, Assets, Planning, Insights, Recurring, Settings and native feature layer remain intact.
- About version updated to 1.0.73.
