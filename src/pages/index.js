import AnimatedTxt from '@/components/AnimatedTxt';
import HireMe from '@/components/HireMe';
import Layout from '@/components/Layout';
import { SkillsLogos } from '@/components/SkillsLogos';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import birne from '../../public/images/hero/birne.jpeg';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home - GW-InTech</title>
        <meta
          name='description'
          content='GW-InTech Official Website - Home Explore Solutions, Check out the Languages and Frameworks I am using'
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
                  href='/solutions'
                  className='flex items-center bg-dark text-light p-3.5 px-6 rounded-lg text-lg font-semibold hover:bg-slate-800 md:text-base'>
                  Explore Solutions
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
          <SkillsLogos />
        </Layout>
        <HireMe />
      </main>
    </>
  );
}
