import { motion } from 'framer-motion';
import { Monitor, Laptop, ExternalLink, ArrowRight } from 'lucide-react';
import BackgroundEffects from './BackgroundEffects';
import GlassCard from './GlassCard';
import AnimatedButton from './AnimatedButton';
import { setPreferDesktopView } from '@/hooks/useDeviceDetection';

interface MobileWarningPageProps {
    onDismiss?: () => void;
}

// Animation variants for staggered entrance
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

/**
 * MobileWarningPage - A stunning mobile warning page for small devices
 * Features glassmorphism design, smooth animations, and accessibility support
 */
export default function MobileWarningPage({ onDismiss }: MobileWarningPageProps) {
    const handleContinueAnyway = () => {
        setPreferDesktopView(true);
        onDismiss?.();
        // Force page reload to apply preference
        window.location.reload();
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
            {/* Animated Background */}
            <BackgroundEffects />

            {/* Main Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-md mx-auto px-6 py-12"
            >
                {/* Animated Hero Icon */}
                <motion.div
                    variants={itemVariants}
                    className="flex justify-center mb-8"
                >
                    <motion.div
                        className="relative"
                        animate={{
                            y: [0, -8, 0],
                        }}
                        transition={{
                            duration: 4,
                            ease: 'easeInOut',
                            repeat: Infinity,
                        }}
                    >
                        {/* Icon glow effect */}
                        <motion.div
                            className="absolute inset-0 rounded-2xl"
                            style={{
                                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                                filter: 'blur(20px)',
                                opacity: 0.5,
                            }}
                            animate={{
                                opacity: [0.3, 0.6, 0.3],
                                scale: [0.9, 1.1, 0.9],
                            }}
                            transition={{
                                duration: 3,
                                ease: 'easeInOut',
                                repeat: Infinity,
                            }}
                        />

                        {/* Icon container */}
                        <div
                            className="relative p-6 rounded-2xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(124, 58, 237, 0.2))',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                            }}
                        >
                            <div className="flex gap-2">
                                <Monitor
                                    size={40}
                                    strokeWidth={1.5}
                                    className="text-white"
                                />
                                <Laptop
                                    size={40}
                                    strokeWidth={1.5}
                                    className="text-white/60"
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Glass Card with Content */}
                <GlassCard delay={0.3}>
                    {/* Heading */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-center mb-4"
                        style={{
                            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                            fontWeight: 700,
                            lineHeight: 1.2,
                            background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Optimized for Desktop
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        variants={itemVariants}
                        className="text-center mb-6"
                        style={{
                            fontSize: '1rem',
                            lineHeight: 1.7,
                            color: 'rgba(255, 255, 255, 0.7)',
                            maxWidth: '360px',
                            margin: '0 auto 1.5rem',
                        }}
                    >
                        This portfolio replicates the authentic macOS desktop experience —
                        complete with draggable windows, a functional dock, and fluid
                        animations that are best appreciated on a larger display.
                    </motion.p>

                    {/* Secondary message */}
                    <motion.p
                        variants={itemVariants}
                        className="text-center mb-8"
                        style={{
                            fontSize: '0.875rem',
                            lineHeight: 1.6,
                            color: 'rgba(255, 255, 255, 0.5)',
                        }}
                    >
                        For the full experience, please visit on a tablet, laptop, or desktop device.
                    </motion.p>

                    {/* Divider */}
                    <motion.div
                        variants={itemVariants}
                        className="w-12 h-px mx-auto mb-8"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        }}
                    />

                    {/* CTA Buttons Stack */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col gap-3"
                    >
                        {/* Primary CTA - View Other Portfolio */}
                        <AnimatedButton
                            href="https://goharabbas.vercel.app/"
                            variant="primary"
                            size="lg"
                            delay={0.6}
                            className="w-full"
                            ariaLabel="View my other portfolio website"
                        >
                            <span>View My Other Portfolio</span>
                            <ExternalLink size={18} />
                        </AnimatedButton>

                        {/* Secondary CTA - Continue Anyway */}
                        <AnimatedButton
                            onClick={handleContinueAnyway}
                            variant="secondary"
                            size="md"
                            delay={0.7}
                            className="w-full"
                            ariaLabel="Continue to portfolio anyway (not recommended)"
                        >
                            <span>Continue Anyway</span>
                            <ArrowRight size={16} />
                        </AnimatedButton>
                    </motion.div>

                    {/* Warning Note */}
                    <motion.p
                        variants={itemVariants}
                        className="text-center mt-6"
                        style={{
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.4)',
                        }}
                    >
                        <span className="inline-flex items-center gap-1">
                            ⚠️ Some features may not work optimally on mobile devices
                        </span>
                    </motion.p>
                </GlassCard>

                {/* Footer Attribution */}
                <motion.div
                    variants={itemVariants}
                    className="text-center mt-8"
                    style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.3)',
                    }}
                >
                    <p>Designed with ❤️ by Gohar Abbas</p>
                </motion.div>
            </motion.div>

            {/* Accessibility: Skip Link (hidden, focusable) */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-white focus:rounded-lg"
            >
                Skip to main content
            </a>
        </div>
    );
}
