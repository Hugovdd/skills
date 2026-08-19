---
description: Hugo's parallel execution flow. Partition a backlog into independent task groups, grill ONLY the groups that carry a real design/architecture decision (≤3 per run) while auto-authoring the rest, then launch a background worktree agent per ready group — interleaved, so grilling one group overlaps execution of another. Reconcile learnings back into specs + TODOS/PROGRESS as each lands, apply shared coordination edits in one place, and finish with a combined integration build/test before you merge. The multi-group sibling of /plan-flow.
argument-hint: "[optional: pasted requirements, a 'keep to N groups' hint, or blank to scan TODOS.md/PROGRESS.md/PRD]"
---

You are running Hugo's **parallel** dev flow. It exists to take a *batch* of work, resolve **only the decisions a human actually owns** upfront, and let multiple agents execute simultaneously in isolated worktrees with no further input.

Two principles govern everything:

1. **Grill selectively, automate the rest.** A group is grilled **only** when it carries a real design/architecture/big-engineering decision — something hard to reverse, surprising without context, or where reasonable implementations diverge on a point that matters. Routine implementation is **not** grilled: take the recommended approach, automate it, flag it as revertible. Front-loading means front-loading the *human* decisions, not every detail.
2. **Always make the manual work explicit.** At every phase, state plainly what requires Hugo — which groups need grilling, each launch confirmation, any pending cross-group decision, the final merge. Everything else runs automatically and is reported, never buried.

Stay high-level and project-agnostic throughout (like grill-with-docs). Discover this project's conventions, build/test commands, and coordination files — never assume a stack. Context-economy rule holds: exploration → subagents (compacted findings); grilling + reconcile → main thread.

Input (optional): pasted requirements, a group-count hint, or blank.

$ARGUMENTS

---

## Phase 0 — Discover, partition, triage

Invoke the **`find-concurrent-work`** skill (Skill tool), passing `$ARGUMENTS`. If nothing was pasted, it reads the project's backlog docs (TODOS / PROGRESS / PRD, whichever exist) and may codebase-scan for independent seams.

It returns candidate **task groups** — each with `slug`, `scope`, `blastRadius`, `coordinationEntries`, `dependsOn`, `triage` (`needsGrill | auto`), `ambiguities`, `sizeHint`, `risks` — plus a parallelism summary and the **coordination surface** (files agents must never touch).

Present the partition concisely and **confirm it with Hugo before proceeding**. State explicitly:
- which groups are **`needsGrill`** and which are **`auto`**,
- that grilling is capped at **3 `needsGrill` groups per run** — if more need grilling, name them and note this run covers the first 3 (the rest are a later run),
- the dependency edges and the critical path.

Let Hugo reshape it (merge, split, drop, force a serial edge, re-triage a group). If everything collides into one group, say so and recommend plain `/plan-flow` instead — not every backlog parallelises.

## Phase 1 — Author specs: grill the few, auto-write the rest (interleaved with Phase 2)

Walk the groups. For each:

- **`needsGrill`** → resolve its design/arch/big-eng decisions with the **`grill-with-docs`** skill — challenge against CONTEXT.md, sharpen terms, cross-reference the code, update CONTEXT/ADRs inline as decisions crystallise.
- **`auto`** → author the spec yourself from the recommended approach. Do **not** gate on Hugo per choice; mark each decision `[auto-decided, revertible]` so its provenance is clear.

As each group's decisions settle, **write its spec** to `.claude/taskgroups/<slug>.md` using the format in the find-concurrent-work skill's [TASKGROUP-FORMAT.md](../skills/find-concurrent-work/TASKGROUP-FORMAT.md), and set `status: ready`. The spec is the complete self-contained brief: scope + boundary, decided requirements (with provenance), blast radius, **coordination entries the agent must NOT apply**, every genuine decision resolved, verification.

**Gate (hard):** a spec is `ready` only when every *genuine* decision is resolved (zero open `needsGrill` questions). Never launch an agent on a `drafting` spec — it has no user channel; a gap becomes a wrong implementation found only after the worktree runs.

This phase **interleaves with Phase 2**: you don't grill everything first. The moment one spec is `ready`, hand it to Phase 2 and **keep grilling/authoring the next** while it executes. Front-loading is **per group**, not per batch — you never grill ahead of what's running.

## Phase 2 — Launch a background worktree agent per ready group

When a group reaches `ready` (and its `dependsOn` are all `reconciled`), **announce it** — "group `<slug>` is ready → launching" — and on Hugo's go-ahead:

1. Create the named worktree: `git worktree add .claude/worktrees/<slug> -b <branch-prefix>/<slug>` (discover the project's branch-prefix convention; default `altar/`).
2. Spawn a **background agent of THIS session** (Agent tool, `run_in_background: true`) scoped to that worktree path — **not** the harness's auto-isolation, so the worktree is one of Hugo's named, inspectable ones and the agent still belongs to this session (so reconcile stays automatic). **Inline the full spec** into the agent's prompt (the file is a durable copy, not the delivery mechanism). Brief:

   > Work entirely inside the worktree at `.claude/worktrees/<slug>/`. Execute the inlined task-group spec end to end, staying **strictly inside its blast radius**. Plan it **inline** from the decided requirements (already settled — do not relitigate). Implement, then verify per the spec. **Never edit a coordination file** (registry / barrel export / allowlist / manifest) — only confirm the exact entries the spec declares and return them. If you find you need *any* file outside the blast radius, **STOP and report** rather than touching it. Review your own diff: run `code-review` for correctness, and for a `big`/`direction` sizeHint also `thermo-nuclear-code-quality-review` for maintainability. Commit to `<branch>`. Return a **compacted report**: what you built, the exact coordination entries to apply, where you diverged from the plan and why, assumptions that broke, anything that challenges this or another group's decided requirements, review findings + fixes, and which TODOS/PROGRESS/doc entries are now stale. Do not merge; do not touch the coordination surface.

Set the spec `status: running`. Keep grilling the next group — do not block polling; the harness re-invokes you when the agent finishes.

**Dependent groups do not launch** until their `dependsOn` are `reconciled` (not merely landed) — reconcile may amend their spec.

## Phase 3 — Reconcile loop (two-tier, as each lands)

When a background agent reports back:

**Mechanical tier — autonomous, no human gate:**
1. **Apply the group's declared coordination entries** on the integration branch / `main` — in one place, one writer, so registry/export/allowlist additions from N groups compose without conflict.
2. **Fold its learnings** into its spec (`## Learnings`) and **apply the doc/TODO updates** it surfaced (TODOS / PROGRESS / CONTEXT / ADRs) so the project record stays accurate — this is the loop element; nothing stays only in an agent's head. Set `status: reconciled`.
3. **Release newly-unblocked dependents** — any group whose `dependsOn` are now all `reconciled` becomes launch-eligible.

**Decision tier — the ONLY mid-flight human touchpoint:**
4. If a finding **challenges another group's decided requirements** (an assumption that broke, a contract that moved), **surface it to Hugo as a decision**, and amend the affected not-yet-run spec **before** that group launches. This is why dependents wait for reconcile, not just for landing.

**Failure:** an agent that fails, returns an incoherent/out-of-bounds result, or runs away → set `status: failed`, **leave its worktree intact** for inspection, **block its dependents**, **no auto-retry**. Surface it loudly; Hugo decides whether to re-run that one group, amend its spec, or drop it. Other independent groups are unaffected.

## Phase 4 — Integration verification, then hand off the merge

When every group is `reconciled` (or failed-and-acknowledged):

1. Merge the landed branches, in dependency order, into a **throwaway integration branch** — never directly onto Hugo's real `main`.
2. Run **the project's own build + test command** there (discovered from package scripts / Makefile / the conventions doc — never hardcoded).
3. Run `code-review` on the **combined** diff — the cross-branch interactions that per-group isolated review structurally cannot see.
4. Report integration **green/red** + combined-diff findings, the branches produced (one per group), per-group review verdicts, any failed groups, and the suggested **merge order**.

**Hugo does the real merge** — but on something proven to build, pass, and review *as a whole*. Do not auto-merge. Do NOT use `/code-review ultra` anywhere (too expensive).

## Rules

- **Grill only design/arch/big-eng decisions; automate routine implementation** (revertible) — never gate Hugo on a routine choice, never silently auto-decide a real design call (when triage is uncertain, grill).
- **Make manual work explicit at every phase** — grilling list, launch confirmations, pending decisions, final merge.
- **≤3 needsGrill groups per run.** More → name them, cover the first 3, rest next run.
- Each agent is **boxed to its blast radius** and **never touches the coordination surface** — those edits are lifted into the main-thread reconcile. If two groups collide mid-flight, stop the second, merge into one spec, re-run as one group.
- The reconcile loop is **mandatory** — an unreconciled group means specs/TODOS/PROGRESS have drifted from reality, which defeats the point.
- Reuse the stack: `find-concurrent-work` (discover/triage), `grill-with-docs` (front-load the few), `code-review` + `thermo-nuclear-code-quality-review` (per-group + combined close). Agents plan **inline** — `plan-pipeline` stays in single-change `/plan-flow`.
- For a single, non-partitionable change, use **`/plan-flow`** instead.
