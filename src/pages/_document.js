import { Html, Head, Main, NextScript } from 'next/document';
import {
  ALWAYS_DARK_ROUTES,
  DEFAULT_THEME,
  STORAGE_KEY,
  THEMEABLE_ROUTES,
} from '@/lib/theme-routes';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        {/* Runs before first paint, so a visitor who chose dark never sees a
            white flash first. It duplicates the rules in lib/theme.js on
            purpose: this has to execute with no React and no bundle. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
var p=(location.pathname||'/').replace(/\\/+$/,'')||'/';
var themeable=${JSON.stringify(THEMEABLE_ROUTES)};
var alwaysDark=${JSON.stringify(ALWAYS_DARK_ROUTES)};
var t;
if(themeable.indexOf(p)>-1){var s=localStorage.getItem(${JSON.stringify(
              STORAGE_KEY
            )});t=(s==='dark'||s==='light')?s:${JSON.stringify(DEFAULT_THEME)};}
else{t=alwaysDark.indexOf(p)>-1?'dark':'light';}
document.documentElement.setAttribute('data-theme',t);
document.documentElement.style.colorScheme=t;
}catch(e){}})();`,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* "Ask AI" chat bubble. The widget bundle lives in public/widget and
            talks to the Vercel functions in src/pages/api/assistant. */}
        <script
          src='/widget/assistant.js'
          data-company='gw-intech'
          data-api-key='gw-intech-api-key-456'
          data-api-url='/api/assistant'
          async></script>
        <link rel='stylesheet' href='/widget/style.css' />
      </body>
    </Html>
  );
}
