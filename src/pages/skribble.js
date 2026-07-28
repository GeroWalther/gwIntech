import { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const RELEASES_URL = "https://github.com/GeroWalther/skribble/releases/latest";
const REPO_URL = "https://github.com/GeroWalther/skribble";
const ISSUES_URL = "https://github.com/GeroWalther/skribble/issues/new";

// Deep violet-black, so the saturated ink colours have somewhere to glow.
const INK = "#0a0616";

// The exact annotation palette the app ships with, so the browser demo and the
// real thing are the same colours rather than merely similar.
const PALETTE = [
  "#e52126",
  "#ff7517",
  "#ffd600",
  "#4dd94d",
  "#1a8cff",
  "#b359ff",
  "#ff66b3",
  "#33e6d9",
  "#ffffff",
];

const DEMO_TOOLS = [
  { id: "pen", label: "Pencil", d: "M3 17.3V21h3.7L17.6 10.1l-3.7-3.7L3 17.3zM20.7 7c.4-.4.4-1 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7L20.7 7z" },
  { id: "marker", label: "Highlighter", d: "M15.6 2.5 8 10.1l-1.4 4.2 1.4 1.4 4.2-1.4 7.6-7.6-4.2-4.2zM4 19h16v3H4z" },
  { id: "arrow", label: "Arrow", d: "M5 19 19 5M10 5h9v9" },
  { id: "rect", label: "Rectangle", d: "M3 5h18v14H3z" },
  { id: "ellipse", label: "Ellipse", d: "M12 5c5 0 9 3.1 9 7s-4 7-9 7-9-3.1-9-7 4-7 9-7z" },
];

/* ------------------------------------------------------------------ *
 * Canvas drawing — a small, faithful port of the app's own renderer.
 * ------------------------------------------------------------------ */

function drawShape(ctx, s) {
  const p = s.points;
  if (!p || p.length === 0) return;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = s.color;
  ctx.lineWidth = s.width;

  if (s.tool === "marker") {
    // On a dark ground an additive blend reads the way a highlighter reads on
    // paper: the ink glows instead of muddying what is underneath.
    ctx.globalAlpha = 0.3;
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = s.width * 3.5;
  }

  const a = p[0];
  const b = p[p.length - 1];
  ctx.beginPath();

  if (s.tool === "pen" || s.tool === "marker") {
    if (p.length < 3) {
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x + 0.01, b.y);
    } else {
      // Quadratic curves through the midpoints, exactly as DrawShape does, so
      // freehand comes out smooth instead of polygonal.
      ctx.moveTo(a.x, a.y);
      for (let i = 1; i < p.length - 1; i++) {
        const mx = (p[i].x + p[i + 1].x) / 2;
        const my = (p[i].y + p[i + 1].y) / 2;
        ctx.quadraticCurveTo(p[i].x, p[i].y, mx, my);
      }
      ctx.lineTo(b.x, b.y);
    }
    ctx.stroke();
  } else if (s.tool === "arrow") {
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    const angle = Math.atan2(b.y - a.y, b.x - a.x);
    const head = Math.max(s.width * 4.5, 14);
    const spread = Math.PI / 7;
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x - Math.cos(angle - spread) * head, b.y - Math.sin(angle - spread) * head);
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x - Math.cos(angle + spread) * head, b.y - Math.sin(angle + spread) * head);
    ctx.stroke();
  } else if (s.tool === "rect") {
    ctx.rect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
    ctx.stroke();
  } else if (s.tool === "ellipse") {
    ctx.ellipse(
      (a.x + b.x) / 2,
      (a.y + b.y) / 2,
      Math.abs(b.x - a.x) / 2,
      Math.abs(b.y - a.y) / 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * The centrepiece: a real drawing surface, with the app's edge-triggered
 * palette. Telling someone they can draw on their screen is weaker than
 * handing them something to draw on.
 */
function InkCanvas() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const shapesRef = useRef([]);
  const currentRef = useRef(null);
  const drawingRef = useRef(false);
  const hideTimer = useRef(null);

  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState(PALETTE[0]);
  const [width, setWidth] = useState(6);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const coarseRef = useRef(false);

  // Event handlers are bound once, so they read the live values through refs.
  const settings = useRef({ tool, color, width });
  useEffect(() => {
    settings.current = { tool, color, width };
  }, [tool, color, width]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);
    for (const s of shapesRef.current) drawShape(ctx, s);
    if (currentRef.current) drawShape(ctx, currentRef.current);
  }, []);

  // Keep the backing store in step with the element's CSS size and the display
  // density, or strokes land away from the pointer and look soft.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      redraw();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [redraw]);

  // The palette shows itself once on arrival, then gets out of the way — the
  // same first-run gesture the app makes.
  useEffect(() => {
    const show = setTimeout(() => setPaletteOpen(true), 900);
    // On touch it stays put — retracting it would leave no way to get it back.
    const hide = setTimeout(() => {
      if (!coarseRef.current) setPaletteOpen(false);
    }, 4200);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  // Drawing input is bound natively rather than through React. iOS Safari will
  // claim a touch drag as a page pan and fire pointercancel unless the very
  // first move is preventDefault-ed, and that only works on a non-passive
  // listener — which React's delegated handlers do not guarantee.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const pointAt = (clientX, clientY) => {
      const rect = wrap.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const begin = (clientX, clientY) => {
      drawingRef.current = true;
      setHasDrawn(true);
      const { tool: t, color: c, width: w } = settings.current;
      currentRef.current = {
        tool: t,
        color: c,
        width: w,
        points: [pointAt(clientX, clientY)],
      };
      redraw();
    };

    const extend = (clientX, clientY) => {
      const shape = currentRef.current;
      if (!drawingRef.current || !shape) return;
      const point = pointAt(clientX, clientY);
      if (shape.tool === "pen" || shape.tool === "marker") {
        shape.points.push(point);
      } else {
        shape.points = [shape.points[0], point];
      }
      redraw();
    };

    // A cancelled pointer still keeps its stroke: throwing away what someone
    // just drew because the browser changed its mind is the worse outcome.
    const finish = () => {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      const shape = currentRef.current;
      currentRef.current = null;
      if (shape && shape.points.length > 0) shapesRef.current.push(shape);
      redraw();
    };

    const cleanups = [];

    if (typeof window !== "undefined" && window.PointerEvent) {
      const onDown = (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        e.preventDefault();
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch {
          // Capture is an optimisation; the window-level fallbacks still work.
        }
        begin(e.clientX, e.clientY);
      };
      const onMove = (e) => {
        if (!drawingRef.current) return;
        e.preventDefault();
        // Coalesced moves recover the samples the compositor batched away,
        // which is most of what makes a fast stroke look smooth.
        const batch = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
        if (batch && batch.length) {
          for (const ev of batch) extend(ev.clientX, ev.clientY);
        } else {
          extend(e.clientX, e.clientY);
        }
      };
      const onUp = (e) => {
        if (!drawingRef.current) return;
        e.preventDefault();
        finish();
      };

      canvas.addEventListener("pointerdown", onDown, { passive: false });
      canvas.addEventListener("pointermove", onMove, { passive: false });
      canvas.addEventListener("pointerup", onUp, { passive: false });
      canvas.addEventListener("pointercancel", onUp, { passive: false });
      window.addEventListener("pointerup", finish);
      cleanups.push(() => {
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointercancel", onUp);
        window.removeEventListener("pointerup", finish);
      });
    } else {
      // Touch fallback for engines without Pointer Events.
      const touchStart = (e) => {
        if (e.touches.length !== 1) return;
        e.preventDefault();
        begin(e.touches[0].clientX, e.touches[0].clientY);
      };
      const touchMove = (e) => {
        if (!drawingRef.current) return;
        e.preventDefault();
        extend(e.touches[0].clientX, e.touches[0].clientY);
      };
      const touchEnd = (e) => {
        e.preventDefault();
        finish();
      };
      const mouseDown = (e) => {
        if (e.button !== 0) return;
        begin(e.clientX, e.clientY);
      };
      const mouseMove = (e) => extend(e.clientX, e.clientY);

      canvas.addEventListener("touchstart", touchStart, { passive: false });
      canvas.addEventListener("touchmove", touchMove, { passive: false });
      canvas.addEventListener("touchend", touchEnd, { passive: false });
      canvas.addEventListener("touchcancel", touchEnd, { passive: false });
      canvas.addEventListener("mousedown", mouseDown);
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", finish);
      cleanups.push(() => {
        canvas.removeEventListener("touchstart", touchStart);
        canvas.removeEventListener("touchmove", touchMove);
        canvas.removeEventListener("touchend", touchEnd);
        canvas.removeEventListener("touchcancel", touchEnd);
        canvas.removeEventListener("mousedown", mouseDown);
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", finish);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [redraw]);

  // Hover-only affordances have to be replaced on touch, where there is no
  // pointer to park at the edge — every move is already a stroke.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const apply = () => {
      coarseRef.current = mq.matches;
      setCoarse(mq.matches);
      if (mq.matches) setPaletteOpen(true);
    };
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Left-edge reveal, mirroring the overlay's trigger strip. Fine pointers only.
  const onHoverMove = (event) => {
    if (coarseRef.current || drawingRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    if (event.clientX - rect.left < 56) {
      setPaletteOpen(true);
      clearTimeout(hideTimer.current);
    }
  };

  const clearAll = () => {
    shapesRef.current = [];
    currentRef.current = null;
    setHasDrawn(false);
    redraw();
  };

  const undo = () => {
    shapesRef.current.pop();
    redraw();
  };

  const scheduleHide = () => {
    if (coarseRef.current) return;
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setPaletteOpen(false), 900);
  };

  return (
    <div
      ref={wrapRef}
      onPointerMove={onHoverMove}
      className="skribble-surface relative h-[60vh] min-h-[420px] w-full cursor-crosshair touch-none select-none overflow-hidden rounded-3xl"
    >
      {/* touchAction has to sit on the canvas, not only the wrapper: it is not
          inherited, and the canvas is what the touch actually lands on. Without
          it iOS treats the first drag as a page pan and cancels the stroke. */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{
          touchAction: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
          WebkitTouchCallout: "none",
        }}
      />

      {/* Prompt, which retires the moment it is no longer true. */}
      <div
        className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${
          hasDrawn ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="skribble-gradient-text text-center text-5xl font-black leading-tight lg:text-4xl md:text-3xl">
          Go on. Draw on it.
        </p>
        <p className="mt-3 max-w-md text-center text-base font-medium text-white/55 md:text-sm">
          This is a real drawing surface, running in your browser. The app does
          exactly this — on top of every window you have open.
        </p>
      </div>

      {/* Edge hint, the same affordance the overlay's trigger strip provides.
          Pointless on touch, where there is no hovering pointer to catch. */}
      {!coarse && (
        <div
          className={`pointer-events-none absolute left-0 top-0 h-full w-14 transition-opacity duration-300 ${
            paletteOpen ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="skribble-edge-strip absolute left-0 top-1/2 h-28 w-1.5 -translate-y-1/2 rounded-r-full" />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 rotate-180 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 [writing-mode:vertical-rl]">
            tools
          </span>
        </div>
      )}

      {/* Touch equivalent: a real button, since the edge trigger cannot fire. */}
      {coarse && !paletteOpen && (
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="absolute left-3 top-3 z-10 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white backdrop-blur-xl"
        >
          Tools
        </button>
      )}

      {/* The palette itself — a scaled-down twin of the app's sidebar.
          The Y centring has to live in the same inline transform as the slide:
          an inline transform replaces the class one outright, so a Tailwind
          -translate-y-1/2 here would be silently dropped and the panel would
          hang off the bottom of the clipped surface. */}
      <div
        onPointerEnter={() => clearTimeout(hideTimer.current)}
        onPointerLeave={scheduleHide}
        style={{
          transform: paletteOpen ? "translate(0, -50%)" : "translate(-130%, -50%)",
        }}
        className="absolute left-3 top-1/2 z-10 max-h-[calc(100%-1.5rem)] overflow-y-auto rounded-2xl border border-white/15 bg-black/70 p-2.5 backdrop-blur-xl transition-transform duration-300 ease-out"
      >
        {coarse && (
          <button
            type="button"
            onClick={() => setPaletteOpen(false)}
            aria-label="Hide tools"
            className="mb-2 flex h-7 w-full items-center justify-center rounded-lg text-white/60 hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 6 9 12l6 6" />
            </svg>
          </button>
        )}

        <div className="grid grid-cols-2 gap-1.5">
          {DEMO_TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              title={t.label}
              aria-label={t.label}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                tool === t.id ? "bg-white text-black" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill={t.id === "arrow" || t.id === "rect" || t.id === "ellipse" ? "none" : "currentColor"} stroke="currentColor" strokeWidth={t.id === "pen" || t.id === "marker" ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
                <path d={t.d} />
              </svg>
            </button>
          ))}
        </div>

        <div className="my-2 h-px bg-white/15" />

        <div className="grid grid-cols-3 gap-1.5">
          {PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={`Colour ${c}`}
              style={{ background: c }}
              className={`h-5 w-5 rounded-md transition ${
                color === c ? "ring-2 ring-white ring-offset-2 ring-offset-black" : ""
              }`}
            />
          ))}
        </div>

        <div className="my-2 h-px bg-white/15" />

        <div className="flex items-center justify-center gap-1.5">
          {[3, 6, 12].map((w) => (
            <button
              key={w}
              onClick={() => setWidth(w)}
              aria-label={`${w} point stroke`}
              className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
                width === w ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <span
                className="block rounded-full bg-white"
                style={{ width: w + 2, height: w + 2 }}
              />
            </button>
          ))}
        </div>

        <div className="my-2 h-px bg-white/15" />

        <div className="flex justify-center gap-1.5">
          <button
            onClick={undo}
            title="Undo"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 14 4 9l5-5" />
              <path d="M4 9h11a5 5 0 0 1 0 10h-3" />
            </svg>
          </button>
          <button
            onClick={clearAll}
            title="Clear"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Decorative pieces
 * ------------------------------------------------------------------ */

function Aurora({ still }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={`skribble-blob skribble-blob-1 ${still ? "" : "skribble-animate"}`} />
      <div className={`skribble-blob skribble-blob-2 ${still ? "" : "skribble-animate"}`} />
      <div className={`skribble-blob skribble-blob-3 ${still ? "" : "skribble-animate"}`} />
      <div className="skribble-grain absolute inset-0" />
    </div>
  );
}

/** A stroke that draws itself, the way the app draws one. */
function SelfDrawing({
  d,
  stroke,
  width = 8,
  delay = 0,
  duration = 1.2,
  opacity = 1,
  ...rest
}) {
  const ref = useRef(null);
  const [length, setLength] = useState(null);
  const [drawn, setDrawn] = useState(false);

  // The stroke is drawn by animating stroke-dashoffset over the path's real
  // measured length, rather than through framer-motion's pathLength. Safari —
  // iOS Safari in particular — does not reliably render that, which left every
  // annotation here invisible on iPhone while the rest of the figure appeared.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof el.getTotalLength !== "function") return;

    let total;
    try {
      total = el.getTotalLength();
    } catch {
      return; // Leave it drawn rather than risk hiding it.
    }
    if (!total || !Number.isFinite(total)) return;

    const still =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (still) return;

    setLength(total);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          // A frame between applying the offset and clearing it, or the
          // transition has nothing to interpolate from.
          requestAnimationFrame(() => setDrawn(true));
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [d]);

  // Until it has been measured the path renders complete. A stroke whose
  // animation never runs has to still be a stroke — failing to invisible is
  // what made this break silently in the first place.
  const dash =
    length == null
      ? null
      : {
          strokeDasharray: length,
          strokeDashoffset: drawn ? 0 : length,
          transition: `stroke-dashoffset ${duration}s ease-in-out ${delay}s`,
        };

  return (
    <path
      ref={ref}
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
      style={dash || undefined}
      {...rest}
    />
  );
}

/**
 * The explainer: an abstract desktop, with annotations landing on top of it in
 * sequence. Deliberately abstract shapes — it is about the gesture, not about
 * impersonating any particular application.
 */
function AnnotatedDesktop() {
  return (
    <svg viewBox="0 0 800 460" className="w-full" role="img" aria-label="Annotations being drawn over a desktop window">
      <defs>
        <linearGradient id="sk-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1430" />
          <stop offset="100%" stopColor="#120d24" />
        </linearGradient>
        <linearGradient id="sk-bar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b359ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1a8cff" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* the "desktop" */}
      <rect x="20" y="20" width="760" height="420" rx="18" fill="url(#sk-screen)" stroke="#ffffff18" />
      <rect x="20" y="20" width="760" height="44" rx="18" fill="#ffffff08" />
      <circle cx="52" cy="42" r="6" fill="#ff5f57" />
      <circle cx="74" cy="42" r="6" fill="#febc2e" />
      <circle cx="96" cy="42" r="6" fill="#28c840" />

      {/* abstract window content */}
      <rect x="52" y="96" width="200" height="12" rx="6" fill="#ffffff22" />
      <rect x="52" y="124" width="320" height="12" rx="6" fill="#ffffff14" />
      <rect x="52" y="152" width="260" height="12" rx="6" fill="#ffffff14" />
      <rect x="52" y="200" width="330" height="180" rx="12" fill="#ffffff0a" stroke="#ffffff14" />
      <rect x="72" y="224" width="140" height="10" rx="5" fill="#ffffff1c" />
      <rect x="72" y="248" width="220" height="10" rx="5" fill="#ffffff12" />
      <rect x="72" y="272" width="180" height="10" rx="5" fill="#ffffff12" />
      <rect x="420" y="200" width="308" height="180" rx="12" fill="#ffffff0a" stroke="#ffffff14" />
      <rect x="446" y="330" width="120" height="32" rx="8" fill="url(#sk-bar)" />
      <rect x="446" y="226" width="180" height="10" rx="5" fill="#ffffff1c" />
      <rect x="446" y="250" width="240" height="10" rx="5" fill="#ffffff12" />

      {/* the annotations, arriving in order */}
      <SelfDrawing
        d="M430 316 q80 -26 160 -4 q34 10 26 34 q-10 28 -96 30 q-92 2 -96 -26 q-3 -22 26 -32"
        stroke="#e52126"
        width={5}
        delay={0.15}
      />
      <SelfDrawing
        d="M690 160 C 660 210, 640 270, 606 322"
        stroke="#ffd600"
        width={5}
        delay={0.75}
      />
      {/* Arrowhead barbs. The shaft arrives heading down-left, so both barbs
          have to point back up-right, mirrored about that direction — one of
          them used to run down-right, i.e. forward, which drew a broken V. */}
      <SelfDrawing d="M606 322 L 636 306" stroke="#ffd600" width={5} delay={1.25} duration={0.3} />
      <SelfDrawing d="M606 322 L 610 288" stroke="#ffd600" width={5} delay={1.25} duration={0.3} />

      <SelfDrawing
        d="M64 100 L 250 100"
        stroke="#33e6d9"
        width={22}
        delay={1.1}
        opacity={0.28}
      />
      <SelfDrawing
        d="M52 400 q120 -34 250 -8"
        stroke="#b359ff"
        width={5}
        delay={1.5}
      />

      <motion.text
        x="600"
        y="140"
        fill="#ffd600"
        fontSize="26"
        fontWeight="700"
        fontFamily="var(--font-mont), system-ui"
        initial={{ opacity: 0, y: 150 }}
        whileInView={{ opacity: 1, y: 140 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4, delay: 1.5 }}
      >
        click this one
      </motion.text>
    </svg>
  );
}

function GlowCard({ title, accent, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay }}
      className="skribble-card group relative overflow-hidden rounded-3xl p-7"
      style={{ "--glow": accent }}
    >
      <div className="skribble-card-glow" />
      <div className="relative">
        <h3 className="text-2xl font-extrabold text-white md:text-xl">{title}</h3>
        <div className="mt-3 text-base font-medium leading-relaxed text-white/60 md:text-sm">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function Key({ children }) {
  return (
    <kbd className="mx-0.5 inline-block rounded-md border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[13px] text-white">
      {children}
    </kbd>
  );
}

const MARQUEE_TOOLS = [
  "pencil", "highlighter", "line", "arrow", "rectangle", "rounded rect",
  "ellipse", "triangle", "star", "fill bucket", "text", "eraser", "select",
];

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function Skribble() {
  const [release, setRelease] = useState(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.github.com/repos/GeroWalther/skribble/releases/latest")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((data) => {
        const dmg = (data.assets || []).find((a) => a.name.endsWith(".dmg"));
        if (!cancelled && dmg) {
          setRelease({
            url: dmg.browser_download_url,
            version: data.tag_name,
            downloads: dmg.download_count,
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const downloadHref = release?.url || RELEASES_URL;

  return (
    <>
      <Head>
        <title>Skribble — Draw on your Mac&apos;s screen | GW-InTech</title>
        <meta
          name="description"
          content="A macOS paint app with shapes, arrows and a fill bucket — and a mode that turns your entire screen into a canvas, so you can draw on top of anything to explain it. Free and open source."
        />
        <meta name="theme-color" content={INK} />
        <meta property="og:title" content="Skribble — Draw on your Mac's screen" />
        <meta
          property="og:description"
          content="Paint app plus a transparent overlay for annotating anything on screen. Free, open source, exports PNG, JPEG and vector PDF."
        />
        <meta
          property="og:image"
          content="https://www.gw-intech.com/images/projects/skribble-card.png"
        />
      </Head>

      <div className="relative w-full overflow-hidden" style={{ background: INK }}>
        <Aurora still={reduced} />

        <div className="relative mx-auto w-full max-w-6xl px-8 pb-24 pt-10 md:px-5">
          {/* ------------------------- hero ------------------------- */}
          <section className="flex flex-col items-center pb-12 text-center">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-7 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/70 backdrop-blur"
            >
              macOS · free · open source
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="max-w-4xl text-7xl font-black leading-[0.95] tracking-tight text-white xl:text-6xl lg:text-5xl md:text-4xl"
              style={{ textWrap: "balance" }}
            >
              Your screen is
              <span className="relative mx-3 inline-block">
                <span className="skribble-gradient-text">the canvas</span>
                <svg
                  viewBox="0 0 300 26"
                  className="absolute -bottom-3 left-0 w-full"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <SelfDrawing
                    d="M4 17 C 60 4, 110 24, 168 12 C 216 2, 258 16, 296 8"
                    stroke="#ffd600"
                    width={7}
                    delay={0.5}
                    duration={1}
                  />
                </svg>
              </span>
              <br />
              not just a window.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-9 max-w-2xl text-lg font-medium leading-relaxed text-white/60 md:text-base"
            >
              Skribble is a paint app with everything you expect — shapes,
              arrows, a fill bucket, text. Then you press{" "}
              <Key>⌃⌥⌘D</Key> and the app disappears, leaving you free to draw
              on top of <em className="not-italic text-white">anything</em> on
              your Mac. Circle the button. Arrow the bug. Cross out the bad
              paragraph.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex items-center gap-5 sm:flex-col sm:gap-3"
            >
              <Link href={downloadHref} target="_blank" className="skribble-cta">
                <span>Download for macOS</span>
              </Link>
              <Link
                href={REPO_URL}
                target="_blank"
                className="rounded-xl border border-white/20 px-7 py-4 text-lg font-bold text-white transition hover:bg-white/10 md:text-base"
              >
                Read the source
              </Link>
            </motion.div>

            <p className="mt-5 font-mono text-sm text-white/40">
              {release
                ? `${release.version} · macOS 14+ · Apple silicon · ${release.downloads} download${release.downloads === 1 ? "" : "s"}`
                : "macOS 14 or later · Apple silicon"}
            </p>
          </section>

          {/* --------------------- the live demo --------------------- */}
          <section className="pb-20">
            <InkCanvas />
            <p className="mt-4 text-center text-sm font-medium text-white/40">
              Push your pointer to the left edge of that panel — the tools slide
              out, exactly as they do on your desktop.
            </p>
          </section>

          {/* ------------------- draw on screen ------------------- */}
          <section className="pb-24">
            <div className="grid grid-cols-2 items-center gap-14 lg:grid-cols-1 lg:gap-10">
              <div>
                <span className="text-sm font-black uppercase tracking-[0.2em] text-[#ffd600]">
                  the whole point
                </span>
                <h2 className="mt-4 text-5xl font-black leading-tight text-white lg:text-4xl md:text-3xl">
                  Stop saying{" "}
                  <span className="skribble-strike">“the button on the left”</span>
                </h2>
                <p className="mt-6 text-lg font-medium leading-relaxed text-white/60 md:text-base">
                  Draw the circle instead. One shortcut puts a transparent layer
                  over every display you own — your apps keep running
                  underneath, untouched. Annotate a spreadsheet mid-call, mark
                  up a design without opening a design tool, or teach someone
                  where to click by actually pointing at it.
                </p>
                <ul className="mt-8 flex flex-col gap-4">
                  {[
                    ["Click-through", "Keep scrolling and clicking the apps beneath while your marks float on top."],
                    ["Every display", "One layer spans all your screens, so you never lose the pen halfway across."],
                    ["Dim the room", "Drop the brightness behind your annotations when you are presenting."],
                    ["Keep it", "Save as a transparent PNG or PDF, or bake it onto a screenshot."],
                  ].map(([title, body], i) => (
                    <motion.li
                      key={title}
                      initial={{ opacity: 0, x: -14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="flex items-start gap-4"
                    >
                      <span
                        className="mt-1.5 h-3 w-3 flex-none rounded-sm"
                        style={{ background: PALETTE[i % PALETTE.length] }}
                      />
                      <span className="text-base font-medium text-white/60 md:text-sm">
                        <strong className="font-bold text-white">{title}.</strong>{" "}
                        {body}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="skribble-screen rounded-3xl p-3">
                <AnnotatedDesktop />
              </div>
            </div>
          </section>

          {/* ---------------------- tool marquee ---------------------- */}
          <section className="pb-24">
            <div className="skribble-marquee relative overflow-hidden rounded-2xl border border-white/10 py-5">
              <div className={`flex w-max gap-4 ${reduced ? "" : "skribble-marquee-track"}`}>
                {[...MARQUEE_TOOLS, ...MARQUEE_TOOLS].map((t, i) => (
                  <span
                    key={`${t}-${i}`}
                    className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-5 py-2 text-base font-bold text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* ------------------------ features ------------------------ */}
          <section className="pb-24">
            <h2 className="mb-10 text-center text-5xl font-black text-white lg:text-4xl md:text-3xl">
              Everything you&apos;d expect.{" "}
              <span className="skribble-gradient-text">Nothing you wouldn&apos;t.</span>
            </h2>
            <div className="grid grid-cols-3 gap-6 lg:grid-cols-1">
              <GlowCard title="Draw properly" accent="#1a8cff" delay={0}>
                Pencil, highlighter, line, arrow, rectangle, rounded rectangle,
                ellipse, triangle, star, text. Hold <Key>⇧</Key> to lock lines
                to 45° and boxes to squares.
              </GlowCard>
              <GlowCard title="Fill anything" accent="#ffd600" delay={0.08}>
                Grab the bucket and click inside any shape — outline or middle,
                filled or not. <Key>⌥</Key>-click clears it again. Click bare
                canvas to repaint the whole page.
              </GlowCard>
              <GlowCard title="Export sharp" accent="#4dd94d" delay={0.16}>
                PNG and JPEG at 2×, and{" "}
                <strong className="font-bold text-white">true vector PDF</strong>{" "}
                — because everything is vector, nothing softens when you scale
                it.
              </GlowCard>
              <GlowCard title="Undo everything" accent="#b359ff" delay={0}>
                Two hundred levels of history, covering shapes, fills and the
                page colour. Select, drag, resize from the handles, delete.
              </GlowCard>
              <GlowCard title="Stays out of the way" accent="#33e6d9" delay={0.08}>
                Lives in your menu bar. Global shortcuts work from any app. No
                Screen Recording permission unless you save a screenshot.
              </GlowCard>
              <GlowCard title="Yours to read" accent="#ff66b3" delay={0.16}>
                A few thousand lines of Swift, no dependencies, MIT-spirited and
                on GitHub. Build it yourself in about ten seconds.
              </GlowCard>
            </div>
          </section>

          {/* ---------------------- shortcuts ---------------------- */}
          <section className="pb-24">
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-6">
                <h3 className="text-2xl font-extrabold text-white md:text-xl">
                  From anywhere
                </h3>
                <ul className="mt-5 flex flex-col gap-3 text-base font-medium text-white/60 md:text-sm">
                  <li><Key>⌃⌥⌘D</Key> start or stop drawing on screen</li>
                  <li><Key>⌃⌥⌘P</Key> let clicks through to the apps below</li>
                  <li><Key>⌃⌥⌘E</Key> wipe every annotation</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-6">
                <h3 className="text-2xl font-extrabold text-white md:text-xl">
                  While drawing
                </h3>
                <ul className="mt-5 flex flex-col gap-3 text-base font-medium text-white/60 md:text-sm">
                  <li><Key>Esc</Key> exit · <Key>⌘Z</Key> undo · <Key>⌘C</Key> copy</li>
                  <li><Key>p</Key> pencil · <Key>a</Key> arrow · <Key>f</Key> fill · <Key>t</Key> text</li>
                  <li><Key>o</Key> ellipse · <Key>r</Key> rectangle · <Key>e</Key> eraser</li>
                </ul>
              </div>
            </div>
          </section>

          {/* -------------------- installing -------------------- */}
          <section className="pb-24">
            <div className="rounded-3xl border border-[#4dd94d]/30 bg-[#4dd94d]/[0.06] p-9 md:p-6">
              <h2 className="text-3xl font-black text-white lg:text-2xl md:text-xl">
                Installing it
              </h2>
              <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-white/65 md:text-sm">
                Open the disk image, drag Skribble to your Applications folder,
                and launch it. That is the whole procedure.
              </p>
              <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-white/65 md:text-sm">
                It is signed with a Developer ID,{" "}
                <strong className="font-bold text-white">
                  notarized by Apple and stapled
                </strong>
                , so macOS verifies it on the way in and opens it without a
                warning — offline too, since the notarization ticket ships
                inside the app rather than being fetched.
              </p>
              <p className="mt-7 text-base font-medium text-white/65 md:text-sm">
                Or build it from source, which takes about ten seconds and pulls
                in no dependencies:
              </p>
              <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-5 font-mono text-sm text-[#4dd94d]">
{`git clone https://github.com/GeroWalther/skribble.git
cd skribble && ./build.sh --run`}
              </pre>
            </div>
          </section>

          {/* ------------------------- close ------------------------- */}
          <section className="flex flex-col items-center pb-10 text-center">
            <h2 className="max-w-3xl text-6xl font-black leading-tight text-white lg:text-5xl md:text-3xl">
              Go draw on <span className="skribble-gradient-text">something</span>.
            </h2>
            <div className="mt-9 flex items-center gap-5 sm:flex-col sm:gap-3">
              <Link href={downloadHref} target="_blank" className="skribble-cta">
                <span>Download for macOS</span>
              </Link>
              <Link
                href={ISSUES_URL}
                target="_blank"
                className="rounded-xl border border-white/20 px-7 py-4 text-lg font-bold text-white transition hover:bg-white/10 md:text-base"
              >
                Tell me what&apos;s broken
              </Link>
            </div>
          </section>
        </div>
      </div>

      <style jsx global>{`
        .skribble-gradient-text {
          background: linear-gradient(
            100deg,
            #ffd600 0%,
            #ff66b3 28%,
            #b359ff 52%,
            #1a8cff 74%,
            #33e6d9 100%
          );
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: skribble-pan 9s ease-in-out infinite;
        }

        @keyframes skribble-pan {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .skribble-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.5;
        }
        .skribble-blob-1 {
          width: 46vw;
          height: 46vw;
          top: -14vw;
          left: -10vw;
          background: radial-gradient(circle, #7c1fd4, transparent 68%);
        }
        .skribble-blob-2 {
          width: 40vw;
          height: 40vw;
          top: 24vw;
          right: -12vw;
          background: radial-gradient(circle, #d41f86, transparent 68%);
        }
        .skribble-blob-3 {
          width: 38vw;
          height: 38vw;
          bottom: -8vw;
          left: 24vw;
          background: radial-gradient(circle, #1f6bd4, transparent 68%);
        }
        .skribble-animate.skribble-blob-1 {
          animation: skribble-float-a 22s ease-in-out infinite;
        }
        .skribble-animate.skribble-blob-2 {
          animation: skribble-float-b 26s ease-in-out infinite;
        }
        .skribble-animate.skribble-blob-3 {
          animation: skribble-float-a 30s ease-in-out infinite reverse;
        }

        @keyframes skribble-float-a {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(6vw, 5vw, 0) scale(1.16);
          }
        }
        @keyframes skribble-float-b {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1.1);
          }
          50% {
            transform: translate3d(-7vw, 4vw, 0) scale(0.92);
          }
        }

        /* Fine noise stops the big gradients from banding on wide displays. */
        .skribble-grain {
          opacity: 0.055;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .skribble-surface {
          background: radial-gradient(
              120% 120% at 50% 0%,
              rgba(255, 255, 255, 0.07),
              transparent 60%
            ),
            rgba(10, 6, 22, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 30px 90px -30px rgba(179, 89, 255, 0.55),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(6px);
        }

        .skribble-edge-strip {
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(255, 255, 255, 0.5),
            transparent
          );
          animation: skribble-pulse 2.4s ease-in-out infinite;
        }
        @keyframes skribble-pulse {
          0%,
          100% {
            opacity: 0.35;
          }
          50% {
            opacity: 1;
          }
        }

        .skribble-cta {
          position: relative;
          display: inline-block;
          border-radius: 0.75rem;
          padding: 1rem 2rem;
          font-size: 1.125rem;
          font-weight: 800;
          color: #1a0b2e;
          background: linear-gradient(100deg, #ffd600, #ff66b3, #b359ff, #33e6d9);
          background-size: 250% 100%;
          animation: skribble-pan 7s ease-in-out infinite;
          box-shadow: 0 12px 40px -10px rgba(255, 102, 179, 0.7);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .skribble-cta:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 18px 52px -10px rgba(255, 102, 179, 0.85);
        }

        .skribble-card {
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: border-color 0.3s ease, transform 0.3s ease;
        }
        .skribble-card:hover {
          transform: translateY(-4px);
          border-color: var(--glow);
        }
        .skribble-card-glow {
          position: absolute;
          inset: -40% 40% 60% -40%;
          background: radial-gradient(circle, var(--glow), transparent 65%);
          opacity: 0;
          filter: blur(50px);
          transition: opacity 0.35s ease;
          pointer-events: none;
        }
        .skribble-card:hover .skribble-card-glow {
          opacity: 0.45;
        }

        .skribble-screen {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 40px 100px -40px rgba(26, 140, 255, 0.6);
        }

        /* A struck-through phrase, drawn rather than typeset. */
        .skribble-strike {
          position: relative;
          white-space: nowrap;
        }
        .skribble-strike::after {
          content: "";
          position: absolute;
          left: -2%;
          right: -2%;
          top: 52%;
          height: 6px;
          border-radius: 3px;
          background: #e52126;
          transform: rotate(-1.6deg);
          box-shadow: 0 0 18px rgba(229, 33, 38, 0.7);
        }

        .skribble-marquee {
          background: rgba(255, 255, 255, 0.03);
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 8%,
            black 92%,
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            black 8%,
            black 92%,
            transparent
          );
        }
        .skribble-marquee-track {
          animation: skribble-scroll 26s linear infinite;
        }
        @keyframes skribble-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .skribble-gradient-text,
          .skribble-cta,
          .skribble-blob,
          .skribble-edge-strip,
          .skribble-marquee-track {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}
