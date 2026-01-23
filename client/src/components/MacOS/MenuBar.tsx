import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Apple, Wifi, Battery, Search, Volume2 } from "lucide-react";

export function MenuBar({ appName = "Finder" }: { appName?: string }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-black/20 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 z-[100] text-xs font-medium text-white shadow-sm select-none">
      <div className="flex items-center gap-4">
        <div className="hover:bg-white/10 px-2 py-1 rounded cursor-pointer transition-colors">
          <Apple className="w-4 h-4 fill-current" />
        </div>
        <span className="font-bold cursor-default">{appName}</span>
        <div className="hidden md:flex gap-4 font-normal text-white/90">
          <span className="hover:bg-white/10 px-2 py-1 rounded cursor-pointer transition-colors">File</span>
          <span className="hover:bg-white/10 px-2 py-1 rounded cursor-pointer transition-colors">Edit</span>
          <span className="hover:bg-white/10 px-2 py-1 rounded cursor-pointer transition-colors">View</span>
          <span className="hover:bg-white/10 px-2 py-1 rounded cursor-pointer transition-colors">Go</span>
          <span className="hover:bg-white/10 px-2 py-1 rounded cursor-pointer transition-colors">Window</span>
          <span className="hover:bg-white/10 px-2 py-1 rounded cursor-pointer transition-colors">Help</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 px-2">
          <Battery className="w-4 h-4 rotate-90" />
          <Wifi className="w-4 h-4" />
          <Search className="w-4 h-4" />
          <Volume2 className="w-4 h-4" />
        </div>
        <div className="hover:bg-white/10 px-2 py-1 rounded cursor-pointer transition-colors">
          {format(time, "EEE MMM d h:mm aa")}
        </div>
      </div>
    </div>
  );
}
