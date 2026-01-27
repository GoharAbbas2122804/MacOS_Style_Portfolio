import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function Wallpaper() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const waves = [
            {
                y: height * 0.5,
                length: 0.005,
                amplitude: 60,
                frequency: 0.02,
                color: "rgba(10, 37, 64, 0.8)",
            },
            {
                y: height * 0.6,
                length: 0.003,
                amplitude: 80,
                frequency: 0.015,
                color: "rgba(0, 191, 255, 0.5)",
            },
            {
                y: height * 0.7,
                length: 0.004,
                amplitude: 100,
                frequency: 0.01,
                color: "rgba(10, 37, 64, 0.6)",
            },
        ];

        let animationFrameId: number;
        let increment = waves[0].frequency;

        const mouse = { x: width / 2, y: height / 2 };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener("mousemove", handleMouseMove);

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, width, height);

            // Background Gradient
            const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
            bgGradient.addColorStop(0, "#051624"); // Even deeper midnight
            bgGradient.addColorStop(1, "#0A2540"); // Deep cobalt
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            waves.forEach((wave, index) => {
                ctx.beginPath();
                ctx.moveTo(0, height);
                ctx.lineTo(0, wave.y);

                for (let i = 0; i < width; i++) {
                    const mouseEffect = Math.exp(-Math.pow(i - mouse.x, 2) / 20000);
                    const yOffset = Math.sin(i * wave.length + increment) * wave.amplitude;
                    const ripple = mouseEffect * (mouse.y - wave.y) * 0.2;

                    ctx.lineTo(i, wave.y + yOffset + ripple);
                }

                ctx.lineTo(width, height);
                ctx.fillStyle = wave.color;
                ctx.fill();

                // Particles on crests
                if (index === 1) { // Middle wave for sparkles
                    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
                    for (let i = 0; i < width; i += 50) {
                        const y = wave.y + Math.sin(i * wave.length + increment) * wave.amplitude;
                        if (Math.random() > 0.95) {
                            ctx.beginPath();
                            ctx.arc(i, y, 1.5, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            });

            increment += waves[0].frequency;
        };

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full -z-10 bg-[#0A2540]"
        />
    );
}
