import React from "react";
import { motion } from "framer-motion";

const quote = {
  initial: {
    opacity: 0, // or 1 with staggerChildren
  },
  animate: {
    opacity: 1,
    transition: {
      delay: 0.5,
      // staggerChildren: 0.1,
    },
  },
};
const singleword = {
  initial: {
    opacity: 0,
    y: 60,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
    },
  },
};

const AnimatedTxt = ({ text, className = "" }) => {
  return (
    <div
      className={
        "w-full mx-auto py-2 flex items-center justify-center text-center overflow-hidden sm:py-0"
      }
    >
      <motion.h1
        className={`inline-blog w-full text-dark font-bold capitalize text-5xl ${className}`}
        variants={quote}
        initial="initial"
        animate="animate"
      >
        {text.split(" ").map((word, index) => (
          <motion.span
            key={word + "-" + index}
            className="inline-block"
            variants={singleword}
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
};

export default AnimatedTxt;
