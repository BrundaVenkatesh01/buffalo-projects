"use client";

/**
 * GradientMesh - Optimized gradient background
 *
 * Performance optimizations:
 * - CSS animations (GPU accelerated) instead of JS
 * - Reduced blur for better performance
 * - Static gradients with CSS animations
 * - will-change hints for browser optimization
 */
export function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-neutral-950" />

      {/* Gradient orbs - pure CSS animations for performance */}
      <div
        className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full opacity-20 animate-float-slow"
        style={{
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)",
          filter: "blur(40px)",
          willChange: "transform",
        }}
      />

      <div
        className="absolute top-[40%] right-[10%] w-[600px] h-[600px] rounded-full opacity-15 animate-float-slower"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
          filter: "blur(40px)",
          willChange: "transform",
        }}
      />

      <div
        className="absolute bottom-[15%] left-[40%] w-[450px] h-[450px] rounded-full opacity-10 animate-float-medium"
        style={{
          background:
            "radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%)",
          filter: "blur(40px)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
