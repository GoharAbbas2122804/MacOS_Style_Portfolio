import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Shield, Lock, ExternalLink } from "lucide-react";

interface Project {
  title: string;
  url: string;
  description: string;
  tags: string[];
  gradient: string;
}

const projects: Project[] = [
  {
    title: "Client Hunting Automations",
    url: "automation-suite.gohar.dev",
    description: "Automated workflow system for identifying and reaching out to potential leads using n8n and AI categorization.",
    tags: ["n8n", "Python", "AI"],
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Telegram Scraper Pro",
    url: "tg-scraper.gohar.dev",
    description: "High-performance data extraction tool for Telegram groups with real-time keyword filtering and export capabilities.",
    tags: ["Python", "Telethon", "Data Science"],
    gradient: "from-sky-500 to-blue-600"
  },
  {
    title: "Portfolio 2024",
    url: "gohar.dev",
    description: "MacOS inspired personal portfolio website featuring interactive window management and GSAP animations.",
    tags: ["React", "Tailwind", "GSAP"],
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Data Pipeline Dashboard",
    url: "analytics.gohar.dev",
    description: "Visualization dashboard for complex data pipelines showing real-time throughput and error rates.",
    tags: ["Next.js", "D3.js", "Linux"],
    gradient: "from-emerald-500 to-green-600"
  }
];

export function Safari() {
  const [currentUrl, setCurrentUrl] = useState("gohar.dev/projects");

  return (
    <div className="flex flex-col h-full bg-[#f1f1f1] text-black">
      {/* Toolbar */}
      <div className="h-12 bg-[#f5f5f5] border-b border-gray-300 flex items-center px-4 gap-4 shrink-0">
        <div className="flex gap-4 text-gray-500">
          <ArrowLeft className="w-4 h-4 cursor-pointer hover:text-black" />
          <ArrowRight className="w-4 h-4 cursor-pointer hover:text-black" />
          <RotateCw className="w-4 h-4 cursor-pointer hover:text-black" />
        </div>
        
        <div className="flex-1 max-w-xl mx-auto flex items-center gap-2 bg-[#e3e3e3] rounded-lg px-3 py-1.5 text-sm group focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
          <Shield className="w-3 h-3 text-gray-500" />
          <Lock className="w-3 h-3 text-gray-500" />
          <input 
            className="bg-transparent border-none outline-none w-full text-center group-focus-within:text-left selection:bg-blue-200"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
          />
        </div>

        <div className="w-12"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white p-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Projects</h2>
          <p className="text-gray-500 mb-8">Showcasing automation and web development work.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div 
                key={project.title} 
                className="group relative rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white hover:-translate-y-1"
              >
                {/* Preview Area */}
                <div className={`h-40 bg-gradient-to-br ${project.gradient} flex items-center justify-center p-6 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-md z-10">{project.title}</h3>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                </div>

                {/* Info Area */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl">{project.title}</h3>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
