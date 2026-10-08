# Official Deal-Scoping Input Packages

This package contains the official JSON inputs for the Deal-to-Challenge Graph Engine challenge.

## Input Files

- `claimsdesk-modernization.json`
- `clinical-intake-and-patient-support-assistant.json`
- `member-experience-modernisation-early-discovery.json`
- `unified-supply-chain-analytics.json`

These files represent different solution types and levels of delivery readiness. Some packages intentionally contain unresolved questions, assumptions, quality findings, missing contracts, or conflicting decisions.

These conditions are part of the evaluation data and should not be silently corrected or removed.

## Submission Expectations

Your application must:

1. Import all four files without requiring manual modifications.
2. Preserve the original source identifiers and references.
3. Keep the imported package unchanged for audit and comparison.
4. Normalize relevant content into an internal execution model.
5. Surface missing information, conflicts, and blockers.
6. Generate discovery, clarification, approval, or blocked nodes where appropriate.
7. Avoid inventing missing contracts, architecture decisions, security details, estimates, or acceptance conditions.
8. Classify executable nodes using one primary Topcoder operating model:
   - Flexible Talent
   - Challenge
   - Private Pod
9. Export source-traceable execution graphs and model-specific execution packages.

## Important Clarification

The supplied packages are source inputs, not guaranteed examples of perfect or execution-ready solution packages.

Participants are expected to evaluate package maturity and carry unresolved conditions into the generated execution graph.

## Examples

The `examples/` directory contains illustrative normalized models and graph outputs. These examples provide structural guidance only. Evaluators will upload the original files from the `inputs/` directory.
