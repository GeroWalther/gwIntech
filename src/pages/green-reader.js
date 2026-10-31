import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import shotBreak from "../../public/images/green-reader/01.jpg";
import shotSlow from "../../public/images/green-reader/02.jpg";
import shotFast from "../../public/images/green-reader/03.jpg";
import shotLong from "../../public/images/green-reader/04.jpg";
import shotAim from "../../public/images/green-reader/05.jpg";
import shotPro from "../../public/images/green-reader/06.jpg";

const APP_STORE_URL = "https://apps.apple.com/app/id6821135986";
const PRIVACY_URL = "/green-reader-privacy";
const FEEDBACK_MAIL =
  "mailto:office@gw-intech.com?subject=Green%20Reader%20feedback";

// Green Reader's identity is the app's own theme: near-black turf, chalk text,
// the yellow of the putt line and the mint it uses for "good". The page is
// built from those rather than the site palette, like the other product pages.
const BG = "#0b1210";
const PANEL = "#101a16";
const LINE = "#1f3329";
const TEXT = "#f4f1e8";
const MUTED = "#a7ad9f";
const ACCENT = "#ffd23f";
const TURF = "#3ddc97";
const BTN_BG = ACCENT;
const BTN_INK = "#0b1210";
const CHIP_BG = "rgba(244, 241, 232, 0.05)";
const CHIP_LINE = "#2a4236";

// The onboarding's green gradient as two soft glows over the base colour.
const APP_BACKGROUND = [
  "radial-gradient(1100px 620px at 85% -10%, rgba(28, 90, 67, 0.55), transparent 60%)",
  "radial-gradient(900px 560px at -5% 105%, rgba(255, 210, 63, 0.08), transparent 62%)",
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
      background: accent ? "rgba(255, 210, 63, 0.08)" : PANEL,
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

const Step = ({ n, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.4, delay: n * 0.06 }}
    className="rounded-2xl border border-solid p-6"
    style={{ background: PANEL, borderColor: LINE }}
  >
    <span className="font-mono text-3xl font-semibold" style={{ color: ACCENT }}>
      {n}
    </span>
    <h3 className="mt-2 text-xl font-bold md:text-lg" style={{ color: TEXT }}>
      {title}
    </h3>
    <p className="mt-2 text-base font-medium md:text-sm" style={{ color: MUTED }}>
      {children}
    </p>
  </motion.div>
);

export default function GreenReader() {
  const primaryBtn =
    "rounded-lg px-8 py-4 text-lg font-semibold shadow-lg transition hover:brightness-95 md:text-base";
  const ghostBtn =
    "rounded-lg border border-solid px-8 py-4 text-lg font-semibold transition md:text-base";

  return (
    <>
      <Head>
        <title>Green Reader — see the break before you putt | GW-InTech</title>
        <meta
          name="description"
          content="Green Reader turns your iPhone Pro into an augmented-reality green reader. It maps the green with LiDAR and draws the putt line, the break and the exact point to aim at on the real grass. On the App Store."
        />
        <meta name="theme-color" content={BG} />
        <meta
          property="og:title"
          content="Green Reader — see the break before you putt"
        />
        <meta
          property="og:description"
          content="Mark the ball, mark the hole, walk the line. LiDAR maps every slope and shows exactly where to aim — adjusted for green speed and pace."
        />
      </Head>

      <main
        className="flex w-full flex-col items-center"
        style={{ background: APP_BACKGROUND }}
      >
        {/* !bg-transparent: Layout hard-codes bg-light; see the EyeGuide page. */}
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
                See the <span style={{ color: ACCENT }}>break</span> before
                you putt
              </h1>

              <p
                className="mt-6 max-w-2xl text-lg font-medium md:text-base"
                style={{ color: MUTED }}
              >
                Green Reader turns your iPhone Pro into an augmented-reality
                green reader. It maps the green with the LiDAR scanner and draws
                the putt line, the break and the exact point to aim at — right
                on the real grass.
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

              {/* Stated up front because it is the one thing that decides
                  whether the app works for you at all. */}
              <p
                className="mt-5 font-mono text-sm font-medium"
                style={{ color: MUTED }}
              >
                Requires iPhone 12 Pro or newer Pro (LiDAR) · 3 free reads · No
                account
              </p>
            </section>

            {/* ---------------- screenshots ---------------- */}
            <section className="w-full pb-20 md:pb-12">
              <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 md:grid-cols-1 md:gap-8">
                <Shot
                  src={shotBreak}
                  alt="Green Reader drawing the putt line, contour lines and slope arrows over a real green, aiming 14 cm right"
                  priority
                />
                <Shot
                  src={shotSlow}
                  alt="A putt read at a slow green speed: aim 16 cm left"
                />
                <Shot
                  src={shotFast}
                  alt="The same putt on a fast green at Stimp 14: aim 40 cm left"
                />
                <Shot
                  src={shotLong}
                  alt="A long breaking putt mapped by LiDAR across the whole green"
                />
                <Shot
                  src={shotAim}
                  alt="The aim point shown in centimetres and in cup widths"
                />
                <Shot
                  src={shotPro}
                  alt="Green Reader is made for iPhone Pro and keeps everything on the phone"
                />
              </div>
            </section>

            {/* ---------------- how it works ---------------- */}
            <section className="mx-auto w-full max-w-6xl">
              <h2
                className="mb-3 text-center font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                Four steps, about thirty seconds
              </h2>
              <p
                className="mx-auto mb-10 max-w-3xl text-center text-lg font-medium md:text-base"
                style={{ color: MUTED }}
              >
                No setup, no calibration, no course database. Walk onto any
                green and start reading.
              </p>

              <div className="grid grid-cols-4 gap-6 lg:grid-cols-2 md:grid-cols-1">
                <Step n={1} title="Mark the ball">
                  Point at it and the marker locks on, using the camera and the
                  LiDAR ground plane.
                </Step>
                <Step n={2} title="Mark the hole">
                  The cup is found automatically. You can always set it
                  yourself instead.
                </Step>
                <Step n={3} title="Walk the line">
                  The green you cover fills in as you go, sampled to the
                  centimetre.
                </Step>
                <Step n={4} title="Read the putt">
                  See your aim point, the line it rolls on, and how the putt
                  plays.
                </Step>
              </div>
            </section>

            {/* ---------------- what you see ---------------- */}
            <section className="mx-auto w-full max-w-6xl pt-20 md:pt-12">
              <h2
                className="mb-3 text-center font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                Made for real greens
              </h2>
              <p
                className="mx-auto mb-10 max-w-3xl text-center text-lg font-medium md:text-base"
                style={{ color: MUTED }}
              >
                A green&apos;s slope is one to three centimetres per metre —
                too little to see, plenty to miss by. Green Reader measures it.
              </p>

              <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 md:grid-cols-1">
                <Card title="Where to aim, exactly" accent>
                  The ideal line, curving with the green, and the aim point in
                  centimetres or inches and in cup widths.
                </Card>
                <Card title="Green speed and pace">
                  Set the Stimp and how you like to hit it — die it, ideal or
                  firm — and the line updates instantly. The same putt can mean
                  16 cm or 40 cm of break.
                </Card>
                <Card title="The shape of the green">
                  Contour lines show the terrain and slope arrows show which way
                  the ball falls, drawn on the grass where they are.
                </Card>
                <Card title="Plays-like distance">
                  Distance, plays-like distance, uphill or downhill, and the
                  slope at the hole — the numbers a caddie would give you.
                </Card>
                <Card title="Any putting green">
                  Indoors or out, putts up to 15 m (49 ft), in metres or feet.
                </Card>
                <Card title="Private by design">
                  Everything is computed on your iPhone. No account, no
                  tracking, nothing uploaded —{" "}
                  <Link
                    href={PRIVACY_URL}
                    className="underline underline-offset-4"
                    style={{ color: TURF }}
                  >
                    the privacy policy
                  </Link>{" "}
                  is short because there is little to say.
                </Card>
              </div>
            </section>

            {/* ---------------- honest limits ---------------- */}
            <section className="mx-auto w-full max-w-4xl pt-20 md:pt-12">
              <h2
                className="mb-6 text-center font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                Before you download
              </h2>
              <div
                className="rounded-2xl border border-solid p-6 text-base font-medium md:text-sm"
                style={{ background: PANEL, borderColor: LINE, color: MUTED }}
              >
                <ul className="flex list-disc flex-col gap-3 pl-5">
                  <li>
                    It needs the LiDAR scanner, so it runs on iPhone 12 Pro or a
                    newer Pro or Pro Max model only. A standard iPhone cannot
                    measure the green.
                  </li>
                  <li>
                    It is a practice tool. The Rules of Golf (Rule 4.3) do not
                    allow green-reading devices during competition rounds — use
                    it to practise and to learn to read greens yourself.
                  </li>
                  <li>
                    Your first 3 reads are free. After that, Green Reader Pro is
                    €29.99 a year or €4.99 a month for unlimited reads.
                  </li>
                  <li>
                    Putts are capped at 15 m: LiDAR sees about 4 m ahead, and
                    tracking drifts over longer walks. Something off?{" "}
                    <a
                      href={FEEDBACK_MAIL}
                      className="underline underline-offset-4"
                      style={{ color: TURF }}
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
                Stop guessing the break. Measure it.
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
