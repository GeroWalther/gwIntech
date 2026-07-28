// Single source of truth for the work shown on /projects and the homepage.
// `kind` drives filtering; `featured` promotes a card to the wide layout.
// The three macOS apps carry a `page`, which is their webspecial on this site.

import chirp from "../../public/images/projects/chirp3.png";
import dontforget from "../../public/images/projects/dontforget.jpeg";
import wildoasis from "../../public/images/projects/wild-oasis.png";
import threads from "../../public/images/projects/threads.png";
import polo from "../../public/images/projects/polo.png";
import moonlamp from "../../public/images/projects/moonlamp.png";
import graphQLNode from "../../public/images/projects/GraphQL_NodeJS.webp";
import justConvert from "../../public/images/projects/justConvert.jpeg";
import pluto from "../../public/images/projects/pluto-hero.png";
import misGloww from "../../public/images/projects/missGlow.png";
import poloApp from "../../public/images/projects/pololifestyleApp.webp";
import xTradeApp from "../../public/images/projects/XtradeAI.png";
import gDrive from "../../public/images/projects/g-drive.png";
import visionX from "../../public/images/projects/vision-x.png";
import node from "../../public/images/projects/node.png";
import twitter from "../../public/images/projects/twitterExpoRouter.jpeg";
import blog from "../../public/images/projects/blog.png";
import omnifood from "../../public/images/projects/Omnifood.png";
import nike from "../../public/images/projects/nike.png";
import gewitter from "../../public/images/projects/gewitter.png";
import RNAPP from "../../public/images/projects/rnapp.png";
import openAI from "../../public/images/projects/openAI.webp";
import climatic from "../../public/images/projects/climatic.png";
import mernDocker from "../../public/images/projects/mernDocker.webp";
import pourbeauty from "../../public/images/projects/porbeauty.png";
import dungeon from "../../public/images/projects/dungeon.png";
import aiBox from "../../public/images/projects/ai-box-card.png";
import naturaVervae from "../../public/images/projects/natura-vervae.jpg";
import gridly from "../../public/images/projects/gridly.png";
import viceGolf from "../../public/images/projects/vice-golf.png";
import skribble from "../../public/images/projects/skribble-card.png";

export const FILTERS = [
  { key: "all", label: "Everything" },
  { key: "desktop", label: "Desktop Apps" },
  { key: "mobile", label: "Mobile Apps" },
  { key: "web", label: "Web & Commerce" },
  { key: "ai", label: "AI" },
];

export const PROJECTS = [
  {
    title: "AI Box",
    type: "macOS App — Tauri 2, Rust & React",
    kind: ["desktop", "ai"],
    img: aiBox,
    page: "/ai-box",
    cta: "See how it works",
    github: "https://github.com/GeroWalther/ai-box",
    featured: true,
    summary:
      "A native macOS app that puts agentic chat, a writing studio, local image generation and a real terminal behind one window — then hands you the controls on your phone while the Mac does the work and keeps your API keys. Built with Tauri 2, Rust and React, signed and notarized, with conflict-free sync between devices. Free during public beta.",
  },
  {
    title: "Skribble",
    type: "macOS App — SwiftUI & AppKit",
    kind: ["desktop"],
    img: skribble,
    page: "/skribble",
    cta: "Download for macOS",
    github: "https://github.com/GeroWalther/skribble",
    featured: true,
    summary:
      "A paint app in the spirit of the one everybody already knows — shapes, arrows, a fill bucket, text — with a second mode that turns the whole screen into the canvas, so you can circle the thing you are talking about instead of describing where it is. Everything stays vector, so undo, resizing and PDF export never soften. Exports PNG, JPEG and true vector PDF.",
  },
  {
    title: "Gridly",
    type: "macOS App — Electron & Canvas",
    kind: ["desktop"],
    img: gridly,
    page: "/gridly",
    cta: "Download for macOS",
    github: "https://github.com/GeroWalther/gridly",
    featured: true,
    summary:
      "A Mac spreadsheet that opens the .xlsx someone actually sent you — fonts, fills, borders, number formats, merged cells and frozen panes all still where Excel left them — then writes it back out as a real Excel file. Formulas calculate rather than sit there, the grid paints to a canvas so large sheets stay fast, and dark mode leaves the workbook's own colours alone.",
  },
  {
    title: "Dungeon Monsters",
    type: "Terminal C++ Game",
    kind: ["desktop"],
    img: dungeon,
    link: "/game",
    cta: "Play Online",
    github: "https://github.com/GeroWalther/dungeon-monsters",
    featured: true,
    brew: ["brew tap GeroWalther/dungeon", "brew install dungeon-monsters"],
    summary:
      "A roguelike dungeon crawler with pixel art sprites and faction-based combat. 8 monster types, 14 weapons, 10 procedurally generated floors.",
  },
  {
    title: "Natura Vervae",
    type: "E-Commerce — Next.js 16, Stripe & MongoDB",
    kind: ["web"],
    img: naturaVervae,
    link: "https://natura-vervae.vercel.app",
    github: "https://github.com/GeroWalther/Natura-Vervae",
    featured: true,
    summary:
      "A full storefront for a biological longevity supplement brand, built on Next.js 16 with the App Router and React 19. Stripe Checkout handles multi-item orders with EU and international shipping, MongoDB and Mongoose back the orders, blog and newsletter, and Resend sends the transactional mail. Styled with Tailwind CSS v4 on shadcn-style primitives.",
  },
  {
    title: "Vice Fitting Mallorca",
    type: "Client Project — Next.js 16, Stripe & MongoDB",
    kind: ["web"],
    img: viceGolf,
    github: "https://github.com/GeroWalther/vicegolffittingwebsite",
    featured: true,
    summary:
      "Public site and booking system for an official Vice Golf retailer and fitter on Mallorca. Stripe Checkout takes the €90 session fee, MongoDB Atlas holds the bookings, and Resend sends a confirmation with an .ics attachment so the slot lands in the customer's calendar with reminders — and in the fitter's. Trilingual in German, English and Spanish via next-intl, with a password-protected admin dashboard for the booking list and demo-day scheduling. Next.js 16 App Router, React 19, Tailwind v4 and shadcn/ui.",
  },
  {
    title: "Pour Beauty",
    type: "Online Shop",
    kind: ["web"],
    img: pourbeauty,
    link: "https://www.purebeautybiological.com",
    github: "https://github.com/GeroWalther/pourBeauty",
    featured: true,
    summary:
      "Custom Full Stack E-Commerce Online Shop built with Next.js, TailwindCSS, Prisma, Stripe for payments, MongoDB for data storage and Resend for transactional emails. Fully functional, including a custom Admin Dashboard to manage products, orders and customers.",
  },
  {
    title: "Vision-X",
    type: "AI image & story generator",
    kind: ["ai", "web"],
    img: visionX,
    github: "https://github.com/GeroWalther/unlimited_ai",
    featured: true,
    summary:
      "AI-powered content generation platform built with Next.js, Supabase and React Query. Text and image generation across multiple models (Claude, Replicate and others), community sharing with likes and pagination, and optimistic UI updates for smooth interaction.",
  },
  {
    title: "MERN Stack + Docker",
    type: "Full Stack Application",
    kind: ["web"],
    img: mernDocker,
    github: "https://github.com/GeroWalther/assignment-node-react",
    featured: true,
    summary:
      "In-depth Node.js and Express backend, modern React frontend architecture, complete MongoDB and Mongoose engineering, and professional Docker development and production workflows. MVC architecture with proper separation of concerns.",
  },
  {
    title: "Polo and Lifestyle Magazine",
    type: "Swift iOS App",
    kind: ["mobile"],
    img: poloApp,
    link: "https://apps.apple.com/us/app/polo-lifestyle-magazine/id6740444400",
    github: "https://github.com/GeroWalther/poloMobileApp",
    appStore: true,
    featured: true,
    summary:
      "A custom Swift iOS app for the official Polo and Lifestyle Magazine, available on the App Store. Built with Swift and SwiftUI.",
  },
  {
    title: "Miss Glow",
    type: "Custom Online Shop",
    kind: ["web"],
    img: misGloww,
    link: "https://www.missglowbeauty.com/",
    github: "https://github.com/GeroWalther/missglow",
    featured: true,
    summary:
      "A custom full stack e-commerce shop built to a client's requirements, including a custom Admin Dashboard and a fast checkout. Next.js, Prisma, Stripe, TailwindCSS, MongoDB and Resend.",
  },
  {
    title: "justConvert",
    type: "React Native — App Store",
    kind: ["mobile"],
    img: justConvert,
    link: "https://apps.apple.com/us/app/justconvert/id6464125917",
    github: "https://github.com/GeroWalther/justConvert",
    appStore: true,
    featured: true,
    summary:
      "React Native Expo app for iOS and Android using the official Frankfurter Stock Exchange API to convert currencies precisely, plus lengths, weights, areas and volumes. NativeWind for styling and RevenueCat for in-app purchases.",
  },
  {
    title: "Don't Forget! Take a Note!",
    type: "React Native — App Store",
    kind: ["mobile"],
    img: dontforget,
    link: "https://apps.apple.com/ph/app/dont-forget-take-a-note/id6450320648",
    github: "https://github.com/GeroWalther/dontforget-g",
    appStore: true,
    featured: true,
    summary:
      "React Native Expo app on the Apple App Store. Capture, organise and never forget — a fast, focused note-taking app.",
  },
  {
    title: "POLO and Lifestyle Magazine",
    type: "Client Project — WordPress",
    kind: ["web"],
    img: polo,
    link: "https://poloandlifestylemagazine.com",
    featured: true,
    summary: "The official Polo and Lifestyle Magazine website.",
  },
  {
    title: "G-Drive",
    type: "File Management System",
    kind: ["web"],
    img: gDrive,
    link: "https://g-drive.gw-intech.com",
    github: "https://github.com/GeroWalther/g-drive",
    summary:
      "A Google Drive clone in Next.js and TailwindCSS with Clerk auth, a custom multi-type file upload mechanism, SingleStore and AWS S3 for storage.",
  },
  {
    title: "XTradeAI",
    type: "React Native App",
    kind: ["mobile", "ai"],
    img: xTradeApp,
    link: "https://apps.apple.com/es/app/xtradeai/id6743446333?l=en-GB",
    github: "https://github.com/GeroWalther/XTradeAI_mobile",
    appStore: true,
    summary:
      "Analyse stocks, indices, cryptocurrencies and commodities through a custom Python backend, combining latest news, macroeconomic data, technical analysis, sentiment and real-time price action.",
  },
  {
    title: "Climatic",
    type: "Native iOS — Swift",
    kind: ["mobile"],
    img: climatic,
    link: "https://apps.apple.com/es/app/climatic-current-weather/id6737645840?l=en-GB",
    github: "https://github.com/GeroWalther/clima",
    appStore: true,
    summary:
      "Native iOS app in Swift using the OpenWeatherMap API. Current weather from location tracking, or search any city.",
  },
  {
    title: "Pluto Market",
    type: "Digital Marketplace",
    kind: ["web"],
    img: pluto,
    link: "https://pluto-market.gw-intech.com/",
    github: "https://github.com/GeroWalther/pluto",
    summary:
      "Fullstack e-commerce marketplace for digital products. Next.js 14 App Router, NextAuth, tRPC, TypeScript, TailwindCSS, ShadCN, Stripe, MongoDB with Prisma.",
  },
  {
    title: "Moonlamp Online Shop",
    type: "E-Commerce Showcase",
    kind: ["web"],
    img: moonlamp,
    github: "https://github.com/GeroWalther/moonlamp-onlineshop",
    summary:
      "Built in TypeScript, React and Next.js 13 with the app router, Framer Motion for effects, Zustand for global state, TailwindCSS, Prisma and Stripe payments.",
  },
  {
    title: "GraphQL + Node API",
    type: "Backend API",
    kind: ["web"],
    img: graphQLNode,
    github: "https://github.com/GeroWalther/graphQLNodejs",
    summary:
      "Backend API in Node using GraphQL powered by Yoga and connected to MongoDB, with a custom schema and resolvers for all CRUD operations.",
  },
  {
    title: "Full Stack Threads App",
    type: "Next.js 13",
    kind: ["web"],
    img: threads,
    link: "https://threads.gw-intech.com/",
    github: "https://github.com/GeroWalther/threads",
    summary:
      "TypeScript full stack Threads app. Next.js 13 server and client components, MongoDB with Mongoose, Clerk auth, TailwindCSS, ShadCN with Zod and React Hook Form for validation.",
  },
  {
    title: "The Wild Oasis",
    type: "Advanced React Patterns",
    kind: ["web"],
    img: wildoasis,
    link: "https://wild-oasis-g.netlify.app/",
    github: "https://github.com/GeroWalther/world-oasis",
    summary:
      "Full stack React app using the compound component pattern and a modern stack: react-query, context API, styled components, error boundaries, date-fns, recharts, react-hook-form and Supabase for auth and storage.",
  },
  {
    title: "Twitter Clone",
    type: "React Native — Expo Router",
    kind: ["mobile"],
    img: twitter,
    github: "https://github.com/GeroWalther/twitter",
    summary: "React Native app built on Expo Router.",
  },
  {
    title: "Twitter Backend",
    type: "Express API",
    kind: ["web"],
    img: node,
    github: "https://github.com/GeroWalther/twitterBackend",
    summary: "Custom Express backend written for the Twitter clone.",
  },
  {
    title: "Next Blog",
    type: "Next.js",
    kind: ["web"],
    img: blog,
    link: "https://blog.gw-intech.com/",
    github: "https://github.com/GeroWalther/next-blog",
    summary: "A simple blog written in Next.js.",
  },
  {
    title: "Omnifood",
    type: "HTML & CSS",
    kind: ["web"],
    img: omnifood,
    link: "https://omnifood-gero.netlify.app",
    github: "https://github.com/GeroWalther/Omnifood-gero",
    summary: "Pure HTML and CSS website.",
  },
  {
    title: "Nike Shoe Store",
    type: "React Native",
    kind: ["mobile"],
    img: nike,
    github: "https://github.com/GeroWalther/nike",
    summary: "React Native mobile store frontend — Redux Toolkit, RTK Query and more.",
  },
  {
    title: "Nike Backend",
    type: "Express API",
    kind: ["web"],
    img: node,
    github: "https://github.com/GeroWalther/twitterBackend",
    summary: "Custom Express backend for the Nike shoe store, with Stripe payments.",
  },
  {
    title: "UPS inspired delivery App",
    type: "React Native",
    kind: ["mobile"],
    img: RNAPP,
    github: "https://github.com/GeroWalther/UPS",
    summary:
      "React Native mobile app — TypeScript, TailwindCSS, StepZen for GraphQL queries and a Firebase backend.",
  },
  {
    title: "AI Code-G",
    type: "OpenAI Chat Bot",
    kind: ["ai"],
    img: openAI,
    github: "https://github.com/GeroWalther/ai-code-g",
    summary: "AI chat bot built on OpenAI's API.",
  },
  {
    title: "Chirp",
    type: "T3 Stack Application",
    kind: ["web"],
    img: chirp,
    github: "https://github.com/GeroWalther/chirp",
    summary:
      "T3 Stack application using TypeScript, Next.js, TailwindCSS, tRPC, Prisma, Clerk for authentication and a PlanetScale database to build a fully functional emoji-only tweeting app.",
  },
  {
    title: "Gewitter",
    type: "T3 Stack Application",
    kind: ["web"],
    img: gewitter,
    github: "https://github.com/GeroWalther/gewitter",
    summary:
      "T3 Stack application using TypeScript, Next.js, TailwindCSS, tRPC, Prisma, NextAuth and a PlanetScale database to build a fully functional tweeting, liking and following app.",
  },
];

// The three downloadable Mac apps, in the order they should be surfaced.
export const APPS = PROJECTS.filter((p) => p.page);
