# AleemFin v1.0.74 — New Canonical Loan System

This release moves Loan mutations from UI-specific reconciliation into one collection-level Loan domain.

## Canonical operations
- Create loan
- Lend more / Borrow more
- Record repayment
- Undo repayment / any movement
- Edit a Loan movement
- Edit the aggregate Loan principal
- Delete a Loan movement from Ledger or Loan History
- Delete an entire Loan
- Bulk delete Loan-linked Ledger entries

## Data relationship
Loan movements are authoritative for Loan principal and repayment totals. Each cash movement has a linked Ledger transaction via `loanId` + `movementId`. Account balances are reconciled from the linked transaction's `accountAmount`.

## Safeguards
- Undoing a repayment never deletes the parent Loan.
- The final principal cannot be removed while repayments remain.
- Deleting an entire Loan reverses all linked account effects and removes its linked Ledger rows.
- Loan currency is independent of account currency; FX conversion is used only for the account-side balance impact.

## Preserved systems
Dashboard, Accounts, Ledger, Assets, Planning, Insights, Recurring, Settings and native iOS capabilities remain outside the Loan domain.
