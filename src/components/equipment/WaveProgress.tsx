import { useEffect, useRef } from "react";

interface WaveProgressProps {
  /** 0 – 100 */
  progress: number;
  height?: number;
  className?: string;
}

/**
 * Water-fill progress bar. The container fills from bottom to top based on
 * `progress`. Two sine waves overlap on the surface. A tilted "pour stream"
 * on the top-left simulates water being poured in from a bucket.
 */
const WaveProgress = ({ progress, height = 56, className = "" }: WaveProgressProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wave1Ref = useRef<SVGPathElement | null>(null);
  const wave2Ref = useRef<SVGPathElement | null>(null);
  const fillGroupRef = useRef<SVGGElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const progressRef = useRef(progress);
  const displayedRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const width = 600; // viewBox width (aspect keeps waves smooth)
    const h = 100; // viewBox height
    const amp = 4; // wave amplitude
    const points = 40;

    const buildPath = (phase: number, ampMul: number, freq: number) => {
      const step = width / points;
      let d = `M 0 ${h}`;
      for (let i = 0; i <= points; i++) {
        const x = i * step;
        const y = Math.sin(i * freq + phase) * amp * ampMul + amp;
        d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
      }
      d += ` L ${width} ${h} L 0 ${h} Z`;
      return d;
    };

    let start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;

      // Ease displayed progress toward target for smooth rise
      const target = progressRef.current;
      displayedRef.current += (target - displayedRef.current) * 0.12;
      const p = Math.max(0, Math.min(100, displayedRef.current));

      if (wave1Ref.current) {
        wave1Ref.current.setAttribute("d", buildPath(t * 2.2, 1, 0.6));
      }
      if (wave2Ref.current) {
        wave2Ref.current.setAttribute("d", buildPath(-t * 1.6 + 1.5, 0.7, 0.9));
      }
      if (fillGroupRef.current) {
        // Move fill up as progress increases. When p=0 -> translateY(h),
        // when p=100 -> translateY(-amp) so the surface reaches the top.
        const ty = h - (p / 100) * (h + amp);
        fillGroupRef.current.setAttribute("transform", `translate(0 ${ty.toFixed(2)})`);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[var(--radius)] border border-[var(--glass-border-strong)] bg-[var(--glass-input-bg)] ${className}`}
      style={{ height }}
    >
      {/* Pour stream — top-left, tilted, animated droplets */}
      <div className="pointer-events-none absolute left-3 top-0 z-10 h-full">
        <div className="relative h-full w-[6px]">
          <div className="absolute left-0 top-0 h-full w-[3px] -rotate-[8deg] origin-top bg-[linear-gradient(to_bottom,hsl(var(--primary)/0.9),hsl(var(--primary)/0.5)_60%,transparent)] shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
          <div className="absolute left-[1px] top-0 h-full w-[1px] -rotate-[8deg] origin-top bg-[linear-gradient(to_bottom,hsla(0,0%,100%,0.7),transparent_70%)]" />
        </div>
      </div>

      {/* Splash highlight where the stream meets the water */}
      <div
        className="pointer-events-none absolute z-10 h-2 w-2 rounded-full bg-[radial-gradient(circle,hsla(0,0%,100%,0.8),transparent_70%)] animate-pulse"
        style={{ left: "10px", top: `${Math.max(2, height - (progress / 100) * height - 4)}px` }}
      />

      {/* SVG water fill */}
      <svg
        ref={svgRef}
        viewBox="0 0 600 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="waterFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="waterFill2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        <g ref={fillGroupRef}>
          {/* Back wave */}
          <path ref={wave2Ref} fill="url(#waterFill2)" />
          {/* Front wave */}
          <path ref={wave1Ref} fill="url(#waterFill)" />
        </g>
      </svg>

      {/* Subtle inner shadow */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_hsla(0,0%,100%,0.06),inset_0_-1px_0_hsla(0,0%,0%,0.4)]" />

      {/* Tick marks like the previous bar */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_calc(10%-1px),hsla(0,0%,0%,0.22)_calc(10%-1px),hsla(0,0%,0%,0.22)_10%)]" />
    </div>
  );
};

export default WaveProgress;
