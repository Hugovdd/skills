---
name: setup-matt-pocock-skills
description: Configure this repo for the engineering workflow: issue tracker, route labels, domain docs, and orchestrator policy.
disable-model-invocation: true
---

# Setup Engineering Skills

Scaffold the per-repo configuration that the workflow skills assume:

- **Issue tracker** - where issues live (GitHub by default; local markdown is supported)
- **Workflow labels** - readiness, blockers, disposition, and parent urgency
- **Domain docs** - where `CONTEXT.md` and ADRs live
- **Orchestrator** - copy the portable capability policy for `afk` and worker dispatch

This is a prompt-driven setup. Explore, present what you found, confirm the tracker and domain layout, then write. The workflow label vocabulary is fixed.

## Process

### 1. Explore

Look at the current repo to understand its starting state. Read whatever exists; don't assume:

- `git remote -v` and `.git/config` — is this a GitHub repo? Which one?
- `AGENTS.md` and `CLAUDE.md` at the repo root — does either exist? Is there already an `## Agent skills` section in either?
- `CONTEXT.md` and `CONTEXT-MAP.md` at the repo root
- `docs/adr/` and any `src/*/docs/adr/` directories
- `docs/agents/` — does this skill's prior output already exist?
- `.scratch/` — sign that a local-markdown issue tracker convention is already in use

### 2. Present findings and ask

Summarise what is present and missing. Ask the tracker and domain-layout decisions one at a time. The workflow label vocabulary and orchestrator safety contract are fixed, so explain them without asking the user to redesign them.

Assume the user does not know the terms. Each decision starts with a short explainer, choices, and a recommended default.

**Section A — Issue tracker.**

> Explainer: The issue tracker is where jobs live. `route`, `to-spec`, `to-tickets`, `build`, `ship`, and `afk` read and write it. Pick the place you actually track work.

Default posture: these skills were designed for GitHub. If a `git remote` points at GitHub, propose that. If a `git remote` points at GitLab (`gitlab.com` or a self-hosted host), propose GitLab. Otherwise (or if the user prefers), offer:

- **GitHub** — issues live in the repo's GitHub Issues (uses the `gh` CLI)
- **GitLab** — issues live in the repo's GitLab Issues (uses the [`glab`](https://gitlab.com/gitlab-org/cli) CLI)
- **Local markdown** — issues live as files under `.scratch/<feature>/` in this repo (good for solo projects or repos without a remote)
- **Other** (Jira, Linear, etc.) — ask the user to describe the workflow in one paragraph; the skill will record it as freeform prose


**Section B - Workflow label vocabulary.**

> Labels are a small search index, not the workflow schema. Create or map only the canonical roles below. Assignees, issue dependencies, route/plan comments, and draft/ready PR state carry everything else.

Canonical labels:

- `ready-for-agent` - a cold agent can start
- `blocked` - waiting on another ticket or external dependency
- `wontfix` - will not be actioned
- `priority:P0` - Now; parent issues only
- `priority:P1` - Next; parent issues only
- `priority:P2` - Later; parent issues only

Default: each role's string equals its name. Do not create `needs-triage`, `needs-info`, `ready-for-human`, `needs-spec`, progress, integration, path, size, hardening, or review-state labels.

**Section C — Domain docs.**

> Explainer: Some skills (`improve-codebase-architecture`, `diagnosing-bugs`, `tdd`) read a `CONTEXT.md` file to learn the project's domain language, and `docs/adr/` for past architectural decisions. They need to know whether the repo has one global context or multiple (e.g. a monorepo with separate frontend/backend contexts) so they look in the right place.

Confirm the layout:

- **Single-context** — one `CONTEXT.md` + `docs/adr/` at the repo root. Most repos are this.
- **Multi-context** — `CONTEXT-MAP.md` at the root pointing to per-context `CONTEXT.md` files (typically a monorepo).

### 3. Confirm and edit

Show the user a draft of:

- The `## Agent skills` block to add to whichever of `CLAUDE.md` / `AGENTS.md` is being edited (see step 4 for selection rules)
- The contents of `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md`

Let them edit before writing.

### 4. Write

**Pick the file to edit:**

- If `CLAUDE.md` exists, edit it.
- Else if `AGENTS.md` exists, edit it.
- If neither exists, ask the user which one to create — don't pick for them.

Never create `AGENTS.md` when `CLAUDE.md` already exists (or vice versa) — always edit the one that's already there.

If an `## Agent skills` block already exists in the chosen file, update its contents in-place rather than appending a duplicate. Don't overwrite user edits to the surrounding sections.

The block:

```markdown
## Agent skills

### Issue tracker

[one-line summary of where issues are tracked]. See `docs/agents/issue-tracker.md`.

### Workflow labels

[one-line summary of readiness, blocker, disposition, and parent urgency labels]. See `docs/agents/triage-labels.md`.

### Domain docs

[one-line summary of layout — "single-context" or "multi-context"]. See `docs/agents/domain.md`.

### Orchestrator

Worker dispatch follows `docs/agents/orchestrator.md`.
```

Then write the configuration files using the seed templates in this skill folder, and copy `templates/docs/agents/orchestrator.md` from the skills library to `docs/agents/orchestrator.md`:

- [issue-tracker-github.md](./issue-tracker-github.md) - GitHub issue tracker
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.md) - GitLab issue tracker
- [issue-tracker-local.md](./issue-tracker-local.md) - local-markdown issue tracker
- [triage-labels.md](./triage-labels.md) - workflow label mapping
- [domain.md](./domain.md) - domain doc consumer rules + layout

For "other" issue trackers, write `docs/agents/issue-tracker.md` from scratch using the user's description.

### 5. Done

Tell the user the setup is complete and which engineering skills will now read from these files. Mention they can edit `docs/agents/*.md` directly later — re-running this skill is only necessary if they want to switch issue trackers or restart from scratch.
