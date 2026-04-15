"use client";

import { motion } from "framer-motion";

interface FloatingShapesProps {
    variant?: "default" | "sparse" | "dense";
}

export default function FloatingShapes({ variant = "default" }: FloatingShapesProps) {
    const shapes = variant === "sparse"
        ? [
            { type: "circle", x: "10%", y: "20%", size: 4, delay: 0 },
            { type: "circle", x: "85%", y: "40%", size: 3, delay: 1 },
            { type: "circle", x: "70%", y: "80%", size: 5, delay: 2 },
            { type: "diamond", x: "20%", y: "70%", size: 6, delay: 0.5 },
        ]
        : variant === "dense"
            ? [
                { type: "circle", x: "5%", y: "15%", size: 3, delay: 0 },
                { type: "circle", x: "90%", y: "25%", size: 4, delay: 0.5 },
                { type: "circle", x: "75%", y: "75%", size: 3, delay: 1 },
                { type: "diamond", x: "15%", y: "60%", size: 5, delay: 1.5 },
                { type: "circle", x: "50%", y: "10%", size: 2, delay: 0.3 },
                { type: "diamond", x: "60%", y: "90%", size: 4, delay: 2 },
                { type: "circle", x: "30%", y: "85%", size: 3, delay: 0.8 },
                { type: "circle", x: "80%", y: "50%", size: 2, delay: 1.2 },
            ]
            : [
                { type: "circle", x: "8%", y: "20%", size: 3, delay: 0 },
                { type: "circle", x: "88%", y: "30%", size: 4, delay: 0.8 },
                { type: "diamond", x: "15%", y: "70%", size: 5, delay: 1.5 },
                { type: "circle", x: "78%", y: "80%", size: 3, delay: 0.3 },
                { type: "circle", x: "45%", y: "5%", size: 2, delay: 2 },
                { type: "diamond", x: "65%", y: "95%", size: 4, delay: 1 },
            ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {shapes.map((shape, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{
                        left: shape.x,
                        top: shape.y,
                    }}
                    animate={{
                        y: [-10, 10, -10],
                        x: [-5, 5, -5],
                        opacity: [0.15, 0.35, 0.15],
                    }}
                    transition={{
                        duration: 5 + i * 0.5,
                        delay: shape.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    {shape.type === "circle" ? (
                        <div
                            className="rounded-full border border-accent/20"
                            style={{
                                width: shape.size * 2,
                                height: shape.size * 2,
                            }}
                        />
                    ) : (
                        <div
                            className="border border-accent/20 rotate-45"
                            style={{
                                width: shape.size * 2,
                                height: shape.size * 2,
                            }}
                        />
                    )}
                </motion.div>
            ))}
        </div>
    );
}
