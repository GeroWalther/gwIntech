import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head />
      <body>
        <Main />
        <NextScript />
        <script
          src='http://51.92.83.204:7070/widget/assistant.js'
          data-company='gw-intech'
          data-api-key='gw-intech-api-key-456'
          data-api-url='http://51.92.83.204:7070/api/assistant'
          async></script>
        <link
          rel='stylesheet'
          href='http://51.92.83.204:7070/widget/style.css'
        />
        {/* For Testing on localhost with locally running backend on port 7070 */}
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
