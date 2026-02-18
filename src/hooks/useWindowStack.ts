/**
 * useWindowStack Hook
 * 
 * Manages window z-index stacking and keyboard shortcuts.
 */

import { useEffect, useCallback } from 'react';
import { useWindowStore } from '../stores/windowStore';

interface UseWindowStackOptions {
    /** Enable keyboard shortcuts (Escape, Cmd/Ctrl+W) */
    enableKeyboardShortcuts?: boolean;
}

interface UseWindowStackReturn {
    /** Currently focused window ID */
    focusedWindowId: string | null;
    /** Highest z-index currently in use */
    highestZIndex: number;
    /** Bring a window to front */
    bringToFront: (id: string) => void;
    /** Close the focused window */
    closeFocusedWindow: () => void;
    /** Minimize the focused window */
    minimizeFocusedWindow: () => void;
}

/**
 * Custom hook for window stacking and keyboard navigation
 */
export function useWindowStack({
    enableKeyboardShortcuts = true,
}: UseWindowStackOptions = {}): UseWindowStackReturn {
    const {
        focusedWindowId,
        highestZIndex,
        bringToFront,
        removeWindow,
        minimizeWindow,
        windows,
    } = useWindowStore();

    /**
     * Close the currently focused window
     */
    const closeFocusedWindow = useCallback(() => {
        if (focusedWindowId) {
            removeWindow(focusedWindowId);
        }
    }, [focusedWindowId, removeWindow]);

    /**
     * Minimize the currently focused window
     */
    const minimizeFocusedWindow = useCallback(() => {
        if (focusedWindowId) {
            minimizeWindow(focusedWindowId);
        }
    }, [focusedWindowId, minimizeWindow]);

    /**
     * Handle keyboard shortcuts
     */
    useEffect(() => {
        if (!enableKeyboardShortcuts) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Escape - close focused window
            if (e.key === 'Escape') {
                e.preventDefault();
                closeFocusedWindow();
                return;
            }

            // Cmd/Ctrl + W - close focused window
            if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
                e.preventDefault();
                closeFocusedWindow();
                return;
            }

            // Cmd/Ctrl + M - minimize focused window
            if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
                e.preventDefault();
                minimizeFocusedWindow();
                return;
            }

            // Tab - cycle through windows (with Cmd/Ctrl held)
            if ((e.metaKey || e.ctrlKey) && e.key === 'Tab') {
                e.preventDefault();

                const visibleWindows = windows.filter(w => !w.isMinimized);
                if (visibleWindows.length <= 1) return;

                const currentIndex = visibleWindows.findIndex(w => w.id === focusedWindowId);
                const nextIndex = e.shiftKey
                    ? (currentIndex - 1 + visibleWindows.length) % visibleWindows.length
                    : (currentIndex + 1) % visibleWindows.length;

                bringToFront(visibleWindows[nextIndex].id);
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [
        enableKeyboardShortcuts,
        focusedWindowId,
        windows,
        bringToFront,
        closeFocusedWindow,
        minimizeFocusedWindow,
    ]);

    return {
        focusedWindowId,
        highestZIndex,
        bringToFront,
        closeFocusedWindow,
        minimizeFocusedWindow,
    };
}

export default useWindowStack;
