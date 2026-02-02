import { useState, useEffect, useCallback } from 'react';

// Breakpoints matching the design requirements
const BREAKPOINTS = {
    mobile: 768,
    tablet: 1280,
    desktop: 1440,
} as const;

// Storage key for user preference
const STORAGE_KEY = 'preferDesktopView';

export interface DeviceInfo {
    isMobile: boolean;      // < 768px
    isTablet: boolean;      // 768px - 1279px
    isDesktop: boolean;     // ≥ 1280px
    isLargeDesktop: boolean; // ≥ 1440px
    width: number;
    height: number;
    isLandscape: boolean;
    preferDesktopView: boolean;
}

// Debounce utility
function debounce<T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number
): T {
    let timeoutId: ReturnType<typeof setTimeout>;
    return ((...args: unknown[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    }) as T;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Get stored preference
function getStoredPreference(): boolean {
    if (!isBrowser) return false;
    try {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
        return false;
    }
}

// Set stored preference
export function setPreferDesktopView(value: boolean): void {
    if (!isBrowser) return;
    try {
        localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
        // Silently fail if localStorage is not available
    }
}

// Get initial device info (SSR-safe)
function getInitialDeviceInfo(): DeviceInfo {
    if (!isBrowser) {
        return {
            isMobile: false,
            isTablet: false,
            isDesktop: true,
            isLargeDesktop: true,
            width: 1920,
            height: 1080,
            isLandscape: true,
            preferDesktopView: false,
        };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
        isMobile: width < BREAKPOINTS.mobile,
        isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
        isDesktop: width >= BREAKPOINTS.tablet,
        isLargeDesktop: width >= BREAKPOINTS.desktop,
        width,
        height,
        isLandscape: width > height,
        preferDesktopView: getStoredPreference(),
    };
}

/**
 * Advanced device detection hook with SSR support
 * 
 * Features:
 * - Uses window.matchMedia() for performance
 * - Debounced resize listener (150ms)
 * - SSR-safe with graceful fallback
 * - Orientation change detection
 * - localStorage preference for "continue anyway" option
 * 
 * @returns DeviceInfo object with device state and dimensions
 */
export function useDeviceDetection(): DeviceInfo {
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getInitialDeviceInfo);

    // Update device info based on current window state
    const updateDeviceInfo = useCallback(() => {
        if (!isBrowser) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        setDeviceInfo({
            isMobile: width < BREAKPOINTS.mobile,
            isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
            isDesktop: width >= BREAKPOINTS.tablet,
            isLargeDesktop: width >= BREAKPOINTS.desktop,
            width,
            height,
            isLandscape: width > height,
            preferDesktopView: getStoredPreference(),
        });
    }, []);

    // Toggle the desktop preference
    const togglePreferDesktopView = useCallback((value: boolean) => {
        setPreferDesktopView(value);
        updateDeviceInfo();
    }, [updateDeviceInfo]);

    useEffect(() => {
        if (!isBrowser) return;

        // Set initial state after hydration
        updateDeviceInfo();

        // Create debounced resize handler
        const debouncedResize = debounce(updateDeviceInfo, 150);

        // Use matchMedia for more efficient change detection
        const mobileQuery = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile - 1}px)`);
        const tabletQuery = window.matchMedia(`(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.tablet - 1}px)`);
        const landscapeQuery = window.matchMedia('(orientation: landscape)');

        // Media query change handlers
        const handleMediaChange = () => {
            updateDeviceInfo();
        };

        // Add listeners
        mobileQuery.addEventListener('change', handleMediaChange);
        tabletQuery.addEventListener('change', handleMediaChange);
        landscapeQuery.addEventListener('change', handleMediaChange);
        window.addEventListener('resize', debouncedResize);

        // Cleanup
        return () => {
            mobileQuery.removeEventListener('change', handleMediaChange);
            tabletQuery.removeEventListener('change', handleMediaChange);
            landscapeQuery.removeEventListener('change', handleMediaChange);
            window.removeEventListener('resize', debouncedResize);
        };
    }, [updateDeviceInfo]);

    return deviceInfo;
}

/**
 * Hook to check if device should show mobile warning
 * Takes into account user preference
 */
export function useShouldShowMobileWarning(): {
    shouldShowWarning: boolean;
    dismissWarning: () => void;
    deviceInfo: DeviceInfo;
} {
    const deviceInfo = useDeviceDetection();
    const [dismissed, setDismissed] = useState(false);

    const dismissWarning = useCallback(() => {
        setPreferDesktopView(true);
        setDismissed(true);
    }, []);

    const shouldShowWarning = deviceInfo.isMobile && !deviceInfo.preferDesktopView && !dismissed;

    return {
        shouldShowWarning,
        dismissWarning,
        deviceInfo,
    };
}

export default useDeviceDetection;
