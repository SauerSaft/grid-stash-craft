import { useEffect, useRef } from "react";

interface WaveProgressProps {
  /** 0 – 100 */
  progress: number;
  height?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
}

/**
 * Horizontal water-fill progress bar. Water rushes left → right; the leading
 * edge is a wavy vertical surface. Splash particles fly off the crest with
 * simple gravity physics.
 */
const WaveProgress = ({ progress, height = 56, className = "" }: WaveProgressProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const fillPathRef = useRef<SVGPathElement | null>(null);
  const crestPathRef = useRef<SVGPathElement | null>(null);
  const particlesGroupRef = useRef<SVGGElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const progressRef = useRef(progress);
  const displayedRef = useRef(progress);
  const particlesRef = useRef<Particle[]>([]);
  const lastEmitRef = useRef(0);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const W = 600;
    const H = 100;
    const amp = 5; // wave amplitude on leading edge
    const segs = 24;

    const buildFill = (rightX: number, t: number) => {
      // Left edge straight, right edge wavy vertical line
      let d = `M 0 0 L ${(rightX - amp).toFixed(2)} 0`;
      for (let i = 0; i <= segs; i++) {
        const y = (i / segs) * H;
        const wave =
          Math.sin(i * 0.9 + t * 6) * amp +
          Math.sin(i * 1.7 - t * 4) * amp * 0.4;
        const x = rightX + wave;
        d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
      }
      d += ` L 0 ${H} Z`;
      return d;
    };

    const buildCrest = (rightX: number, t: number) => {
      let d = "";
      for (let i = 0; i <= segs; i++) {
        const y = (i / segs) * H;
        const wave =
          Math.sin(i * 0.9 + t * 6) * amp +
          Math.sin(i * 1.7 - t * 4) * amp * 0.4;
        const x = rightX + wave;
        d += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
      }
      return d;
    };

    let start = performance.now();
    let prev = start;

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;

      // Faster easing toward target
      const target = progressRef.current;
      const prevDisplayed = displayedRef.current;
      displayedRef.current += (target - displayedRef.current) * 0.28;
      const p = Math.max(0, Math.min(100, displayedRef.current));
      const rightX = (p / 100) * W;
      const speed = (displayedRef.current - prevDisplayed) / Math.max(dt, 0.001); // %/s

      if (fillPathRef.current) fillPathRef.current.setAttribute("d", buildFill(rightX, t));
      if (crestPathRef.current) crestPathRef.current.setAttribute("d", buildCrest(rightX, t));

      // Emit splash particles at the crest
      if (p > 0.5 && p < 99.5 && now - lastEmitRef.current > 30) {
        lastEmitRef.current = now;
        const count = 2 + Math.min(6, Math.floor(speed * 0.5));
        for (let i = 0; i < count; i++) {
          const y = Math.random() * H;
          const wave =
            Math.sin((y / H) * segs * 0.9 + t * 6) * amp +
            Math.sin((y / H) * segs * 1.7 - t * 4) * amp * 0.4;
          particlesRef.current.push({
            x: rightX + wave,
            y,
            vx: 40 + Math.random() * 120 + speed * 2,
            vy: -60 + Math.random() * 40,
            r: 0.8 + Math.random() * 2.2,
            life: 0,
            maxLife: 0.5 + Math.random() * 0.6,
          });
        }
      }

      // Update particles (gravity physics)
      const gravity = 320;
      const alive: Particle[] = [];
      for (const pt of particlesRef.current) {
        pt.life += dt;
        if (pt.life >= pt.maxLife) continue;
        pt.vy += gravity * dt;
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        if (pt.y > H + 4 || pt.x > W + 10) continue;
        alive.push(pt);
      }
      particlesRef.current = alive;

      // Render particles
      const g = particlesGroupRef.current;
      if (g) {
        // Reuse children where possible
        while (g.childNodes.length > alive.length) g.removeChild(g.lastChild!);
        while (g.childNodes.length < alive.length) {
          const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          c.setAttribute("fill", "hsl(var(--primary))");
          g.appendChild(c);
        }
        alive.forEach((pt, i) => {
          const el = g.childNodes[i] as SVGCircleElement;
          const a = 1 - pt.life / pt.maxLife;
          el.setAttribute("cx", pt.x.toFixed(2));
          el.setAttribute("cy", pt.y.toFixed(2));
          el.setAttribute("r", pt.r.toFixed(2));
          el.setAttribute("opacity", (a * 0.9).toFixed(3));
        });
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
      <svg
        ref={svgRef}
        viewBox="0 0 600 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="waterFillH" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.55" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.95" />
          </linearGradient>
          <filter id="waterGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path ref={fillPathRef} fill="url(#waterFillH)" filter="url(#waterGlow)" />
        <path
          ref={crestPathRef}
          fill="none"
          stroke="hsla(0,0%,100%,0.7)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <g ref={particlesGroupRef} filter="url(#waterGlow)" />
      </svg>

      {/* Inner shadow */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_hsla(0,0%,100%,0.06),inset_0_-1px_0_hsla(0,0%,0%,0.4)]" />

      {/* Tick marks */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_calc(10%-1px),hsla(0,0%,0%,0.22)_calc(10%-1px),hsla(0,0%,0%,0.22)_10%)]" />
    </div>
  );
};

export default WaveProgress;
