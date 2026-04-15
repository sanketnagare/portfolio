"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

interface AnimatedTextProps {
    text: string;
    className?: string;
    delay?: number;
    as?: "h1" | "h2" | "h3" | "p" | "span";
    splitBy?: "word" | "character";
}

export default function AnimatedText({
    text,
    className = "",
    delay = 0,
    as: Tag = "p",
    splitBy = "word",
}: AnimatedTextProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    const items = splitBy === "word" ? text.split(" ") : text.split("");

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: {
                staggerChildren: splitBy === "word" ? 0.08 : 0.03,
                delayChildren: delay,
            },
        }),
    };

    const child: Variants = {
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
                type: "spring",
                damping: 20,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={container}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`flex flex-wrap ${className}`}
            aria-label={text}
        >
            {items.map((item, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    className="inline-block"
                    style={{
                        marginRight: splitBy === "word" ? "0.3em" : undefined,
                    }}
                >
                    {Tag === "h1" || Tag === "h2" || Tag === "h3" ? (
                        <span className={className}>{item}</span>
                    ) : (
                        item
                    )}
                </motion.span>
            ))}
        </motion.div>
    );
}
