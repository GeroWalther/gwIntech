import React from 'react';
import Layout from './Layout';
import Link from 'next/link';

const GradientStripe = () => {
  const lineStyle = {
    height: '2px',
    background: 'linear-gradient(90deg, transparent 0%, #3B82F6 25%, #3B82F6 75%, transparent 100%)',
  };

  return (
    <div
      className="w-full flex flex-col gap-[3px]"
      aria-hidden="true"
    >
      <div style={lineStyle} />
      <div style={lineStyle} />
      <div style={lineStyle} />
    </div>
  );
};

const Footer = () => {
  return (
    <footer className='w-full border-t-2 border-solid border-dark text-lg sm:text-sm'>
      <Layout
        className={
          'py-8 flex items-center justify-between lg:flex-col lg:py-6'
        }>
        <span className='lg:pb-2'>
          {new Date().getFullYear()} &copy; All Rights Reserved built by
          GW-InTech <span className='text-primary text-2xl'>&hearts;</span>
        </span>
        <Link
          href='mailto:office@gw-intech.com'
          className='border-b-2 border-transparent hover:border-b-2 hover:border-dark '>
          Contact & Business Inquiries
        </Link>
      </Layout>
      <GradientStripe />
    </footer>
  );
};

export default Footer;
