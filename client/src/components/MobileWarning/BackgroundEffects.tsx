import { motion } from 'framer-motion';
import { memo } from 'react';

/**
 * Animated background effects for mobile warning page
 * Includes gradient mesh, floating orbs, noise overlay, and grid pattern
 */
const BackgroundEffects = memo(function BackgroundEffects() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {/* Base gradient background */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
                }}
            />

            {/* Animated gradient mesh */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: `
            radial-gradient(circle at 20% 80%, rgba(79, 70, 229, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.15) 0%, transparent 40%)
          `,
                    backgroundSize: '200% 200%',
                }}
                animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                transition={{
                    duration: 15,
                    ease: 'linear',
                    repeat: Infinity,
                }}
            />

            {/* Floating orbs */}
            <FloatingOrb
                size={400}
                color="rgba(79, 70, 229, 0.4)"
                initialX="-10%"
                initialY="20%"
                duration={20}
            />
            <FloatingOrb
                size={300}
                color="rgba(124, 58, 237, 0.35)"
                initialX="70%"
                initialY="60%"
                duration={25}
            />
            <FloatingOrb
                size={250}
                color="rgba(6, 182, 212, 0.25)"
                initialX="50%"
                initialY="-10%"
                duration={18}
            />
            <FloatingOrb
                size={200}
                color="rgba(139, 92, 246, 0.3)"
                initialX="90%"
                initialY="80%"
                duration={22}
            />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                    transform: 'perspective(500px) rotateX(60deg)',
                    transformOrigin: 'center top',
                }}
            />

            {/* Noise texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Vignette effect */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(15, 23, 42, 0.4) 100%)',
                }}
            />
        </div>
    );
});

// Floating orb component with parallax animation
interface FloatingOrbProps {
    size: number;
    color: string;
    initialX: string;
    initialY: string;
    duration: number;
}

function FloatingOrb({ size, color, initialX, initialY, duration }: FloatingOrbProps) {
    return (
        <motion.div
            className="absolute rounded-full"
            style={{
                width: size,
                height: size,
                left: initialX,
                top: initialY,
                background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
                filter: 'blur(60px)',
            }}
            animate={{
                x: [0, 30, -20, 0],
                y: [0, -40, 20, 0],
                scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
                duration,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
            }}
        />
    );
}

export default BackgroundEffects;
