"use client";

import { motion } from "framer-motion";

export default function HeroIllustration() {
    return (
        <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
            <svg
                viewBox="0 0 500 500"
                className="w-full h-full max-w-[500px]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Orbiting rings */}
                <motion.ellipse
                    cx="250"
                    cy="250"
                    rx="180"
                    ry="60"
                    stroke="#d4a853"
                    strokeWidth="0.8"
                    opacity="0.3"
                    initial={{ rotate: -20 }}
                    animate={{ rotate: 340 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "250px 250px" }}
                />
                <motion.ellipse
                    cx="250"
                    cy="250"
                    rx="160"
                    ry="50"
                    stroke="#e8c97a"
                    strokeWidth="0.5"
                    opacity="0.2"
                    initial={{ rotate: 40 }}
                    animate={{ rotate: -320 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "250px 250px" }}
                />
                <motion.ellipse
                    cx="250"
                    cy="250"
                    rx="200"
                    ry="70"
                    stroke="#d4a853"
                    strokeWidth="0.4"
                    opacity="0.15"
                    initial={{ rotate: -60 }}
                    animate={{ rotate: 300 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "250px 250px" }}
                />

                {/* Central core - morphing shape */}
                <motion.circle
                    cx="250"
                    cy="250"
                    r="40"
                    fill="url(#coreGradient)"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.6, 0.9, 0.6],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.circle
                    cx="250"
                    cy="250"
                    r="55"
                    stroke="#d4a853"
                    strokeWidth="1"
                    fill="none"
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Orbiting dots */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <motion.circle
                        key={i}
                        r={3 + (i % 3)}
                        fill={i % 2 === 0 ? "#d4a853" : "#e8c97a"}
                        opacity={0.6}
                        animate={{
                            cx: [
                                250 + Math.cos((angle * Math.PI) / 180) * (120 + i * 10),
                                250 + Math.cos(((angle + 360) * Math.PI) / 180) * (120 + i * 10),
                            ],
                            cy: [
                                250 + Math.sin((angle * Math.PI) / 180) * (120 + i * 10),
                                250 + Math.sin(((angle + 360) * Math.PI) / 180) * (120 + i * 10),
                            ],
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}

                {/* Connecting lines from center to dots */}
                {[45, 135, 225, 315].map((angle, i) => (
                    <motion.line
                        key={`line-${i}`}
                        x1="250"
                        y1="250"
                        x2={250 + Math.cos((angle * Math.PI) / 180) * 150}
                        y2={250 + Math.sin((angle * Math.PI) / 180) * 150}
                        stroke="#d4a853"
                        strokeWidth="0.5"
                        opacity={0.15}
                        strokeDasharray="4 8"
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 3,
                            delay: i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                {/* Decorative small circles */}
                {[
                    { cx: 150, cy: 130, r: 2 },
                    { cx: 350, cy: 150, r: 3 },
                    { cx: 130, cy: 350, r: 2.5 },
                    { cx: 370, cy: 340, r: 2 },
                    { cx: 200, cy: 400, r: 1.5 },
                    { cx: 320, cy: 100, r: 2 },
                ].map((dot, i) => (
                    <motion.circle
                        key={`deco-${i}`}
                        cx={dot.cx}
                        cy={dot.cy}
                        r={dot.r}
                        fill="#d4a853"
                        animate={{
                            opacity: [0.2, 0.7, 0.2],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 2 + i * 0.5,
                            delay: i * 0.3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                {/* Gradient definitions */}
                <defs>
                    <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#e8c97a" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#d4a853" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#b8922e" stopOpacity="0.1" />
                    </radialGradient>
                </defs>
            </svg>
        </div>
    );
}
