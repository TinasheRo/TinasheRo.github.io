/* Shared by the home and About hero: drifting, cursor-attracted blur blobs.
   Usage: const ref = React.useRef(null); useHeroBlobs(ref); then render <div class="blobs" ref=ref><i/><i/><i/></div> */
function useHeroBlobs(ref) {
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nodes = Array.from(el.children);
    // hx/hy: home position (fraction of hero), ax/ay: how far it wanders, px/py: ms per loop, pull: how strongly the cursor attracts it
    const cfg = [
      { hx: 0.12, hy: 0.50, ax: 0.20, ay: 0.16, px: 17000, py: 23000, ph: 0.0, pull: 0.30 },
      { hx: 0.50, hy: 0.35, ax: 0.24, ay: 0.14, px: 21000, py: 15000, ph: 2.0, pull: 0.24 },
      { hx: 0.85, hy: 0.55, ax: 0.16, ay: 0.18, px: 19000, py: 27000, ph: 4.0, pull: 0.38 },
    ];
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const off = nodes.map(() => ({ x: 0, y: 0 }));
    let mouse = null, raf = 0, last = 0, visible = true;
    const draw = (t, dt) => {
      const W = el.clientWidth, H = el.clientHeight, r = el.getBoundingClientRect();
      const k = 1 - Math.exp(-dt / 350);
      nodes.forEach((n, i) => {
        const c = cfg[i];
        const bx = c.hx * W + c.ax * W * Math.sin(t * 2 * Math.PI / c.px + c.ph);
        const by = c.hy * H + c.ay * H * Math.sin(t * 2 * Math.PI / c.py + c.ph * 0.7);
        let tx = 0, ty = 0;
        if (mouse && !reduce) {
          tx = Math.max(-260, Math.min(260, (mouse.x - r.left - bx) * c.pull));
          ty = Math.max(-200, Math.min(200, (mouse.y - r.top - by) * c.pull));
        }
        off[i].x += (tx - off[i].x) * k;
        off[i].y += (ty - off[i].y) * k;
        n.style.transform = 'translate3d(' + (bx + off[i].x - n.offsetWidth / 2) + 'px,' + (by + off[i].y - n.offsetHeight / 2) + 'px,0)';
      });
    };
    const loop = (now) => {
      if (!visible) { raf = 0; return; }
      const dt = Math.min(64, now - (last || now));
      last = now;
      draw(now, dt);
      raf = requestAnimationFrame(loop);
    };
    const move = (e) => { mouse = { x: e.clientX, y: e.clientY }; };
    const leave = () => { mouse = null; };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !reduce) { last = 0; raf = requestAnimationFrame(loop); }
    });
    io.observe(el);
    draw(0, 16);
    if (!reduce) {
      raf = requestAnimationFrame(loop);
      addEventListener('pointermove', move, { passive: true });
      document.documentElement.addEventListener('mouseleave', leave);
    }
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, []);
}
