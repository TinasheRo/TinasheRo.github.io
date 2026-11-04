const { useState, useEffect, useRef, createContext, useContext } = React;
const h = React.createElement;
const FX = 'foxlove_assets/';
const Zoom = createContext(() => {});
const DemoCtx = createContext({ focus: 0, setFocus: () => {} });
const reduced = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const scrollToId = (id) => { const el = document.getElementById(id); el && el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }); };

const SECTIONS = [
  { id: 'overview', nav: 'Overview' },
  { id: 'problem', nav: '01 / Problem', num: '01', label: 'Problem space' },
  { id: 'research', nav: '02 / Research', num: '02', label: 'Research & discovery' },
  { id: 'design', nav: '03 / Design', num: '03', label: 'Interaction design' },
  { id: 'handoff', nav: '04 / Handoff', num: '04', label: 'Agile MVP & engineering handoff' },
  { id: 'decisions', nav: '05 / Decisions', num: '05', label: 'Design decisions' },
  { id: 'prototype', nav: '06 / Prototype', num: '06', label: 'Prototype' },
  { id: 'reflection', nav: '07 / Reflection', num: '07', label: 'Reflection' },
];

const STEPS = [
  ['Listen', 'Qualitative interviews'],
  ['Cluster', 'Affinity mapping'],
  ['Define', 'Friction themes'],
  ['Translate', 'Design implications'],
  ['Prioritise', 'MVP focus'],
];

const THEMES = [
  { title: 'Trust & candid feedback',
    heard: 'Formal settings can inhibit honesty. Candid signals may surface in lower-pressure, psychologically safe moments.',
    response: 'Lightweight entry with an optional anonymity choice.' },
  { title: 'Tool fatigue & context',
    heard: 'Delivery staff may lack context on sales targets and resist complex, multi-field workflows.',
    response: 'A single-input card without setup or dropdown navigation.' },
  { title: 'Psychological safety',
    heard: 'Sales commissions and targets can feel misaligned with engineering work.',
    response: 'Focus on recognition and visible project impact.' },
  { title: 'Noise control & scale',
    heard: 'Account managers need more than a raw stream of notes from many contributors.',
    response: 'AI-assisted sanitising, categorising and clustering.' },
];

const FEATURES = [
  ['Make voice easy to find', 'A high-visibility “Tap to Record” action sits beside typing, supporting hands-free notes between client meetings. In the concept, the action uses a brand purple pill (#4F46E5).'],
  ['Start with a universal prompt', 'Instead of asking people to choose from a long list of scenarios first, the default asks for any key observation, feedback, or signal. Selecting a category then reveals more targeted guidance.'],
  ['Show what AI will share', 'A live “What Your AM Will See” preview makes redaction visible as a contributor writes or speaks. Client names, personal identifiers, and financial figures are sanitised in the proposed experience.'],
  ['Put identity choice in the contributor’s hands', 'An explicit anonymity toggle lets people choose whether to attach their name to a note.'],
];

const UNIVERSAL = 'Share any key observation, feedback or signal.';
const CATS = [
  { id: 'positive', label: 'Positive feedback', title: 'Positive feedback', helper: 'What did the client appreciate?' },
  { id: 'concern', label: 'Concern', title: 'Concern', helper: 'What worried them, and what prompted it?' },
  { id: 'scope', label: 'Scope change', title: 'Scope change', helper: 'What is changing, and who raised it?' },
  { id: 'budget', label: 'Budget', title: 'Budget', helper: 'What did you hear about budget or spend?' },
  { id: 'competitor', label: 'Competitor', title: 'Competitor activity', helper: 'Who else is in the conversation?' },
];
const EXAMPLES = [
  ['Budget note', 'The Acme team said their budget of £250k may be cut next quarter. They asked us to email finance@acme.com.'],
  ['Good news', 'Globex are loving the new release. They mentioned a competitor demo last week.'],
];
const VOICE = 'They are comparing us with another supplier and want faster delivery on the Initech project.';
const SEED = [
  { id: 's1', cat: 'Budget', from: 'Anonymous', parts: [{ t: 'Their finance lead hinted that spend for next year is under review.' }], sample: true },
  { id: 's2', cat: 'Positive feedback', from: 'Delivery team', parts: [{ t: 'The client team said the last release made their reporting much faster.' }], sample: true },
  { id: 's3', cat: 'Competitor', from: 'Anonymous', parts: [{ t: 'A rival vendor was mentioned during the planning call.' }], sample: true },
];

const STATES = [
  { label: 'Default load', title: '“Log an Observation”', text: 'Universal helper copy, prominent voice action, and a single card ready for a note.', head: 'Log an Observation', helper: UNIVERSAL, chip: null, draft: '' },
  { label: 'Category active', title: '“Positive Feedback”', text: 'Selected tag uses soft indigo (#EEF2FF); the header and helper copy update to match.', head: 'Positive feedback', helper: 'What did the client appreciate?', chip: 'Positive feedback', draft: '' },
  { label: 'Reset', title: 'Remove selected chip', text: 'Restore the universal helper sentence while retaining any draft text.', head: 'Log an Observation', helper: UNIVERSAL, chip: null, draft: 'The last release made reporting much faster…' },
];

const VIEWPORTS = [
  { name: 'Desktop', range: 'Above 1440px', pad: 48, w: 1440 },
  { name: 'Laptop', range: '1024–1439px', pad: 32, w: 1280 },
  { name: 'Tablet', range: '768–1023px', pad: 24, w: 768 },
  { name: 'Mobile', range: 'Below 767px', pad: 16, w: 375 },
];

const DECISIONS = [
  { title: 'Keep the entry point open', focus: 1, friction: 'Starting with category selection adds a decision before someone can share a thought.',
    response: 'Use a universal prompt first, then reveal category-specific guidance progressively.',
    before: 'Category choices shown upfront', after: 'Open observation card with optional categories' },
  { title: 'Make AI behaviour legible', focus: 2, friction: 'Invisible redaction could make contributors uncertain about what is being shared.',
    response: 'Preview the sanitised note in the contributor’s flow so the transformation is visible.',
    before: 'Text entered, processing unclear', after: '“What Your AM Will See” live preview' },
  { title: 'Make privacy a choice', focus: 3, friction: 'Contributors need control over whether a signal is attributed to them.',
    response: 'Place an explicit anonymity setting within the same simple capture experience.',
    before: 'Identity behaviour not visible', after: 'Clear identity toggle and confirmation' },
];

/* ---------- helpers ---------- */
const REDACT = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)|(\+?\d[\d\s().-]{7,}\d)|([£$€]\s?\d[\d,]*(?:\.\d+)?\s?(?:k|m|bn|million|billion)?)|\b(Acme|Globex|Initech|Contoso|Northwind)\b/gi;
function redact(text) {
  const parts = []; let last = 0; let count = 0; let m;
  REDACT.lastIndex = 0;
  while ((m = REDACT.exec(text))) {
    if (m.index > last) parts.push({ t: text.slice(last, m.index) });
    parts.push({ t: m[0], r: m[1] ? 'email' : m[2] ? 'contact number' : m[3] ? 'figure' : 'client' });
    count++; last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ t: text.slice(last) });
  return { parts, count };
}
const renderParts = (parts) => parts.map((p, i) => p.r ? h('mark', { key: i, className: 'redact', title: 'Removed: ' + p.r }, '[' + p.r + ']') : p.t);

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

function SiteHeader() {
  const links = [['Work', 'index.html#work'], ['About', 'about.html'], ['Email', 'mailto:roseannehwami@gmail.com'], ['Resume', 'Roseanne_Hwami_CV.pdf']];
  return h('header', { className: 'cs-header wrap' },
    h('a', { className: 'brand', href: 'index.html', 'aria-label': 'Rose + Anne, home' },
      h('img', { className: 'brand-mark', src: 'assets/Brand__rose.svg', alt: '', width: 23, height: 23 }), 'Rose + Anne'),
    h('nav', { className: 'nav', 'aria-label': 'Main' },
      links.map(([l, href]) => h('a', { key: l, href, ...(l === 'Resume' && { target: '_blank', rel: 'noreferrer' }) }, l))));
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
function Hero() {
  const meta = [
    ['Role', ['Lead UX Designer']],
    ['Tools used', ['Prototyping · design documentation · agile collaboration']],
    ['Project', ['Confidential enterprise product · MVP']],
  ];
  return h('div', { id: 'overview', className: 'wrap' },
    h('div', { className: 'cs-hero' },
      h('div', { className: 'pills' }, h('span', { className: 'tag' }, 'UX research & design'), h('span', { className: 'tag' }, 'AI-powered B2B'), h('span', { className: 'tag hot' }, 'Case study')),
      h('h1', null, 'Account Intelligence'),
      h('div', { className: 'stage' },
        h('div', { className: 'stage-top' }, h('span', null, 'Quick signals from the people closest to the client'), h('span', null, 'Confidential enterprise product · MVP')),
        h(Fig, { src: FX + 'hero-signin.png', alt: 'Sign-in screen of the product with the line “Turn what you notice into what you win!”', label: 'Add ' + FX + 'hero-signin.png',
          caption: 'A confidential enterprise product concept exploring how frontline observations can support account teams. Project details have been generalised to respect an NDA.' }))),
    h('dl', { className: 'meta' }, meta.map(([k, v]) => h('div', { key: k }, h('dt', null, k), v.map((line) => h('dd', { key: line }, line))))),
    h('div', { className: 'intro' },
      h('p', { className: 'eyebrow' }, 'The project'),
      h('p', null, 'Design an account intelligence layer that helps delivery teams share useful client signals in under 15 seconds, while giving account managers a clearer view of risks and opportunities. The experience needed to fit naturally into busy workdays and protect the trust of the people contributing.')));
}

function Problem() {
  return h(Sec, { id: 'problem', dark: true },
    h('h2', { style: { marginTop: 24 } }, 'Valuable client signals rarely make it into the CRM.'),
    h('p', { className: 'lede' }, 'The people closest to client work notice changes in sentiment, scope, budgets, and competitor activity. Those observations often surface in informal conversations, while formal CRM tools can feel slow, complex, and disconnected from delivery work.'),
    h('div', { style: { margin: '40px 0', borderTop: '1px solid rgb(231 224 203 / 20%)' } }),
    h('p', { className: 'kicker', style: { textAlign: 'left' } }, 'The design question'),
    h('p', { className: 'big-q', style: { textAlign: 'left', margin: '0 0 40px', maxWidth: 900 } }, '“How might we make sharing a useful account signal feel quick, safe, and worth doing?”'),
    h('div', { className: 'two', style: { borderTop: '1px solid rgb(231 224 203 / 20%)', paddingTop: 32 } },
      h('p', null, 'Technical teams can experience tool fatigue when asked to navigate sales-focused systems and complete multi-field forms. Account managers, meanwhile, may lack visibility into emerging risks or expansion opportunities until they appear in a formal update.'),
      h('p', null, 'The MVP focused on a simple exchange: make contribution lightweight for delivery staff, then use AI to organise and redact information so account teams can work with clearer, more relevant insights.')));
}

function Research() {
  const [tab, setTab] = useState(0);
  const t = THEMES[tab];
  const [stepsRef, stepsSeen] = useInView();
  return h(Sec, { id: 'research' },
    h('h2', null, 'Designing around four human needs.'),
    h('p', { className: 'lede' }, 'Semi-structured interviews with technical architects, account executives, and practice leaders helped uncover why earlier internal logging tools had struggled. Affinity mapping brought the findings into four themes.'),
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
      h('p', null, 'When sharing a signal requires multiple fields or dropdowns, people have more reason to abandon it. Speed and psychological safety shaped the foundation of the experience.')),
    h('h3', { className: 'h3' }, 'The people behind the signals.'),
    h('div', { className: 'pair', style: { marginTop: 20 } },
      h(Fig, { src: FX + 'research-delivery.png', alt: 'Anonymised research artefact: delivery consultant or technical architect', label: 'Add ' + FX + 'research-delivery.png' }),
      h(Fig, { src: FX + 'research-account.png', alt: 'Anonymised research artefact: account executive or practice leader', label: 'Add ' + FX + 'research-account.png' })),
    h('p', { className: 'note' }, 'Anonymised research evidence.'));
}

/* ----- interactive concept: observation box ----- */
function ObservationBox({ onSubmit }) {
  const { focus } = useContext(DemoCtx);
  const [text, setText] = useState('');
  const [catId, setCatId] = useState(null);
  const [anon, setAnon] = useState(false);
  const [rec, setRec] = useState(false);
  const [done, setDone] = useState(null);
  const t0 = useRef(0);
  const tm = useRef(0);
  useEffect(() => () => clearTimeout(tm.current), []);
  const cat = CATS.find((c) => c.id === catId);
  const { parts, count } = redact(text);
  const hasText = text.trim().length > 0;

  const type = (v) => { if (v && !t0.current) t0.current = Date.now(); if (!v) t0.current = 0; setText(v); };
  const record = () => {
    if (rec) return;
    setRec(true);
    if (!t0.current) t0.current = Date.now();
    tm.current = setTimeout(() => { setText((t) => (t.trim() ? t.trim() + ' ' : '') + VOICE); setRec(false); }, reduced() ? 700 : 2200);
  };
  const submit = () => {
    const secs = t0.current ? Math.max(1, Math.round((Date.now() - t0.current) / 1000)) : null;
    const r = redact(text.trim());
    onSubmit({ id: 'm' + Date.now(), cat: cat ? cat.label : 'Uncategorised', from: anon ? 'Anonymous' : 'You', parts: r.parts, mine: true });
    setDone({ secs, count: r.count, anon });
  };
  const again = () => { setText(''); setCatId(null); setDone(null); t0.current = 0; };

  const form = h('div', { className: 'd-card' },
    h('div', { className: 'd-prompt' },
      h('h4', null, cat ? cat.title : 'Log an Observation'),
      h('p', { className: 'd-helper' }, cat ? cat.helper : UNIVERSAL)),
    h('div', { className: 'd-chips', role: 'group', 'aria-label': 'Optional category' },
      CATS.map((c) => h('button', { key: c.id, type: 'button', className: 'd-chip' + (catId === c.id ? ' on' : ''), 'aria-pressed': catId === c.id, onClick: () => setCatId(catId === c.id ? null : c.id) }, c.label + (catId === c.id ? ' ×' : '')))),
    h('label', { className: 'sr', htmlFor: 'd-text', style: { position: 'absolute', left: -9999 } }, 'Your observation'),
    h('textarea', { id: 'd-text', className: 'd-text', value: text, placeholder: 'Type a note, or tap Record…', onChange: (e) => type(e.target.value) }),
    h('div', { className: 'd-examples' }, 'Try an example:',
      EXAMPLES.map(([l, v]) => h('button', { key: l, type: 'button', className: 'd-ex', onClick: () => setText(v) }, l))),
    h('div', { className: 'd-row' },
      h('button', { type: 'button', className: 'd-voice' + (rec ? ' rec' : ''), onClick: record, 'aria-live': 'polite' }, h('span', { className: 'dot' }), rec ? 'Listening…' : 'Tap to Record'),
      h('button', { type: 'button', role: 'switch', 'aria-checked': anon, className: 'd-switch', onClick: () => setAnon(!anon) }, h('span', { className: 'track' }), 'Share anonymously')),
    h('div', { className: 'd-row' },
      h('span', { className: 'd-foot' }, 'Voice is simulated in this demo.'),
      h('button', { type: 'button', className: 'd-submit', disabled: !hasText || rec, onClick: submit }, 'Submit signal')));

  const preview = h('div', { className: 'd-preview' },
    h('h5', null, '✦ What your AM will see'),
    hasText
      ? h(React.Fragment, null,
          h('div', { className: 'd-meta' },
            h('span', null, 'From: ' + (anon ? 'Anonymous' : 'You')),
            cat && h('span', { className: 'd-tag' }, cat.label),
            count > 0 && h('span', null, count + (count > 1 ? ' details' : ' detail') + ' removed')),
          h('p', { className: 'd-note' }, renderParts(parts)))
      : h('p', { className: 'd-empty' }, 'Start typing, or tap Record. Your note appears here with sensitive details removed.'));

  const success = h('div', { className: 'd-card d-done', role: 'status' },
    h('span', { className: 'tick', 'aria-hidden': 'true' }, '✓'),
    h('h4', null, 'Signal sent'),
    h('p', null, (done && done.secs ? 'Logged in ' + done.secs + 's' + (done.secs <= 15 ? ' — inside the 15-second goal. ' : ' — the goal is 15s or less. ') : '') +
      (done && done.count ? done.count + (done.count > 1 ? ' details were' : ' detail was') + ' removed. ' : '') +
      'Sent ' + (done && done.anon ? 'anonymously' : 'with your name') + ' to the account manager view.'),
    h('div', { className: 'acts' },
      h('button', { type: 'button', className: 'd-ghost', onClick: () => scrollToId('am-view') }, 'See it in the AM view ↓'),
      h('button', { type: 'button', className: 'd-ghost', onClick: again }, 'Log another')));

  return h('div', { className: 'demo', 'data-focus': focus },
    h('div', { className: 'demo-top' }, h('span', { className: 'live' }, 'Concept demo · try it'), h('span', null, 'Contributor view')),
    done ? success : form,
    !done && preview,
    h('p', { className: 'd-foot' }, 'Redaction here uses simple sample rules: emails, phone numbers, money figures and a few sample client names.'));
}

function AccountView({ signals, onClear, hasMine }) {
  const [filter, setFilter] = useState('All');
  const cats = Array.from(new Set(signals.map((s) => s.cat)));
  useEffect(() => { if (filter !== 'All' && !cats.includes(filter)) setFilter('All'); });
  const counts = cats.map((c) => [c, signals.filter((s) => s.cat === c).length]);
  const max = Math.max(1, ...counts.map((x) => x[1]));
  const shown = filter === 'All' ? signals : signals.filter((s) => s.cat === filter);
  return h('div', { id: 'am-view', className: 'am' },
    h('div', null,
      h('h4', null, 'Clustered signals'),
      h('button', { type: 'button', className: 'cl' + (filter === 'All' ? ' on' : ''), 'aria-pressed': filter === 'All', onClick: () => setFilter('All') }, h('span', null, 'All signals'), h('span', null, signals.length)),
      counts.map(([c, n]) => h('button', { key: c, type: 'button', className: 'cl' + (filter === c ? ' on' : ''), 'aria-pressed': filter === c, onClick: () => setFilter(c) },
        h('span', null, c), h('span', null, n), h('span', { className: 'bar' }, h('i', { style: { width: (n / max) * 100 + '%' } })))),
      hasMine && h('p', { className: 'am-actions' }, h('button', { type: 'button', className: 'link-btn', onClick: onClear }, 'Clear my notes'))),
    h('div', null,
      h('h4', null, 'Account manager view' + (filter === 'All' ? '' : ' · ' + filter)),
      shown.map((s) => h('div', { key: s.id, className: 'sig swap' + (s.mine ? ' mine' : '') },
        h('div', { className: 'meta2' }, h('span', { className: 'tagx' }, s.cat), h('span', null, s.from), s.mine && h('span', null, 'Your note'), s.sample && h('span', null, 'Sample data')),
        h('div', null, renderParts(s.parts))))));
}

function Design() {
  const { focus, setFocus } = useContext(DemoCtx);
  const [mine, setMine] = useState([]);
  const signals = mine.concat(SEED);
  return h(Sec, { id: 'design' },
    h('h2', null, 'A 15-second entry experience.'),
    h('p', { className: 'lede' }, 'The central design challenge was rethinking how informal client knowledge enters an enterprise system. The Generic Observation Box gives contributors one clear place to capture a signal, with support for voice, privacy, and helpful AI processing.'),
    h('div', { className: 'design-grid' },
      h('div', { className: 'features' },
        FEATURES.map(([t, d], i) => h('button', { key: t, type: 'button', className: 'feat' + (focus === i ? ' on' : ''), 'aria-pressed': focus === i, onMouseEnter: () => setFocus(i), onFocus: () => setFocus(i), onClick: () => setFocus(i) },
          h('span', { className: 'n' }, '0' + (i + 1)), h('span', null, h('h3', null, t), h('p', null, d))))),
      h('div', { className: 'demo-col' }, h(ObservationBox, { onSubmit: (s) => setMine((m) => [s].concat(m)) }))),
    h('h3', { className: 'h3' }, 'From one note to a clearer account view.'),
    h('p', { className: 'lede', style: { marginBottom: 0 } }, 'Notes you submit above land here, grouped for the account manager. Pick a cluster to filter. Two rows are sample data.'),
    h(AccountView, { signals, hasMine: mine.length > 0, onClear: () => setMine([]) }));
}

function MiniBox({ s }) {
  return h('div', { className: 'mini swap', key: s.label },
    h('h5', null, s.head),
    h('p', { className: 'help' }, s.helper),
    h('div', { className: 'box' }, s.draft),
    h('div', { className: 'chips' }, ['Positive feedback', 'Concern', 'Budget'].map((c) => h('span', { key: c, className: 'chip' + (s.chip === c ? ' on' : '') }, c + (s.chip === c ? ' ×' : '')))),
    h('span', { className: 'rec' }, 'Tap to Record'));
}

function Handoff() {
  const [st, setSt] = useState(0);
  const [vp, setVp] = useState(0);
  const s = STATES[st];
  const v = VIEWPORTS[vp];
  return h(Sec, { id: 'handoff', dark: true },
    h('h2', null, 'Design clarity helped the team move from concept to build.'),
    h('p', { className: 'lede' }, 'In a fast-moving product environment, the experience needed to be clear enough to build and flexible enough to learn from. I collaborated with engineering on interaction states, shared design guidance, and an initial delivery backlog. Company-specific context and implementation details have been generalised to respect confidentiality.'),
    h('h3', { className: 'h3' }, 'Component states'),
    h('p', { className: 'lede', style: { marginBottom: 20 } }, 'The entry experience was documented so default, active, and reset states were clear to the team.'),
    h(Seg, { label: 'Component state', items: STATES.map((x, i) => [i, x.label]), value: st, onChange: setSt }),
    h('div', { className: 'states' },
      h('div', { key: st, className: 'swap' }, h('h4', null, s.label + ' · ' + s.title), h('p', null, s.text)),
      h(MiniBox, { s })),
    h('h3', { className: 'h3' }, 'Responsive layout tokens'),
    h('p', { className: 'lede', style: { marginBottom: 20 } }, 'Choose a viewport to see its horizontal padding drawn to scale.'),
    h('div', { className: 'tok-wrap' },
      h('div', null,
        h('div', { className: 'tok-head' }, h('span', null, 'Viewport'), h('span', null, 'Width'), h('span', null, 'Padding')),
        h('ul', { className: 'tok-list' }, VIEWPORTS.map((x, i) => h('li', { key: x.name },
          h('button', { type: 'button', className: 'rowbtn' + (vp === i ? ' on' : ''), 'aria-pressed': vp === i, onClick: () => setVp(i) }, h('span', null, x.name), h('span', null, x.range), h('span', null, x.pad + 'px · 8pt grid')))))),
      h('div', { className: 'vp' },
        h('div', { className: 'vp-frame', style: { width: (v.w / 1440) * 100 + '%', paddingInline: (v.pad / v.w) * 100 + '%' } },
          h('div', { className: 'vp-content' }, h('i'), h('i'), h('i'))),
        h('p', { className: 'vp-cap' }, v.name + ' · ' + v.pad + 'px padding each side (shown at ' + v.w + 'px wide)'))),
    h('h3', { className: 'h3' }, 'Initial delivery priorities'),
    h('div', { className: 'prio' },
      [['P0 · FR-01', 'Generic Observation Box: input, voice, redaction preview, anonymity'], ['P1 · UI-02', 'Standard horizontal padding and container margins'], ['P2 · UI-03', 'Typography and color tokens, including purple and slate']].map(([k, t]) => h('div', { key: k }, h('strong', null, k), h('span', null, t)))),
    h('div', { className: 'pair', style: { marginTop: 32 } },
      h(Fig, { src: FX + 'handoff-spec.png', alt: 'Excerpt from the design spec and component states', label: 'Add ' + FX + 'handoff-spec.png' }),
      h(Fig, { src: FX + 'handoff-backlog.png', alt: 'Excerpt from the delivery backlog', label: 'Add ' + FX + 'handoff-backlog.png' })),
    h('p', { className: 'note' }, 'Redacted project artefacts.'));
}

function Decisions() {
  const { setFocus } = useContext(DemoCtx);
  const [tab, setTab] = useState(0);
  const [view, setView] = useState('both');
  const d = DECISIONS[tab];
  const n = tab + 1;
  const tryIt = () => { setFocus(d.focus); scrollToId('design'); };
  return h(Sec, { id: 'decisions' },
    h('h2', null, 'Small decisions support a more trusted workflow.'),
    h('p', { className: 'lede', style: { marginBottom: 0 } }, 'These are the principles that connect the research to the proposed interface.'),
    h(Tabs, { label: 'Design decisions', prefix: 'dec-tab-', panelId: 'dec-panel', value: tab, onChange: (i) => { setTab(i); }, items: DECISIONS.map((x, i) => ({ label: x.title, num: '0' + (i + 1) })) }),
    h('div', { id: 'dec-panel', role: 'tabpanel', 'aria-labelledby': 'dec-tab-' + tab },
      h(Seg, { label: 'Compare directions', items: [['before', 'Earlier'], ['after', 'Refined'], ['both', 'Side by side']], value: view, onChange: setView }),
      h('div', { key: tab + view, className: 'dec-grid swap' },
        view !== 'after' && h('div', null, h('p', { className: 'label' }, 'The friction'), h('p', null, d.friction)),
        view !== 'before' && h('div', null, h('p', { className: 'label' }, 'Design response'), h('p', null, d.response))),
      h('div', { key: 'i' + tab + view, className: 'dec-imgs swap' + (view === 'both' ? '' : ' one') },
        view !== 'after' && h(Fig, { src: FX + 'decision-' + n + '-before.png', alt: 'Earlier exploration: ' + d.before, label: 'Add ' + FX + 'decision-' + n + '-before.png', caption: 'Earlier exploration · ' + d.before }),
        view !== 'before' && h(Fig, { src: FX + 'decision-' + n + '-after.png', alt: 'Refined direction: ' + d.after, label: 'Add ' + FX + 'decision-' + n + '-after.png', caption: 'Refined direction · ' + d.after })),
      h('p', { style: { marginTop: 20 } }, h('button', { type: 'button', className: 'link-btn', onClick: tryIt }, 'Try this in the live demo ↑'))));
}

function Video() {
  const [ok, setOk] = useState(true);
  return h(Sec, { id: 'prototype' },
    h('h2', null, 'Show the flow in context.'),
    h('p', { className: 'lede' }, 'A walkthrough of the capture flow: record an observation, inspect the redaction preview, choose attribution and submit.'),
    ok ? h('video', { className: 'video', controls: true, preload: 'metadata', onError: () => setOk(false) }, h('source', { src: FX + 'prototype.mp4', type: 'video/mp4' }))
       : h('div', { className: 'video' }, 'Prototype walkthrough to be added'),
    !ok && h('p', { className: 'note' }, 'Space reserved for the prototype walkthrough.'));
}

function Reflection() {
  return h(Sec, { id: 'reflection' },
    h('div', { className: 'refl' },
      h('h2', null, 'Good handoff is part of the user experience.'),
      h('p', null, 'This is a working prototype, and the design is expected to change through continued iteration and feedback. The screens are a point in an ongoing process, not a finished answer. In an agile MVP, design intent needs to stay clear while the team learns and adjusts the experience.'),
      h('h3', null, 'What I learnt.'),
      h('p', null, 'Clear communication with developers is a core UX skill. Interaction guidance, prototypes, and prioritised work help translate research into an experience the team can build and revise. As feedback arrives, assumptions and design decisions need to be revisited; states and edge cases will evolve alongside the product.'),
      h('h3', null, 'What I would explore next.'),
      h('p', null, 'Next, I will continue iterating on the prototype with feedback, checking whether the experience feels clear, useful, and appropriate in context. I expect the interaction details and priorities to evolve as the team learns.'),
      h('h3', null, 'Constraints I faced.'),
      h('p', null, 'This case study intentionally omits identifying company information and confidential operational details. Project context has been generalised to respect an NDA. Any future research or outcome claims should be included only when cleared for sharing and supported by evidence.')));
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
  const [focus, setFocus] = useState(0);
  const active = useActive();
  return h(Zoom.Provider, { value: setZoom },
    h(DemoCtx.Provider, { value: { focus, setFocus } },
      h('div', { className: 'fx' },
        h(SiteHeader), h(SubNav, { active }),
        h('main', null, h(Hero), h(Problem), h(Research), h(Design), h(Handoff), h(Decisions), h(Video), h(Reflection)),
        h(Footer)),
      h(Lightbox, { item: zoom, onClose: () => setZoom(null) })));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));