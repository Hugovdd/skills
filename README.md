# Hugo's Skill Library

Public, reusable skills for software delivery, marketing, film/design, and business work.

This repository is the shared library, not the machine installer or personal vault. Private skills, voice, project packets, and Notion context live in [`Hugovdd/vault`](https://github.com/Hugovdd/vault).

## Source layout

Skills are grouped by domain in source and flattened when installed. Agent hosts still discover names such as `route`, `review-marketing-copy`, and `frontend-slides` directly.

| Path | Purpose |
|---|---|
| `skills/engineering/` | Product shaping, ticket routing, implementation, review, testing, and shipping |
| `skills/marketing/` | Positioning, research, copy, CRO, SEO, ads, and outreach |
| `skills/video & design/` | Story bibles, character plates, stills, video prompts, and HTML decks |
| `skills/business/` | Negotiation and other business workflows |
| `templates/` | Project instructions and agent policy templates |
| `snippets/` | Stack notes loaded on demand |
| `commands/`, `workflows/` | Older command-based workflows pending cleanup |
| `maps/` | Visual explanations of the workflows |

Put a new skill in the narrowest stable category. Categories are for humans; skill names remain globally unique.

## Engineering

Ticket-driven delivery: classify work, shape a plan, implement with TDD, review, verify, and ship one parent job as one PR.

| Skill | Description |
|---|---|
| `route` | Classify GitHub tickets, auto-start only tiny safe work, or send the job through `gstack-autoplan`. |
| `build` | Execute one approved `ready-for-agent` ticket through TDD, gstack review, specialist review, and fresh verification. |
| `ship` | Combine one parent job into one reviewed and verified PR using `gstack-ship`, then record a short reflection. |
| `afk` | Choose once what agents may run unattended, dispatch only those queues, and leave a return note. |
| `research` | Investigate a question against high-trust primary sources and write findings into the repo. |
| `wayfinder` | Map a large piece of work as investigation tickets and resolve them until the path is clear. |
| `grilling` | Stress-test a plan or design by interviewing until decisions lock. |
| `grill-with-docs` | Grill a plan against the domain model and update `CONTEXT.md` / ADRs as decisions crystallise. |
| `to-spec` | Turn the current conversation into a spec and publish it to the issue tracker. |
| `to-tickets` | Break a plan or spec into tracer-bullet tickets with blocking edges. |
| `domain-modeling` | Pin down ubiquitous language and record architectural decisions. |
| `find-concurrent-work` | Partition a backlog into independent task groups that can run in separate worktrees. |
| `prototype` | Build a throwaway prototype to answer a design or UI question. |
| `implement` | Implement a piece of work from a spec or set of tickets. |
| `tdd` | Test-first feature and bug work (red-green-refactor). |
| `code-review-hugo` | Two-axis review of changes since a fixed point: Standards vs Spec. |
| `thermo-nuclear-code-quality-review` | Strict maintainability review for abstraction quality, giant files, and spaghetti growth. |
| `unslop` | Cut AI tells from any writing. |
| `setup-matt-pocock-skills` | Configure a repo for this workflow: issue tracker, route labels, domain docs, orchestrator policy. |

## Marketing

Growth and GTM. Most skills read `.agents/product-marketing.md`. Run `product-marketing` first in a new project.

| Skill | Description |
|---|---|
| `product-marketing` | Create or update the product marketing context document (ICP, positioning, UVP). |
| `customer-research` | Analyze and gather customer research, interviews, reviews, and Jobs-to-be-Done. |
| `copywriting` | Write and improve marketing copy for pages using conversion frameworks. |
| `cro` | Audit marketing pages and forms to increase conversion. |
| `ad-creative` | Generate and iterate paid-ad copy, headlines, hooks, and creative angles. |
| `seo-audit` | Diagnose technical and on-page SEO issues. |
| `ai-seo` | Optimize content for AI search (AEO/GEO) and LLM citations. |
| `programmatic-seo` | Design template pages and data structures for SEO at scale. |
| `content-strategy` | Plan topic clusters, search intent, and editorial calendars. |
| `cold-email` | Write B2B cold outreach and multi-touch follow-up sequences. |
| `review-marketing-copy` | Creative-director critique of copy, hierarchy, and narrative. |

## Video & Design

Film pipeline first, then decks. Identity work is ordered: bible → character plates → stills → video prompts. `frontend-slides` is not part of that path.

| Skill | Description |
|---|---|
| `story-bible-builder` | Interview-driven story bible as an installable `SKILL.md` (world, voice, movement, production rules). |
| `character-builder` | Photoreal character grammar for Higgsfield / Nano Banana Pro: face lock, outfits, sheets on a flat gray plate. |
| `banana-pro-director-30` | Higgsfield still-image director: outfits, sheets, cinematic scene plates, outfit swaps. |
| `cinema-director-v3` | Seedance 2.0/2.5 and Higgsfield video prompt grammar on a locked 16-slot spine. |
| `frontend-slides` | Zero-dependency animated HTML presentations from scratch or PPTX, fixed 1920x1080 stage. |

## Business

Deal work. One skill today.

| Skill | Description |
|---|---|
| `deal-negotiator` | Negotiation prep and in-deal tactics drawing on Voss, Fisher, and related sources. |

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

1. Choose `engineering`, `marketing`, `video & design`, or `business`.
2. Create `skills/<category>/<skill-name>/SKILL.md`.
3. Keep the frontmatter `name` globally unique and equal to `<skill-name>`.
4. Keep companion files inside that skill directory.
5. Rebuild Home Manager and confirm the flattened skill appears for Claude and Codex.
6. Add an external dependency only when the skill cannot work without it.
7. Add a one-line row to this README and the category README if one exists.

Prefer a focused skill with a clear trigger and stop condition over a large general-purpose prompt.

## Project adoption

`setup-matt-pocock-skills` configures a project with:

- issue tracker instructions
- the small workflow-label vocabulary
- domain documentation paths
- `docs/agents/orchestrator.md`

The orchestrator document is the only project file that names current agent-host mechanics. Workflow skills stay portable.

## Vendored work

- `frontend-slides` is vendored from [zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides) under the MIT license.
- Most marketing skills are vendored from [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills).
