# 1Password CLI for env vars

Hugo uses the **1Password CLI (`op`)** to manage environment variables and secrets — secrets are not
stored in plaintext `.env` files committed to repos.

## How it's used

- Reference secrets via `op://` secret references rather than hardcoding values.
- Run commands with secrets injected at runtime: `op run --env-file=.env -- <command>`.
- Or materialise a template with `op inject -i .env.tpl -o .env` where the template holds `op://`
  references.

## Implications for agents

- Don't expect real secret values to live in committed files; an `.env` may hold `op://...`
  references instead of literal values.
- When adding a new secret/env var, wire it through 1Password (an `op://` reference) rather than
  pasting the value.
- Keep generated `.env` files out of git — `.gitignore` already excludes `.env` and `.env.*`.
