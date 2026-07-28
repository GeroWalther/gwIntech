import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import birne from "../../public/images/hero/birne.jpeg";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import HireMe from "@/components/HireMe";
import { GithubIcon } from "@/components/Icons";
import { APPS, PROJECTS } from "@/data/projects";
import {
  Ambient,
  INK,
  GradientText,
  Marquee,
  MINT,
  MUTED,
  Pill,
  Reveal,
  SpotlightCard,
  Stat,
  TEXT,
  VIOLET,
  LINE,
} from "@/components/fx/Ambient";

const CAPABILITIES = [
  {
    title: "Native Mac apps",
    body: "Tauri, SwiftUI and Electron — signed, notarized and shipped from a real Developer ID, not a zip with instructions attached.",
    tags: ["Rust", "SwiftUI", "Electron"],
  },
  {
    title: "iOS in the App Store",
    body: "Swift and React Native apps that made it through review and are live on the store, not screenshots of prototypes.",
    tags: ["Swift", "React Native", "Expo"],
  },
  {
    title: "Commerce that takes money",
    body: "Storefronts with Stripe checkout, EU and international shipping, admin dashboards and transactional mail that actually sends.",
    tags: ["Next.js", "Stripe", "Prisma"],
  },
  {
    title: "AI that does something",
    body: "Agentic tooling, generation platforms and analysis backends — wired to real models and real data, with the keys kept where they belong.",
    tags: ["Claude", "OpenAI", "Python"],
  },
];

const STACK = [
  "TypeScript", "React", "Next.js", "React Native", "Swift", "Rust", "Node.js",
  "GraphQL", "tRPC", "Prisma", "MongoDB", "Supabase", "Stripe", "TailwindCSS",
  "Docker", "AWS", "Python", "Electron", "Framer Motion", "Zustand",
];

const btn =
  "rounded-xl px-7 py-3.5 text-base font-semibold transition duration-300 md:text-sm";

export default function Home() {
  const shipped = PROJECTS.length;
  const store = PROJECTS.filter((p) => p.appStore).length;
  const mac = APPS.length;

  return (
    <>
      <Head>
        <title>GW-InTech — Full-stack engineer shipping Mac apps, iOS apps and commerce</title>
        <meta
          name="description"
          content="Gero Walther builds and ships production software: signed macOS apps, App Store iOS apps, e-commerce storefronts and AI tooling. React, Next.js, Swift, Rust and React Native."
        />
        <meta name="theme-color" content="#f5f6fa" />
      </Head>

      <Ambient>
        <Layout className="!bg-transparent pt-10">
          <div className="mx-auto w-full max-w-6xl">
            {/* ---------------- hero ---------------- */}
            <section className="flex min-h-[76vh] items-center gap-16 py-10 lg:gap-10 md:min-h-0 md:flex-col md:items-start md:py-6">
              <div className="flex-1">
              <Reveal>
                <Pill>Full-stack engineer · Mac &amp; iOS · Available for work</Pill>
              </Reveal>

              <Reveal delay={0.06}>
                <h1
                  className="mt-7 max-w-4xl font-mono text-7xl font-semibold leading-[1.05] tracking-tight xl:text-6xl lg:text-5xl md:text-4xl sm:text-3xl"
                  style={{ textWrap: "balance" }}
                >
                  <GradientText className="gw-shimmer">
                    I don&apos;t just write code. I ship things people install.
                  </GradientText>
                </h1>
              </Reveal>

              <Reveal delay={0.12}>
                <p
                  className="mt-7 max-w-2xl text-lg font-medium leading-relaxed md:text-base"
                  style={{ color: MUTED }}
                >
                  Notarized Mac apps. Apps live in the App Store. Storefronts that
                  take real payments. I&apos;m Gero — I build the whole thing, from
                  the Rust binary to the Stripe webhook, and then I put my name on
                  the download button.
                </p>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Link
                    href="/projects"
                    className={btn}
                    style={{ background: TEXT, color: INK }}
                  >
                    See the work
                  </Link>
                  <Link
                    href="/solutions"
                    className={`${btn} border border-solid`}
                    style={{ borderColor: LINE, color: TEXT }}
                  >
                    Hire me for a build
                  </Link>
                  <Link
                    href="mailto:office@gw-intech.com"
                    className="text-base font-medium underline underline-offset-8 md:text-sm"
                    style={{ color: MUTED }}
                  >
                    office@gw-intech.com
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.26}>
                <div className="mt-16 flex flex-wrap gap-x-16 gap-y-8 md:mt-10 md:gap-x-10">
                  <Stat value={shipped} suffix="+" label="Projects shipped" />
                  <Stat value={store} suffix="" label="Apps in the App Store" />
                  <Stat value={mac} suffix="" label="Mac apps you can download" />
                  <Stat value={7} suffix="+" label="Years building" />
                </div>
              </Reveal>
              </div>

              {/* The lamp from the old hero, kept — it is the one piece of the
                  previous design people recognise. Here it sits in its own
                  light rather than on a white page. */}
              <Reveal delay={0.2} className="relative w-[34%] shrink-0 lg:w-[40%] md:w-full md:max-w-xs md:self-center">
                <div
                  aria-hidden
                  className="gw-halo pointer-events-none absolute inset-0 rounded-full blur-3xl"
                  style={{
                    background:
                      "var(--gw-halo)",
                  }}
                />
                <div className="gw-float relative">
                  <Image
                    src={birne}
                    alt="A lit bulb — turning an idea into something that runs"
                    className="h-auto w-full rounded-full"
                    priority
                    sizes="(max-width:767px) 80vw, 34vw"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full"
                    style={{ boxShadow: "var(--gw-vignette)", border: `1px solid ${LINE}` }}
                  />
                </div>
              </Reveal>
            </section>

            {/* ---------------- downloadable apps ---------------- */}
            <section className="py-24 md:py-14">
              <Reveal>
                <div className="flex items-end justify-between gap-6 md:flex-col md:items-start">
                  <div>
                    <Pill>Free · Signed &amp; notarized</Pill>
                    <h2
                      className="mt-5 font-mono text-4xl font-semibold tracking-tight lg:text-3xl md:text-2xl"
                      style={{ color: TEXT }}
                    >
                      Three Mac apps you can install right now
                    </h2>
                    <p className="mt-3 max-w-2xl text-base font-medium md:text-sm" style={{ color: MUTED }}>
                      Not demos. Real applications with a Developer ID signature,
                      an Apple notarization ticket and an open repository.
                    </p>
                  </div>
                  <Link
                    href="/projects"
                    className="shrink-0 text-sm font-semibold underline underline-offset-8"
                    style={{ color: MINT }}
                  >
                    All projects →
                  </Link>
                </div>
              </Reveal>

              <div className="mt-10 grid grid-cols-3 gap-6 lg:grid-cols-1">
                {APPS.map((app, i) => (
                  <Reveal key={app.title} delay={i * 0.08}>
                    <SpotlightCard className="flex h-full flex-col p-5">
                      <Link href={app.page} className="block overflow-hidden rounded-xl">
                        <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.5 }}>
                          <Image
                            src={app.img}
                            alt={app.title}
                            className="h-44 w-full rounded-xl object-cover object-top"
                            sizes="(max-width:1023px) 100vw, 33vw"
                          />
                        </motion.div>
                      </Link>

                      <span className="mt-5 text-xs font-semibold uppercase tracking-wider" style={{ color: MINT }}>
                        {app.type}
                      </span>
                      <h3 className="mt-2 text-2xl font-bold" style={{ color: TEXT }}>
                        {app.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm font-medium leading-relaxed" style={{ color: MUTED }}>
                        {app.summary.split(". ")[0]}.
                      </p>

                      <div className="mt-5 flex items-center gap-4">
                        <Link
                          href={app.page}
                          className="rounded-lg px-5 py-2.5 text-sm font-semibold transition"
                          style={{ background: TEXT, color: INK }}
                        >
                          {app.cta}
                        </Link>
                        {app.github && (
                          <Link
                            href={app.github}
                            target="_blank"
                            className="w-8 opacity-60 transition hover:opacity-100"
                            aria-label={`${app.title} on GitHub`}
                          >
                            <GithubIcon />
                          </Link>
                        )}
                      </div>
                    </SpotlightCard>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ---------------- capabilities bento ---------------- */}
            <section className="py-12 md:py-8">
              <Reveal>
                <h2
                  className="max-w-3xl font-mono text-4xl font-semibold tracking-tight lg:text-3xl md:text-2xl"
                  style={{ color: TEXT, textWrap: "balance" }}
                >
                  What I actually do
                </h2>
              </Reveal>

              <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-1">
                {CAPABILITIES.map((c, i) => (
                  <Reveal key={c.title} delay={i * 0.07}>
                    <SpotlightCard className="h-full p-7 md:p-6">
                      <h3 className="text-2xl font-bold md:text-xl" style={{ color: TEXT }}>
                        {c.title}
                      </h3>
                      <p className="mt-3 text-base font-medium leading-relaxed md:text-sm" style={{ color: MUTED }}>
                        {c.body}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {c.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-md px-2.5 py-1 font-mono text-xs font-semibold"
                            style={{ background: "var(--gw-chip-mint)", color: MINT }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </SpotlightCard>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ---------------- stack marquee ---------------- */}
            <section className="py-16 md:py-10">
              <Reveal>
                <p
                  className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{ color: MUTED }}
                >
                  The tools I reach for
                </p>
                <Marquee speed={38}>
                  {STACK.map((s, i) => (
                    <span
                      key={`${s}-${i}`}
                      className="whitespace-nowrap font-mono text-xl font-medium md:text-base"
                      style={{ color: i % 3 === 0 ? MINT : i % 3 === 1 ? VIOLET : MUTED }}
                    >
                      {s}
                    </span>
                  ))}
                </Marquee>
              </Reveal>
            </section>

            {/* ---------------- closing ---------------- */}
            <section className="py-20 md:py-12">
              <Reveal>
                <SpotlightCard className="flex items-center justify-between gap-8 p-12 lg:flex-col lg:items-start lg:p-8">
                  <div>
                    <h2
                      className="max-w-xl font-mono text-4xl font-semibold leading-tight tracking-tight lg:text-3xl md:text-2xl"
                      style={{ color: TEXT, textWrap: "balance" }}
                    >
                      Got something that needs building properly?
                    </h2>
                    <p className="mt-4 max-w-xl text-base font-medium md:text-sm" style={{ color: MUTED }}>
                      Web, mobile or desktop — from the first commit to a signed
                      binary or a store listing. Tell me what you have in mind.
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-4">
                    <Link
                      href="mailto:office@gw-intech.com"
                      className={btn}
                      style={{ background: MINT, color: INK }}
                    >
                      Start a conversation
                    </Link>
                    <Link
                      href="/solutions"
                      className={`${btn} border border-solid`}
                      style={{ borderColor: LINE, color: TEXT }}
                    >
                      What I offer
                    </Link>
                  </div>
                </SpotlightCard>
              </Reveal>
            </section>
          </div>
        </Layout>
        <HireMe />
      </Ambient>
    </>
  );
}
