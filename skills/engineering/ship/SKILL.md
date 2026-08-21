---
name: ship
description: Ship one parent job as one reviewed and verified pull request using gstack-ship, then record a short reflection.
disable-model-invocation: true
---

# Ship

Turn one parent job into one PR. This skill owns job boundaries and readiness policy. `gstack-ship` owns branch, commit, push, release, and PR mechanics.

## Preconditions

1. Accept exactly one parent issue or a tiny standalone issue.
2. Read its approved plan and all child issues.
3. Require every included child to report a reviewed commit and fresh automated evidence.
4. Reject commits belonging to another parent job.
5. Reuse an existing PR for this parent instead of opening another.

A tiny standalone issue is its own parent.

## Assemble

For a multi-ticket job:

1. Work on the parent integration branch.
2. Apply child commits in dependency order.
3. Resolve only mechanical conflicts. A semantic or product conflict returns to Plan.
4. Record the exact included child issue and commit pairs.

Two green child commits can fail together. Child evidence never substitutes for combined evidence.

## Combined Review and Test

On the assembled commit:

1. Run the relevant automated checks and the full suite once when defined.
2. Invoke `gstack-review` on the combined diff.
3. Invoke `gstack-design-review` for combined UI changes.
4. Invoke `gstack-devex-review` for combined developer-facing changes.
5. Run required `gstack-qa` / `gstack-qa-only` scenarios against the combined preview or real app.
6. Fix and recheck true findings, within the parent job's review-round cap.

A required check that is missing, stale, or failing keeps the PR draft.

## Delegate Release Mechanics

Invoke `gstack-ship` only after the parent boundary and combined evidence are established. Let it perform its complete canonical workflow, including its own fresh review and test gates, commits, push, documentation sync, and PR create/update behavior.

Constraints passed into that run:

- one parent job = one PR
- update the existing parent PR when present
- never force-push
- do not merge
- draft while assembling or awaiting required proof
- ready only when review, automated tests, and required real-surface QA match the exact pushed commit

If gstack's canonical ship process finds a stricter requirement, the stricter requirement wins.

## Readiness

Mark the PR ready only when all are true:

- every intended child commit is included
- combined automated checks pass on the pushed commit
- `gstack-review` matches the pushed diff
- applicable Design and DevEx reviews match the pushed diff
- required real-surface QA matches the pushed commit or preview
- no unresolved product call or blocker remains

Hugo chooses when to merge. An agent may merge only when `docs/agents/orchestrator.md` explicitly grants that capability for the project and Hugo selected merges for this run.

## Reflect

After the PR is created or updated, post this on the parent issue:

```markdown
## Reflect

**Surprise:** <one concrete surprise, or none>
**Bad decision / override:** <one incorrect agent decision or Hugo override, or none>
**Rule to change:** <one routing, planning, review, or test rule; otherwise none>
```

Close child issues only when the tracker policy permits it. Keep the parent open until Hugo merges or explicitly closes it.

## Completion

Report:

- parent issue
- included child commits
- pushed commit
- PR URL and draft/ready state
- combined checks and specialist reviews
- QA evidence or remaining verification blocker
- Reflect receipt
