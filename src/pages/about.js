import React, { useRef, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import AnimatedTxt from '@/components/AnimatedTxt';
import Layout from '@/components/Layout';
import tecnoArt from '../../public/images/hero/tecno.jpg';
import Skills from '@/components/Skills';
import HireMe from '@/components/HireMe';

const AnimatedNumbers = ({ value }) => {
  const ref = useRef(null);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 3000 });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    springValue.on('change', (latest) => {
      if (ref.current && latest.toFixed(0) <= value) {
        ref.current.textContent = latest.toFixed(0);
      }
    });
  }, [springValue, value]);

  return <span ref={ref}></span>;
};

const about = () => {
  return (
    <>
      <Head>
        <title>About - GW-InTech</title>
        <meta
          name='description'
          content='GW-InTech Official Website - About GW-InTech, my motivation and background, check out the Languages and Frameworks I am using for mobile apps and web-developent. '
        />
      </Head>
      <main className='flex w-full flex-col items-center justify-center'>
        <Layout className='pt-16 md:pt-12 sm:pt-6'>
          <AnimatedTxt
            className='mb-16 lg:text-4xl md:text-3xl sm:mb-10 md:mt-10'
            text='Passion Fuels Purpose!'
          />
          <h2 className='mb-6 text-lg font-bold uppercase text-dark/75'>
            About
          </h2>
          <div className='grid w-full grid-cols-8 gap-16 sm:gap-8'>
            <div className='col-span-5 flex flex-col items-start justify-start md:col-span-8'>
              <p className='font-medium'>
                Hi, I am GW-InTech, a web and mobile app developer with a
                passion for creating beautiful, functional, and user-centered
                digital experiences. Based on my extensive knowledge and
                experience in web, mobile app development and my work with
                React, technologies like Next.js, Node.js, Typescript, GraphQL,
                MongoDB, React-Native and the T3-Stack which also includes
                technologies like tRPC, Prisma, TailwindCSS etc. I am confident
                that I would be a valuable addition to your team or can make
                your project idea a reality.
              </p>
              <p className='my-4 font-medium'>
                With my expertise in the field. I am always looking for new and
                innovative ways to bring my clients visions to life. During my
                tenure at Hubspire, a New York based American company, I gained
                comprehensive experience in development. Particularly, I
                successfully applied my skills in JavaScript and React in
                various projects. I also worked in the React Native department,
                where I was entrusted with several major projects from inception
                to full development. I generally work in an agile environment
                and have had experience working in an international team.
              </p>
              <p className='mb-4 font-medium'>
                I communicate effectively and take responsibility to
                successfully fulfill my tasks. I bring a strong discipline and
                know-how for developing appealing and functional user
                interfaces, always focusing on finding the best possible
                solution for the clients requirements. I believe that design is
                about more than just making things look pretty, it is about
                solving problems and creating intuitive, enjoyable experiences
                for users.
              </p>
              <p className='font-medium'>
                Whether I am working on a website, mobile app, or other digital
                product, I bring my commitment to design excellence and
                user-centered thinking to every project I work on. I look
                forward to the opportunity to bring my skills and passion to
                your next project. Do not hesitate in contacting me!
              </p>
            </div>
            <div className='col-span-3 h-max rounded-2xl border-solid border-spacing-2 border-dark self-center md:col-span-8 md:p-6'>
              <div className='drop-shadow-md hover:drop-shadow-xl rounded-2xl'>
                <Image
                  src={tecnoArt}
                  alt='Tech-Art by Maximalfocus'
                  className='w-full h-auto rounded-2xl'
                  priority
                  sizes='(max-width:768px) 100vw, (max-width:1200px) 50vw, 37vw'
                />
              </div>
              <Link
                href={'https://www.instagram.com/maximalfocus/'}
                target='_blank'>
                <p className='p-3 text-center text-blue-800'>
                  Art by @Maximalfocus
                </p>
              </Link>
            </div>

            <div className='col-span-8 flex items-center justify-around md:flex-col'>
              <div className='flex flex-col items-end justify-center md:self-end md:mt-5'>
                <span className='inline-block text-5xl font-bold'>
                  <AnimatedNumbers value={60} />+
                </span>
                <h3 className='text-lg font-medium capitalize text-dark/75'>
                  Clients Satisfied
                </h3>
              </div>

              <div className='flex flex-col items-end justify-center md:my-16 md:self-start'>
                <span className='inline-block text-5xl font-bold'>
                  <AnimatedNumbers value={100} />+
                </span>
                <h3 className='text-lg font-medium capitalize text-dark/75'>
                  Projects
                </h3>
              </div>

              <div className='flex flex-col items-end justify-center md:self-end'>
                <span className='inline-block text-5xl font-bold'>
                  <AnimatedNumbers value={25} />+
                </span>
                <h3 className='text-lg font-medium capitalize text-dark/75'>
                  Languages &amp; Frameworks
                </h3>
              </div>
            </div>
          </div>
          <Skills />
        </Layout>
        <HireMe top={true} />
      </main>
    </>
  );
};

export default about;
