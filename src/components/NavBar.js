import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "./Logo";
import { GithubIcon, LinkedInIcon, TwitterIcon } from "./Icons";
import { motion } from "framer-motion";

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

  return (
    <Link href={href} className={`${className} relative group`}>
      {children}

      <span
        className={`h-[1px] inline-block bg-dark absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300 ${
          router.asPath === href ? "w-full" : "w-0"
        }`}
      >
        &nbsp;
      </span>
    </Link>
  );
};

const NavBar = () => {
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
      className="w-full px-24 py-12 font-medium flex items-center justify-between relative z-10 lg:px-16 md:px-12 sm:px-8"
      ref={navbarRef}
    >
      <button
        className="flex-col hidden lg:flex absolute left-12 top-9"
        onClick={handleClick}
      >
        <span
          className={`bg-dark transition-all duration-500 ease-out block h-0.5 w-10 rounded-sm transform ${
            isOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"
          }`}
        ></span>
        <span
          className={`bg-dark transition-all duration-500 ease-out block h-0.5 w-10 rounded-sm my-1 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`bg-dark transition-all duration-500 ease-out block h-0.5 w-10 rounded-sm transform ${
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
