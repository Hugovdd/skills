export const meta = {
  name: 'plan-pipeline',
  description: 'Turn a set of already-decided requirements into a tight execution plan: run an eng-review pass and synthesise an ordered plan in subagents, returning only compacted findings. Does NOT write code — execution happens in the main thread.',
  whenToUse: 'When the design decisions are already settled and you want a locked execution plan without the exploration bloating the main thread. Invoked by the /plan-flow command. Pass the decided requirements as args.',
  phases: [
    { title: 'Eng Review', detail: 'one subagent applies an eng-manager review over the decided design' },
    { title: 'Plan Synthesis', detail: 'one subagent turns the review into an ordered, executable plan' },
  ],
}

// args = {
//   taskSummary: string,   // what we're building, one paragraph
//   decisions:   string,   // the settled requirements/decisions — the source of truth
//   path:        string,   // 'small' | 'big' | 'direction' — rigor hint
// }
// Defensive arg unpacking: the Workflow harness can deliver `args` as a
// JSON-encoded STRING for this workflow (confirmed recurring — happens whether
// the caller passes a JSON string or a proper JSON object). A raw string means
// `a.taskSummary` is undefined and the whole plan silently falls back to
// defaults + infers scope from the uncommitted git diff (wrong target). Parse
// it back into an object first so the passed decisions actually reach the agents.
let a = args || {}
if (typeof a === 'string') {
  try { a = JSON.parse(a) } catch (e) { a = {} }
}
if (!a || typeof a !== 'object') a = {}

const argsArrived = Boolean(a.taskSummary || a.decisions)
const taskSummary = a.taskSummary || 'See the decisions below.'
const decisions = a.decisions || '(no explicit decisions passed — infer from taskSummary and the repo)'

if (!argsArrived) {
  log('⚠️  plan-pipeline: no taskSummary/decisions reached the script (args did not arrive) — the plan will infer scope from the repo, which is usually WRONG. Re-invoke with args, or hardcode the decisions into the returned scriptPath.')
}

const PROJECT_CONTEXT = `
Before reviewing, read whatever project docs exist to ground yourself in this codebase's conventions and domain language. Look for (and read the ones that exist): CLAUDE.md, README, CONTEXT.md, docs/ (PRD, ADRs, architecture/dev docs), TODOS.md, PROGRESS.md. Respect documented terminology, conventions, and platform constraints exactly — do not invent patterns the project doesn't already use.
`

const REVIEW_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['architecture', 'dataFlow', 'edgeCases', 'risks', 'testPlan', 'openConcerns'],
  properties: {
    architecture: { type: 'string', description: 'How the change fits the existing architecture — modules, boundaries, integration points. Concise.' },
    dataFlow: { type: 'string', description: 'The data/control flow through the change, end to end.' },
    edgeCases: { type: 'array', items: { type: 'string' }, description: 'Edge cases that must be handled.' },
    risks: { type: 'array', items: { type: 'string' }, description: 'Technical risks, gotchas, platform-specific traps.' },
    testPlan: { type: 'array', items: { type: 'string' }, description: 'What to verify and how.' },
    openConcerns: { type: 'array', items: { type: 'string' }, description: 'Anything the review thinks the settled decisions may NOT have covered — flagged for the human, not silently decided.' },
  },
}

const PLAN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['summary', 'filesTouched', 'steps', 'testStrategy'],
  properties: {
    summary: { type: 'string', description: 'One-paragraph statement of what will be built and the approach.' },
    filesTouched: { type: 'array', items: { type: 'string' }, description: 'Concrete file paths expected to be created or edited.' },
    steps: {
      type: 'array',
      description: 'Ordered, independently-checkable execution steps for the main thread to carry out.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['order', 'title', 'files', 'detail', 'verification'],
        properties: {
          order: { type: 'integer' },
          title: { type: 'string' },
          files: { type: 'array', items: { type: 'string' } },
          detail: { type: 'string', description: 'What to do in this step, specific enough to execute without re-deriving.' },
          verification: { type: 'string', description: 'How to confirm this step is correct.' },
        },
      },
    },
    testStrategy: { type: 'string', description: 'Overall verification approach for the finished change.' },
  },
}

phase('Eng Review')
const review = await agent(
  `You are an engineering manager locking in an execution plan: review the design across architecture, data flow, edge cases, test coverage, and performance, and take the opinionated recommendations yourself.
${PROJECT_CONTEXT}

The design decisions below are ALREADY settled and are the source of truth — do not relitigate them. If you find something the decisions genuinely did NOT cover and that materially changes the build, put it in openConcerns rather than silently choosing — the human will see it.

TASK:
${taskSummary}

SETTLED DECISIONS (source of truth):
${decisions}

Explore the codebase as needed. Return the structured review only.`,
  { label: 'eng-review', phase: 'Eng Review', schema: REVIEW_SCHEMA }
)

phase('Plan Synthesis')
const plan = await agent(
  `Turn the engineering review below into a tight, ordered execution plan that a developer (the main thread) can execute step by step WITHOUT re-deriving the design. Be concrete about file paths (follow the project's existing conventions) and give a verification per step. Do not write any code — only the plan.
${PROJECT_CONTEXT}

TASK:
${taskSummary}

SETTLED DECISIONS:
${decisions}

ENGINEERING REVIEW:
${JSON.stringify(review, null, 2)}

Return the structured plan only.`,
  { label: 'plan-synthesis', phase: 'Plan Synthesis', schema: PLAN_SCHEMA }
)

return { path: a.path || 'unknown', review, plan }
