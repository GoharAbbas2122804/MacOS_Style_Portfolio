/**
 * Window Component
 * 
 * Enhanced macOS-style window with drag, resize, and authentic styling.
 * Uses GPU-accelerated transforms for smooth 60fps performance.
 * 
 * KEY FIX: Uses positionRef to maintain visual position consistency during drag.
 * This prevents the snap-back bug where windows would briefly flash to their
 * old position when React re-rendered after state updates.
 */

import React, { memo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WindowTitleBar } from './WindowTitleBar';
import { ResizeHandles } from './ResizeHandles';
import { useWindowStore } from '../../stores/windowStore';
import { useWindowResize } from '../../hooks/useWindowResize';
import { windowVariants, minimizeVariants, springTransition } from '../../utils/windowAnimations';
import { WindowState } from '../../stores/windowTypes';
import { cn } from '../../lib/utils';

interface WindowProps extends Omit<WindowState, 'component'> {
    /** Content to render inside the window */
    children: React.ReactNode;
    /** Additional class name */
    className?: string;
}

/**
 * Window Component
 * 
 * A fully-featured macOS-style window with:
 * - GPU-accelerated dragging
 * - 8-directional resizing
 * - Traffic light controls
 * - Smooth Framer Motion animations
 * 
 * DRAG IMPLEMENTATION NOTES:
 * - positionRef tracks the "visual" position of the window
 * - During drag: We update positionRef and apply transform directly to DOM
 * - On drag end: We update BOTH positionRef AND the store state
 * - This prevents the snap-back bug where stale props would briefly override the visual position
 */
export const Window = memo(({
    id,
    title,
    icon,
    position,
    size,
    minSize,
    zIndex,
    isMinimized,
    isMaximized,
    isFocused,
    children,
    className,
}: WindowProps) => {
    const windowRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

    /**
     * Position ref tracks the current visual position of the window.
     * This is the key to preventing the snap-back bug:
     * - It stays in sync with the DOM during drag operations
     * - It's updated BEFORE state updates to maintain visual consistency
     * - It syncs with props when not dragging (to handle external updates)
     */
    const positionRef = useRef({ x: position.x, y: position.y });

    const {
        removeWindow,
        minimizeWindow,
        toggleMaximize,
        bringToFront,
        setWindowPosition,
    } = useWindowStore();

    const { handleResizeStart, isResizing } = useWindowResize({
        windowId: id,
    });

    /**
     * Sync positionRef with position props when not dragging.
     * This ensures external position updates (from store) are reflected.
     */
    useEffect(() => {
        if (!isDraggingRef.current) {
            positionRef.current = { x: position.x, y: position.y };
        }
    }, [position.x, position.y]);

    /**
     * Handle close button click
     */
    const handleClose = useCallback(() => {
        removeWindow(id);
    }, [id, removeWindow]);

    /**
     * Handle minimize button click
     */
    const handleMinimize = useCallback(() => {
        minimizeWindow(id);
    }, [id, minimizeWindow]);

    /**
     * Handle maximize button click
     */
    const handleMaximize = useCallback(() => {
        toggleMaximize(id);
    }, [id, toggleMaximize]);

    /**
     * Handle window focus
     */
    const handleFocus = useCallback(() => {
        if (!isFocused) {
            bringToFront(id);
        }
    }, [id, isFocused, bringToFront]);

    /**
     * Handle drag start
     * 
     * OFFSET CALCULATION:
     * We store the initial mouse position and window position.
     * newPosition = startPosition + (currentMouse - startMouse)
     * This gives us smooth, offset-aware dragging.
     */
    const handleDragStart = useCallback((e: React.MouseEvent) => {
        if (isMaximized) return;

        isDraggingRef.current = true;

        // Use positionRef.current as the starting position
        // This ensures we continue from the visual position, not stale props
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            posX: positionRef.current.x,
            posY: positionRef.current.y,
        };

        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';

        if (windowRef.current) {
            windowRef.current.style.willChange = 'transform';
            // Add dragging opacity for visual feedback
            windowRef.current.style.opacity = '0.95';
        }

        bringToFront(id);
    }, [id, isMaximized, bringToFront]);

    /**
     * Handle mouse move and mouse up during drag
     * 
     * KEY FIX: On mouseup, we update positionRef BEFORE calling setWindowPosition.
     * This ensures that when React re-renders, the transform style reads from
     * positionRef.current (the new position), not the stale position prop.
     */
    useEffect(() => {
        if (!windowRef.current) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;

            requestAnimationFrame(() => {
                const deltaX = e.clientX - dragStartRef.current.x;
                const deltaY = e.clientY - dragStartRef.current.y;

                const newX = dragStartRef.current.posX + deltaX;
                // Keep below menu bar (32px)
                const newY = Math.max(32, dragStartRef.current.posY + deltaY);

                // Update positionRef to track current visual position
                positionRef.current = { x: newX, y: newY };

                if (windowRef.current) {
                    windowRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
                }
            });
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;

            // Calculate final position
            const deltaX = e.clientX - dragStartRef.current.x;
            const deltaY = e.clientY - dragStartRef.current.y;
            const newX = dragStartRef.current.posX + deltaX;
            const newY = Math.max(32, dragStartRef.current.posY + deltaY);

            // CRITICAL FIX: Update positionRef BEFORE setting isDragging to false
            // This ensures the visual position is locked in before any re-render
            positionRef.current = { x: newX, y: newY };

            isDraggingRef.current = false;

            document.body.style.cursor = '';
            document.body.style.userSelect = '';

            if (windowRef.current) {
                windowRef.current.style.willChange = 'auto';
                windowRef.current.style.opacity = '1';
                // Ensure the transform is set to the final position
                windowRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
            }

            // Update the store state - React will re-render, but positionRef
            // already has the correct position, so no snap-back will occur
            setWindowPosition(id, { x: newX, y: newY });
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [id, setWindowPosition]);

    // Don't render if minimized (handled by AnimatePresence)
    if (isMinimized) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                ref={windowRef}
                key={id}
                variants={windowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn(
                    'absolute flex flex-col overflow-hidden',
                    'bg-[rgba(15,35,55,0.85)] backdrop-blur-[40px]',
                    'border border-white/15',
                    'shadow-[0_20px_50px_rgba(0,0,0,0.5)]',
                    !isMaximized && 'rounded-xl',
                    isMaximized && 'rounded-none',
                    className
                )}
                style={{
                    transform: isMaximized
                        ? 'translate3d(0, 32px, 0)'
                        : `translate3d(${position.x}px, ${position.y}px, 0)`,
                    width: isMaximized ? '100vw' : size.width,
                    height: isMaximized ? 'calc(100vh - 32px - 96px)' : size.height,
                    zIndex,
                    willChange: isResizing ? 'width, height' : 'auto',
                }}
                onClick={handleFocus}
                role="dialog"
                aria-modal="false"
                aria-label={`${title} window`}
            >
                {/* Title Bar */}
                <WindowTitleBar
                    title={title}
                    icon={icon}
                    isFocused={isFocused}
                    isMaximized={isMaximized}
                    onDragStart={handleDragStart}
                    onClose={handleClose}
                    onMinimize={handleMinimize}
                    onMaximize={handleMaximize}
                    onDoubleClick={handleMaximize}
                />

                {/* Window Content */}
                <div
                    className="flex-1 overflow-auto relative bg-[#0A1A2A]/40 text-[#F5F5F5]"
                    role="main"
                >
                    {children}
                </div>

                {/* Resize Handles */}
                <ResizeHandles
                    onResizeStart={handleResizeStart}
                    disabled={isMaximized}
                />
            </motion.div>
        </AnimatePresence>
    );
});

Window.displayName = 'Window';

export default Window;
