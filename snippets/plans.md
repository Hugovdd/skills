# Plans Policy

Durable planning files belong in `tmp/plans/` at the repository root.

- `tmp/` is gitignored, so plans stay local and don't pollute the codebase or get committed over time.
- Create `tmp/plans/` if a durable plan needs to be written and the directory does not exist.
- Name plan files with kebab-case and enough context to make them searchable, for example `tmp/plans/email-provider-migration.md`.
- Do not create new durable plan files under `~/.codex/plans`, `~/.claude/plans`, or other home-directory agent archives.
- Keep short in-chat plans in the conversation; only write a file when the plan needs to survive across sessions.
- When updating an existing plan, update the file in `tmp/plans/` rather than creating a duplicate elsewhere.
