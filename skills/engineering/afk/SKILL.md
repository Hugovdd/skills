---
name: afk
description: Choose once what agents may run unattended, dispatch only those queues, and leave a return note.
disable-model-invocation: true
---

# AFK

Schedule unattended work. `/afk` changes when eligible work runs, never what quality or safety policy requires.

## Read policy

Read `docs/agents/orchestrator.md` before dispatch. If it is missing or cannot provide isolated workers, stop after producing the proposed send. Never invent host commands inside this skill.

## Ask once

Use one question round containing both:

### Duration

- lunch
- afternoon
- overnight

### Allowed queues

Multi-select; every option defaults off:

- ready tickets carrying `ready-for-agent`
- pending real-surface verification on draft PRs
- codebase health using `gstack-health` or the configured architecture survey
- research pile using `research`
- extra-careful jobs
- merges

No selection means do nothing. Do not reinterpret duration as permission.

## Hard boundaries

Unless explicitly selected, never dispatch:

- merges
- extra-careful work
- work with an unresolved product call
- production deploys
- destructive data operations
- billing, auth, permissions, or outbound side effects

Even when selected, a merge must satisfy `ship` readiness and the orchestrator's merge policy. `/afk` cannot waive a Plan, Review, Test, or Ship gate.

## Select work

### Ready tickets

Use only unassigned `ready-for-agent` tickets with no open blocker. Work the dependency frontier. Respect one Now and three ranked Next parent caps. Claim before dispatch.

### Pending verification

Use only draft PRs whose latest build/ship receipt says `verification pending`. Run the exact real-surface scenario required by the approved plan. A passing result may make the PR eligible for `ship` readiness; `/afk` itself does not mark ready unless the `ship` contract is executed.

### Codebase health

Run the configured health survey read-only unless the user explicitly selected a concrete cleanup ticket. Surveys produce findings, not opportunistic refactors.

### Research

Require one named question, output location, and done condition. Research does not silently become a build.

## Dispatch

Use the cheapest model that can finish each job in one pass. Give every worker:

- one ticket or one verification/research question
- the durable issue/PR URL
- an isolated workspace when code may change
- explicit allowed and forbidden actions from the selection
- required return format

Dispatch independent frontier items concurrently when the orchestrator supports it. Never put two workers on one ticket. Critics and reviewers report to the lead agent, not directly to Hugo.

## Return note

When the allowed duration ends or all work settles, write one concise note:

```markdown
## When you get back

### Started
- <job and worker>

### Finished
- <job, commit/PR/evidence>

### Still running
- <job and current stage>

### Blocked on you
- <question, recommended answer, why>
```

Omit empty sections. Link artifacts instead of pasting raw reviewer transcripts. Never claim completion without the worker's fresh evidence.
