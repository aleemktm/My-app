# AleemFin v1.0.69 Refinement

## Fixes
- Deleting a Ledger transaction linked to the last principal movement of a lent-out or borrowed loan now removes the corresponding loan card instead of leaving a zero-value orphan.
- If additional principal movements remain on the loan, deleting one Ledger movement reduces the loan correctly without removing the remaining loan card.
- Delete confirmation closes immediately after the Delete action so the app returns to the same page without a stuck confirmation overlay.
- About → Version updated to `1.0.69 · Personal prototype`.

## Scope
- No native iOS/deployment files changed.
- No unrelated calculations or features changed.
