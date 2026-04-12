"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0,
    },
  },
};

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1] as const,
    },
  },
};

export function TextReveal({
  text,
  className,
  delay = 0,
  as: Tag = "h1",
}: TextRevealProps) {
  const words = text.split(" ");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ delayChildren: delay }}
      className={cn("flex flex-wrap gap-x-2", className)}
    >
      {words.map((word, i) => (
        <motion.span key={`${word}-${i}`} variants={wordVariants}>
          <Tag className="inline">{word}</Tag>
        </motion.span>
      ))}
    </motion.div>
  );
}
