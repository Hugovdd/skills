# Agent Instructions

Use this file as the shared project instruction layer for Codex, Claude Code, and other coding agents. Add project-specific stack, commands, conventions, and deployment notes below this baseline.

## Working Style

- Read the codebase before making broad assumptions.
- Prefer the repo's existing patterns over introducing new abstractions.
- Keep changes scoped to the request and avoid unrelated refactors.
- Preserve user changes already present in the worktree.
- Verify meaningful changes with the repo's normal tests, type checks, builds, or focused smoke checks.

## Plans

Durable planning files belong in `tmp/plans/` at the repository root.

- `tmp/` is gitignored, so plans stay local and don't pollute the codebase or get committed over time.
- Create `tmp/plans/` if a durable plan needs to be written and the directory does not exist.
- Name plan files with kebab-case and enough context to make them searchable, for example `tmp/plans/email-provider-migration.md`.
- Do not create new durable plan files under `~/.codex/plans`, `~/.claude/plans`, or other home-directory agent archives.
- Keep short in-chat plans in the conversation; only write a file when the plan needs to survive across sessions.
- When updating an existing plan, update the file in `tmp/plans/` rather than creating a duplicate elsewhere.

## Documentation

- Put repo-specific lessons close to the relevant files or in the repo's docs.
- Avoid documenting transient debugging notes unless they will help future maintainers.
- When adding setup instructions, include exact commands and note any required environment variables.

## Safety

- Do not run destructive commands such as `git reset --hard`, broad deletes, or production deploys unless the user explicitly asks.
- Do not commit secrets, tokens, local auth files, generated private state, or machine-specific config.
- Before changing deployment, database, billing, email, or auth flows, identify the verification path.

