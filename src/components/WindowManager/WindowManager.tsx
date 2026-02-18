/**
 * WindowManager Component
 * 
 * Main orchestrator for all windows in the application.
 * Renders visible windows and handles keyboard shortcuts.
 */

import React, { memo, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Window } from './Window';
import { useWindowStore } from '../../stores/windowStore';
import { useWindowStack } from '../../hooks/useWindowStack';
import { useShallow } from 'zustand/react/shallow';

interface WindowManagerProps {
    /** Optional class name */
    className?: string;
}

/**
 * WindowManager Component
 * 
 * Orchestrates all window rendering and keyboard navigation.
 * Uses Zustand selectors for optimized re-renders.
 */
export const WindowManager = memo(({ className = '' }: WindowManagerProps) => {
    // Get all windows from store - use useShallow to prevent infinite re-renders
    const allWindows = useWindowStore(useShallow((state) => state.windows));

    // Filter visible windows
    const windows = useMemo(() => allWindows.filter(w => !w.isMinimized), [allWindows]);

    // Initialize keyboard shortcuts
    useWindowStack({ enableKeyboardShortcuts: true });

    return (
        <div
            className={`window-manager absolute inset-0 pt-8 pb-24 pointer-events-none ${className}`}
            aria-label="Window manager"
            role="region"
        >
            {/* Pointer events auto for window content */}
            <div className="w-full h-full relative pointer-events-auto">
                <AnimatePresence mode="sync">
                    {windows.map((window) => {
                        const WindowContent = window.component;

                        return (
                            <Window
                                key={window.id}
                                id={window.id}
                                title={window.title}
                                icon={window.icon}
                                position={window.position}
                                size={window.size}
                                minSize={window.minSize}
                                zIndex={window.zIndex}
                                isMinimized={window.isMinimized}
                                isMaximized={window.isMaximized}
                                isFocused={window.isFocused}
                                className={window.className}
                            >
                                <WindowContent />
                            </Window>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
});

WindowManager.displayName = 'WindowManager';

export default WindowManager;
