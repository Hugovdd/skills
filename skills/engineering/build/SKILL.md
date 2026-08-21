---
name: build
description: Build one approved ready-for-agent ticket through TDD, gstack review, specialist review, and fresh verification.
disable-model-invocation: true
---

# Build

Execute exactly one `ready-for-agent` ticket through Build → Review → Test. Commit the verified result. Do not open a PR or merge.

## Preconditions

1. Read the issue body and all comments.
2. Require `ready-for-agent` and either an `AUTO` route receipt or a later `## Plan approved` receipt.
3. Require every blocking issue to be closed.
4. Claim the issue before editing. On GitHub, assign the authenticated user. If another assignee has already claimed it, stop.
5. Read the durable approved plan when present. Its outcome, boundary, and proof are the contract.
6. Confirm the named behavior test or approved test seam still exists.

If the ticket introduces a product decision, new public contract, or materially different proof surface that the approved plan did not cover: remove `ready-for-agent`, unclaim, post the finding, and return it to `route`. Never guess.

## Build

Invoke `tdd` and use the approved plan's test seams as the pre-agreed seams. Do not ask again unless the seam no longer exists.

Work in vertical slices:

1. Write one behavior test through a public interface.
2. Run it and observe the expected failure.
3. Write only enough production code to pass.
4. Run it and observe the pass.
5. Repeat.

Run focused type, lint, and test checks while building. Do not run the full suite repeatedly.

## Review

A different agent must review the complete diff with `gstack-review`.

Add only reviews named by the changed surface:

- UI behavior or visual output → `gstack-design-review`
- API, CLI, SDK, developer docs, or another developer journey → `gstack-devex-review`
- scary route trigger → the relevant security, data, billing, email, or concurrency specialist

Review depth:

- casual: one independent reviewer, at most one fix round
- normal: one independent reviewer, usually one and at most two fix rounds
- extra-careful: two independent reviewers with different jobs, at most two fix rounds

The builder adjudicates every finding against code and evidence. Fix true findings. Reject false findings with a concrete reason. A product call returns to Plan. Never blindly obey a reviewer and never loop beyond the cap.

During initial workflow evaluation, `code-review-hugo` and thermo may run as comparison overlays. Their output does not create extra review stages. Keep only findings not already covered by gstack.

## Test

After review fixes:

1. Commit the reviewed result.
2. Run relevant automated checks fresh on that exact commit.
3. Run the repository's full suite once when it defines one.
4. If a critical user flow changed, invoke `gstack-qa` or `gstack-qa-only` against the actual app, preview, Orca, or Codex surface named in the plan.
5. Routine UI may rely on automated behavior tests only when the approved plan explicitly names them as sufficient proof.

If required real-surface verification cannot run, report `verification pending`. The commit may proceed to `ship`, but its PR must remain draft.

Never claim `tests pass` or `verified` without fresh output from the exact commit.

## Completion

Post one issue comment containing:

- branch
- commit hash
- behavior delivered
- focused and full checks run with results
- gstack reviews run
- real-surface evidence or `verification pending`
- rejected reviewer findings and reasons, if any

Leave the issue open for `ship`. Do not create a second ticket, open a PR, or merge.
