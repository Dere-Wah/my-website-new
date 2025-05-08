"use client";

import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const waveAnimation = {
  rotate: [0, -15, 10, -15, 10, 0],
  transition: {
    duration: 1.5,
    ease: "easeInOut",
    times: [0, 0.2, 0.4, 0.6, 0.8, 1],
  },
};

const speechBubbleVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

export default function Greeting() {
  const controls = useAnimationControls();
  const [clickCount, setClickCount] = useState(0);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showAka, setShowAka] = useState(false);
  const isAnimating = useRef(false);

  const handleHiClick = async () => {
    if (isAnimating.current) return;

    setShowSpeechBubble(false);
    isAnimating.current = true;
    await fetch("/api/greet");
    await controls.start(waveAnimation);
    isAnimating.current = false;

    setClickCount((prev) => prev + 1);
  };

  const getSpeechBubbleText = (count: number) => {
    if (count > 20) return "Woah, you really do have a LOT of free time";
    if (count > 10) return "Oh, you really hate me...";
    return "Click me!\nEach time you click, I get a notification.";
  };

  useEffect(() => {
    controls.start(waveAnimation);
    isAnimating.current = true;

    const animationTimeout = setTimeout(() => {
      isAnimating.current = false;
    }, 1500);

    const initialTimeout = setTimeout(() => {
      const initialMessage = getSpeechBubbleText(clickCount);
      setCurrentMessage(initialMessage);
      setShowSpeechBubble(true);
    }, 5000 + Math.random() * 5000);

    // Show the aka text after a delay
    const akaTimeout = setTimeout(() => {
      setShowAka(true);
    }, 2000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(animationTimeout);
      clearTimeout(akaTimeout);
    };
  }, []);

  useEffect(() => {
    if (clickCount > 0) {
      const newMessage = getSpeechBubbleText(clickCount);
      if (newMessage !== currentMessage) {
        const messageTimeout = setTimeout(() => {
          setCurrentMessage(newMessage);
          setShowSpeechBubble(true);
        }, 1000);

        return () => clearTimeout(messageTimeout);
      }
    }
  }, [clickCount, currentMessage]);

  return (
    <div className="relative items-center gap-2 flex flex-wrap">
      <AnimatePresence>
        {showSpeechBubble && (
          <motion.div
            variants={speechBubbleVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute -top-20 left-8 bg-card/95 border border-border/40 rounded-lg px-4 py-2 text-sm text-muted-foreground whitespace-pre-line shadow-xl"
          >
            <div className="relative">
              {currentMessage}
              <div className="absolute -bottom-4 left-8 w-3 h-3 bg-card/95 border-b border-r border-border/40 transform rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 dark:from-blue-400 dark:via-cyan-400 dark:to-sky-400 bg-clip-text text-transparent">
        <span className="inline-block cursor-pointer" onClick={handleHiClick}>
          Hi
        </span>
      </span>
      <motion.span
        animate={controls}
        className="inline-block cursor-pointer"
        onClick={handleHiClick}
        style={{
          display: "inline-block",
          transformOrigin: "60% 60%",
          willChange: "transform",
        }}
      >
        👋
      </motion.span>
      <span className="whitespace-nowrap bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 dark:from-blue-400 dark:via-cyan-400 dark:to-sky-400 bg-clip-text text-transparent">
        , I'm Dere*
      </span>
      <AnimatePresence>
        {showAka ? (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm text-muted-foreground ml-2 md:mt-4 w-full text-end"
          >
            *(aka Davide)
          </motion.span>
        ) : (
          <div className="text-sm text-muted-foreground/0 ml-2 md:mt-4 w-full text-end">
            i
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
