# Hugo's Skill Library

Public, reusable skills for software delivery, marketing, design, and business work.

This repository is the shared library, not the machine installer or personal vault. Private skills, voice, project packets, and Notion context live in [`Hugovdd/vault`](https://github.com/Hugovdd/vault).

## Source layout

Skills are grouped by domain in source and flattened when installed. Agent hosts still discover names such as `route`, `review-marketing-copy`, and `frontend-slides` directly.

| Path | Purpose |
|---|---|
| `skills/engineering/` | Product shaping, ticket routing, implementation, review, testing, and shipping |
| `skills/marketing/` | Marketing and copywriting workflows |
| `skills/design/` | Visual design and presentation skills |
| `skills/business/` | Negotiation and other business workflows |
| `templates/` | Project instructions and agent policy templates |
| `snippets/` | Stack notes loaded on demand |
| `commands/`, `workflows/` | Older command-based workflows pending cleanup |
| `maps/` | Visual explanations of the workflows |

Put a new skill in the narrowest stable category. Categories are for humans; skill names remain globally unique.

## Engineering workflow

The main delivery loop is:

```text
Think → Plan → Build → Review → Test → Ship → Reflect
```

Four entry points keep the command surface small:

| Skill | Responsibility |
|---|---|
| `route` | Classify a ticket, auto-start only tiny safe work, or shape it and launch gstack planning |
| `build` | Execute one approved ticket through TDD, independent review, and fresh verification |
| `ship` | Combine one parent job into one reviewed and verified PR, then record a short reflection |
| `afk` | Dispatch only the unattended queues explicitly selected for that run |

### Why this shape

- **Low attention:** routine choices are automatic; product decisions stay human.
- **Visible stages:** Build, Review, and Test have different evidence and failure boundaries.
- **One job, one PR:** child tickets return commits; the parent proves the combined result.
- **Risk-based QA:** critical changed flows require real-surface proof; routine UI can use approved automated behavior tests.
- **Short learning loop:** every shipped parent records one surprise, one bad decision or override, and one possible rule change.
- **Few labels:** GitHub labels are a search index, not the workflow database.

See [`maps/workflow-map.tldraw`](maps/workflow-map.tldraw), page `Workflow v4`, for the plain-language flow.

## Matt/local and gstack

The workflow deliberately combines two packs without blending their ownership.

### Matt/local owns shaping and implementation

- `research`
- `wayfinder`
- `grill-with-docs`
- `to-spec`
- `to-tickets`
- `tdd`

### Namespaced gstack owns specialist review and release mechanics

- `gstack-autoplan`
- CEO, Design, Engineering, and DevEx plan reviews
- `gstack-review`
- `gstack-design-review`
- `gstack-devex-review`
- `gstack-qa` / `gstack-qa-only`
- `gstack-ship`

There is one autoplan: upstream `gstack-autoplan`. The local workflow hands it the rough plan and records the approved result. It does not fork or reproduce gstack's review prompts.

gstack is always installed with the `gstack-` prefix. This avoids collisions with local skills such as `ship`.

## Installation on Hugo's machines

Clone this library and gstack beside the Vault:

```bash
git clone https://github.com/Hugovdd/skills.git ~/Desktop/+/GitHub/skills
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/Desktop/+/GitHub/gstack
```

The Vault's Home Manager configuration flattens categorized public skills and unions them with Vault-only private skills into:

- `~/.claude/skills`
- `~/.codex/skills`

Apply the Home Manager configuration, then generate gstack's host-specific skills:

```bash
cd ~/Desktop/+/GitHub/vault/machine
./rebuild.sh

cd ~/.claude/skills/gstack
./setup --host auto --prefix
```

Edit public skills here. Never copy them into the Vault.

## Adding a skill

1. Choose `engineering`, `marketing`, `design`, or `business`.
2. Create `skills/<category>/<skill-name>/SKILL.md`.
3. Keep the frontmatter `name` globally unique and equal to `<skill-name>`.
4. Keep companion files inside that skill directory.
5. Rebuild Home Manager and confirm the flattened skill appears for Claude and Codex.
6. Add an external dependency only when the skill cannot work without it.

Prefer a focused skill with a clear trigger and stop condition over a large general-purpose prompt.

## Project adoption

`setup-matt-pocock-skills` configures a project with:

- issue tracker instructions
- the small workflow-label vocabulary
- domain documentation paths
- `docs/agents/orchestrator.md`

The orchestrator document is the only project file that names current agent-host mechanics. Workflow skills stay portable.

## Vendored work

`frontend-slides` is vendored from [zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides) under the MIT license.
