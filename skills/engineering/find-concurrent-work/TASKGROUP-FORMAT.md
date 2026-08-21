# Task-group spec format

One file per task group, written to `.claude/taskgroups/<slug>.md` during the
`/parallel-flow` front-load phase. This file is the **complete, self-contained
brief** a background worktree agent executes from — it is **inlined into the
agent's prompt**, and a copy is written into the worktree as a durable
reference. The agent has no user channel, so everything it needs to decide must
already be on the page.

Two ways a spec gets authored:
- **`needsGrill` group** — the decided requirements come from a `grill-with-docs`
  pass with the human. These are real design/architecture/big-eng calls.
- **`auto` group** — the requirements are the recommended approach, authored
  without a human gate and **marked auto-decided / revertible**. The human is
  told these were automated, but not asked to approve each one.

```markdown
---
slug: <kebab-case-id>
title: <one line>
triage: needsGrill | auto
status: drafting | ready | running | landed | reconciled | failed
sizeHint: small | big | direction
dependsOn: [<slug>, ...]        # empty = launches immediately
branch: <prefix>/<slug>         # the worktree branch the agent commits to
worktree: .claude/worktrees/<slug>
---

## Scope
What this group delivers, and explicitly what it does NOT — the boundary that
keeps it from colliding with a sibling group.

## Decided requirements
The settled approach — the source of truth the agent does not relitigate.
Mark each item [grilled] or [auto-decided, revertible] so its provenance is
clear. Capture the *why* where a choice was non-obvious, so a later divergence
is recognisable as a divergence.

## Blast radius
Concrete files/dirs this group may create or edit. The agent must stay strictly
inside this set. If it finds it needs anything outside — especially a
coordination file — it STOPS and reports rather than touching it.

## Coordination entries (agent must NOT apply these)
The registry / barrel-export / allowlist / manifest additions this group needs.
The agent only confirms the exact entries; the main-thread reconcile applies
them on the integration branch, where one writer means no conflict.

## Open questions — RESOLVED
Every needsGrill ambiguity with its grilled answer (and any auto choice taken).
If any genuine decision remains open, status MUST stay `drafting` — never fan
out an agent on an unresolved spec.

## Plan
(Filled by the agent, planning inline from the decided requirements above.)
Ordered, independently-verifiable steps with a verification each.

## Verification
How the finished group is confirmed correct (the project's own build/test, plus
any manual check).

## Learnings  ← appended by the reconcile loop
Where the implementation diverged from the plan and why; assumptions that broke;
anything that **challenges this or another group's decided requirements** (flag
cross-group — it may invalidate a sibling spec that hasn't run yet); which
doc/TODO/PROGRESS entries this group made stale.
```

## Lifecycle of `status`
- `drafting` — being grilled or auto-authored; not safe to execute.
- `ready` — all genuine decisions resolved; eligible for launch (once `dependsOn` have reconciled).
- `running` — a background worktree agent is executing it.
- `landed` — agent finished, committed to `branch`, returned its report; awaiting reconcile.
- `reconciled` — coordination edits applied, learnings folded into this spec + TODOS/PROGRESS, cross-group impacts surfaced.
- `failed` — agent failed / returned an incoherent or out-of-bounds result; worktree kept for inspection, dependents blocked, no auto-retry.
