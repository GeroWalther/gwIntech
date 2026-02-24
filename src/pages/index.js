import AnimatedTxt from '@/components/AnimatedTxt';
import HireMe from '@/components/HireMe';
import Layout from '@/components/Layout';
import { SkillsLogos } from '@/components/SkillsLogos';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import birne from '../../public/images/hero/birne.jpeg';
import werbung from '../../public/images/mobileAppwerbung.jpeg';

import dynamic from 'next/dynamic';
const Dices = dynamic(() => import('@/components/Dices'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Home - GW-InTech</title>
        <meta
          name='description'
          content='GW-InTech Official Website - Home Explore Solutions, Check out the Languages and Frameworks I am using for mobile apps and web-developent. '
        />
      </Head>
      <main className='flex items-center text-dark w-full min-h-screen'>
        <Layout className='md:pt-12 sm:pt-6'>
          <div className='flex items-center jestify-between w-full mb-32 lg:flex-col md:mb-20'>
            <div className='w-1/3 p-5 lg:w-1/2 sm:w-full sm:px-20'>
              <Image
                src={birne}
                alt='inTech light bulb'
                className='w-full h-auto rounded-full md:inline-block md:w-full'
                priority
                sizes='(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw'
              />
            </div>

            <div className='w-2/3 flex flex-col items-center self-center lg:w-full lg:text-center'>
              <AnimatedTxt
                text='Turning Vision Into Reality With Code And Design.'
                className='lg:text-4xl md:text-3xl sm:mb-5 md:mt-10'
              />

              <p className='my-4 ml-6 lg:ml-0 px-2 text-base font-medium lg:my-10 md:text-sm md:my-3'>
                As a skilled full-stack developer, I am dedicated to turning
                ideas into innovative web and mobile applications. Explore my
                latest own projects and solutions for customers, showcasing my
                expertise in React.js, Next.js, tRPC, Prisma, Node.js,
                React-Native, GraphQL and more.
              </p>
              <div className='flex items-center self-start my-4 ml-6 lg:ml-0 px-2 lg:self-center'>
                <Link
                  href='/projects'
                  className='flex items-center bg-dark text-light p-3.5 px-6 rounded-lg text-lg font-semibold hover:bg-slate-800 md:text-base'>
                  See Projects
                  {/* <LinkArrow className={"w-4 ml-2 mb-[2px] md:w-4"} /> */}
                </Link>
                <Link
                  href='mailto:office@gw-intech.com'
                  className='ml-8 text-lg font-medium caption-top text-dark underline underline-offset-8 md:text-base'>
                  Contact
                </Link>
              </div>
            </div>
          </div>
          {/* Advertising Section */}
          <div className='w-full mb-20 -mt-6 md:mb-6 md:-mt-4'>
            <Image
              src={werbung}
              alt='advertising campaign'
              className='w-full h-auto rounded-lg shadow-lg'
              priority
              sizes='(max-width:768px) 100vw, (max-width:1200px) 100vw, 100vw'
            />
          </div>
          <div className='grid md:grid-cols-1 grid-cols-2 gap-4'>
            <div className='w-full'>
              <SkillsLogos />
            </div>
            <div className='w-full bg-emerald-600 rounded-lg'>
              <Dices />
            </div>
          </div>
          <div className='w-full flex justify-center gap-6 mt-16 md:mt-10 sm:flex-col sm:items-center sm:gap-3'>
            <Link
              href='https://scanner-downloads-public.s3.amazonaws.com/community/v0.1.0-beta.4/Security%20Scanner%20Pro-0.1.0-beta.4-arm64.dmg'
              target='_blank'
              className='text-sm font-medium text-dark/60 hover:text-dark underline underline-offset-4 transition-colors'>
              Try Security Scanner Pro for macOS (Beta)
            </Link>
            <Link
              href='https://scanner-downloads-public.s3.amazonaws.com/community/v0.1.0-beta.4/Security%20Scanner%20Pro%20Setup%200.1.0-beta.4.exe'
              target='_blank'
              className='text-sm font-medium text-dark/60 hover:text-dark underline underline-offset-4 transition-colors'>
              Try Security Scanner Pro for Windows (Beta)
            </Link>
          </div>
        </Layout>
        <HireMe />
      </main>
    </>
  );
}
