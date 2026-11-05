const h = React.createElement;

const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: 'about.html' },
  { label: 'Play', href: 'play.html' },
  { label: 'Email', href: 'mailto:roseannehwami@gmail.com' },
  { label: 'Resume', href: 'Roseanne_Hwami_CV.pdf', external: true },
];

const PROJECTS = [
  {
    title: 'Resource Directory',
    href: 'resource-directory.html',
    read: '5 min',
    cta: 'View client work',
    tags: 'UX Design · Development',
    image: 'assets/112f4.png',
    alt: 'Resource Directory showing software lists by year of study',
    text: 'A central hub helping Interactive Media students find the tools, software and resources they need for their studies. 60 unique users · 328 visits in the first 2 months.',
  },
  {
    title: 'Foxlove Revenue',
    href: 'foxlove-revenue.html',
    read: '7 min',
    slug: 'foxlove',
    locked: true,
    tags: 'UX Research · B2B SaaS',
    image: 'assets/09d98.png',
    alt: 'Foxlove Revenue sign-in screen',
    text: 'Led research and product design as the sole designer, interviewing 12 target users and translating insights into iterative designs and developer-ready handoffs.',
  },
  {
    title: 'Deep within',
    href: 'deep-within.html',
    read: '6 min',
    tags: 'UX design · Research',
    image: 'assets/hero-three-screens.png',
    alt: 'Three Deep within screens: Explore Meditation, Your mood Journal and an AI chat offering support',
    text: "A meditation and self-care app designed to support users' wellbeing through guided sessions and mood journalling. Evaluated the prototype using think-aloud usability testing to identify navigation issues and inform design improvements.",
  },
  {
    title: 'Who Poisoned Pippy?',
    href: 'who-poisoned-pippy.html',
    read: '7 min',
    tags: 'Interactive narrative · UX design',
    image: 'assets/homepage_main_pip_1.gif',
    alt: 'Who Poisoned Pippy? homepage animation: hand-drawn comic panels in black and white with the text “Help us solve this case”',
    text: 'An interactive comic murder mystery told from two suspects’ perspectives. Designed the navigation and UI and laid out the comic chapters in a team of four.',
  },
];

function Flourish() {
  const blade = (deg) => h('path', { key: deg, d: 'M12 12 L11 1.5 Q17 4 12 12 Z', transform: 'rotate(' + deg + ' 12 12)' });
  return h('svg', { className: 'flourish', viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' },
    [0, 60, 120, 180, 240, 300].map(blade));
}

function Header() {
  return h('header', { className: 'site-header wrap' },
    h('a', { className: 'brand', href: '/', 'aria-label': 'Rose + Anne, home' },
      h('img', { className: 'brand-mark', src: 'assets/Brand__rose.svg', alt: '', width: 23, height: 23 }), 'Rose + Anne'),
    h('nav', { className: 'nav', 'aria-label': 'Main' },
      NAV.map((n) =>
        h('a', { key: n.label, href: n.href, ...(n.external && { target: '_blank', rel: 'noreferrer' }) }, n.label))));
}

function Hero() {
  return h('section', { className: 'hero-bg' },
    h('img', { className: 'hero-blur', src: 'assets/812df.svg', alt: '', 'aria-hidden': 'true' }),
    h('div', { className: 'hero wrap' },
      h('h1', null, 'I’m ', h('em', null, 'Roseanne Hwami'), ' – I design digital experiences with people in mind.'),
      h('p', null, 'I’m studying Interactive Media at the University of York, where I’m exploring how research, psychology and design can make digital experiences more accessible.'),
      h('p', null, 'Currently, I’m designing for an early-stage B2B SaaS startup across account management, delivery and sales — always balancing user needs with business goals.')));
}

function ProjectCard({ project, index, onLocked }) {
  const num = String(index + 1).padStart(2, '0');
  return h('li', null,
    h('article', null,
      h('a', {
        className: 'card-media', href: project.href || '#', 'aria-label': 'View ' + project.title + (project.locked ? ' (password protected)' : ''),
        onClick: project.locked ? (e) => { e.preventDefault(); onLocked(project, e.currentTarget); } : undefined,
      },
        h('span', { className: 'badge' }, num),
        h('span', { className: 'read-badge' }, project.read + ' read'),
        h('img', { src: project.image, alt: project.alt }),
        h('span', { className: 'card-cta', 'aria-hidden': 'true' }, project.locked ? 'Enter password' : (project.cta || 'View case study'), h('span', { className: 'arrow' }, ' →'))),
      h('div', { className: 'card-head' },
        h('h3', null, project.title),
        h('span', { className: 'tags' }, project.tags)),
      h('p', { className: 'card-text' }, project.text)));
}

function Work({ onLocked }) {
  return h('section', { id: 'work', className: 'work wrap' },
    h('h2', null, 'Selected work'),
    h('ul', { className: 'cards' },
      PROJECTS.map((p, i) => h(ProjectCard, { key: p.title, project: p, index: i, onLocked }))));
}


const PASSWORD = 'tpq515';

function PasswordModal({ project, onClose }) {
  const [value, setValue] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState(false);
  const input = React.useRef(null);
  React.useEffect(() => {
    input.current.focus();
    const k = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = prev; };
  }, []);
  const submit = (e) => {
    e.preventDefault();
    if (value === PASSWORD) {
      try { sessionStorage.setItem('unlocked:' + project.slug, '1'); } catch (_) {}
      location.href = project.href;
    } else {
      setError(true);
      input.current.focus();
    }
  };
  return h('div', { className: 'modal-backdrop', onMouseDown: (e) => e.target === e.currentTarget && onClose() },
    h('div', { className: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'modal-title' },
      h('div', { className: 'modal-top' },
        h('p', { className: 'modal-eyebrow' }, 'Protected client work'),
        h('button', { className: 'modal-x', onClick: onClose, 'aria-label': 'Close' }, '×')),
      h('h2', { id: 'modal-title' }, project.title),
      h('p', { className: 'modal-text' }, 'This client work is password protected. Enter the password to view the project.'),
      h('form', { onSubmit: submit, noValidate: true },
        h('label', { htmlFor: 'pw' }, 'Password'),
        h('div', { className: 'pw-field' + (error ? ' bad' : '') },
          h('input', {
            id: 'pw', ref: input, type: show ? 'text' : 'password', value, placeholder: 'Enter password',
            autoComplete: 'off', 'aria-invalid': error, 'aria-describedby': error ? 'pw-err' : undefined,
            onChange: (e) => { setValue(e.target.value); setError(false); },
          }),
          h('button', { type: 'button', className: 'pw-show', onClick: () => setShow(!show), 'aria-pressed': show }, show ? 'Hide' : 'Show')),
        error && h('p', { id: 'pw-err', className: 'pw-err', role: 'alert' }, 'That password isn’t right. Please try again.'),
        h('button', { type: 'submit', className: 'pw-go' }, 'View case study →')),
      h('p', { className: 'modal-help' }, 'Need access? ',
        h('a', { href: 'mailto:roseannehwami@gmail.com?subject=' + encodeURIComponent(project.title + ' case study access') }, 'Get in touch.'))));
}

function App() {
  const [lock, setLock] = React.useState(null);
  const close = () => { lock && lock.el && lock.el.focus(); setLock(null); };
  return h(React.Fragment, null,
    h(Header),
    h('main', null, h(Hero), h(Work, { onLocked: (project, el) => setLock({ project, el }) })),
    h(SiteFooter),
    lock && h(PasswordModal, { project: lock.project, onClose: close }));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));