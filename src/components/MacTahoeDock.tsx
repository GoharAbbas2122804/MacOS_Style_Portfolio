import { useRef, useCallback, memo } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    MotionValue,
} from "framer-motion";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface DockItemConfig {
    id: string;
    label: string;
    icon: string;
    url?: string;
}

const DOCK_ITEMS: DockItemConfig[] = [
    { id: "finder", label: "Finder", icon: "/icons/dock/finder.svg" },
    { id: "about", label: "About", icon: "/icons/dock/about.svg" },
    { id: "projects", label: "Projects", icon: "/icons/dock/projects.svg" },
    { id: "skills", label: "Skills", icon: "/icons/dock/skills.svg" },
    { id: "contact", label: "Contact", icon: "/icons/dock/contact.svg" },
    { id: "github", label: "GitHub", icon: "/icons/dock/github.svg", url: "https://github.com/GoharAbbas2122804" },
    { id: "linkedin", label: "LinkedIn", icon: "/icons/dock/linkedin.svg", url: "https://www.linkedin.com/in/gohar-abbas-106519321/" },
    { id: "reddit", label: "Reddit", icon: "/icons/dock/reddit.png", url: "https://www.reddit.com/user/GoharAbbasKhokhar/" },
    { id: "upwork", label: "Upwork", icon: "/icons/dock/upwork.png", url: "https://www.upwork.com/freelancers/~01333d822dfed5da18" },
];

// Separator index - items after this index are external links
const SEPARATOR_INDEX = 4; // After contact

// Apple-like spring physics configuration
const SPRING_CONFIG = {
    stiffness: 400,
    damping: 28,
    mass: 0.6,
};

interface DockIconProps {
    mouseX: MotionValue<number>;
    item: DockItemConfig;
    isActive: boolean;
    onClick: () => void;
}

// Cosine-based magnification algorithm (Apple's approach)
function useMagnification(mouseX: MotionValue<number>, ref: React.RefObject<HTMLDivElement | null>) {
    const baseSize = typeof window !== 'undefined' && window.innerWidth < 1024 ? 44 : 52;
    const maxSize = typeof window !== 'undefined' && window.innerWidth < 1024 ? 64 : 76;
    const magnificationRange = typeof window !== 'undefined' && window.innerWidth < 1024 ? 100 : 140;

    const distance = useTransform(mouseX, (val: number) => {
        if (!ref.current) return magnificationRange;
        const bounds = ref.current.getBoundingClientRect();
        const centerX = bounds.x + bounds.width / 2;
        return Math.abs(val - centerX);
    });

    // Cosine falloff for smooth magnification
    const size = useTransform(distance, (d: number) => {
        if (d > magnificationRange) return baseSize;
        const ratio = Math.cos((d / magnificationRange) * (Math.PI / 2));
        return baseSize + (maxSize - baseSize) * ratio;
    });

    return useSpring(size, SPRING_CONFIG);
}

const DockIcon = memo(function DockIcon({
    mouseX,
    item,
    isActive,
    onClick,
}: DockIconProps) {
    const ref = useRef<HTMLDivElement>(null);
    const size = useMagnification(mouseX, ref);

    // Spring for hover glow
    const glowOpacity = useSpring(0, { stiffness: 300, damping: 20 });

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <motion.div
                    ref={ref}
                    style={{ width: size, height: size }}
                    onClick={onClick}
                    onHoverStart={() => glowOpacity.set(1)}
                    onHoverEnd={() => glowOpacity.set(0)}
                    className="relative flex items-center justify-center cursor-pointer"
                    whileHover={{
                        y: -8,
                    }}
                    transition={{ type: "spring", ...SPRING_CONFIG }}
                >
                    {/* Icon container with macOS rounded square */}
                    <motion.div
                        className="w-full h-full rounded-[11px] flex items-center justify-center overflow-hidden relative"
                        style={{
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                        }}
                    >
                        <img
                            src={item.icon}
                            alt={item.label}
                            className="w-full h-full object-contain"
                            draggable={false}
                        />
                    </motion.div>

                    {/* Hover glow effect (#00BFFF) */}
                    <motion.div
                        className="absolute inset-0 rounded-[11px] pointer-events-none"
                        style={{
                            opacity: glowOpacity,
                            boxShadow: "0 0 20px rgba(0, 191, 255, 0.5), 0 0 40px rgba(0, 191, 255, 0.3)",
                        }}
                    />

                    {/* Active indicator - pulsing blue dot */}
                    {isActive && (
                        <motion.div
                            className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-[#00BFFF]"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                boxShadow: [
                                    "0 0 4px rgba(0, 191, 255, 0.6)",
                                    "0 0 10px rgba(0, 191, 255, 0.9)",
                                    "0 0 4px rgba(0, 191, 255, 0.6)",
                                ],
                            }}
                            transition={{
                                opacity: { duration: 0.2 },
                                scale: { type: "spring", stiffness: 500, damping: 20 },
                                boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                            }}
                        />
                    )}
                </motion.div>
            </TooltipTrigger>
            <TooltipContent
                side="top"
                className="mb-3 px-3 py-1.5 bg-[#1C1C1E]/95 text-white text-sm font-medium border border-white/10 backdrop-blur-xl rounded-md shadow-lg"
            >
                {item.label}
            </TooltipContent>
        </Tooltip>
    );
});

// Vertical separator component
function DockSeparator() {
    return (
        <div className="h-8 w-px bg-white/20 mx-2 self-center" />
    );
}

interface MinimizedWindow {
    id: string;
    title: string;
    icon?: React.ReactNode;
}

interface MacTahoeDockProps {
    activeId?: string;
    onNavItemClick?: (id: string) => void;
    minimizedWindows?: MinimizedWindow[];
}

export default function MacTahoeDock({
    activeId,
    onNavItemClick,
    minimizedWindows = [],
}: MacTahoeDockProps) {
    const mouseX = useMotionValue(Infinity);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            mouseX.set(e.clientX);
        },
        [mouseX]
    );

    const handleMouseLeave = useCallback(() => {
        mouseX.set(Infinity);
    }, [mouseX]);

    const handleItemClick = useCallback(
        (item: DockItemConfig) => {
            if (item.url) {
                window.open(item.url, "_blank", "noopener,noreferrer");
            } else if (onNavItemClick) {
                onNavItemClick(item.id);
            }
        },
        [onNavItemClick]
    );

    return (
        <motion.div
            className="fixed z-50 left-0 right-0 bottom-5 flex justify-center pointer-events-none"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.5 }}
        >
            {/* Dock container with exact Tahoe glassmorphism */}
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="flex items-end gap-1.5 px-3 py-2 pointer-events-auto max-w-[95vw] overflow-x-auto no-scrollbar"
                style={{
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    background: "rgba(10, 37, 64, 0.4)",
                    borderRadius: "22px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                }}
            >
                {DOCK_ITEMS.map((item, index) => (
                    <div key={item.id} className="flex items-end">
                        <DockIcon
                            mouseX={mouseX}
                            item={item}
                            isActive={activeId === item.id}
                            onClick={() => handleItemClick(item)}
                        />
                        {/* Add separator before external links */}
                        {index === SEPARATOR_INDEX && <DockSeparator />}
                    </div>
                ))}
            </motion.div>
        </motion.div>
    );
}

// Export dock items for use in responsive container
export { DOCK_ITEMS };
export type { DockItemConfig };
