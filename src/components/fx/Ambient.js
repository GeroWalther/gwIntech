import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// Shared visual language. These are token references rather than literals, so
// the same components serve the light and dark grounds — the actual values live
// in globals.css and swap on one attribute. Because they are valid CSS values,
// they drop straight into inline styles exactly as the old hex strings did.
export const INK = "var(--gw-ink)";
export const TEXT = "var(--gw-text)";
export const MUTED = "var(--gw-muted)";
export const LINE = "var(--gw-line)";
export const PANEL = "var(--gw-panel)";
export const MINT = "var(--gw-mint)";
export const VIOLET = "var(--gw-violet)";

// Three slow-drifting colour fields, a fading grid and a grain wash. All of it
// is CSS — no canvas, no rAF loop — so it costs nothing once painted and does
// not fight the scroll.
export const Ambient = ({ children, className = "" }) => (
  <div className={`relative w-full overflow-hidden ${className}`} style={{ background: INK }}>
    <div aria-hidden className="pointer-events-none absolute inset-0 gw-aurora" />
    <div aria-hidden className="pointer-events-none absolute inset-0 gw-grid" />
    <div aria-hidden className="pointer-events-none absolute inset-0 gw-grain" />
    <div className="relative">{children}</div>
  </div>
);

// Reveals on entry, once. Respects the OS reduced-motion setting by way of the
// global stylesheet, which flattens the transform for those users.
export const Reveal = ({ children, delay = 0, y = 24, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// A glass panel that lights up under the cursor. The pointer position is written
// to CSS custom properties rather than to React state, so moving the mouse never
// triggers a re-render.
export const SpotlightCard = ({ children, className = "", as: Tag = "div", ...rest }) => {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      className={`gw-spot group relative overflow-hidden rounded-2xl border border-solid transition-colors duration-300 ${className}`}
      style={{ background: PANEL, borderColor: LINE }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

// Headline text with the brand gradient running through it.
export const GradientText = ({ children, className = "" }) => (
  <span
    className={`bg-clip-text text-transparent ${className}`}
    style={{ backgroundImage: `linear-gradient(100deg, ${TEXT} 0%, ${MINT} 45%, ${VIOLET} 100%)` }}
  >
    {children}
  </span>
);

export const Pill = ({ children, className = "" }) => (
  <span
    className={`rounded-full border border-solid px-3 py-1 text-xs font-semibold uppercase tracking-wider ${className}`}
    style={{ borderColor: LINE, background: PANEL, color: MUTED }}
  >
    {children}
  </span>
);

// Counts up once the element is on screen. Purely decorative, so it starts at
// the final value for anyone who never scrolls it into view.
export const Stat = ({ value, suffix = "", label }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 900;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div ref={ref} className="flex flex-col">
      <span className="font-mono text-3xl font-semibold md:text-2xl" style={{ color: TEXT }}>
        {n}
        {suffix}
      </span>
      <span className="mt-1 text-sm font-medium" style={{ color: MUTED }}>
        {label}
      </span>
    </div>
  );
};

// Duplicated track so the loop has no visible seam.
export const Marquee = ({ children, speed = 40 }) => (
  <div className="gw-marquee relative w-full overflow-hidden">
    <div className="gw-marquee-track flex w-max items-center gap-12" style={{ animationDuration: `${speed}s` }}>
      {children}
      {children}
    </div>
  </div>
);
