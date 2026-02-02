/**
 * Window Animation Configurations
 * 
 * Framer Motion animation variants for authentic macOS window animations.
 */

import { Variants, Transition } from 'framer-motion';

/**
 * Spring transition for smooth macOS-like motion
 */
export const springTransition: Transition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 1,
};

/**
 * Snappy spring for quick interactions
 */
export const snappySpring: Transition = {
    type: 'spring',
    stiffness: 400,
    damping: 25,
    mass: 0.8,
};

/**
 * Gentle spring for subtle movements
 */
export const gentleSpring: Transition = {
    type: 'spring',
    stiffness: 200,
    damping: 35,
    mass: 1.2,
};

/**
 * Window open/close animation variants
 */
export const windowVariants: Variants = {
    hidden: {
        scale: 0.8,
        opacity: 0,
        y: 50,
    },
    visible: {
        scale: 1,
        opacity: 1,
        y: 0,
        transition: springTransition,
    },
    exit: {
        scale: 0.9,
        opacity: 0,
        y: 30,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 30,
        },
    },
};

/**
 * Minimize animation variants (genie effect toward dock)
 */
export const minimizeVariants: Variants = {
    normal: {
        scale: 1,
        y: 0,
        opacity: 1,
    },
    minimized: {
        scale: 0.1,
        y: 400, // Move toward dock position
        opacity: 0,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 25,
        },
    },
};

/**
 * Maximize animation variants
 */
export const maximizeVariants: Variants = {
    normal: {
        borderRadius: 12,
        transition: springTransition,
    },
    maximized: {
        borderRadius: 0,
        transition: springTransition,
    },
};

/**
 * Traffic light button hover animation
 */
export const trafficLightHoverVariants: Variants = {
    idle: {
        scale: 1,
    },
    hover: {
        scale: 1.1,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 20,
        },
    },
    tap: {
        scale: 0.95,
        transition: {
            type: 'spring',
            stiffness: 500,
            damping: 25,
        },
    },
};

/**
 * Traffic light symbol reveal animation
 */
export const symbolRevealVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.5,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 500,
            damping: 25,
        },
    },
};

/**
 * Window focus ring animation
 */
export const focusRingVariants: Variants = {
    unfocused: {
        boxShadow: '0 0 0 0 rgba(0, 191, 255, 0)',
    },
    focused: {
        boxShadow: '0 0 0 2px rgba(0, 191, 255, 0.3)',
        transition: {
            duration: 0.2,
        },
    },
};

/**
 * Window hover effect (subtle lift)
 */
export const windowHoverVariants: Variants = {
    idle: {
        y: 0,
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
    },
    hover: {
        y: -2,
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
        transition: gentleSpring,
    },
};

/**
 * Dock bounce animation for restoring windows
 */
export const dockBounceVariants: Variants = {
    initial: {
        y: 0,
    },
    bounce: {
        y: [0, -15, 0, -8, 0, -4, 0],
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

/**
 * Resize handle visibility animation
 */
export const resizeHandleVariants: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.15,
        },
    },
};

/**
 * Title bar animation when window is focused/unfocused
 */
export const titleBarVariants: Variants = {
    focused: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        transition: { duration: 0.2 },
    },
    unfocused: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        transition: { duration: 0.2 },
    },
};

/**
 * Create position animation for drag
 * Uses transform for GPU acceleration
 */
export const createDragAnimation = (x: number, y: number) => ({
    transform: `translate3d(${x}px, ${y}px, 0)`,
});

/**
 * Create size animation for resize
 */
export const createSizeAnimation = (width: number, height: number) => ({
    width,
    height,
});
