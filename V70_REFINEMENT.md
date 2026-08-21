# AleemFin v1.0.70 Loan Synchronization

- Kept UI/UX unchanged.
- Loan deletion now removes all linked loan Ledger transactions and reverses their account balances.
- Loan editing reconciles the primary linked principal transaction, account balance, loan type, currency conversion, amount, and movement history.
- Legacy loan transaction deletion fallback now converts transaction amounts into the loan currency before changing principal/repaid totals.
- Bulk loan deletion uses the same linked transaction/account reconciliation.
- About version updated to 1.0.70.
