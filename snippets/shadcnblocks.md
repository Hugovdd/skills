# shadcnblocks Pro

Hugo has a **shadcnblocks Pro** subscription — https://www.shadcnblocks.com/ — a library of
production-ready blocks/sections built on shadcn/ui and Tailwind. Use it on **any project with a
front end** to skip building common UI (heroes, pricing, feature grids, footers, etc.) from scratch.

## When to reach for it

- The project has a web front end using React + Tailwind (shadcn/ui-compatible).
- You need a polished, conventional section/layout rather than something bespoke.
- Prefer adapting a shadcnblocks block over generating boilerplate UI by hand.

## MCP setup (per project)

shadcnblocks ships an MCP server, but the **API key must be configured on every new project** — it is
not global. On a new front-end repo:

1. Grab the shadcnblocks API key from the account dashboard at https://www.shadcnblocks.com/.
2. Add the shadcnblocks MCP server to that project's MCP config with the API key.
3. Confirm the MCP tools resolve before relying on them, since the key is project-local.

Treat the key as a secret — keep it out of committed files (use the project's `.env` / MCP secret
mechanism, which `.gitignore` already excludes).
