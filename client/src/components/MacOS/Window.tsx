import React, { useRef } from "react";
import Draggable from "react-draggable";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  zIndex: number;
  children: React.ReactNode;
  width?: string;
  height?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function Window({
  id,
  title,
  isOpen,
  onClose,
  onMinimize,
  onFocus,
  zIndex,
  children,
  width = "w-[800px]",
  height = "h-[600px]",
  className,
  icon
}: WindowProps) {
  const nodeRef = useRef(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <Draggable
          handle=".window-header"
          bounds="parent"
          nodeRef={nodeRef}
          onStart={onFocus}
        >
          <motion.div
            ref={nodeRef}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.002, y: -2 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "absolute top-20 left-10 md:left-1/4 flex flex-col rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[rgba(10,37,64,0.4)] backdrop-blur-[20px] border border-white/10",
              width,
              height,
              className
            )}
            style={{ zIndex }}
            onClick={onFocus}
          >
            {/* Window Header */}
            <div className="window-header h-11 bg-white/[0.03] flex items-center justify-between px-5 select-none cursor-default border-b border-white/5">
              <div className="flex gap-2.5 group">
                <button
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 flex items-center justify-center text-black/50 transition-all"
                >
                  <X className="w-2 h-2 opacity-0 group-hover:opacity-100" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onMinimize(); }}
                  className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#FEBC2E]/80 flex items-center justify-center text-black/50 transition-all"
                >
                  <Minus className="w-2 h-2 opacity-0 group-hover:opacity-100" />
                </button>
                <button
                  className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 flex items-center justify-center text-black/50 transition-all"
                >
                  <Maximize2 className="w-2 h-2 opacity-0 group-hover:opacity-100" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-[13px] font-semibold text-white/90">
                {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
                <span>{title}</span>
              </div>
              <div className="w-14" /> {/* Spacer for balance */}
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-auto relative bg-[#0A2540]/60 text-[#F5F5F5] backdrop-blur-[10px]">
              {children}
            </div>
          </motion.div>
        </Draggable>
      )}
    </AnimatePresence>
  );
}
