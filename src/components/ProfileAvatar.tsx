"use client";

import { motion } from "framer-motion";

export default function ProfileAvatar() {
  return (
    <div className="relative">
      {/* Glow ring */}
      <motion.div
        className="absolute -inset-2 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, #d4a853, #e8c97a, #b8922e, #d4a853)",
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

      {/* Avatar container */}
      <motion.div
        className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-accent/40 bg-surface"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
      >
        {/* Abstract avatar illustration */}
        <svg viewBox="0 0 128 128" className="w-full h-full" fill="none">
          {/* Background */}
          <rect width="128" height="128" fill="#12121a" />
          
          {/* Abstract geometric portrait */}
          <circle cx="64" cy="48" r="22" fill="#d4a853" opacity="0.9" />
          <path
            d="M35 95 Q35 72, 64 72 Q93 72, 93 95 L93 128 L35 128Z"
            fill="#d4a853"
            opacity="0.7"
          />
          
          {/* Decorative accents */}
          <circle cx="58" cy="44" r="2.5" fill="#12121a" />
          <circle cx="70" cy="44" r="2.5" fill="#12121a" />
          <path
            d="M58 54 Q64 58, 70 54"
            stroke="#12121a"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Code brackets decoration */}
          <motion.text
            x="20"
            y="115"
            fill="#e8c97a"
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
            fill="#e8c97a"
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
