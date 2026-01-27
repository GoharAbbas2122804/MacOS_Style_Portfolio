import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    User,
    Folder,
    Target,
    MessageSquare,
    Github,
    Linkedin,
    Menu,
    X
} from "lucide-react";

interface ResponsiveContainerProps {
    children: ReactNode;
    activeId: string;
    onNavItemClick: (id: string) => void;
}

export default function ResponsiveContainer({
    children,
    activeId,
    onNavItemClick
}: ResponsiveContainerProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const menuItems = [
        { id: "hero", icon: <Home />, label: "Home" },
        { id: "about", icon: <User />, label: "About" },
        { id: "projects", icon: <Folder />, label: "Projects" },
        { id: "skills", icon: <Target />, label: "Skills" },
        { id: "contact", icon: <MessageSquare />, label: "Contact" },
        { id: "github", icon: <Github />, label: "GitHub", url: "https://github.com" },
        { id: "linkedin", icon: <Linkedin />, label: "LinkedIn", url: "https://linkedin.com" },
    ];

    return (
        <div className="min-h-screen w-screen overflow-x-hidden relative">
            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobile && (
                    <>
                        {/* Sidebar Toggle */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="fixed top-4 left-4 z-[60] p-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-white"
                        >
                            {isSidebarOpen ? <X /> : <Menu />}
                        </button>

                        {isSidebarOpen && (
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -100, opacity: 0 }}
                                className="fixed inset-y-0 left-0 w-[72px] bg-black/40 backdrop-blur-[20px] border-r border-white/10 z-50 flex flex-col items-center py-20 gap-6"
                            >
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            if (item.url) window.open(item.url, "_blank");
                                            else {
                                                onNavItemClick(item.id);
                                                setIsSidebarOpen(false);
                                            }
                                        }}
                                        className={`p-4 rounded-xl transition-all ${activeId === item.id
                                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                                                : "text-gray-400 hover:bg-white/5"
                                            }`}
                                    >
                                        <div className="w-6 h-6">{item.icon}</div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <motion.main
                className={`${isMobile ? "px-4 pt-16 pb-20" : ""} w-full h-full relative z-10`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.main>

            {/* Swipe Detection Overlay (Mobile only) */}
            {isMobile && (
                <motion.div
                    className="fixed inset-0 pointer-events-none z-[40]"
                    onPanEnd={(_, info) => {
                        if (info.offset.x > 100) setIsSidebarOpen(true);
                        if (info.offset.x < -100) setIsSidebarOpen(false);
                    }}
                />
            )}
        </div>
    );
}
