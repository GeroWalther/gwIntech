import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import AnimatedTxt from '../components/AnimatedTxt';
import { GithubIcon } from '@/components/Icons';
import chirp from '../../public/images/projects/chirp3.png';
import dontforget from '../../public/images/projects/dontforget.jpeg';
import wildoasis from '../../public/images/projects/wild-oasis.png';
import threads from '../../public/images/projects/threads.png';
import polo from '../../public/images/projects/polo.png';
import moonlamp from '../../public/images/projects/moonlamp.png';
import graphQLNode from '../../public/images/projects/GraphQL_NodeJS.webp';
import justConvert from '../../public/images/projects/justConvert.jpeg';
import pluto from '../../public/images/projects/pluto-hero.png';
import misGloww from '../../public/images/projects/missGlow.png';

import node from '../../public/images/projects/node.png';
import twitter from '../../public/images/projects/twitterExpoRouter.jpeg';
import blog from '../../public/images/projects/blog.png';
import omnifood from '../../public/images/projects/Omnifood.png';
import nike from '../../public/images/projects/nike.png';
import gewitter from '../../public/images/projects/gewitter.png';
import RNAPP from '../../public/images/projects/rnapp.png';
import openAI from '../../public/images/projects/openAI.webp';
import climatic from '../../public/images/projects/climatic.png';
import { motion } from 'framer-motion';

const FramerImage = motion(Image);

const Project = ({
  title,
  type,
  img,
  link = '',
  github = '',
  summary = '',
  appStore = false,
}) => {
  return (
    <article className='w-full flex flex-col items-center justify-center rounded-2xl border border-solid border-dark bg-light p-6 relative shadow-xl sm:p-4'>
      <Link
        href={link ? link : github}
        className='w-full cursor-pointer overflow-hidden rounded-lg'
        target='_blank'>
        <FramerImage
          src={img}
          alt={title}
          className='w-full h-auto '
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          priority
          sizes='(max-width:768px) 100vw, (max-width:1200px) 50vw, 50vw'
        />
      </Link>

      <div className='w-full flex flex-col justify-between items-start mt-4'>
        <span className='text-primary font-medium text-xl lg:text-lg md:text-base'>
          {type}
        </span>
        <Link
          href={link ? link : github}
          target='_blank'
          className='hover:underline underline-offset-2'>
          <h2 className='my-2 w-full text-left text-3xl font-bold lg:text2xl'>
            {title}
          </h2>
        </Link>
        {summary && (
          <p className='my-2 font-medium text-dark sm:text-sm'>{summary}</p>
        )}
        <div className='mt-2 flex items-center justify-between'>
          <Link
            href={github}
            tarket='_blank'
            className='w-10 md:w-8'
            target='_blank'>
            <GithubIcon />
          </Link>
          {link && (
            <Link
              href={link}
              target='_blank'
              className='ml-5 rounded-lg bg-black text-light p-2 px-6 text-lg font-semibold md:text-base'>
              {appStore ? 'Download from the AppStore' : 'Visit'}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

const FeaturedProject = ({
  type,
  title,
  summary,
  img,
  link = '',
  github = '',
  appStore,
}) => {
  return (
    <article className='w-full flex items-center justify-center rounded-3xl border border-solid border-dark bg-light shadow-2xl p-12 lg:flex-col lg:p-8 xs:rounded-2xl xs:p-4 '>
      <Link
        href={link ? link : github}
        target='_blank'
        className='w-1/2 cursor-pointer overflow-hidden rounded-lg lg:w-full'>
        <FramerImage
          src={img}
          alt={title}
          className='w-full h-auto max-h-96 object-contain'
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          priority
          sizes='(max-width:768px) 100vw, (max-width:1200px) 50vw, 50vw'
        />
      </Link>

      <div className='w-1/2 flex flex-col justify-between items-start pl-6 lg:w-full lg:pl-0 lg:pt-4'>
        <span className='text-primary font-medium text-xl xs:text-base'>
          {type}
        </span>
        <Link
          href={link}
          target='_blank'
          className='hover:underline underline-offset-2'>
          <h2 className='my-2 w-full text-left text-4xl font-bold sm:text-sm'>
            {title}
          </h2>
        </Link>
        <p className='my-2 font-medium text-dark sm:text-sm'>{summary}</p>
        <div className='mt-2 flex items-center'>
          {github && (
            <Link href={github} target='_blank' className='w-10'>
              <GithubIcon />
            </Link>
          )}
          {link && (
            <Link
              href={link}
              target='_blank'
              className='ml-4 rounded-lg bg-black text-light p-2 px-6 text-lg font-semibold sm:px-4 sm:text-base'>
              {appStore ? 'Download from the AppStore' : 'Visit Project'}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

const projects = () => {
  return (
    <>
      <Head>
        <title>My Projects - GW-InTech</title>
        <meta
          name='description'
          content='GW-InTech Official Website - My Projects GW-InTech, have a look at my most recent projects and see my skills in action. Mobile apps and web-developent.'
        />
      </Head>
      <main className='w-full flex flex-col items-center justify-center'>
        <Layout className='pt-16'>
          <AnimatedTxt
            text='Imagination Trumps Knowledge'
            className='mb-16 lg:text-4xl md:text-3xl sm:mb-10 md:mt-10'
          />

          <div className='grid grid-cols-12 gap-20 gap-y-28 lg:gap-x-6 md:gap-y-10'>
            <div className='col-span-12'>
              <FeaturedProject
                title='Miss Glow'
                type='Custom Online Shop'
                img={misGloww}
                github='https://github.com/GeroWalther/missglow'
                link='https://www.missglowbeauty.com/'
                summary='This is a custom Full Stack E-commerce Online-Shop to require the needs of my aspiring customer. Including custom Admin Dashboard and easy checkout solutions. Techstack:  Next.js, Prisma, Stripe, TailwindCSS, MongoDB, Resend.'
              />
            </div>
            <div className='col-span-6 sm:col-span-12'>
              <Project
                title='Climatic'
                // type='Under Construction'
                img={climatic}
                github='https://github.com/GeroWalther/climatic'
                link='https://apps.apple.com/es/app/climatic-current-weather/id6737645840?l=en-GB'
                summary='Native iOS App written in Swift using the OpenWeatherMap API to display accurate weather. The App is available in the AppStore now for download. Check your current weather based on location tracking or search for current weather in other cities!'
                appStore={true}
              />
            </div>
            <div className='col-span-6 sm:col-span-12'>
              <Project
                title='Pluto Market'
                // type='Under Construction'
                img={pluto}
                github='https://github.com/GeroWalther/pluto'
                link='https://pluto-market.gw-intech.com/'
                summary='Modern Fullstack E-Commerce Marketplace for Digital Products using Next.js 14 with App Router, Next Auth, tRPC, TypeScript, TailwindCSS, ShadCN, Stripe for payments, MongoDB with a Prisma ORM and more. Still under construction (payments in test mode) but you can create an account and explore the App. Once it is finished, you will be able to buy and sell digital products. Have ideas to improve it? Do not hesitate and contact me.'
              />
            </div>
            <div className='col-span-12'>
              <FeaturedProject
                title='justConvert'
                type='Now Available in the AppStore.'
                img={justConvert}
                github='https://github.com/GeroWalther/justConvert'
                link='https://apps.apple.com/us/app/justconvert/id6464125917'
                summary='React Native Expo managed ios/android App using the official API from the Frankfurter Stock Exchange to precisely calculate and convert currencies. It also converts lenghts, weights, areas and volume units in an easy manner. Native Wind for styling and RevenueCat for in app purchase implemented'
                appStore={true}
              />
            </div>
            <div className='col-span-6 sm:col-span-12'>
              <Project
                title='Moonlamp Online Shop'
                summary='E-Commerce showcase example built in TypeScript, React.js, Next.js 13 with the new app router, Framer-Motion for effects, Zustand for global state management, TailwindCSS, Prisma and payments fully integrated with Stripe.'
                img={moonlamp}
                github='https://github.com/GeroWalther/moonlamp-onlineshop'
                link='https://moonlamp.gw-intech.com/'
              />
            </div>
            <div className='col-span-6 sm:col-span-12'>
              <Project
                title='GraphQL + Node API'
                summary='Backend API written in Node, using the power of GraphQL powered by Yoga and connected to MongoDB. In this project I defined a custom schema and wrote resolver functions for all CRUD operations in order to leverage the power of GraphQL.'
                img={graphQLNode}
                github='https://github.com/GeroWalther/graphQLNodejs'
              />
            </div>
            <div className='col-span-6 sm:col-span-12'>
              <Project
                title='Full Stack Threads App'
                summary='TypeScript Full Stack Threads App. Next.js 13, server and client side components, MongoDB with Mongoose and Schemas, Clerk for authentication, TailwindCSS for styling, ShadCN with Zod and React-Hook-Form for input validation etc.'
                img={threads}
                github='https://github.com/GeroWalther/threads'
                link='https://threads.gw-intech.com/'
              />
            </div>
            <div className='col-span-6 sm:col-span-12'>
              <Project
                title='The Wild Oasis'
                summary='Full Stack React App using best advanced practices like compound component pattern and a modern tech-stack: react-query, context api, styled components, react-error-boundary, date-fns, recharts, react-icons,  react-hook-form, react-router, hot-toast and supabase for the backend authentication/ authorisation/ data storage. Login using the default credentials and explore my work.'
                img={wildoasis}
                github='https://github.com/GeroWalther/world-oasis'
                link='https://wild-oasis-g.netlify.app/'
              />
            </div>

            {/* <div className='col-span-12'>
              <FeaturedProject
                title='Full Stack Threads App'
                type='Featured Project'
                img={threads}
                github='https://github.com/GeroWalther/threads'
                link='https://threads-wine.vercel.app/'
                summary='TypeScript Full Stack Threads App. Built with the brand new Next.js 13 features such as the new App Router, server and client side components, MongoDB with Mongoose and Schemas, Clerk for authentication, TailwindCSS for styling, ShadCN with Zod and React-Hook-Form for input validation etc. Check out the App!'
              />
            </div> */}
            <div className='col-span-12'>
              <FeaturedProject
                title='POLO and Lifestyle Magazine'
                type='Client Project'
                img={polo}
                link='https://poloandlifestylemagazine.com'
                summary='The official Polo and Lyfestyle Magazine website. WordPress Website for Online Magazine.'
              />
            </div>
            {/* <div className='col-span-12'>
              <FeaturedProject
                title='The Wild Oasis'
                type='Featured Project'
                img={wildoasis}
                github='https://github.com/GeroWalther/world-oasis'
                link='https://wild-oasis-g.netlify.app/'
                summary='Full Stack React App using best advanced practices like compound component pattern and a modern tech-stack: react-query, context api, styled components, react-error-boundary, date-fns, recharts, react-icons,  react-hook-form, react-router, hot-toast and supabase for the backend authentication/ authorisation/ data storage. Login using the default credentials and explore my work.'
              />
            </div> */}
            <div className='col-span-12'>
              <FeaturedProject
                title="Don't Forget! Take a Note!"
                type='Featured Project'
                img={dontforget}
                github='https://github.com/GeroWalther/dontforget-g'
                link='https://apps.apple.com/ph/app/dont-forget-take-a-note/id6450320648'
                summary="React-Native Expo App available on the Apple AppStore. Capture, organize, and never forget! Boost your productivity with Don't Forget! Take Notes! The ultimate note-taking app. Get it now!"
                appStore={true}
              />
            </div>

            <div className='col-span-6 sm:col-span-12'>
              <Project
                title='Twitter-Clone'
                github='https://github.com/GeroWalther/twitter'
                summary='React-Native App using Expo Router'
                img={twitter}
              />
            </div>
            <div className='col-span-6 sm:col-span-12'>
              <Project
                title='Twitter Backend'
                github='https://github.com/GeroWalther/twitterBackend'
                summary='Custom Express Backend written for twitter-clone'
                img={node}
              />
            </div>
            <div className='col-span-12'>
              <FeaturedProject
                title='Chirp'
                type='Featured Project'
                img={chirp}
                github='https://github.com/GeroWalther/chirp'
                link='https://chirp-gules-nu.vercel.app'
                summary='T3 Stack Application using technologies such as TypeScript NextJS, TailwindCSS, tRPC, Prisma, Clerk for Authentication and a Planetscale database to build a fully functional emoji only tweeting application.'
              />
            </div>
            <div className='col-span-6 sm:col-span-12'>
              <Project
                title='Next Blog'
                github='https://github.com/GeroWalther/next-blog'
                summary='Simple Blog written in NextJS'
                img={blog}
                link='https://blog.gw-intech.com/'
              />
            </div>
            <div className='col-span-6 sm:col-span-12'>
              <Project
                title='Omnifood'
                github='https://github.com/GeroWalther/Omnifood-gero'
                summary='Pure Html and CSS Website'
                img={omnifood}
                link='https://omnifood-gero.netlify.app'
              />
            </div>
            <div className='col-span-6 sm:col-span-12'>
              <Project
                title='Nike backend'
                github='https://github.com/GeroWalther/twitterBackend'
                summary='Custom Express Backend written for nike shoe store with stripe for payments'
                img={node}
              />
            </div>
            <div className='col-span-6 sm:col-span-12'>
              <Project
                title='Nike Shoe Store'
                github='https://github.com/GeroWalther/nike'
                summary='React-Native Mobile App Store Frontend - Redux Toolkit, Redux Query etc.'
                img={nike}
              />
            </div>
            <div className='col-span-12'>
              <FeaturedProject
                title='Gewitter'
                type='Featured Project'
                img={gewitter}
                github='https://github.com/GeroWalther/gewitter'
                // link='https://gewitter.vercel.app'
                summary='T3 Stack Application using technologies such as TypeScript NextJS, TailwindCSS, tRPC, Prisma, NextAuth for Authentication and a PlanetScale database to build a fully functional tweeting, liking, following application.'
              />
            </div>
            <div className='col-span-6 sm:col-span-12'>
              <Project
                title='UPS inspired delivery App'
                github='https://github.com/GeroWalther/UPS'
                summary='React-Native Mobile App - TypeScript, TailwindCSS, StepZen for GraphQL Queries and a Firebase Backend'
                img={RNAPP}
              />
            </div>
            <div className='col-span-6 sm:col-span-12'>
              <Project
                title='AI Code-G'
                github='https://github.com/GeroWalther/ai-code-g'
                summary="AI Chat Bot using OpenAI's API"
                img={openAI}
              />
            </div>
          </div>
        </Layout>
      </main>
    </>
  );
};

export default projects;
