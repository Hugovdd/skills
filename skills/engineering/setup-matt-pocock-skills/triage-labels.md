# Workflow Labels

Labels are a small search index. Comments, assignees, dependencies, and draft/ready PR state hold the workflow.

| Canonical role | Label in our tracker | Meaning |
|---|---|---|
| `ready-for-agent` | `ready-for-agent` | A cold agent can start |
| `blocked` | `blocked` | Waiting on a ticket or external dependency |
| `wontfix` | `wontfix` | Will not be actioned |
| `priority:P0` | `priority:P0` | Now; parent issues only |
| `priority:P1` | `priority:P1` | Next; parent issues only |
| `priority:P2` | `priority:P2` | Later; parent issues only |

Do not add workflow labels for planning gates, progress, integration, paths, size, hardening, or review readiness. Use the corresponding tracker state instead.
