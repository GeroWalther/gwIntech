import React from "react";
import Layout from "./Layout";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t-2 border-solid border-dark text-lg sm:text-sm">
      <Layout
        className={"py-8 flex items-center justify-between lg:flex-col lg:py-6"}
      >
        <span className="lg:pb-2">
          {new Date().getFullYear()} &copy; All Rights Reserved built by
          GW-InTech <span className="text-primary text-2xl">&hearts;</span>
        </span>
        <Link
          href="mailto:gero.walther@gmail.com"
          className="border-b-2 border-transparent hover:border-b-2 hover:border-dark "
        >
          Contact & Business Inquiries
        </Link>
      </Layout>
    </footer>
  );
};

export default Footer;
