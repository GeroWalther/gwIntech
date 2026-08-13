import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import shotAsk from "../../public/images/eyeguide/01.png";
import shotLeak from "../../public/images/eyeguide/02.png";
import shotLive from "../../public/images/eyeguide/03.png";
import shotError from "../../public/images/eyeguide/04.png";
import shotPorts from "../../public/images/eyeguide/05.png";

const APP_STORE_URL =
  "https://apps.apple.com/app/id6791673680";
const PRIVACY_URL = "/app-privacy-policy";
const FEEDBACK_MAIL =
  "mailto:office@gw-intech.com?subject=EyeGuide%20AI%20feedback";

// EyeGuide's identity is the violet of its app icon and the blue it draws the
// on-screen marker in, so the page is built from those rather than the site
// palette — the same approach the other product pages take.
const BG = "#0b0817";
const PANEL = "#141029";
const LINE = "#272050";
const TEXT = "#ece9f7";
const MUTED = "#9d97bd";
const ACCENT = "#2199fa";
const BTN_BG = "#ffffff";
const BTN_INK = "#14103a";
const CHIP_BG = "rgba(255, 255, 255, 0.05)";
const CHIP_LINE = "#312a5c";

// The icon's gradient as two soft glows over the base colour, so the page reads
// as the same product rather than as a generic dark page.
const APP_BACKGROUND = [
  "radial-gradient(1100px 620px at 85% -10%, rgba(126, 87, 255, 0.20), transparent 60%)",
  "radial-gradient(900px 560px at -5% 105%, rgba(33, 153, 250, 0.16), transparent 62%)",
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
      background: accent ? "rgba(33, 153, 250, 0.10)" : PANEL,
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

const Shot = ({ src, alt, priority = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5 }}
    className="overflow-hidden rounded-2xl border border-solid"
    style={{ borderColor: LINE }}
  >
    <Image
      src={src}
      alt={alt}
      className="h-auto w-full"
      sizes="(max-width: 767px) 90vw, (max-width: 1200px) 45vw, 380px"
      priority={priority}
    />
  </motion.div>
);

export default function EyeGuide() {
  const primaryBtn =
    "rounded-lg px-8 py-4 text-lg font-semibold shadow-lg transition hover:brightness-95 md:text-base";
  const ghostBtn =
    "rounded-lg border border-solid px-8 py-4 text-lg font-semibold transition md:text-base";

  return (
    <>
      <Head>
        <title>
          EyeGuide AI — an AI that sees what you are fixing | GW-InTech
        </title>
        <meta
          name="description"
          content="Point your iPhone at whatever you are fixing and EyeGuide watches through the camera, answers out loud and marks the exact part to touch next. Ask mode for quick questions, Live mode for hands-free coaching. On the App Store."
        />
        <meta name="theme-color" content={BG} />
        <meta
          property="og:title"
          content="EyeGuide AI — an AI that sees what you are fixing"
        />
        <meta
          property="og:description"
          content="A dripping tap, a car engine, a dishwasher throwing an error code. Point the camera, ask out loud, get the exact next step — with a marker on the part itself."
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
                iOS app · on the App Store
              </span>

              <h1
                className="max-w-4xl font-mono text-6xl font-semibold leading-tight tracking-tight xl:text-5xl lg:text-4xl md:text-3xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                It sees what you see, and tells you what to do next.
              </h1>

              <p
                className="mt-6 max-w-2xl text-lg font-medium md:text-base"
                style={{ color: MUTED }}
              >
                Point your phone at whatever you are working on — a dripping
                tap, a car engine, a dishwasher throwing an error code — and ask
                out loud. EyeGuide looks through the camera, answers in one
                short step, and draws a marker on the exact part you should
                touch next.
              </p>

              <div className="mt-9 flex items-center gap-6 sm:flex-col sm:gap-4">
                <Link
                  href={APP_STORE_URL}
                  target="_blank"
                  className={primaryBtn}
                  style={{ background: BTN_BG, color: BTN_INK }}
                >
                  Download on the App Store
                </Link>
                <Link
                  href="/projects"
                  className={ghostBtn}
                  style={{ borderColor: LINE, color: TEXT }}
                >
                  See other projects
                </Link>
              </div>

              <p
                className="mt-5 font-mono text-sm font-medium"
                style={{ color: MUTED }}
              >
                iPhone · iOS 18+ · 7-day free trial · No account needed
              </p>
            </section>

            {/* ---------------- screenshots ---------------- */}
            <section className="w-full pb-20 md:pb-12">
              <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 md:grid-cols-1 md:gap-8">
                <Shot
                  src={shotAsk}
                  alt="EyeGuide marking the yellow dipstick loop in a car engine bay while answering how to check the oil"
                  priority
                />
                <Shot
                  src={shotLeak}
                  alt="EyeGuide marking the hose connection on a leaking shower mixer and explaining how to fix it"
                />
                <Shot
                  src={shotLive}
                  alt="EyeGuide in Live mode, talking through an engine job hands-free"
                />
                <Shot
                  src={shotError}
                  alt="EyeGuide reading an E0 error code on an induction hob and explaining what it means"
                />
                <Shot
                  src={shotPorts}
                  alt="EyeGuide marking the correct HDMI port on the back of a television"
                />
              </div>
            </section>

            {/* ---------------- the two modes ---------------- */}
            <section className="mx-auto w-full max-w-6xl">
              <h2
                className="mb-3 text-center font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                Two ways to use it
              </h2>
              <p
                className="mx-auto mb-10 max-w-3xl text-center text-lg font-medium md:text-base"
                style={{ color: MUTED }}
              >
                One for the quick question you already know how to phrase, one
                for the job where your hands are busy and you would rather just
                talk.
              </p>

              <div className="grid grid-cols-2 gap-6 md:grid-cols-1">
                <Card title="Ask — point, ask, get the step">
                  Hold the mic and ask out loud, or type. EyeGuide reads a
                  single frame, answers in under forty words, and rings the
                  object you should act on. Vision keeps tracking that object as
                  you move the phone, so the marker stays on the part rather
                  than drifting off it.
                </Card>
                <Card title="Live — a conversation, hands-free" accent>
                  Camera and microphone stream continuously and it talks back in
                  real time, like a video call with someone looking over your
                  shoulder. Made for the longer jobs, where stopping to hold the
                  phone and phrase a question is the thing slowing you down.
                </Card>
              </div>
            </section>

            {/* ---------------- why ---------------- */}
            <section className="mx-auto w-full max-w-6xl pt-20 md:pt-12">
              <h2
                className="mb-3 text-center font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                Better than a paused video
              </h2>
              <p
                className="mx-auto mb-10 max-w-3xl text-center text-lg font-medium md:text-base"
                style={{ color: MUTED }}
              >
                A tutorial was filmed on somebody else&apos;s appliance, in
                somebody else&apos;s kitchen, and you are the one squinting at
                it with wet hands. EyeGuide is looking at yours.
              </p>

              <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 md:grid-cols-1">
                <Card title="It points at the actual part">
                  Not a description of where the valve is — a ring drawn on your
                  valve, in your bathroom, that stays put while you move.
                </Card>
                <Card title="It reads what is in front of it">
                  Error codes on a control panel, markings on a dipstick, which
                  of three identical ports is the one you want. Things a search
                  cannot answer without you knowing what to type.
                </Card>
                <Card title="It knows when to stop">
                  Mains electricity, gas, brakes and airbags get a warning and a
                  recommendation to call a professional. It is a coach, not a
                  substitute for someone qualified.
                </Card>
                <Card title="One step at a time">
                  Deliberately terse. You get the next thing to do, not a
                  fifteen-point plan to memorise while holding a wrench.
                </Card>
                <Card title="Not just repairs">
                  DIY, electronics and soldering, flat-pack assembly, bikes,
                  cooking. Anything where the question is easier to point at
                  than to describe.
                </Card>
                <Card title="No account, and the key is not in the app" accent>
                  Nothing to sign up for. Requests go through a backend that
                  holds the AI credentials server-side rather than shipping them
                  in the binary, and nothing is kept to build a profile of you —{" "}
                  <Link
                    href={PRIVACY_URL}
                    className="underline underline-offset-4"
                    style={{ color: ACCENT }}
                  >
                    the privacy policy
                  </Link>{" "}
                  says exactly what is sent where.
                </Card>
              </div>
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
                    It is not a qualified tradesperson. On anything genuinely
                    dangerous it will say so and tell you to call one, and you
                    should.
                  </li>
                  <li>
                    It needs to see the thing. There is no offline mode — the
                    camera frame and your question go to a model and come back
                    as an answer, so a connection is required.
                  </li>
                  <li>
                    The on-screen marker is an Ask-mode feature. Live mode talks
                    you through the job but does not draw on the picture yet.
                  </li>
                  <li>
                    iPhone only, iOS 18 and later. Live minutes are metered by
                    plan; Ask is unlimited on every plan. Something off?{" "}
                    <a
                      href={FEEDBACK_MAIL}
                      className="underline underline-offset-4"
                      style={{ color: ACCENT }}
                    >
                      Email me
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
                Stop describing the problem. Show it.
              </h2>
              <div className="mt-8 flex items-center gap-6 sm:flex-col sm:gap-4">
                <Link
                  href={APP_STORE_URL}
                  target="_blank"
                  className={primaryBtn}
                  style={{ background: BTN_BG, color: BTN_INK }}
                >
                  Download on the App Store
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
