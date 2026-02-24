import Link from 'next/link';

const MAC_URL =
  'https://scanner-downloads-public.s3.amazonaws.com/community/v0.1.0-beta.6/Security%20Scanner%20Pro-0.1.0-beta.6-arm64.dmg';
const WIN_URL =
  'https://scanner-downloads-public.s3.amazonaws.com/community/v0.1.0-beta.6/Security%20Scanner%20Pro-0.1.0-beta.6-win.zip';

export default function ScannerDownloads() {
  const linkClass =
    'text-sm font-medium text-dark/60 hover:text-dark underline underline-offset-4 transition-colors';

  return (
    <div className='w-full flex justify-center gap-6 mt-16 md:mt-10 sm:flex-col sm:items-center sm:gap-3'>
      <Link href={MAC_URL} target='_blank' className={linkClass}>
        Try Security Scanner Pro for macOS (Beta)
      </Link>
      <Link href={WIN_URL} target='_blank' className={linkClass}>
        Try Security Scanner Pro for Windows (Beta)
      </Link>
    </div>
  );
}
