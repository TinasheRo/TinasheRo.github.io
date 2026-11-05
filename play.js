const h = React.createElement;
const { useState, useEffect, useRef } = React;
const A = 'assets/';
const P = 'play_assets/';
// media is looked up in play_assets/ first, then assets/
const M = (...names) => names.flatMap((n) => [P + n, A + n]);

function useFallback(list) {
  const [i, setI] = useState(0);
  return [list[i], () => setI((x) => (x + 1 < list.length ? x + 1 : x))];
}
function Img({ srcs, ...rest }) {
  const [src, next] = useFallback(srcs);
  return h('img', { ...rest, src, onError: next });
}
const sources = (srcs, frag) => srcs.map((s) => h('source', { key: s, src: encodeURI(s) + (frag || ''), type: /\.mov$/i.test(s) ? 'video/quicktime' : 'video/mp4' }));

const LOFI = [
  { srcs: M('interface-lofi-flow.png'), alt: 'Low-fidelity Figma board showing the whole game flow as greyscale Macintosh-style screens, from the opening window through folders and pop-ups to the black crash screens and the ending, with yellow sticky-note annotations', caption: 'Low-fi flow · Every screen of the game mapped in Figma, with notes on the tricks and fixes.' },
  { srcs: M('interface-lofi-annotated.png'), alt: 'Close-up of a low-fidelity screen: stacked Macintosh-style windows reading “The interface is lying to you”, with a red circle on the close box and a green circle on the Trash icon', caption: 'Annotated screen · Red marks the decoy close box that spawns more windows; green marks the Trash, where the real solution lives.' },
];
const PAPER = [
  { srcs: M('interface-paper-1.jpg'), alt: 'Hand-drawn paper prototype: the main page in an old Mac interface with a pop-up reading “The website is lying to you”, a Trash can, and a folder page with notes on tricks and glitching', caption: 'Paper prototype 1 · Main page and first level: a pop-up that duplicates when clicked, with the solution hidden in dragging it to the bin.' },
  { srcs: M('interface-paper-2.jpg'), alt: 'Hand-drawn paper prototype: the “You’re still trusting what you see?” pop-up, the Special menu revealing the truth, and the level 3 black crash screen with a system error message', caption: 'Paper prototype 2 · Pop-up timing, the Special menu reveal, and level 3 where the game stops feeling like a game.' },
  { srcs: M('interface-paper-3.jpg'), alt: 'Hand-drawn paper prototype: the crash page continued with an exit button, and an ending screen showing result, attempts, time spent and behaviour', caption: 'Paper prototype 3 · The crash page continued, then back to the beginning with an ending screen that reflects on how you played.' },
];
const DESIGNS = [
  { srcs: M('interface-final.png', 'theinterfaceislyingtou.png'), alt: 'The game’s opening screen: a black and white Macintosh-style window titled “Title” reading “The interface is lying to you”, on a blue desktop with a Trash icon', caption: 'Final design · The opening screen, styled after early Macintosh.' },
  { srcs: M('interface-homepage.gif', 'theinterface.gif'), alt: 'The game’s homepage in motion, with the Macintosh-style window on a textured blue desktop', caption: 'Final homepage · The live build in motion.' },
];

const PROJECTS = [
  { id: 'interface', kind: 'Game', title: 'The Interface Is Lying To You', tools: 'HTML · CSS · JavaScript · Figma', cover: M('interface-homepage.gif', 'theinterface.gif'), span: 4, h: '360px',
    blurb: 'A deception game that challenges how we blindly trust digital interfaces.',
    desc: 'A web-based deception game that challenges how we blindly trust digital interfaces. Inspired by early Macintosh aesthetics and anti-game design.',
    video: M('Sequence 01_06.mp4', 'Sequence 01_6.mp4', 'Sequence_01_06.mp4', 'Sequence_01_6.mp4', 'Seqence 01_06.mp4'), alt: 'Screen recording of The Interface Is Lying To You being played',
    role: 'Designer and Developer', duration: '14 weeks', itch: 'https://roseannehwami.itch.io/the-interface-is-lying-to-you', stats: '53 plays · 1,866 impressions · Two 5★ reviews' },
  { id: 'maze', kind: 'Game', title: 'Maze Runner', tools: 'p5.js · JavaScript', cover: A + 'play-maze.jpg', video: M('play-maze.mp4', '02.12.2025_21.56.52_REC-2.mp4', '02_12_2025_21_56_52_REC-2.mp4'), alt: 'Screen recording of the maze game', span: 2, h: '360px',
    blurb: 'Collect the coins before time runs out. Press R to restart.' },
  { id: 'scarborough', kind: 'Motion', title: 'Scarborough Trip Edit', tools: 'Adobe Premiere Pro', cover: A + 'play-scarborough.jpg', video: M('play-scarborough.mp4', '1080p 23.98.MP4', '1080p_23_98.MP4', '1080p 23.98.mp4', '1080p_23_98.mp4'), alt: 'Edited video of a trip to Scarborough', span: 2, h: '240px',
    blurb: 'A trip to Scarborough, edited with friends.' },
  { id: 'character', kind: '3D / Character', title: 'Character Study', tools: 'Blender · Photoshop', cover: A + 'play-character.jpg', video: M('play-character.mp4', 'character dev.mp4', 'character_dev.mp4'), alt: 'Turnaround of a 3D character model', span: 2, h: '240px',
    blurb: 'A character modelled in 3D.' },
  { id: 'zombies', kind: 'Game', title: 'Kill All the Zombies', tools: 'Unity · C#', cover: A + 'play-zombies.jpg', video: M('play-zombies.mp4', 'Zombie Attack.mp4', 'Zombie_Attack.mp4'), alt: 'Gameplay of a first-person zombie shooter', span: 2, h: '240px',
    blurb: 'A first-person survival game with a health bar and kill count.' },
  { id: 'instagram', kind: 'Content', title: 'Social Media Edit', tools: 'Premiere Pro · Canva · Instagram', cover: A + 'play-instagram.jpg', video: M('play-instagram.mp4', 'Roseanne Hwami 50914HQ.mp4', 'Roseanne_Hwami_50914HQ.mp4'), alt: 'Vertical Instagram video for Black Heritage Student', span: 3, h: '300px',
    blurb: 'A vertical edit for Black Heritage Student.' },
  { id: 'capcut', kind: 'Content', title: 'CapCut Edit', tools: 'Premiere Pro · Canva · CapCut', cover: A + 'play-capcut.jpg', video: M('play-capcut.mp4', 'Sequence 01_4.mp4', 'Sequence_01_4.mp4'), alt: 'Vertical edit made in CapCut', span: 3, h: '300px',
    blurb: 'A short vertical edit built in CapCut.' },
];

function Header() {
  const links = [['Work', 'index.html#work'], ['About', 'about.html'], ['Play', 'play.html'], ['Resume', 'Roseanne_Hwami_CV.pdf']];
  return h('header', { className: 'site-header wrap' },
    h('a', { className: 'brand', href: 'index.html', 'aria-label': 'Rose + Anne, home' },
      h('img', { className: 'brand-mark', src: A + 'Brand__rose.svg', alt: '', width: 23, height: 23 }), 'Rose + Anne'),
    h('nav', { className: 'nav', 'aria-label': 'Main' }, links.map(([l, href]) =>
      h('a', { key: l, href, ...(l === 'Play' && { 'aria-current': 'page' }), ...(l === 'Resume' && { target: '_blank', rel: 'noreferrer' }) }, l))));
}

function Card({ p, n, onOpen }) {
  const vid = useRef(null);
  const go = () => { const v = vid.current; v && v.play && v.play().catch(() => {}); };
  const stop = () => { const v = vid.current; if (v) { v.pause(); v.currentTime = 2; } };
  return h('li', { style: { '--span': p.span, '--h': p.h } },
    h('button', { type: 'button', className: 'pl-card', onClick: (e) => onOpen(p, e.currentTarget), onMouseEnter: go, onMouseLeave: stop, onFocus: go, onBlur: stop,
      'aria-haspopup': 'dialog', 'aria-label': (p.itch ? 'Open ' : 'Watch ') + p.title },
      h('span', { className: 'fig' },
        p.itch
          ? h(Img, { srcs: p.cover, alt: '', loading: 'lazy' })
          : h('video', { ref: vid, muted: true, loop: true, playsInline: true, preload: 'metadata', poster: p.cover, 'aria-hidden': 'true' }, sources(p.video, '#t=2')),
        h('span', { className: 'badge' }, String(n).padStart(2, '0')),
        h('span', { className: 'play-dot', 'aria-hidden': 'true' }, p.itch ? '↗' : '▶')),
      h('span', { className: 'meta' },
        h('span', { className: 'kind' }, p.kind),
        h('span', { className: 'ttl' }, p.title),
        h('span', { className: 'sub' }, p.blurb),
        h('span', { className: 'tools' }, p.tools))));
}

function fmt(s) { s = Math.floor(s || 0); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
function VideoPlayer({ srcs, poster, label }) {
  const v = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const [muted, setMuted] = useState(false);
  const toggle = () => { const el = v.current; el.paused ? el.play() : el.pause(); };
  return h('div', { className: 'vp' },
    h('video', { ref: v, poster, playsInline: true, preload: 'metadata', 'aria-label': label, onClick: toggle,
      onPlay: () => setPlaying(true), onPause: () => setPlaying(false), onEnded: () => setPlaying(false),
      onTimeUpdate: (e) => setT(e.target.currentTime), onLoadedMetadata: (e) => setDur(e.target.duration) }, sources(srcs)),
    !playing && h('button', { type: 'button', className: 'vp-big', onClick: toggle, 'aria-label': 'Play video' }, '▶'),
    h('div', { className: 'vp-bar' },
      h('button', { type: 'button', onClick: toggle, 'aria-label': playing ? 'Pause' : 'Play' }, playing ? '❚❚' : '▶'),
      h('input', { type: 'range', min: 0, max: dur || 0, step: 0.1, value: t, 'aria-label': 'Seek', onChange: (e) => { v.current.currentTime = +e.target.value; setT(+e.target.value); } }),
      h('time', null, fmt(t) + ' / ' + fmt(dur)),
      h('button', { type: 'button', onClick: () => { v.current.muted = !muted; setMuted(!muted); }, 'aria-label': muted ? 'Unmute' : 'Mute', 'aria-pressed': muted }, muted ? '🔇' : '🔊')));
}

function InterfaceBody({ p, onZoom }) {
  const tabs = [['Designs', DESIGNS], ['Low-fi prototype', LOFI], ['Paper prototype', PAPER]];
  const [tab, setTab] = useState(0);
  const shots = tabs[tab][1];
  return h(React.Fragment, null,
    h('div', { className: 'pl-live' },
      h('div', null, h('small', null, 'Live on itch.io'), h('p', null, p.stats)),
      h('a', { className: 'pl-play', href: p.itch, target: '_blank', rel: 'noreferrer' }, 'Play the game ↗')),
    h('dl', { className: 'pl-facts' },
      [['Role', p.role], ['Duration', p.duration], ['Tools', p.tools]].map(([t, d]) => h('div', { key: t }, h('dt', null, t), h('dd', null, d)))),
    h('div', { className: 'pl-tabs', role: 'tablist' }, tabs.map(([t], i) =>
      h('button', { key: t, role: 'tab', className: 'pl-tab', 'aria-selected': tab === i, onClick: () => setTab(i) }, t))),
    h('div', { className: 'pl-shots' }, shots.map((s) =>
      h('figure', { key: s.srcs[0], className: 'pl-shot' },
        h('button', { type: 'button', onClick: () => onZoom(s), 'aria-label': 'Enlarge: ' + s.caption }, h(Img, { srcs: s.srcs, alt: s.alt, loading: 'lazy' })),
        h('figcaption', null, s.caption)))));
}

function Modal({ p, onClose }) {
  const [zoom, setZoom] = useState(null);
  const closeBtn = useRef(null);
  const zoomRef = useRef(null); zoomRef.current = zoom;
  useEffect(() => {
    closeBtn.current && closeBtn.current.focus();
    const k = (e) => { if (e.key === 'Escape') zoomRef.current ? setZoom(null) : onClose(); };
    document.addEventListener('keydown', k);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = prev; };
  }, []);
  return h('div', { className: 'pl-back', onMouseDown: (e) => e.target === e.currentTarget && onClose() },
    h('div', { className: 'pl-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'pl-title' },
      h('button', { ref: closeBtn, className: 'pl-x', onClick: onClose, 'aria-label': 'Close' }, '×'),
      h('p', { className: 'pl-eyebrow' }, p.kind),
      h('h2', { id: 'pl-title' }, p.title),
      p.desc && h('p', { className: 'desc' }, p.desc),
      p.video && h(VideoPlayer, { srcs: p.video, poster: typeof p.cover === 'string' ? p.cover : undefined, label: p.alt }),
      p.itch && h(InterfaceBody, { p, onZoom: setZoom }),
      !p.itch && h('p', { className: 'desc' }, p.blurb + ' ' + p.tools + '.')),
    zoom && h('div', { className: 'pl-zoom', onClick: () => setZoom(null) }, h(Img, { srcs: zoom.srcs, alt: zoom.alt })));
}

function App() {
  const [open, setOpen] = useState(null);
  const from = useRef(null);
  const show = (p, el) => { from.current = el; setOpen(p); };
  const close = () => { setOpen(null); from.current && from.current.focus(); };
  return h(React.Fragment, null,
    h(Header),
    h('main', null,
      h('section', { className: 'pl-hero wrap' },
        h('p', { className: 'pl-eyebrow' }, 'Play / In full bloom'),
        h('h1', null, 'My playground.'),
        h('p', { className: 'pl-sub' }, 'Games, video and character experiments beyond the case studies. Select any one to open it.')),
      h('section', { className: 'pl-sec' },
        h('div', { className: 'wrap' },
          h('ul', { className: 'pl-grid' }, PROJECTS.map((p, i) => h(Card, { key: p.id, p, n: i + 1, onOpen: show })))))),
    h(SiteFooter),
    open && h(Modal, { p: open, onClose: close }));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));