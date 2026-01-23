import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Monitor, Compass, Terminal as TerminalIcon, Mail as MailIcon, Trash2 } from "lucide-react";
import { Dock } from "@/components/MacOS/Dock";
import { MenuBar } from "@/components/MacOS/MenuBar";
import { Window } from "@/components/MacOS/Window";
import { Finder } from "@/components/Apps/Finder";
import { Terminal } from "@/components/Apps/Terminal";
import { Safari } from "@/components/Apps/Safari";
import { Mail } from "@/components/Apps/Mail";

export default function Home() {
  const [booting, setBooting] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeWindow, setActiveWindow] = useState("finder");
  
  const [windows, setWindows] = useState({
    finder: { isOpen: true, zIndex: 1, title: "Finder", icon: <Monitor className="w-4 h-4 text-blue-500" /> },
    safari: { isOpen: false, zIndex: 2, title: "Safari", icon: <Compass className="w-4 h-4 text-blue-500" /> },
    terminal: { isOpen: false, zIndex: 3, title: "Terminal - gohar@macbook", icon: <TerminalIcon className="w-4 h-4 text-gray-500" /> },
    mail: { isOpen: false, zIndex: 4, title: "Mail", icon: <MailIcon className="w-4 h-4 text-blue-500" /> }
  });

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

  const focusWindow = (key: string) => {
    setWindows(prev => {
      const maxZ = Math.max(...Object.values(prev).map(w => w.zIndex));
      return {
        ...prev,
        [key]: { ...prev[key as keyof typeof prev], isOpen: true, zIndex: maxZ + 1 }
      };
    });
    setActiveWindow(key);
  };

  const closeWindow = (key: string) => {
    setWindows(prev => ({
      ...prev,
      [key]: { ...prev[key as keyof typeof prev], isOpen: false }
    }));
  };

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
    <div className="h-screen w-screen overflow-hidden bg-center bg-cover relative font-sans"
         style={{ backgroundImage: `url('https://pixabay.com/get/g24074ffb837e2e26fb541a103676fc47f07096f52eabf56663b0d072feda757ca3fdab8cf1700e035a85aa8fb45cab9939b9c55335b2dea521ea5086cf5a03d0_1280.jpg')` }}>
      
      {/* Background Dimmer overlay for boot effect */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-black pointer-events-none z-[999]"
      />

      <MenuBar appName={activeWindow === 'finder' ? 'Finder' : windows[activeWindow as keyof typeof windows].title} />

      {/* Windows Area */}
      <div className="absolute inset-0 pt-8 pb-24 z-10 pointer-events-none">
        {/* Pointer events auto for window content */}
        <div className="w-full h-full relative pointer-events-auto">
          
          <Window
            id="finder"
            title="Gohar Abbas"
            icon={<UserIcon />}
            isOpen={windows.finder.isOpen}
            onClose={() => closeWindow("finder")}
            onMinimize={() => closeWindow("finder")}
            onFocus={() => focusWindow("finder")}
            zIndex={windows.finder.zIndex}
          >
            <Finder />
          </Window>

          <Window
            id="safari"
            title="Safari"
            width="w-[90%] md:w-[1000px]"
            height="h-[80%]"
            icon={<Compass className="w-4 h-4 text-gray-400" />}
            isOpen={windows.safari.isOpen}
            onClose={() => closeWindow("safari")}
            onMinimize={() => closeWindow("safari")}
            onFocus={() => focusWindow("safari")}
            zIndex={windows.safari.zIndex}
          >
            <Safari />
          </Window>

          <Window
            id="terminal"
            title="Terminal — -zsh"
            width="w-[600px]"
            height="h-[400px]"
            icon={<TerminalIcon className="w-4 h-4 text-gray-400" />}
            isOpen={windows.terminal.isOpen}
            onClose={() => closeWindow("terminal")}
            onMinimize={() => closeWindow("terminal")}
            onFocus={() => focusWindow("terminal")}
            zIndex={windows.terminal.zIndex}
          >
            <Terminal />
          </Window>

          <Window
            id="mail"
            title="Mail"
            width="w-[800px]"
            height="h-[600px]"
            icon={<MailIcon className="w-4 h-4 text-gray-400" />}
            isOpen={windows.mail.isOpen}
            onClose={() => closeWindow("mail")}
            onMinimize={() => closeWindow("mail")}
            onFocus={() => focusWindow("mail")}
            zIndex={windows.mail.zIndex}
          >
            <Mail />
          </Window>

        </div>
      </div>

      <Dock items={[
        { 
          id: "finder", 
          label: "About Me", 
          icon: <Monitor className="w-8 h-8 text-blue-300" />, 
          isOpen: windows.finder.isOpen, 
          onClick: () => focusWindow("finder") 
        },
        { 
          id: "safari", 
          label: "Projects", 
          icon: <Compass className="w-8 h-8 text-blue-500" />, 
          isOpen: windows.safari.isOpen, 
          onClick: () => focusWindow("safari") 
        },
        { 
          id: "terminal", 
          label: "Skills", 
          icon: <TerminalIcon className="w-8 h-8 text-gray-300" />, 
          isOpen: windows.terminal.isOpen, 
          onClick: () => focusWindow("terminal") 
        },
        { 
          id: "mail", 
          label: "Contact", 
          icon: <MailIcon className="w-8 h-8 text-blue-400" />, 
          isOpen: windows.mail.isOpen, 
          onClick: () => focusWindow("mail") 
        },
        { 
          id: "trash", 
          label: "Trash", 
          icon: <Trash2 className="w-8 h-8 text-gray-400" />, 
          isOpen: false, 
          onClick: () => {} 
        },
      ]} />
    </div>
  );
}

function UserIcon() {
  return (
    <div className="w-4 h-4 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
      <span className="text-[8px] font-bold text-white">GA</span>
    </div>
  );
}
