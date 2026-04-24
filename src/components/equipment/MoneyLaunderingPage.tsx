import { useEffect, useRef, useState } from "react";
import { Banknote, ArrowRight, Loader2, ShieldCheck, AlertTriangle, CheckCircle2, Clock, Percent, Swords } from "lucide-react";

type LaunderStatus = "idle" | "running" | "done";
type CaptureStatus = "idle" | "capturing";

const formatCurrency = (amount: number) =>
  `$${Math.max(0, Math.floor(amount)).toLocaleString("de-DE")}`;

const MoneyLaunderingPage = () => {
  // Mock-Daten — später aus dem Spielzustand
  const dirtyMoney = 87500;
  const ownedByOwnFaction = true; // true = eigene Fraktion kontrolliert den Händler
  const controllingFaction = "Los Vagos";
  const baseFeePercent = 35;
  const factionDiscount = ownedByOwnFaction ? 18 : 0;
  const effectiveFeePercent = Math.max(5, baseFeePercent - factionDiscount);

  // Dauer pro $1.000 (in Sekunden) – Demo
  const secondsPer1k = 0.4;

  const [amount, setAmount] = useState<string>("5000");
  const [status, setStatus] = useState<LaunderStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const numericAmount = Math.min(Math.max(0, Number(amount) || 0), dirtyMoney);
  const fee = Math.floor((numericAmount * effectiveFeePercent) / 100);
  const payout = numericAmount - fee;
  const totalSeconds = 30;

  const quickAmounts = [1000, 5000, 10000, 25000];

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

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

  return (
    <div className="ginshi_section">
      {/* Page Header */}
      <div className="ginshi_section_header">
        <div className="ginshi_section_header_icon">
          <Banknote size={16} />
        </div>
        <div className="ginshi_section_header_content">
          <span className="ginshi_section_header_title">Geldwäsche</span>
          <span className="ginshi_section_header_subtitle">
            Wasche Schwarzgeld in legales Bargeld – diskret und gegen Gebühr
          </span>
        </div>
        <div className="ginshi_section_header_badges">
          <div className="ginshi_badge">
            <Banknote className="ginshi_badge_icon" />
            <span className="ginshi_badge_value">{formatCurrency(dirtyMoney)}</span>
          </div>
        </div>
      </div>

      <div className="ginshi_grid_tbody">
        {/* Faction Ownership Banner */}
        <div className={`launder_owner_banner ${ownedByOwnFaction ? "launder_owner_banner_own" : "launder_owner_banner_foreign"}`}>
          <div className="ginshi_corner_tl" />
          <div className="ginshi_corner_br" />
          <div className="launder_owner_icon">
            {ownedByOwnFaction ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
          </div>
          <div className="launder_owner_text">
            <span className="launder_owner_title">
              {ownedByOwnFaction ? "Diese Wäscherei gehört deiner Fraktion" : `Kontrolliert von: ${controllingFaction}`}
            </span>
            <span className="launder_owner_sub">
              {ownedByOwnFaction
                ? `Du erhältst einen Rabatt von ${factionDiscount}% auf die Waschgebühr.`
                : "Übernehmt die Wäscherei als Fraktion, um Rabatte zu erhalten."}
            </span>
          </div>
          <div className="launder_owner_pct">
            <span className="launder_owner_pct_label">Waschgebühr</span>
            <div className="launder_owner_pct_value">
              <Percent size={12} />
              <span>{effectiveFeePercent}</span>
            </div>
            {factionDiscount > 0 && (
              <span className="launder_owner_pct_hint">−{factionDiscount}% Rabatt</span>
            )}
          </div>
        </div>

        {/* Calculator Card */}
        <div className="treasury_actions_card" style={{ marginTop: "0.75rem" }}>
          <div className="ginshi_list_header">
            <Banknote />
            <span>Waschvorgang konfigurieren</span>
          </div>

          <div className="treasury_actions_body">
            {/* Input + Button */}
            <div className="treasury_input_row">
              <div className="ginshi_input_wrapper">
                <span className="ginshi_input_prefix">$</span>
                <input
                  type="number"
                  value={amount}
                  disabled={status === "running"}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Betrag eingeben..."
                  className="ginshi_input_field"
                />
              </div>
              <button
                onClick={startLaundering}
                disabled={status === "running" || numericAmount <= 0}
                className="ginshi_btn_primary"
              >
                {status === "running" ? <Loader2 className="launder_spin" /> : <Banknote />}
                {status === "running" ? "Läuft..." : "Waschen"}
              </button>
            </div>

            {/* Quick chips */}
            <div className="ginshi_chip_row">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  disabled={status === "running"}
                  onClick={() => setAmount(String(Math.min(amt, dirtyMoney)))}
                  className="ginshi_chip"
                >
                  {formatCurrency(amt)}
                </button>
              ))}
              <button
                disabled={status === "running"}
                onClick={() => setAmount(String(dirtyMoney))}
                className="ginshi_chip"
              >
                MAX
              </button>
            </div>

            {/* Calculation breakdown */}
            <div className="launder_breakdown">
              <div className="launder_break_box">
                <span className="launder_break_label">Eingesetzt</span>
                <span className="launder_break_value">{formatCurrency(numericAmount)}</span>
              </div>
              <ArrowRight className="launder_break_arrow" />
              <div className="launder_break_box launder_break_box_fee">
                <span className="launder_break_label">Gebühr ({effectiveFeePercent}%)</span>
                <span className="launder_break_value launder_break_value_fee">−{formatCurrency(fee)}</span>
              </div>
              <ArrowRight className="launder_break_arrow" />
              <div className="launder_break_box launder_break_box_payout">
                <span className="launder_break_label">Auszahlung</span>
                <span className="launder_break_value launder_break_value_payout">{formatCurrency(payout)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress / Status Card */}
        <div className="launder_progress_card" style={{ marginTop: "0.75rem" }}>
          <div className="ginshi_corner_tl" />
          <div className="ginshi_corner_br" />

          {status === "idle" && (
            <div className="launder_state launder_state_idle">
              <div className="launder_state_icon">
                <Clock size={22} />
              </div>
              <div className="launder_state_text">
                <span className="launder_state_title">Bereit zum Waschen</span>
                <span className="launder_state_sub">
                  Geschätzte Dauer für aktuellen Betrag: ~{totalSeconds}s
                </span>
              </div>
            </div>
          )}

          {status === "running" && (
            <div className="launder_state launder_state_running">
              <div className="launder_state_head">
                <div className="launder_state_icon launder_state_icon_active">
                  <Loader2 size={20} className="launder_spin" />
                </div>
                <div className="launder_state_text">
                  <span className="launder_state_title">Wäsche läuft...</span>
                  <span className="launder_state_sub">
                    Verbleibend: {remaining}s · {Math.round(progress)}%
                  </span>
                </div>
                <div className="launder_state_amount">{formatCurrency(payout)}</div>
              </div>

              <div className="launder_progress_track">
                <div className="launder_progress_fill" style={{ width: `${progress}%` }}>
                  <div className="launder_progress_shine" />
                </div>
                <div className="launder_progress_ticks" />
              </div>
            </div>
          )}

          {status === "done" && (
            <div className="launder_state launder_state_done">
              <div className="launder_state_icon launder_state_icon_success">
                <CheckCircle2 size={22} />
              </div>
              <div className="launder_state_text">
                <span className="launder_state_title launder_state_title_success">
                  Wäsche abgeschlossen
                </span>
                <span className="launder_state_sub">
                  {formatCurrency(payout)} wurden in legales Bargeld umgewandelt.
                </span>
              </div>
              <button onClick={reset} className="ginshi_btn_success">
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
