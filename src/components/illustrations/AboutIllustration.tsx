"use client";

import { motion } from "framer-motion";

export default function AboutIllustration() {
    return (
        <div className="relative w-full h-full min-h-[350px] flex items-center justify-center">
            <svg
                viewBox="0 0 400 400"
                className="w-full h-full max-w-[400px]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Flowing organic shape - main blob */}
                <motion.path
                    d="M200 80 C260 80, 320 120, 320 200 C320 280, 260 320, 200 320 C140 320, 80 280, 80 200 C80 120, 140 80, 200 80Z"
                    fill="url(#aboutGradient)"
                    animate={{
                        d: [
                            "M200 80 C260 80, 320 120, 320 200 C320 280, 260 320, 200 320 C140 320, 80 280, 80 200 C80 120, 140 80, 200 80Z",
                            "M200 90 C270 70, 330 130, 310 200 C290 270, 250 330, 200 310 C150 330, 70 270, 90 200 C70 130, 130 70, 200 90Z",
                            "M200 80 C260 80, 320 120, 320 200 C320 280, 260 320, 200 320 C140 320, 80 280, 80 200 C80 120, 140 80, 200 80Z",
                        ],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Inner ring */}
                <motion.circle
                    cx="200"
                    cy="200"
                    r="80"
                    stroke="#d4a853"
                    strokeWidth="0.8"
                    fill="none"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Growing branches */}
                {[0, 72, 144, 216, 288].map((angle, i) => {
                    const x2 = 200 + Math.cos((angle * Math.PI) / 180) * 120;
                    const y2 = 200 + Math.sin((angle * Math.PI) / 180) * 120;
                    return (
                        <motion.line
                            key={i}
                            x1="200"
                            y1="200"
                            x2={x2}
                            y2={y2}
                            stroke="#d4a853"
                            strokeWidth="1"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                                pathLength: [0, 1],
                                opacity: [0, 0.4],
                            }}
                            transition={{
                                duration: 2,
                                delay: i * 0.3,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut",
                            }}
                        />
                    );
                })}

                {/* Leaf/node points at branch ends */}
                {[0, 72, 144, 216, 288].map((angle, i) => {
                    const cx = 200 + Math.cos((angle * Math.PI) / 180) * 120;
                    const cy = 200 + Math.sin((angle * Math.PI) / 180) * 120;
                    return (
                        <motion.circle
                            key={`node-${i}`}
                            cx={cx}
                            cy={cy}
                            r="6"
                            fill="#d4a853"
                            animate={{
                                opacity: [0, 0.8, 0],
                                scale: [0.5, 1.2, 0.5],
                            }}
                            transition={{
                                duration: 3,
                                delay: i * 0.3 + 1,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    );
                })}

                {/* Floating particles */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.circle
                        key={`particle-${i}`}
                        r={1.5}
                        fill="#e8c97a"
                        animate={{
                            cx: [100 + i * 35, 120 + i * 30, 100 + i * 35],
                            cy: [150 + (i % 3) * 50, 130 + (i % 3) * 60, 150 + (i % 3) * 50],
                            opacity: [0.1, 0.5, 0.1],
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                <defs>
                    <radialGradient id="aboutGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#d4a853" stopOpacity="0.15" />
                        <stop offset="70%" stopColor="#d4a853" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#d4a853" stopOpacity="0" />
                    </radialGradient>
                </defs>
            </svg>
        </div>
    );
}
