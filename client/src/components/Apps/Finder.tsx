import { Folder, User, FileText, Download, Briefcase, Star, Clock, Cloud } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Finder() {
  return (
    <div className="flex h-full text-sm">
      {/* Sidebar */}
      <div className="w-48 bg-[#1e1e1e]/50 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col gap-6 text-gray-400">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2 px-2">Favorites</h3>
          <ul className="space-y-1">
            <li className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/10 text-white cursor-pointer">
              <User className="w-4 h-4 text-blue-400" /> 
              <span>About Me</span>
            </li>
            <li className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/5 cursor-pointer">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Projects</span>
            </li>
            <li className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/5 cursor-pointer">
              <Download className="w-4 h-4 text-blue-400" />
              <span>Downloads</span>
            </li>
            <li className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/5 cursor-pointer">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Favorites</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2 px-2">iCloud</h3>
          <ul className="space-y-1">
            <li className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/5 cursor-pointer">
              <Cloud className="w-4 h-4 text-gray-400" />
              <span>iCloud Drive</span>
            </li>
            <li className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/5 cursor-pointer">
              <FileText className="w-4 h-4 text-gray-400" />
              <span>Documents</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 bg-[#1e1e1e] p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-start gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px]">
                <Avatar className="w-full h-full border-4 border-[#1e1e1e]">
                  <AvatarImage src="/images/avatar.png" alt="Gohar Abbas" />
                  <AvatarFallback className="text-4xl bg-black text-white">GA</AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute inset-0 rounded-full ring-2 ring-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="space-y-2 pt-4">
              <h1 className="text-4xl font-bold text-white tracking-tight">Gohar Abbas</h1>
              <p className="text-lg text-blue-400 font-medium">Web Developer & AI Automation Expert</p>
              <div className="flex items-center gap-2 text-gray-400 pt-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span>Available for new projects</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400" />
                Expertise
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Specializing in building robust React applications, automated workflows with n8n, 
                and web scraping solutions. I turn complex manual processes into efficient automated systems.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Experience
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Professional web developer with a focus on data science integrations, AI agents, 
                and scalable frontend architectures using Next.js and Linux environments.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-semibold text-white mb-4">Documents</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <FileText className="w-12 h-12 text-gray-300 group-hover:text-white transition-colors" strokeWidth={1} />
                <span className="text-xs text-center group-hover:bg-blue-600 group-hover:px-1 rounded">Resume.pdf</span>
              </div>
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <Folder className="w-12 h-12 text-blue-400 group-hover:text-blue-300 transition-colors fill-blue-400/20" strokeWidth={1} />
                <span className="text-xs text-center group-hover:bg-blue-600 group-hover:px-1 rounded">Projects</span>
              </div>
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <Folder className="w-12 h-12 text-blue-400 group-hover:text-blue-300 transition-colors fill-blue-400/20" strokeWidth={1} />
                <span className="text-xs text-center group-hover:bg-blue-600 group-hover:px-1 rounded">Scripts</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
