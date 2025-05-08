"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import SocialLinks from "./social-links";
import { motion } from "framer-motion";
import Greeting from "./greeting";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function HeroSection() {
  return (
    <section className="pt-12 md:pt-32">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="prose dark:prose-invert max-w-none"
      >
        <motion.h1
          variants={item}
          className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
        >
          <Greeting />
        </motion.h1>

        <motion.div variants={item} className="relative">
          <motion.p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            A curious mind exploring the vast world of technology.
            <br />
            From crafting web experiences to training AI models, I love turning
            wild ideas into reality through code.
          </motion.p>
        </motion.div>

        <motion.div variants={item}>
          <SocialLinks />
        </motion.div>
      </motion.div>
    </section>
  );
}
