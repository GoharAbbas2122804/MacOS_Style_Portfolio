import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Shield, Lock, ExternalLink, Github } from "lucide-react";
import { PROJECTS } from "@/lib/constants";
import Image from "next/image";

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
            {PROJECTS.map((project) => (
              <div 
                key={project.id} 
                className="group relative rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white hover:-translate-y-1"
              >
                {/* Preview Area with Project Image */}
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">{project.title}</h3>
                    {project.category && (
                      <span className="text-xs text-white/90 mt-1 block">{project.category}</span>
                    )}
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl">{project.title}</h3>
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-700 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tools.map(tool => (
                      <span key={tool} className="px-2 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded-md">
                        {tool}
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
