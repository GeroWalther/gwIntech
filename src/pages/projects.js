import { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import { GithubIcon } from "@/components/Icons";
import { PROJECTS, FILTERS, APPS } from "@/data/projects";
import {
  Ambient,
  INK,
  GradientText,
  MINT,
  MUTED,
  Pill,
  Reveal,
  SpotlightCard,
  TEXT,
  LINE,
} from "@/components/fx/Ambient";

const FramerImage = motion(Image);

// Where a card's title and image should point: its page on this site if it has
// one, then a live link, then the repository.
const primaryHref = (p) => p.page || p.link || p.github || "#";
const isInternal = (href) => href.startsWith("/");

const CtaLabel = (p) => p.cta || (p.appStore ? "Download on the App Store" : "Visit project");

const ProjectCard = ({ p, wide }) => {
  const href = primaryHref(p);
  const target = isInternal(href) ? undefined : "_blank";

  return (
    <SpotlightCard className={`flex h-full flex-col ${wide ? "p-6 md:p-5" : "p-5"}`}>
      <Link href={href} target={target} className="block overflow-hidden rounded-xl">
        <FramerImage
          src={p.img}
          alt={p.title}
          className={`w-full rounded-xl object-cover object-top ${wide ? "h-72 lg:h-56 md:h-44" : "h-44"}`}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.5 }}
          sizes={wide ? "(max-width:1023px) 100vw, 66vw" : "(max-width:767px) 100vw, 33vw"}
        />
      </Link>

      <span className="mt-5 text-xs font-semibold uppercase tracking-wider" style={{ color: MINT }}>
        {p.type}
      </span>

      <Link href={href} target={target}>
        <h3
          className={`mt-2 font-bold hover:underline underline-offset-4 ${wide ? "text-3xl md:text-2xl" : "text-xl"}`}
          style={{ color: TEXT }}
        >
          {p.title}
        </h3>
      </Link>

      <p
        className={`mt-2 flex-1 font-medium leading-relaxed ${wide ? "text-base md:text-sm" : "text-sm"}`}
        style={{ color: MUTED }}
      >
        {p.summary}
      </p>

      {p.brew && (
        <div className="mt-4 rounded-lg p-3 font-mono text-xs" style={{ background: "rgba(0,0,0,0.45)" }}>
          <p className="mb-1 opacity-60" style={{ color: MUTED }}>
            Install via Homebrew
          </p>
          {p.brew.map((line) => (
            <p key={line} style={{ color: MINT }}>
              {line}
            </p>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {(p.page || p.link) && (
          <Link
            href={p.page || p.link}
            target={isInternal(p.page || p.link) ? undefined : "_blank"}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold transition hover:brightness-110"
            style={{ background: p.page ? MINT : TEXT, color: INK }}
          >
            {CtaLabel(p)}
          </Link>
        )}
        {p.page && (
          <Link
            href={p.page}
            className="rounded-lg border border-solid px-5 py-2.5 text-sm font-semibold transition gw-hover-panel"
            style={{ borderColor: LINE, color: TEXT }}
          >
            Webspecial →
          </Link>
        )}
        {p.github && (
          <Link
            href={p.github}
            target="_blank"
            className="w-8 opacity-60 transition hover:opacity-100"
            aria-label={`${p.title} on GitHub`}
          >
            <GithubIcon />
          </Link>
        )}
      </div>
    </SpotlightCard>
  );
};

export default function Projects() {
  const [filter, setFilter] = useState("all");

  const shown = useMemo(
    () => (filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.kind?.includes(filter))),
    [filter]
  );

  return (
    <>
      <Head>
        <title>Projects — GW-InTech</title>
        <meta
          name="description"
          content="Shipped work by Gero Walther: notarized macOS apps, App Store iOS apps, e-commerce storefronts, AI tooling and full-stack web applications."
        />
        <meta name="theme-color" content="#f5f6fa" />
      </Head>

      <Ambient>
        <Layout className="!bg-transparent pt-10">
          <div className="mx-auto w-full max-w-6xl">
            {/* ---------------- header ---------------- */}
            <section className="py-14 md:py-8">
              <Reveal>
                <Pill>{PROJECTS.length} projects · everything shipped</Pill>
              </Reveal>
              <Reveal delay={0.06}>
                <h1
                  className="mt-6 max-w-4xl font-mono text-6xl font-semibold leading-[1.08] tracking-tight xl:text-5xl lg:text-4xl md:text-3xl"
                  style={{ textWrap: "balance" }}
                >
                  <GradientText className="gw-shimmer">Imagination trumps knowledge</GradientText>
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-6 max-w-2xl text-lg font-medium md:text-base" style={{ color: MUTED }}>
                  Desktop apps, App Store releases, storefronts taking real money
                  and AI tooling. Every one of them is either downloadable, live,
                  or open on GitHub — usually all three.
                </p>
              </Reveal>
            </section>

            {/* ---------------- the three Mac apps ---------------- */}
            <section className="pb-16 md:pb-10">
              <Reveal>
                <div
                  className="rounded-2xl border border-solid p-7 md:p-5"
                  style={{ borderColor: LINE, background: "var(--gw-chip-mint)" }}
                >
                  <div className="flex items-end justify-between gap-6 md:flex-col md:items-start">
                    <div>
                      <h2 className="font-mono text-2xl font-semibold md:text-xl" style={{ color: TEXT }}>
                        Download a Mac app
                      </h2>
                      <p className="mt-2 text-sm font-medium" style={{ color: MUTED }}>
                        Signed, notarized and free. Each has its own page here.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {APPS.map((a) => (
                        <Link
                          key={a.title}
                          href={a.page}
                          className="rounded-lg px-5 py-2.5 text-sm font-semibold transition hover:brightness-110"
                          style={{ background: MINT, color: INK }}
                        >
                          {a.title} →
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </section>

            {/* ---------------- filters ---------------- */}
            <Reveal>
              <div className="flex flex-wrap gap-3 pb-10">
                {FILTERS.map((f) => {
                  const on = filter === f.key;
                  return (
                    <button
                      key={f.key}
                      onClick={() => setFilter(f.key)}
                      className="rounded-full border border-solid px-5 py-2 text-sm font-semibold transition duration-300"
                      style={{
                        borderColor: on ? MINT : LINE,
                        background: on ? "var(--gw-chip-mint)" : "transparent",
                        color: on ? MINT : MUTED,
                      }}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </Reveal>

            {/* ---------------- grid ---------------- */}
            <section className="pb-24 md:pb-14">
              <motion.div layout className="grid grid-cols-6 gap-6 md:grid-cols-1">
                <AnimatePresence mode="popLayout">
                  {shown.map((p) => (
                    <motion.div
                      key={p.title}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className={p.featured ? "col-span-3 lg:col-span-6" : "col-span-2 lg:col-span-3"}
                    >
                      <ProjectCard p={p} wide={!!p.featured} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {shown.length === 0 && (
                <p className="py-20 text-center text-lg font-medium" style={{ color: MUTED }}>
                  Nothing in that category yet.
                </p>
              )}
            </section>
          </div>
        </Layout>
      </Ambient>
    </>
  );
}
