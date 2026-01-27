import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
    Home,
    User,
    Folder,
    Target,
    MessageSquare,
    Github,
    Linkedin
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const DOCK_ITEMS = [
    { id: "hero", label: "Home", icon: <Home />, color: "text-blue-400" },
    { id: "about", label: "About", icon: <User />, color: "text-purple-400" },
    { id: "projects", label: "Projects", icon: <Folder />, color: "text-yellow-400" },
    { id: "skills", label: "Skills", icon: <Target />, color: "text-red-400" },
    { id: "contact", label: "Contact", icon: <MessageSquare />, color: "text-green-400" },
    { id: "github", label: "GitHub", icon: <Github />, color: "text-gray-400", url: "https://github.com" },
    { id: "linkedin", label: "LinkedIn", icon: <Linkedin />, color: "text-blue-600", url: "https://linkedin.com" },
];

function DockIcon({
    mouseX,
    icon,
    label,
    color,
    activeId,
    onClick
}: any) {
    const ref = useRef<HTMLDivElement>(null);

    const distanceOrigin = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distanceOrigin, [-150, 0, 150], [56, 80, 56]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    const isActive = activeId === label.toLowerCase();

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <motion.div
                    ref={ref}
                    style={{ width }}
                    onClick={onClick}
                    className="aspect-square rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex flex-col items-center justify-center cursor-pointer relative group"
                    whileHover={{
                        scale: 1.2,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 0 20px rgba(0, 191, 255, 0.4)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <div className={`w-8 h-8 flex items-center justify-center ${color}`}>
                        {icon}
                    </div>

                    {isActive && (
                        <motion.div
                            layoutId="active-pill"
                            className="absolute -bottom-2 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        />
                    )}
                </motion.div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black/80 text-white border-white/10 backdrop-blur-xl mb-2">
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    );
}

export default function Dock({ activeId, onNavItemClick }: { activeId?: string, onNavItemClick?: (id: string) => void }) {
    const mouseX = useMotionValue(Infinity);

    return (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-[24px] bg-black/30 border border-white/10 backdrop-blur-[20px] shadow-2xl flex items-end gap-3 h-[72px]">
            <div
                className="flex items-end gap-3"
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
            >
                {DOCK_ITEMS.map((item) => (
                    <DockIcon
                        key={item.id}
                        mouseX={mouseX}
                        activeId={activeId}
                        {...item}
                        onClick={() => {
                            if (item.url) window.open(item.url, "_blank");
                            else if (onNavItemClick) onNavItemClick(item.id);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
