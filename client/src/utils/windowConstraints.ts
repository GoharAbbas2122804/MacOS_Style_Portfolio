/**
 * Window Constraints Utilities
 * 
 * Utility functions for calculating viewport boundaries
 * and constraining window positions/sizes.
 */

import {
    WindowPosition,
    WindowSize,
    MENU_BAR_HEIGHT,
    DOCK_HEIGHT,
    WINDOW_PADDING,
} from '../stores/windowTypes';

/**
 * Get current viewport dimensions accounting for menu bar and dock
 */
export const getViewportBounds = () => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const height = typeof window !== 'undefined' ? window.innerHeight : 1080;

    return {
        minX: WINDOW_PADDING,
        maxX: width - WINDOW_PADDING,
        minY: MENU_BAR_HEIGHT + WINDOW_PADDING,
        maxY: height - DOCK_HEIGHT - WINDOW_PADDING,
        width,
        height,
        usableWidth: width - WINDOW_PADDING * 2,
        usableHeight: height - MENU_BAR_HEIGHT - DOCK_HEIGHT - WINDOW_PADDING * 2,
    };
};

/**
 * Constrain a window position to stay within viewport bounds
 * Ensures at least the title bar (40px) remains visible
 */
export const constrainPosition = (
    position: WindowPosition,
    size: WindowSize
): WindowPosition => {
    const bounds = getViewportBounds();
    const titleBarHeight = 44; // Minimum visible area

    // Ensure at least title bar width is visible
    const minVisibleWidth = 100;

    return {
        x: Math.max(
            bounds.minX - size.width + minVisibleWidth,
            Math.min(position.x, bounds.maxX - minVisibleWidth)
        ),
        y: Math.max(
            bounds.minY,
            Math.min(position.y, bounds.maxY - titleBarHeight)
        ),
    };
};

/**
 * Constrain a window size to respect min/max constraints
 */
export const constrainSize = (
    size: WindowSize,
    minSize: WindowSize,
    maxSize?: WindowSize
): WindowSize => {
    const bounds = getViewportBounds();
    const effectiveMaxSize = maxSize || {
        width: bounds.usableWidth,
        height: bounds.usableHeight,
    };

    return {
        width: Math.max(minSize.width, Math.min(size.width, effectiveMaxSize.width)),
        height: Math.max(minSize.height, Math.min(size.height, effectiveMaxSize.height)),
    };
};

/**
 * Calculate new position and size during resize operation
 * Handles different resize directions properly
 */
export const calculateResizeResult = (
    direction: string,
    startPosition: WindowPosition,
    startSize: WindowSize,
    deltaX: number,
    deltaY: number,
    minSize: WindowSize
): { position: WindowPosition; size: WindowSize } => {
    let newX = startPosition.x;
    let newY = startPosition.y;
    let newWidth = startSize.width;
    let newHeight = startSize.height;

    // Handle horizontal resize
    if (direction.includes('e')) {
        newWidth = Math.max(minSize.width, startSize.width + deltaX);
    }
    if (direction.includes('w')) {
        const potentialWidth = startSize.width - deltaX;
        if (potentialWidth >= minSize.width) {
            newWidth = potentialWidth;
            newX = startPosition.x + deltaX;
        } else {
            newWidth = minSize.width;
            newX = startPosition.x + startSize.width - minSize.width;
        }
    }

    // Handle vertical resize
    if (direction.includes('s')) {
        newHeight = Math.max(minSize.height, startSize.height + deltaY);
    }
    if (direction.includes('n')) {
        const potentialHeight = startSize.height - deltaY;
        if (potentialHeight >= minSize.height) {
            newHeight = potentialHeight;
            newY = startPosition.y + deltaY;
        } else {
            newHeight = minSize.height;
            newY = startPosition.y + startSize.height - minSize.height;
        }
    }

    // Apply viewport constraints
    const bounds = getViewportBounds();

    // Constrain to viewport
    newX = Math.max(bounds.minX - newWidth + 100, Math.min(newX, bounds.maxX - 100));
    newY = Math.max(bounds.minY, newY);
    newWidth = Math.min(newWidth, bounds.width - WINDOW_PADDING);
    newHeight = Math.min(newHeight, bounds.usableHeight);

    return {
        position: { x: newX, y: newY },
        size: { width: newWidth, height: newHeight },
    };
};

/**
 * Check if a point is within the viewport
 */
export const isPointInViewport = (x: number, y: number): boolean => {
    const bounds = getViewportBounds();
    return x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY;
};

/**
 * Get centered position for a window of given size
 */
export const getCenteredPosition = (size: WindowSize): WindowPosition => {
    const bounds = getViewportBounds();
    return {
        x: Math.max(bounds.minX, (bounds.width - size.width) / 2),
        y: Math.max(bounds.minY, (bounds.height - size.height) / 2 + MENU_BAR_HEIGHT / 2),
    };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: unknown[]) => void>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle = false;
    let lastArgs: Parameters<T> | null = null;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
                if (lastArgs) {
                    func(...lastArgs);
                    lastArgs = null;
                }
            }, limit);
        } else {
            lastArgs = args;
        }
    };
};

/**
 * Debounce function for state updates
 */
export const debounce = <T extends (...args: unknown[]) => void>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};
