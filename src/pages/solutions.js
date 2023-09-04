import React from 'react';
import Head from 'next/head';
import AnimatedTxt from '@/components/AnimatedTxt';
import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import blog from '../../public/images/projects/blog.png';
import omnifood from '../../public/images/projects/Omnifood.png';
import RNAPP from '../../public/images/projects/rnapp.png';
import shop from '../../public/images/projects/nike.png';
import rn from '../../public/images/projects/twitterExpoRouter.jpeg';
import node from '../../public/images/projects/node.png';
import { motion } from 'framer-motion';

const FramerImage = motion(Image);

const Solution = ({ img, title, summary, className }) => {
  return (
    <li className={`${className}`}>
      <Link
        href='mailto:office@gw-intech.com'
        className='w-full inline-block cursor-pointer overflow-hidden rounded-lg'>
        <FramerImage
          src={img}
          alt={title}
          className='w-full h-auto'
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          priority
          sizes='(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw'
        />
      </Link>
      <Link href='mailto:office@gw-intech.com' className='flex flex-col'>
        <h2 className='capitalize text-2xl font-bold my-6 hover:underline-offset-2 md:text-xl md:font-semibold'>
          {title}
        </h2>
        <p className='text-sm mb-2'>{summary}</p>
        <button className='bg-dark text-light  py-2 rounded-lg mt-3'>
          Contact
        </button>
      </Link>
    </li>
  );
};

const solutions = () => {
  return (
    <>
      <Head>
        <title>My Projects - GW-InTech</title>
        <meta
          name='description'
          content='GW-InTech Official Website - Solutions GW-InTech, have a look at a couple of my example solutions I provide for my clients. You can take these as an inspiration to get an idea of my work.'
        />
      </Head>
      <main className='w-full flex flex-col items-center justify-center overflow-hidden pb-10'>
        <Layout className='pt-16'>
          <AnimatedTxt
            text='Solutions which make a difference'
            className='mb-16 lg:text-4xl md:text-3xl sm:mb-10 md:mt-10'
          />
          <h2 className='mb-3 text-lg font-bold uppercase text-dark/75 '>
            Solutions
          </h2>
          <p className='font-medium'>
            In today`s digital landscape, a strong online presence is essential
            for businesses to thrive. As a web developer, I offer comprehensive
            services tailored to help businesses establish and enhance their
            online presence. By leveraging my expertise in web development, I
            can provide customized solutions in various fields, including online
            shops, blog websites, messenger/social media web platforms, and
            React Native cross-platform mobile apps.
          </p>
          <ul className='grid grid-cols-2 gap-16 mt-10 gap-y-24 md:grid-cols-1'>
            <Solution
              className='self-end'
              img={rn}
              title='React Native: Cross-Platform Mobile App Development'
              summary='For businesses seeking to reach a wider audience across iOS and Android devices, React Native provides an efficient cross-platform mobile app development solution. By leveraging the power of React Native, I build native-like mobile apps with a single codebase, reducing development time and costs. The resulting apps offer exceptional performance, a native user interface, and access to device-specific features, all while ensuring a consistent user experience across platforms.'
              link='/'
            />

            <Solution
              img={RNAPP}
              title='Messenger/Social Media Web Platform: Facilitating Communication and Connection'
              summary='In the age of social media, effective communication and connection are vital for businesses. By developing a messenger or social media web platform, I enable businesses to connect with their audience in real-time, foster engagement, and build strong relationships. With interactive chat features, social sharing capabilities, and personalized user experiences, businesses can strengthen their brand presence and cultivate a loyal community.'
              link='/'
            />

            <Solution
              className='self-end'
              img={shop}
              title='Online Shop Development: Reaching a Global Audience'
              summary='An online shop is a powerful tool for businesses looking to expand their reach and tap into the global market. By developing a user-friendly and visually appealing online shop, I enable businesses to showcase their products or services to a wider audience. With seamless e-commerce functionalities, secure payment gateways, and intuitive navigation, I help businesses drive conversions and increase sales.'
              link='/'
            />
            <Solution
              img={blog}
              title='Blog Website: Expertise for Driving Engagement'
              summary="In today's digital age, a blog website serves as a powerful platform for businesses and individuals to share their knowledge, insights, and expertise with the world. As a web developer, I specialize in creating captivating and feature-rich blog websites that enable businesses to establish themselves as thought leaders in their industry.
"
              link='/'
            />

            <Solution
              img={omnifood}
              title='Custom Solutions: Tailored to Your Unique Requirements'
              summary='One of the key benefits of working with a professional web developer is the ability to receive custom solutions tailored to your unique requirements. Whether you need specific functionalities integrated, complex workflows implemented, or specialized features developed, I can deliver a custom solution that aligns perfectly with your business goals. With clean and scalable code, adherence to industry standards, and a focus on security and performance optimization, I ensure that your custom solution is robust, efficient, and future-proof.'
              link='/'
            />
            <Solution
              className='self-end'
              img={node}
              title='Powerful Custom Backend: Secure, Scalable, and Type-Safe Solutions'
              summary='As a custom backend developer specializing in Node.js, Express, GraphQL, Prisma, tRPC, and TypeScript, I provide secure, scalable, and type-safe solutions. With these technologies, I build high-performance backend systems that ensure data integrity, handle heavy traffic loads, and seamlessly integrate with various databases like MongoDB, PlanetScale, and AWS.'
              link='/'
            />
          </ul>
        </Layout>
      </main>
    </>
  );
};

export default solutions;
