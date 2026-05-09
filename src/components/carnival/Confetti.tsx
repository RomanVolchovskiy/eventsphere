"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#FFC857", "#FF3D80", "#4DE0B5", "#FF5757", "#FFF1E0", "#7C5BFF"];

interface Piece {
  x: number; y: number; w: number; h: number;
  vx: number; vy: number; rot: number; vrot: number;
  color: string; shape: "circle" | "rect" | "ribbon";
}

export default function Confetti({ density = 80 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = window.devicePixelRatio || 1;
    let w = 0, h = 0;
    let pieces: Piece[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const init = () => {
      pieces = Array.from({ length: density }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * -h,
        w: 6 + Math.random() * 6,
        h: 9 + Math.random() * 9,
        vx: (Math.random() - 0.5) * 0.6,
        vy: 1 + Math.random() * 2.4,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 0.12,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: Math.random() < 0.4 ? "circle" : Math.random() < 0.7 ? "rect" : "ribbon",
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pieces) {
        p.x += p.vx + Math.sin((p.y + p.x) / 60) * 0.4;
        p.y += p.vy;
        p.rot += p.vrot;
        if (p.y > h + 30) { p.y = -30; p.x = Math.random() * w; }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "ribbon") {
          ctx.fillRect(-p.w, -1, p.w * 2, 2);
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    const onResize = () => { resize(); init(); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
