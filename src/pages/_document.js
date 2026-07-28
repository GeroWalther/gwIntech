import { Html, Head, Main, NextScript } from 'next/document';

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
var alwaysDark=['/projects','/about','/solutions','/ai-box','/skribble','/gridly'];
var themeable=['/'];
var t;
if(themeable.indexOf(p)>-1){var s=localStorage.getItem('gw-theme');t=(s==='dark'||s==='light')?s:'light';}
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
        <script
          src='https://widget.gw-intech.com/widget/assistant.js'
          data-company='gw-intech'
          data-api-key='gw-intech-api-key-456'
          data-api-url='https://widget.gw-intech.com/api/assistant'
          async></script>
        <link
          rel='stylesheet'
          href='https://widget.gw-intech.com/widget/style.css'
        />
        {/* For Testing on localhost 3000 with locally running backend on port 7070 */}
        {/* <script
          src='http://localhost:7070/widget/assistant.js'
          data-company='gw-intech'
          data-api-key='gw-intech-api-key-456'
          data-api-url='http://localhost:7070/api/assistant'
          async></script>

        <link rel='stylesheet' href='http://localhost:7070/widget/style.css' /> */}
      </body>
    </Html>
  );
}
