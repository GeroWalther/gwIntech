import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";

// Falls back to the releases page; replaced at runtime with the exact .dmg URL
// resolved from the GitHub API, so cutting a release updates this page with no
// edit here. The same call gives us the version and download count.
const RELEASES_URL = "https://github.com/GeroWalther/skribble/releases/latest";
const REPO_URL = "https://github.com/GeroWalther/skribble";
const ISSUES_URL = "https://github.com/GeroWalther/skribble/issues/new";

// Skribble's own identity is the indigo → violet → magenta ramp used by its app
// icon, so the page is built from those colours rather than the site palette.
const BG = "#141225";
const PANEL = "#1d1a33";
const LINE = "#312b4f";
const TEXT = "#f1eefb";
const MUTED = "#a49dc4";
const ACCENT = "#b483ff";
const BTN_BG = "#ffffff";
const BTN_INK = "#241c42";
const CHIP_BG = "rgba(255, 255, 255, 0.05)";
const CHIP_LINE = "#3a3260";

// The icon's gradient, reproduced as two soft glows over the base colour so the
// page reads as the same product rather than as a generic dark page.
const APP_BACKGROUND = [
  "radial-gradient(1100px 620px at 85% -10%, rgba(184, 68, 140, 0.20), transparent 60%)",
  "radial-gradient(900px 560px at -5% 105%, rgba(118, 62, 184, 0.22), transparent 62%)",
  BG,
].join(", ");

const Card = ({ title, children, accent = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.4 }}
    className="rounded-2xl border border-solid p-6"
    style={{
      background: accent ? "rgba(180, 131, 255, 0.10)" : PANEL,
      borderColor: accent ? ACCENT : LINE,
    }}
  >
    <h3 className="text-xl font-bold md:text-lg" style={{ color: TEXT }}>
      {title}
    </h3>
    <div
      className="mt-2 text-base font-medium md:text-sm"
      style={{ color: MUTED }}
    >
      {children}
    </div>
  </motion.div>
);

const Point = ({ children }) => (
  <li className="flex items-start gap-3">
    <span
      className="mt-2 h-2 w-2 flex-none rounded-sm"
      style={{ background: ACCENT }}
    />
    <span className="text-base font-medium md:text-sm" style={{ color: MUTED }}>
      {children}
    </span>
  </li>
);

const Step = ({ n, title, children }) => (
  <li
    className="flex items-start gap-5 border-b border-solid pb-6 last:border-none last:pb-0"
    style={{ borderColor: LINE }}
  >
    <span
      className="mt-1 font-mono text-sm font-semibold tracking-wider"
      style={{ color: ACCENT }}
    >
      {String(n).padStart(2, "0")}
    </span>
    <div>
      <h3 className="text-lg font-bold md:text-base" style={{ color: TEXT }}>
        {title}
      </h3>
      <p
        className="mt-1 text-base font-medium md:text-sm"
        style={{ color: MUTED }}
      >
        {children}
      </p>
    </div>
  </li>
);

const Key = ({ children }) => (
  <kbd
    className="rounded-md border border-solid px-2 py-0.5 font-mono text-sm"
    style={{ borderColor: CHIP_LINE, background: CHIP_BG, color: TEXT }}
  >
    {children}
  </kbd>
);

export default function Skribble() {
  const [release, setRelease] = useState(null);

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

  const primaryBtn =
    "rounded-lg px-8 py-4 text-lg font-semibold shadow-lg transition hover:brightness-95 md:text-base";
  const ghostBtn =
    "rounded-lg border border-solid px-8 py-4 text-lg font-semibold transition md:text-base";

  return (
    <>
      <Head>
        <title>Skribble — Paint on your Mac, and draw over your screen | GW-InTech</title>
        <meta
          name="description"
          content="Skribble is a free, open-source macOS paint app with shapes, arrows and a fill bucket — and a second mode that draws straight over your live screen to explain things. Exports PNG, JPEG and vector PDF."
        />
        <meta name="theme-color" content={BG} />
        <meta
          property="og:title"
          content="Skribble — Paint on your Mac, and draw over your screen"
        />
        <meta
          property="og:description"
          content="A macOS paint app with shapes, arrows and fill — plus a transparent overlay for annotating anything on your screen. Free and open source."
        />
        <meta
          property="og:image"
          content="https://www.gw-intech.com/images/projects/skribble-card.png"
        />
      </Head>

      <main
        className="flex w-full flex-col items-center"
        style={{ background: APP_BACKGROUND }}
      >
        {/* !bg-transparent: Layout hard-codes bg-light, and two competing
            background utilities resolve by stylesheet order, not by the order
            they are written here. The important modifier removes the doubt. */}
        <Layout className="pt-16 !bg-transparent">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
            {/* ---------------- hero ---------------- */}
            <section className="flex w-full flex-col items-center pb-16 text-center md:pb-10">
              <span
                className="mb-6 rounded-full border border-solid px-4 py-1.5 text-sm font-semibold uppercase tracking-wide"
                style={{
                  borderColor: CHIP_LINE,
                  background: CHIP_BG,
                  color: MUTED,
                }}
              >
                macOS app · free · open source
              </span>

              <h1
                className="max-w-4xl font-mono text-6xl font-semibold leading-tight tracking-tight xl:text-5xl lg:text-4xl md:text-3xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                Draw on a canvas. Or draw on everything.
              </h1>

              <p
                className="mt-6 max-w-2xl text-lg font-medium md:text-base"
                style={{ color: MUTED }}
              >
                Skribble is a paint app in the spirit of the one you already
                know — shapes, arrows, a fill bucket, text. Then press one
                shortcut and the whole screen becomes your canvas, so you can
                circle the thing you are talking about instead of describing
                where it is.
              </p>

              <div className="mt-9 flex items-center gap-6 sm:flex-col sm:gap-4">
                <Link
                  href={downloadHref}
                  target="_blank"
                  className={primaryBtn}
                  style={{ background: BTN_BG, color: BTN_INK }}
                >
                  Download for macOS
                </Link>
                <Link
                  href={REPO_URL}
                  target="_blank"
                  className={ghostBtn}
                  style={{ borderColor: LINE, color: TEXT }}
                >
                  Read the source
                </Link>
              </div>

              <p
                className="mt-5 font-mono text-sm font-medium"
                style={{ color: MUTED }}
              >
                {release
                  ? `${release.version} · macOS 14+ · Apple silicon · ${release.downloads} download${
                      release.downloads === 1 ? "" : "s"
                    }`
                  : "macOS 14 or later · Apple silicon"}
              </p>
            </section>

            {/* ---------------- the two modes ---------------- */}
            <section className="w-full pb-16 md:pb-10">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-1">
                <Card title="A paint app that behaves like one">
                  <ul className="mt-3 flex flex-col gap-3">
                    <Point>
                      Pencil, highlighter, line, arrow, rectangle, rounded
                      rectangle, ellipse, triangle, star, text, eraser and
                      select.
                    </Point>
                    <Point>
                      A <strong style={{ color: TEXT }}>fill bucket</strong> —
                      click anywhere inside a shape to fill it, ⌥-click to clear
                      it, click bare canvas to repaint the page.
                    </Point>
                    <Point>
                      Hold <Key>⇧</Key> to lock lines to 45° and boxes to
                      squares. Marquee-select, drag, resize from the handles.
                    </Point>
                    <Point>
                      Exports <strong style={{ color: TEXT }}>PNG</strong>,{" "}
                      <strong style={{ color: TEXT }}>JPEG</strong> and{" "}
                      <strong style={{ color: TEXT }}>vector PDF</strong>; saves
                      as an editable .skribble file.
                    </Point>
                  </ul>
                </Card>

                <Card title="Then: the whole screen" accent>
                  <ul className="mt-3 flex flex-col gap-3">
                    <Point>
                      <Key>⌃⌥⌘D</Key> from any app drops a transparent layer over
                      every display. Draw straight onto what is there.
                    </Point>
                    <Point>
                      Push the pointer to the{" "}
                      <strong style={{ color: TEXT }}>left edge</strong> and a
                      compact palette slides in. It slides away on its own when
                      you leave it.
                    </Point>
                    <Point>
                      <strong style={{ color: TEXT }}>Click-through</strong> lets
                      clicks reach the apps underneath while your annotations
                      keep floating on top — scroll, switch tabs, keep talking.
                    </Point>
                    <Point>
                      Save the annotations as a transparent PNG or PDF, or
                      composite them onto a screenshot.
                    </Point>
                  </ul>
                </Card>
              </div>
            </section>

            {/* ---------------- first launch ---------------- */}
            <section className="w-full pb-16 md:pb-10">
              <div
                className="rounded-2xl border border-solid p-8 md:p-6"
                style={{ background: PANEL, borderColor: LINE }}
              >
                <h2
                  className="text-3xl font-bold lg:text-2xl md:text-xl"
                  style={{ color: TEXT }}
                >
                  Opening it the first time
                </h2>
                <p
                  className="mt-3 max-w-3xl text-base font-medium md:text-sm"
                  style={{ color: MUTED }}
                >
                  Skribble is signed, but it is{" "}
                  <strong style={{ color: TEXT }}>not notarized</strong> —
                  notarization needs a paid Apple Developer account. So the
                  first time you open it, macOS will refuse and say it cannot
                  verify the app is free of malware. That is Gatekeeper doing
                  its job on an unnotarized app, and it takes three clicks to
                  get past.
                </p>

                <ol className="mt-7 flex flex-col gap-6">
                  <Step n={1} title="Drag it to Applications, then open it once">
                    Double-click Skribble. The warning appears — dismiss it.
                    This step is what tells macOS the app exists.
                  </Step>
                  <Step n={2} title="System Settings → Privacy &amp; Security">
                    Scroll down to Security. There is a line about Skribble
                    being blocked, with an{" "}
                    <strong style={{ color: TEXT }}>Open Anyway</strong> button.
                    Click it.
                  </Step>
                  <Step n={3} title="Confirm">
                    Click <strong style={{ color: TEXT }}>Open</strong>. That is
                    it — macOS remembers, and Skribble opens normally from then
                    on.
                  </Step>
                </ol>

                <p
                  className="mt-7 text-base font-medium md:text-sm"
                  style={{ color: MUTED }}
                >
                  Prefer not to run an unnotarized binary? Build it yourself —
                  it takes about ten seconds and pulls in no dependencies:
                </p>
                <pre
                  className="mt-3 overflow-x-auto rounded-lg border border-solid p-4 font-mono text-sm"
                  style={{
                    background: BG,
                    borderColor: LINE,
                    color: ACCENT,
                  }}
                >
{`git clone https://github.com/GeroWalther/skribble.git
cd skribble && ./build.sh --run`}
                </pre>
              </div>
            </section>

            {/* ---------------- shortcuts ---------------- */}
            <section className="w-full pb-16 md:pb-10">
              <div className="grid grid-cols-3 gap-6 md:grid-cols-1">
                <Card title="Global">
                  <ul className="mt-3 flex flex-col gap-2">
                    <Point>
                      <Key>⌃⌥⌘D</Key> start or stop drawing on screen
                    </Point>
                    <Point>
                      <Key>⌃⌥⌘P</Key> toggle click-through
                    </Point>
                    <Point>
                      <Key>⌃⌥⌘E</Key> erase all annotations
                    </Point>
                  </ul>
                </Card>
                <Card title="While annotating">
                  <ul className="mt-3 flex flex-col gap-2">
                    <Point>
                      <Key>Esc</Key> exit · <Key>⌘Z</Key> undo
                    </Point>
                    <Point>
                      <Key>p</Key> pencil · <Key>a</Key> arrow · <Key>f</Key>{" "}
                      fill
                    </Point>
                    <Point>
                      <Key>o</Key> ellipse · <Key>r</Key> rectangle ·{" "}
                      <Key>t</Key> text
                    </Point>
                  </ul>
                </Card>
                <Card title="Good to know">
                  <ul className="mt-3 flex flex-col gap-2">
                    <Point>
                      Everything is vector, so undo, resizing and PDF export
                      stay sharp at any size.
                    </Point>
                    <Point>
                      No Screen Recording permission is needed unless you save a
                      screenshot with the annotations baked in.
                    </Point>
                  </ul>
                </Card>
              </div>
            </section>

            {/* ---------------- footer ---------------- */}
            <section className="flex w-full flex-col items-center pb-8 text-center">
              <p
                className="max-w-2xl text-base font-medium md:text-sm"
                style={{ color: MUTED }}
              >
                Free, open source, and small enough to read in an afternoon.
                Found something broken or missing?
              </p>
              <div className="mt-6 flex items-center gap-6 sm:flex-col sm:gap-4">
                <Link
                  href={ISSUES_URL}
                  target="_blank"
                  className={ghostBtn}
                  style={{ borderColor: LINE, color: TEXT }}
                >
                  Open an issue
                </Link>
                <Link
                  href={downloadHref}
                  target="_blank"
                  className={primaryBtn}
                  style={{ background: BTN_BG, color: BTN_INK }}
                >
                  Download for macOS
                </Link>
              </div>
            </section>
          </div>
        </Layout>
      </main>
    </>
  );
}
