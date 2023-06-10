import React from "react";
import { motion } from "framer-motion";

const Skill = ({ skill, x, y }) => {
  return (
    <motion.div
      className="flex items-center justify-center rounded-full font-semibold bg-dark text-light py-3 px-6 shadow-dark cursor-pointer absolute lg:py-2 lg:px-4 md:text-sm md:py-1.5 md:px-3 xs:bg-transparent xs:text-dark xs:font-bold"
      whileHover={{ scale: 1.05 }}
      initial={{ x: 0, y: 0 }}
      whileInView={{ x, y }}
      transition={{ duration: 2 }}
      viewport={{ once: true }}
    >
      {skill}
    </motion.div>
  );
};

const Skills = () => {
  return (
    <>
      <h2 className="font-bold text-5xl mt-52 md:mt-40 w-full text-center sm:text-4xl">
        Skills
      </h2>
      <div className="w-full h-screen relative flex items-center justify-center rounded-full bg-circularLight lg:h-[80vh] sm:h-[60vh] xs:h-[50vh] lg:bg-circularLightLg md:bg-circularLightMd sm:bg-circularLightSm">
        <motion.div
          className="flex items-center justify-center rounded-full font-semibold bg-dark text-light p-8 shadow-dark cursor-pointer lg:p-6 md:p-4 xs:text-xs xs:p-2"
          whileHover={{ scale: 1.05 }}
        >
          App
        </motion.div>
        <Skill skill="CSS" x="-6vw" y="-13vw" />
        <Skill skill="HTML" x="14vw" y="-8vw" />
        <Skill skill="JavaScript" x="-0vw" y="13vw" />
        <Skill skill="TypeScript" x="-15vw" y="6vw" />
        <Skill skill="ReactJS" x="-20vw" y="-11vw" />
        <Skill skill="React-Native" x="23vw" y="7vw" />
        <Skill skill="TailwindCSS" x="6vw" y="24vw" />
        <Skill skill="Redux" x="6vw" y="-20vw" />
        <Skill skill="Prisma" x="-29vw" y="22vw" />
        <Skill skill="tRPC" x="22vw" y="-22vw" />
        <Skill skill="NextJS" x="-10vw" y="-23vw" />
        <Skill skill="NodeJS" x="-16vw" y="-4vw" />
        <Skill skill="ReactQuery" x="28vw" y="20vw" />
        <Skill skill="Sass" x="-34vw" y="-3vw" />
        <Skill skill="Apollo" x="33vw" y="-5vw" />
        <Skill skill="GraphQL" x="-29vw" y="13vw" />
        <Skill skill="Zod" x="-30vw" y="-21vw" />
        <Skill skill="MongoDB" x="32vw" y="-15vw" />
        <Skill skill="PlanetScale" x="-15vw" y="28vw" />
      </div>
    </>
  );
};

export default Skills;
