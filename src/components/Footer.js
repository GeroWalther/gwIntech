import React from 'react';
import Layout from './Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '@/lib/theme';

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
  const router = useRouter();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <footer
      className={`w-full border-t-2 border-solid text-lg transition-colors duration-300 sm:text-sm ${
        dark ? 'border-white/10' : 'border-dark'
      }`}
      style={{ background: 'var(--gw-ink)', color: 'var(--gw-text)' }}>
      <Layout
        className={`py-8 flex items-center justify-between lg:flex-col lg:py-6 ${
          dark ? '!bg-transparent' : ''
        }`}>
        <span className='lg:pb-2'>
          {new Date().getFullYear()} &copy; All Rights Reserved built by
          GW-InTech <span className='text-primary text-2xl'>&hearts;</span>
        </span>
        <Link
          href='mailto:office@gw-intech.com'
          className={`border-b-2 border-transparent hover:border-b-2 ${
            dark ? 'hover:border-light' : 'hover:border-dark'
          }`}>
          Contact & Business Inquiries
        </Link>
      </Layout>
      <GradientStripe />
    </footer>
  );
};

export default Footer;
