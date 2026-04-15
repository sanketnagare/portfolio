"use client";

import { motion } from "framer-motion";

export default function ContactIllustration() {
    const nodes = [
        { x: 200, y: 100 },
        { x: 100, y: 200 },
        { x: 300, y: 200 },
        { x: 150, y: 300 },
        { x: 250, y: 300 },
        { x: 200, y: 200 },
    ];

    const connections = [
        [0, 5], [1, 5], [2, 5], [3, 5], [4, 5],
        [0, 1], [0, 2], [1, 3], [2, 4], [3, 4],
    ];

    return (
        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
            <svg
                viewBox="0 0 400 400"
                className="w-full h-full max-w-[350px]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Connection lines */}
                {connections.map(([from, to], i) => (
                    <motion.line
                        key={`conn-${i}`}
                        x1={nodes[from].x}
                        y1={nodes[from].y}
                        x2={nodes[to].x}
                        y2={nodes[to].y}
                        stroke="#d4a853"
                        strokeWidth="1"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.1, 0.4, 0.1],
                        }}
                        transition={{
                            pathLength: { duration: 1.5, delay: i * 0.15 },
                            opacity: { duration: 3, delay: i * 0.15, repeat: Infinity, ease: "easeInOut" },
                        }}
                    />
                ))}

                {/* Pulse rings on center node */}
                {[0, 1, 2].map((i) => (
                    <motion.circle
                        key={`pulse-${i}`}
                        cx={200}
                        cy={200}
                        r={20}
                        stroke="#d4a853"
                        strokeWidth="0.5"
                        fill="none"
                        animate={{
                            r: [20, 60],
                            opacity: [0.4, 0],
                        }}
                        transition={{
                            duration: 3,
                            delay: i * 1,
                            repeat: Infinity,
                            ease: "easeOut",
                        }}
                    />
                ))}

                {/* Node circles */}
                {nodes.map((node, i) => (
                    <motion.circle
                        key={`node-${i}`}
                        cx={node.x}
                        cy={node.y}
                        r={i === 5 ? 10 : 6}
                        fill={i === 5 ? "#d4a853" : "transparent"}
                        stroke="#d4a853"
                        strokeWidth={i === 5 ? 0 : 1.5}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                            duration: 2,
                            delay: i * 0.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                {/* Data flow particles along connections */}
                {connections.slice(0, 5).map(([from, to], i) => {
                    const dx = nodes[to].x - nodes[from].x;
                    const dy = nodes[to].y - nodes[from].y;
                    return (
                        <motion.circle
                            key={`flow-${i}`}
                            r={2}
                            fill="#e8c97a"
                            animate={{
                                cx: [nodes[from].x, nodes[to].x],
                                cy: [nodes[from].y, nodes[to].y],
                                opacity: [0, 0.8, 0],
                            }}
                            transition={{
                                duration: 2,
                                delay: i * 0.4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    );
                })}

                {/* Ambient dots */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <motion.circle
                        key={`ambient-${i}`}
                        cx={50 + Math.random() * 300}
                        cy={50 + Math.random() * 300}
                        r={1}
                        fill="#d4a853"
                        animate={{
                            opacity: [0, 0.4, 0],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            delay: Math.random() * 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}
