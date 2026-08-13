import Link from 'next/link';
import React from 'react';
import { FullStackCircularLogo } from './Icons';
import { useTheme } from '@/lib/theme';

const HireMe = ({ top = false }) => {
  // The resolved theme, not the route. Reading the route was wrong the moment
  // pages became switchable: on a themeable page it always reported light, so
  // the badge rendered its light styling over a dark page.
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    // Stays `fixed` at every width. It used to switch to absolute below lg,
    // which put it inside Ambient — and Ambient is `overflow-hidden`, so the
    // badge was clipped the moment it was lifted level with the navbar. Fixed
    // is positioned against the viewport instead, so nothing crops it, and
    // z-50 keeps it above the bar and the page content.
    <div
      className={`fixed right-4 z-50 ${
        !top ? 'bottom-4' : 'top-6 '
      } lg:right-1 lg:left-auto lg:top-1 lg:bottom-auto flex items-center justify-center`}>
      <div className='w-64 h-auto flex items-center justify-center relative sm:w-40 '>
        {/* The ring text is the whole point of the badge, so it follows the
            page colour rather than being pinned to one ground. */}
        <FullStackCircularLogo
          className='animate-spin-slow'
          style={{ fill: 'var(--gw-text)' }}
        />

        {/* wa.me wants the number in international form with no +, no leading
            zeros and no spaces — 0034 637 920 961 becomes 34637920961. */}
        <Link
          href='https://wa.me/34637920961'
          target='_blank'
          rel='noopener noreferrer'
          aria-label='Message Gero on WhatsApp'
          style={{ background: 'var(--gw-blue)' }}
          className={`gw-hire flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md border-2 border-solid h-20 w-20 rounded-full font-semibold text-white transition sm:w-12 sm:h-12 sm:text-[9px] sm:text-center sm:font-normal ${
            dark ? 'border-white/30' : 'border-black/20'
          }`}>
          Hire Me
        </Link>
      </div>
    </div>
  );
};

export default HireMe;
