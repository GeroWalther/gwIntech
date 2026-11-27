import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import shotChat from "../../public/images/blueberry-ai/chat.png";

const SITE_URL = "https://www.gotoblueberryai.com";
const PRICING_URL = `${SITE_URL}/#pricing`;
const CONTACT_MAIL =
  "mailto:office@gw-intech.com?subject=BlueberryChat%20AI";

// BlueberryChat AI has its own identity, zinc with a yellow accent, matching
// gotoblueberryai.com and the widget itself, so the page is built from those
// rather than the site palette, the same approach the other product pages take.
const BG = "#09090b";
const PANEL = "#141417";
const LINE = "#27272a";
const TEXT = "#fafafa";
const MUTED = "#a1a1aa";
const ACCENT = "#facc15";
const BTN_INK = "#09090b";
const CHIP_BG = "rgba(255, 255, 255, 0.05)";
const CHIP_LINE = "#3f3f46";

const APP_BACKGROUND = [
  "radial-gradient(1100px 620px at 85% -10%, rgba(250, 204, 21, 0.16), transparent 60%)",
  "radial-gradient(900px 560px at -5% 105%, rgba(99, 102, 241, 0.12), transparent 62%)",
  BG,
].join(", ");

const PLANS = [
  {
    name: "Pro",
    price: "€67",
    per: "/month",
    points: ["AI chat widget", "3,000 messages a month", "Custom branding"],
  },
  {
    name: "Max",
    price: "€199",
    per: "/month",
    points: [
      "Everything in Pro",
      "25,000 messages a month",
      "Document uploads, with OCR for scanned PDFs",
      "Priority support",
    ],
    accent: true,
  },
  {
    name: "Custom",
    price: "On request",
    per: "",
    points: [
      "Everything in Max",
      "Custom message volume and integrations",
      "Dedicated support manager and an SLA",
      "On-premise option",
    ],
  },
];

const Card = ({ title, children, accent = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.4 }}
    className="rounded-2xl border border-solid p-6"
    style={{
      background: accent ? "rgba(250, 204, 21, 0.08)" : PANEL,
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

export default function BlueberryAi() {
  const primaryBtn =
    "rounded-lg px-8 py-4 text-lg font-semibold shadow-lg transition hover:brightness-95 md:text-base";
  const ghostBtn =
    "rounded-lg border border-solid px-8 py-4 text-lg font-semibold transition md:text-base";

  return (
    <>
      <Head>
        <title>
          BlueberryChat AI — an AI chat assistant for your website | GW-InTech
        </title>
        <meta
          name="description"
          content="BlueberryChat AI answers your website visitors from your own documents and FAQs, in their language, around the clock. One script tag to embed. Plans from €67 a month."
        />
        <meta name="theme-color" content={BG} />
        <meta
          property="og:title"
          content="BlueberryChat AI — an AI chat assistant for your website"
        />
        <meta
          property="og:description"
          content="Answers from your own material, in your visitor's language, only on your domains. Serverless on Vercel with Supabase and Google Gemini."
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
            <section className="flex w-full items-center gap-14 pb-20 lg:gap-10 md:flex-col md:pb-12">
              <div className="flex flex-1 flex-col items-start md:items-center md:text-center">
                <span
                  className="mb-6 rounded-full border border-solid px-4 py-1.5 text-sm font-semibold uppercase tracking-wide"
                  style={{
                    borderColor: CHIP_LINE,
                    background: CHIP_BG,
                    color: MUTED,
                  }}
                >
                  Our own product · Subscription
                </span>

                <h1
                  className="font-mono text-6xl font-semibold leading-tight tracking-tight xl:text-5xl lg:text-4xl md:text-3xl"
                  style={{ color: TEXT, textWrap: "balance" }}
                >
                  Your website answers questions while you sleep.
                </h1>

                <p
                  className="mt-6 max-w-2xl text-lg font-medium md:text-base"
                  style={{ color: MUTED }}
                >
                  BlueberryChat AI is a chat assistant for any website. It
                  answers visitors from your own documents and FAQs, in whatever
                  language they write in, and says so honestly when something is
                  not in your material instead of making it up.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-6 md:justify-center sm:flex-col sm:gap-4">
                  <Link
                    href={PRICING_URL}
                    target="_blank"
                    className={primaryBtn}
                    style={{ background: ACCENT, color: BTN_INK }}
                  >
                    Start at gotoblueberryai.com
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
                  Try it now: the chat bubble in the corner of this page is
                  BlueberryChat AI.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="w-[38%] max-w-[400px] shrink-0 overflow-hidden rounded-2xl border border-solid lg:w-[44%] md:w-full md:max-w-[340px]"
                style={{ borderColor: LINE, boxShadow: "0 30px 90px rgba(0,0,0,0.55)" }}
              >
                <Image
                  src={shotChat}
                  alt="The BlueberryChat AI widget answering a visitor who asks whether it can reply to customers in Japanese"
                  className="h-auto w-full"
                  sizes="(max-width: 767px) 340px, 400px"
                  priority
                />
              </motion.div>
            </section>

            {/* ---------------- how it works ---------------- */}
            <section className="mx-auto w-full max-w-6xl">
              <h2
                className="mb-3 text-center font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                How it works
              </h2>
              <p
                className="mx-auto mb-10 max-w-3xl text-center text-lg font-medium md:text-base"
                style={{ color: MUTED }}
              >
                Three steps from sign-up to a working assistant, with no server
                for you to run.
              </p>

              <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 md:grid-cols-1">
                <Card title="1. Give it your material">
                  Upload PDF, Word, Excel and PowerPoint files, scanned PDFs
                  included, and add FAQs in the dashboard. The text is split
                  into passages and indexed for search.
                </Card>
                <Card title="2. Make it yours">
                  Set the assistant&apos;s name, tone, colours, welcome text and
                  default language, and list the domains it may run on.
                </Card>
                <Card title="3. Paste one script tag" accent>
                  Add the snippet to your site and the bubble appears. Each
                  question finds the most relevant passages and Google Gemini
                  writes the answer from them alone.
                </Card>
              </div>
            </section>

            {/* ---------------- why ---------------- */}
            <section className="mx-auto w-full max-w-6xl pt-20 md:pt-12">
              <h2
                className="mb-10 text-center font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                Built for real customers
              </h2>

              <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 md:grid-cols-1">
                <Card title="Answers from your material only">
                  It does not invent prices, policies or features. When the
                  answer is not in what you gave it, it says so and points to
                  your contact address.
                </Card>
                <Card title="Any language, out of the box">
                  Visitors write in their own language and get the reply in it.
                  A Japanese question finds Japanese sources directly.
                </Card>
                <Card title="Only on your domains">
                  The public key only unlocks short-lived signed tokens, and only
                  for the domains you allowed. Copying the snippet to another
                  site does not work.
                </Card>
                <Card title="Your brand, not ours">
                  Colours, name, tone, welcome text and theme all come from your
                  settings, so the bubble looks like part of your site.
                </Card>
                <Card title="A fixed monthly price">
                  Messages are counted per month against your plan&apos;s
                  limit, so the price does not change with traffic.
                </Card>
                <Card title="Nothing to maintain" accent>
                  Serverless on Vercel, with Supabase (Postgres and pgvector) for
                  knowledge and Google Gemini for answers. There is no server
                  for you to patch or keep awake.
                </Card>
              </div>
            </section>

            {/* ---------------- plans ---------------- */}
            <section className="mx-auto w-full max-w-6xl pt-20 md:pt-12">
              <h2
                className="mb-3 text-center font-mono text-3xl font-semibold md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                Plans
              </h2>
              <p
                className="mx-auto mb-10 max-w-3xl text-center text-lg font-medium md:text-base"
                style={{ color: MUTED }}
              >
                Billed monthly. Prices are in euros.
              </p>

              <div className="grid grid-cols-3 gap-6 lg:grid-cols-1">
                {PLANS.map((plan) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col rounded-2xl border border-solid p-7"
                    style={{
                      background: plan.accent ? "rgba(250, 204, 21, 0.08)" : PANEL,
                      borderColor: plan.accent ? ACCENT : LINE,
                    }}
                  >
                    <h3 className="font-mono text-xl font-semibold" style={{ color: TEXT }}>
                      {plan.name}
                    </h3>
                    <p className="mt-3 font-mono" style={{ color: TEXT }}>
                      <span className="text-4xl font-semibold md:text-3xl">{plan.price}</span>
                      <span className="text-base" style={{ color: MUTED }}>
                        {plan.per}
                      </span>
                    </p>
                    <ul
                      className="mt-5 flex flex-1 list-disc flex-col gap-2 pl-5 text-base font-medium md:text-sm"
                      style={{ color: MUTED }}
                    >
                      {plan.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              <p
                className="mx-auto mt-8 max-w-3xl text-center text-base font-medium md:text-sm"
                style={{ color: MUTED }}
              >
                Coming next: a phone assistant that answers calls with the same
                knowledge, calendar booking, and WhatsApp and email channels.
              </p>
            </section>

            {/* ---------------- footer ---------------- */}
            <section className="flex w-full flex-col items-center py-20 text-center md:py-12">
              <h2
                className="max-w-3xl font-mono text-4xl font-semibold leading-tight md:text-2xl"
                style={{ color: TEXT, textWrap: "balance" }}
              >
                Let your website do the answering.
              </h2>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:flex-col sm:gap-4">
                <Link
                  href={PRICING_URL}
                  target="_blank"
                  className={primaryBtn}
                  style={{ background: ACCENT, color: BTN_INK }}
                >
                  Start at gotoblueberryai.com
                </Link>
                <a
                  href={CONTACT_MAIL}
                  className={ghostBtn}
                  style={{ borderColor: LINE, color: TEXT }}
                >
                  office@gw-intech.com
                </a>
              </div>
            </section>
          </div>
        </Layout>
      </main>
    </>
  );
}
