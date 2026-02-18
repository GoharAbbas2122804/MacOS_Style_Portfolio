import { useEffect, useState, useRef } from "react";

export function Terminal() {
  const [lines, setLines] = useState<string[]>([
    "Last login: " + new Date().toString().slice(0, 24) + " on ttys000",
    "gohar-macbook-pro:~ user$ "
  ]);
  const [typedCommand, setTypedCommand] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines, typedCommand]);

  useEffect(() => {
    const command = "gohar --list-skills";
    let index = 0;
    
    // Initial delay before typing
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (index <= command.length) {
          setTypedCommand(command.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          // Execute command
          setTimeout(() => {
            setLines(prev => [
              ...prev.slice(0, -1),
              `gohar-macbook-pro:~ user$ ${command}`,
              "Fetching skills database...",
              "----------------------------------------",
              " > Automation:     n8n, Zapier, Custom Scripts",
              " > Web Scraping:   Python, Selenium, Puppeteer",
              " > Frontend:       React.js, Next.js, Tailwind",
              " > Backend:        Node.js, Express, Python",
              " > AI/ML:          OpenAI API, LangChain, Pandas",
              " > OS:             Linux (Ubuntu, Arch), macOS",
              "----------------------------------------",
              "Done in 0.42s.",
              "gohar-macbook-pro:~ user$ "
            ]);
            setTypedCommand("");
          }, 500);
        }
      }, 50); // Typing speed
    }, 1000);

    return () => clearTimeout(startTimeout);
  }, []);

  return (
    <div 
      className="h-full bg-[#1e1e1e] font-mono text-sm p-4 text-[#33ff00] overflow-auto"
      ref={bodyRef}
      style={{ fontFamily: "'Fira Code', 'Courier New', monospace" }}
    >
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap mb-1">{line}</div>
      ))}
      {typedCommand && (
        <div>
          gohar-macbook-pro:~ user$ {typedCommand}
          <span className="inline-block w-2 h-4 bg-[#33ff00] ml-1 align-middle animate-pulse" />
        </div>
      )}
      {!typedCommand && lines[lines.length - 1].endsWith("$ ") && (
        <span className="inline-block w-2 h-4 bg-[#33ff00] ml-1 align-middle animate-pulse" />
      )}
    </div>
  );
}
