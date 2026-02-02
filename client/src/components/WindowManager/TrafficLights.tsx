/**
 * TrafficLights Component
 * 
 * Authentic macOS traffic light buttons (close, minimize, maximize).
 * Features proper colors, hover states, and symbols.
 */

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRAFFIC_LIGHT_COLORS } from '../../stores/windowTypes';
import { trafficLightHoverVariants, symbolRevealVariants } from '../../utils/windowAnimations';

interface TrafficLightsProps {
    /** Whether the parent window is focused */
    isFocused: boolean;
    /** Handler for close button */
    onClose: () => void;
    /** Handler for minimize button */
    onMinimize: () => void;
    /** Handler for maximize/restore button */
    onMaximize: () => void;
    /** Whether the window is maximized */
    isMaximized?: boolean;
    /** Optional class name */
    className?: string;
}

/**
 * Close symbol (×)
 */
const CloseSymbol = memo(() => (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M1 1L7 7M7 1L1 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
));
CloseSymbol.displayName = 'CloseSymbol';

/**
 * Minimize symbol (−)
 */
const MinimizeSymbol = memo(() => (
    <svg width="8" height="2" viewBox="0 0 8 2" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M1 1H7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
));
MinimizeSymbol.displayName = 'MinimizeSymbol';

/**
 * Maximize symbol (+) or restore symbol
 */
const MaximizeSymbol = memo(({ isMaximized }: { isMaximized: boolean }) => (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        {isMaximized ? (
            // Restore symbol (two overlapping squares)
            <>
                <path d="M2 1H6.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="1" y="2" width="4.5" height="4.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
            </>
        ) : (
            // Maximize symbol (+)
            <>
                <path d="M4 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M1 4H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </>
        )}
    </svg>
));
MaximizeSymbol.displayName = 'MaximizeSymbol';

/**
 * Individual traffic light button
 */
interface TrafficLightButtonProps {
    type: 'close' | 'minimize' | 'maximize';
    isFocused: boolean;
    isGroupHovered: boolean;
    onClick: () => void;
    isMaximized?: boolean;
}

const TrafficLightButton = memo(({
    type,
    isFocused,
    isGroupHovered,
    onClick,
    isMaximized = false,
}: TrafficLightButtonProps) => {
    const [isPressed, setIsPressed] = useState(false);

    const colors = TRAFFIC_LIGHT_COLORS[type];
    const showColors = isFocused || isGroupHovered;

    // Determine background color
    const backgroundColor = isPressed
        ? colors.active
        : showColors
            ? colors.default
            : colors.unfocused;

    // Render appropriate symbol
    const renderSymbol = () => {
        switch (type) {
            case 'close':
                return <CloseSymbol />;
            case 'minimize':
                return <MinimizeSymbol />;
            case 'maximize':
                return <MaximizeSymbol isMaximized={isMaximized} />;
        }
    };

    return (
        <motion.button
            type="button"
            variants={trafficLightHoverVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            className="relative w-3 h-3 rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            style={{
                backgroundColor,
                border: '0.5px solid rgba(0, 0, 0, 0.15)',
                boxShadow: showColors
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    : 'none',
            }}
            aria-label={
                type === 'close' ? 'Close window' :
                    type === 'minimize' ? 'Minimize window' :
                        'Maximize window'
            }
        >
            <AnimatePresence>
                {isGroupHovered && (
                    <motion.span
                        variants={symbolRevealVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="text-black/60 flex items-center justify-center"
                    >
                        {renderSymbol()}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
});
TrafficLightButton.displayName = 'TrafficLightButton';

/**
 * TrafficLights Component
 * 
 * Group of three traffic light buttons with authentic macOS styling.
 */
export const TrafficLights = memo(({
    isFocused,
    onClose,
    onMinimize,
    onMaximize,
    isMaximized = false,
    className = '',
}: TrafficLightsProps) => {
    const [isGroupHovered, setIsGroupHovered] = useState(false);

    return (
        <div
            className={`flex items-center gap-2 ${className}`}
            onMouseEnter={() => setIsGroupHovered(true)}
            onMouseLeave={() => setIsGroupHovered(false)}
            role="group"
            aria-label="Window controls"
        >
            <TrafficLightButton
                type="close"
                isFocused={isFocused}
                isGroupHovered={isGroupHovered}
                onClick={onClose}
            />
            <TrafficLightButton
                type="minimize"
                isFocused={isFocused}
                isGroupHovered={isGroupHovered}
                onClick={onMinimize}
            />
            <TrafficLightButton
                type="maximize"
                isFocused={isFocused}
                isGroupHovered={isGroupHovered}
                onClick={onMaximize}
                isMaximized={isMaximized}
            />
        </div>
    );
});

TrafficLights.displayName = 'TrafficLights';

export default TrafficLights;
