/**
 * Window Management Zustand Store
 * 
 * Centralized state management for all windows in the macOS-style portfolio.
 * Uses Zustand for selective re-rendering and optimal performance.
 */

import { create } from 'zustand';
import {
    WindowStore,
    WindowState,
    WindowConfig,
    WindowPosition,
    WindowSize,
    DEFAULT_MIN_SIZE,
    DEFAULT_INITIAL_SIZE,
    DEFAULT_INITIAL_POSITION,
} from './windowTypes';

/**
 * Generate unique window ID
 */
const generateWindowId = (): string => `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Calculate staggered position for new windows
 */
const getStaggeredPosition = (existingWindows: WindowState[]): WindowPosition => {
    const baseOffset = 30;
    const offset = (existingWindows.length % 10) * baseOffset;
    return {
        x: DEFAULT_INITIAL_POSITION.x + offset,
        y: DEFAULT_INITIAL_POSITION.y + offset,
    };
};

/**
 * Window Management Store
 */
export const useWindowStore = create<WindowStore>((set, get) => ({
    windows: [],
    focusedWindowId: null,
    highestZIndex: 0,

    /**
     * Add a new window to the manager
     */
    addWindow: (config: WindowConfig) => {
        const state = get();

        // Check if window with this ID already exists
        const existingWindow = state.windows.find(w => w.id === config.id);
        if (existingWindow) {
            // If it exists but is minimized, restore it
            if (existingWindow.isMinimized) {
                get().restoreWindow(config.id);
                return;
            }
            // Otherwise, just bring it to front
            get().bringToFront(config.id);
            return;
        }

        const newZIndex = state.highestZIndex + 1;
        const position = config.position || getStaggeredPosition(state.windows);
        const size = config.size || DEFAULT_INITIAL_SIZE;

        const newWindow: WindowState = {
            id: config.id || generateWindowId(),
            title: config.title,
            icon: config.icon,
            component: config.component,
            position,
            size,
            minSize: config.minSize || DEFAULT_MIN_SIZE,
            zIndex: newZIndex,
            isMinimized: false,
            isMaximized: false,
            isFocused: true,
            className: config.className,
            defaultPosition: position,
            defaultSize: size,
        };

        set(state => ({
            windows: [
                ...state.windows.map(w => ({ ...w, isFocused: false })),
                newWindow,
            ],
            focusedWindowId: newWindow.id,
            highestZIndex: newZIndex,
        }));
    },

    /**
     * Remove a window by ID
     */
    removeWindow: (id: string) => {
        set(state => {
            const remainingWindows = state.windows.filter(w => w.id !== id);

            // If the removed window was focused, focus the next highest z-index window
            let newFocusedId: string | null = null;
            if (state.focusedWindowId === id && remainingWindows.length > 0) {
                const sortedByZ = [...remainingWindows]
                    .filter(w => !w.isMinimized)
                    .sort((a, b) => b.zIndex - a.zIndex);
                if (sortedByZ.length > 0) {
                    newFocusedId = sortedByZ[0].id;
                }
            } else {
                newFocusedId = state.focusedWindowId;
            }

            return {
                windows: remainingWindows.map(w => ({
                    ...w,
                    isFocused: w.id === newFocusedId,
                })),
                focusedWindowId: newFocusedId,
            };
        });
    },

    /**
     * Update partial window state
     */
    updateWindow: (id: string, updates: Partial<WindowState>) => {
        set(state => ({
            windows: state.windows.map(w =>
                w.id === id ? { ...w, ...updates } : w
            ),
        }));
    },

    /**
     * Bring a window to the front (focus it)
     */
    bringToFront: (id: string) => {
        const state = get();
        const targetWindow = state.windows.find(w => w.id === id);

        if (!targetWindow || targetWindow.isMinimized) return;

        const newZIndex = state.highestZIndex + 1;

        set(state => ({
            windows: state.windows.map(w => ({
                ...w,
                zIndex: w.id === id ? newZIndex : w.zIndex,
                isFocused: w.id === id,
            })),
            focusedWindowId: id,
            highestZIndex: newZIndex,
        }));
    },

    /**
     * Minimize a window to the dock
     */
    minimizeWindow: (id: string) => {
        set(state => {
            const targetWindow = state.windows.find(w => w.id === id);
            if (!targetWindow) return state;

            // Find next window to focus
            const remainingVisible = state.windows
                .filter(w => w.id !== id && !w.isMinimized)
                .sort((a, b) => b.zIndex - a.zIndex);

            const newFocusedId = remainingVisible.length > 0 ? remainingVisible[0].id : null;

            return {
                windows: state.windows.map(w => ({
                    ...w,
                    isMinimized: w.id === id ? true : w.isMinimized,
                    isFocused: w.id === newFocusedId,
                })),
                focusedWindowId: newFocusedId,
            };
        });
    },

    /**
     * Restore a window from minimized state
     */
    restoreWindow: (id: string) => {
        const state = get();
        const newZIndex = state.highestZIndex + 1;

        set(state => ({
            windows: state.windows.map(w => ({
                ...w,
                isMinimized: w.id === id ? false : w.isMinimized,
                zIndex: w.id === id ? newZIndex : w.zIndex,
                isFocused: w.id === id,
            })),
            focusedWindowId: id,
            highestZIndex: newZIndex,
        }));
    },

    /**
     * Toggle between maximized and normal state
     */
    toggleMaximize: (id: string) => {
        set(state => {
            const targetWindow = state.windows.find(w => w.id === id);
            if (!targetWindow) return state;

            const isMaximizing = !targetWindow.isMaximized;

            // Get viewport dimensions
            const viewportWidth = typeof globalThis.window !== 'undefined' ? globalThis.window.innerWidth : 1920;
            const viewportHeight = typeof globalThis.window !== 'undefined' ? globalThis.window.innerHeight : 1080;

            return {
                windows: state.windows.map(w => {
                    if (w.id !== id) return w;

                    if (isMaximizing) {
                        // Store current position/size before maximizing
                        return {
                            ...w,
                            isMaximized: true,
                            prevPosition: w.position,
                            prevSize: w.size,
                            position: { x: 0, y: 32 }, // Below menu bar
                            size: {
                                width: viewportWidth,
                                height: viewportHeight - 32 - 96, // Minus menubar and dock
                            },
                        };
                    } else {
                        // Restore previous position/size
                        return {
                            ...w,
                            isMaximized: false,
                            position: w.prevPosition || w.defaultPosition || DEFAULT_INITIAL_POSITION,
                            size: w.prevSize || w.defaultSize || DEFAULT_INITIAL_SIZE,
                        };
                    }
                }),
            };
        });
    },

    /**
     * Close all windows
     */
    closeAllWindows: () => {
        set({
            windows: [],
            focusedWindowId: null,
            highestZIndex: 0,
        });
    },

    /**
     * Get a window by ID
     */
    getWindow: (id: string) => {
        return get().windows.find(w => w.id === id);
    },

    /**
     * Set window position (for drag operations)
     */
    setWindowPosition: (id: string, position: WindowPosition) => {
        set(state => ({
            windows: state.windows.map(w =>
                w.id === id ? { ...w, position } : w
            ),
        }));
    },

    /**
     * Set window size (for resize operations)
     */
    setWindowSize: (id: string, size: WindowSize) => {
        set(state => ({
            windows: state.windows.map(w =>
                w.id === id ? { ...w, size } : w
            ),
        }));
    },

    /**
     * Initialize windows from configuration
     */
    initializeWindows: (configs: WindowConfig[]) => {
        const windows: WindowState[] = configs.map((config, index) => ({
            id: config.id || generateWindowId(),
            title: config.title,
            icon: config.icon,
            component: config.component,
            position: config.position || {
                x: DEFAULT_INITIAL_POSITION.x + index * 30,
                y: DEFAULT_INITIAL_POSITION.y + index * 30,
            },
            size: config.size || DEFAULT_INITIAL_SIZE,
            minSize: config.minSize || DEFAULT_MIN_SIZE,
            zIndex: index + 1,
            isMinimized: false,
            isMaximized: false,
            isFocused: index === configs.length - 1, // Last window is focused
            className: config.className,
        }));

        set({
            windows,
            focusedWindowId: windows.length > 0 ? windows[windows.length - 1].id : null,
            highestZIndex: windows.length,
        });
    },
}));

/**
 * Selectors for optimized component subscriptions
 * Use these to prevent unnecessary re-renders
 */

// Get all visible (non-minimized) windows
export const selectVisibleWindows = (state: WindowStore) =>
    state.windows.filter(w => !w.isMinimized);

// Get all minimized windows (for dock)
export const selectMinimizedWindows = (state: WindowStore) =>
    state.windows.filter(w => w.isMinimized);

// Get focused window
export const selectFocusedWindow = (state: WindowStore) =>
    state.windows.find(w => w.id === state.focusedWindowId);

// Get window by ID (creates a selector function)
export const selectWindowById = (id: string) => (state: WindowStore) =>
    state.windows.find(w => w.id === id);

// Check if a specific window is focused
export const selectIsWindowFocused = (id: string) => (state: WindowStore) =>
    state.focusedWindowId === id;

// Get window count
export const selectWindowCount = (state: WindowStore) => state.windows.length;

// Get visible window count
export const selectVisibleWindowCount = (state: WindowStore) =>
    state.windows.filter(w => !w.isMinimized).length;
