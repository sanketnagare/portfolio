"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ProfileAvatar() {
  return (
    <motion.div
      className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-lg overflow-hidden bg-surface border border-border"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* The source is already a square, centred headshot, so it fills the
          square frame 1:1 -- no crop or zoom transform needed. */}
      <Image
        src="/photo.png"
        alt="Sanket Nagare"
        fill
        className="object-cover"
        sizes="(max-width: 640px) 144px, 160px"
        quality={100}
        priority
      />
    </motion.div>
  );
}
