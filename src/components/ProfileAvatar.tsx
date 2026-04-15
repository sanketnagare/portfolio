"use client";

import { motion } from "framer-motion";

export default function ProfileAvatar() {
  return (
    <div className="relative">
      <motion.div
        className="absolute -inset-2 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, var(--color-accent-dark), var(--color-accent-light), var(--color-accent), var(--color-accent-dark))",
          opacity: 0.4,
          filter: "blur(8px)",
        }}
        animate={{
          rotate: 360,
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <motion.div
        className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-accent/40 bg-surface"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
      >
        <svg viewBox="0 0 128 128" className="w-full h-full" fill="none">
          <rect width="128" height="128" className="fill-surface" />
          
          <circle cx="64" cy="48" r="22" className="fill-accent" opacity="0.9" />
          <path
            d="M35 95 Q35 72, 64 72 Q93 72, 93 95 L93 128 L35 128Z"
            className="fill-accent"
            opacity="0.7"
          />
          
          <circle cx="58" cy="44" r="2.5" className="fill-surface" />
          <circle cx="70" cy="44" r="2.5" className="fill-surface" />
          <path
            d="M58 54 Q64 58, 70 54"
            className="stroke-surface"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          
          <motion.text
            x="20"
            y="115"
            className="fill-accent-light"
            fontSize="14"
            fontFamily="monospace"
            opacity="0.4"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {"<"}
          </motion.text>
          <motion.text
            x="100"
            y="115"
            className="fill-accent-light"
            fontSize="14"
            fontFamily="monospace"
            opacity="0.4"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            {"/>"}
          </motion.text>
        </svg>
      </motion.div>
    </div>
  );
}