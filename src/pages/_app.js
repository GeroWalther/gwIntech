import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import '@/styles/globals.css';
import { Montserrat } from 'next/font/google';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-mont',
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Walther dev/it-services - Home</title>
        <meta
          name='description'
          content='Walther dev/it-services, portfolio - home'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='keywords'
          content='GW-InTech, JavaScript, developer, web development, mobile apps, mobile app development, full-stack, software engineer, e-commerce, React, React Native, Next.js, GraphQL, Node.js, TypeScript, TailwindCSS, MongoDB, Prisma, Stripe, trpc, Frankfurter Stock Exchange, Framer-Motion, Zustand, Yoga, Clerk, ShadCN, Zod, React-Hook-Form, react-query, context api, styled components, react-error-boundary, date-fns, recharts, react-icons, react-router, hot-toast, supabase, StepZen, Firebase, OpenAI, Next-Auth'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main
        className={`${montserrat.variable} font-mont bg-light w-full min-h-screen`}>
        <NavBar />
        <Component {...pageProps} />
      </main>
      <Footer />
      <Analytics />
    </>
  );
}
