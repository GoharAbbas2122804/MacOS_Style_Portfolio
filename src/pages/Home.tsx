/**
 * Home Page - macOS-style Portfolio
 * 
 * Main page with WindowManager integration using Zustand state.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Monitor, Compass, Terminal as TerminalIcon, Mail as MailIcon } from "lucide-react";
import MacTahoeDock from "@/components/MacTahoeDock";
import { MenuBar } from "@/components/MacOS/MenuBar";
import { WindowManager, Window } from "@/components/WindowManager";
import { Finder } from "@/components/Apps/Finder";
import { Terminal } from "@/components/Apps/Terminal";
import { Safari } from "@/components/Apps/Safari";
import { Mail } from "@/components/Apps/Mail";
import Wallpaper from "@/components/Wallpaper";
import ResponsiveContainer from "@/components/ResponsiveContainer";
import { useWindowStore } from "@/stores/windowStore";
import { WindowConfig, DEFAULT_INITIAL_SIZE, DEFAULT_MIN_SIZE } from "@/stores/windowTypes";
import { useShallow } from 'zustand/react/shallow';

/**
 * User Icon Component
 */
function UserIcon() {
  return (
    <div className="w-4 h-4 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
      <span className="text-[8px] font-bold text-white">GA</span>
    </div>
  );
}

/**
 * Window configurations
 */
const WINDOW_CONFIGS: WindowConfig[] = [
  {
    id: "finder",
    title: "Finder",
    icon: <Monitor className="w-4 h-4 text-blue-500" />,
    component: Finder,
    position: { x: 100, y: 80 },
    size: { width: 800, height: 600 },
    minSize: { width: 400, height: 300 },
  },
  {
    id: "about",
    title: "Gohar Abbas",
    icon: <UserIcon />,
    component: () => (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">About Me</h1>
        <p className="text-lg opacity-80">Welcome to my macOS-style portfolio.</p>
      </div>
    ),
    position: { x: 150, y: 120 },
    size: { width: 600, height: 400 },
    minSize: { width: 400, height: 300 },
  },
  {
    id: "projects",
    title: "Safari",
    icon: <Compass className="w-4 h-4 text-gray-400" />,
    component: Safari,
    position: { x: 200, y: 100 },
    size: { width: 1000, height: 700 },
    minSize: { width: 600, height: 400 },
  },
  {
    id: "skills",
    title: "Terminal — -zsh",
    icon: <TerminalIcon className="w-4 h-4 text-gray-400" />,
    component: Terminal,
    position: { x: 250, y: 150 },
    size: { width: 600, height: 400 },
    minSize: { width: 400, height: 250 },
  },
  {
    id: "contact",
    title: "Mail",
    icon: <MailIcon className="w-4 h-4 text-gray-400" />,
    component: Mail,
    position: { x: 300, y: 130 },
    size: { width: 800, height: 600 },
    minSize: { width: 500, height: 400 },
  },
];

export default function Home() {
  const [booting, setBooting] = useState(true);
  const [progress, setProgress] = useState(0);

  // Zustand store hooks - use useShallow to prevent infinite re-renders
  const { addWindow, restoreWindow, bringToFront, windows, focusedWindowId } = useWindowStore(
    useShallow((state) => ({
      addWindow: state.addWindow,
      restoreWindow: state.restoreWindow,
      bringToFront: state.bringToFront,
      windows: state.windows,
      focusedWindowId: state.focusedWindowId,
    }))
  );

  // Memoize derived values
  const focusedWindow = useMemo(() =>
    windows.find(w => w.id === focusedWindowId),
    [windows, focusedWindowId]
  );

  const minimizedWindows = useMemo(() =>
    windows.filter(w => w.isMinimized).map(w => ({ id: w.id, title: w.title, icon: w.icon })),
    [windows]
  );

  // Get active window ID for dock and menu bar
  const activeWindowId = focusedWindow?.id || 'finder';

  // Boot sequence
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setBooting(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Initialize windows after boot
  useEffect(() => {
    if (!booting && windows.length === 0) {
      // Open Finder as the initial window
      addWindow(WINDOW_CONFIGS[0]);
    }
  }, [booting, windows.length, addWindow]);

  /**
   * Handle navigation item click from dock
   */
  const handleNavItemClick = (id: string) => {
    const config = WINDOW_CONFIGS.find(w => w.id === id);
    if (!config) return;

    // Check if window exists
    const existingWindow = windows.find(w => w.id === id);

    if (existingWindow) {
      if (existingWindow.isMinimized) {
        restoreWindow(id);
      } else {
        bringToFront(id);
      }
    } else {
      // Open new window
      addWindow(config);
    }
  };

  /**
   * Get app name for menu bar
   */
  const getAppName = () => {
    if (!focusedWindow) return 'Finder';
    const config = WINDOW_CONFIGS.find(w => w.id === focusedWindow.id);
    return config?.title || 'Finder';
  };

  // Boot screen
  if (booting) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="mb-8">
          <svg className="w-24 h-24 fill-white" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.93 7.03-11.63 16.51-20.98 16.51-6.9 0-9.22-5.01-19.1-4.92-9.59.09-12.78 5.09-19.1 5.09-8.49 0-16.14-10.27-21.75-18.35-8.2-11.83-12.22-26.68-12.22-42.54 0-21.16 11.24-34.98 29.57-34.98 8.1 0 14.88 5.61 20.25 5.61 5.17 0 11.45-5.61 22.07-5.61 6.94.1 16.64 2.89 24.36 14.28-11.69 7.03-16.13 22.45-16.03 35.83.1 16.91 13.06 28.16 18.06 31.42h.01c-.13.68-.25 1.34-.43 2m-31.54-86.41c4.54-5.5 8.18-12.44 7.6-19.84-6.84.45-14.85 4.88-19.26 10.05-3.81 4.38-7.79 12.39-7.01 19.34 7.7.59 14.19-4.13 18.67-9.55" />
          </svg>
        </div>
        <div className="boot-progress">
          <div className="boot-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer activeId={activeWindowId} onNavItemClick={handleNavItemClick}>
      <Wallpaper />

      {/* Background Dimmer overlay for boot effect */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-black pointer-events-none z-[999]"
      />

      <MenuBar appName={getAppName()} />

      {/* Window Manager */}
      <WindowManager />

      <MacTahoeDock
        activeId={activeWindowId}
        onNavItemClick={handleNavItemClick}
        minimizedWindows={minimizedWindows}
      />
    </ResponsiveContainer>
  );
}
