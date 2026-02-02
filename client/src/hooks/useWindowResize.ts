/**
 * useWindowResize Hook
 * 
 * 8-directional window resize with GPU acceleration.
 * Supports minimum size constraints and viewport bounds.
 */

import { useRef, useCallback, useEffect, useState } from 'react';
import { useWindowStore } from '../stores/windowStore';
import {
    WindowPosition,
    WindowSize,
    ResizeDirection,
    MENU_BAR_HEIGHT,
    DOCK_HEIGHT,
    WINDOW_PADDING,
} from '../stores/windowTypes';

interface UseWindowResizeOptions {
    windowId: string;
    disabled?: boolean;
    onResizeStart?: () => void;
    onResizeEnd?: (size: WindowSize, position: WindowPosition) => void;
}

interface UseWindowResizeReturn {
    isResizing: boolean;
    activeDirection: ResizeDirection | null;
    handleResizeStart: (direction: ResizeDirection) => (e: React.MouseEvent) => void;
}

/**
 * Resize handle configurations
 */
export const RESIZE_HANDLES: Array<{
    direction: ResizeDirection;
    cursor: string;
    className: string;
    style: React.CSSProperties;
}> = [
        {
            direction: 'nw',
            cursor: 'nwse-resize',
            className: 'resize-handle-corner',
            style: { top: 0, left: 0, width: 16, height: 16 },
        },
        {
            direction: 'n',
            cursor: 'ns-resize',
            className: 'resize-handle-edge-h',
            style: { top: 0, left: 16, right: 16, height: 8 },
        },
        {
            direction: 'ne',
            cursor: 'nesw-resize',
            className: 'resize-handle-corner',
            style: { top: 0, right: 0, width: 16, height: 16 },
        },
        {
            direction: 'e',
            cursor: 'ew-resize',
            className: 'resize-handle-edge-v',
            style: { top: 16, right: 0, bottom: 16, width: 8 },
        },
        {
            direction: 'se',
            cursor: 'nwse-resize',
            className: 'resize-handle-corner',
            style: { bottom: 0, right: 0, width: 16, height: 16 },
        },
        {
            direction: 's',
            cursor: 'ns-resize',
            className: 'resize-handle-edge-h',
            style: { bottom: 0, left: 16, right: 16, height: 8 },
        },
        {
            direction: 'sw',
            cursor: 'nesw-resize',
            className: 'resize-handle-corner',
            style: { bottom: 0, left: 0, width: 16, height: 16 },
        },
        {
            direction: 'w',
            cursor: 'ew-resize',
            className: 'resize-handle-edge-v',
            style: { top: 16, left: 0, bottom: 16, width: 8 },
        },
    ];

/**
 * Custom hook for 8-directional window resizing
 */
export function useWindowResize({
    windowId,
    disabled = false,
    onResizeStart,
    onResizeEnd,
}: UseWindowResizeOptions): UseWindowResizeReturn {
    const [isResizing, setIsResizing] = useState(false);
    const [activeDirection, setActiveDirection] = useState<ResizeDirection | null>(null);

    const rafRef = useRef<number | null>(null);
    const resizeStateRef = useRef({
        direction: null as ResizeDirection | null,
        startX: 0,
        startY: 0,
        initialPosition: { x: 0, y: 0 },
        initialSize: { width: 0, height: 0 },
        minSize: { width: 400, height: 300 },
    });

    const { updateWindow, getWindow, bringToFront } = useWindowStore();

    /**
     * Calculate new size and position based on resize direction
     */
    const calculateResize = useCallback((
        direction: ResizeDirection,
        deltaX: number,
        deltaY: number,
        initialPos: WindowPosition,
        initialSize: WindowSize,
        minSize: WindowSize
    ): { position: WindowPosition; size: WindowSize } => {
        let newX = initialPos.x;
        let newY = initialPos.y;
        let newWidth = initialSize.width;
        let newHeight = initialSize.height;

        // Handle horizontal resize
        if (direction.includes('e')) {
            newWidth = Math.max(minSize.width, initialSize.width + deltaX);
        }
        if (direction.includes('w')) {
            const potentialWidth = initialSize.width - deltaX;
            if (potentialWidth >= minSize.width) {
                newWidth = potentialWidth;
                newX = initialPos.x + deltaX;
            } else {
                newWidth = minSize.width;
                newX = initialPos.x + initialSize.width - minSize.width;
            }
        }

        // Handle vertical resize
        if (direction.includes('s')) {
            newHeight = Math.max(minSize.height, initialSize.height + deltaY);
        }
        if (direction.includes('n')) {
            const potentialHeight = initialSize.height - deltaY;
            if (potentialHeight >= minSize.height) {
                newHeight = potentialHeight;
                newY = initialPos.y + deltaY;
            } else {
                newHeight = minSize.height;
                newY = initialPos.y + initialSize.height - minSize.height;
            }
        }

        // Apply viewport constraints
        const maxWidth = window.innerWidth - WINDOW_PADDING * 2;
        const maxHeight = window.innerHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT - WINDOW_PADDING * 2;

        newWidth = Math.min(newWidth, maxWidth);
        newHeight = Math.min(newHeight, maxHeight);

        // Ensure position stays in bounds
        newX = Math.max(WINDOW_PADDING - newWidth + 100, Math.min(newX, window.innerWidth - 100));
        newY = Math.max(MENU_BAR_HEIGHT, newY);

        return {
            position: { x: newX, y: newY },
            size: { width: newWidth, height: newHeight },
        };
    }, []);

    /**
     * Handle mouse move during resize
     */
    const handleMouseMove = useCallback((e: MouseEvent) => {
        const state = resizeStateRef.current;
        if (!state.direction) return;

        // Cancel any pending animation frame
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        // Use requestAnimationFrame for smooth 60fps updates
        rafRef.current = requestAnimationFrame(() => {
            const deltaX = e.clientX - state.startX;
            const deltaY = e.clientY - state.startY;

            const result = calculateResize(
                state.direction!,
                deltaX,
                deltaY,
                state.initialPosition,
                state.initialSize,
                state.minSize
            );

            // Update window in store
            updateWindow(windowId, {
                position: result.position,
                size: result.size,
            });
        });
    }, [windowId, updateWindow, calculateResize]);

    /**
     * Handle mouse up - end resize operation
     */
    const handleMouseUp = useCallback(() => {
        // Cancel any pending animation frame
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }

        // Reset cursor
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        // Get final state
        const windowState = getWindow(windowId);
        if (windowState) {
            onResizeEnd?.(windowState.size, windowState.position);
        }

        // Reset state
        resizeStateRef.current.direction = null;
        setIsResizing(false);
        setActiveDirection(null);

        // Clean up event listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }, [windowId, getWindow, onResizeEnd, handleMouseMove]);

    /**
     * Handle resize start for a specific direction
     */
    const handleResizeStart = useCallback((direction: ResizeDirection) => (e: React.MouseEvent) => {
        if (disabled) return;

        // Only handle left mouse button
        if (e.button !== 0) return;

        // Prevent default and stop propagation
        e.preventDefault();
        e.stopPropagation();

        // Get current window state
        const windowState = getWindow(windowId);
        if (!windowState || windowState.isMaximized) return;

        // Bring window to front
        bringToFront(windowId);

        // Initialize resize state
        resizeStateRef.current = {
            direction,
            startX: e.clientX,
            startY: e.clientY,
            initialPosition: { ...windowState.position },
            initialSize: { ...windowState.size },
            minSize: { ...windowState.minSize },
        };

        // Set cursor and prevent text selection
        document.body.style.cursor = RESIZE_HANDLES.find(h => h.direction === direction)?.cursor || 'default';
        document.body.style.userSelect = 'none';

        // Update state
        setIsResizing(true);
        setActiveDirection(direction);
        onResizeStart?.();

        // Add event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [disabled, windowId, getWindow, bringToFront, onResizeStart, handleMouseMove, handleMouseUp]);

    /**
     * Cleanup on unmount
     */
    useEffect(() => {
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    return {
        isResizing,
        activeDirection,
        handleResizeStart,
    };
}

export default useWindowResize;
