import Link from 'next/link';
import { useEffect, useState } from 'react';

const LATEST_JSON_URL =
  'https://scanner-downloads-public.s3.amazonaws.com/community/latest.json';

export default function ScannerDownloads() {
  const [downloads, setDownloads] = useState(null);

  useEffect(() => {
    fetch(LATEST_JSON_URL)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.files) return;
        const macDmg = data.files.find(
          (f) => f.platform === 'macOS' && f.format === 'DMG' && f.arch === 'Apple Silicon'
        );
        const winDownload =
          data.files.find((f) => f.platform === 'Windows' && f.format === 'Installer') ||
          data.files.find((f) => f.platform === 'Windows' && f.format === 'ZIP');
        setDownloads({ macDmg, winDownload, version: data.tag });
      })
      .catch(() => {});
  }, []);

  if (!downloads) return null;

  const linkClass =
    'text-sm font-medium text-dark/60 hover:text-dark underline underline-offset-4 transition-colors';

  return (
    <div className='w-full flex justify-center gap-6 mt-16 md:mt-10 sm:flex-col sm:items-center sm:gap-3'>
      {downloads.macDmg && (
        <Link href={downloads.macDmg.url} target='_blank' className={linkClass}>
          Try Security Scanner Pro for macOS (Beta)
        </Link>
      )}
      {downloads.winDownload && (
        <Link href={downloads.winDownload.url} target='_blank' className={linkClass}>
          Try Security Scanner Pro for Windows (Beta)
        </Link>
      )}
    </div>
  );
}
