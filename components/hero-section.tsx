"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import SocialLinks from "./social-links";
import { motion } from "framer-motion";
import Greeting from "./greeting";
import { useEffect } from "react";

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
  useEffect(() => {
    fetch("/api/newsletter/trigger", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, []);

  return (
    <section className="pt-24 md:pt-32">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="prose dark:prose-invert max-w-none"
      >
        <motion.h1
          variants={item}
          className="text-4xl md:text-5xl font-bold tracking-tight -mb-4"
        >
          <Greeting />
        </motion.h1>

        <motion.div variants={item} className="relative">
          <motion.p className="text-xl md:text-2xl text-muted-foreground mb-10 font-medium italic tracking-wide flex items-center gap-2">
            <Icon icon="mdi:certificate" className="text-yellow-500 text-2xl" />
            Certified duct tape engineer
          </motion.p>
        </motion.div>

        <motion.div variants={item}>
          <SocialLinks />
        </motion.div>
      </motion.div>
    </section>
  );
}
