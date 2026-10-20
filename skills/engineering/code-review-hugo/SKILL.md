---
name: code-review-hugo
description: Review a branch, PR, work-in-progress changes, or changes since a commit, branch, tag, or merge-base along two independent axes. Quality & Standards checks correctness, documented conventions, and structural simplification; Spec checks fidelity to the originating issue or PRD. Runs parallel reviewers and reports each axis separately.
---

Review the requested changes along two independent axes:

- **Quality & Standards**: correctness, repository conventions, and implementation quality, including opportunities to delete structural complexity.
- **Spec**: whether the implementation faithfully satisfies the originating issue, PRD, or spec.

Run the axes as parallel sub-agents so they assess the change independently. This is a review, not authorization to edit the implementation.

## Process

### 1. Pin the comparison and scope

Resolve the user's fixed point to a commit with `git rev-parse --verify '<ref>^{commit}'` and resolve `HEAD` to a SHA. If no fixed point was supplied or established by the PR context, ask for it. Safely quote user-supplied refs in shell commands.

Use the merge-base by default: resolve `git merge-base <base-sha> <head-sha>`, then capture `git diff <merge-base-sha> <head-sha>` and `git log <base-sha>..<head-sha> --oneline`. If the user explicitly requests comparison against an exact commit rather than its merge-base, use that commit as the comparison base. Give both reviewers resolved SHAs, not moving branch names.

State the scope before dispatching:

- **Branch or PR review**: committed changes through the pinned HEAD. Report whether local changes were excluded.
- **Work-in-progress review**: include committed, staged, unstaged, and relevant untracked files. Capture `git diff <comparison-base-sha>` for the tracked final state and inventory untracked files with `git ls-files --others --exclude-standard`. Include their contents in the review input; ordinary git diff omits them.
- **Explicit narrower scope**: honor requests such as staged-only or selected files, and record the exclusions.

For work in progress, capture a shared snapshot of the diff and relevant file contents before dispatching so both reviewers inspect the same version. Do not stage, stash, or otherwise alter the user's work to obtain it. If the live checkout changes, use the snapshot for affected evidence or report that the affected checks need repeating.

Reject invalid refs before dispatch. Check that the selected scope, including untracked files when applicable, is non-empty. If it is empty, report that there is nothing to review.

### 2. Identify the spec source

Use a spec path or issue explicitly supplied by the user first. Otherwise look for:

1. Issue references in the PR or commit messages. Read `docs/agents/issue-tracker.md` when available and fetch through its documented workflow.
2. A PRD or spec under `docs/`, `specs/`, or `.scratch/` matching the branch or feature.
3. If nothing is found, ask where the spec is while continuing the Quality & Standards review. If none exists or it remains unavailable, skip Spec and report the gap.

A missing issue-tracker configuration does not block quality review or require repository setup. Use an available tracker integration when the issue source is clear.

### 3. Identify quality and standards sources

Read applicable `AGENTS.md` files and documented standards such as `CODING_STANDARDS.md` and `CONTRIBUTING.md`. Include the following baseline even if the repository documents no standards.

Repository conventions override baseline design preferences. Smells are investigation prompts, not violations or automatic refactoring prescriptions. They do not excuse demonstrated correctness defects. Skip cosmetic or mechanical findings already enforced by tooling; report actual check failures without duplicating each diagnostic.

#### Smell baseline

- **Mysterious Name**: a name conceals behavior or the domain concept it represents.
- **Duplicated Code**: repeated logic implements the same rule and risks diverging. Similar syntax alone does not justify extraction.
- **Feature Envy**: behavior depends heavily on another module's data and may belong with its owner.
- **Data Clumps**: values repeatedly travel together because they represent one concept.
- **Primitive Obsession**: loose primitives permit invalid states or obscure a meaningful contract.
- **Repeated Switches**: multiple sites dispatch on the same concept and must change together.
- **Shotgun Surgery**: one logical change requires scattered edits across unrelated places.
- **Divergent Change**: a module accumulates unrelated responsibilities.
- **Speculative Generality**: abstractions, parameters, or hooks serve no current requirement.
- **Message Chains**: callers depend on internal navigation through several objects.
- **Middle Man**: wrappers delegate without providing a useful contract or behavior.
- **Refused Bequest**: an implementation rejects much of its inherited contract.

Prefer deletion, direct code, and existing abstractions. Recommend a new type, helper, dispatcher, or polymorphic structure only when it reduces the total complexity of the affected flow. Moving complexity into more files is not itself an improvement.

#### Structural and code-judo pass

After inspecting individual changes, reconsider the shape of each meaningful flow. Could a different state model, ownership boundary, simpler default, or canonical utility eliminate whole branches, flags, helpers, or layers?

Investigate:

- New flags, optional values, scattered special cases, and repeated conditionals that complicate valid states.
- Feature logic in shared paths, details leaking through APIs, or bespoke helpers duplicating the canonical implementation.
- Wrappers, casts, loose object shapes, or silent fallbacks that conceal the actual invariant. `unknown` at a validated trust boundary is not inherently a smell.
- Related updates that can leave state half-applied, and unnecessary orchestration complexity. Suggest parallel execution only after checking independence, ordering, resource limits, and failure semantics.
- File growth that introduces unrelated responsibilities or makes a cohesive flow harder to follow. Crossing 1,000 lines prompts inspection, not an automatic finding or blocker.

A code-judo finding must name a concrete alternative, explain which concepts or control paths disappear, and account for behavior, error handling, and affected callers. Preserve validation, security, accessibility, and required behavior. Do not manufacture a restructuring proposal when the direct implementation is already appropriate.

### 4. Dispatch independent reviewers

Use the host's available general-purpose sub-agent tool to launch both reviewers concurrently when a spec is available. Otherwise launch only Quality & Standards. Provide each reviewer the pinned comparison, commit list, scope, and shared snapshot where applicable.

Give both reviewers these investigation and evidence rules:

- Read complete changed functions and inspect their callers, related types, tests, and analogous implementations. Trace meaningful changes from entry point through state changes, external effects, and error handling. Follow dependencies far enough to test the suspected issue; do not turn the review into an unrelated repository audit.
- Review changed behavior and regressions in affected existing paths. Distinguish pre-existing defects from problems introduced or exposed by the change.
- Validate suspected findings against surrounding code, safeguards, repository conventions, and relevant tests. Run targeted existing checks or a small reproduction when useful and safe. Do not claim tests ran when only their source was inspected.
- For each finding, give a precise file/line location, the concrete problem, its consequence or triggering scenario, and an actionable remedy. Mark its severity and distinguish a demonstrated defect, a documented-rule violation, and a design judgement or optional improvement.
- Drop claims contradicted by evidence. State uncertainty or missing evidence instead of presenting speculation as fact. For structural suggestions, explain why the alternative preserves behavior and reduces complexity.
- Prioritize within your axis. Be concise without a fixed word cap; do not omit material findings to meet a length target. Prefer high-conviction findings over cosmetic nits. Report inspected areas, checks actually run, and material coverage gaps.

**Quality & Standards reviewer** also receives the standards sources and all of step 3. Its brief:

> Check correctness even where no explicit spec requirement or documented standard covers the behavior. Assess boundary validation, error handling, state transitions, and relevant failure or concurrency paths. Cite the source file and rule for documented-standard findings. Treat baseline smells as design judgements. Perform the structural/code-judo pass after tracing the affected flows. Keep optional simplifications separate from defects and material structural regressions; a plausible refactor alone is not a blocker.

**Spec reviewer** also receives the spec path or fetched contents. Its brief:

> Trace each requirement to implementation and relevant tests. Report missing or partial requirements, implementations that appear present but behave incorrectly, and unjustified behavior outside the requested scope. Quote the relevant spec requirement for each finding; for scope additions, identify the behavior and explain how it exceeds the stated scope. Distinguish necessary implementation details from scope creep. Inspect acceptance criteria, edge cases, and failure behavior. Record covered requirements without findings compactly, and distinguish missing test evidence from proven missing functionality. Call out ambiguous requirements rather than inventing intent.

### 5. Validate and aggregate

Check the reviewers' evidence before publishing. Resolve contradictions, remove disproven claims and duplicates within each axis, and retain severity ordering within each. If one issue affects both axes, cross-reference it while preserving the distinct quality and requirement evidence. Do not merge the axes or rank one against the other.

Present `## Quality & Standards` and `## Spec`, separating defects or material regressions from optional improvements within each as needed. Include the pinned comparison and scope, plus a compact account of verification and coverage gaps. If Spec was skipped, say why. If no findings were substantiated, say so without implying unperformed checks passed.

End with the finding count and worst substantiated issue within each axis. A pass on one axis does not compensate for a failure or an unavailable review on the other. An optional code-judo proposal is not an automatic reason to withhold approval.
