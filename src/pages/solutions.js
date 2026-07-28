import React from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import { Ambient, GradientText } from "@/components/fx/Ambient";
import Image from "next/image";
import Link from "next/link";
import omnifood from "../../public/images/projects/Omnifood.png";
import shop from "../../public/images/projects/nike.png";
import rn from "../../public/images/projects/twitterExpoRouter.jpeg";
import node from "../../public/images/projects/node.png";
import devObs from "../../public/images/projects/mernDocker.webp";
import openAI from "../../public/images/projects/openAI.webp";
import AWS from "../../public/images/projects/AWSlogo.webp";
import realtimeAI from "../../public/images/projects/realtime-ai.png";
import nativeApps from "../../public/images/projects/native-apps.png";
import { motion } from "framer-motion";

const FramerImage = motion(Image);
const CONTACT = "mailto:office@gw-intech.com";

/** The technologies a card is actually built on — concrete beats adjectives. */
const Stack = ({ items }) => (
  <ul className="mt-4 flex flex-wrap gap-2">
    {items.map((t) => (
      <li
        key={t}
        className="rounded-md border border-solid border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-light/70"
      >
        {t}
      </li>
    ))}
  </ul>
);

const Solution = ({ img, title, summary, stack, className = "" }) => (
  <motion.li
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.45 }}
    className={`group flex flex-col overflow-hidden rounded-2xl gw-spot border border-solid border-white/10 bg-white/[0.035] shadow-lg transition-shadow hover:shadow-2xl ${className}`}
  >
    <div className="overflow-hidden border-b border-solid border-white/10">
      <FramerImage
        src={img}
        alt={title}
        className="h-56 w-full object-cover sm:h-44"
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.5 }}
        sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
      />
    </div>

    <div className="flex flex-1 flex-col p-7 md:p-5">
      <h3 className="text-xl font-bold leading-snug text-light md:text-lg">
        {title}
      </h3>
      <p className="mt-3 flex-1 text-sm font-medium leading-relaxed text-light/70">
        {summary}
      </p>
      {stack && <Stack items={stack} />}
      <Link
        href={CONTACT}
        className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primaryDark transition group-hover:gap-3"
      >
        Discuss your project
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  </motion.li>
);

/** One row of the "how I work" list. */
const Principle = ({ n, title, children }) => (
  <li className="flex items-start gap-5">
    <span className="mt-1 font-mono text-sm font-bold tracking-wider text-primaryDark">
      {String(n).padStart(2, "0")}
    </span>
    <div>
      <h3 className="text-lg font-bold text-light md:text-base">{title}</h3>
      <p className="mt-1 text-base font-medium text-light/70 md:text-sm">
        {children}
      </p>
    </div>
  </li>
);

const StackGroup = ({ title, items }) => (
  <div>
    <h3 className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-light/50">
      {title}
    </h3>
    <ul className="mt-3 flex flex-wrap gap-2">
      {items.map((t) => (
        <li
          key={t}
          className="rounded-lg border border-solid border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-light/80"
        >
          {t}
        </li>
      ))}
    </ul>
  </div>
);

const Solutions = () => {
  return (
    <>
      <Head>
        <title>Solutions — What I build | GW-InTech</title>
        <meta
          name="description"
          content="Full-stack web, mobile, desktop and AI engineering: realtime voice and vision assistants, AI features and automation, SaaS platforms, native apps, type-safe backends, e-commerce and cloud infrastructure. Built with React, Next.js, React Native, Swift, Rust, Node.js and AWS."
        />
      </Head>

      <Ambient>
        <Layout className="!bg-transparent pt-10">
          <div className="mx-auto w-full max-w-6xl">
            <h1
              className="mb-16 mt-4 max-w-4xl font-mono text-6xl font-semibold leading-[1.08] tracking-tight xl:text-5xl lg:text-4xl md:text-3xl sm:mb-10"
              style={{ textWrap: "balance" }}
            >
              <GradientText className="gw-shimmer">
                Solutions which make a difference
              </GradientText>
            </h1>

            {/* ---------------- positioning ---------------- */}
            <section className="mx-auto w-full max-w-4xl">
              <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.15em] text-primaryDark">
                What I do
              </h2>
              <p className="text-lg font-medium leading-relaxed text-light/80 md:text-base">
                I design and build complete products — the interface people
                touch, the API behind it, and the infrastructure it runs on. You
                brief one person rather than three agencies, and the decisions
                stay joined up from the database to the last pixel.
              </p>
              <p className="mt-4 text-base font-medium leading-relaxed text-light/70 md:text-sm">
                Much of my recent work sits where AI meets a real product: voice
                assistants that answer in under a second, apps that watch a live
                camera feed and talk a user through what they&apos;re doing, and
                automation that quietly removes work nobody wanted to do anyway.
                The rest is the craft that makes any of it worth shipping —
                type-safe code, architecture that survives its second year, and
                deployments that don&apos;t wake you up at night.
              </p>
            </section>

            {/* ---------------- capabilities ---------------- */}
            <section className="mt-20 w-full md:mt-14">
              <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.15em] text-primaryDark">
                Capabilities
              </h2>
              <p className="mb-10 max-w-3xl text-base font-medium text-light/70 md:text-sm">
                Every one of these is something I have built and put into
                production — not a service page written in the hope someone
                asks.
              </p>

              <ul className="grid grid-cols-3 gap-8 lg:grid-cols-2 md:grid-cols-1">
                <Solution
                  img={realtimeAI}
                  title="Realtime AI: voice assistants & live camera vision"
                  summary="AI that answers in the moment and can see what your user sees. Spoken conversation with sub-second latency, live camera understanding that guides someone through a task step by step, and assistants that handle conversations around the clock in any language. On-device when privacy or offline use matters; streaming cloud models when raw capability matters."
                  stack={[
                    "Realtime voice APIs",
                    "Apple Intelligence",
                    "Vision models",
                    "Streaming speech",
                    "WebSockets",
                  ]}
                />
                <Solution
                  img={openAI}
                  title="AI features & automation inside your product"
                  summary="The useful, unglamorous half of AI: retrieval over your own documents so answers cite real sources, structured extraction that turns messy input into clean records, classification and routing, and agents that take actions behind an approval gate. Built against cost and latency budgets, because a feature nobody can afford to run is not a feature."
                  stack={[
                    "OpenAI",
                    "Anthropic",
                    "RAG & vector search",
                    "Tool calling",
                    "Local models",
                  ]}
                />
                <Solution
                  img={nativeApps}
                  title="Native apps for iPhone, Mac and Android"
                  summary="Real native apps, not a website in a shell. SwiftUI where the platform matters, React Native and Expo where one codebase should serve both stores, and Tauri with a Rust core for desktop software that installs in megabytes instead of hundreds of them. Signed, notarized and shipped, with auto-updates that cryptographically verify what they install."
                  stack={[
                    "Swift / SwiftUI",
                    "React Native",
                    "Expo",
                    "Tauri + Rust",
                    "StoreKit",
                  ]}
                />
                <Solution
                  img={devObs}
                  title="Full-stack SaaS platforms"
                  summary="Your idea as a product that can actually take money: multi-tenant data, roles and permissions, subscription billing, onboarding, admin tooling, and the analytics to see what is happening. Architected so the second year of growth does not require a rewrite."
                  stack={[
                    "Next.js",
                    "React",
                    "Node.js",
                    "Stripe",
                    "Docker",
                    "PostgreSQL",
                  ]}
                />
                <Solution
                  img={node}
                  title="Type-safe backends & APIs"
                  summary="The part clients never see and always feel. End-to-end type safety from database to client, so a schema change breaks the build instead of production. Designed for real traffic, with sensible caching, honest error handling, and integrations that degrade gracefully when a third party has a bad day."
                  stack={[
                    "TypeScript",
                    "Node.js",
                    "tRPC",
                    "GraphQL",
                    "Prisma",
                    "MongoDB",
                  ]}
                />
                <Solution
                  img={shop}
                  title="E-commerce & payments"
                  summary="Storefronts that load fast and check out cleanly, with payment flows that hold up in the real world — multi-item baskets, EU and international shipping and tax, transactional email, refunds, and an admin view of orders and customers. Built to convert on a phone, because that is where the traffic is."
                  stack={[
                    "Next.js",
                    "Stripe",
                    "MongoDB",
                    "Resend",
                    "Tailwind CSS",
                  ]}
                />
                <Solution
                  img={AWS}
                  title="Cloud, DevOps & deployment"
                  summary="Infrastructure that stays boring. Containerized services, CI/CD that deploys on merge, monitoring and logging that tell you what happened before a customer does, and infrastructure as code so environments are reproducible rather than remembered. Costs reviewed, not assumed."
                  stack={[
                    "AWS (EC2, RDS, S3)",
                    "Docker",
                    "CI/CD",
                    "Vercel",
                    "Infrastructure as code",
                  ]}
                />
                <Solution
                  img={rn}
                  title="Realtime & collaborative platforms"
                  summary='Chat, live feeds, presence and notifications — anything where "refresh the page" is the wrong answer. Websocket-backed features that survive flaky mobile connections, reconnect cleanly, and keep state consistent across every device a person owns.'
                  stack={[
                    "WebSockets",
                    "Server-sent events",
                    "React Query",
                    "Zustand",
                    "Push notifications",
                  ]}
                />
                <Solution
                  img={omnifood}
                  title="Custom software, shaped to your workflow"
                  summary="The internal tool, the awkward integration, the process nobody sells software for. I start from how your business actually works, then build the smallest thing that removes the friction — clean, documented, and yours to keep."
                  stack={[
                    "Discovery",
                    "Architecture",
                    "Documentation",
                    "Clean handover",
                  ]}
                />
              </ul>
            </section>

            {/* ---------------- the toolkit ---------------- */}
            <section className="mt-24 w-full md:mt-16">
              <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.15em] text-primaryDark">
                The toolkit
              </h2>
              <p className="mb-10 max-w-3xl text-base font-medium text-light/70 md:text-sm">
                Chosen per project rather than by habit — but this is what I
                reach for, and what I can still support long after launch.
              </p>
              <div className="grid grid-cols-2 gap-10 md:grid-cols-1">
                <StackGroup
                  title="Frontend"
                  items={[
                    "React",
                    "Next.js",
                    "TypeScript",
                    "Tailwind CSS",
                    "Framer Motion",
                    "Three.js / R3F",
                    "shadcn/ui",
                  ]}
                />
                <StackGroup
                  title="Mobile & desktop"
                  items={[
                    "Swift / SwiftUI",
                    "React Native",
                    "Expo",
                    "Tauri",
                    "Rust",
                    "SwiftData",
                  ]}
                />
                <StackGroup
                  title="Backend & data"
                  items={[
                    "Node.js",
                    "Express",
                    "tRPC",
                    "GraphQL",
                    "Prisma",
                    "Drizzle",
                    "MongoDB",
                    "PostgreSQL",
                    "Supabase",
                    "Zod",
                  ]}
                />
                <StackGroup
                  title="AI"
                  items={[
                    "OpenAI",
                    "Anthropic",
                    "OpenRouter",
                    "Apple Intelligence",
                    "Local models (Ollama)",
                    "RAG & vector search",
                    "Stable Diffusion",
                  ]}
                />
                <StackGroup
                  title="Infrastructure"
                  items={[
                    "AWS",
                    "Docker",
                    "CI/CD",
                    "Vercel",
                    "Firebase",
                    "Monitoring & logging",
                  ]}
                />
                <StackGroup
                  title="Product plumbing"
                  items={[
                    "Stripe",
                    "Clerk",
                    "NextAuth",
                    "Resend",
                    "React Query",
                    "Zustand",
                    "Recharts",
                  ]}
                />
              </div>
            </section>

            {/* ---------------- how I work ---------------- */}
            <section className="mt-24 w-full rounded-3xl border border-solid border-white/10 bg-white/[0.04] p-12 md:mt-16 md:p-8">
              <h2 className="text-3xl font-bold text-light md:text-2xl">
                What working together looks like
              </h2>
              <ul className="mt-8 flex flex-col gap-7">
                <Principle n={1} title="We agree what success means first">
                  Before any code, we settle what the thing has to do and how
                  we&apos;ll know it worked. Most project failures are decided
                  in that conversation, not in the build.
                </Principle>
                <Principle n={2} title="You see it running early, and often">
                  Working software beats status reports. You get something you
                  can click within the first weeks, and it stays deployable from
                  then on — so feedback arrives while changing course is still
                  cheap.
                </Principle>
                <Principle n={3} title="I tell you when I disagree">
                  If a request will cost more than it returns, or a shortcut
                  will hurt in six months, you hear it plainly — and then we do
                  what you decide. You are paying for judgement, not agreement.
                </Principle>
                <Principle n={4} title="You own everything at the end">
                  Your code, your repositories, your cloud accounts, documented
                  well enough that another developer could pick it up tomorrow.
                  No lock-in — and I&apos;m still here when you want the next
                  phase.
                </Principle>
              </ul>
            </section>

            {/* ---------------- CTA ---------------- */}
            <section className="mt-20 flex w-full flex-col items-center text-center md:mt-14">
              <h2 className="max-w-2xl text-3xl font-bold text-light md:text-2xl">
                Have something in mind?
              </h2>
              <p className="mt-4 max-w-xl text-base font-medium text-light/70 md:text-sm">
                Tell me what you&apos;re trying to build — or what is currently
                getting in the way. I&apos;ll tell you honestly whether I&apos;m
                the right person for it, and what it would realistically take.
              </p>
              <Link
                href={CONTACT}
                className="mt-8 rounded-lg bg-dark px-8 py-4 text-lg font-semibold text-light shadow-lg transition hover:bg-primary md:text-base"
              >
                Start a conversation
              </Link>
              <p className="mt-4 text-sm font-medium text-light/50">
                office@gw-intech.com · usually a reply within a day
              </p>
            </section>
          </div>
        </Layout>
      </Ambient>
    </>
  );
};

export default Solutions;
