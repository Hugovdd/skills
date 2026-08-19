# Skills

Hugo's public **Library**: shareable agent skills, commands, and workflows.

This is not a machine installer and not a personal vault. Private skills, voice, project packets, and Notion stay in [`Hugovdd/vault`](https://github.com/Hugovdd/vault).

## Layout

| Path | What it is |
|---|---|
| `skills/` | Public skills (`SKILL.md` each) |
| `commands/` | Claude Code slash commands (`plan-flow`, `parallel-flow`) |
| `workflows/` | Supporting JS for those commands |
| `snippets/` | Stack notes agents load on demand |
| `templates/AGENTS.md` | Baseline `AGENTS.md` for a new project repo |

## How it is used

Clone next to the Vault:

```bash
git clone https://github.com/Hugovdd/skills.git ~/Desktop/+/GitHub/skills
```

The Vault's home-manager config **unions** this tree with Vault-only private skills into `~/.claude/skills` and `~/.codex/skills`. Edit public skills here. Never copy them into the Vault.

`frontend-slides` is vendored from [zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides) (MIT).
