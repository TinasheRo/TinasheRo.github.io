const h = React.createElement;
const { useState, useEffect } = React;
const A = 'assets/';

const SECTIONS = [
  ['overview', 'Overview'], ['opportunity', '01 / Opportunity'], ['narrative', '02 / Investigate'], ['research', '03 / Research'],
  ['process', '04 / Process'], ['prototypes', '05 / Prototypes'], ['design-system', '06 / Design system'],
  ['testing', '07 / Testing'], ['demonstration', '08 / Video demo'], ['reflection', '09 / Reflection'],
];

const SIDES = {
  meowtrix: {
    name: 'Madame Meowtrix', role: 'Maximillian’s wife and Pippy’s “close friend”',
    blurb: 'She says Pippy meant nothing to her.',
    clues: [
      ['The marriage', 'She married Maximillian, but he was in it for the money.'],
      ['A secret', 'She and Pippy were seeing each other in secret.'],
      ['The threat', 'Pippy threatened her the night before he died.'],
    ],
  },
  maximillian: {
    name: 'Maximillian Munchkin', role: 'Pippy’s childhood friend',
    blurb: 'He says they were close, but not together.',
    clues: [
      ['Old friends', 'He and Pippy grew up together.'],
      ['The day before', 'He found out about the affair the day before Pippy died.'],
      ['The silence', 'He told no one. Business came first.'],
    ],
  },
};

const SWATCHES = [
  ['Background colour', '#121212', '#f5f5f5'], ['Panel colour', '#1e1e1e', '#f5f5f5'],
  ['Primary text colour', '#f5f5f5', '#121212'], ['Accent colour', '#c1121f', '#ffffff'],
  ['Secondary text colour', '#bdbdbd', '#121212'], ['Border colour', '#2a2a2a', '#f5f5f5'],
];

function Figure({ src, alt, caption, onOpen }) {
  return h('figure', { className: 'figure' },
    h('button', { type: 'button', onClick: () => onOpen({ src, alt }), 'aria-label': 'Enlarge image: ' + alt },
      h('img', { src: A + src, alt, loading: 'lazy' })),
    caption && h('figcaption', null, caption));
}

function Lightbox({ img, onClose }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, []);
  return h('div', { className: 'lightbox', onClick: onClose, role: 'dialog', 'aria-modal': 'true', 'aria-label': img.alt },
    h('img', { src: A + img.src, alt: img.alt }),
    h('button', { onClick: onClose, 'aria-label': 'Close' }, '×'));
}

function SiteHeader() {
  const links = [['Work', 'index.html#work'], ['About', 'about.html'], ['Email', 'mailto:roseannehwami@gmail.com'], ['Resume', 'Roseanne_Hwami_CV.pdf']];
  return h('header', { className: 'cs-header wrap' },
    h('a', { className: 'brand', href: 'index.html', 'aria-label': 'Rose + Anne, home' },
      h('img', { className: 'brand-mark', src: 'assets/Brand__rose.svg', alt: '', width: 23, height: 23 }), 'Rose + Anne'),
    h('nav', { className: 'nav', 'aria-label': 'Main' },
      links.map(([l, href]) => h('a', { key: l, href, ...(l === 'Resume' && { target: '_blank', rel: 'noreferrer' }) }, l))));
}

function SubNav() {
  const [active, setActive] = useState('overview');
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((x) => x.isIntersecting && setActive(x.target.id)), { rootMargin: '-40% 0px -55% 0px' });
    SECTIONS.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el); });
    const f = () => { const d = document.documentElement; setPct((d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100); };
    f(); addEventListener('scroll', f, { passive: true });
    return () => { io.disconnect(); removeEventListener('scroll', f); };
  }, []);
  return h('div', { className: 'subnav' },
    h('div', { className: 'wrap subnav-row' },
      h('a', { className: 'back', href: 'index.html#work' }, '← Back'),
      h('nav', { 'aria-label': 'Case study sections' },
        SECTIONS.map(([id, label]) => h('a', { key: id, href: '#' + id, className: active === id ? 'on' : '', 'aria-current': active === id ? 'true' : undefined }, label)))),
    h('div', { className: 'bar', style: { width: pct + '%' } }));
}

function Mystery() {
  const [side, setSide] = useState('meowtrix');
  const [found, setFound] = useState({});
  const [verdict, setVerdict] = useState('');
  const s = SIDES[side];
  const count = Object.keys(found).length;
  const toggle = (k) => setFound((f) => { const n = { ...f }; n[k] ? delete n[k] : (n[k] = 1); return n; });
  const accuse = (who) => setVerdict(count < 6
    ? 'Not yet. You have found ' + count + ' of 6 clues. One side of the story is not enough to name ' + who + '.'
    : who === 'Madame Meowtrix'
      ? 'Correct. Pippy threatened her over their secret, and she silenced him. Maximillian knew and stayed quiet.'
      : 'Incorrect. Maximillian knew about the affair and kept quiet, but he did not poison Pippy. Try again.');
  return h('div', null,
    h('div', { className: 'case' }, Object.entries(SIDES).map(([k, v]) =>
      h('button', { key: k, className: 'side', 'aria-pressed': side === k, onClick: () => setSide(k) },
        h('h3', null, v.name), h('p', null, v.role + '. ' + v.blurb)))),
    h('div', { className: 'clues' }, s.clues.map(([t, d], i) => {
      const key = side + i;
      return h('button', { key, className: 'clue', 'aria-pressed': !!found[key], onClick: () => toggle(key) },
        h('b', null, t), h('span', null, found[key] ? d : 'Tap to inspect'));
    })),
    h('div', { className: 'board', 'aria-live': 'polite' },
      h('p', null, count + ' of 6 clues found. Read both perspectives, then submit your verdict.'),
      h('div', { className: 'ctrl' },
        ['Madame Meowtrix', 'Maximillian Munchkin'].map((n) => h('button', { key: n, className: 'suspect', onClick: () => accuse(n) }, 'Accuse ' + n)),
        h('button', { className: 'btn', onClick: () => { setFound({}); setVerdict(''); } }, 'Reset')),
      verdict && h('p', { className: 'verdict' }, verdict)));
}

function Palette() {
  const [msg, setMsg] = useState('');
  const copy = (hex) => {
    try { navigator.clipboard.writeText(hex); } catch (_) {}
    setMsg('Copied ' + hex);
    setTimeout(() => setMsg(''), 1500);
  };
  return h('div', null,
    h('div', { className: 'swatches' }, SWATCHES.map(([n, bg, fg]) =>
      h('button', { key: n, className: 'sw', style: { background: bg, color: fg }, onClick: () => copy(bg), 'aria-label': 'Copy ' + n + ' ' + bg },
        n, h('small', null, bg)))),
    msg && h('div', { className: 'toast', role: 'status' }, msg));
}

function Section({ id, label, title, sub, children }) {
  return h('section', { id, className: 'sec' },
    h('div', { className: 'wrap' },
      label && h('p', { className: 'eyebrow' }, label),
      h('h2', null, title), sub && h('p', { className: 'sub' }, sub), children));
}

function Cols({ items, head }) {
  return h('div', { className: 'cols' }, items.map(([t, d, k]) =>
    h('div', { key: t }, k && h('p', { className: 'kicker' }, k), h('h3', null, t), h('p', null, d))));
}

const SPRINTS = [
  ['Sprint 1', 'Weeks 4–5', 'Planning & concept', 'Evaluated five project concepts, voted to combine a murder mystery with a comic-style story adaptation, and defined the cast and their relationships.'],
  ['Sprint 2', 'Weeks 6–7', 'Skeleton', 'Formalised roles. Worked with a peer on paper prototypes and low-fidelity Balsamiq wireframes, then high-fidelity Figma prototypes for the introduction, perspective selection and case file.'],
  ['Sprint 3', 'Easter–Week 8', 'Narrative & comic production', 'Each team member scripted assigned chapters across both perspectives, covering scene description, dialogue and panel sequence.'],
  ['Sprint 4', 'Weeks 9–11', 'Integration', 'Built the homepage, chapter layouts and perspective pages in HTML, CSS and JavaScript.'],
  ['Sprint 5', 'Weeks 12–14', 'Testing & submission', 'Brought artwork, interface and development together for testing and submission. Compiled the copyright appendix ahead of the 27 May deadline.'],
];

function Process() {
  const [i, setI] = useState(0);
  const [k, w, t, d] = SPRINTS[i];
  return h('div', null,
    h('div', { className: 'tabs', role: 'tablist' }, SPRINTS.map((x, n) =>
      h('button', { key: n, role: 'tab', className: 'tab', 'aria-selected': i === n, onClick: () => setI(n) }, x[0] + ' · ' + x[1]))),
    h('div', { className: 'panel', role: 'tabpanel' }, h('h3', null, t), h('p', null, d)));
}

function App() {
  const [img, setImg] = useState(null);
  const F = (props) => h(Figure, { ...props, onOpen: setImg });
  return h(React.Fragment, null,
    h(SiteHeader), h(SubNav),
    h('main', null,
      h('section', { id: 'overview', className: 'cs-hero wrap' },
        h('div', { className: 'pills-row' }, h('span', null, 'UI design & development'), h('span', null, 'Interactive narrative'), h('span', { className: 'hot' }, '14 weeks')),
        h('h1', null, 'Who Poisoned Pippy?'),
        h('img', { className: 'hero-img', src: A + 'homepage_main_pip.gif', alt: 'The Who Poisoned Pippy? homepage, with the title and two suspects drawn in white line art on black' }),
        h('p', { className: 'caption' }, 'Who Poisoned Pippy? · An interactive murder mystery in the browser.'),
        h('dl', { className: 'meta' },
          [['Role', 'Interface Designer & Product Management support'], ['Duration', '14 weeks'], ['Tools', 'Figma · Balsamiq · Google Sheets'], ['Format', 'Browser-based interactive narrative']]
            .map(([t, d]) => h('div', { key: t }, h('dt', null, t), h('dd', null, d)))),
        h('div', { className: 'project-row' }, h('p', { className: 'eyebrow' }, 'The project'),
          h('p', { className: 'lede' }, 'An interactive mystery experience where players investigate clues, interpret evidence and uncover the truth behind Pippy’s poisoning.'))),

      h(Section, { id: 'opportunity', label: '01 · The opportunity', title: 'How might we make mystery feel engaging and accessible?',
        sub: 'Create an experience where players become investigators, piecing together evidence across multiple perspectives before reaching their own conclusion.' },
        h('h3', { className: 'h3' }, 'An interactive murder mystery, told from two sides.'),
        h('p', { className: 'body' }, 'Players investigate the death of Pippy, a small-town mouse, by exploring comic-panel scenes and hovering a magnifying-glass tool over hidden clues to reveal them. Each discovery feeds a case file that players build up and refer back to before naming a suspect.'),
        h('p', { className: 'body' }, 'The story splits into two playable perspectives: Madam Meowtrix, the cat, and Maximus Maxmillian, the dog. Each reveals different information about their relationship to Pippy and their possible motive, while deliberately withholding the rest.'),
        h('p', { className: 'quote' }, '“Reading only one side isn’t enough to solve the case.”'),
        h(Cols, { items: [['Two perspectives', 'An incomplete account from each suspect.'], ['Hidden clues', 'Comic panels with hover-to-reveal evidence.'], ['A running case file', 'Build a record as the investigation unfolds.'], ['No installation', 'Runs entirely in the browser.']] })),

      h(Section, { id: 'narrative', label: '02 · Investigate', title: 'Try the case yourself',
        sub: 'A small version of the idea. Switch perspectives, inspect the clues, then submit your verdict.' }, h(Mystery)),

      h(Section, { id: 'research', label: '03 · Grounded in research', title: 'Why interactive narrative, and why two perspectives.',
        sub: 'The concept was grounded in Murray’s (1997) framework for compelling digital narrative: agency, immersion and transformation.' },
        h(Cols, { items: [['Agency', 'Players choose which clues to examine.'], ['Immersion', 'Scripted dialogue and scene composition place the player inside a suspect’s perspective.'], ['Transformation', 'The second perspective reveals new information and changes the player’s reading of events.']] }),
        h('p', { className: 'body' }, 'The two-perspective structure answers what Murray calls an “encyclopedic” experience: no single viewpoint is sufficient. The full picture only emerges once both accounts have been weighed against each other, mirroring how real investigations work.'),
        h(Cols, { items: [['The Boat', 'A story told as scrolling comic panels in a browser. This informed the chapter-by-chapter structure, preventing players from skipping ahead.', 'SBS & The Pixel Hunt · 2015'], ['Duck Detective: The Secret Salami', 'Short, character-specific dialogue carries personality, motive and unreliability without long exposition — the model for how each suspect speaks.', 'Happy Broccoli Games · 2024']] }),
        h('div', { className: 'figs' }, h(F, { src: 'Formative_Flowchart_drawio.png', alt: 'Flowchart: pick a suspect’s perspective, see all perspectives, then pick who did the murder', caption: 'Early investigation flow · Detail from the original planning diagram.' }))),

      h(Section, { id: 'process', label: '04 · Process & collaboration', title: 'Running the project like a small agile studio.',
        sub: 'As documentation lead, I helped keep a 14-week project spanning visual art, writing, interface design and front-end development moving in parallel. Five sprints let design, scripting and development progress together instead of waiting on each other.' },
        h('h3', { className: 'h3' }, 'My focus.'),
        h('div', { className: 'focus' },
          h('div', null, h('h3', null, 'Design'), h('ul', null, ['Information architecture', 'Wireframe and interface design', 'Design system creation in Figma'].map((x) => h('li', { key: x }, x)))),
          h('div', null, h('h3', null, 'Coordination'), h('ul', null, ['Documentation and project management support', 'Sprint planning and team coordination'].map((x) => h('li', { key: x }, x))))),
        h(Process),
        h('h3', { className: 'h3' }, 'Keeping the whole team in view.'),
        h('p', { className: 'body' }, 'From Sprint 2 onwards, I maintained the team’s shared task tracker in Google Sheets. Every task had a named owner, a priority and a weekly status: not started, in progress, completed or blocked. Anyone could see where the project stood and step in early when something was stuck.'),
        h('div', { className: 'figs' }, h(F, { src: 'task_tracker.png', alt: 'Google Sheets task tracker with assignee, role, status, priority and due date columns', caption: 'Task tracker · Prioritisation, ownership and weekly status across the sprints.' }))),

      h(Section, { id: 'prototypes', label: '05 · Early prototypes', title: 'From paper sketches to interface wireframes.',
        sub: 'Before a single wireframe reached Figma, we mapped Pippy, Meowtrix and Maxmillian’s relationships and motives by hand: who lied to whom, and who had a reason to want Pippy gone.' },
        h('div', { className: 'figs' },
          h(F, { src: 'relationship_pip.png', alt: 'Hand-drawn relationship map linking Maximus, Meowtrix and Pippy', caption: 'Hand-mapped character relationships and motives.' }),
          h(F, { src: 'Case_file_-2.png', alt: 'Suspect case file for Madame Meowtrix with five locked evidence slots', caption: 'Character dossier concepts · Original planning evidence.' })),
        h(Cols, { items: [['Paper', 'Explore relationships and scene structure.'], ['Balsamiq', 'Refine homepage, chapter and case-file wireframes.'], ['Figma', 'Develop the interface prototypes.'], ['HTML/CSS', 'Carry the layout into the browser.']] }),
        h('p', { className: 'body' }, 'The website followed the same low-tech-first approach: paper sketches of the homepage, chapter view and case file, refined into low-fidelity wireframes in Balsamiq before Figma. A 12-column grid was adopted at this stage and carried into the final HTML/CSS, cutting down on translation errors later.'),
        h('div', { className: 'figs' }, h(F, { src: 'balsamiq_1.png', alt: 'Balsamiq wireframes: launch page, opening story and choose perspective screen, with team comments', caption: 'Low-fidelity interface wireframes · Original process evidence.' }))),

      h(Section, { id: 'design-system', label: '06 · Design system', title: 'Defining the visual language before development.',
        sub: 'Before development began, I worked with the team to define the project’s design system in Figma: colour, typography and core UI components, so everyone designing or building a page shared the same reference.' },
        h('p', { className: 'body' }, 'The product palette uses a near-black background and dark panels for a noir tone, off-white primary text for legibility without harsh contrast, and a single deep-red accent (#C1121F) for interactive elements, highlighted names and clues. This teaches players to read red as interactive without needing instructions.'),
        h(Palette),
        h('div', { className: 'figs' }, h(F, { src: 'Colour_palette_idea_2-2.png', alt: 'Colour palette with hand-drawn back and switch perspectives buttons and a magnifying glass icon', caption: 'Product colour palette · Original Figma design-system evidence.' })),
        h(Cols, { items: [['Patrick Hand', 'A handwritten comic aesthetic for the game’s expressive headings.', 'Headings'], ['Valera Round', 'Rounded body text keeps longer passages legible.', 'Body copy'], ['Quicksand', '24px action labels, with 32px where needed.', 'Calls to action']] }),
        h('div', { className: 'type-specimen' },
          h('p', { className: 't1' }, 'Primary heading'), h('small', null, 'Patrick Hand, 128px'),
          h('p', { className: 't2' }, 'Secondary heading'), h('small', null, 'Patrick Hand, 64px'),
          h('p', { className: 't3' }, 'Body text sits in Varela Round.'), h('small', null, 'Varela Round, 32px'),
          h('p', { className: 't4' }, 'Submit your verdict'), h('small', null, 'Quicksand, 24px')),
        h('p', { className: 'body' }, 'Base type sizes were set in Figma as fixed pixel values, then translated into fluid clamp() values in CSS. This preserved the proportional relationship between headings, subheadings and body text across screen sizes.')),

      h(Section, { id: 'testing', label: '07 · Testing & learning', title: 'Watching real visitors investigate.',
        sub: 'Who Poisoned Pippy? was exhibited at the Interactive Media Showcase, running on a public display for visitors to pick up and play without instructions from the team.' },
        h('div', { className: 'figs' }, h(F, { src: 'whopoisonedpip_showcase.jpeg', alt: 'The game on a monitor at the showcase, with crime scene tape on a black curtain behind', caption: 'Interactive Media Showcase · Public-display play.' })),
        h('p', { className: 'body' }, 'Watching people interact with the public build became a form of guerrilla testing: informal, unplanned usability observation of real visitors, rather than recruited participants in a structured session.'),
        h(Cols, { items: [['The story seemed to stop.', 'Several players stalled where continuing required scrolling. There was no visual cue, arrow or partially visible panel to suggest more content below, so some assumed they had reached the end of the chapter and stopped or gave up.', 'Observation'], ['Make continuation visible.', 'If revisiting the page, add a clear scroll indicator wherever the story continues by scrolling rather than clicking. A partially visible next panel or a subtle cue would make the next step discoverable.', 'Next iteration']] })),

      h(Section, { id: 'demonstration', label: '08 · Video demonstration', title: 'Video demonstration',
        sub: 'A preview of the interactive mystery experience and its two-perspective narrative.' },
        h('video', { className: 'demo-video', controls: true, playsInline: true, preload: 'metadata', 'aria-label': 'Screen recording of Who Poisoned Pippy? being played' },
          h('source', { src: A + 'video_whopoisonedpippy.mp4', type: 'video/mp4' }),
          'Your browser can’t play this video.'),
        h('p', { className: 'caption' }, 'Walkthrough · Exploring scenes, collecting clues and submitting a verdict.')),

      h(Section, { id: 'reflection', label: '09 · Reflection', title: 'Designing for accessibility and feasibility, not just aesthetics.',
        sub: 'The biggest lesson came from an animated gradient background that shifted as players scrolled. It looked atmospheric in early prototypes, but proved difficult to build and introduced accessibility problems.' },
        h('h3', { className: 'h3' }, 'A small visual touch became a real blocker.'),
        h('p', { className: 'body' }, 'The animated gradient repeatedly appeared as a blocker in scrum meetings. It took several sessions to behave consistently across pages, consuming more time than expected. The team had not flagged that risk before the idea was locked into the early design.'),
        h('h3', { className: 'h3' }, 'Atmosphere cannot come at the cost of access.'),
        h('p', { className: 'body' }, 'Testing against WCAG 2.1 showed that the gradient reduced contrast between the background and comic text, particularly during transitions. The continuously moving background also raised a pauseability concern. The team dropped the animation and kept a static, scroll-triggered version that retained the mood shift without dragging down contrast.'),
        h('h3', { className: 'h3' }, 'Feasibility belongs in the first conversation.'),
        h('p', { className: 'body' }, 'A layout that looks correct in Figma does not automatically behave the same way in a framework such as Bootstrap. Utility classes override the custom clamp() sizing on the back button, and the case file did not centre correctly in HTML/CSS. Carrying a 12-column grid consistently from wireframes to Figma and CSS reduced friction, but some interface decisions needed to reflect developers’ constraints from the start.'),
        h('h3', { className: 'h3' }, 'Bring development into wireframing earlier.'),
        h('p', { className: 'body' }, 'Next time, involve developers while ideas are still being sketched rather than after designs are signed off. Agree on fallback approaches before an effect becomes a blocker, make compromises explicit, and observe real people using the build sooner.'),
        h('p', { className: 'quote' }, '“What would have helped: surfacing feasibility in the same meeting as the concept, and watching real people use it sooner.”'))),
    h(SiteFooter),
    img && h(Lightbox, { img, onClose: () => setImg(null) }));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));