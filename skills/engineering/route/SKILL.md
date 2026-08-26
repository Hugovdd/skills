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

Before routing a selected issue, reconcile only that issue:

- Remove `ready-for-agent` when it has no valid readiness receipt.
- Remove `blocked` when its recorded external dependency is resolved.
- Remove noncanonical workflow labels such as `needs-spec`; preserve product, component, bug, and domain labels.
- Replace obsolete priority labels when the new urgency differs.
- Never mutate an unselected issue during queue inspection.

### Queue

With no issue, read open Hugo-filed tickets once and classify them into four sections:

1. **Needs routing** - no `## Route rec` comment.
2. **Needs planning** - the latest `## Route rec` has `Status: needs gstack-autoplan` and no later `## Plan approved`.
3. **Learning jobs** - the latest `## Route rec` has `Status: learn first`.
4. **Readiness drift** - `ready-for-agent` is present without either:
   - a latest `## Route rec` with `Status: AUTO`, or
   - a later `## Plan approved` receipt.

Ignore closed and `wontfix` tickets. Show one compact table per non-empty section. Include issue, title, urgency, rank, dependencies, and the reason it appears in that section.

Sections are mutually exclusive. Readiness drift wins over Needs planning, Learning jobs, and Needs routing; otherwise use the first matching section above.

Queue inspection is read-only. Let Hugo select tickets before changing comments or labels.

Process selected tickets in this order:

1. readiness drift
2. now
3. ranked next
4. later
5. unrouted tickets without urgency

For a selected unrouted or drifted ticket, run the One issue path first. For a selected planning ticket, continue at Plan path. For a selected learning job, show its learning brief and named next skill, but do not start a worker.

### Receipt precedence

Use comment creation time, not issue-body order.

- The newest `## Route rec` replaces every older route recommendation.
- A `## Plan approved` receipt is valid only when it is later than the newest Route recommendation.
- `ready-for-agent` is valid only when supported by `AUTO` on the newest Route recommendation or by a later Plan-approved receipt.
- An older approval never authorizes work after a newer route recommendation.

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
**Planning:** n/a | just-do-it | write-a-plan | explore-first
**How careful:** casual | normal | extra-careful
**Urgency:** now | next | later
**Rank if next:** 1 | 2 | 3 | n/a
**Existing behavior test:** <test or n/a>
**Blast radius:** <one sentence>
**Status:** AUTO | needs gstack-autoplan | learn first
```

For `AUTO`, apply `ready-for-agent` and stop. Do not start a worker.

For `learn first`, post the Route receipt followed by:

```markdown
## Learning brief

**Question:** <one named question>
**Answer destination:** <issue comment, committed file, or other durable location>
**Done when:** <observable completion condition>
**Next skill:** research | prototype | real-surface verification
```

Do not apply `ready-for-agent`. Close the learning ticket when the answer is written and the done condition is met. Any resulting build starts as a new or rerouted build ticket and returns to Think.

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
