const { useState, useEffect, useRef, createContext, useContext } = React;
const h = React.createElement;
const FX = 'foxlove_assets/';
const SITE = 'https://www.foxloverevenue.com/';
const Zoom = createContext(() => {});
const reduced = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

const SECTIONS = [
  { id: 'overview', nav: 'Overview' },
  { id: 'context', nav: '01 / Context', num: '01', label: 'Context & brief' },
  { id: 'research', nav: '02 / Research', num: '02', label: 'Discovery research' },
  { id: 'requirements', nav: '03 / Requirements', num: '03', label: 'Requirements & structure' },
  { id: 'system', nav: '04 / Design system', num: '04', label: 'Design system' },
  { id: 'impact', nav: '05 / Impact', num: '05', label: 'Impact' },
  { id: 'reflection', nav: '06 / Reflection', num: '06', label: 'Reflection' },
];

const STEPS = [
  ['Listen', 'Open-ended interviews'],
  ['Cluster', 'Affinity mapping'],
  ['Recognise', 'Patterns across people'],
  ['Translate', 'Design implications'],
  ['Prioritise', 'Key features'],
];

const THEMES = [
  { title: 'Trust & candid feedback',
    heard: 'Formal meetings can make people guarded. The most honest signals tend to surface in lower-pressure, more informal moments.',
    response: 'A lightweight, low-pressure way to contribute, with clear privacy choices.' },
  { title: 'Tool fatigue & context',
    heard: 'Delivery staff are busy and often lack context on sales goals. They resist complex, multi-field workflows.',
    response: 'A simple, single-step way to capture a note, designed to feel quick on any device.' },
  { title: 'Safety & recognition',
    heard: 'Sales commissions and targets can feel disconnected from delivery work, so contributors need to feel safe and valued instead.',
    response: 'A focus on visible impact and recognition rather than money, with protection built in.' },
  { title: 'Noise control & scale',
    heard: 'Account managers need more than a raw stream of notes from many contributors.',
    response: 'Support for grouping and summarising notes so account managers see patterns, not piles.' },
];

const LIMITS = [
  ['Small sample', 'Twelve interviews cannot speak for three audiences. I treated the findings as priorities to validate, not conclusions that apply to everyone.'],
  ['What people say, not what they do', 'Interviews and prototype walkthroughs capture opinions and reactions. They are not the same as watching someone use the product.'],
  ['A snapshot in time', 'The research reflects early-stage thinking. As the product grows and more people use it, the findings need revisiting.'],
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

const TIERS = [
  { k: 'Brand', sub: 'The purest form', text: 'Raw values with no meaning attached: a full ramp of purples, blues, greens and greys, from darkest to lightest. Nothing in the interface uses these directly.',
    rows: [['Purple700', '#512DA8'], ['Purple50', '#EDE7F6'], ['Greyscale800', '#424242']] },
  { k: 'Alias', sub: 'Consistent names', text: 'Groups the raw values into named families with a step number, so everything downstream refers to a name on a scale instead of a hex code.',
    rows: [['Purple / 700', 'Purple family, step 700'], ['Blue / 700', 'Blue family, step 700'], ['Greyscale / White', 'Neutral family']] },
  { k: 'Mapped', sub: 'Meaning and modes', text: 'Gives each alias a job in the interface, such as text, surface or status colours, across two modes. Designers and developers use these, so a theme can change without touching a component.',
    rows: [['Text / Primary', 'Purple / 700'], ['Text / Success', 'Green / 700'], ['Text / Error', 'Red / 700'], ['Surface / Page', 'Greyscale / White']] },
];

const SHADES = [
  ['950', '#231367'], ['900', '#311B92'], ['800', '#4527A0'], ['700', '#512DA8'], ['600', '#5E35B1'], ['500', '#673AB7'],
  ['400', '#7E57C2'], ['300', '#9575CD'], ['200', '#B39DDB'], ['100', '#D1C4E9'], ['50', '#EDE7F6'],
];
const ROLES = { 700: 'Text / Primary', 50: 'Surface / Primary light' };

const WHY = [
  ['Consistent', 'Every screen draws from the same small set of decisions, so the product feels like one thing as it grows.'],
  ['Change once', 'Update a value at the right tier and it flows through everything that depends on it.'],
  ['Built to scale', 'New screens, new modes and new team members can be added without starting again.'],
];

const STATS = [[12, 'Interviews', 'from a shortlist of 44 candidates'], [19, 'Q&A entries', 'logged in a structured database'], [16, 'Insight cards', 'across four affinity themes'], [33, 'Requirements', 'each linked to a source']];

const IMPACT = [
  ['For users', 'Designed around real frustrations', 'Interviews replaced assumptions with evidence, and every requirement was linked to a source, so decisions could be traced back to what people said about their working lives.'],
  ['For the team', 'A shared picture to build from', 'Wireframes, flows and traceable requirements gave the founder something to react to and the developer something to build from.'],
  ['For the business', 'A focused MVP scope', 'Prioritised findings helped an early-stage team decide what mattered first, rather than working from a long list of possibilities.'],
];

const METRICS = [
  { g: 'Usability', name: 'Task success and time to log a signal', why: 'Can people finish the core task, and how quickly? The research said logging should take seconds, so I would measure it.', how: 'Think-aloud sessions and timed tasks' },
  { g: 'Adoption', name: 'Activation and repeat use', why: 'Do contributors log a first signal, and do they come back? Adoption was the biggest worry raised in the interviews.', how: 'Product analytics over time' },
  { g: 'Perception', name: 'Trust and ease', why: 'Do people feel safe and in control? A short in-product question or a standard usability scale would show it.', how: 'Short surveys and follow-up interviews' },
  { g: 'Business', name: 'Signals that become action', why: 'Do notes turn into follow-ups and opportunities for account managers? This links the design to the outcome it exists for.', how: 'Funnel tracking from signal to action' },
];
const MGROUPS = ['All', 'Usability', 'Adoption', 'Perception', 'Business'];

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
    ['Role', ['Sole product designer, research and design system']],
    ['Status', ['Jul 2026 – Present']],
    ['Context', ['Early-stage B2B SaaS']],
  ];
  return h('div', { id: 'overview', className: 'wrap' },
    h('div', { className: 'cs-hero' },
      h('div', { className: 'pills' }, h('span', { className: 'tag' }, 'Foxlove Revenue'), h('span', { className: 'tag' }, 'UX research & design'), h('span', { className: 'tag hot' }, 'Client work')),
      h('h1', null, 'Foxlove Revenue'),
      h('div', { className: 'fx-links' },
        h('span', { className: 'live-badge' }, 'Ongoing project'),
        h('a', { className: 'ext', href: SITE, target: '_blank', rel: 'noreferrer' }, 'Visit foxloverevenue.com ↗')),
      h('div', { className: 'stage' },
        h('div', { className: 'stage-top' }, h('span', null, 'Quick signals from the people closest to the client'), h('span', null, 'Early-stage B2B SaaS')),
        h(Fig, { src: FX + 'hero-signin.png', alt: 'Foxlove sign-in screen with the line “Turn what you notice into what you win!”', label: 'Add ' + FX + 'hero-signin.png',
          caption: 'Foxlove sign-in screen. Project details have been generalised.' }))),
    h('dl', { className: 'meta' }, meta.map(([k, v]) => h('div', { key: k }, h('dt', null, k), v.map((line) => h('dd', { key: line }, line))))),
    h('div', { className: 'intro' },
      h('p', { className: 'eyebrow' }, 'The project'),
      h('p', null, 'Foxlove Revenue helps consulting firms grow the accounts they already have. The people closest to client work hear the earliest signals, so the product makes it quick for delivery teams to share them, and gives account managers a clearer view of risks and opportunities. I am the sole designer. I lead the research, shaped the product’s experience, and built its design system from scratch. I use AI tools to speed up my process, which lets me keep pace with a startup without skipping the research. I am still working on it today.')),
    Glance([['12', 'interviews across three audiences, from a shortlist of 44'], ['4', 'research themes, each turned into a design decision'], ['33', 'requirements, every one linked to its research source'], ['3', 'tiers in the design system I built from scratch']]));
}

function Context() {
  const line = { borderTop: '1px solid rgb(231 224 203 / 20%)' };
  return h(Sec, { id: 'context', dark: true },
    h('h2', { style: { marginTop: 24 } }, 'Valuable client knowledge rarely reaches the people who need it.'),
    h('p', { className: 'lede' }, 'The people closest to client work notice shifts in sentiment, scope, budgets and competitor activity, but that knowledge rarely makes it into formal tools. Foxlove aims to give a voice to those people.'),
    h('p', { className: 'lede' }, 'When I joined, Foxlove had no design system and needed a UX designer to shape a better experience. See more information at ',
      h('a', { className: 'inline-link', href: SITE, target: '_blank', rel: 'noreferrer' }, 'foxloverevenue.com'), '.'),
    h('h3', { className: 'h3' }, 'Where I started'),
    h('p', { className: 'lede', style: { marginBottom: 20 } }, 'Before designing anything, I needed to understand the business and the people it was for. The founder gave me three starting points.'),
    h('div', { className: 'ctx' },
      [['The storyboard', 'The founder’s picture of how the product would fit into someone’s working day.'], ['The context', 'The business goals and the reasoning behind the idea.'], ['The personas', 'Early profiles of the audiences the product needed to serve.']].map(([k, t], i) =>
        h('div', { key: k }, h('span', { className: 'n' }, '0' + (i + 1)), h('strong', null, k), h('p', null, t)))),
    h('div', { style: { ...line, margin: '40px 0' } }),
    h('p', { className: 'kicker', style: { textAlign: 'left' } }, 'Early concerns'),
    h('div', { className: 'two' },
      h('p', null, 'Technical teams can experience tool fatigue when asked to use sales-focused systems and complete multi-field forms.'),
      h('p', null, 'Account managers, meanwhile, may not see emerging risks or opportunities until they reach a formal update.')),
    h('div', { style: { ...line, margin: '40px 0' } }),
    h('p', { className: 'kicker', style: { textAlign: 'left' } }, 'The design question'),
    h('p', { className: 'big-q', style: { textAlign: 'left', margin: '0 0 32px', maxWidth: 900 } }, '“How might we make sharing a useful account signal feel quick, safe, and worth doing?”'),
    h('p', { className: 'lede' }, 'The personas gave me a first view of these frustrations, but they were based on context and assumption. I needed to hear from real people before deciding what to build.'));
}

function Research() {
  const [tab, setTab] = useState(0);
  const t = THEMES[tab];
  const [stepsRef, stepsSeen] = useInView();
  return h(Sec, { id: 'research' },
    h('h2', null, 'I asked 12 people what the personas could only guess.'),
    h('p', { className: 'lede' }, 'My personas and storyboard were built from context, which meant they were assumptions. To check them, I interviewed 12 people across the three target audiences. I used open-ended questions so people could describe their days, frustrations and goals in their own words, and showed a prototype in each session to capture their reactions.'),
    h('div', { ref: stepsRef, className: stepsSeen ? 'in' : '' },
      h('ol', { className: 'steps' }, STEPS.map(([n, s], i) => h('li', { key: n, style: { '--i': i } }, h('span', { className: 'n' }, '0' + (i + 1)), h('h3', null, n), h('p', null, s))))),
    h('div', { style: { marginTop: 40 } },
      h(Fig, { src: FX + 'research-interviews.png', alt: 'Roseanne interviewing a participant over video', label: 'Add ' + FX + 'research-interviews.png', caption: 'Interviewing a participant · participant anonymised' })),
    h('h3', { className: 'h3' }, 'What I found, and what I decided.'),
    h('p', { className: 'lede', style: { marginBottom: 0 } }, 'I logged every answer in a structured database, then grouped them on an affinity board to spot patterns. Four themes came out of it. Choose one to see what people said and the design decision it led to.'),
    h(Tabs, { label: 'Research themes', prefix: 'theme-tab-', panelId: 'theme-panel', value: tab, onChange: setTab, items: THEMES.map((x, i) => ({ label: x.title, num: '0' + (i + 1) })) }),
    h('div', { key: tab, id: 'theme-panel', role: 'tabpanel', 'aria-labelledby': 'theme-tab-' + tab, className: 'insight swap' },
      h('span', { className: 'big', 'aria-hidden': 'true' }, '0' + (tab + 1)),
      h('h3', null, t.title),
      h('div', { className: 'col' }, h('p', { className: 'label' }, 'What people told me'), h('p', null, t.heard)),
      h('div', { className: 'col' }, h('p', { className: 'label' }, 'Design decision'), h('p', null, t.response))),
    h('div', { className: 'takeaway' },
      h('p', { className: 'label' }, 'Core research takeaway'),
      h('h3', null, 'Entry friction can overwhelm intent.'),
      h('p', null, 'When sharing a signal means filling in several fields, people have more reason to abandon it. Speed and psychological safety shaped the foundation of the experience. Concerns about adoption, incentives and trust in the data also came up repeatedly, across all three audiences.')),
    h(Fig, { src: FX + 'research-affinity.png', alt: 'Anonymised affinity map of interview findings', label: 'Add ' + FX + 'research-affinity.png', caption: 'Affinity mapping · details anonymised' }),
    h('h3', { className: 'h3' }, 'Research overview and limits.'),
    h('p', { className: 'lede', style: { marginBottom: 20 } }, 'Good research includes knowing where it stops. These are the limits I kept in mind while turning findings into decisions.'),
    h('div', { className: 'ovr' },
      h('div', { className: 'ovr-stats' },
        [['12', 'interviews'], ['3', 'target audiences'], ['4', 'themes']].map(([b, l]) => h('div', { key: l }, h('b', null, b), h('span', null, l)))),
      h('ul', { className: 'limits' }, LIMITS.map(([k, d]) => h('li', { key: k }, h('strong', null, k), h('p', null, d))))));
}

function Requirements() {
  const [kind, setKind] = useState('functional');
  return h(Sec, { id: 'requirements' },
    h('h2', null, 'From findings to a buildable scope.'),
    h('p', { className: 'lede' }, 'With priorities clear, I wrote functional and non-functional requirements that traced back to the research, so every decision could be explained. Then I mapped how people would move through the product before committing to screens.'),
    h(Seg, { label: 'Requirement type', items: [['functional', 'Functional'], ['nonfunctional', 'Non-functional']], value: kind, onChange: setKind }),
    h('ul', { key: kind, className: 'reqs swap' }, REQS[kind].map(([t, d, th]) => h('li', { key: t }, h('div', null, h('h4', null, t), h('p', null, d)), h('span', { className: 'trace' }, th)))),
    h('p', { className: 'note' }, 'Simplified examples. In total I documented 23 functional and 10 non-functional requirements, each linked to its source.'),
    h('h3', { className: 'h3' }, 'Structure and flow.'),
    h('p', { className: 'lede', style: { marginBottom: 20 } }, 'User flows showed where people might hesitate or get lost, and gave the founder and the developer a shared way to talk about the product.'),
    h('div', { className: 'pair flows' },
      h(Fig, { src: FX + 'flow-invite.png', alt: 'User flow: an admin invites an employee, who creates a password, accepts the privacy terms and enters the product', label: 'Add ' + FX + 'flow-invite.png', caption: 'User flow · onboarding an employee' }),
      h(Fig, { src: FX + 'flow-signin.png', alt: 'User flow: signing in, with an error path and role-based routing to the correct dashboard', label: 'Add ' + FX + 'flow-signin.png', caption: 'User flow · signing in' })),
    h('p', { className: 'note' }, 'Early working flows, shown lightly. I used them alongside high-fidelity wireframes to keep the team aligned.'));
}

function System() {
  const [ti, setTi] = useState(0);
  const [si, setSi] = useState(3);
  const tier = TIERS[ti];
  const sh = SHADES[si];
  const light = si >= 8;
  const style = { '--p700': sh[1], '--p50': '#EDE7F6' };
  return h(Sec, { id: 'system', dark: true },
    h('h2', null, 'Giving Foxlove a brand it can build on.'),
    h('p', { className: 'lede' }, 'Foxlove did not have a design system, so every screen risked being designed from scratch. I created one that establishes the brand, and I documented it in Confluence so the whole team can use it.'),
    h('h3', { className: 'h3' }, 'A three-tier token architecture.'),
    h('p', { className: 'lede', style: { marginBottom: 20 } }, 'I organised the design tokens in three tiers because it helps a system scale. Choose a tier to see what it does.'),
    h(Tabs, { label: 'Token tiers', prefix: 'tier-tab-', panelId: 'tier-panel', value: ti, onChange: setTi, items: TIERS.map((x, i) => ({ label: x.k, num: '0' + (i + 1) })) }),
    h('div', { key: ti, id: 'tier-panel', role: 'tabpanel', 'aria-labelledby': 'tier-tab-' + ti, className: 'tier swap' },
      h('div', null, h('p', { className: 'label' }, tier.sub), h('p', null, tier.text)),
      h('ul', { className: 'tier-rows' }, tier.rows.map(([a, b]) => h('li', { key: a }, h('code', null, a), h('span', null, b))))),
    h('h3', { className: 'h3' }, 'Why it scales.'),
    h('div', { className: 'ctx' }, WHY.map(([k, t], i) => h('div', { key: k }, h('span', { className: 'n' }, '0' + (i + 1)), h('strong', null, k), h('p', null, t)))),
    h('h3', { className: 'h3' }, 'One brand colour: purple.'),
    h('p', { className: 'lede', style: { marginBottom: 20 } }, 'Purple is Foxlove’s only brand colour. I built it as a ramp from 950 to 50, so there is a shade for every job. Greys handle structure, and green, orange, red and blue are kept for status, so purple always means “Foxlove”. Choose a shade to see it.'),
    h('div', { className: 'ramp', role: 'group', 'aria-label': 'Purple shades' },
      SHADES.map(([n, hex], i) => h('button', { key: n, type: 'button', className: 'shade' + (si === i ? ' on' : ''), style: { background: hex, color: i >= 8 ? '#231367' : '#fff' }, 'aria-pressed': si === i, onClick: () => setSi(i), 'aria-label': 'Purple ' + n + ' ' + hex }, n))),
    h('div', { className: 'rebrand', style },
      h('div', { className: 'rb-ui' },
        h('p', { className: 'rb-head' }, 'Signals this month'),
        h('span', { className: 'rb-chip' }, 'New insights'),
        h('span', { className: 'rb-btn' }, 'Add a signal')),
      h('ul', { className: 'tier-rows' },
        [['Token', 'Purple' + sh[0]], ['Hex', sh[1]], ['Used for', ROLES[sh[0]] || 'Available in the brand tier']].map(([a, b]) => h('li', { key: a }, h('code', null, a), h('span', null, b))))),
    h('h3', { className: 'h3' }, 'The system in the product.'),
    h('p', { className: 'lede', style: { marginBottom: 20 } }, 'The same tokens carry through every screen, from signing in to logging a signal.'),
    h('div', { className: 'pair apps' },
      h(Fig, { src: FX + 'ds-signin.png', alt: 'Foxlove sign-in screen in purple', label: 'Add ' + FX + 'ds-signin.png', caption: 'Sign in · purple as the single brand colour' }),
      h(Fig, { src: FX + 'ds-log-insight.png', alt: 'Foxlove log insight screen using the same purple, with status colours kept separate', label: 'Add ' + FX + 'ds-log-insight.png', caption: 'Logging a signal · same tokens, same colour' })),
    h('div', { className: 'pair', style: { marginTop: 40 } },
      h(Fig, { src: FX + 'tokens-brand.png', alt: 'Brand tier variables: a purple ramp from 950 to 50 and greyscale, with hex values', label: 'Add ' + FX + 'tokens-brand.png', caption: 'Brand tier · the purple ramp, as raw values' }),
      h(Fig, { src: FX + 'tokens-mapped.png', alt: 'Mapped tier variables: text and surface roles pointing to palette values in two modes', label: 'Add ' + FX + 'tokens-mapped.png', caption: 'Mapped tier · roles in two modes' })));
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
  const [g, setG] = useState('All');
  const list = g === 'All' ? METRICS : METRICS.filter((m) => m.g === g);
  return h(Sec, { id: 'reflection' },
    h('div', { className: 'refl' },
      h('h2', null, 'Still learning, and still shipping.'),
      h('p', null, 'This project is ongoing and I am learning a lot about design along the way. Working at startup speed means priorities change quickly, so I am also learning how AI can speed up my process without lowering the quality of the thinking.'),
      h('h3', null, 'What I am exploring next.'),
      h('p', null, 'I am learning to use Claude Design and other AI tools to work faster and more efficiently. I also hope to do more testing, such as think-aloud sessions where I watch someone use the product, to see whether it really works for them.'),
      h('h3', null, 'How would I know the design is working?'),
      h('p', null, 'Shipping a design is not the finish line. I want to be able to say whether it succeeded, which means choosing what to measure and how to test it. These are the questions I am working through.')),
    h(Seg, { label: 'Filter metrics', items: MGROUPS.map((x) => [x, x]), value: g, onChange: setG }),
    h('div', { key: g, className: 'methods swap' },
      list.map((m) => h('div', { key: m.name, className: 'mcard' }, h('span', { className: 'g' }, m.g), h('h4', null, m.name), h('p', null, m.why), h('p', { className: 'how' }, h('strong', null, 'How to test: '), m.how)))),
    h('div', { className: 'refl' },
      h('h3', null, 'The lesson so far.'),
      h('p', null, 'Moving quickly does not mean skipping research. The interviews gave me something real to design from, and the design system gives me something solid to move fast on. Project details have been generalised to respect confidentiality.')));
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
        h('main', null, h(Hero), h(Context), h(Research), h(Requirements), h(System), h(Impact), h(Reflection)),
        h(typeof SiteFooter === 'function' ? SiteFooter : Footer)),
      h(Lightbox, { item: zoom, onClose: () => setZoom(null) })));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));