import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";
import HireMe from "@/components/HireMe";
import tecnoArt from "../../public/images/hero/tecno.jpg";
import {
  Ambient,
  INK,
  GradientText,
  LINE,
  MINT,
  MUTED,
  Pill,
  Reveal,
  SpotlightCard,
  Stat,
  TEXT,
} from "@/components/fx/Ambient";

const PARAGRAPHS = [
  "I am Gero Walther. I work as a full-stack software engineer at a Japanese software company, and take on freelance work under GW-InTech. I build for the web, for iOS, and increasingly for the desktop — and I ship things rather than leaving them as prototypes.",
  "Keeping up is the part of this work I enjoy most. I started in React and Node and have kept moving since: Rust and Tauri for the desktop, Swift and SwiftUI for native Mac and iOS, C++ when a problem calls for it, and the current generation of AI models wired into products that people actually use. Most of what is on this site is something I had not built before I built it, and that is deliberate — a stack you stopped adding to is a stack that is quietly ageing.",
  "So the proof is the work rather than the adjectives. AI Box is a native macOS app built with Tauri, Rust and React. Skribble is a Mac paint app in SwiftUI and AppKit that also draws straight over your live screen. Dungeon Monsters is a roguelike in C++ you install through Homebrew. The storefronts take real money through Stripe, with EU and international shipping, transactional mail that actually sends, and an admin behind them.",
  "Before Japan I was at Hubspire, a New York company, working in JavaScript and React and later in their React Native department, where I took several projects from inception through to release. I have spent most of my career in international teams, working in an agile way.",
  "For freelance work I take on web and mobile builds, native Mac apps and commerce — a single feature or the whole thing, including the parts nobody enjoys: code signing and notarization, App Store review, payments, and the mail that has to arrive. If you have something in mind, get in touch.",
];

const SKILL_GROUPS = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "Swift", "Rust", "Python", "C++", "HTML", "CSS"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "React Native", "SwiftUI", "TailwindCSS", "Framer Motion", "Zustand", "ShadCN", "Sass"],
  },
  {
    title: "Backend & Data",
    items: ["Node.js", "Express", "GraphQL", "tRPC", "Prisma", "MongoDB", "Supabase", "PlanetScale", "Firebase"],
  },
  {
    title: "Platform & Tooling",
    items: ["Docker", "AWS", "Vercel", "Stripe", "Electron", "Tauri", "Clerk", "NextAuth", "OpenAI"],
  },
];

export default function About() {
  return (
    <>
      <Head>
        <title>About — GW-InTech</title>
        <meta
          name="description"
          content="Gero Walther — full-stack software engineer at a Japanese software company, freelancing as GW-InTech. Native Mac and iOS apps, web platforms and Stripe commerce, built in TypeScript, Swift, Rust and React."
        />
        <meta name="theme-color" content="#f5f6fa" />
      </Head>

      <Ambient>
        <Layout className="!bg-transparent pt-10">
          <div className="mx-auto w-full max-w-6xl">
            {/* ---------------- header ---------------- */}
            <section className="py-14 md:py-8">
              <Reveal>
                <Pill>About · Full-stack engineer · Based in Europe</Pill>
              </Reveal>
              <Reveal delay={0.06}>
                <h1
                  className="mt-6 max-w-4xl font-mono text-6xl font-semibold leading-[1.08] tracking-tight xl:text-5xl lg:text-4xl md:text-3xl"
                  style={{ textWrap: "balance" }}
                >
                  <GradientText className="gw-shimmer">Passion fuels purpose</GradientText>
                </h1>
              </Reveal>
            </section>

            {/* ---------------- bio + portrait ---------------- */}
            <section className="grid grid-cols-8 gap-12 pb-16 lg:gap-8 md:grid-cols-1 md:pb-10">
              <div className="col-span-5 md:col-span-1">
                <Reveal>
                  <h2
                    className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em]"
                    style={{ color: MINT }}
                  >
                    Who you would be working with
                  </h2>
                </Reveal>
                {PARAGRAPHS.map((p, i) => (
                  <Reveal key={i} delay={i * 0.05}>
                    <p
                      className="mb-5 text-base font-medium leading-relaxed md:text-sm"
                      style={{ color: MUTED }}
                    >
                      {p}
                    </p>
                  </Reveal>
                ))}
              </div>

              <div className="col-span-3 self-start md:col-span-1">
                <Reveal delay={0.12}>
                  <SpotlightCard className="p-4">
                    <Image
                      src={tecnoArt}
                      alt="Tech art by Maximalfocus"
                      className="h-auto w-full rounded-xl"
                      priority
                      sizes="(max-width:767px) 100vw, 37vw"
                    />
                    <Link href="https://www.instagram.com/maximalfocus/" target="_blank">
                      <p
                        className="pt-3 text-center text-sm font-medium underline underline-offset-4"
                        style={{ color: MINT }}
                      >
                        Art by @Maximalfocus
                      </p>
                    </Link>
                  </SpotlightCard>
                </Reveal>
              </div>
            </section>

            {/* ---------------- numbers ---------------- */}
            <section className="pb-20 md:pb-12">
              <Reveal>
                <SpotlightCard className="flex items-center justify-around gap-8 p-10 md:flex-col md:items-start md:p-7">
                  <Stat value={60} suffix="+" label="Clients satisfied" />
                  <Stat value={100} suffix="+" label="Projects" />
                  <Stat value={25} suffix="+" label="Languages & frameworks" />
                </SpotlightCard>
              </Reveal>
            </section>

            {/* ---------------- skills ---------------- */}
            <section className="pb-20 md:pb-12">
              <Reveal>
                <h2
                  className="font-mono text-4xl font-semibold tracking-tight lg:text-3xl md:text-2xl"
                  style={{ color: TEXT }}
                >
                  What I work with
                </h2>
                <p className="mt-3 max-w-2xl text-base font-medium md:text-sm" style={{ color: MUTED }}>
                  Not a list of things I once read about — these are the tools
                  behind the projects on this site.
                </p>
              </Reveal>

              <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-1">
                {SKILL_GROUPS.map((g, i) => (
                  <Reveal key={g.title} delay={i * 0.07}>
                    <SpotlightCard className="h-full p-7 md:p-6">
                      <h3
                        className="font-mono text-xs font-bold uppercase tracking-[0.15em]"
                        style={{ color: MINT }}
                      >
                        {g.title}
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {g.items.map((s) => (
                          <span
                            key={s}
                            className="rounded-lg border border-solid px-3 py-1.5 text-sm font-medium"
                            style={{ borderColor: LINE, color: TEXT }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </SpotlightCard>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ---------------- closing ---------------- */}
            <section className="pb-24 md:pb-14">
              <Reveal>
                <SpotlightCard className="flex items-center justify-between gap-8 p-12 lg:flex-col lg:items-start lg:p-8">
                  <div>
                    <h2
                      className="max-w-xl font-mono text-3xl font-semibold leading-tight tracking-tight md:text-2xl"
                      style={{ color: TEXT, textWrap: "balance" }}
                    >
                      Want to see the work rather than read about it?
                    </h2>
                    <p className="mt-3 max-w-xl text-base font-medium md:text-sm" style={{ color: MUTED }}>
                      Every project is downloadable, live, or open on GitHub.
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-4">
                    <Link
                      href="/projects"
                      className="rounded-xl px-7 py-3.5 text-base font-semibold transition md:text-sm"
                      style={{ background: MINT, color: INK }}
                    >
                      See the projects
                    </Link>
                    <Link
                      href="mailto:office@gw-intech.com"
                      className="rounded-xl border border-solid px-7 py-3.5 text-base font-semibold transition md:text-sm"
                      style={{ borderColor: LINE, color: TEXT }}
                    >
                      Get in touch
                    </Link>
                  </div>
                </SpotlightCard>
              </Reveal>
            </section>
          </div>
        </Layout>
        <HireMe top={true} />
      </Ambient>
    </>
  );
}
