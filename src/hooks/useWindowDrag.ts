/**
 * useWindowDrag Hook
 * 
 * High-performance window dragging with GPU-accelerated transforms.
 * Uses refs for transient state to avoid re-renders during drag.
 */

import { useRef, useCallback, useEffect } from 'react';
import { useWindowStore } from '../stores/windowStore';
import { WindowPosition, MENU_BAR_HEIGHT, DOCK_HEIGHT, WINDOW_PADDING } from '../stores/windowTypes';

interface UseWindowDragOptions {
    windowId: string;
    disabled?: boolean;
    onDragStart?: () => void;
    onDragEnd?: (position: WindowPosition) => void;
}

interface UseWindowDragReturn {
    isDragging: boolean;
    handleMouseDown: (e: React.MouseEvent) => void;
    windowRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Custom hook for GPU-accelerated window dragging
 */
export function useWindowDrag({
    windowId,
    disabled = false,
    onDragStart,
    onDragEnd,
}: UseWindowDragOptions): UseWindowDragReturn {
    const windowRef = useRef<HTMLDivElement | null>(null);
    const isDraggingRef = useRef(false);
    const rafRef = useRef<number | null>(null);

    // Transient state (no re-renders during drag)
    const dragStateRef = useRef({
        startX: 0,
        startY: 0,
        initialPosition: { x: 0, y: 0 },
        currentPosition: { x: 0, y: 0 },
    });

    const { bringToFront, setWindowPosition, getWindow } = useWindowStore();

    /**
     * Get viewport constraints
     */
    const getConstraints = useCallback(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return {
            minX: WINDOW_PADDING - 100, // Allow partial off-screen
            maxX: width - WINDOW_PADDING + 100,
            minY: MENU_BAR_HEIGHT,
            maxY: height - DOCK_HEIGHT - 44, // Keep title bar visible
        };
    }, []);

    /**
     * Constrain position to viewport bounds
     */
    const constrainPosition = useCallback((x: number, y: number, windowWidth: number): WindowPosition => {
        const constraints = getConstraints();
        return {
            x: Math.max(constraints.minX, Math.min(x, constraints.maxX - windowWidth + 100)),
            y: Math.max(constraints.minY, Math.min(y, constraints.maxY)),
        };
    }, [getConstraints]);

    /**
     * Handle mouse move during drag with RAF for 60fps
     */
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDraggingRef.current || !windowRef.current) return;

        // Cancel any pending animation frame
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        // Use requestAnimationFrame for smooth 60fps updates
        rafRef.current = requestAnimationFrame(() => {
            const deltaX = e.clientX - dragStateRef.current.startX;
            const deltaY = e.clientY - dragStateRef.current.startY;

            const newX = dragStateRef.current.initialPosition.x + deltaX;
            const newY = dragStateRef.current.initialPosition.y + deltaY;

            // Get window width for constraints
            const windowWidth = windowRef.current?.offsetWidth || 400;
            const constrained = constrainPosition(newX, newY, windowWidth);

            // Update current position in ref
            dragStateRef.current.currentPosition = constrained;

            // Apply transform directly to DOM for GPU acceleration
            // This avoids React re-renders during drag
            if (windowRef.current) {
                windowRef.current.style.transform = `translate3d(${constrained.x}px, ${constrained.y}px, 0)`;
                windowRef.current.style.willChange = 'transform';
            }
        });
    }, [constrainPosition]);

    /**
     * Handle mouse up - end drag operation
     */
    const handleMouseUp = useCallback(() => {
        if (!isDraggingRef.current) return;

        isDraggingRef.current = false;

        // Cancel any pending animation frame
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }

        // Reset cursor
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        // Remove will-change to allow browser to optimize
        if (windowRef.current) {
            windowRef.current.style.willChange = 'auto';
        }

        // Update Zustand state with final position
        const finalPosition = dragStateRef.current.currentPosition;
        setWindowPosition(windowId, finalPosition);

        // Call onDragEnd callback
        onDragEnd?.(finalPosition);

        // Clean up event listeners
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }, [windowId, setWindowPosition, onDragEnd, handleMouseMove]);

    /**
     * Handle mouse down - start drag operation
     */
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (disabled) return;

        // Only handle left mouse button
        if (e.button !== 0) return;

        // Prevent text selection during drag
        e.preventDefault();

        // Get current window state
        const windowState = getWindow(windowId);
        if (!windowState || windowState.isMaximized) return;

        // Bring window to front
        bringToFront(windowId);

        // Initialize drag state
        isDraggingRef.current = true;
        dragStateRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialPosition: { ...windowState.position },
            currentPosition: { ...windowState.position },
        };

        // Set cursor and prevent text selection
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';

        // Enable GPU acceleration hint
        if (windowRef.current) {
            windowRef.current.style.willChange = 'transform';
        }

        // Call onDragStart callback
        onDragStart?.();

        // Add event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [disabled, windowId, getWindow, bringToFront, onDragStart, handleMouseMove, handleMouseUp]);

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
        isDragging: isDraggingRef.current,
        handleMouseDown,
        windowRef,
    };
}

export default useWindowDrag;
