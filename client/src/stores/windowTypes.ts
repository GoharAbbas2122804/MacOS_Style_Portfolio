/**
 * Window Management System - TypeScript Types
 * 
 * Defines all types for the macOS-style window management system.
 * These types are used by the Zustand store and all window components.
 */

import React from 'react';

/**
 * Window position coordinates
 */
export interface WindowPosition {
    x: number;
    y: number;
}

/**
 * Window dimensions
 */
export interface WindowSize {
    width: number;
    height: number;
}

/**
 * Resize direction identifiers
 */
export type ResizeDirection =
    | 'n' | 'ne' | 'e' | 'se'
    | 's' | 'sw' | 'w' | 'nw';

/**
 * Resize handle configuration
 */
export interface ResizeHandle {
    direction: ResizeDirection;
    cursor: string;
    className: string;
}

/**
 * Complete window state
 */
export interface WindowState {
    /** Unique window identifier */
    id: string;
    /** Window title displayed in title bar */
    title: string;
    /** Icon displayed in title bar */
    icon?: React.ReactNode;
    /** Component to render as window content */
    component: React.ComponentType;
    /** Current window position */
    position: WindowPosition;
    /** Current window size */
    size: WindowSize;
    /** Minimum allowed window size */
    minSize: WindowSize;
    /** Maximum allowed window size (viewport by default) */
    maxSize?: WindowSize;
    /** Z-index for stacking order */
    zIndex: number;
    /** Whether window is minimized to dock */
    isMinimized: boolean;
    /** Whether window is maximized to fill screen */
    isMaximized: boolean;
    /** Whether window is currently focused */
    isFocused: boolean;
    /** Stored position before maximize (for restore) */
    prevPosition?: WindowPosition;
    /** Stored size before maximize (for restore) */
    prevSize?: WindowSize;
    /** Custom CSS class for window */
    className?: string;
    /** Initial position for newly opened window */
    defaultPosition?: WindowPosition;
    /** Initial size for newly opened window */
    defaultSize?: WindowSize;
}

/**
 * Configuration for creating a new window
 */
export interface WindowConfig {
    id: string;
    title: string;
    icon?: React.ReactNode;
    component: React.ComponentType;
    position?: WindowPosition;
    size?: WindowSize;
    minSize?: WindowSize;
    className?: string;
}

/**
 * Window store actions
 */
export interface WindowActions {
    /** Add a new window */
    addWindow: (config: WindowConfig) => void;
    /** Remove a window by ID */
    removeWindow: (id: string) => void;
    /** Update partial window state */
    updateWindow: (id: string, updates: Partial<WindowState>) => void;
    /** Bring window to front (focus) */
    bringToFront: (id: string) => void;
    /** Minimize window to dock */
    minimizeWindow: (id: string) => void;
    /** Restore window from minimized state */
    restoreWindow: (id: string) => void;
    /** Toggle maximize/restore */
    toggleMaximize: (id: string) => void;
    /** Close all windows */
    closeAllWindows: () => void;
    /** Get window by ID */
    getWindow: (id: string) => WindowState | undefined;
    /** Set window position */
    setWindowPosition: (id: string, position: WindowPosition) => void;
    /** Set window size */
    setWindowSize: (id: string, size: WindowSize) => void;
    /** Initialize windows from config */
    initializeWindows: (configs: WindowConfig[]) => void;
}

/**
 * Complete window store type
 */
export interface WindowStore extends WindowActions {
    windows: WindowState[];
    focusedWindowId: string | null;
    highestZIndex: number;
}

/**
 * Drag state for performance optimization
 * (Uses refs during drag to avoid re-renders)
 */
export interface DragState {
    isDragging: boolean;
    startPosition: WindowPosition;
    startMousePosition: WindowPosition;
    windowId: string | null;
}

/**
 * Resize state for performance optimization
 */
export interface ResizeState {
    isResizing: boolean;
    direction: ResizeDirection | null;
    startSize: WindowSize;
    startPosition: WindowPosition;
    startMousePosition: WindowPosition;
    windowId: string | null;
}

/**
 * Default window constraints
 */
export const DEFAULT_MIN_SIZE: WindowSize = { width: 400, height: 300 };
export const TABLET_MIN_SIZE: WindowSize = { width: 300, height: 250 };
export const DEFAULT_INITIAL_SIZE: WindowSize = { width: 800, height: 600 };
export const DEFAULT_INITIAL_POSITION: WindowPosition = { x: 100, y: 100 };

/**
 * Menu bar and dock dimensions for viewport constraints
 */
export const MENU_BAR_HEIGHT = 32;
export const DOCK_HEIGHT = 96;
export const WINDOW_PADDING = 8;

/**
 * Traffic light button colors
 */
export const TRAFFIC_LIGHT_COLORS = {
    close: {
        default: '#ff6159',
        active: '#bf4942',
        unfocused: 'rgba(142, 142, 147, 0.5)',
    },
    minimize: {
        default: '#ffbd2e',
        active: '#bf8e22',
        unfocused: 'rgba(142, 142, 147, 0.5)',
    },
    maximize: {
        default: '#28c941',
        active: '#1d9730',
        unfocused: 'rgba(142, 142, 147, 0.5)',
    },
} as const;

/**
 * Animation spring configurations
 */
export const SPRING_CONFIG = {
    default: { stiffness: 300, damping: 30, mass: 1 },
    snappy: { stiffness: 400, damping: 25, mass: 0.8 },
    gentle: { stiffness: 200, damping: 35, mass: 1.2 },
} as const;
