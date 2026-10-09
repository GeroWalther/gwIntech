import Head from 'next/head';
import Layout from '@/components/Layout';

// Privacy Policy for the Green Reader iOS app. Like /app-privacy-policy it is
// NOT linked from the NavBar or Footer and is marked noindex — it exists so the
// App Store listing and the in-app paywall have a Privacy Policy URL.
// Green Reader gets its own page because, unlike the AI apps, nothing it
// captures ever leaves the device.

const Section = ({ title, children }) => (
  <section className='mb-8'>
    <h2 className='text-2xl font-bold text-dark mb-3 sm:text-xl'>{title}</h2>
    <div className='text-dark/80 leading-relaxed space-y-4'>{children}</div>
  </section>
);

const GreenReaderPrivacy = () => {
  return (
    <>
      <Head>
        <title>Green Reader Privacy Policy | GW-InTech</title>
        <meta name='description' content='Privacy Policy for the Green Reader iOS app by GW-InTech.' />
        <meta name='robots' content='noindex, nofollow' />
      </Head>
      <main className='flex w-full flex-col items-center justify-center'>
        <Layout className='pt-16 md:pt-12 sm:pt-6'>
          <div className='mx-auto w-full max-w-3xl'>
            <h1 className='text-4xl font-bold text-dark mb-2 sm:text-3xl'>
              Green Reader Privacy Policy
            </h1>
            <p className='text-dark/60 mb-8'>Last updated: 9 October 2026</p>

            <div className='text-dark/80 leading-relaxed space-y-4 mb-8'>
              <p>
                This Privacy Policy explains how <strong>GW-InTech</strong> (Gero Walther)
                (&quot;we&quot;, &quot;us&quot;) handles information in the{' '}
                <strong>Green Reader</strong> app for iPhone (the &quot;App&quot;).
              </p>
              <p>
                In short: Green Reader works entirely on your iPhone. It has no account, it
                sends nothing to us or to anyone else, and it contains no analytics, advertising
                or tracking.
              </p>
            </div>

            <Section title='Camera and LiDAR'>
              <p>
                To read a green, the App uses your iPhone&apos;s camera and LiDAR scanner. The
                camera image and depth data are processed live, on your device, to map the
                slope of the green and to find the ball and the hole. They are not recorded,
                stored or uploaded, and they never leave your iPhone.
              </p>
            </Section>

            <Section title='Data Stored on Your iPhone'>
              <p>
                The App keeps a few settings on your device, such as your preferred units, the
                green speed you last used and how many free reads you have left. This stays on
                your iPhone and is not sent to us.
              </p>
              <p>
                If you choose <strong>Share scan data</strong>, the App creates a file with the
                measurements of that green and opens the iOS share sheet. Where that file goes
                is entirely up to you; we never receive it unless you send it to us yourself.
              </p>
            </Section>

            <Section title='Purchases'>
              <p>
                Green Reader Pro subscriptions are sold and processed by Apple. Apple tells the
                App whether you have an active subscription so it can unlock Pro features. We
                do not receive your name, email address or payment details. Apple&apos;s
                handling of your purchase is covered by{' '}
                <a
                  className='text-primary underline'
                  href='https://www.apple.com/legal/privacy/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Apple&apos;s Privacy Policy
                </a>
                .
              </p>
            </Section>

            <Section title='What We Do Not Do'>
              <p>
                We do not collect personal data through the App, do not use analytics or
                advertising SDKs, do not track you across apps or websites, and do not sell or
                share any data.
              </p>
            </Section>

            <Section title='Your Rights'>
              <p>
                Depending on where you live (for example, under the EU GDPR), you have rights
                to access, correct or delete personal data and to object to its processing.
                Because the App does not send us any personal data, we hold none about you from
                the App. If you have a question or a request, contact us using the details
                below.
              </p>
            </Section>

            <Section title="Children's Privacy">
              <p>
                The App is not directed to children and does not knowingly collect personal
                information from anyone, including children under the age of 16.
              </p>
            </Section>

            <Section title='Changes to This Policy'>
              <p>
                We may update this Privacy Policy from time to time. When we do, we will revise
                the &quot;Last updated&quot; date above.
              </p>
            </Section>

            <Section title='Contact Us'>
              <p>If you have any questions about this Privacy Policy, contact:</p>
              <p>
                GW-InTech (Gero Walther)
                <br />
                Email:{' '}
                <a className='text-primary underline' href='mailto:office@gw-intech.com'>
                  office@gw-intech.com
                </a>
              </p>
            </Section>
          </div>
        </Layout>
      </main>
    </>
  );
};

export default GreenReaderPrivacy;
