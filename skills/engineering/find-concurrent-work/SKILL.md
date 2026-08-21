---
name: find-concurrent-work
description: Partition a backlog (TODOS.md / PROGRESS.md / PRD / pasted requirements / codebase scan) into independent task groups that can run simultaneously in separate git worktrees without colliding. Lifts shared coordination files out of every group, marks cross-group dependencies, and triages which groups carry a real design/architecture decision (needs grilling) versus routine implementation (auto). Use when the user wants to parallelise work across agents/worktrees, asks to "find concurrent tasks", or invokes /parallel-flow.
---

<what-to-do>

Your job is to look at a body of pending work and carve it into **task groups** that can be executed *in parallel, in separate git worktrees, without stepping on each other*. You do NOT grill, plan, or write code here — you produce the partition, lift out the shared coordination surface, and triage where a human decision is actually required.

The guiding constraint: **two groups may run simultaneously only if their file blast-radii are disjoint and neither depends on the other's output.** Anything that shares files, shared types/contracts, or has an ordering dependency must either be merged into one group or marked as a dependency edge so the orchestrator serialises it.

### 1. Establish the work source

Use whatever the caller passed, in this priority:

1. **Pasted requirements** in the invocation args — partition those directly.
2. **Backlog docs** — read the ones that exist (e.g. `TODOS.md`, `PROGRESS.md`, a PRD/roadmap under `docs/`). Treat open/unchecked items as candidate work.
3. **Codebase scan** — when asked to find opportunities rather than run a written list, sweep for independent improvement seams (a module due for refactor, duplicated logic, a missing test surface). Be explicit that these are discovered, not requested.

Ground yourself first: read whatever orientation docs the project keeps (a root agent/conventions file, a CONTEXT.md / context-map, architecture or ADR docs) so the groups respect that project's real module boundaries and terminology. Discover the project's conventions — never assume a specific stack.

### 2. Push the heavy reading into subagents

Do not read the whole tree in the main thread. Delegate breadth to **Explore subagents** — e.g. one to map which files each backlog item would touch, one to detect shared types/contracts/entry-points between items. Pull back only the compacted findings you need to partition. Context-window economy is the whole point of this stack — match it.

### 3. Lift out the shared coordination surface

Every project has **coordination files** that many features must append to — registries, barrel/index exports, allowlists, route tables, manifests, dependency/lock files, migration directories, DI containers. Two otherwise-independent features routinely *both* need to touch these, and in isolated worktrees that collision only surfaces at merge time.

So **discover this project's coordination files** (don't assume names — find them: what does adding a comparable feature here already touch?) and treat them as a class apart. The rule the orchestrator enforces: **worktree agents never edit coordination files.** Each group implements its feature in its *own* files and **declares** the registry/export/allowlist entries it needs; those edits are applied later in one place, by one writer, during reconcile. Record, per group, the coordination entries it will need to declare.

### 4. Partition by blast-radius

For each candidate item, estimate the set of (non-coordination) files/modules it will create or edit. Then group:

- **Same group** — items whose file sets overlap, or that share a type/contract/migration, or that are too small to be worth their own worktree. A group can hold several tasks; that's fine and often better.
- **Separate groups** — disjoint file sets, no shared contract, no ordering dependency → safe to run at once.
- **Dependency edge (not parallel)** — group B consumes an API/type/file that group A introduces. Record `dependsOn: [A]`; the orchestrator runs B only after A lands and is reconciled.

When unsure whether two items collide, **assume they do** and say so in `risks` — a false "independent" causes worktree merge conflicts, which is the expensive failure here.

### 5. Triage: which groups actually need a human?

Not every group needs grilling. Grilling is reserved for decisions a human owns: **design, architecture, or big engineering trade-offs** — anything hard to reverse, surprising without context, or where reasonable implementations genuinely diverge on a point that matters. Routine implementation is *not* that: it gets a recommended approach and is automated (and reverted if wrong).

Classify each group:

- **`needsGrill`** — carries at least one real design/architecture/big-eng decision. List those decision points as `ambiguities` — the agenda for the front-loaded grilling.
- **`auto`** — routine implementation; the approach can be recommended and executed without a human gate. Still list any minor open choices, but mark them as safe-to-auto-decide.

When the triage itself is uncertain, **default to `needsGrill`** — auto-decisions are revertible, but a design call made silently and wrongly is expensive. Cheap conservatism.

</what-to-do>

<output>

Return a compacted, structured partition — no prose dump of file contents. For each group:

- `slug` — short kebab-case id (used for the worktree branch and the spec filename).
- `title` — one line.
- `scope` — what this group delivers, 1–3 sentences, including the boundary that keeps it from colliding with siblings.
- `tasks` — the backlog items folded into this group.
- `blastRadius` — concrete (non-coordination) files/dirs expected to be created or edited.
- `coordinationEntries` — the registry/export/allowlist/manifest additions this group needs, to be applied at reconcile (not by the agent).
- `dependsOn` — slugs of groups that must land first (empty = runs immediately).
- `triage` — `needsGrill | auto`.
- `ambiguities` — for `needsGrill`: the design/arch/big-eng decisions to resolve. For `auto`: minor choices, marked safe-to-auto-decide.
- `sizeHint` — `small | big | direction` (feeds the closing-review rigor).
- `risks` — collision risks, shared-contract worries, anything that could make "independent" wrong.

End with:
- a **parallelism summary**: which groups launch immediately, which wait, the critical path; and
- the **coordination surface** you discovered (the files agents must not touch).

If everything collides into one group, say so plainly and recommend a single-change flow instead — not every backlog parallelises, and forcing it causes conflicts.

</output>

<notes>
- Do NOT grill the user here, do NOT write specs, do NOT write code. Discovery, partition, and triage only.
- Stay high-level and project-agnostic — like grill-with-docs. Discover this project's conventions and coordination files; never hardcode framework- or repo-specific names.
- "Task group" is this tool's own vocabulary — do not push it into the project's domain glossary (CONTEXT.md).
- The per-group spec (with grilled or auto-authored decisions) is written later by the /parallel-flow front-load phase, using [TASKGROUP-FORMAT.md](./TASKGROUP-FORMAT.md).
- Honour an explicit "keep it to N groups" hint. The orchestrator grills at most 3 `needsGrill` groups per run; if more than 3 need grilling, surface them all but note the run will cover the first 3.
</notes>
