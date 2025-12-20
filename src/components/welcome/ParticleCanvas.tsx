"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/gsap-utils";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

interface ParticleCanvasProps {
  particleCount?: number;
  particleColor?: string;
  className?: string;
}

/**
 * ParticleCanvas Component
 * Creates subtle floating particles using Canvas API and GSAP
 * Performance-optimized with RAF and reduced particle count
 */
export function ParticleCanvas({
  particleCount = 30,
  particleColor = "rgba(59, 130, 246, 0.3)",
  className,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    // Skip animation if reduced motion is preferred
    if (prefersReducedMotion()) {
      return;
    }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    // Animate each particle with GSAP
    particlesRef.current.forEach((particle) => {
      // Random floating motion
      gsap.to(particle, {
        x: `+=${gsap.utils.random(-50, 50)}`,
        y: `+=${gsap.utils.random(-50, 50)}`,
        duration: gsap.utils.random(8, 15),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Subtle opacity pulse
      gsap.to(particle, {
        opacity: gsap.utils.random(0.1, 0.6),
        duration: gsap.utils.random(2, 4),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) {
          particle.x = canvas.offsetWidth;
        }
        if (particle.x > canvas.offsetWidth) {
          particle.x = 0;
        }
        if (particle.y < 0) {
          particle.y = canvas.offsetHeight;
        }
        if (particle.y > canvas.offsetHeight) {
          particle.y = 0;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });

      rafRef.current = window.requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      particlesRef.current.forEach((particle) => {
        gsap.killTweensOf(particle);
      });
    };
  }, [particleCount, particleColor]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
