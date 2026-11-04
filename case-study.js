const { useState, useEffect, createContext, useContext } = React;
const h = React.createElement;
const Zoom = createContext(() => {});
const RD = 'resource_direc_assets/';

const SECTIONS = [
  { id: 'overview', nav: 'Overview' },
  { id: 'problem', nav: '01 / Problem', label: 'Problem space' },
  { id: 'discovery', nav: '02 / Discovery', label: 'Discovery & research' },
  { id: 'prototyping', nav: '03 / Prototyping', label: 'Low-fi prototypes' },
  { id: 'hifi', nav: '04 / High-Fidelity', label: 'High-fidelity & branding' },
  { id: 'requirements', nav: '05 / Requirements', label: 'FR & NFR requirements' },
  { id: 'video', nav: '06 / Video demonstration', label: 'Video demonstration' },
  { id: 'reflection', nav: '07 / Reflection', label: 'Reflection' },
];

const FR = [
  'Students can browse resources by Year (1, 2, 3) and by Module.',
  'Each module page displays required Software and Hardware separately.',
  'Each resource states whether it is Required or Useful/Recommended.',
  'Each resource states its purpose: what it is used for.',
  'Modules display AI-use guidance relevant to that module’s assessment.',
  'Users can expand/collapse the modules sidebar on mobile.',
  'Navigation persists across all module pages: sidebar and Year tabs.',
  'Users can download or access software directly from its listing.',
  'The sidebar highlights the currently active module for orientation.',
];
const NFR = [
  'Responsive — usable on desktop and mobile screen sizes.',
  'Accessible — sufficient colour contrast and readable typography.',
  'Consistent — identical navigation and layout patterns across every page.',
  'Performance — pages load quickly with minimal dependencies.',
  'Maintainable — add new modules without redesigning the template.',
  'Discoverable — information architecture minimises clicks to find a resource.',
  'Cross-browser compatible — renders correctly across major browsers.',
  'Scalable — the structure supports all Years and additional modules.',
];

const Mini = ([title, text]) => h('div', { className: 'mini', key: title }, h('h4', null, title), h('p', null, text));

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
    h('div', { className: 'wrap' }, s.label && h('p', { className: 'eyebrow' }, id === 'reflection' ? '07 ' + s.label : s.nav.split(' / ')[0] + '  ' + s.label), children));
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
  const links = [['Work', 'index.html#work'], ['About', 'about.html'], ['Email', 'mailto:roseannehwami@gmail.com'], ['Resume', 'Resume6.pdf']];
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

function Hero() {
  const meta = [
    ['Timeline', ['2 months']],
    ['Team', ['Solo project']],
    ['Role', ['UX Design: Information Architecture, Prototyping', 'Development: Front-end, GitHub Pages', 'Research: Content Audit']],
    ['Tools used', ['Figma', 'Google Sheets', 'GitHub Pages', 'VS Code', 'Chrome DevTools']],
  ];
  return h('div', { id: 'overview', className: 'wrap' },
    h('div', { className: 'cs-hero' },
      h('div', { className: 'pills' }, h('span', { className: 'tag' }, 'UX & front-end dev'), h('span', { className: 'tag' }, 'UoY Resource Directory'), h('span', { className: 'tag hot' }, '2026')),
      h('h1', null, 'The Student Resource Directory'),
      h('div', { className: 'stage' },
        h('div', { className: 'stage-top' }, h('span', null, 'One home for course resources'), h('span', null, 'University of York · Interactive Media')),
        h(Fig, { src: RD + 'hifi-foundations-demo.gif', alt: 'The Student Resource Directory showing Year 1 modules, software and hardware for Foundations of Interactive Media', caption: 'The directory brings module-specific software, hardware and learning resources together.' }))),
    h('dl', { className: 'meta' }, meta.map(([k, v]) => h('div', { key: k }, h('dt', null, k), v.map((line) => h('dd', { key: line }, line))))),
    h('div', { className: 'intro' },
      h('p', { className: 'eyebrow' }, 'The project'),
      h('p', null, 'A central resource directory for Interactive Media students at the University of York. The work moved from auditing scattered module content to designing a clearer information architecture, prototyping the experience and preparing requirements for development.')));
}

function Requirements() {
  const [f, setF] = useState('all');
  const panel = (title, sub, code, items) => h('div', { className: 'panel' },
    h('header', null, h('h3', null, title), h('p', null, sub)),
    h('ul', { style: { margin: 0, padding: 0 } }, items.map((t, i) => h('li', { key: code + i }, h('span', null, code + (i + 1)), t))));
  return h(Sec, { id: 'requirements' },
    h('h2', null, 'Requirements before coding.'),
    h('p', { className: 'lede' }, 'The functional and non-functional requirements set out what the directory needed to do and how the experience should work.'),
    h('div', { className: 'chips', role: 'group', 'aria-label': 'Filter requirements' },
      [['all', 'All'], ['fr', 'Functional'], ['nfr', 'Non-functional']].map(([k, l]) =>
        h('button', { key: k, className: 'chip', 'aria-pressed': f === k, onClick: () => setF(k) }, l))),
    h('div', { className: 'req-grid' + (f === 'all' ? '' : ' single') },
      f !== 'nfr' && panel('Functional requirements', 'What the directory needs to do', 'FR', FR),
      f !== 'fr' && panel('Non-functional requirements', 'How the directory should work', 'NFR', NFR)),
    h('p', { className: 'fig', style: { marginTop: 14, fontSize: 11, color: 'var(--berry)' } }, 'Project requirements transcribed from the original planning sheets, shown below.'),
    h('div', { className: 'compare', style: { marginTop: 32 } },
      h(Fig, { src: RD + 'requirements-functional.png', alt: 'Original planning sheet listing functional requirements FR1 to FR9', label: 'Add ' + RD + 'requirements-functional.png', caption: 'Original planning sheet · Functional requirements.' }),
      h(Fig, { src: RD + 'requirements-non-functional.png', alt: 'Original planning sheet listing non-functional requirements NFR1 to NFR8', label: 'Add ' + RD + 'requirements-non-functional.png', caption: 'Original planning sheet · Non-functional requirements.' })));
}

function Video() {
  const [ok, setOk] = useState(true);
  return h(Sec, { id: 'video' },
    h('h2', null, 'Video demonstration'),
    h('p', { className: 'lede' }, 'A walkthrough of the directory’s year tabs, module navigation and resource listings.'),
    ok ? h('video', { className: 'video', controls: true, preload: 'metadata', onError: () => setOk(false) }, h('source', { src: 'assets/demo.mp4', type: 'video/mp4' }))
       : h('div', { className: 'video' }, 'Demonstration recording to be added'),
    !ok && h('p', { className: 'fig', style: { marginTop: 10, fontSize: 11, color: 'var(--berry)' } }, 'Video space reserved for the project demonstration.'));
}

function Page() {
  return h(React.Fragment, null,
    h(Hero),
    h(Sec, { id: 'problem', dark: true },
      h('p', { className: 'kicker' }, 'The everyday question'),
      h('p', { className: 'big-q' }, '“What software would I need for creative coding?”'),
      h('h3', { className: 'less' }, 'Less searching. More learning.'),
      h('div', { className: 'two' },
        h('p', null, 'Every module had its own page, and every page organised things differently. First-year students needed to know what to install before a practical; returning students needed to find tutorials from earlier terms.'),
        h('p', null, 'There was no single place to look. My job was to turn “everything is scattered everywhere” into something a student could open, search and immediately understand.')),
      h('blockquote', { className: 'pull' }, '“Interactive Media students were spending more time hunting for software and hardware information than actually learning how to use it.”', h('cite', null, '— Lecturer from IM department'))),
    h(Sec, { id: 'discovery' },
      h('h2', null, 'From scattered resources to a structured system.'),
      h('p', { className: 'lede' }, 'To understand the existing experience, I audited 12+ Interactive Media modules and investigated how students accessed software, hardware and learning resources.'),
      h('div', { className: 'audit' },
        h('div', { className: 'stat' }, h('b', null, '12+'), 'Interactive Media modules audited', h('p', null, 'The audit recorded tools, versions, their purpose and where they appeared: module pages, lectures and practicals.'),
          h('ul', null, ['What is the resource?', 'Where is it mentioned?', 'What is it used for?'].map((q) => h('li', { key: q, style: { listStyle: 'none' } }, q)))),
        h(Fig, { src: RD + 'audit-sheet.png', alt: 'Content audit spreadsheet listing each module’s software and hardware, whether it is mentioned on the page, its purpose, and where it is used', label: 'Add ' + RD + 'audit-sheet.png', caption: 'Content audit · One of the modules reviewed in Google Sheets. Original process evidence.' }))),
    h(Sec, { id: 'prototyping' },
      h('h2', null, 'Prototyping a simpler way to find resources.'),
      h('p', { className: 'lede' }, 'I created an initial prototype for a central directory of software, hardware and learning tools. Feedback from my lecturer revealed too many clicks, especially for new students who might not know which module or category a resource belongs to.'),
      h('div', { className: 'compare', style: { marginBottom: 40 } },
        [['Paper sketch', 'Layout & content structure', 'sketch-paper-layout', 'Paper sketch · A year heading, module list and content area.'],
         ['Content structure', 'What each resource should say', 'sketch-content-structure', 'Sketch · Resource name, purpose, use in assessment, link and software version.']].map(([t, s, f, c]) =>
          h('div', { key: f }, h('h3', null, t), h('p', { className: 'sub' }, s), h(Fig, { src: RD + f + '.png', alt: t + ' sketch', label: 'Add ' + RD + f + '.png', caption: c })))),
      h('div', { className: 'compare' },
        [['Initial approach', 'Dropdown-led navigation', 'lofi-initial', 'Initial wireframe · Year selection and a module list alongside resource information.'],
         ['Revised approach', 'Visible years & clear buttons', 'lofi-revised', 'Revised wireframe · Year tabs, grouped modules and recognisable download buttons.']].map(([t, s, f, c]) =>
          h('div', { key: f }, h('h3', null, t), h('p', { className: 'sub' }, s), h(Fig, { src: RD + f + '.png', alt: t + ' wireframe', label: 'Add ' + RD + f + '.png', caption: c })))),
      h('div', { className: 'pair' },
        h('div', null, h('h3', null, 'The friction'), h('p', null, 'The first approach created more work and required too many clicks to reach the right resource.')),
        h('div', null, h('h3', null, 'The response'), h('p', null, 'I used the Gestalt principle of proximity to group modules, making the navigation easier to scan.'))),
      h('div', { className: 'cols3' }, [
        ['Clearer categories', 'Replace the dropdown-heavy layout with clearer categories and scannable resource cards.'],
        ['Direct resource links', 'Give students direct routes to relevant tools rather than adding steps.'],
        ['Recognisable calls to action', 'Redesign download links as clear CTA buttons so they are easier to recognise at a glance.']].map(Mini))),
    h(Sec, { id: 'hifi' },
      h('h2', null, 'A familiar university experience.'),
      h('p', { className: 'lede' }, 'Once the information architecture and navigation were established, I created a high-fidelity prototype that followed the university’s branding and design system. This kept the directory consistent with other university resources and familiar for students.'),
      h('div', { className: 'compare' },
        h(Fig, { src: RD + 'hifi-creative-coding.png', alt: 'High-fidelity directory for Creative Coding I showing required and useful software', label: 'Add ' + RD + 'hifi-creative-coding.png', caption: 'High-fidelity directory · Creative Coding I, Year 1, with required and useful software and AI-use guidance.' }),
        h(Fig, { src: RD + 'hifi-foundations-demo.gif', alt: 'Animated walkthrough of the directory for Foundations of Interactive Media', label: 'Add ' + RD + 'hifi-foundations-demo.gif', caption: 'Walkthrough · Foundations of Interactive Media, Year 1.' })),
      h('div', { className: 'split' },
        h('div', null, h('h3', null, 'One directory. A consistent pattern.'), h('p', null, 'The product retains University of York branding. Year tabs and the module sidebar provide the structure for browsing course resources.')),
        h('div', { className: 'cols3' }, [
          ['Year & module navigation', 'Persistent year tabs and a sidebar keep the course structure visible.'],
          ['Module context', 'A module title and clear labels establish which resources the page relates to.'],
          ['Clear guidance', 'The page points to the VLE for games and explicitly states when no software or hardware is required.']].map(Mini)))),
    h(Requirements),
    h(Video),
    h(Sec, { id: 'reflection' },
      h('h2', null, 'Reflection'),
      h('p', { className: 'lede' }, 'The project brought content auditing, information architecture and prototyping into one workflow. The key lesson was to make course structure visible and make the route to each resource clear.'),
      h('div', { className: 'cols3' }, [
        ['Start with the content', 'Auditing the existing module resources provided the foundation for a clearer information architecture.'],
        ['Make structure visible', 'Visible year tabs, grouped modules and recognisable actions reduced the friction in the initial prototype.'],
        ['Define the handoff', 'Functional and non-functional requirements made the intended behaviour and quality expectations explicit before development.']].map(Mini))));
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
    h(SiteHeader), h(SubNav, { active }),
    h('main', null, h(Page)),
    h(SiteFooter),
    h(Lightbox, { item: zoom, onClose: () => setZoom(null) }));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));