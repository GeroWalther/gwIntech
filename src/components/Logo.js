import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

const Logo = () => {
  return (
    <div className="flex items-center justify-center mt-2">
      <MotionLink
        href="/"
        className="w-24 h-16 bg-dark text-light flex items-center justify-center text-lg rounded-2xl font-bold"
        whileHover={{
          backgroundColor: [
            "#000814",
            "#001d3d",
            "#003566",
            "#007bff",
            "#0a9dff",
            "#000814",
          ],
          // scale: 1.2,
          transition: { duration: 2, repeat: Infinity },
        }}
      >
        GW
      </MotionLink>
    </div>
  );
};

export default Logo;
