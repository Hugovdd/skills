---
name: route
description: Classify GitHub tickets, auto-start only tiny safe work, or shape and send the job through gstack-autoplan.
disable-model-invocation: true
---

# Route

Turn Hugo-filed GitHub tickets into either a bounded learning job or an approved, cold-agent-ready build. This skill owns ticket policy. It does not implement code, start workers, or merge.

## Prerequisites

Read `docs/agents/issue-tracker.md` and `docs/agents/triage-labels.md` when present. GitHub is the default. Canonical labels:

- `ready-for-agent`
- `blocked`
- `wontfix`
- `priority:P0`, `priority:P1`, `priority:P2` on parent jobs only

Create a missing canonical label before applying it. Do not create `needs-triage`, `needs-info`, `ready-for-human`, `needs-spec`, path, size, hardening, progress, integration, or review-state labels.

`gstack-autoplan` must be installed. Invoke it through the host's skill mechanism. Never copy, summarize, or reimplement its review prompt.

## Modes

### One issue

Accept an issue number or URL. Read its body, labels, dependencies, and all comments. Replace any older route recommendation by posting a new dated comment; do not edit the issue body into a parallel schema.

### Planning queue

With no issue, list open tickets whose latest `## Route rec` has `Status: needs gstack-autoplan` and no later `## Plan approved` receipt. Show one compact table. Let Hugo select tickets to send into their Plan stages, then process the selections in rank order. Enforce the urgency caps before writing changes.

## Score independently

### Learn or build

- **learn:** one named question, where the answer will be written, and an observable done condition
- **build:** a product or code change

Research returns to Think. A learning answer never silently becomes approval to build.

### Planning

- **just-do-it:** ticket already states the outcome, boundary, and proof
- **write-a-plan:** use `grill-with-docs` only when terms or a hard product choice are fuzzy, then use `to-spec`
- **explore-first:** use `wayfinder`; when the way is clear, use `to-spec`

### Care

- **casual:** tiny and safe
- **normal:** everyday product or engineering work
- **extra-careful:** product direction, core infrastructure, or any scary trigger

Scary triggers, even for a one-line diff:

- login, identity, permissions, or secrets
- money or billing
- deletion or migration of live data
- email or another outbound side effect
- concurrency between systems
- a public API, CLI, SDK, or schema
- an unresolved product call

A scary trigger forbids casual and auto-start.

### Proof

- automated behavior evidence is required for every build
- real-surface QA is required only when a critical user flow changes
- routine UI may use automated behavior tests when the approved plan names them as sufficient
- internal non-UI work does not require real-surface QA unless a concrete user flow is affected

### Urgency

Set urgency only on the parent job:

- **now / `priority:P0`:** on fire; at most one open parent
- **next / `priority:P1`:** intended next; at most three open parents, ranked 1-3 in the route comment
- **later / `priority:P2`:** worthwhile, not this week

Refuse an assignment that would exceed a cap until Hugo frees or reranks a slot. Child tickets inherit urgency and receive no priority label.

## Auto-start gate

Apply `ready-for-agent` without `gstack-autoplan` only when every condition is proven:

- build + just-do-it + casual
- fits one sitting
- no new public contract
- one-PR rollback is credible
- blast radius fits one sentence
- an existing test names the real behavior
- no scary trigger
- no product judgment

Uncertainty means Plan, never auto.

## Route receipt

Post:

```markdown
## Route rec

**Learn or build:** learn | build
**Planning:** just-do-it | write-a-plan | explore-first
**How careful:** casual | normal | extra-careful
**Urgency:** now | next | later
**Rank if next:** 1 | 2 | 3 | n/a
**Existing behavior test:** <test or n/a>
**Blast radius:** <one sentence>
**Status:** AUTO | needs gstack-autoplan | learn first
```

For `AUTO`, apply `ready-for-agent` and stop. Do not start a worker.

## Plan path

For every non-auto build:

1. Produce the rough plan using the chosen Matt/local path. Materialize the issue or spec as `tmp/plans/issue-<number>.md` so gstack has a file to review.
2. Put the job boundary and explicit `Not in scope` section in that file before review.
3. Invoke `gstack-autoplan` with the file path. Let gstack own its premise and final approval gates.
4. If Hugo cancels or rejects, do not apply `ready-for-agent`.
5. After approval, publish the reviewed plan back to the durable spec issue or parent issue. Do not leave the only copy under gitignored `tmp/`.
6. Post the receipt below and apply `ready-for-agent`.

```markdown
## Plan approved

**Outcome:** <one sentence>
**Approach:** <one sentence>
**Reuse:** <existing flows reused>
**Changed public behavior:** <contract or none>
**Proof required:** <automated and real-surface evidence>
**Not in scope:** <explicit exclusions>
**gstack plan:** <durable issue/comment link>
```

The receipt records gstack's approval. It is not another gate.

## Stop conditions

Stop without readiness when facts remain unreachable, dependencies are open, gstack reports a feasibility/security blocker, or the plan still requires product judgment after its gates. Apply `blocked` only for a real external dependency, not for ordinary planning work.
