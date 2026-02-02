import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    delay?: number;
    ariaLabel?: string;
}

/**
 * Animated gradient button with hover effects
 * Supports primary (gradient), secondary (outline), and ghost variants
 */
export default function AnimatedButton({
    children,
    href,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    delay = 0,
    ariaLabel,
}: AnimatedButtonProps) {
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const variantStyles = {
        primary: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            color: '#ffffff',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
        },
        secondary: {
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'rgba(255, 255, 255, 0.9)',
            boxShadow: 'none',
        },
        ghost: {
            background: 'transparent',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            boxShadow: 'none',
        },
    };

    const buttonContent = (
        <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
                scale: 1.02,
                y: -2,
            }}
            whileTap={{
                scale: 0.98,
            }}
            className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-xl
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent
        ${sizeClasses[size]}
        ${className}
      `}
            style={{
                ...variantStyles[variant],
                cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
                if (variant === 'primary') {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
                    (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)';
                } else if (variant === 'secondary') {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                }
            }}
            onMouseLeave={(e) => {
                if (variant === 'primary') {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                    (e.currentTarget as HTMLElement).style.filter = 'brightness(1)';
                } else if (variant === 'secondary') {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                }
            }}
            aria-label={ariaLabel}
        >
            {children}
        </motion.span>
    );

    if (href) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
                aria-label={ariaLabel}
            >
                {buttonContent}
            </a>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-block"
            aria-label={ariaLabel}
        >
            {buttonContent}
        </button>
    );
}
