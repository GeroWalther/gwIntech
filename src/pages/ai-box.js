import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";

// Falls back to the releases page; replaced at runtime with the exact .dmg URL
// resolved from the GitHub API, so cutting a release updates this page with no
// edit here. The same call gives us the download count.
const RELEASES_URL = "https://github.com/GeroWalther/ai-box/releases/latest";
const REPO_URL = "https://github.com/GeroWalther/ai-box";
const ISSUES_URL = "https://github.com/GeroWalther/ai-box/issues/new";
const FEEDBACK_MAIL =
  "mailto:office@gw-intech.com?subject=AI%20Box%20beta%20feedback";

// This page runs dark while the rest of the site is light, because it is a
// product page for an app people meet in dark mode. These are the app's own
// dark tokens verbatim (src/styles/tokens.css in the AI Box repo), so the page
// and the product are the same colour rather than merely similar. Copied as
// literals because this page deliberately leaves the site palette behind.
const BG = "#0d0e12"; // --bg
const PANEL = "#16181f"; // --panel
const LINE = "#272b36"; // --border
const TEXT = "#eceef3"; // --text
const MUTED = "#9096a4"; // --muted
// The app's accent is violet; on this page it reads as purple against the near
// black, which the client rejected. Buttons go white with dark blue ink — the
// strongest possible contrast on this ground — and the small accents shift from
// violet to a clear blue so nothing on the page reads purple.
const BTN_BG = "#ffffff";
const BTN_INK = "#14203a"; // dark blue, not black: keeps the blue family
const ACCENT = "#7fa0ff"; // blue, for links, rules and marks
const CHIP_BG = "rgba(255, 255, 255, 0.05)"; // the beta pill, deliberately quiet
const CHIP_LINE = "#2c3243";

// The app's dark ground is not flat — two violet radial glows sit over the base
// colour, and that is most of what makes it read as AI Box rather than as a
// generic dark page. Reproduced here exactly.
const APP_BACKGROUND = [
  "radial-gradient(1100px 620px at 82% -8%, rgba(127, 160, 255, 0.10), transparent 60%)",
  "radial-gradient(900px 560px at 0% 106%, rgba(127, 160, 255, 0.07), transparent 62%)",
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
      background: accent ? "rgba(127, 160, 255, 0.10)" : PANEL,
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

/** A genuine sequence, so the numbering carries information. */
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

const SpecRow = ({ label, children }) => (
  <tr
    className="border-b border-solid last:border-none"
    style={{ borderColor: LINE }}
  >
    <th
      scope="row"
      className="w-48 py-3 pr-6 text-left align-top font-mono text-xs font-medium uppercase tracking-widest md:w-32"
      style={{ color: MUTED }}
    >
      {label}
    </th>
    <td
      className="py-3 text-base font-medium md:text-sm"
      style={{ color: TEXT }}
    >
      {children}
    </td>
  </tr>
);

const Mono = ({ children }) => (
  <code
    className="rounded px-1.5 py-0.5 font-mono text-[0.87em]"
    style={{ background: "rgba(127, 160, 255, 0.14)", color: TEXT }}
  >
    {children}
  </code>
);

export default function AIBox() {
  const [release, setRelease] = useState(null);

  // Resolve the current build once per visit. A failure is silent: the buttons
  // already point at the releases page, so nobody hits a dead end.
  useEffect(() => {
    let cancelled = false;
    fetch("https://api.github.com/repos/GeroWalther/ai-box/releases/latest")
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
        <title>
          AI Box — Your Mac&apos;s AI workstation, from your phone | GW-InTech
        </title>
        <meta
          name="description"
          content="AI Box turns your Mac into an AI workstation — agentic chat, a writing studio, local image generation and a real terminal — and lets you drive all of it from your phone. Free macOS beta, signed and notarized."
        />
        <meta name="theme-color" content={BG} />
        <meta
          property="og:title"
          content="AI Box — Your Mac's AI workstation, from your phone"
        />
        <meta
          property="og:description"
          content="Agentic chat, writing, local image generation and a real terminal on your Mac — controlled from your phone. Your keys never leave the machine. Free macOS beta."
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
                macOS app · public beta · free
              </span>

              <h1
                className="max-w-4xl font-mono text-6xl font-semibold leading-tight tracking-tight xl:text-5xl lg:text-4xl md:text-3xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                Your Mac does the work. You just aren&apos;t there.
              </h1>

              <p
                className="mt-6 max-w-2xl text-lg font-medium md:text-base"
                style={{ color: MUTED }}
              >
                AI Box turns the Mac on your desk into an AI workstation —
                agentic chat, a writing studio, image generation and a real
                terminal — then hands you the controls on your phone. The
                machine does the work. The keys never leave it.
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
                Universal — Apple Silicon &amp; Intel · Signed &amp; notarized ·
                macOS 10.15+
              </p>

              <p
                className="mt-8 max-w-2xl rounded-r-lg border-l-2 border-solid px-5 py-4 text-left text-base font-medium md:text-sm"
                style={{
                  borderColor: ACCENT,
                  background: "rgba(127, 160, 255, 0.08)",
                  color: MUTED,
                }}
              >
                <b style={{ color: TEXT }}>This is a public beta.</b> It&apos;s
                stable enough that I use it for my own work every day, and free
                while it&apos;s in testing. What I want back is what broke, what
                confused you, and what you wish it did —{" "}
                <a
                  href={ISSUES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                  style={{ color: ACCENT }}
                >
                  open an issue
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
              </p>
            </section>

            {/* ---------------- the problem ---------------- */}
            <section className="mx-auto w-full max-w-6xl pt-8">
              <h2
                className="mb-3 text-center font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                Powerful AI is either in someone else&apos;s cloud, or chained
                to your desk
              </h2>
              <div className="mt-10 grid grid-cols-3 gap-6 lg:grid-cols-1">
                <Card title="Cloud tools see everything">
                  Your manuscript, your client&apos;s codebase, your API keys.
                  You accept someone else&apos;s content policy and retention
                  terms to get work done.
                </Card>
                <Card title="Local tools stop at the desk">
                  Running models on your own hardware fixes privacy and creates
                  a new problem: the moment you stand up, the most capable
                  computer you own goes idle.
                </Card>
                <Card title="AI Box does both" accent>
                  The Mac stays the source of truth and the only holder of
                  secrets. Your phone is a window onto it — same app, same
                  documents, over your own network. Nothing is hosted for you,
                  because nothing needs to be.
                </Card>
              </div>
            </section>

            {/* ---------------- what's inside ---------------- */}
            <section className="mx-auto mt-24 w-full max-w-6xl md:mt-16">
              <h2
                className="mb-10 text-center font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                Four tools that already know about each other
              </h2>
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-1">
                <Card title="Agentic chat">
                  Reads and edits files, searches a codebase, runs shell
                  commands, fetches pages. Every destructive step shows a diff
                  and asks first.
                </Card>
                <Card title="Writing studio">
                  Continue a passage mid-sentence, or proofread a selection and
                  accept corrections one at a time. Modes for fiction, business,
                  marketing and academic work. Version history on disk, so no
                  draft is ever really gone.
                </Card>
                <Card title="Image generation">
                  A managed ComfyUI the app installs for you — no Python setup —
                  running on your own GPU. Illustrate a scene straight from your
                  manuscript, with characters kept visually consistent.
                </Card>
                <Card title="A real terminal">
                  An actual PTY, not a command box. <Mono>vim</Mono>,{" "}
                  <Mono>top</Mono>, <Mono>claude</Mono> — from the sofa, or from
                  a train.
                </Card>
              </div>
            </section>

            {/* ---------------- setup ---------------- */}
            <section className="mx-auto mt-24 w-full max-w-4xl md:mt-16">
              <h2
                className="mb-10 text-center font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                Three steps, and one of them is optional
              </h2>
              <ul className="flex flex-col gap-6">
                <Step n={1} title="Install it">
                  Download the <Mono>.dmg</Mono> and drag it across. It&apos;s
                  signed and notarized by Apple, so it opens like any other app
                  — no right-click-to-open dance. It updates itself from then
                  on.
                </Step>
                <Step n={2} title="Point it at a model">
                  Paste an OpenRouter key to use frontier models, or install a
                  local one through Ollama from inside the app and run entirely
                  offline. Any OpenAI-compatible endpoint works too. Keys go
                  into the macOS Keychain, never a config file.
                </Step>
                <Step n={3} title="Pair your phone — optional">
                  Scan a QR code. Your phone opens the same app over your home
                  network and installs to the home screen.
                </Step>
              </ul>
            </section>

            {/* ---------------- reaching your Mac / Tailscale ---------------- */}
            <section className="mx-auto mt-24 w-full max-w-6xl md:mt-16">
              <h2
                className="mb-3 text-center font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                At home it just works. Away from home takes one more app.
              </h2>
              <p
                className="mx-auto mb-10 max-w-2xl text-center text-base font-medium md:text-sm"
                style={{ color: MUTED }}
              >
                AI Box never puts your Mac on the public internet, so how you
                reach it depends on where you are. Both routes carry the same
                pairing token, and neither opens a port to the world.
              </p>
              <div className="grid grid-cols-3 gap-6 lg:grid-cols-1">
                <Card title="On your own network — nothing to install">
                  The Mac serves the app to your Wi‑Fi. Scan the QR code in
                  Settings → Phone access and your phone is paired. That&apos;s
                  the whole setup, and it covers the sofa, the kitchen table and
                  the garden.
                </Card>
                <Card title="Anywhere else — add Tailscale">
                  Install{" "}
                  <a
                    href="https://tailscale.com/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                    style={{ color: ACCENT }}
                  >
                    Tailscale
                  </a>{" "}
                  on the Mac and on your phone, sign both into the same account,
                  and they join one private network of your own. Scan the QR
                  code again and the Mac is reachable from a train, an office,
                  another country — over an encrypted link between your two
                  devices, with nothing exposed publicly. Free for personal use.
                </Card>
                <Card title="Leave the Mac awake">
                  A sleeping Mac answers nothing. Turn on{" "}
                  <b style={{ color: TEXT }}>Away mode</b> before you leave and
                  AI Box holds the machine awake — display off, work continuing
                  — for as long as it&apos;s serving.
                </Card>
              </div>
            </section>

            {/* ---------------- how it's built ---------------- */}
            <section className="mx-auto mt-24 w-full max-w-4xl md:mt-16">
              <h2
                className="mb-3 font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                One codebase, two transports
              </h2>
              <p
                className="mb-8 text-base font-medium md:text-sm"
                style={{ color: MUTED }}
              >
                Every capability is written once against a transport layer that
                resolves at runtime to either Tauri IPC or an HTTP + WebSocket
                connection. That is why the phone isn&apos;t a cut-down
                companion app — it is the same app.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    <SpecRow label="Shell">
                      Tauri 2 — a Rust backend with the system WebView. ~17 MB
                      installed, not a bundled browser.
                    </SpecRow>
                    <SpecRow label="Interface">
                      React 19 + TypeScript. TipTap/ProseMirror for the editor,
                      xterm.js for the terminal.
                    </SpecRow>
                    <SpecRow label="Backend">
                      Rust: provider streaming with server-side cancellation,
                      PTY sessions, filesystem tools behind a path guard.
                    </SpecRow>
                    <SpecRow label="Remote">
                      An axum HTTP + WebSocket server on the Mac serving the
                      same bundle to the phone. Bearer auth, constant-time
                      comparison, fails closed.
                    </SpecRow>
                    <SpecRow label="Sync">
                      Item-level merge with tombstones. Edit the same document
                      on both devices and neither side loses work.
                    </SpecRow>
                    <SpecRow label="Distribution">
                      Universal binary, Developer ID signed, Apple-notarized,
                      with minisign-verified auto-updates.
                    </SpecRow>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ---------------- guardrails ---------------- */}
            <section
              className="mx-auto mt-24 w-full max-w-4xl rounded-3xl border border-solid p-12 md:mt-16 md:p-8"
              style={{ background: PANEL, borderColor: LINE }}
            >
              <h2
                className="font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                An agent with real access needs real limits
              </h2>
              <ul className="mt-6 flex flex-col gap-4">
                <Point>
                  <b style={{ color: TEXT }}>
                    Your API key never leaves the Mac.
                  </b>{" "}
                  The phone gets a placeholder so its interface knows a key
                  exists; the Mac injects the real one when the request goes
                  out.
                </Point>
                <Point>
                  <b style={{ color: TEXT }}>File access is jailed</b> to a
                  workspace folder you choose, with <Mono>..</Mono> traversal
                  and symlink escapes rejected in Rust, not in the interface.
                </Point>
                <Point>
                  <b style={{ color: TEXT }}>
                    Credentials are off-limits, always.
                  </b>{" "}
                  <Mono>~/.ssh</Mono>, <Mono>~/.aws</Mono>, keychains, shell
                  startup files and LaunchAgents are refused outright — and
                  turning off approval prompts does not turn this off.
                </Point>
                <Point>
                  <b style={{ color: TEXT }}>
                    The Mac approves, not the phone.
                  </b>{" "}
                  A remote request to write a file or run a command raises a
                  prompt with a diff on the desktop.
                </Point>
                <Point>
                  <b style={{ color: TEXT }}>Your words stay yours.</b> Drafts
                  are snapshotted to disk continuously, restorable, and
                  exportable to a folder you own. With a local model, nothing
                  leaves the machine at all.
                </Point>
              </ul>
              <div className="mt-8">
                <Link
                  href={downloadHref}
                  target="_blank"
                  className={primaryBtn}
                  style={{ background: BTN_BG, color: BTN_INK }}
                >
                  Get the free beta
                </Link>
              </div>
            </section>

            {/* ---------------- close ---------------- */}
            <section className="mx-auto mt-20 flex w-full max-w-2xl flex-col items-center text-center md:mt-12">
              <h2
                className="font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                Take it for a run, then tell me what broke
              </h2>
              <p
                className="mt-4 text-base font-medium md:text-sm"
                style={{ color: MUTED }}
              >
                AI Box is free during beta and never hosts your content or pays
                for inference — you choose the model and the account it bills
                to.
              </p>
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
                  href={ISSUES_URL}
                  target="_blank"
                  className="text-lg font-medium underline underline-offset-8 md:text-base"
                  style={{ color: TEXT }}
                >
                  Send feedback
                </Link>
              </div>
              <p
                className="mt-10 w-full border-t border-solid pt-6 text-sm font-medium"
                style={{ borderColor: LINE, color: MUTED }}
              >
                Designed and built by{" "}
                <Link
                  href="/"
                  className="underline underline-offset-4"
                  style={{ color: ACCENT }}
                >
                  GW‑InTech
                </Link>{" "}
                — available for work.
              </p>
            </section>
          </div>
        </Layout>
      </main>
    </>
  );
}
