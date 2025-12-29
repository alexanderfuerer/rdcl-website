import React, { useEffect, useRef } from 'react';

export const NeuralNetworkCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const particleCount = 100;
        const connectionDistance = 210;

        class Particle {
            x: number; y: number; vx: number; vy: number; radius: number; color: string; baseAlpha: number;
            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.vx = (Math.random() - 0.5) * 0.55;
                this.vy = (Math.random() - 0.5) * 0.55;
                this.radius = Math.random() * 5 + 4;
                this.baseAlpha = 0.95;
                const colors = ['#5a7da3', '#ff4e05', '#6d8a7a', '#111111'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < -60) this.x = canvas!.width + 60;
                if (this.x > canvas!.width + 60) this.x = -60;
                if (this.y < -60) this.y = canvas!.height + 60;
                if (this.y > canvas!.height + 60) this.y = -60;
                this.vx += (Math.random() - 0.5) * 0.008;
                this.vy += (Math.random() - 0.5) * 0.008;
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > 1.1) { this.vx *= 0.96; this.vy *= 0.96; }
            }
            draw() {
                ctx!.beginPath(); ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx!.fillStyle = this.color; ctx!.globalAlpha = this.baseAlpha; ctx!.fill();
            }
        }

        const init = () => {
            const rect = container.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            canvas.width = rect.width;
            canvas.height = rect.height;
            particles = [];
            for (let i = 0; i < particleCount; i++) particles.push(new Particle());
        };

        const animate = (time: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i]; p1.update(); p1.draw();
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x; const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < connectionDistance) {
                        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
                        const alpha = (1 - (distance / connectionDistance)) * 0.5;
                        ctx.strokeStyle = `rgba(90, 125, 163, ${alpha})`; ctx.lineWidth = 2.2; ctx.stroke();
                        const uniqueSpeed = 0.0007 + ((i * j) % 8) * 0.00018;
                        const uniqueOffset = (i + j) * 2;
                        const flowTime = (time * uniqueSpeed + uniqueOffset) % 1;
                        if ((i + j) % 15 === 0) {
                            const sx = p1.x + (p2.x - p1.x) * flowTime;
                            const sy = p1.y + (p2.y - p1.y) * flowTime;
                            ctx.beginPath(); ctx.arc(sx, sy, 2.0, 0, Math.PI * 2);
                            ctx.fillStyle = '#ff4e05'; ctx.globalAlpha = alpha * 4.5 * Math.min(1, flowTime * 8); ctx.fill();
                        }
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        const timer = setTimeout(() => {
            init();
            animate(0);
        }, 100);

        const handleResize = () => init();
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-[650px] flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full relative z-10" />
        </div>
    );
};
