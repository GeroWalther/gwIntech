import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import AnimatedTxt from '@/components/AnimatedTxt';
import { motion } from 'framer-motion';

// Free public beta — point at the GitHub Releases page until the signed
// notarized build is published there.
const DOWNLOAD_URL = 'https://github.com/GeroWalther/novel-studio/releases/latest';
const BETA_MAIL =
  'mailto:office@gw-intech.com?subject=AI%20Studio%20beta&body=I%27d%20like%20to%20try%20the%20AI%20Studio%20beta.';

const Feature = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.4 }}
    className='rounded-2xl border border-solid border-dark/15 bg-white p-6 shadow-lg'>
    <h3 className='text-xl font-bold text-dark md:text-lg'>{title}</h3>
    <p className='mt-2 text-base font-medium text-dark/75 md:text-sm'>{children}</p>
  </motion.div>
);

const Point = ({ children }) => (
  <li className='flex items-start gap-3'>
    <span className='mt-2 h-2 w-2 flex-none rounded-full bg-primaryDark' />
    <span className='text-base font-medium text-dark/80 md:text-sm'>{children}</span>
  </li>
);

export default function AIStudio() {
  return (
    <>
      <Head>
        <title>AI Studio — Private AI workspace for your Mac | GW-InTech</title>
        <meta
          name='description'
          content='AI Studio is a private AI workspace for your Mac: write fiction with local, unfiltered models, generate images, run an agent on your machine, and drive it all from your phone. Free macOS beta.'
        />
      </Head>

      <main className='flex flex-col items-center text-dark w-full min-h-screen'>
        <Layout>
          {/* Hero */}
          <section className='flex flex-col items-center text-center w-full pt-6 pb-20 md:pb-12'>
            <span className='mb-6 rounded-full border border-solid border-dark/20 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-primary'>
              Private AI Studio · free macOS beta
            </span>
            <AnimatedTxt
              text='Write anything. Run anything. Privately.'
              className='!text-6xl xl:!text-5xl lg:!text-4xl md:!text-3xl max-w-4xl'
            />
            <p className='mt-6 max-w-2xl text-lg font-medium text-dark/75 md:text-base'>
              AI Studio is a full AI workspace that lives on your Mac. Write fiction with
              local, unfiltered models that never leave your machine, generate images,
              let an agent do real work on your computer — and drive all of it from your
              phone, from anywhere.
            </p>
            <div className='mt-9 flex items-center gap-6 sm:flex-col sm:gap-4'>
              <Link
                href={DOWNLOAD_URL}
                target='_blank'
                className='rounded-lg bg-dark px-8 py-4 text-lg font-semibold text-light shadow-lg transition hover:bg-slate-800 md:text-base'>
                Download for Mac
              </Link>
              <Link
                href={BETA_MAIL}
                className='text-lg font-medium text-dark underline underline-offset-8 md:text-base'>
                Join the beta
              </Link>
            </div>
            <p className='mt-5 text-sm font-medium text-dark/55'>
              Free during beta · macOS 12+ · Apple Silicon &amp; Intel · Bring your own
              API key or run 100% offline
            </p>
          </section>

          {/* What it does */}
          <section className='w-full max-w-6xl'>
            <h2 className='mb-8 text-center text-3xl font-bold text-dark md:text-2xl'>
              Everything, in one private app
            </h2>
            <div className='grid grid-cols-3 gap-6 lg:grid-cols-2 sm:grid-cols-1'>
              <Feature title='Private, unfiltered writing'>
                Draft novels and stories with fiction-tuned local models (Mistral Nemo,
                Dolphin, Gemma) — no cloud, no content filters, your manuscript never
                leaves your Mac. Prefer the cloud? Bring your OpenRouter key for Kimi,
                Fable&nbsp;5 and hundreds more.
              </Feature>
              <Feature title='A manuscript that remembers'>
                Chapter &amp; scene outline, a Story Bible for characters and canon, and
                a running “story so far” memory so the AI stays consistent across a whole
                book — plus inline Rewrite / Expand / Show-don’t-tell with one-tap undo.
              </Feature>
              <Feature title='An agent on your Mac'>
                Agentic chat that can read and edit files, run commands, and get real work
                done on your machine — with an approval gate so nothing runs without your
                say-so.
              </Feature>
              <Feature title='A real terminal — from your phone'>
                A full interactive terminal (run claude, vim, builds, anything) that lives
                on your Mac and is reachable from your phone. Survives disconnects, syncs
                across devices.
              </Feature>
              <Feature title='Local image generation'>
                One-click local Stable Diffusion via a bundled ComfyUI — generate
                illustrations for your scenes entirely on-device, or use cloud image
                models when you want.
              </Feature>
              <Feature title='Control it from anywhere'>
                Pair your phone over your Wi‑Fi or a private Tailscale network and pick up
                exactly where you left off — end-to-end encrypted, never on the public
                internet.
              </Feature>
            </div>
          </section>

          {/* Why different */}
          <section className='mt-24 w-full max-w-4xl rounded-3xl bg-dark p-12 text-light md:mt-16 md:p-8'>
            <h2 className='text-3xl font-bold md:text-2xl'>Why AI Studio is different</h2>
            <ul className='mt-6 flex flex-col gap-4'>
              <Point>
                <b>Private.</b> Local models run fully offline — your words and files stay
                on your Mac.
              </Point>
              <Point>
                <b>Unfiltered.</b> No cloud moderation on your creative work; write the
                story you actually want to write.
              </Point>
              <Point>
                <b>Yours.</b> One app for writing, images, an agent, and a terminal — and
                you can run the whole thing from your pocket.
              </Point>
            </ul>
            <div className='mt-8'>
              <Link
                href={DOWNLOAD_URL}
                target='_blank'
                className='inline-block rounded-lg bg-primaryDark px-8 py-4 text-lg font-semibold text-dark transition hover:brightness-110 md:text-base'>
                Get the free beta
              </Link>
            </div>
          </section>

          <p className='mt-10 text-center text-sm font-medium text-dark/50'>
            Built by GW‑InTech. Questions or feedback?{' '}
            <a
              href='mailto:office@gw-intech.com'
              className='underline underline-offset-4'>
              office@gw-intech.com
            </a>
          </p>
        </Layout>
      </main>
    </>
  );
}
