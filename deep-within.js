const { useState, useEffect, createContext, useContext } = React;
const h = React.createElement;
const Zoom = createContext(() => {});
const DW = 'deep_within_assets/';

const SECTIONS = [
  { id: 'overview', nav: 'Overview' },
  { id: 'problem', nav: '01 / Problem', num: '01', label: 'Problem space' },
  { id: 'research', nav: '02 / Research', num: '02', label: 'Research & discovery' },
  { id: 'prototypes', nav: '03 / Prototypes', num: '03', label: 'Prototypes' },
  { id: 'testing', nav: '04 / Testing', num: '04', label: 'User testing' },
  { id: 'findings', nav: '05 / Findings', num: '05', label: 'Research findings' },
  { id: 'iterations', nav: '06 / Iterations', num: '06', label: 'Design iterations' },
  { id: 'video', nav: '07 / Video demonstration', num: '07', label: 'Video demonstration' },
  { id: 'reflection', nav: '08 / Reflection', num: '08', label: 'Reflection' },
];

const RESULTS = [
  ['86%', 'Data visualisation', 'of participants wanted visual progress through graphs and trends.'],
  ['71%', 'Discoverability & navigation', 'of participants struggled to find key features such as mood logging and history.'],
  ['86%', 'Content discovery', 'of participants wanted session duration visible before opening content.'],
  ['57%', 'System status', 'of participants expected confirmation after logging a mood.'],
];

const THEMES = [
  { title: 'Discoverability & navigation', img: 'sticky-discoverability.png', alt: 'Sticky notes of participant quotes about discoverability and navigation issues',
    struggled: 'Users were unsure where to log moods, access history, or return to the journal from the home screen.',
    evidence: '5/7 participants hesitated or clicked around before finding the right entry point.' },
  { title: 'Content discovery', img: 'sticky-content-discovery.png', alt: 'Sticky notes of participant quotes about content discovery, such as wanting session length visible on the card',
    struggled: 'Users wanted session duration visible before opening meditations and found content hard to scan.',
    evidence: 'Participants wanted to know length and type of session at a glance.' },
  { title: 'Data visualisation', img: 'sticky-data-visualisation.png', alt: 'Sticky notes of participant quotes about data visualisation, such as expecting a graph rather than a list',
    struggled: 'Users wanted trends and graphs rather than isolated entries, so they could understand emotional patterns over time.',
    evidence: 'Several participants said they expected a graph or clearer progress view.' },
  { title: 'Feedback & system status', img: 'sticky-system-status.png', alt: 'Sticky notes of participant quotes about feedback and system status issues',
    struggled: 'Users wanted confirmation that their mood had been saved and what would happen next after submission.',
    evidence: 'Multiple participants expected a success state or clearer transition after logging.' },
];

const REQS = [
  ['Improve navigation & feature discoverability', 'Users struggled to locate key features such as mood logging, mood history and the journal, highlighting the need for clearer navigation and more discoverable entry points.'],
  ['Enhance emotional progress visualisation', 'Users wanted to view mood trends and emotional patterns over time through graphs and summaries rather than isolated mood entries.'],
  ['Strengthen system status & user confidence', 'Users expected clearer confirmation after completing actions and more contextual information, such as meditation duration, to feel confident using the app.'],
];

const ITERATIONS = [
  { n: '01', title: 'Navigation and feature discovery',
    oldText: 'The original version lacked visual hierarchy. The background distracted users and the information hierarchy was unclear.',
    newText: 'The home screen now surfaces the mood journal, with stress level, sleep quality and an AI insight immediately visible.',
    oldImg: 'iter1-old-home.gif', newImg: 'iter1-new-home-ai-insight.gif',
    oldAlt: 'Original home screen with placeholder recommendation tiles and a small mood journal', newAlt: 'Redesigned home screen with recommendation cards and a mood journal summary showing an AI insight' },
  { n: '02', title: 'Emotional progress visualisation',
    oldText: 'The original prototype’s weak visual hierarchy overwhelmed users.',
    newText: 'Clearer information architecture gives users easier access to all entries and a direct route to log check-ins.',
    oldImg: 'iter2-old-mood-journal-thu.gif', newImg: 'iter2-new-week-overview.gif',
    oldAlt: 'Original mood journal screen with text boxes for mood and sleep check-ins', newAlt: 'Redesigned mood journal with weekly overview, stress level, sleep quality, AI insight and past entries' },
  { n: '03', title: 'System status feedback & user confidence',
    oldText: 'The original prototype confused users because the system did not clearly confirm that their check-in had been logged.',
    newText: 'A loading state communicates that check-in data is being processed, followed by confirmation at the end.',
    oldImg: 'iter3-old-mood-journal-wed.gif', newImg: 'iter3-new-analysing.gif',
    oldAlt: 'Original mood journal check-in screen', newAlt: 'New loading screen reading Analysing today’s check-in with mood, sleep and journal summary' },
];

function Fig({ src, alt, caption, label }) {
  const [ok, setOk] = useState(true);
  const zoom = useContext(Zoom);
  return h('figure', { className: 'fig' },
    ok
      ? h('button', { className: 'fig-btn', onClick: () => zoom({ src, alt, caption }), 'aria-label': 'Enlarge image: ' + alt },
          h('img', { src, alt, onError: () => setOk(false) }))
      : h('div', { className: 'fig-empty' }, label || alt),
    caption && h('figcaption', null, caption));
}

function Sec({ id, dark, children }) {
  const s = SECTIONS.find((x) => x.id === id);
  return h('section', { id, className: 'sec' + (dark ? ' dark' : '') },
    h('div', { className: 'wrap' },
      h('p', { className: 'eyebrow' }, h('span', { className: 'num' }, s.num), s.label),
      children));
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

function Hero() {
  const meta = [
    ['Role', ['UX research & UI design']],
    ['Tools used', ['Figma']],
  ];
  return h('div', { id: 'overview', className: 'wrap' },
    h('div', { className: 'cs-hero' },
      h('div', { className: 'pills' }, h('span', { className: 'tag' }, 'UX research & UI design'), h('span', { className: 'tag' }, 'AI-powered wellbeing'), h('span', { className: 'tag hot' }, 'Case study')),
      h('h1', null, 'Deep Within'),
      h('div', { className: 'stage' },
        h('div', { className: 'stage-top' }, h('span', { className: 'stage-label' }, 'Healthier reflection habits')),
        h('div', { className: 'stage-img single' },
          h('img', { src: DW + 'hero-three-screens.png', alt: 'Three Deep Within screens: Explore Meditation, Your mood Journal with a weekly overview and AI insight, and an AI chat offering support' })),
        h('p', { className: 'cap', style: { margin: '14px 0 0', fontSize: 11 } }, 'Meditation, mood journalling and AI-powered wellbeing support.'))),
    h('dl', { className: 'meta' }, meta.map(([k, v]) => h('div', { key: k }, h('dt', null, k), v.map((line) => h('dd', { key: line }, line))))),
    h('div', { className: 'intro' },
      h('p', { className: 'eyebrow' }, 'The project'),
      h('p', null, 'Helping users build healthier reflection habits through AI-powered insights and wellbeing support. Deep Within connects mood tracking, sleep data, journalling and contextual guidance in one experience.')));
}

function Problem() {
  return h(Sec, { id: 'problem', dark: true },
    h('h2', { style: { marginTop: 24 } }, 'Students are logging emotions, but never understanding them'),
    h('p', { className: 'lede', style: { maxWidth: 900 } }, 'Students experience significant pressure from coursework, deadlines, financial concerns and balancing personal responsibilities. While many wellbeing apps record emotions, they often fail to help users understand emotional patterns.'),
    h('div', { style: { margin: '40px 0', borderTop: '1px solid rgb(231 224 203 / 20%)' } }),
    h('p', { className: 'kicker', style: { textAlign: 'left' } }, 'The everyday question'),
    h('p', { className: 'big-q', style: { textAlign: 'left', margin: '0 0 40px', maxWidth: 900 } }, '“What would have helped me when I felt overwhelmed?”'),
    h('div', { style: { borderTop: '1px solid rgb(231 224 203 / 20%)', paddingTop: 32, fontSize: 14, lineHeight: 1.7, maxWidth: 900 } },
      'As a result, users regularly log emotions without gaining insight into their emotional wellbeing or how they can improve it.'));
}

function Research() {
  return h(Sec, { id: 'research' },
    h('h2', null, 'A human-centred process from day one.'),
    h('p', { className: 'lede' }, 'Research informed personas, personas shaped wireframes, wireframes revealed usability issues, and those issues drove iteration.'),
    h('img', { className: 'svg-img', src: DW + 'design-process.svg', alt: 'Design process in five steps: 1 Empathise (competitor research), 2 Define (user personas), 3 Ideate (low-fi wireframes), 4 Prototype (Figma high fidelity), 5 Test (usability review)' }),
    h('h3', { className: 'h3' }, 'What already existed. What was missing.'),
    h('p', { className: 'lede', style: { marginBottom: 0 } }, 'Headspace, Widgetable and Calm were analysed to understand the competitive landscape. The opportunity was clear: no single flow combined mood tracking, sleep data, journalling and contextual AI support.'),
    h('img', { className: 'svg-img cmp-img', src: DW + 'competitor-analysis.svg', alt: 'Competitor comparison. Daily mood check-in: Headspace no, Widgetable yes, Calm yes, Deep Within yes. Sleep tracking: only Deep Within. AI-powered insights: only Deep Within. Personalised recommendation: Headspace partial, Widgetable no, Calm partial, Deep Within yes. Reflective journaling: Headspace no, Widgetable partial, Calm partial, Deep Within yes.' }),
    h('h3', { className: 'h3' }, 'Designing for real environments in real moments.'),
    h('p', { className: 'lede', style: { marginBottom: 24 } }, 'The personas were built to keep design decisions grounded in human needs and lived experiences.'),
    h('div', { className: 'grey personas' },
      [['persona-aisha.png', 'User persona: Aisha, 20, a stressed university student in London who studies full time and works part time. Wants to reduce stress, sleep better and try guided meditation and journalling'],
       ['persona-david.png', 'User persona: David, 38, a working parent in Cambridge with a full-time job, two kids and recent therapy. Needs short sessions, emotional regulation and family balance'],
       ['persona-mary.png', 'User persona: Mary, 27, a silent struggler with a corporate job who rarely talks about mental health. Wants self-awareness, self-improvement, a safe space and short sessions']].map(([f, a]) =>
        h(Fig, { key: f, src: DW + f, alt: a, label: 'Add ' + DW + f }))),
    h('p', { className: 'note' }, 'User personas · Original project evidence.'));
}

function Prototypes() {
  return h(Sec, { id: 'prototypes' },
    h('h2', null, 'Prototypes to capture the user flow.'),
    h('p', { className: 'lede' }, 'Across the low-fidelity stage, the concept evolved from a linear journey into an AI-powered reflection experience. This laid the foundation for the high-fidelity prototype, which was then tested with users.'),
    h('p', { className: 'label', style: { marginTop: 32 } }, 'Low-fidelity explorations'),
    h('div', { className: 'lofi' },
      h(Fig, { src: DW + 'lofi-iteration-1.png', alt: 'Low-fidelity prototype iteration 1, with notes on the goal, what was not working and what it revealed', label: 'Add ' + DW + 'lofi-iteration-1.png' }),
      h(Fig, { src: DW + 'lofi-iteration-2.png', alt: 'Low-fidelity prototype iteration 2, adding separate mood and sleep check-ins and a tabbed explore area', label: 'Add ' + DW + 'lofi-iteration-2.png' })),
    h('p', { className: 'note' }, 'Low-fidelity prototypes · Iteration 1 and Iteration 2. Original process evidence.'),
    h('h3', { className: 'h3' }, 'From user flow to a wellbeing experience.'),
    h('div', { className: 'grey' },
      h(Fig, { src: DW + 'hifi-original-three-screens.png', alt: 'Original high-fidelity prototype: mood journal, explore tabs and welcome home screen', label: 'Add ' + DW + 'hifi-original-three-screens.png' })),
    h('p', { className: 'note' }, 'High-fidelity prototype before usability review.'));
}


function useInView() {
  const ref = React.useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current || !('IntersectionObserver' in window)) return setSeen(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

function Seg({ options, value, onChange, label }) {
  return h('div', { className: 'seg', role: 'group', 'aria-label': label },
    options.map(([k, l]) => h('button', { key: k, 'aria-pressed': value === k, onClick: () => onChange(k) }, l)));
}

function ResultsBars() {
  const [ref, seen] = useInView();
  return h('div', { className: 'results', ref },
    RESULTS.map(([b, k, t]) => h('div', { key: k + b },
      h('b', null, b), h('div', { className: 'meter', role: 'img', 'aria-label': b + ' of participants' }, h('i', { style: { width: seen ? b : '0%' } })),
      h('p', { className: 'k' }, k), h('p', null, t))));
}

function ThemeTabs() {
  const [i, setI] = useState(0);
  const t = THEMES[i];
  return h('div', null,
    h('div', { className: 'seg wrapseg', role: 'group', 'aria-label': 'Feedback themes' },
      THEMES.map((x, n) => h('button', { key: x.title, 'aria-pressed': i === n, onClick: () => setI(n) }, x.title))),
    h('div', { className: 'themes' },
      h('div', { key: t.title, className: 'theme fade' + (t.img ? '' : ' solo') },
        t.img && h(Fig, { src: DW + t.img, alt: t.alt, label: 'Add ' + DW + t.img }),
        h('div', { className: 'theme-card' },
          h('h4', null, t.title),
          h('p', { className: 'k' }, 'What participants struggled on'), h('p', null, t.struggled),
          h('p', { className: 'k' }, 'Evidence'), h('p', null, t.evidence)))));
}

function Testing() {
  return h(Sec, { id: 'testing' },
    h('h2', null, '7 university students. Real words. Real reactions.'),
    h('p', { className: 'lede' }, 'After completing the first prototype, I recruited 7 university students to test it using a think-aloud protocol. The goal was not to find people who liked the design, but to watch participants use it and identify where they struggled.'),
    h('div', { className: 'strip' },
      [['7', 'Participants'], ['3', 'Tasks set'], ['3', 'Key issues found'], ['Think aloud', 'Method']].map(([b, s]) => h('div', { key: s }, h('b', null, b), h('span', null, s)))),
    h('ul', { className: 'tasks' },
      [['Task 1', 'Log a mood'], ['Task 2', 'Find past moods'], ['Task 3', 'Find music that lasts 10 minutes']].map(([k, t]) =>
        h('li', { key: k }, h('p', { className: 'label' }, k), h('h3', null, t)))),
    h('h3', { className: 'h3' }, 'Results of the user testing.'),
    h(ResultsBars),
    h('p', { className: 'note', style: { marginBottom: 24 } }, 'Reported results from 7 university students testing the original prototype.'),
    h(Fig, { src: DW + 'results-stats.png', alt: 'Results board: 86% wanted visual progress through graphs and trends, 71% struggled to find key features, 86% wanted session duration visible, 57% expected confirmation after logging a mood', label: 'Add ' + DW + 'results-stats.png', caption: 'Original results board · Four themes from the usability sessions.' }),
    h('h3', { className: 'h3' }, 'Listening for patterns in the feedback.'),
    h(ThemeTabs),
    h('p', { className: 'note' }, 'Original research synthesis · Discoverability, content discovery, data visualisation, and system feedback.'));
}

function Findings() {
  return h(Sec, { id: 'findings' },
    h('h2', null, 'Three themes. Clear design requirements.'),
    h('p', { className: 'lede', style: { marginBottom: 24 } }, 'Three key themes emerged through user testing of the original prototype. Each theme became a design requirement.'),
    h('ol', { className: 'reqs', style: { listStyle: 'none', margin: 0, padding: 0 } },
      REQS.map(([t, d], i) => h('li', { key: t }, h('span', { className: 'n' }, '0' + (i + 1)), h('div', null, h('h3', null, t), h('p', null, d))))));
}

function PhoneFig({ f, alt }) {
  return h('img', { src: DW + f, alt });
}

function Iterations() {
  return h(Sec, { id: 'iterations' },
    h('h2', null, 'How the app evolved through every decision.'),
    h('p', { className: 'lede' }, 'Every iteration was a response to something learned — from user research, from testing, and from asking “does this actually solve the design requirement?” Here is the story of those changes:'),
    ITERATIONS.map((it) => h('article', { key: it.n, className: 'it' },
      h('p', { className: 'it-num' }, it.n),
      h('h3', { className: 'it-title' }, it.title + ' iteration'),
      h('div', { className: 'it-cols' },
        [['The old version', it.oldText, it.oldImg, it.oldAlt], ['The new version', it.newText, it.newImg, it.newAlt]].map(([label, text, f, alt]) =>
          h('div', { key: label, className: 'it-col' },
            h('h4', null, label),
            h('p', null, text),
            h('div', { className: 'it-phone' }, h('img', { src: DW + f, alt, loading: 'lazy' }))))))),
    h('p', { className: 'note', style: { marginTop: 24 } }, 'Before and after · Original project evidence.'));
}

function Video() {
  const [ok, setOk] = useState(true);
  return h(Sec, { id: 'video' },
    h('h2', null, 'Video demonstration'),
    h('p', { className: 'lede' }, 'An overview of mood check-ins, emotional progress and AI-powered wellbeing support.'),
    ok ? h('video', { className: 'video', controls: true, preload: 'metadata', onError: () => setOk(false) }, h('source', { src: DW + 'demo.mp4', type: 'video/mp4' }))
       : h('div', { className: 'video' }, 'Demonstration recording to be added'),
    !ok && h('p', { className: 'note' }, 'Space reserved for the Deep Within demonstration video.'));
}

function Reflection() {
  return h(Sec, { id: 'reflection' },
    h('div', { className: 'refl' },
      h('h2', null, 'What I learnt from this project.'),
      h('p', null, 'This project taught me that good UX design comes from validating ideas with users rather than designing based on assumptions. While I had a clear vision for Deep Within, usability testing uncovered issues around navigation, emotional progress tracking, and system feedback that I had not anticipated. Watching participants interact with the prototype showed me the value of observing real behaviour instead of relying on what I thought users would do.'),
      h('p', null, 'It also changed how I approach iteration. Rather than making visual improvements for the sake of aesthetics, every design decision became grounded in user feedback and linked back to a specific design requirement. This experience reinforced that UX is an iterative process where research, testing, and design continuously inform one another.'),
      h('h3', null, 'What I’ll do next.'),
      h('p', null, 'Although the redesign addressed the main usability issues, I would not consider the project finished without testing it again. I would recruit another group of participants to validate the changes, measure Task Success Rate across the core user journeys, and use the System Usability Scale (SUS) to understand how users perceived the overall experience. This would help identify remaining pain points and the impact of the iterations before moving into development.'),
      h('h3', null, 'Constraints I faced.'),
      h('p', null, 'The participant sample did not fully represent the target audience. While the app was designed for both university students and older adults seeking emotional wellbeing support, all seven participants were university students. This limits the generalisability of the findings, as older users may have different needs, behaviours, and accessibility requirements. Future research would recruit participants from both user groups to improve the validity of the design decisions.')));
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
    h('button', { className: 'lb-x', onClick: onClose, 'aria-label': 'Close image' }, '×'),
    h('img', { src: item.src, alt: item.alt, onClick: (e) => e.stopPropagation() }),
    item.caption && h('p', null, item.caption));
}

function App() {
  const [zoom, setZoom] = useState(null);
  const active = useActive();
  return h(Zoom.Provider, { value: setZoom },
    h('div', { className: 'dw' },
      h(SubNav, { active }),
      h('main', null, h(Hero), h(Problem), h(Research), h(Prototypes), h(Testing), h(Findings), h(Iterations), h(Video), h(Reflection)),
      h(SiteFooter)),
    h(Lightbox, { item: zoom, onClose: () => setZoom(null) }));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));