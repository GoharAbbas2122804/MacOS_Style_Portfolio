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

// Dock item configuration
interface DockItemConfig {
    id: string;
    label: string;
    icon: string;
    color?: string;
    url?: string;
}

const DOCK_ITEMS: DockItemConfig[] = [
    { id: "hero", label: "Finder", icon: "/icons/dock/finder.svg" },
    { id: "about", label: "About", icon: "/icons/dock/person.svg" },
    { id: "projects", label: "Projects", icon: "/icons/dock/folder.svg" },
    { id: "skills", label: "Skills", icon: "/icons/dock/target.svg" },
    { id: "contact", label: "Contact", icon: "/icons/dock/message.svg" },
    { id: "github", label: "GitHub", icon: "/icons/dock/github.svg", url: "https://github.com" },
    { id: "linkedin", label: "LinkedIn", icon: "/icons/dock/linkedin.svg", url: "https://linkedin.com" },
];

// Separator index - items after this index are external links
const SEPARATOR_INDEX = 5;

// Spring configuration matching Apple's physics
const SPRING_CONFIG = {
    stiffness: 400,
    damping: 30,
    mass: 0.8,
};

interface DockIconProps {
    mouseX: MotionValue<number>;
    item: DockItemConfig;
    isActive: boolean;
    onClick: () => void;
}

// Cosine-based magnification algorithm (Apple's approach)
function useMagnification(mouseX: MotionValue<number>, ref: React.RefObject<HTMLDivElement>) {
    const baseSize = 56;
    const maxSize = 72;
    const magnificationRange = 150; // pixels from center where magnification occurs

    const distance = useTransform(mouseX, (val: number) => {
        if (!ref.current) return magnificationRange;
        const bounds = ref.current.getBoundingClientRect();
        const centerX = bounds.x + bounds.width / 2;
        return Math.abs(val - centerX);
    });

    // Cosine falloff for smooth magnification
    const size = useTransform(distance, (d: number) => {
        if (d > magnificationRange) return baseSize;
        // Cosine interpolation: 1 at center, 0 at edge
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

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <motion.div
                    ref={ref}
                    style={{ width: size, height: size }}
                    onClick={onClick}
                    className="relative flex items-center justify-center cursor-pointer group"
                    whileHover={{
                        filter: "drop-shadow(0 0 12px rgba(0, 191, 255, 0.4))",
                    }}
                    transition={{ type: "spring", ...SPRING_CONFIG }}
                >
                    {/* Icon container with glassmorphism */}
                    <motion.div
                        className="w-full h-full rounded-[12px] bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden"
                        whileHover={{
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            borderColor: "rgba(0, 191, 255, 0.4)",
                        }}
                    >
                        <img
                            src={item.icon}
                            alt={item.label}
                            className="w-[75%] h-[75%] object-contain"
                            draggable={false}
                        />
                    </motion.div>

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
                                    "0 0 8px rgba(0, 191, 255, 0.8)",
                                    "0 0 4px rgba(0, 191, 255, 0.6)",
                                ],
                            }}
                            transition={{
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.2 },
                                boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                            }}
                        />
                    )}
                </motion.div>
            </TooltipTrigger>
            <TooltipContent
                side="top"
                className="mb-3 px-3 py-1.5 bg-[#0A2540]/90 text-white text-sm font-medium border border-white/10 backdrop-blur-xl rounded-md shadow-lg"
            >
                {item.label}
            </TooltipContent>
        </Tooltip>
    );
});

// Vertical separator component
function DockSeparator() {
    return (
        <div className="h-10 w-px bg-white/20 mx-1 self-center" />
    );
}

interface AuthenticMacOSDockProps {
    activeId?: string;
    onNavItemClick?: (id: string) => void;
}

export default function AuthenticMacOSDock({
    activeId,
    onNavItemClick,
}: AuthenticMacOSDockProps) {
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
            className="fixed bottom-5 left-1/2 z-50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.5 }}
            style={{ transform: "translateX(-50%)" }}
        >
            {/* Dock container with Tahoe glassmorphism */}
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="flex items-end gap-2 px-4 py-3 rounded-[18px] backdrop-blur-[24px] border border-white/15"
                style={{
                    background: "rgba(10, 37, 64, 0.4)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                }}
            >
                {DOCK_ITEMS.map((item, index) => (
                    <div key={item.id} className="flex items-end">
                        {/* Add separator before external links */}
                        {index === SEPARATOR_INDEX && <DockSeparator />}
                        <DockIcon
                            mouseX={mouseX}
                            item={item}
                            isActive={activeId === item.id}
                            onClick={() => handleItemClick(item)}
                        />
                    </div>
                ))}
            </motion.div>
        </motion.div>
    );
}
