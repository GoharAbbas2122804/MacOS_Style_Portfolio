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
            initial={{ scale: 0.8, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "absolute top-20 left-10 md:left-1/4 flex flex-col rounded-xl overflow-hidden shadow-2xl glass-dark border-0",
              width,
              height,
              className
            )}
            style={{ zIndex }}
            onClick={onFocus}
          >
            {/* Window Header */}
            <div className="window-header h-10 bg-[#2d2d2d] flex items-center justify-between px-4 select-none cursor-default border-b border-white/5">
              <div className="flex gap-2 group">
                <button
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 flex items-center justify-center text-black/50 opacity-100 transition-all"
                >
                  <X className="w-2 h-2 opacity-0 group-hover:opacity-100" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onMinimize(); }}
                  className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#FEBC2E]/80 flex items-center justify-center text-black/50 opacity-100 transition-all"
                >
                  <Minus className="w-2 h-2 opacity-0 group-hover:opacity-100" />
                </button>
                <button
                  className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 flex items-center justify-center text-black/50 opacity-100 transition-all"
                >
                  <Maximize2 className="w-2 h-2 opacity-0 group-hover:opacity-100" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                {icon && <span className="w-4 h-4">{icon}</span>}
                <span>{title}</span>
              </div>
              <div className="w-14" /> {/* Spacer for balance */}
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-auto relative bg-[#1e1e1e]/95 text-gray-200">
              {children}
            </div>
          </motion.div>
        </Draggable>
      )}
    </AnimatePresence>
  );
}
