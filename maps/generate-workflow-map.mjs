import {
  createTLStore,
  createShapeId,
  createBindingId,
  PageRecordType,
  DocumentRecordType,
  getIndexAbove,
  ZERO_INDEX_KEY,
} from 'tldraw'
import { writeFileSync } from 'node:fs'

const store = createTLStore()
const page = PageRecordType.create({ name: 'Workflow map', index: 'a1' })
const document = DocumentRecordType.create({ id: 'document:document' })
store.put([document, page])

let lastIndex = ZERO_INDEX_KEY
const nextIndex = () => {
  lastIndex = getIndexAbove(lastIndex)
  return lastIndex
}

const rt = (text) => ({
  type: 'doc',
  content: String(text)
    .split('\n')
    .map((line) => ({
      type: 'paragraph',
      content: line.length ? [{ type: 'text', text: line }] : [],
    })),
})

const geoDefaults = {
  w: 100,
  h: 100,
  geo: 'rectangle',
  dash: 'solid',
  growY: 0,
  url: '',
  scale: 1,
  flipX: false,
  flipY: false,
  color: 'black',
  labelColor: 'black',
  fill: 'semi',
  size: 's',
  font: 'sans',
  align: 'middle',
  verticalAlign: 'middle',
  richText: rt(''),
}

const textDefaults = {
  color: 'black',
  size: 'm',
  w: 8,
  font: 'sans',
  textAlign: 'start',
  autoSize: true,
  scale: 1,
  richText: rt(''),
}

const arrowDefaults = {
  kind: 'elbow',
  elbowMidPoint: 0.5,
  dash: 'solid',
  size: 's',
  fill: 'none',
  color: 'grey',
  labelColor: 'black',
  bend: 0,
  start: { x: 0, y: 0 },
  end: { x: 80, y: 0 },
  arrowheadStart: 'none',
  arrowheadEnd: 'arrow',
  richText: rt(''),
  labelPosition: 0.5,
  font: 'sans',
  scale: 1,
}

const noteDefaults = {
  color: 'yellow',
  richText: rt(''),
  size: 's',
  font: 'sans',
  align: 'start',
  verticalAlign: 'start',
  labelColor: 'black',
  growY: 0,
  fontSizeAdjustment: 1,
  url: '',
  scale: 1,
  textLastEditedBy: null,
}

const frameDefaults = {
  w: 320,
  h: 180,
  name: '',
  color: 'grey',
}

const shapes = new Map()

function put(record) {
  store.put([record])
  return record
}

function shape(id, type, x, y, props, extra = {}) {
  const rec = {
    id: createShapeId(id),
    typeName: 'shape',
    type,
    x,
    y,
    rotation: 0,
    index: nextIndex(),
    parentId: page.id,
    isLocked: false,
    opacity: 1,
    meta: {},
    props,
    ...extra,
  }
  shapes.set(id, rec)
  return put(rec)
}

function box(id, x, y, w, h, label, color = 'light-blue', geo = 'rectangle') {
  return shape(id, 'geo', x, y, {
    ...geoDefaults,
    w,
    h,
    geo,
    color,
    labelColor: 'black',
    fill: 'semi',
    richText: rt(label),
  })
}

function heading(id, x, y, text, size = 'xl') {
  return shape(id, 'text', x, y, {
    ...textDefaults,
    size,
    font: 'sans',
    richText: rt(text),
    w: 800,
    autoSize: true,
  })
}

function caption(id, x, y, text, color = 'grey') {
  return shape(id, 'text', x, y, {
    ...textDefaults,
    size: 's',
    color,
    font: 'sans',
    richText: rt(text),
    w: 400,
    autoSize: true,
  })
}

function note(id, x, y, text, color = 'yellow') {
  return shape(id, 'note', x, y, {
    ...noteDefaults,
    color,
    richText: rt(text),
  })
}

function frame(id, x, y, w, h, name, color = 'grey') {
  return shape(id, 'frame', x, y, { ...frameDefaults, w, h, name, color })
}

function arrow(id, fromId, toId, label = '', color = 'grey', opts = {}) {
  const from = shapes.get(fromId)
  const to = shapes.get(toId)
  const a = shape(id, 'arrow', from.x + from.props.w / 2, from.y + from.props.h / 2, {
    ...arrowDefaults,
    color,
    kind: opts.kind || 'elbow',
    dash: opts.dash || 'solid',
    end: {
      x: to.x + to.props.w / 2 - (from.x + from.props.w / 2),
      y: to.y + to.props.h / 2 - (from.y + from.props.h / 2),
    },
    richText: rt(label),
  })
  put({
    id: createBindingId(id + '-start'),
    typeName: 'binding',
    type: 'arrow',
    fromId: a.id,
    toId: from.id,
    props: {
      terminal: 'start',
      normalizedAnchor: opts.fromAnchor || { x: 0.5, y: 1 },
      isExact: false,
      isPrecise: false,
      snap: 'none',
    },
    meta: {},
  })
  put({
    id: createBindingId(id + '-end'),
    typeName: 'binding',
    type: 'arrow',
    fromId: a.id,
    toId: to.id,
    props: {
      terminal: 'end',
      normalizedAnchor: opts.toAnchor || { x: 0.5, y: 0 },
      isExact: false,
      isPrecise: false,
      snap: 'none',
    },
    meta: {},
  })
  return a
}

// ---------------------------------------------------------------------------
// Title
// ---------------------------------------------------------------------------
heading('title', 80, 28, 'Hugo workflow map  ·  when each skill fires')
caption(
  'subtitle',
  40,
  80,
  'Issue is the source of truth. Triage picks a path. Size + fog + harden scale the rigor. Edit this canvas as the system changes.',
)

// legend
box('leg-skill', 1680, 20, 150, 40, 'skill', 'light-blue')
box('leg-cmd', 1840, 20, 150, 40, 'command', 'violet')
box('leg-label', 2000, 20, 150, 40, 'issue label', 'yellow')
box('leg-gate', 2160, 20, 150, 40, 'decision', 'orange')
box('leg-hard', 2320, 20, 150, 40, 'harden', 'red')
box('leg-art', 2480, 20, 150, 40, 'artifact', 'green')
box('leg-gap', 2640, 20, 150, 40, 'missing skill', 'light-red')

// ===========================================================================
// 1. INTAKE
// ===========================================================================
frame('f-intake', 20, 140, 700, 360, '1 · Intake', 'grey')
heading('h-intake', 40, 150, '1. Capture', 'l')

box('src-idea', 50, 220, 180, 70, 'idea', 'grey')
box('src-fb', 250, 220, 180, 70, 'feedback', 'grey')
box('src-bug', 450, 220, 180, 70, 'bug report', 'grey')
box('gh-issue', 200, 360, 280, 80, 'GitHub issue', 'green', 'rectangle')
box('lbl-nt', 500, 380, 180, 50, 'needs-triage', 'yellow')

arrow('a-idea', 'src-idea', 'gh-issue', '', 'grey', {
  fromAnchor: { x: 0.5, y: 1 },
  toAnchor: { x: 0.2, y: 0 },
})
arrow('a-fb', 'src-fb', 'gh-issue', '', 'grey', {
  fromAnchor: { x: 0.5, y: 1 },
  toAnchor: { x: 0.5, y: 0 },
})
arrow('a-bug', 'src-bug', 'gh-issue', '', 'grey', {
  fromAnchor: { x: 0.5, y: 1 },
  toAnchor: { x: 0.8, y: 0 },
})

note(
  'n-intake',
  760,
  180,
  'You already file the ticket.\nNo skill here on purpose.\nA cold agent should never invent work that is not on the tracker.',
  'light-green',
)

// ===========================================================================
// 2. TRIAGE
// ===========================================================================
frame('f-triage', 20, 540, 1540, 520, '2 · Triage  (the hub)', 'orange')
heading('h-triage', 40, 550, '2. Triage', 'l')
box('triage', 80, 640, 240, 120, 'TRIAGE\nwhat is this, really?', 'orange', 'diamond')
box('triage-gap', 80, 790, 240, 70, 'triage skill\nnot in repo yet', 'light-red')

caption('triage-q', 360, 620, 'Four questions. Answer in this order.', 'black')

box('q-fog', 360, 670, 250, 90, '1. Fog?\nway clear or not?', 'orange')
box('q-size', 630, 670, 250, 90, '2. Size?\nsmall · big · direction', 'orange')
box('q-human', 900, 670, 280, 90, '3. Human decision?\ndesign / arch / product', 'orange')
box('q-harden', 1200, 670, 300, 90, '4. Harden?\nspec review · thermo review', 'orange')

box('out-info', 360, 810, 170, 56, 'needs-info', 'yellow')
box('out-wont', 545, 810, 170, 56, 'wontfix', 'yellow')
box('out-grill', 730, 810, 190, 56, 'needs-grill', 'yellow')
box('out-spec', 935, 810, 170, 56, 'needs-spec', 'yellow')
box('out-agent', 1120, 810, 200, 56, 'ready-for-agent', 'yellow')
box('out-human', 1335, 810, 190, 56, 'ready-for-human', 'yellow')
box('out-review', 730, 890, 220, 56, 'ready-for-review', 'yellow')

arrow('a-gh-triage', 'gh-issue', 'triage', '', 'grey', {
  fromAnchor: { x: 0.5, y: 1 },
  toAnchor: { x: 0.5, y: 0 },
})

note(
  'n-triage',
  1580,
  560,
  'Matt labels (setup-matt-pocock-skills):\nneeds-triage · needs-info · ready-for-agent · ready-for-human · wontfix\n\nYou also need:\nneeds-grill · needs-spec · ready-for-review\n\nTriage rule of thumb\n· small + way clear + no human decision → skip plan, implement\n· way clear + needs a written plan → to-spec\n· fog / too big for one session → wayfinder\n· already built → ready-for-review\n· core infra / product-shaping → turn harden ON',
  'orange',
)

note(
  'n-size',
  1580,
  860,
  'Size (from plan-flow)\nsmall = contained, skip planning\nbig = blast radius, spec + thermo likely\ndirection = product or core architecture. Grill. Spec review. Accept recommended answers unless it changes the product or you are 50/50.',
  'light-violet',
)

// ===========================================================================
// 3. PATHS
// ===========================================================================
heading('h-paths', 40, 1100, '3. Paths  ·  pick one', 'l')

// --- SMALL ---
frame('f-small', 20, 1160, 620, 620, 'Path A · small, skip planning', 'light-green')
heading('h-small', 40, 1170, 'A. Small', 'l')
box('small-ready', 60, 1250, 220, 70, 'ready-for-agent', 'yellow')
box('small-impl', 60, 1380, 220, 80, 'implement', 'light-blue')
box('small-tdd', 320, 1380, 220, 80, 'tdd\nseams = success', 'light-blue')
box('small-rev', 60, 1520, 220, 80, 'code-review-hugo\nlight', 'light-blue')
caption('c-small', 60, 1630, 'No spec. No grill. No wayfinder.\nStill write the failing test first if there is a seam.', 'grey')
arrow('a-sr', 'small-ready', 'small-impl', '', 'green', {
  fromAnchor: { x: 0.5, y: 1 },
  toAnchor: { x: 0.5, y: 0 },
})
arrow('a-si', 'small-impl', 'small-tdd', 'uses', 'blue', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('a-st', 'small-impl', 'small-rev', 'then', 'blue', {
  fromAnchor: { x: 0.5, y: 1 },
  toAnchor: { x: 0.5, y: 0 },
})

// --- SPEC ---
frame('f-spec', 680, 1160, 720, 620, 'Path B · way is clear, write the spec', 'light-blue')
heading('h-spec', 700, 1170, 'B. Spec', 'l')
box('spec-grill', 720, 1250, 220, 70, 'grill-with-docs\nif terms/ADRs matter', 'light-blue')
box('spec-plain', 970, 1250, 180, 70, 'grilling\nno docs yet', 'light-blue')
box('spec-dom', 1180, 1250, 180, 70, 'domain-modeling', 'light-blue')
box('to-spec', 850, 1380, 220, 80, 'to-spec\nsynthesize, do not interview', 'light-blue')
box('spec-art', 1110, 1380, 220, 80, 'spec issue\nready-for-agent', 'green')
box('plan-rev', 850, 1520, 280, 80, 'gstack-autoplan\nCEO / Design / Eng / DevEx', 'red')
box('to-tickets', 1160, 1520, 200, 80, 'to-tickets\nif > 1 session', 'light-blue')
caption('c-spec', 720, 1640, 'to-spec writes the PRD from what is already known.\nSeams get confirmed before publish.', 'grey')
arrow('a-gg', 'spec-grill', 'to-spec', '', 'blue', {
  fromAnchor: { x: 0.5, y: 1 },
  toAnchor: { x: 0.3, y: 0 },
})
arrow('a-gp', 'spec-plain', 'to-spec', '', 'blue', {
  fromAnchor: { x: 0.5, y: 1 },
  toAnchor: { x: 0.6, y: 0 },
})
arrow('a-gd', 'spec-grill', 'spec-dom', 'updates', 'green', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('a-ts', 'to-spec', 'spec-art', '', 'green', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('a-pr', 'spec-art', 'plan-rev', 'if harden', 'red', {
  fromAnchor: { x: 0.3, y: 1 },
  toAnchor: { x: 0.5, y: 0 },
})
arrow('a-tt', 'spec-art', 'to-tickets', 'if big slice', 'blue', {
  fromAnchor: { x: 0.7, y: 1 },
  toAnchor: { x: 0.5, y: 0 },
})

// --- WAYFINDER ---
frame('f-way', 1440, 1160, 780, 620, 'Path C · fog. Find the way first', 'violet')
heading('h-way', 1460, 1170, 'C. Wayfinder', 'l')
box('way-chart', 1480, 1250, 240, 70, 'wayfinder\nchart the map', 'violet')
box('way-map', 1760, 1250, 220, 70, 'map issue\nwayfinder:map', 'green')
box('wf-research', 1480, 1380, 160, 70, 'research\nAFK', 'light-blue')
box('wf-proto', 1660, 1380, 160, 70, 'prototype\nHITL', 'light-blue')
box('wf-grill', 1840, 1380, 160, 70, 'grilling\nHITL', 'light-blue')
box('wf-task', 2020, 1380, 160, 70, 'task\nunblock', 'light-blue')
box('way-work', 1480, 1520, 240, 70, 'wayfinder\nwork one ticket', 'violet')
box('way-clear', 1760, 1520, 240, 70, 'way is clear\n→ Path B', 'orange', 'diamond')
caption('c-way', 1480, 1630, 'Plan, do not do. One ticket per session.\nFog stays in Not yet specified until the question is sharp.', 'grey')
arrow('a-wc', 'way-chart', 'way-map', '', 'green', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('a-wr', 'way-map', 'wf-research', 'child', 'grey', {
  fromAnchor: { x: 0.15, y: 1 },
  toAnchor: { x: 0.5, y: 0 },
})
arrow('a-wp', 'way-map', 'wf-proto', '', 'grey', {
  fromAnchor: { x: 0.4, y: 1 },
  toAnchor: { x: 0.5, y: 0 },
})
arrow('a-wg', 'way-map', 'wf-grill', '', 'grey', {
  fromAnchor: { x: 0.65, y: 1 },
  toAnchor: { x: 0.5, y: 0 },
})
arrow('a-wt', 'way-map', 'wf-task', '', 'grey', {
  fromAnchor: { x: 0.9, y: 1 },
  toAnchor: { x: 0.5, y: 0 },
})
arrow('a-ww', 'wf-grill', 'way-work', '', 'violet', {
  fromAnchor: { x: 0.2, y: 1 },
  toAnchor: { x: 0.7, y: 0 },
})
arrow('a-wclear', 'way-work', 'way-clear', 'loop until', 'orange', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})

// --- PARALLEL ---
frame('f-par', 2260, 1160, 560, 620, 'Path D · many independent groups', 'violet')
heading('h-par', 2280, 1170, 'D. Parallel', 'l')
box('fcw', 2300, 1250, 260, 80, 'find-concurrent-work\npartition + triage', 'light-blue')
box('pflow', 2300, 1380, 260, 80, 'parallel-flow', 'violet')
box('p-grill', 2580, 1380, 200, 80, 'grill ≤3 groups\nrest auto-spec', 'orange')
box('p-run', 2300, 1520, 260, 80, 'worktree agents\nthen reconcile', 'violet')
caption('c-par', 2300, 1640, 'Only if blast radii are disjoint.\nElse fall back to Path B + plan-flow.', 'grey')
arrow('a-fcw', 'fcw', 'pflow', '', 'violet', {
  fromAnchor: { x: 0.5, y: 1 },
  toAnchor: { x: 0.5, y: 0 },
})
arrow('a-pg', 'pflow', 'p-grill', '', 'orange', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('a-prun', 'pflow', 'p-run', '', 'violet', {
  fromAnchor: { x: 0.5, y: 1 },
  toAnchor: { x: 0.5, y: 0 },
})

// ===========================================================================
// 4. IMPLEMENT  (superpowers iron law)
// ===========================================================================
frame('f-impl', 20, 1840, 1680, 380, '4 · Implement  ·  success is defined first', 'blue')
heading('h-impl', 40, 1850, '4. Implement', 'l')

box('impl-seams', 60, 1940, 260, 90, 'tdd\nagree seams first\nthat is "what is success"', 'light-blue')
box('impl-red', 360, 1940, 180, 90, 'RED\nfailing test', 'light-red')
box('impl-green', 570, 1940, 180, 90, 'GREEN\nmin code', 'light-green')
box('impl-skill', 790, 1940, 200, 90, 'implement\none ticket', 'light-blue')
box('plan-flow', 1030, 1940, 220, 90, 'plan-flow\ndecisions already made', 'violet')
box('impl-pipe', 1290, 1940, 220, 90, 'plan-pipeline\neng review in subagent', 'violet')

caption(
  'c-impl',
  60,
  2070,
  'obra/superpowers: no production code before a failing test. Watch it fail. Watch it pass.\nPocock tdd: one vertical slice per cycle. Refactor is NOT in this loop. It belongs to review.\nimplement always ends in code-review. plan-flow is the single-change command once grilling is done.',
  'grey',
)

note(
  'n-impl',
  1720,
  1860,
  'Iron law (superpowers)\nIf code exists without a test, delete it and start from red.\n\nPocock tweak\nRefactor is a review job, not a TDD step. Keeps the implement context clean.',
  'light-blue',
)

arrow('a-seam', 'impl-seams', 'impl-red', '', 'red', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('a-rg', 'impl-red', 'impl-green', '', 'green', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('a-gi', 'impl-green', 'impl-skill', '', 'blue', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('a-pf', 'plan-flow', 'impl-pipe', 'spawns', 'violet', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
// Paths join implement by convention, not by long crossing arrows.

// ===========================================================================
// 5. REVIEW
// ===========================================================================
frame('f-rev', 20, 2270, 1680, 380, '5 · Review  ·  two axes, optional thermo', 'red')
heading('h-rev', 40, 2280, '5. Review', 'l')

box('rev-label', 60, 2370, 200, 70, 'ready-for-review', 'yellow')
box('rev-hugo', 300, 2370, 280, 90, 'code-review-hugo\nStandards  +  Spec\nparallel sub-agents', 'light-blue')
box('rev-thermo', 620, 2370, 300, 90, 'HARDEN\nthermo-nuclear\nbig / core / messy structure', 'red')
box('rev-done', 960, 2370, 200, 70, 'merge / PR', 'green')

caption(
  'c-rev',
  60,
  2500,
  'Primary review: gstack-review. UI adds gstack-design-review; developer-facing surfaces add gstack-devex-review.\nThe builder verifies findings before fixing them. Product calls return to the gstack Plan stage.\nThe plan-time engineering review is gstack-plan-eng-review inside gstack-autoplan.',
  'grey',
)

note(
  'n-rev',
  1720,
  2280,
  'gstack review matrix\n\nsmall           review\nUI              + design-review\ndeveloper API   + devex-review\nscary/core      + relevant specialist\n\nPlanning:\ngstack-autoplan owns CEO, Design, Engineering, and DevEx review.',
  'red',
)

arrow('a-rh', 'rev-label', 'rev-hugo', '', 'grey', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('a-rt', 'rev-hugo', 'rev-thermo', 'if harden', 'red', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('a-rd', 'rev-hugo', 'rev-done', '', 'green', {
  fromAnchor: { x: 0.5, y: 1 },
  toAnchor: { x: 0.3, y: 0 },
})
arrow('a-td', 'rev-thermo', 'rev-done', '', 'green', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('a-impl-rev', 'impl-skill', 'rev-label', '', 'grey', {
  fromAnchor: { x: 0.5, y: 1 },
  toAnchor: { x: 0.5, y: 0 },
})

// ===========================================================================
// 6. SKILL GRAPH
// ===========================================================================
heading('h-graph', 40, 2700, '6. What references what', 'l')
caption('c-graph', 40, 2755, 'Solid = invokes. Dashed = reads / writes artifact.', 'grey')

const gY = 2820
box('g-setup', 40, gY, 200, 64, 'setup-matt-pocock-skills', 'violet')
box('g-tracker', 280, gY, 180, 64, 'docs/agents/*\ntracker + labels', 'green')
box('g-way', 500, gY, 150, 64, 'wayfinder', 'violet')
box('g-grill', 690, gY, 130, 64, 'grilling', 'light-blue')
box('g-gwd', 850, gY, 150, 64, 'grill-with-docs', 'light-blue')
box('g-dom', 1030, gY, 160, 64, 'domain-modeling', 'light-blue')
box('g-res', 1220, gY, 130, 64, 'research', 'light-blue')
box('g-pro', 1380, gY, 130, 64, 'prototype', 'light-blue')
box('g-ctx', 1540, gY, 160, 64, 'CONTEXT.md\nADRs', 'green')

const gY2 = 2960
box('g-spec', 500, gY2, 130, 64, 'to-spec', 'light-blue')
box('g-tix', 660, gY2, 130, 64, 'to-tickets', 'light-blue')
box('g-impl', 820, gY2, 130, 64, 'implement', 'light-blue')
box('g-tdd', 980, gY2, 110, 64, 'tdd', 'light-blue')
box('g-cr', 1120, gY2, 170, 64, 'code-review-hugo', 'light-blue')
box('g-th', 1320, gY2, 150, 64, 'thermo-nuclear', 'red')
box('g-per', 1500, gY2, 190, 64, 'gstack-autoplan', 'red')

const gY3 = 3100
box('g-pf', 500, gY3, 150, 64, 'plan-flow', 'violet')
box('g-par', 680, gY3, 160, 64, 'parallel-flow', 'violet')
box('g-fcw', 870, gY3, 190, 64, 'find-concurrent-work', 'light-blue')
box('g-pipe', 1090, gY3, 150, 64, 'plan-pipeline', 'violet')

arrow('g1', 'g-setup', 'g-tracker', 'writes', 'green', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('g2', 'g-way', 'g-grill', '', 'blue', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('g3', 'g-way', 'g-res', '', 'blue', {
  fromAnchor: { x: 1, y: 0.2 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('g4', 'g-way', 'g-pro', '', 'blue', {
  fromAnchor: { x: 1, y: 0.8 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('g5', 'g-gwd', 'g-dom', '', 'blue', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('g6', 'g-dom', 'g-ctx', 'writes', 'green', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
  dash: 'dashed',
})
arrow('g7', 'g-spec', 'g-impl', '', 'blue', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('g8', 'g-tix', 'g-impl', '', 'blue', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('g9', 'g-impl', 'g-tdd', 'uses', 'blue', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('g10', 'g-impl', 'g-cr', 'then', 'blue', {
  fromAnchor: { x: 1, y: 0.8 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('g11', 'g-pf', 'g-pipe', '', 'violet', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('g12', 'g-pipe', 'g-per', '', 'red', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('g13', 'g-par', 'g-fcw', '', 'violet', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
})
arrow('g14', 'g-pf', 'g-cr', '', 'blue', {
  fromAnchor: { x: 0.8, y: 0 },
  toAnchor: { x: 0.3, y: 1 },
  dash: 'dashed',
})
arrow('g15', 'g-par', 'g-th', 'if big', 'red', {
  fromAnchor: { x: 1, y: 0.2 },
  toAnchor: { x: 0.2, y: 1 },
  dash: 'dashed',
})
arrow('g16', 'g-tracker', 'g-way', 'read', 'grey', {
  fromAnchor: { x: 1, y: 0.5 },
  toAnchor: { x: 0, y: 0.5 },
  dash: 'dashed',
})
arrow('g17', 'g-gwd', 'g-ctx', '', 'green', {
  fromAnchor: { x: 0.5, y: 0 },
  toAnchor: { x: 0.2, y: 1 },
  dash: 'dashed',
})

// ===========================================================================
// 7. OUT OF BAND
// ===========================================================================
heading('h-oob', 40, 3240, '7. Always-on and side lanes', 'l')
box('oob-unslop', 40, 3310, 180, 64, 'unslop\nalways on', 'grey')
box('oob-slides', 240, 3310, 180, 64, 'frontend-slides', 'grey')
box('oob-copy', 440, 3310, 200, 64, 'review-marketing-copy', 'grey')
box('oob-deal', 660, 3310, 180, 64, 'deal-negotiator', 'grey')
caption('c-oob', 40, 3400, 'Not on the issue → implement loop. Do not drag them into triage.', 'grey')

note(
  'n-gaps',
  900,
  3260,
  'Gaps to decide later\n1. Write a real triage skill (hub is currently tribal).\n2. Add labels: needs-grill, needs-spec, ready-for-review.\n3. When does grilling become grill-with-docs? Default: if CONTEXT.md or ADRs exist, or the work will create them.\n4. Bug path: still an issue. Small bug → Path A + tdd. Foggy bug → Path C research ticket, then red test.',
  'light-red',
)

// camera-ish: not required
const file = {
  tldrawFileFormatVersion: 1,
  schema: store.schema.serialize(),
  records: store.allRecords(),
}

writeFileSync('/tmp/tldraw-gen/workflow-map.tldr', JSON.stringify(file, null, 2))
writeFileSync('/tmp/tldraw-gen/public/workflow-map.tldr', JSON.stringify(file, null, 2))
writeFileSync('/Users/hugo/Desktop/+/GitHub/skills/maps/workflow-map.tldr', JSON.stringify(file, null, 2))
console.log('records', file.records.length, 'schema', file.schema.schemaVersion)
process.exit(0)
