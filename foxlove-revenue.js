const { useState, useEffect, useRef, createContext, useContext } = React;
const h = React.createElement;
const FX = 'foxlove_assets/';
const Zoom = createContext(() => {});
const reduced = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const scrollToId = (id) => { const el = document.getElementById(id); el && el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }); };

const SECTIONS = [
  { id: 'overview', nav: 'Overview' },
  { id: 'context', nav: '01 / Context', num: '01', label: 'Context & brief' },
  { id: 'process', nav: '02 / Process', num: '02', label: 'Design process' },
  { id: 'research', nav: '03 / Research', num: '03', label: 'Discovery research' },
  { id: 'requirements', nav: '04 / Requirements', num: '04', label: 'Requirements & structure' },
  { id: 'handoff', nav: '05 / Handoff', num: '05', label: 'Communicating the design' },
  { id: 'impact', nav: '06 / Impact', num: '06', label: 'Impact of the process' },
  { id: 'reflection', nav: '07 / Reflection', num: '07', label: 'Reflection' },
];

const STEPS = [
  ['Listen', 'Semi-structured interviews'],
  ['Cluster', 'Affinity mapping'],
  ['Recognise', 'Patterns across people'],
  ['Translate', 'Design implications'],
  ['Prioritise', 'Key features'],
];

const PHASES = [
  { label: 'Understand', sub: 'Start with the business and the people.',
    did: 'I worked with the founder to understand the commercial goal, then studied the storyboard, context and personas she shared to see who the product was for and where it fitted into their day.',
    methods: ['Stakeholder conversations', 'Storyboard review', 'Persona review'],
    out: 'A shared picture of the problem, and a list of questions I could not yet answer.' },
  { label: 'Question', sub: 'Personas give a starting point, not proof.',
    did: 'I used the personas to map likely frustrations from the context I had. These were informed guesses, so I treated them as assumptions to test rather than facts to build on.',
    methods: ['Persona-based frustration mapping', 'Assumptions log'],
    out: 'A set of assumptions to confirm or challenge with real people.' },
  { label: 'Interview', sub: 'Ask people about their real days.',
    did: 'I shortlisted candidates by role, then interviewed 12 people across the three target audiences. Semi-structured, open-ended questions covered their daily lives, frustrations and motivations, and each session included a prototype walkthrough to capture reactions.',
    methods: ['Recruitment shortlist', 'Semi-structured interviews', 'Prototype walkthroughs'],
    out: 'Detailed first-hand accounts of what frustrates and motivates each group.' },
  { label: 'Synthesise', sub: 'Turn conversations into patterns.',
    did: 'I logged every answer in a structured database, compared participants side by side, and used a colour-coded affinity board to cluster what people said, recognise patterns and see which features mattered most.',
    methods: ['Q&A database', 'Comparison matrix', 'Affinity mapping', 'Feature prioritisation'],
    out: 'Four themes, each paired with design implications.' },
  { label: 'Define', sub: 'Turn priorities into scope and structure.',
    did: 'I wrote functional and non-functional requirements, each linked back to its source in the research, then shaped the information architecture and the paths people would take through the product.',
    methods: ['Source-grounded requirements', 'Information architecture', 'User flows'],
    out: 'A clear, traceable scope for the MVP.' },
  { label: 'Design', sub: 'Make it concrete enough to build.',
    did: 'I created high-fidelity wireframes alongside user flows, and used them to communicate with the founder and the developer so everyone stayed aligned as the MVP took shape.',
    methods: ['High-fidelity wireframes', 'User flows', 'Design handoff'],
    out: 'Designs the founder could react to and the developer could build from.' },
];

const METHODS = [
  { g: 'Understand', name: 'Persona-based frustration mapping', why: 'It gave me a starting point from the context the founder provided. I kept the output as assumptions to test, because it was not yet evidence.' },
  { g: 'Discover', name: 'Recruitment shortlist', why: 'Shortlisting by role, and tracking outreach and NDA status in one place, helped make sure the interviews covered the right audiences.' },
  { g: 'Discover', name: 'Semi-structured interviews', why: 'Open questions with room to follow up gave me rich, detailed data about frustrations, motivations and daily life, which assumptions alone could not.' },
  { g: 'Synthesise', name: 'Structured Q&A database', why: 'Keeping every answer next to its design implication meant nothing was lost between the conversation and the design.' },
  { g: 'Synthesise', name: 'Comparison matrix', why: 'It let me compare reactions, needs and concerns across different kinds of participants side by side.' },
  { g: 'Synthesise', name: 'Colour-coded affinity mapping', why: 'Clustering what people said made patterns visible, and colour kept what people said separate from what I interpreted.' },
  { g: 'Define', name: 'Source-grounded requirements', why: 'Linking each requirement to the interview or session it came from made every decision traceable and easier to defend.' },
  { g: 'Define', name: 'Information architecture and user flows', why: 'They showed how people would move through the product before I committed to screens.' },
  { g: 'Design', name: 'High-fidelity wireframes', why: 'They gave the founder and the developer something concrete to react to, discuss and build from.' },
];
const GROUPS = ['All', 'Understand', 'Discover', 'Synthesise', 'Define', 'Design'];

const EVIDENCE = [
  ['Signal and quote', 'What a participant said, kept in their own words as raw evidence.'],
  ['Design requirement', 'What the product needs to do in response, written so it can be built and tested.'],
  ['Emotional goal', 'How the experience should make someone feel, such as protected, focused or in control.'],
  ['Design trigger', 'The specific design cue that would create that feeling.'],
];

const THEMES = [
  { title: 'Trust & candid feedback',
    heard: 'Formal settings can inhibit honesty. Candid signals may surface in lower-pressure, psychologically safe moments.',
    response: 'A lightweight, low-pressure way to contribute, with privacy choices.' },
  { title: 'Tool fatigue & context',
    heard: 'Delivery staff may lack context on sales targets and resist complex, multi-field workflows.',
    response: 'A simple, single-step way to capture a note.' },
  { title: 'Psychological safety',
    heard: 'Sales commissions and targets can feel misaligned with engineering work.',
    response: 'A focus on recognition and visible impact.' },
  { title: 'Noise control & scale',
    heard: 'Account managers need more than a raw stream of notes from many contributors.',
    response: 'Support for sorting and grouping notes so account managers see patterns.' },
];

const REQS = {
  functional: [
    ['Fast capture', 'A simple way to log an observation without navigating forms.', 'Theme 02'],
    ['Clear privacy controls', 'People can see and control what is shared.', 'Themes 01 and 03'],
    ['Recognition for contributors', 'Contributors see the value of what they share, without monetary pressure.', 'Theme 03'],
    ['Organised summaries', 'Account managers see patterns, not a raw stream of notes.', 'Theme 04'],
  ],
  nonfunctional: [
    ['Security and anonymity', 'Sensitive input is protected, and contributors can stay anonymous.', 'Themes 01 and 03'],
    ['Usability and speed', 'A fast, uncluttered experience that works well on mobile.', 'Theme 02'],
    ['Integration', 'Valuable on its own first, with lightweight links to existing tools.', 'Theme 04'],
    ['Scalability', 'The experience stays readable as more people contribute.', 'Theme 04'],
  ],
};

const AUDIENCES = [
  { k: 'Founder', need: 'A clear picture of the product direction that she could react to, and confidence that it reflected what users had said.',
    gave: ['High-fidelity wireframes', 'User flows', 'Requirements tied to research themes'] },
  { k: 'Developer', need: 'Unambiguous designs to build from, with states and spacing spelled out and a sense of what to build first.',
    gave: ['Wireframes with defined states', 'Layout and spacing guidance', 'A prioritised build order'] },
];

const STATS = [[12, 'Interviews', 'from a shortlist of 44 candidates'], [19, 'Q&A entries', 'logged in a structured database'], [16, 'Insight cards', 'across four affinity themes'], [33, 'Requirements', 'each linked to a source']];

const IMPACT = [
  ['For users', 'Designed around real frustrations', 'Interviews replaced assumptions with evidence, and every requirement was linked to a source, so decisions could be traced back to what people said about their working lives.'],
  ['For the team', 'A shared picture to build from', 'Wireframes, flows and traceable requirements gave the founder something to react to and the developer something to build from.'],
  ['For the business', 'A focused MVP scope', 'Prioritised findings helped an early-stage team decide what mattered first, rather than working from a long list of possibilities.'],
];

function useInView() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window) || reduced()) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

function CountUp({ to }) {
  const [ref, seen] = useInView();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (reduced()) { setN(to); return; }
    let raf, t0;
    const step = (t) => { t0 = t0 || t; const k = Math.min(1, (t - t0) / 900); setN(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen]);
  return h('b', { ref }, n);
}

function Fig({ src, alt, caption, label }) {
  const [ok, setOk] = useState(true);
  const zoom = useContext(Zoom);
  return h('figure', { className: 'fig' },
    ok
      ? h('button', { type: 'button', className: 'fig-btn', onClick: () => zoom({ src, alt, caption }), 'aria-label': 'Enlarge image: ' + alt },
          h('img', { src, alt, onError: () => setOk(false) }))
      : h('div', { className: 'fig-empty' }, label || alt),
    caption && h('figcaption', null, caption));
}

function Sec({ id, dark, children }) {
  const s = SECTIONS.find((x) => x.id === id);
  const [ref, seen] = useInView();
  return h('section', { id, className: 'sec' + (dark ? ' dark' : '') },
    h('div', { ref, className: 'wrap reveal' + (seen ? ' in' : '') },
      h('p', { className: 'eyebrow' }, h('span', { className: 'num' }, s.num), s.label),
      children));
}

function Tabs({ label, items, value, onChange, prefix, panelId }) {
  const onKey = (e) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (value + d + items.length) % items.length;
    onChange(next);
    const el = document.getElementById(prefix + next); el && el.focus();
  };
  return h('div', { className: 'tabs', role: 'tablist', 'aria-label': label, onKeyDown: onKey },
    items.map((it, i) => h('button', { key: it.label, id: prefix + i, type: 'button', role: 'tab', className: 'tab' + (value === i ? ' on' : ''), 'aria-selected': value === i, 'aria-controls': panelId, tabIndex: value === i ? 0 : -1, onClick: () => onChange(i) },
      it.num && h('span', { className: 'tn' }, it.num), it.label)));
}

function Seg({ label, items, value, onChange }) {
  return h('div', { className: 'seg', role: 'group', 'aria-label': label },
    items.map(([k, l]) => h('button', { key: k, type: 'button', className: 'seg-btn' + (value === k ? ' on' : ''), 'aria-pressed': value === k, onClick: () => onChange(k) }, l)));
}

function useActive() {
  const [active, setActive] = useState('overview');
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-25% 0px -65% 0px' });
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); el && io.observe(el); });
    return () => io.disconnect();
  }, []);
  return active;
}

function SubNav({ active }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const f = () => { const d = document.documentElement; setPct((d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100); };
    f(); addEventListener('scroll', f, { passive: true });
    return () => removeEventListener('scroll', f);
  }, []);
  return h('div', { className: 'subnav' },
    h('div', { className: 'wrap subnav-row' },
      h('a', { className: 'back', href: 'index.html#work' }, '← Back'),
      h('nav', { 'aria-label': 'Case study sections' },
        SECTIONS.map((s) => h('a', { key: s.id, href: '#' + s.id, className: active === s.id ? 'on' : '', 'aria-current': active === s.id ? 'true' : undefined }, s.nav)))),
    h('div', { className: 'bar', style: { width: pct + '%' } }));
}

/* ---------- sections ---------- */
const Glance = (items, note) => h(React.Fragment, null,
  h('div', { className: 'glance' }, items.map(([b, l]) => h('div', { key: l }, h('b', null, b), h('span', null, l)))),
  note && h('p', { className: 'note glance-note' }, note));

function Hero() {
  const meta = [
    ['Role', ['UX researcher & product designer (sole designer)']],
    ['Methods', ['Interviews · affinity mapping · requirements · wireframes']],
    ['Context', ['Early-stage B2B SaaS · MVP']],
  ];
  return h('div', { id: 'overview', className: 'wrap' },
    h('div', { className: 'cs-hero' },
      h('div', { className: 'pills' }, h('span', { className: 'tag' }, 'Foxlove'), h('span', { className: 'tag' }, 'UX research & design'), h('span', { className: 'tag hot' }, 'Client work')),
      h('h1', null, 'Account Intelligence'),
      h('div', { className: 'stage' },
        h('div', { className: 'stage-top' }, h('span', null, 'Quick signals from the people closest to the client'), h('span', null, 'Early-stage B2B SaaS · MVP')),
        h(Fig, { src: FX + 'hero-signin.png', alt: 'Foxlove sign-in screen with the line “Turn what you notice into what you win!”', label: 'Add ' + FX + 'hero-signin.png',
          caption: 'Foxlove sign-in screen. Project details have been generalised.' }))),
    h('dl', { className: 'meta' }, meta.map(([k, v]) => h('div', { key: k }, h('dt', null, k), v.map((line) => h('dd', { key: line }, line))))),
    h('div', { className: 'intro' },
      h('p', { className: 'eyebrow' }, 'The project'),
      h('p', null, 'I led the design and the end-to-end research of an AI account intelligence layer that helps delivery teams share useful client signals quickly, while giving account managers a clearer view of risks and opportunities. As the sole designer, I led the research and design, from understanding the business to wireframes the developer could build from.')),
    Glance([['12', 'interviews across three audiences, from a shortlist of 44'], ['4', 'research themes, each turned into a design response'], ['33', 'requirements, every one linked to its research source'], ['P0–P2', 'prioritised build order handed to the developer']]));
}

function Context() {
  const line = { borderTop: '1px solid rgb(231 224 203 / 20%)' };
  return h(Sec, { id: 'context', dark: true },
    h('h2', { style: { marginTop: 24 } }, 'Valuable client knowledge rarely reaches the people who need it.'),
    h('p', { className: 'lede' }, 'Foxlove is an early-stage B2B SaaS product exploring an account intelligence layer for consulting and technology teams. The people closest to client work notice shifts in sentiment, scope, budgets and competitor activity, but that knowledge rarely makes it into formal tools.'),
    h('h3', { className: 'h3' }, 'Where I started'),
    h('p', { className: 'lede', style: { marginBottom: 20 } }, 'Before designing anything, I needed to understand the business and the people it was for. The founder gave me three starting points.'),
    h('div', { className: 'ctx' },
      [['The storyboard', 'The founder’s picture of how the product would fit into someone’s working day.'], ['The context', 'The business goals and the reasoning behind the idea.'], ['The personas', 'Early profiles of the three audiences the product needed to serve.']].map(([k, t], i) =>
        h('div', { key: k }, h('span', { className: 'n' }, '0' + (i + 1)), h('strong', null, k), h('p', null, t)))),
    h('div', { style: { ...line, margin: '40px 0' } }),
    h('p', { className: 'kicker', style: { textAlign: 'left' } }, 'The design question'),
    h('p', { className: 'big-q', style: { textAlign: 'left', margin: '0 0 40px', maxWidth: 900 } }, '“How might we make sharing a useful account signal feel quick, safe, and worth doing?”'),
    h('div', { className: 'two', style: { ...line, paddingTop: 32 } },
      h('p', null, 'Technical teams can experience tool fatigue when asked to use sales-focused systems and complete multi-field forms. Account managers, meanwhile, may not see emerging risks or opportunities until they reach a formal update.'),
      h('p', null, 'The personas gave me a first view of these frustrations, but they were based on context and assumption. I needed to hear from real people before deciding what to build.')));
}

function Process() {
  const [ph, setPh] = useState(0);
  const [grp, setGrp] = useState('All');
  const p = PHASES[ph];
  const list = grp === 'All' ? METHODS : METHODS.filter((m) => m.g === grp);
  return h(Sec, { id: 'process' },
    h('h2', null, 'A research-led process, moving at startup speed.'),
    h('p', { className: 'lede' }, 'I started with the business and the people it was for, tested my assumptions through real conversations, and only then defined and designed. In an early-stage startup these phases moved quickly and overlapped. Choose a phase to see what I did.'),
    h(Tabs, { label: 'Design process phases', prefix: 'ph-tab-', panelId: 'ph-panel', value: ph, onChange: setPh, items: PHASES.map((x, i) => ({ label: x.label, num: '0' + (i + 1) })) }),
    h('div', { key: ph, id: 'ph-panel', role: 'tabpanel', 'aria-labelledby': 'ph-tab-' + ph, className: 'phase swap' },
      h('span', { className: 'big', 'aria-hidden': 'true' }, '0' + (ph + 1)),
      h('h3', null, p.sub),
      h('div', { className: 'col' }, h('p', { className: 'label' }, 'What I did'), h('p', null, p.did)),
      h('div', { className: 'col' }, h('p', { className: 'label' }, 'Methods'), h('ul', null, p.methods.map((m) => h('li', { key: m }, m)))),
      h('div', { className: 'col' }, h('p', { className: 'label' }, 'What it produced'), h('p', null, p.out))),
    h('h3', { className: 'h3' }, 'Why these methods.'),
    h('p', { className: 'lede', style: { marginBottom: 20 } }, 'Each method answered a specific question. Filter by phase to see what I chose and why.'),
    h(Seg, { label: 'Filter methods by phase', items: GROUPS.map((g) => [g, g]), value: grp, onChange: setGrp }),
    h('div', { key: grp, className: 'methods swap' },
      list.map((m) => h('div', { key: m.name, className: 'mcard' }, h('span', { className: 'g' }, m.g), h('h4', null, m.name), h('p', null, m.why)))));
}

function Research() {
  const [tab, setTab] = useState(0);
  const [ev, setEv] = useState(0);
  const t = THEMES[tab];
  const [stepsRef, stepsSeen] = useInView();
  return h(Sec, { id: 'research' },
    h('h2', null, 'Twelve conversations. Four themes.'),
    h('p', { className: 'lede' }, 'The personas gave me assumptions about frustrations. To test them, I interviewed 12 people across the three target audiences. Semi-structured, open-ended questions let me understand their daily lives, frustrations and motivations in their own words, and a prototype walkthrough in each session captured their reactions. I then used affinity mapping to recognise patterns across what they said.'),
    h('div', { ref: stepsRef, className: stepsSeen ? 'in' : '' },
      h('ol', { className: 'steps' }, STEPS.map(([n, s], i) => h('li', { key: n, style: { '--i': i } }, h('span', { className: 'n' }, '0' + (i + 1)), h('h3', null, n), h('p', null, s))))),
    h('h3', { className: 'h3' }, 'Four themes. Four design responses.'),
    h('p', { className: 'lede', style: { marginBottom: 0 } }, 'Choose a theme to see what the research surfaced and how the design responded.'),
    h(Tabs, { label: 'Research themes', prefix: 'theme-tab-', panelId: 'theme-panel', value: tab, onChange: setTab, items: THEMES.map((x, i) => ({ label: x.title, num: '0' + (i + 1) })) }),
    h('div', { key: tab, id: 'theme-panel', role: 'tabpanel', 'aria-labelledby': 'theme-tab-' + tab, className: 'insight swap' },
      h('span', { className: 'big', 'aria-hidden': 'true' }, '0' + (tab + 1)),
      h('h3', null, t.title),
      h('div', { className: 'col' }, h('p', { className: 'label' }, 'What the research surfaced'), h('p', null, t.heard)),
      h('div', { className: 'col' }, h('p', { className: 'label' }, 'Design response'), h('p', null, t.response))),
    h('div', { className: 'takeaway' },
      h('p', { className: 'label' }, 'Core research takeaway'),
      h('h3', null, 'Entry friction can overwhelm intent.'),
      h('p', null, 'When sharing a signal means filling in several fields or dropdowns, people have more reason to abandon it. Speed and psychological safety shaped the foundation of the experience. Concerns about adoption, incentives and trust in the data also came up repeatedly, across all three audiences.')),
    h('div', { className: 'crit' },
      h('p', { className: 'label' }, 'A limit I acknowledged'),
      h('h3', null, 'Twelve people cannot speak for three audiences.'),
      h('p', null, 'With three target audiences, I could not generalise from 12 interviews. Even so, the patterns gave the team a clear set of priorities to start from, and I treated them as priorities to build on and validate, not as conclusions that applied to everyone.')),
    h('h3', { className: 'h3' }, 'How each insight was structured.'),
    h('p', { className: 'lede', style: { marginBottom: 20 } }, 'On the affinity board, every theme followed the same chain, so a quote could be traced all the way to a design cue.'),
    h(Seg, { label: 'Insight structure', items: EVIDENCE.map((x, n) => [n, x[0]]), value: ev, onChange: setEv }),
    h('div', { key: ev, className: 'imp swap' }, h('h4', null, EVIDENCE[ev][0]), h('p', null, EVIDENCE[ev][1])),
    h('h3', { className: 'h3' }, 'The research in practice.'),
    h('div', { className: 'pair', style: { marginTop: 20 } },
      h(Fig, { src: FX + 'research-interviews.png', alt: 'Anonymised view of a video interview session', label: 'Add ' + FX + 'research-interviews.png', caption: 'Interview sessions · participants anonymised' }),
      h(Fig, { src: FX + 'research-affinity.png', alt: 'Anonymised affinity map of interview findings', label: 'Add ' + FX + 'research-affinity.png', caption: 'Affinity mapping · details anonymised' })));
}

function Requirements() {
  const [kind, setKind] = useState('functional');
  return h(Sec, { id: 'requirements' },
    h('h2', null, 'From findings to a buildable scope.'),
    h('p', { className: 'lede' }, 'With priorities clear, I wrote functional and non-functional requirements that traced back to the research, then mapped how people would move through the product.'),
    h(Seg, { label: 'Requirement type', items: [['functional', 'Functional'], ['nonfunctional', 'Non-functional']], value: kind, onChange: setKind }),
    h('ul', { key: kind, className: 'reqs swap' }, REQS[kind].map(([t, d, th]) => h('li', { key: t }, h('div', null, h('h4', null, t), h('p', null, d)), h('span', { className: 'trace' }, th)))),
    h('p', { className: 'note' }, 'Simplified examples. In total I documented 23 functional and 10 non-functional requirements, each linked to its source.'),
    h('h3', { className: 'h3' }, 'Structure and flow.'),
    h('p', { className: 'lede', style: { marginBottom: 20 } }, 'The information architecture and user flows showed how people would move through the product before I committed to screens.'),
    h('div', { className: 'pair' },
      h(Fig, { src: FX + 'ia.png', alt: 'Simplified information architecture for the product', label: 'Add ' + FX + 'ia.png', caption: 'Information architecture' }),
      h(Fig, { src: FX + 'user-flow.png', alt: 'Simplified user flow for logging a signal', label: 'Add ' + FX + 'user-flow.png', caption: 'User flow' })),
    h('p', { className: 'note' }, 'Simplified project artefacts.'));
}

function Handoff() {
  const [who, setWho] = useState(0);
  const a = AUDIENCES[who];
  return h(Sec, { id: 'handoff', dark: true },
    h('h2', null, 'Wireframes and flows became a shared language.'),
    h('p', { className: 'lede' }, 'As the only designer in a fast-moving team, I used high-fidelity wireframes and user flows to keep the founder and the developer aligned. Each of them needed something different from the design.'),
    h(Seg, { label: 'Who the design was for', items: AUDIENCES.map((x, i) => [i, x.k]), value: who, onChange: setWho }),
    h('div', { key: who, className: 'aud swap' },
      h('div', null, h('p', { className: 'label' }, 'What they needed'), h('p', null, a.need)),
      h('div', null, h('p', { className: 'label' }, 'What I gave them'), h('ul', null, a.gave.map((g) => h('li', { key: g }, g))))),
    h('h3', { className: 'h3' }, 'Initial delivery priorities'),
    h('div', { className: 'prio' },
      [['P0', 'The core experience that tests the main idea'], ['P1', 'Layout and spacing foundations'], ['P2', 'Typography and colour tokens']].map(([k, t]) => h('div', { key: k }, h('strong', null, k), h('span', null, t)))),
    h('div', { style: { marginTop: 32 } },
      h(Fig, { src: FX + 'wireframes-hifi.png', alt: 'Selected high-fidelity wireframes', label: 'Add ' + FX + 'wireframes-hifi.png', caption: 'Selected wireframes · details limited' })));
}

function Impact() {
  const [i, setI] = useState(0);
  const m = IMPACT[i];
  return h(Sec, { id: 'impact' },
    h('h2', null, 'What the process made possible.'),
    h('p', { className: 'lede' }, 'A few numbers describe the research behind the design. The rest of the impact is about how the process helped people make better decisions.'),
    h('div', { className: 'stats' }, STATS.map(([n, k, t]) => h('div', { key: k }, h(CountUp, { to: n }), h('strong', null, k), h('span', null, t)))),
    h('h3', { className: 'h3' }, 'Impact of the process.'),
    h(Seg, { label: 'Who benefited', items: IMPACT.map((x, n) => [n, x[0]]), value: i, onChange: setI }),
    h('div', { key: i, className: 'imp swap' }, h('h4', null, m[1]), h('p', null, m[2])));
}

function Reflection() {
  return h(Sec, { id: 'reflection' },
    h('div', { className: 'refl' },
      h('h2', null, 'Learning to design quickly without losing the research.'),
      h('p', null, 'In an early-stage startup, priorities and information change fast. This project taught me to adapt and design quickly, working in short cycles while keeping decisions grounded in what users told me.'),
      h('h3', null, 'What I learnt.'),
      h('p', null, 'Moving quickly does not mean skipping research. The interviews gave me something real to design from, and made conversations with the founder and developer easier. Clear flows and wireframes mattered as much as polished screens, because they were how the whole team understood the design.'),
      h('h3', null, 'What I would explore next.'),
      h('p', null, 'I would test the designs with more participants from each of the three audiences, so findings can be compared across groups rather than read as one pool of opinions.'),
      h('h3', null, 'Constraints I faced.'),
      h('p', null, 'Twelve interviews across three audiences is a small sample, so I treated the findings as priorities to validate. Project details have been generalised to respect confidentiality.')));
}

function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return;
    const k = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [item]);
  if (!item) return null;
  return h('div', { className: 'lb', role: 'dialog', 'aria-modal': 'true', 'aria-label': item.alt, onClick: onClose },
    h('button', { type: 'button', className: 'lb-x', onClick: onClose, 'aria-label': 'Close image' }, '×'),
    h('img', { src: item.src, alt: item.alt, onClick: (e) => e.stopPropagation() }),
    item.caption && h('p', null, item.caption));
}

function Footer() {
  return h('footer', { className: 'fx-footer' },
    h('div', { className: 'wrap' },
      h('div', { className: 'row' },
        h('div', null,
          h('h2', null, 'Let’s Connect!'),
          h('p', null, 'Interested in thoughtful product design and human-centred AI? Let’s chat.'),
          h('div', { className: 'pills' },
            h('a', { className: 'pill', href: 'https://www.linkedin.com/in/roseannehwami', target: '_blank', rel: 'noreferrer' }, 'linkedin ↗'),
            h('a', { className: 'pill', href: 'mailto:roseannehwami@gmail.com' }, 'Email ↗'))),
        h('img', { src: 'assets/Unfurling_rose.svg', alt: '' })),
      h('p', { className: 'copy' }, '© 2026 Roseanne Hwami · Confidential project details generalised.')));
}

function App() {
  const [zoom, setZoom] = useState(null);
  const active = useActive();
  return h(Zoom.Provider, { value: setZoom },
    h(React.Fragment, null,
      h('div', { className: 'fx' },
        h(SubNav, { active }),
        h('main', null, h(Hero), h(Context), h(Process), h(Research), h(Requirements), h(Handoff), h(Impact), h(Reflection)),
        h(typeof SiteFooter === 'function' ? SiteFooter : Footer)),
      h(Lightbox, { item: zoom, onClose: () => setZoom(null) })));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));