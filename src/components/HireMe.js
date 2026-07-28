import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';
import { FullStackCircularLogo } from './Icons';
import { isDarkRoute } from '@/lib/theme';

const HireMe = ({ top = false }) => {
  const router = useRouter();
  const dark = isDarkRoute(router.pathname);

  return (
    <div
      className={`fixed right-4 ${
        !top ? 'bottom-4' : 'top-6 '
      } lg:right-0 lg:left-auto lg:top-2 lg:bottom-auto flex items-center justify-center overflow-hidden lg:absolute `}>
      <div className='w-64 h-auto flex items-center justify-center relative sm:w-40 '>
        {/* The ring text is the whole point of the badge, so it has to follow
            the page under it — fill-dark left it invisible on the dark pages. */}
        <FullStackCircularLogo
          className={`animate-spin-slow ${dark ? 'fill-light' : 'fill-dark'}`}
        />

        {/* wa.me wants the number in international form with no +, no leading
            zeros and no spaces — 0034 637 920 961 becomes 34637920961. */}
        <Link
          href='https://wa.me/34637920961'
          target='_blank'
          rel='noopener noreferrer'
          aria-label='Message Gero on WhatsApp'
          className={`flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md border-2 border-solid h-20 w-20 rounded-full font-semibold transition sm:w-12 sm:h-12 sm:text-[9px] sm:text-center sm:font-normal ${
            dark
              ? 'bg-primaryDark text-dark border-white/25 hover:bg-light'
              : 'bg-primary text-light border-dark hover:bg-light hover:text-dark'
          }`}>
          Hire Me
        </Link>
      </div>
    </div>
  );
};

export default HireMe;
