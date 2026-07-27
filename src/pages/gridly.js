import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import shotLight from "../../public/images/projects/gridly.png";
import shotDark from "../../public/images/projects/gridly-dark.png";

// Falls back to the releases page; replaced at runtime with the exact .dmg URL
// resolved from the GitHub API, so cutting a release updates this page with no
// edit here. The same call gives us the version and download count.
const RELEASES_URL = "https://github.com/GeroWalther/gridly/releases/latest";
const REPO_URL = "https://github.com/GeroWalther/gridly";
const ISSUES_URL = "https://github.com/GeroWalther/gridly/issues/new";
const FEEDBACK_MAIL =
  "mailto:office@gw-intech.com?subject=Gridly%20feedback";

// Gridly's identity is the emerald of its app icon and the green it draws
// selections in, so the page is built from those rather than the site palette.
const BG = "#0f1714";
const PANEL = "#16211c";
const LINE = "#25352c";
const TEXT = "#e8f2ec";
const MUTED = "#93a89c";
const ACCENT = "#4ecf95";
const BTN_BG = "#ffffff";
const BTN_INK = "#0d2b1e";
const CHIP_BG = "rgba(255, 255, 255, 0.05)";
const CHIP_LINE = "#2c3f34";

// The icon's gradient as two soft glows over the base colour, so the page reads
// as the same product rather than as a generic dark page.
const APP_BACKGROUND = [
  "radial-gradient(1100px 620px at 85% -10%, rgba(52, 199, 141, 0.16), transparent 60%)",
  "radial-gradient(900px 560px at -5% 105%, rgba(9, 124, 92, 0.20), transparent 62%)",
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
      background: accent ? "rgba(78, 207, 149, 0.10)" : PANEL,
      borderColor: accent ? ACCENT : LINE,
    }}
  >
    <h3 className="text-xl font-bold md:text-lg" style={{ color: TEXT }}>
      {title}
    </h3>
    <div className="mt-2 text-base font-medium md:text-sm" style={{ color: MUTED }}>
      {children}
    </div>
  </motion.div>
);

const Mono = ({ children }) => (
  <code
    className="rounded px-1.5 py-0.5 font-mono text-[0.87em]"
    style={{ background: "rgba(78, 207, 149, 0.14)", color: TEXT }}
  >
    {children}
  </code>
);

export default function Gridly() {
  const [release, setRelease] = useState(null);

  // Resolve the current build once per visit. A failure is silent: the buttons
  // already point at the releases page, so nobody hits a dead end.
  useEffect(() => {
    let cancelled = false;
    fetch("https://api.github.com/repos/GeroWalther/gridly/releases/latest")
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
        <title>Gridly — a Mac spreadsheet that opens real Excel files | GW-InTech</title>
        <meta
          name="description"
          content="Gridly is a native macOS spreadsheet app that opens and saves real Excel files — .xlsx, .xlsm, .xls and .csv — keeping the formatting, formulas, merges and frozen panes Excel authored. Free, signed and notarized."
        />
        <meta name="theme-color" content={BG} />
        <meta
          property="og:title"
          content="Gridly — a Mac spreadsheet that opens real Excel files"
        />
        <meta
          property="og:description"
          content="Open the .xlsx someone emailed you, edit it, send it back. Formatting, formulas and layout survive the round trip. Free for macOS."
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
                macOS app · free
              </span>

              <h1
                className="max-w-4xl font-mono text-6xl font-semibold leading-tight tracking-tight xl:text-5xl lg:text-4xl md:text-3xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                The spreadsheet someone emailed you, opened properly.
              </h1>

              <p
                className="mt-6 max-w-2xl text-lg font-medium md:text-base"
                style={{ color: MUTED }}
              >
                Gridly is a native Mac spreadsheet that reads and writes real
                Excel files. Open the <Mono>.xlsx</Mono> your client sent, edit
                it, save it back — and the formatting, formulas, merged cells
                and frozen panes are still exactly where Excel left them.
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
                {release?.version ? `${release.version} · ` : ""}
                {release?.downloads > 0
                  ? `${release.downloads.toLocaleString()} downloads · `
                  : ""}
                Apple Silicon · Signed &amp; notarized · macOS 11+
              </p>
            </section>

            {/* ---------------- the screenshot ---------------- */}
            <section className="w-full pb-20 md:pb-12">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden rounded-2xl border border-solid shadow-2xl"
                style={{ borderColor: LINE }}
              >
                <Image
                  src={shotLight}
                  alt="Gridly showing a formatted quarterly forecast with formulas and a frozen header row"
                  className="h-auto w-full"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
              </motion.div>
            </section>

            {/* ---------------- why ---------------- */}
            <section className="mx-auto w-full max-w-6xl">
              <h2
                className="mb-3 text-center font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                Every other option loses something
              </h2>
              <p
                className="mx-auto mb-10 max-w-3xl text-center text-lg font-medium md:text-base"
                style={{ color: MUTED }}
              >
                Numbers reflows the layout and exports something that is not
                quite the file you were sent. The free web viewers want an
                upload before they will show you a column of numbers. And a
                Microsoft 365 seat is a subscription for the two spreadsheets a
                month you actually have to open.
              </p>

              <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 md:grid-cols-1">
                <Card title="It opens the real file">
                  <Mono>.xlsx</Mono>, <Mono>.xlsm</Mono>, <Mono>.xls</Mono> and{" "}
                  <Mono>.csv</Mono>. Fonts, fills, borders, number formats,
                  merged cells, frozen panes, column widths, hidden rows, sheet
                  tab colours and cross-sheet references all come through — and
                  survive being saved back out.
                </Card>
                <Card title="Formulas actually calculate">
                  A real engine underneath, not a static viewer. Edit a cell and
                  the totals move. Cached results from the original file are
                  kept, so a sheet reads correctly the instant it opens.
                </Card>
                <Card title="It is a Mac app">
                  Native window, native menus, real scrollbars and trackpad
                  momentum, system print and Save as PDF. Double-click an{" "}
                  <Mono>.xlsx</Mono> in Finder and it opens here.
                </Card>
                <Card title="Dark mode that respects the document">
                  Follows your system appearance. Colours the workbook actually
                  specifies are left alone — only ink that was written for a
                  white sheet gets remapped, so a dark sheet stays readable
                  without repainting someone else&apos;s formatting.
                </Card>
                <Card title="Editing, not just viewing">
                  Multi-cell selection, the fill handle, cut/copy/paste carrying
                  formulas and formatting, undo/redo, insert and delete rows and
                  columns, sort, find, and column resizing.
                </Card>
                <Card title="Free, and the source is open" accent>
                  No account, no subscription, no upload. The whole thing is on{" "}
                  <Link
                    href={REPO_URL}
                    target="_blank"
                    className="underline underline-offset-4"
                    style={{ color: ACCENT }}
                  >
                    GitHub
                  </Link>{" "}
                  if you want to read what it does with your files.
                </Card>
              </div>
            </section>

            {/* ---------------- dark mode ---------------- */}
            <section className="mx-auto w-full max-w-6xl pt-20 md:pt-12">
              <h2
                className="mb-3 text-center font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                The same sheet, after dark
              </h2>
              <p
                className="mx-auto mb-10 max-w-3xl text-center text-lg font-medium md:text-base"
                style={{ color: MUTED }}
              >
                The green totals and the red variances are the workbook&apos;s
                own colours, untouched. Only the black text and hairline borders
                Excel drew for a white page are lifted, so nothing disappears
                into the background.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden rounded-2xl border border-solid shadow-2xl"
                style={{ borderColor: LINE }}
              >
                <Image
                  src={shotDark}
                  alt="The same forecast in Gridly's dark mode, with the workbook's own cell colours preserved"
                  className="h-auto w-full"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
              </motion.div>
            </section>

            {/* ---------------- honest limits ---------------- */}
            <section className="mx-auto w-full max-w-4xl pt-20 md:pt-12">
              <h2
                className="mb-6 text-center font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                What it does not do
              </h2>
              <div
                className="rounded-2xl border border-solid p-6 text-base font-medium md:text-sm"
                style={{ background: PANEL, borderColor: LINE, color: MUTED }}
              >
                <ul className="flex list-disc flex-col gap-3 pl-5">
                  <li>
                    No charts, pivot tables or macros. A workbook containing
                    them opens and its data is fully editable, but those objects
                    are not shown and are not written back.
                  </li>
                  <li>
                    Legacy <Mono>.xls</Mono> and macro-enabled{" "}
                    <Mono>.xlsm</Mono> open read-only and save to an{" "}
                    <Mono>.xlsx</Mono> beside the original, so the macros in the
                    source file are never damaged.
                  </li>
                  <li>Password-protected workbooks cannot be opened.</li>
                  <li>
                    Apple Silicon only. Found something else?{" "}
                    <a
                      href={ISSUES_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4"
                      style={{ color: ACCENT }}
                    >
                      Open an issue
                    </a>{" "}
                    or{" "}
                    <a
                      href={FEEDBACK_MAIL}
                      className="underline underline-offset-4"
                      style={{ color: ACCENT }}
                    >
                      email me
                    </a>
                    .
                  </li>
                </ul>
              </div>
            </section>

            {/* ---------------- footer ---------------- */}
            <section className="flex w-full flex-col items-center py-20 text-center md:py-12">
              <h2
                className="max-w-3xl font-mono text-4xl font-semibold leading-tight md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                Open the file. Nothing moves.
              </h2>
              <div className="mt-8 flex items-center gap-6 sm:flex-col sm:gap-4">
                <Link
                  href={downloadHref}
                  target="_blank"
                  className={primaryBtn}
                  style={{ background: BTN_BG, color: BTN_INK }}
                >
                  Download for macOS
                </Link>
                <Link
                  href="/projects"
                  className={ghostBtn}
                  style={{ borderColor: LINE, color: TEXT }}
                >
                  See other projects
                </Link>
              </div>
            </section>
          </div>
        </Layout>
      </main>
    </>
  );
}
