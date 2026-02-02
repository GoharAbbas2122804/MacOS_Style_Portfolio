/**
 * WindowTitleBar Component
 * 
 * Window title bar with traffic lights and drag functionality.
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { TrafficLights } from './TrafficLights';
import { titleBarVariants } from '../../utils/windowAnimations';

interface WindowTitleBarProps {
    /** Window title */
    title: string;
    /** Window icon */
    icon?: React.ReactNode;
    /** Whether the window is focused */
    isFocused: boolean;
    /** Whether the window is maximized */
    isMaximized: boolean;
    /** Handler for drag start */
    onDragStart: (e: React.MouseEvent) => void;
    /** Handler for close button */
    onClose: () => void;
    /** Handler for minimize button */
    onMinimize: () => void;
    /** Handler for maximize button */
    onMaximize: () => void;
    /** Handler for double-click (maximize/restore) */
    onDoubleClick?: () => void;
    /** Optional class name */
    className?: string;
}

/**
 * WindowTitleBar Component
 * 
 * Renders the window title bar with:
 * - Traffic light buttons (close, minimize, maximize)
 * - Window title with icon
 * - Drag handle functionality
 * - Double-click to maximize
 */
export const WindowTitleBar = memo(({
    title,
    icon,
    isFocused,
    isMaximized,
    onDragStart,
    onClose,
    onMinimize,
    onMaximize,
    onDoubleClick,
    className = '',
}: WindowTitleBarProps) => {
    /**
     * Handle double-click for maximize/restore
     */
    const handleDoubleClick = (e: React.MouseEvent) => {
        // Prevent triggering if clicking on traffic lights
        if ((e.target as HTMLElement).closest('[role="group"]')) return;
        onDoubleClick?.();
    };

    /**
     * Handle mouse down for drag
     */
    const handleMouseDown = (e: React.MouseEvent) => {
        // Don't start drag if clicking on traffic lights
        if ((e.target as HTMLElement).closest('[role="group"]')) return;
        // Don't start drag if double-clicking
        if (e.detail === 2) return;
        // Don't drag when maximized
        if (isMaximized) return;

        onDragStart(e);
    };

    return (
        <motion.div
            variants={titleBarVariants}
            initial={isFocused ? 'focused' : 'unfocused'}
            animate={isFocused ? 'focused' : 'unfocused'}
            className={`
        window-title-bar
        h-11 
        flex items-center justify-between 
        px-4
        select-none
        border-b border-white/10
        ${isMaximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
        ${className}
      `}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            role="banner"
            aria-label={`${title} window title bar`}
        >
            {/* Traffic Lights - Left side */}
            <TrafficLights
                isFocused={isFocused}
                onClose={onClose}
                onMinimize={onMinimize}
                onMaximize={onMaximize}
                isMaximized={isMaximized}
            />

            {/* Title - Center */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
                {icon && (
                    <span className="w-4 h-4 flex items-center justify-center">
                        {icon}
                    </span>
                )}
                <span
                    className={`
            text-[13px] font-semibold truncate max-w-[200px]
            ${isFocused ? 'text-white/90' : 'text-white/50'}
          `}
                >
                    {title}
                </span>
            </div>

            {/* Spacer for balance - Right side */}
            <div className="w-14" aria-hidden="true" />
        </motion.div>
    );
});

WindowTitleBar.displayName = 'WindowTitleBar';

export default WindowTitleBar;
