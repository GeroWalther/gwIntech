import Link from 'next/link';
import React from 'react';
import { FullStackCircularLogo } from './Icons';

const HireMe = ({ top = false }) => {
  return (
    <div
      className={`fixed right-4 ${
        !top ? 'bottom-4' : 'top-6 '
      } lg:right-0 lg:left-auto lg:top-2 lg:bottom-auto flex items-center justify-center overflow-hidden lg:absolute `}>
      <div className='w-64 h-auto flex items-center justify-center relative sm:w-40 '>
        <FullStackCircularLogo className={'fill-dark animate-spin-slow'} />

        <Link
          href='mailto:office@gw-intech.com'
          className='flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-light shadow-md border-2 border-solid border-dark h-20 w-20 rounded-full font-semibold hover:bg-light hover:text-dark sm:w-12 sm:h-12 sm:text-[9px] sm:text-center sm:font-normal'>
          Hire Me
        </Link>
      </div>
    </div>
  );
};

export default HireMe;
