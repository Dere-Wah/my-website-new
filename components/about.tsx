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
						I’m bad at intros. Let’s just get that out of the way.
					</p>
					<p className="text-lg leading-relaxed pt-20">
						What I *am* good at is sinking way too much time into
						overly ambitious side projects that no one asked for and
						few will ever see.
					</p>
					<p className="text-lg leading-relaxed">
						To trick myself into finishing things, I started a blog.
						Writing about my projects while I work on them weirdly
						keeps me on track.
					</p>

					<p className="text-lg leading-relaxed">
						Take a look around! There’s probably something
						half-finished with a dramatic title waiting for you.
					</p>
				</div>
			</motion.div>
		</section>
	);
}
