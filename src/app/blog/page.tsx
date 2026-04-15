"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import SectionWrapper from "@/components/SectionWrapper";

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pb-24 relative z-10">
        <motion.div
          className="pt-32 pb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
            Blog
          </h1>
          <p className="text-muted text-lg">
            Thoughts on AI, software development, and technology.
          </p>
        </motion.div>

        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-border bg-surface p-10 sm:p-16 text-center relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                background: [
                  "radial-gradient(circle at 30% 50%, rgba(212,168,83,0.03) 0%, transparent 50%)",
                  "radial-gradient(circle at 70% 50%, rgba(212,168,83,0.05) 0%, transparent 50%)",
                  "radial-gradient(circle at 30% 50%, rgba(212,168,83,0.03) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 mb-8"
            >
              <svg
                className="w-10 h-10 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="font-heading text-2xl sm:text-3xl font-bold mb-4"
            >
              Writing about AI soon
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-muted max-w-lg mx-auto mb-8 leading-relaxed"
            >
              I&apos;m working on some interesting pieces about artificial intelligence,
              machine learning, and how these technologies are shaping the future of
              software development. Stay tuned!
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="flex items-center justify-center gap-2"
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-2 text-sm text-accent font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-accent" />
                Coming soon
              </motion.span>
            </motion.div>
          </motion.div>
        </SectionWrapper>
      </main>
    </>
  );
}
