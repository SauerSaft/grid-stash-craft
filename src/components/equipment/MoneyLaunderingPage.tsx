import { useEffect, useRef, useState } from "react";
import { Banknote, ArrowRight, Loader2, ShieldCheck, AlertTriangle, CheckCircle2, Clock, Percent, Swords, ShieldQuestion } from "lucide-react";
import WaveProgress from "./WaveProgress";

type LaunderStatus = "idle" | "running" | "done";
type CaptureStatus = "idle" | "capturing";

const formatCurrency = (amount: number) =>
  `$${Math.max(0, Math.floor(amount)).toLocaleString("de-DE")}`;

/* ----------------------------------------------------------------
 * Reusable Tailwind class strings (kept short for readability).
 * They reproduce the previous ginshi_* / launder_* / treasury_* CSS
 * 1:1 — visual parity to the design system version.
 * ---------------------------------------------------------------- */

// Corner accents (replace ginshi_corner_tl / ginshi_corner_br)
const cornerTL =
  "pointer-events-none absolute left-0 top-0 " +
  "before:absolute before:left-0 before:top-0 before:h-px before:w-6 before:bg-[linear-gradient(to_right,hsl(var(--primary)/0.3),transparent)] before:content-['']" +
  " after:absolute after:left-0 after:top-0 after:h-5 after:w-px after:bg-[linear-gradient(to_bottom,hsl(var(--primary)/0.3),transparent)] after:content-['']";

const cornerBR =
  "pointer-events-none absolute bottom-0 right-0 " +
  "before:absolute before:bottom-0 before:right-0 before:h-px before:w-6 before:bg-[linear-gradient(to_left,hsl(var(--primary)/0.2),transparent)] before:content-['']" +
  " after:absolute after:bottom-0 after:right-0 after:h-5 after:w-px after:bg-[linear-gradient(to_top,hsl(var(--primary)/0.2),transparent)] after:content-['']";

const btnPrimary =
  "flex items-center gap-[0.4rem] rounded-[var(--radius)] border border-primary/35 bg-primary/15 px-[0.9rem] py-[0.45rem] text-[13px] font-bold uppercase tracking-[0.06em] text-primary transition-all hover:border-primary/50 hover:bg-primary/25 hover:shadow-[0_0_10px_hsl(var(--gold-glow)/0.2)] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:h-[13px] [&_svg]:w-[13px]";

const btnSuccess =
  "flex items-center gap-[0.4rem] rounded-[var(--radius)] border border-[hsl(var(--success)/0.35)] bg-[hsl(var(--success)/0.15)] px-[0.9rem] py-[0.45rem] text-[13px] font-bold uppercase tracking-[0.06em] text-[hsl(var(--success))] transition-all hover:border-[hsl(var(--success)/0.5)] hover:bg-[hsl(var(--success)/0.25)] hover:shadow-[0_0_10px_hsl(var(--success)/0.2)] [&_svg]:h-[13px] [&_svg]:w-[13px]";

const chipBase =
  "flex-1 cursor-pointer rounded-[var(--radius)] border border-[var(--glass-border)] bg-[var(--glass-subtle)] p-[0.45rem] text-[12px] font-bold tabular-nums text-muted-foreground transition-all hover:border-[var(--glass-border-strong)] hover:bg-[var(--glass-border)] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50";

type Ownership = "own" | "foreign" | "uncontrolled";

const MoneyLaunderingPage = () => {
  // Mock-Daten — später aus dem Spielzustand
  const dirtyMoney = 87500;
  const ownership = "uncontrolled" as Ownership;
  const ownedByOwnFaction = ownership === "own";
  const isUncontrolled = ownership === "uncontrolled";
  const controllingFaction = "Los Vagos";
  const baseFeePercent = 35;
  const factionDiscount = ownedByOwnFaction ? 18 : 0;
  const effectiveFeePercent = Math.max(5, baseFeePercent - factionDiscount);

  const [amount, setAmount] = useState<string>("5000");
  const [status, setStatus] = useState<LaunderStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Capture-Modus
  const captureTotalSeconds = 15 * 60;
  const [captureStatus, setCaptureStatus] = useState<CaptureStatus>("idle");
  const [captureProgress, setCaptureProgress] = useState(0);
  const [captureRemaining, setCaptureRemaining] = useState(0);
  const captureIntervalRef = useRef<number | null>(null);

  const numericAmount = Math.min(Math.max(0, Number(amount) || 0), dirtyMoney);
  const fee = Math.floor((numericAmount * effectiveFeePercent) / 100);
  const payout = numericAmount - fee;
  const totalSeconds = 30;

  const quickAmounts = [1000, 5000, 10000, 25000];

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (captureIntervalRef.current) window.clearInterval(captureIntervalRef.current);
    };
  }, []);

  const formatMMSS = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const startCapture = () => {
    if (captureStatus === "capturing" || ownedByOwnFaction) return;
    setCaptureStatus("capturing");
    setCaptureProgress(0);
    setCaptureRemaining(captureTotalSeconds);

    const startedAt = Date.now();
    const totalMs = captureTotalSeconds * 1000;

    captureIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const pct = Math.min(100, (elapsed / totalMs) * 100);
      setCaptureProgress(pct);
      setCaptureRemaining(Math.max(0, Math.ceil((totalMs - elapsed) / 1000)));
      if (pct >= 100) {
        if (captureIntervalRef.current) window.clearInterval(captureIntervalRef.current);
        setCaptureStatus("idle");
        setCaptureProgress(0);
      }
    }, 250);
  };

  const startLaundering = () => {
    if (numericAmount <= 0 || status === "running") return;
    setStatus("running");
    setProgress(0);
    setRemaining(totalSeconds);

    const startedAt = Date.now();
    const totalMs = totalSeconds * 1000;

    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const pct = Math.min(100, (elapsed / totalMs) * 100);
      setProgress(pct);
      setRemaining(Math.max(0, Math.ceil((totalMs - elapsed) / 1000)));
      if (pct >= 100) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        setStatus("done");
      }
    }, 100);
  };

  const reset = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setStatus("idle");
    setProgress(0);
    setRemaining(0);
  };

  // --- Owner-Banner Theming ---
  const ownerBannerBase =
    "relative flex items-center gap-[0.85rem] overflow-hidden rounded-[var(--radius)] border px-[1.1rem] py-[0.85rem]";
  const ownerBannerOwn =
    "border-[hsl(var(--success)/0.3)] bg-[linear-gradient(135deg,hsl(var(--success)/0.08),transparent_60%),var(--glass-bg)]";
  const ownerBannerForeign =
    "border-[hsl(var(--destructive)/0.25)] bg-[linear-gradient(135deg,hsl(var(--destructive)/0.06),transparent_60%),var(--glass-bg)]";
  const ownerBannerNeutral =
    "border-[var(--glass-border-strong)] bg-[linear-gradient(135deg,hsl(var(--primary)/0.05),transparent_60%),var(--glass-bg)]";

  const ownerIconBase =
    "flex h-[2.4rem] w-[2.4rem] flex-shrink-0 items-center justify-center rounded-[var(--radius)]";
  const ownerIconOwn = "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))]";
  const ownerIconForeign = "bg-[hsl(var(--destructive)/0.12)] text-[hsl(var(--destructive))]";
  const ownerIconNeutral = "bg-primary/10 text-primary";

  const ownerBannerClass = ownedByOwnFaction
    ? ownerBannerOwn
    : isUncontrolled
      ? ownerBannerNeutral
      : ownerBannerForeign;
  const ownerIconClass = ownedByOwnFaction
    ? ownerIconOwn
    : isUncontrolled
      ? ownerIconNeutral
      : ownerIconForeign;

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center gap-[0.85rem] rounded-[var(--radius)] border border-[var(--glass-border)] bg-[var(--glass-subtle)] px-[1.1rem] py-[0.85rem]">
        <div className="rounded-[var(--radius)] border border-primary/20 bg-primary/15 p-[0.45rem] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-primary [&_svg]:[filter:drop-shadow(0_0_6px_hsl(var(--gold-glow)/0.5))]">
          <Banknote size={16} />
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-[1.15rem] font-bold tracking-[-0.025em] text-foreground">Geldwäsche</span>
          <span className="text-[0.92rem] font-medium text-muted-foreground">
            Wasche Schwarzgeld in legales Bargeld – diskret und gegen Gebühr
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-[0.45rem] rounded-[var(--radius)] border border-[var(--glass-border)] bg-[var(--glass-subtle)] px-[0.95rem] py-[0.4rem]">
            <Banknote className="h-4 w-4 text-muted-foreground" />
            <span className="text-[16px] font-bold tabular-nums text-foreground">{formatCurrency(dirtyMoney)}</span>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Faction Ownership Banner */}
        <div className={`${ownerBannerBase} ${ownerBannerClass}`}>
          <div className={cornerTL} />
          <div className={cornerBR} />
          <div className={`${ownerIconBase} ${ownerIconClass}`}>
            {ownedByOwnFaction ? (
              <ShieldCheck size={20} />
            ) : isUncontrolled ? (
              <ShieldQuestion size={20} />
            ) : (
              <AlertTriangle size={20} />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-[0.15rem]">
            <span className="text-[14px] font-bold uppercase tracking-[0.04em] text-foreground">
              {ownedByOwnFaction
                ? "Diese Wäscherei gehört deiner Fraktion"
                : isUncontrolled
                  ? "Unkontrolliert"
                  : `Kontrolliert von: ${controllingFaction}`}
            </span>
            <span className="text-[12px] font-medium text-muted-foreground">
              {ownedByOwnFaction
                ? `Du erhältst einen Rabatt von ${factionDiscount}% auf die Waschgebühr.`
                : captureStatus === "capturing"
                  ? `Übernahme läuft – noch ${formatMMSS(captureRemaining)} verbleibend.`
                  : isUncontrolled
                    ? "Nehme die Wäscherei mit deiner Fraktion ein, um Rabatte zu erhalten."
                    : "Übernehmt die Wäscherei als Fraktion, um Rabatte zu erhalten."}
            </span>
            {!ownedByOwnFaction && captureStatus === "capturing" && (
              <div
                role="progressbar"
                aria-valuenow={Math.round(captureProgress)}
                className="relative mt-2 h-[4px] w-full overflow-hidden rounded-full bg-[hsl(var(--border)/0.5)]"
              >
                <div
                  style={{ width: `${captureProgress}%` }}
                  className="h-full rounded-full bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--primary)/0.6))] transition-[width] duration-[250ms] ease-linear"
                />
              </div>
            )}
          </div>
          <div className="ml-1 flex min-w-[7rem] flex-col items-end justify-center gap-[0.2rem] border-l border-[hsl(var(--border)/0.6)] pl-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground opacity-85">
              Waschgebühr
            </span>
            <div className="inline-flex items-baseline gap-[0.15rem] text-[22px] font-extrabold leading-none tabular-nums tracking-[0.01em] text-primary">
              <Percent size={12} className="self-center opacity-70" />
              <span>{effectiveFeePercent}</span>
            </div>
            {factionDiscount > 0 && (
              <span className="mt-[0.15rem] rounded-[calc(var(--radius)-4px)] border border-[hsl(var(--success)/0.25)] bg-[hsl(var(--success)/0.1)] px-[0.4rem] py-[0.15rem] text-[10px] font-bold uppercase tracking-[0.06em] text-[hsl(var(--success))]">
                −{factionDiscount}% Rabatt
              </span>
            )}
            {!ownedByOwnFaction && (
              <button
                onClick={startCapture}
                disabled={captureStatus === "capturing"}
                className={`mt-[0.4rem] inline-flex cursor-pointer items-center gap-[0.35rem] rounded-[calc(var(--radius)-4px)] border px-[0.6rem] py-[0.3rem] text-[10.5px] font-bold uppercase tracking-[0.08em] transition-colors disabled:cursor-not-allowed ${
                  captureStatus === "capturing"
                    ? "border-primary/35 bg-primary/[0.08] text-primary"
                    : isUncontrolled
                      ? "border-primary/35 bg-primary/[0.08] text-primary hover:border-primary/55 hover:bg-primary/[0.16]"
                      : "border-destructive/30 bg-destructive/[0.08] text-destructive hover:border-destructive/50 hover:bg-destructive/[0.16]"
                }`}
              >
                {captureStatus === "capturing" ? <Loader2 size={12} className="animate-spin" /> : <Swords size={12} />}
                <span>{captureStatus === "capturing" ? "Wird eingenommen" : "Einnehmen"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Calculator Card */}
        <div className="mt-3 overflow-hidden rounded-[var(--radius)] border border-[var(--glass-border)] bg-[var(--glass-bg)]">
          <div className="flex items-center gap-[0.55rem] border-b border-[var(--glass-border)] px-[0.85rem] py-[0.7rem] [&_span]:text-[12px] [&_span]:font-bold [&_span]:uppercase [&_span]:tracking-[0.15em] [&_span]:text-muted-foreground [&_svg]:h-[13px] [&_svg]:w-[13px] [&_svg]:text-muted-foreground">
            <Banknote />
            <span>Waschvorgang konfigurieren</span>
          </div>

          <div className="flex flex-col gap-[0.7rem] p-[0.85rem]">
            {/* Input + Button */}
            <div className="flex items-center gap-[0.55rem]">
              <div className="flex flex-1 items-center overflow-hidden rounded-[var(--radius)] border border-[var(--glass-border-strong)] bg-[var(--glass-input-bg)] transition-colors focus-within:border-primary/30">
                <span className="pl-[0.85rem] pr-1 text-[14px] font-bold text-primary/60">$</span>
                <input
                  type="number"
                  value={amount}
                  disabled={status === "running"}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Betrag eingeben..."
                  className="flex-1 appearance-none border-none bg-transparent py-[0.55rem] pl-0 pr-[0.85rem] text-[15px] font-semibold tabular-nums text-foreground outline-none placeholder:text-muted-foreground/50 [appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
              <button
                onClick={startLaundering}
                disabled={status === "running" || numericAmount <= 0}
                className={btnPrimary}
              >
                {status === "running" ? <Loader2 className="animate-spin" /> : <Banknote />}
                {status === "running" ? "Läuft..." : "Waschen"}
              </button>
            </div>

            {/* Quick chips */}
            <div className="flex gap-[0.4rem]">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  disabled={status === "running"}
                  onClick={() => setAmount(String(Math.min(amt, dirtyMoney)))}
                  className={chipBase}
                >
                  {formatCurrency(amt)}
                </button>
              ))}
              <button
                disabled={status === "running"}
                onClick={() => setAmount(String(dirtyMoney))}
                className={chipBase}
              >
                MAX
              </button>
            </div>

            {/* Calculation breakdown */}
            <div className="mt-1 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-[0.55rem]">
              <div className="flex flex-col gap-1 rounded-[var(--radius)] border border-[var(--glass-border)] bg-[var(--glass-bg)] px-[0.85rem] py-[0.7rem]">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Eingesetzt</span>
                <span className="text-[16px] font-extrabold tabular-nums tracking-[-0.01em] text-foreground">
                  {formatCurrency(numericAmount)}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/40" />
              <div className="flex flex-col gap-1 rounded-[var(--radius)] border border-destructive/[0.18] bg-destructive/[0.06] px-[0.85rem] py-[0.7rem]">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Gebühr ({effectiveFeePercent}%)
                </span>
                <span className="text-[16px] font-extrabold tabular-nums tracking-[-0.01em] text-destructive">
                  −{formatCurrency(fee)}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/40" />
              <div className="flex flex-col gap-1 rounded-[var(--radius)] border border-[hsl(var(--success)/0.25)] bg-[hsl(var(--success)/0.08)] px-[0.85rem] py-[0.7rem]">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Auszahlung</span>
                <span className="text-[16px] font-extrabold tabular-nums tracking-[-0.01em] text-[hsl(var(--success))] [text-shadow:0_0_10px_hsl(var(--success)/0.35)]">
                  {formatCurrency(payout)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress / Status Card */}
        <div className="relative mt-3 overflow-hidden rounded-[var(--radius)] border border-[var(--glass-border)] bg-[linear-gradient(135deg,hsl(var(--primary)/0.04),transparent_50%),var(--glass-bg)] px-[1.1rem] py-4">
          <div className={cornerTL} />
          <div className={cornerBR} />

          {status === "idle" && (
            <div className="relative z-[1] flex items-center gap-[0.85rem]">
              <div className="flex h-[2.6rem] w-[2.6rem] flex-shrink-0 items-center justify-center rounded-[var(--radius)] border border-[var(--glass-border)] bg-[var(--glass-bg-hover)] text-muted-foreground">
                <Clock size={22} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-[0.15rem]">
                <span className="text-[14px] font-bold uppercase tracking-[0.06em] text-foreground">Bereit zum Waschen</span>
                <span className="text-[12px] font-medium tabular-nums text-muted-foreground">
                  Geschätzte Dauer für aktuellen Betrag: ~{totalSeconds}s
                </span>
              </div>
            </div>
          )}

          {status === "running" && (
            <div className="relative z-[1] flex flex-col items-stretch gap-[0.7rem]">
              <div className="flex items-center gap-[0.85rem]">
                <div className="flex h-[2.6rem] w-[2.6rem] flex-shrink-0 items-center justify-center rounded-[var(--radius)] border border-primary/35 bg-primary/15 text-primary shadow-[0_0_12px_hsl(var(--gold-glow)/0.25)]">
                  <Loader2 size={20} className="animate-spin" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-[0.15rem]">
                  <span className="text-[14px] font-bold uppercase tracking-[0.06em] text-foreground">Wäsche läuft...</span>
                  <span className="text-[12px] font-medium tabular-nums text-muted-foreground">
                    Verbleibend: {remaining}s · {Math.round(progress)}%
                  </span>
                </div>
                <div className="text-[18px] font-extrabold tabular-nums tracking-[-0.02em] text-primary [text-shadow:0_0_10px_hsl(var(--gold-glow)/0.3)]">
                  {formatCurrency(payout)}
                </div>
              </div>

              <div className="relative h-[14px] w-full overflow-hidden rounded-[var(--radius)] border border-[var(--glass-border-strong)] bg-[var(--glass-input-bg)]">
                <div
                  style={{ width: `${progress}%` }}
                  className="relative h-full overflow-hidden bg-[linear-gradient(90deg,hsl(var(--primary)/0.6),hsl(var(--primary)),hsl(var(--primary)/0.85))] shadow-[0_0_12px_hsl(var(--gold-glow)/0.5)] transition-[width] duration-100 ease-linear"
                >
                  <div className="absolute inset-0 animate-launder-shine bg-[linear-gradient(90deg,transparent_0%,hsla(0,0%,100%,0.25)_50%,transparent_100%)] bg-[length:30%_100%] bg-no-repeat" />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_calc(10%-1px),hsla(0,0%,0%,0.25)_calc(10%-1px),hsla(0,0%,0%,0.25)_10%)]" />
              </div>
            </div>
          )}

          {status === "done" && (
            <div className="relative z-[1] flex items-center gap-[0.85rem]">
              <div className="flex h-[2.6rem] w-[2.6rem] flex-shrink-0 items-center justify-center rounded-[var(--radius)] border border-[hsl(var(--success)/0.35)] bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))] shadow-[0_0_12px_hsl(var(--success)/0.3)]">
                <CheckCircle2 size={22} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-[0.15rem]">
                <span className="text-[14px] font-bold uppercase tracking-[0.06em] text-[hsl(var(--success))]">
                  Wäsche abgeschlossen
                </span>
                <span className="text-[12px] font-medium tabular-nums text-muted-foreground">
                  {formatCurrency(payout)} wurden in legales Bargeld umgewandelt.
                </span>
              </div>
              <button onClick={reset} className={btnSuccess}>
                <CheckCircle2 />
                Erneut waschen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoneyLaunderingPage;
