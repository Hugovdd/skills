---
description: Hugo's plan-driven execution flow, context-optimised. You bring already-decided requirements (grilling/CEO thinking done beforehand). This locks the plan via subagents (compacted findings only), executes in the main thread, then reconciles plan/docs/TODOs and runs a closing review.
argument-hint: "[paste the decided requirements/plan] — optionally hint rigor: small | big | direction"
---

You are executing the user's plan-driven dev process. The design has **already been decided by the user beforehand** (any grilling, CEO/product thinking, and direction calls happened outside this flow). Your job starts from settled requirements. Guiding principle: **context-window economy** — push exploration-heavy work into subagents that return compacted findings; keep the main thread for execution and for decisions that need the human.

## Input

The decided requirements / plan:

$ARGUMENTS

## Phase 0 — Size the change

Classify the change to scale the rigor of the closing review:

- **`small`** — small/contained change.
- **`big`** — significant change or broad blast radius.
- **`direction`** — touches product direction or core architecture.

Honour an explicit `small | big | direction` hint in the arguments. Otherwise state your assessment in one line and proceed (no confirmation gate needed — the decisions are already settled). If sizing needs a real codebase sweep, delegate it to an **Explore subagent** rather than reading broadly in the main thread.

## Phase 1 — Eng review + plan synthesis (WORKFLOW, background subagents)

Hand off to the **`plan-pipeline`** workflow. Call the **Workflow** tool with `name: "plan-pipeline"` and pass `args` as a **real JSON object** (not a JSON-encoded string):

```
args: {
  taskSummary: "<one-paragraph statement of the change>",
  decisions:   "<the decided requirements from the input above>",
  path:        "<small | big | direction>"
}
```

It returns `{ path, review, plan }` — **compacted findings only**, so the heavy exploration never enters the main thread. Do not re-run the eng review yourself.

**Verify the args arrived:** the workflow now defensively JSON-parses a stringified `args`, so a proper object OR a JSON string both work. Still confirm on return that `result.path` equals the `path` you passed (not `"unknown"`) and that `review`/`plan` reference *your* decisions, not some unrelated uncommitted diff in the tree. If `path` is `"unknown"` or the plan is about the wrong target, the args did not reach the script: edit the persisted script file (the `scriptPath` in the Workflow result) to hardcode `taskSummary`/`decisions`/`path` as template literals, and re-invoke with `{ scriptPath }`.

When it returns: present `plan.summary`, the ordered `plan.steps`, and `plan.filesTouched` concisely. **Surface `review.openConcerns` prominently** — these are things the review thinks the settled decisions may not have covered. If any are material, raise them with the user before executing rather than deciding silently.

## Phase 2 — Execute (main thread, fully auto)

Execute the plan's steps in the main thread (visible and interruptible), in order, verifying each step per its `verification` field. Run straight through without extra "should I proceed?" gates — except resolve any material open concern from Phase 1 with the user first.

## Phase 3 — Closing reconcile + review (only once execution passes)

When the change is implemented and its verifications pass, before considering the work done:

1. **Reconcile the plan & docs against what was actually built.** Spawn a subagent (Agent tool) that reads the diff (`git diff` / changed files), the original plan, and the project's planning docs (TODOS.md, PROGRESS.md, CONTEXT.md, ADRs, README — whichever exist) and returns a **compacted report**:
   - Where the implementation diverged from the plan, and why.
   - Doc/TODO/PROGRESS entries now stale or completed, with the specific edits needed.
   - **Anything in the findings that challenges a decision in the pipeline** (an assumption that didn't hold, a design choice the code argues against) — flagged explicitly, not silently absorbed.
2. **Apply the doc/TODO updates** in the main thread so they're visible, and **surface any pipeline challenges to the user** — those are decisions, not edits.
3. **Code review, scaled to size:**
   - All sizes: run the `code-review` skill on the diff for **correctness** (`/code-review high` for `big`).
   - `big` changes (or when the reconcile/review surfaces real structural risk): also run the **`thermo-nuclear-code-quality-review`** skill (via the Skill tool) — an extremely strict **maintainability/abstraction** audit of the branch's changes (giant files, spaghetti conditions, "code judo" restructurings). It is quality-focused, so it *complements* `code-review`'s correctness pass rather than replacing it. Do NOT use `/code-review ultra` here — too expensive. Use judgement on whether the thermo-nuclear pass is warranted for a given `big` change; say why.

## Rules

- Grilling and CEO/product review are **done by the user beforehand** — never run them here, never simulate them.
- The `plan-pipeline` workflow never writes code; all file changes happen in Phase 2 where the user can watch.
- Exploration-heavy work (sizing sweep, eng review, plan synthesis, closing reconcile) goes to subagents returning compacted findings. Execution and doc-writing stay in the main thread.
- If the change turns out more far-reaching than the size hint assumed, say so and bump the closing-review rigor up accordingly.
