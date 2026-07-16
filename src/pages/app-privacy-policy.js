import Head from 'next/head';
import Layout from '@/components/Layout';

// Reusable legal page for GW-InTech mobile apps. Intentionally NOT linked from the
// NavBar or Footer — it exists so App Store listings have a Privacy Policy URL.
// Reachable at /app-privacy-policy and marked noindex so it stays unlisted.

const Section = ({ title, children }) => (
  <section className='mb-8'>
    <h2 className='text-2xl font-bold text-dark mb-3 sm:text-xl'>{title}</h2>
    <div className='text-dark/80 leading-relaxed space-y-4'>{children}</div>
  </section>
);

const AppPrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>App Privacy Policy | GW-InTech</title>
        <meta name='description' content='Privacy Policy for mobile applications published by GW-InTech.' />
        <meta name='robots' content='noindex, nofollow' />
      </Head>
      <main className='flex w-full flex-col items-center justify-center'>
        <Layout className='pt-16 md:pt-12 sm:pt-6'>
          <div className='mx-auto w-full max-w-3xl'>
            <h1 className='text-4xl font-bold text-dark mb-2 sm:text-3xl'>
              App Privacy Policy
            </h1>
            <p className='text-dark/60 mb-8'>Last updated: 16 July 2026</p>

            <div className='text-dark/80 leading-relaxed space-y-4 mb-8'>
              <p>
                This Privacy Policy explains how <strong>GW-InTech</strong> (Gero Walther)
                (&quot;we&quot;, &quot;us&quot;) handles information in connection with the
                mobile applications we publish (each, an &quot;App&quot;). Some of our Apps use
                your device&apos;s camera, microphone, and artificial-intelligence services to
                provide their features.
              </p>
              <p>
                In short: our Apps generally do not require an account, do not ask for your
                name or email, and we do not sell your data. To provide AI features, an App
                sends the input you give it (such as camera, voice, or text) to our AI provider
                to generate a response.
              </p>
            </div>

            <Section title='Information We Process'>
              <p>
                <strong>Camera images and video.</strong> Where an App offers camera features,
                still frames or a live camera stream are captured while you use it and sent to
                our AI provider so it can understand your request and respond. We use this
                content only to generate your result; we do not use it to identify you.
              </p>
              <p>
                <strong>Microphone audio.</strong> Where an App offers voice features, your
                spoken audio is captured and sent to our AI provider to transcribe and answer
                it. In real-time modes, audio may be streamed during the session.
              </p>
              <p>
                <strong>Text you enter.</strong> Text you type into an App is sent to the AI
                provider to generate a response.
              </p>
              <p>
                <strong>Purchase information.</strong> Subscriptions and purchases are processed
                by Apple. We receive your purchase or subscription status from Apple to unlock
                features, but we do not receive or store your payment card details.
              </p>
              <p>
                <strong>Limited technical data.</strong> Our servers may process basic,
                transient technical information needed to operate and secure the service. We do
                not build advertising profiles.
              </p>
              <p>
                We do <strong>not</strong> collect your name, email address, contacts, precise
                location, or health data, and our Apps generally do not require you to create an
                account.
              </p>
            </Section>

            <Section title='How We Use Information'>
              <ul className='list-disc pl-6 space-y-2'>
                <li>To provide each App&apos;s core features — including understanding your input and generating a response.</li>
                <li>To operate, maintain, secure, and improve our Apps.</li>
                <li>To manage your purchases and unlock paid features.</li>
                <li>To comply with legal obligations.</li>
              </ul>
            </Section>

            <Section title='Third-Party Services'>
              <p>
                We rely on the following providers, who process data on our behalf or as part
                of delivering the service:
              </p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>
                  <strong>AI providers (currently Google&apos;s Gemini API)</strong> — process
                  your camera images, microphone audio, and text to generate responses. See{' '}
                  <a
                    className='text-primary underline'
                    href='https://policies.google.com/privacy'
                    target='_blank'
                    rel='noreferrer'>
                    Google&apos;s Privacy Policy
                  </a>{' '}
                  and the{' '}
                  <a
                    className='text-primary underline'
                    href='https://ai.google.dev/gemini-api/terms'
                    target='_blank'
                    rel='noreferrer'>
                    Gemini API Terms
                  </a>.
                </li>
                <li>
                  <strong>Vercel</strong> — hosts the backend that securely relays requests to
                  our AI provider.
                </li>
                <li>
                  <strong>Apple</strong> — processes App Store purchases and subscriptions.
                </li>
              </ul>
              <p>We do not sell your personal information or share it for advertising.</p>
            </Section>

            <Section title='Data Retention'>
              <p>
                Camera, audio, and text input is processed to generate your result and is not
                retained by us to build a profile of you. Our AI and infrastructure providers
                may process and temporarily retain content as described in their own policies
                and for the limited purposes of operating and securing their services.
              </p>
            </Section>

            <Section title='International Transfers'>
              <p>
                We are based in Germany. Because our providers (including Google and Apple)
                operate globally, your information may be processed in countries outside your
                own, including the United States. Where required, appropriate safeguards are in
                place for such transfers.
              </p>
            </Section>

            <Section title='Your Rights'>
              <p>
                Depending on where you live (for example, under the EU GDPR), you may have the
                right to access, correct, delete, or restrict the processing of your personal
                data, and to object to certain processing. Because our Apps generally do not
                maintain accounts or store personal profiles, we may hold little or no
                information that identifies you. To make a request or ask a question, contact us
                using the details below.
              </p>
            </Section>

            <Section title="Children's Privacy">
              <p>
                Our Apps are not directed to children, and we do not knowingly collect personal
                information from children under the age of 16. If you believe a child has
                provided us information, please contact us and we will take appropriate steps.
              </p>
            </Section>

            <Section title='Security'>
              <p>
                We use reasonable technical and organizational measures to protect information,
                including encrypted transport and keeping provider credentials on the server
                side rather than in the App. No method of transmission or storage is completely
                secure, however, and we cannot guarantee absolute security.
              </p>
            </Section>

            <Section title='Changes to This Policy'>
              <p>
                We may update this Privacy Policy from time to time. When we do, we will revise
                the &quot;Last updated&quot; date above. Continued use of our Apps after changes
                take effect constitutes acceptance of the updated policy.
              </p>
            </Section>

            <Section title='Contact Us'>
              <p>
                If you have any questions about this Privacy Policy or your data, contact:
              </p>
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

export default AppPrivacyPolicy;
