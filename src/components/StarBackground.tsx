import { useEffect, useRef, useCallback } from "react";
import { useAppStore } from "../store/useAppStore";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  opacitySpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

export const StarBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarRef = useRef<ShootingStar | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);

  const { animationEnabled } = useAppStore();

  const initStars = useCallback((width: number, height: number) => {
    const isMobile = window.innerWidth < 768;
    const starCount = isMobile ? 30 : 60;
    starsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      opacitySpeed: (Math.random() * 0.5 + 0.25) * (Math.random() > 0.5 ? 1 : -1),
      twinklePhase: Math.random() * Math.PI * 2,
    }));
  }, []);

  const drawStars = useCallback((ctx: CanvasRenderingContext2D) => {
    starsRef.current.forEach((star) => {
      star.twinklePhase += star.opacitySpeed * 0.02;
      star.opacity = 0.3 + Math.sin(star.twinklePhase) * 0.35;
      star.opacity = Math.max(0.1, Math.min(1, star.opacity));

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 245, 247, ${star.opacity})`;
      ctx.fill();
    });
  }, []);

  const drawMoonGlow = useCallback((ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createRadialGradient(
      window.innerWidth * 0.8,
      window.innerHeight * 0.15,
      0,
      window.innerWidth * 0.8,
      window.innerHeight * 0.15,
      80
    );
    gradient.addColorStop(0, "rgba(232, 220, 196, 0.15)");
    gradient.addColorStop(0.5, "rgba(232, 220, 196, 0.05)");
    gradient.addColorStop(1, "rgba(232, 220, 196, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }, []);

  const maybeSpawnShootingStar = useCallback(() => {
    if (!shootingStarRef.current && Math.random() < 0.002) {
      shootingStarRef.current = {
        x: Math.random() * window.innerWidth * 0.5,
        y: 0,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 6,
        angle: Math.PI / 4 + Math.random() * 0.2,
        opacity: 1,
        active: true,
      };
    }
  }, []);

  const updateAndDrawShootingStar = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const star = shootingStarRef.current;
      if (!star || !star.active) return;

      star.x += Math.cos(star.angle) * star.speed;
      star.y += Math.sin(star.angle) * star.speed;

      if (star.y > window.innerHeight || star.x > window.innerWidth) {
        shootingStarRef.current = null;
        return;
      }

      const tailX = star.x - Math.cos(star.angle) * star.length;
      const tailY = star.y - Math.sin(star.angle) * star.length;

      const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
      gradient.addColorStop(0, "rgba(245, 245, 247, 0)");
      gradient.addColorStop(1, `rgba(245, 245, 247, ${star.opacity})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(star.x, star.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    []
  );

  const animate = useCallback(
    (timestamp: number) => {
      if (!animationEnabled) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      accumulatorRef.current += deltaTime;
      const targetFrameTime = 1000 / 18;

      if (accumulatorRef.current >= targetFrameTime) {
        accumulatorRef.current = 0;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawMoonGlow(ctx);
        drawStars(ctx);
        maybeSpawnShootingStar();
        updateAndDrawShootingStar(ctx);
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [animationEnabled, drawMoonGlow, drawStars, maybeSpawnShootingStar, updateAndDrawShootingStar]
  );

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars(canvas.width, canvas.height);
  }, [initStars]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handleResize();
    window.addEventListener("resize", handleResize);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, handleResize]);

  return (
    <canvas
      ref={canvasRef}
      className="canvas-background"
      aria-hidden="true"
    />
  );
};
