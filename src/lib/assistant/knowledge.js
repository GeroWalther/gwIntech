// Everything the chat bubble knows about GW-InTech.
//
// The whole file goes into the system prompt on every question, so keep it
// factual and reasonably compact. To teach the assistant something new, edit
// this file and deploy — there is no database or upload step any more.
//
// Sources: the pages of gw-intech.com, plus the pricing sheet and case studies
// that used to live in the old knowledge base on the EC2 server.

const knowledge = `
# GW-InTech at a glance
GW-InTech is the freelance studio of Gero Walther, a full-stack software engineer. Website: https://www.gw-intech.com
- Contact: office@gw-intech.com — usually a reply within a day. The "Hire Me" button and every "Discuss your project" / "Start a conversation" link on the site lead to this address.
- Gero builds web, mobile (iOS and Android) and native desktop (macOS) software, from the first commit to a signed binary or an App Store listing, and he is available for freelance work.
- Headline numbers on the site: 34 projects shipped, 7 apps in the App Store, 3 free Mac apps you can download, 7+ years building, 60+ satisfied clients, 100+ projects overall, 25+ languages and frameworks.
- Motto on the home page: "I don't just write code. I ship things people install." Notarized Mac apps, apps live in the App Store, storefronts that take real payments.

# About Gero
- Gero Walther works as a full-stack software engineer at a Japanese software company and takes on freelance work under GW-InTech. The about page describes him as based in Europe.
- He started in React and Node and kept moving: Rust and Tauri for the desktop, Swift and SwiftUI for native Mac and iOS, C++ when a problem calls for it, and current AI models wired into products people actually use.
- Before Japan he worked at Hubspire, a New York company, in JavaScript and React and later in their React Native department, taking several projects from inception to release.
- He has spent most of his career in international, agile teams.
- Freelance scope: web and mobile builds, native Mac apps and commerce — a single feature or the whole thing, including code signing and notarization, App Store review, payments and transactional email.

# Services (from the Solutions page, https://www.gw-intech.com/solutions)
Gero designs and builds complete products — the interface, the API behind it and the infrastructure it runs on. Clients brief one person rather than three agencies.
1. Realtime AI: voice assistants and live camera vision — spoken conversation with sub-second latency, live camera understanding that guides a user step by step, assistants that work around the clock in any language. On-device when privacy or offline use matters, streaming cloud models when capability matters. (Realtime voice APIs, Apple Intelligence, vision models, streaming speech, WebSockets.)
2. AI features and automation inside your product — retrieval over your own documents with cited sources (RAG and vector search), structured extraction, classification and routing, and agents that act behind an approval gate. Built against cost and latency budgets. (OpenAI, Anthropic, tool calling, local models.)
3. Native apps for iPhone, Mac and Android — SwiftUI where the platform matters, React Native and Expo for one codebase on both stores, Tauri with a Rust core for small desktop apps. Signed, notarized, shipped, with verified auto-updates. (Swift/SwiftUI, React Native, Expo, Tauri + Rust, StoreKit.)
4. Full-stack SaaS platforms — multi-tenant data, roles and permissions, subscription billing, onboarding, admin tooling and analytics. (Next.js, React, Node.js, Stripe, Docker, PostgreSQL.)
5. Type-safe backends and APIs — end-to-end type safety from database to client, caching, honest error handling, integrations that degrade gracefully. (TypeScript, Node.js, tRPC, GraphQL, Prisma, MongoDB.)
6. E-commerce and payments — fast storefronts, multi-item baskets, EU and international shipping and tax, transactional email, refunds, admin views of orders and customers, built to convert on a phone. (Next.js, Stripe, MongoDB, Resend, Tailwind CSS.)
7. Cloud, DevOps and deployment — containerized services, CI/CD on merge, monitoring and logging, infrastructure as code, costs reviewed rather than assumed. (AWS EC2/RDS/S3, Docker, CI/CD, Vercel.)
8. Realtime and collaborative platforms — chat, live feeds, presence and notifications that survive flaky mobile connections. (WebSockets, server-sent events, React Query, Zustand, push notifications.)
9. Custom software shaped to your workflow — internal tools and awkward integrations: discovery, architecture, documentation, clean handover.

# How working together looks
1. We agree what success means first — what the thing has to do and how we will know it worked.
2. You see it running early, and often — something clickable within the first weeks, deployable from then on.
3. Gero tells you when he disagrees — plainly — and then does what you decide. You pay for judgement, not agreement.
4. You own everything at the end — code, repositories, cloud accounts, documented well enough that another developer could take over. No lock-in.

# Toolkit
- Languages: TypeScript, JavaScript, Swift, Rust, Python, C++, HTML, CSS
- Frontend: React, Next.js, Tailwind CSS, Framer Motion, Three.js / React Three Fiber, shadcn/ui, Zustand, Sass
- Mobile and desktop: Swift / SwiftUI, SwiftData, React Native, Expo, Tauri, Rust, Electron
- Backend and data: Node.js, Express, tRPC, GraphQL, Prisma, Drizzle, Zod, MongoDB, PostgreSQL, Supabase, PlanetScale, Firebase
- AI: OpenAI, Anthropic (Claude), OpenRouter, Google Gemini, Apple Intelligence, local models via Ollama, RAG and vector search, Stable Diffusion / ComfyUI
- Infrastructure: AWS, Docker, CI/CD, Vercel, Firebase, monitoring and logging
- Product plumbing: Stripe, Clerk, NextAuth, Resend, React Query, Recharts, RevenueCat, StoreKit

# Prices (all in USD; three packages: Starter / Professional / Enterprise)
Starter suits small businesses and proofs of concept, Professional adds more customization and features, Enterprise is fully tailored. Prices vary with requirements and complexity; discounts are available for long-term contracts and for combining several services. For an exact quote, email office@gw-intech.com.
- AI chatbot: $5,000 / $15,000 / $50,000+
- Custom AI model: $8,000 / $25,000 / $100,000+
- Online store: $1,500 / $4,000 / $15,000+
- AWS cloud setup: $1,000 / $3,000 / $10,000+
- Node.js development: $2,000 / $5,000 / $10,000+
- Swift iOS development: $10,000 / $30,000 / $120,000+
- Cross-platform mobile app (React Native): $10,000 / $30,000 / $120,000+
- Mobile app including AI: $15,000 / $40,000 / $150,000+
- Computer vision solution: $15,000 / $40,000 / $150,000+
- NLP service: $9,000 / $27,000 / $85,000+
- Consulting: $200 / $500 / $900 per day
- Dedicated AI developer: $8,000 / $12,000 / $18,000 per month
- Maintenance and support: 15% / 12% / 10% of the project cost per year
There are no fixed timelines: delivery time depends on scope, and is agreed at the start of a project.

# Current projects — Gero's own products (newest first)

## EyeGuide AI — iOS app, on the App Store (just shipped)
Page: https://www.gw-intech.com/eyeguide · App Store: https://apps.apple.com/app/id6791673680
- Point the phone at whatever you are fixing — a dripping tap, a car engine, a dishwasher error code — ask out loud, and EyeGuide answers in one short step and draws a marker on the exact part to touch next.
- Ask mode: hold the mic (or type); it reads one frame, answers in under forty words and rings the object; Apple Vision keeps tracking it so the marker stays on the part as you move the phone. Ask is unlimited on every plan.
- Live mode: camera and microphone stream continuously over a WebSocket and it talks back in real time, hands-free, like a video call. Live minutes are metered by plan. Live mode does not draw markers yet.
- Reads error codes, dipstick markings, which port is which. Also for DIY, electronics and soldering, flat-pack assembly, bikes, cooking.
- Safety: mains electricity, gas, brakes and airbags get a warning and a recommendation to call a professional.
- No account needed; the AI key is held server-side behind a proxy, not shipped in the app. Needs an internet connection.
- iPhone only, iOS 18+, 7-day free trial. Built with SwiftUI, AVFoundation, Apple Vision object tracking, the Speech framework, AVSpeechSynthesizer, StoreKit 2 subscriptions, Google Gemini, and a Node backend proxy on Vercel.

## Green Reader — iOS app, on the App Store
Page: https://www.gw-intech.com/green-reader · App Store: https://apps.apple.com/app/id6821135986
- Turns an iPhone Pro into an augmented-reality golf green reader: maps the putting green with the LiDAR scanner and draws the putt line, the break and the exact aim point on the real grass.
- Four steps, about thirty seconds: mark the ball, mark the hole (found automatically), walk the line, read the putt. No setup, calibration or course database.
- Aim point in centimetres/inches and cup widths; set green speed (Stimp) and pace (die it, ideal, firm); contour lines and slope arrows; plays-like distance, uphill/downhill and slope at the hole. Putts up to 15 m (49 ft), indoors or out.
- Everything is computed on the phone: no account, no tracking, nothing uploaded.
- Needs LiDAR: iPhone 12 Pro or a newer Pro / Pro Max. A practice tool — the Rules of Golf (Rule 4.3) do not allow green-reading devices in competition.
- First 3 reads free; Green Reader Pro is €29.99 a year or €4.99 a month for unlimited reads. Built with SwiftUI, ARKit and LiDAR.

## AI Box — macOS app, free public beta (current version 0.8)
Page: https://www.gw-intech.com/ai-box · Source: https://github.com/GeroWalther/ai-box
- A native macOS app that turns the Mac into an AI workstation: an assistant agent that browses, books and builds things, a writing studio, image generation, animated video and a real terminal — and you control it from your phone while the Mac does the work and keeps your API keys.
- Five tabs: Assistant Agent (does jobs itself in its own Chrome shown live beside the chat, or in your open Brave/Chrome/Safari tab; runs shell commands, edits files, toggles system switches; voice or text), Write (manuscript editor that continues and proofreads, fiction/business/marketing/academic modes, outline, word goals, version history), Images (a managed local ComfyUI, or cloud models such as Google's Nano Banana, GPT Image or anything on OpenRouter), Video (voiced, scored, animated ads and explainers with your own logo, 10 seconds to 2 minutes, for a few cents each), Terminal (a real PTY whose shells keep running even after you quit the app — made for Claude Code sessions).
- Screen Assist: hold ⌥ Space anywhere on the Mac, ask out loud; it sees a screenshot, answers out loud, circles what it means on screen, and can click and type for you. Escape stops it from anywhere.
- New in 0.8: terminals survive quitting the app, faster Screen Assist, themes (Gruvbox Dark default, Dracula, Tokyo Night, Catppuccin, Nord, One Dark, Solarized, GitHub), zoom for every view. 0.7 added the in-app browser panel, kept sign-ins and an opt-in full-autonomy mode. 0.6 added the Assistant Agent and voice.
- Bring your own key: OpenRouter, or Anthropic, OpenAI or Google directly — or no provider at all with local Ollama models. Keys live in the macOS Keychain.
- Phone access: scan a QR code on your home Wi-Fi, or anywhere through Tailscale. The Mac is never exposed to the public internet. Away mode keeps the Mac awake.
- Safety: paying, booking, sending and deleting wait for your approval (unless you switch on full autonomy, on the Mac only); it never types passwords; file access is jailed to a workspace folder; ~/.ssh, ~/.aws and keychains are always off-limits.
- Built with Tauri 2, a Rust backend and React 19 + TypeScript; about 17 MB installed; an axum HTTP + WebSocket server serves the same app to the phone; item-level sync with tombstones so edits on two devices never overwrite each other. Universal (Apple Silicon and Intel), signed and notarized, macOS 10.15+. Free during the beta.

## Skribble — macOS app, free and open source
Page: https://www.gw-intech.com/skribble · Source: https://github.com/GeroWalther/skribble
- A paint app with shapes, arrows, a fill bucket and text — plus a mode (⌃⌥⌘D) that turns the whole screen into the canvas so you can draw on top of any app: circle the button, arrow the bug. Click-through (⌃⌥⌘P), spans every display, can dim the screen behind, wipe with ⌃⌥⌘E.
- Everything is vector: 200 levels of undo, PNG/JPEG at 2× and true vector PDF export. Lives in the menu bar.
- A few thousand lines of Swift with no dependencies (SwiftUI and AppKit). macOS 14+, Apple Silicon. Signed, notarized and stapled.

## Gridly — macOS app, free and open source
Page: https://www.gw-intech.com/gridly · Source: https://github.com/GeroWalther/gridly
- A native Mac spreadsheet that opens the .xlsx someone sent you with fonts, fills, borders, number formats, merged cells and frozen panes intact, and saves it back as a real Excel file. Also .xlsm, .xls and .csv.
- A real formula engine, canvas rendering so large sheets stay fast, and a dark mode that leaves the workbook's own colours alone.
- No charts, pivot tables or macros; .xls and .xlsm open read-only and save to a new .xlsx; no password-protected workbooks. Built with Electron and Canvas. Apple Silicon, macOS 11+.

## Dungeon Monsters — terminal game in C++
Play online: https://www.gw-intech.com/game · Source: https://github.com/GeroWalther/dungeon-monsters
- A roguelike dungeon crawler with pixel-art sprites and faction-based combat: 8 monster types, 14 weapons, 10 procedurally generated floors.
- Install with Homebrew: brew tap GeroWalther/dungeon && brew install dungeon-monsters

## This chat assistant (case study)
- An embeddable AI assistant that answers strictly from a company's own material, in the visitor's language. It is the bubble on gw-intech.com.
- The original version is a multi-tenant product: companies upload PDF, Word, Excel and PowerPoint documents (with OCR fallback for scanned PDFs); the text is chunked and embedded into a vector database, answers use only retrieved material, and retrieval is multilingual (a Japanese question retrieves Japanese sources directly). The widget exchanges a per-company API key for a short-lived signed token and checks the requesting domain on every call. An admin dashboard manages documents, FAQs and users.
- On gw-intech.com it now runs as serverless functions on Vercel next to the website, instead of on a dedicated server.
- Gero builds assistants like this for other companies too (see the AI chatbot prices).

# Client and commerce projects
- Vice Fitting Mallorca — public site and booking system for an official Vice Golf retailer and club fitter on Mallorca. Stripe Checkout takes the €90 session fee, MongoDB Atlas holds bookings, Resend sends a confirmation with an .ics calendar attachment to customer and fitter. Trilingual (German, English, Spanish) with next-intl, password-protected admin for bookings and demo days. Next.js 16, React 19, Tailwind v4, shadcn/ui. https://vicegolf-mallorca.com/
- Natura Vervae — full storefront for a biological longevity supplement brand: catalogue, Stripe Checkout with multi-item baskets and EU and international shipping and tax, editorial blog and newsletter in MongoDB/Mongoose, transactional email via Resend. Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4. https://natura-vervae.vercel.app
- Pour Beauty (Pure Beauty Biological) — custom full-stack e-commerce shop with Stripe payments, Resend email and a custom admin dashboard so the client manages products, orders and customers without a developer. Next.js, Tailwind CSS, Prisma, MongoDB. https://www.purebeautybiological.com
- Miss Glow — custom full-stack e-commerce shop built to a client's requirements, with a custom admin dashboard and fast checkout. Next.js, Prisma, Stripe, Tailwind CSS, MongoDB, Resend. https://www.missglowbeauty.com/
- Polo and Lifestyle Magazine — the official magazine's iOS app in Swift and SwiftUI (App Store: https://apps.apple.com/app/id6740444400) and its WordPress website (https://poloandlifestylemagazine.com).

# More apps and projects
- XTradeAI — React Native app that analyses stocks, indices, crypto and commodities through a custom Python backend combining news, macro data, technical analysis, sentiment and real-time prices. https://apps.apple.com/app/id6743446333
- justConvert — React Native Expo app for iOS and Android: precise currency conversion from the Frankfurter API plus lengths, weights, areas and volumes; NativeWind and RevenueCat. https://apps.apple.com/app/id6464125917
- Don't Forget! Take a Note! — React Native Expo note-taking app on the App Store. https://apps.apple.com/app/id6450320648
- Climatic — native Swift weather app using OpenWeatherMap, by location or city search. https://apps.apple.com/app/id6737645840
- Vision-X — AI text and image generation platform (Claude, Replicate and others) with community sharing; Next.js, Supabase, React Query.
- G-Drive — Google Drive clone with Clerk auth, multi-type uploads, SingleStore and AWS S3. https://g-drive.gw-intech.com
- Pluto Market — marketplace for digital products: Next.js 14, NextAuth, tRPC, Stripe, Prisma, MongoDB. https://pluto-market.gw-intech.com/
- Moonlamp Online Shop — Next.js 13, Framer Motion, Zustand, Prisma, Stripe.
- The Wild Oasis — React app with compound components, React Query, Supabase auth and storage. https://wild-oasis-g.netlify.app/
- Others: MERN Stack + Docker, GraphQL + Node API, Full Stack Threads App, Twitter clone and backend, Nike shoe store app and backend, UPS-inspired delivery app, AI Code-G (OpenAI chat bot), Chirp and Gewitter (T3 stack), Next Blog (https://blog.gw-intech.com/), Omnifood.
- Every project is downloadable, live or on GitHub (https://github.com/GeroWalther). Full list: https://www.gw-intech.com/projects

# Website pages
Home https://www.gw-intech.com · Projects https://www.gw-intech.com/projects · AI Box https://www.gw-intech.com/ai-box · Solutions https://www.gw-intech.com/solutions · About https://www.gw-intech.com/about · EyeGuide https://www.gw-intech.com/eyeguide · Green Reader https://www.gw-intech.com/green-reader · Skribble https://www.gw-intech.com/skribble · Gridly https://www.gw-intech.com/gridly · Game https://www.gw-intech.com/game
`.trim();

export default knowledge;
