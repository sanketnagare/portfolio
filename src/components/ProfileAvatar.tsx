"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ProfileAvatar() {
  return (
    <motion.div
      className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-lg overflow-hidden bg-surface border border-border"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Image
        src="/photo.jpeg"
        alt="Sanket Nagare"
        fill
        className="object-cover scale-[1.15] origin-[50%_65%]"
        sizes="(max-width: 640px) 256px, 384px"
        quality={100}
        priority
      />
    </motion.div>
  );
}
