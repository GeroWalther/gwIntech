import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "./Logo";
import { GithubIcon, LinkedInIcon, TwitterIcon } from "./Icons";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

const CustomMobileLink = ({ href, children, className = "", toggle }) => {
  const router = useRouter();

  const handleClick = () => {
    toggle();
    router.push(href);
  };

  return (
    <button
      href={href}
      className={`${className} relative group text-light my-3`}
      onClick={handleClick}
    >
      {children}

      <span
        className={`h-[1px] inline-block bg-light absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300 ${
          router.asPath === href ? "w-full" : "w-0"
        }`}
      >
        &nbsp;
      </span>
    </button>
  );
};
const CustomLink = ({ href, children, className = "" }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <Link href={href} className={`${className} relative group`}>
      {children}

      <span
        className={`h-[1px] inline-block absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300 ${
          dark ? "bg-light" : "bg-dark"
        } ${router.asPath === href ? "w-full" : "w-0"}`}
      >
        &nbsp;
      </span>
    </Link>
  );
};

/**
 * Light/dark switch. Only appears on routes that actually honour the choice —
 * offering it on a page pinned to dark would be a control that does nothing.
 *
 * Until it has mounted it renders a fixed icon, because the server has no way
 * to know the stored preference and a mismatched first render would hydrate
 * with the wrong glyph.
 */
const ThemeToggle = ({ className = "", onDarkGround = false }) => {
  const { theme, themeable, mounted, toggle } = useTheme();
  if (!themeable) return null;

  const dark = mounted && theme === "dark";
  // The mobile menu is a dark sheet whatever the page theme is, so the button
  // inside it has to be styled for that ground, not for the page's.
  const light = onDarkGround || dark;

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.9 }}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex h-8 w-8 items-center justify-center rounded-full border border-solid transition-colors ${
        light
          ? "border-white/25 text-light hover:bg-white/10"
          : "border-dark/25 text-dark hover:bg-dark/10"
      } ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {dark ? (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
          </>
        )}
      </svg>
    </motion.button>
  );
};

const NavBar = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className={`w-full px-24 py-12 font-medium flex items-center justify-between relative z-10 lg:px-16 md:px-12 sm:px-8 ${
        dark ? "text-light" : "text-dark"
      }`}
      ref={navbarRef}
    >
      <button
        className="flex-col hidden lg:flex absolute left-12 top-9"
        onClick={handleClick}
      >
        <span
          className={`${dark ? "bg-light" : "bg-dark"} transition-all duration-500 ease-out block h-0.5 w-10 rounded-sm transform ${
            isOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"
          }`}
        ></span>
        <span
          className={`${dark ? "bg-light" : "bg-dark"} transition-all duration-500 ease-out block h-0.5 w-10 rounded-sm my-1 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`${dark ? "bg-light" : "bg-dark"} transition-all duration-500 ease-out block h-0.5 w-10 rounded-sm transform ${
            isOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"
          }`}
        ></span>
      </button>

      <div className="w-full flex justify-between items-center lg:hidden">
        <nav>
          <CustomLink href="/" className="mr-4">
            Home
          </CustomLink>
          <CustomLink href="/projects" className="mx-4">
            My Projects
          </CustomLink>
          <CustomLink href="/ai-box" className="mx-4">
            AI Box
          </CustomLink>
          <CustomLink href="/solutions" className="mx-4">
            Solutions
          </CustomLink>
          <CustomLink href="/about" className="ml-4">
            About
          </CustomLink>
        </nav>

        <nav className="flex items-center justify-center flex-wrap">
          <motion.a
            href="https://twitter.com/GeroWalther"
            target={"_blank"}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-7 mr-3"
          >
            <TwitterIcon />
          </motion.a>
          <motion.a
            href="https://github.com/GeroWalther"
            target={"_blank"}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-7 mx-3"
          >
            <GithubIcon />
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/gero-walther-4b584320a/"
            target={"_blank"}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-7 ml-3"
          >
            <LinkedInIcon />
          </motion.a>
          <ThemeToggle className="ml-5" />
        </nav>
      </div>

      {isOpen ? (
        <motion.div
          initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-w-[70vw] flex flex-col justify-between items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-dark/90 rounded-lg backdrop-blur-md py-48"
        >
          <nav className="flex items-center flex-col justify-center">
            <CustomMobileLink href="/" className="" toggle={handleClick}>
              Home
            </CustomMobileLink>
            <CustomMobileLink
              href="/projects"
              className=""
              toggle={handleClick}
            >
              My Projects
            </CustomMobileLink>
            <CustomMobileLink
              href="/ai-box"
              className=""
              toggle={handleClick}
            >
              AI Box
            </CustomMobileLink>
            <CustomMobileLink
              href="/solutions"
              className=""
              toggle={handleClick}
            >
              Solutions
            </CustomMobileLink>
            <CustomMobileLink href="/about" className="" toggle={handleClick}>
              About
            </CustomMobileLink>
          </nav>

          <nav className="flex items-center justify-center flex-wrap mt-6">
            <motion.a
              href="https://twitter.com/GeroWalther"
              target={"_blank"}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-7 mr-3 "
            >
              <TwitterIcon />
            </motion.a>
            <motion.a
              href="https://github.com/GeroWalther"
              target={"_blank"}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-7 mx-3 bg-light rounded-full"
            >
              <GithubIcon />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/gero-walther-4b584320a/"
              target={"_blank"}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-7 ml-3"
            >
              <LinkedInIcon />
            </motion.a>
            <ThemeToggle className="ml-5" onDarkGround />
          </nav>
        </motion.div>
      ) : null}

      <div className="absolute left-[50%] top-2 translate-x-[-50%]">
        <Logo />
      </div>
    </header>
  );
};

export default NavBar;
