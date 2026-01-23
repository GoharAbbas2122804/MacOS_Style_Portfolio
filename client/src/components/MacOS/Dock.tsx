import { useRef, useEffect } from "react";
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  MotionValue 
} from "framer-motion";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface DockItemProps {
  mouseX: MotionValue;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isOpen: boolean;
}

function DockIcon({ mouseX, icon, label, onClick, isOpen }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [50, 90, 50]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          ref={ref}
          style={{ width }}
          className="aspect-square rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors relative"
          onClick={onClick}
        >
          <div className="w-full h-full p-2 flex items-center justify-center text-white">
            {icon}
          </div>
          {isOpen && (
            <div className="absolute -bottom-2 w-1 h-1 bg-white/80 rounded-full shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
          )}
        </motion.div>
      </TooltipTrigger>
      <TooltipContent className="mb-2 bg-black/50 border-white/10 text-white backdrop-blur-md">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface DockProps {
  items: {
    id: string;
    label: string;
    icon: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
  }[];
}

export function Dock({ items }: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="mx-auto flex h-16 items-end gap-3 rounded-2xl bg-white/10 px-4 pb-3 pt-3 border border-white/10 backdrop-blur-xl shadow-2xl"
      >
        {items.map((item) => (
          <DockIcon 
            key={item.id} 
            mouseX={mouseX} 
            {...item} 
          />
        ))}
      </motion.div>
    </div>
  );
}
