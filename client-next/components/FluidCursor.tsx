"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function FluidCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    // Smooth springs for delayed follow effect
    const cursorX = useSpring(mousePosition.x, { stiffness: 100, damping: 20, mass: 0.5 });
    const cursorY = useSpring(mousePosition.y, { stiffness: 100, damping: 20, mass: 0.5 });

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName.toLowerCase() === "button" ||
                target.tagName.toLowerCase() === "a" ||
                target.closest("button") ||
                target.closest("a")
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    // Update spring targets when mouse moves
    useEffect(() => {
        cursorX.set(mousePosition.x - 16); // Center the 32px cursor
        cursorY.set(mousePosition.y - 16);
    }, [mousePosition, cursorX, cursorY]);

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary-container pointer-events-none z-[9999] mix-blend-screen"
            style={{
                x: cursorX,
                y: cursorY,
                backgroundColor: "rgba(212, 175, 55, 0.1)",
                boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)",
            }}
            animate={{
                scale: isHovering ? 1.5 : 1,
                backgroundColor: isHovering ? "rgba(212, 175, 55, 0.3)" : "rgba(212, 175, 55, 0.1)",
            }}
            transition={{ duration: 0.2 }}
        />
    );
}
