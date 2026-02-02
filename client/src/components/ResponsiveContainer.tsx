import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { DOCK_ITEMS, DockItemConfig } from "./MacTahoeDock";

interface ResponsiveContainerProps {
    children: ReactNode;
    activeId: string;
    onNavItemClick: (id: string) => void;
}

// Spring physics matching the dock
const SPRING_CONFIG = {
    stiffness: 400,
    damping: 28,
};

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

    const handleItemClick = (item: DockItemConfig) => {
        if (item.url) {
            window.open(item.url, "_blank", "noopener,noreferrer");
        } else {
            onNavItemClick(item.id);
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen w-screen overflow-x-hidden relative">
            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobile && (
                    <>
                        {/* Sidebar Toggle Button */}
                        <motion.button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="fixed top-4 left-4 z-[60] p-3 rounded-xl border border-white/15 text-white"
                            style={{
                                backdropFilter: "blur(24px)",
                                WebkitBackdropFilter: "blur(24px)",
                                background: "rgba(10, 37, 64, 0.6)",
                                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </motion.button>

                        {/* Backdrop overlay */}
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsSidebarOpen(false)}
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                            />
                        )}

                        {/* Sidebar panel - vertical dock */}
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -100, opacity: 0 }}
                                transition={{ type: "spring", ...SPRING_CONFIG }}
                                className="fixed inset-y-0 left-0 w-20 border-r border-white/15 z-50 flex flex-col items-center py-20 gap-3"
                                style={{
                                    backdropFilter: "blur(24px)",
                                    WebkitBackdropFilter: "blur(24px)",
                                    background: "rgba(10, 37, 64, 0.7)",
                                    boxShadow: "4px 0 24px rgba(0, 0, 0, 0.4)",
                                }}
                            >
                                {DOCK_ITEMS.map((item, index) => (
                                    <div key={item.id}>
                                        {/* Separator before external links */}
                                        {index === 5 && (
                                            <div className="w-10 h-px bg-white/20 my-2" />
                                        )}
                                        <motion.button
                                            onClick={() => handleItemClick(item)}
                                            className={`relative p-2 rounded-xl transition-all ${activeId === item.id
                                                ? "bg-[#00BFFF]/20 border border-[#00BFFF]/50"
                                                : "bg-white/5 border border-white/10 hover:bg-white/10"
                                                }`}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            aria-label={item.label}
                                            style={{
                                                boxShadow: activeId === item.id
                                                    ? "0 0 12px rgba(0, 191, 255, 0.4)"
                                                    : "none",
                                            }}
                                        >
                                            <img
                                                src={item.icon}
                                                alt={item.label}
                                                className="w-10 h-10 object-contain"
                                                draggable={false}
                                            />
                                            {/* Active indicator */}
                                            {activeId === item.id && (
                                                <motion.div
                                                    className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#00BFFF] rounded-full"
                                                    layoutId="mobile-active-indicator"
                                                    style={{
                                                        boxShadow: "0 0 8px rgba(0, 191, 255, 0.8)",
                                                    }}
                                                />
                                            )}
                                        </motion.button>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <motion.main
                className={`${isMobile ? "px-2 pt-16 pb-32" : ""} w-full h-full relative z-10`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.main>
        </div>
    );
}
