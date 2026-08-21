# Agent Orchestrator

This file is the only project document that maps workflow operations to the current agent host. Skills describe policy and capabilities without naming Orca, Codex, Claude Code, or another host.

## Required capabilities

The configured host must provide:

| Capability | Contract |
|---|---|
| Start worker | Start one agent from a durable ticket or PR URL plus bounded instructions. |
| Start reviewer | Use a different agent context from the builder. |
| Claim | Record ownership on the tracker before code work begins. |
| Unclaim | Remove ownership when work returns to Plan or cannot proceed. |
| Isolation | Give every code-writing worker its own branch and isolated workspace. |
| Publish branch | Push a normal branch without force. |
| PR create/update | Reuse the parent job's existing PR when present. |
| Observe | Read worker status and final evidence without stealing its workspace. |
| Stop | Cancel a worker whose scope is invalid or whose permission was withdrawn. |

If the host lacks a required capability, stop that operation. Do not emulate isolation with several agents editing one checkout.

## Dispatch contract

Every worker receives:

1. exactly one ticket, PR, or research question
2. its durable URL
3. the approved plan URL when one exists
4. allowed actions and explicit prohibitions
5. the required review/test/QA evidence
6. the return format: branch, commit, checks, blockers, and product calls

Claim before dispatch. One ticket has one active builder. Independent dependency-frontier tickets may run concurrently.

## Model selection

Use the cheapest available model likely to finish in one pass:

- mechanical edits and evidence collection: low-cost tier
- normal implementation and review: standard tier
- product direction, architecture, combined-PR review, and scary triggers: strongest appropriate tier

A cheap failed pass costs more than one capable pass. Never weaken a required specialist review to save model cost.

## Review separation

The builder cannot be its only reviewer. Start `gstack-review`, Design, DevEx, QA, and scary-trigger specialists in a fresh context. Reviewers send findings to the lead agent. The lead verifies findings before asking the builder to fix them.

## Git and PR policy

- one parent job owns one integration branch and one PR
- child tickets return commits, not PRs
- never force-push
- never merge by default
- a PR remains draft while assembly or required proof is incomplete
- only `ship` may decide readiness

## AFK policy

`afk` may dispatch only queues Hugo selected in that invocation. Defaults are off. Duration is not permission. Production deploys, destructive data changes, product calls, extra-careful work, and merges remain forbidden unless explicitly selected and independently allowed by their workflow gates.

## Project adapter

Record host-specific commands or tool calls below when adopting this template in a project. The mapping must implement the capability contracts above without weakening them. Keep model names and host mechanics here so workflow skills remain portable.
