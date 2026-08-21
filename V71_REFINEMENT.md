# AleemFin v1.0.71 — Unified Financial Relationship Stability

Scope: data/logic synchronization only. Existing UI/UX and native deployment are preserved.

## Core rule
Home, Ledger, Loans, and other financial surfaces are views of the same underlying transaction/data relationship. A change from one surface must propagate to every connected surface immediately.

## Loan relationship fixes
- Loan-linked Ledger transactions now store the loan movement amount/currency as the canonical display value.
- `accountAmount` remains the exact balance-sheet impact in the selected account currency.
- Editing loan amount, currency, type, person/title, due date, primary account, or principal date updates the linked Ledger transaction and account effect.
- Deleting a linked Ledger transaction removes/reduces the corresponding loan movement and reverses the exact account impact.
- Deleting a Loan removes all linked Ledger records and reverses all linked account effects.
- Loan undo of the final principal movement removes the now-empty loan instead of leaving a zero-value card.
- Additional principal and repayments remain linked by movement IDs.
- Existing/legacy loan records are reconciled on startup where movement history is available.

## Multi-currency
- Loan display amount/currency stays identical across Loans and linked Ledger/Home transaction views.
- Account balance effects are converted into the account's own currency through `accountAmount`.
- Cash accounts use their own stored currency, so cash loans can be AED, USD, PKR, or any supported currency.

## Form consistency
- Loan edit uses the same core fields as loan creation, including account and date.
- Selecting an account automatically sets the loan form currency to that account currency, while still allowing legitimate multi-currency loan entries.

## Other financial types
Income, expense, and transfer flows continue to use the existing single transaction object for Home/Ledger/account calculations; no UI redesign was introduced.

## Verification
- JavaScript syntax checks passed for modified and dependent app modules.
- Targeted loan currency/edit/delete/account-impact logic tests passed.
- Only `www/app/main.js`, `www/modals.js`, and `www/tabs/settings.js` differ from v70.
- `ios/` tree is byte-for-byte unchanged from v70.
- About version updated to `1.0.71`.
