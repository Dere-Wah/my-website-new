"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "@/components/ui/shield";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Birth from "./birth";

export default function About() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-4">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="prose dark:prose-invert max-w-none space-y-6"
      >
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            I'm <Birth /> studying Computer Engineering at{" "}
            <Shield
              text="Politecnico di Milano"
              icon="emojione:flag-for-italy"
              href="https://www.polimi.it/"
              variant="subtle"
            />
          </p>

          <p className="text-lg leading-relaxed italic">
            You never know what I'll be working on next...
          </p>
          <p className="text-lg leading-relaxed">
            One day, I could be crafting a cutting-edge web application; the
            next, I'm training an AI model for simulation. I might dive into
            game development, create quirky indie projects, or build automated
            content pipelines.
          </p>

          <p className="text-lg leading-relaxed">
            For me, every project is an adventure, a chance to explore new
            frontiers in tech. I thrive on the challenge of learning something
            fresh and love sharing the projects I bring to life.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
