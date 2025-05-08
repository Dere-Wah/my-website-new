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
            You can never know what you'll find me working on...
          </p>
          <p className="text-lg leading-relaxed">
            One day I might be crafting a sleek web application, the next day
            training an AI model to simulate a game. Sometimes I'm diving into
            game development, creating (bad) indie games, or maybe you'll catch
            me building automated content pipelines.
          </p>

          <p className="text-lg leading-relaxed">
            Every project is a new adventure, a chance to explore uncharted
            territories in tech. I seek the challenge of learning something new,
            and sharing with people projects I create.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
