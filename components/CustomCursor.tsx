'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);

    // Mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring for the light (slight delay for elegance)
    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveMouse = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        window.addEventListener('mousemove', moveMouse);
        return () => {
            window.removeEventListener('mousemove', moveMouse);
        };
    }, [mouseX, mouseY, isVisible]);

    if (!isVisible) return null;

    return (
        <>
            {/* Spotlight Glow - Soft Light Blend */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-30 opacity-60"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    width: 800,
                    height: 800,
                    background: `radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 60%)`, // Even softer
                    mixBlendMode: 'plus-lighter' // Adds very subtle light
                }}
            />
        </>
    );
}
