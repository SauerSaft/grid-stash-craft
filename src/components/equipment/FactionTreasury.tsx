import { useState } from "react";
import { Landmark, ArrowDownToLine, ArrowUpFromLine, TrendingUp, TrendingDown, Clock, Users } from "lucide-react";
import coinsImg from "@/assets/coins_bills.png";

const formatCurrency = (amount: number) =>
  `$${amount.toLocaleString("de-DE")}`;

interface Transaction {
  id: string;
  type: "deposit" | "withdraw";
  amount: number;
  by: string;
  date: string;
}

const mockTransactions: Transaction[] = [
  { id: "1", type: "deposit", amount: 25000, by: "Max Müller", date: "05.03.2026, 14:32" },
  { id: "2", type: "withdraw", amount: 8000, by: "Leon Schmidt", date: "04.03.2026, 19:15" },
  { id: "3", type: "deposit", amount: 50000, by: "Max Müller", date: "03.03.2026, 11:48" },
  { id: "4", type: "withdraw", amount: 15000, by: "Anna Weber", date: "02.03.2026, 08:22" },
  { id: "5", type: "deposit", amount: 30000, by: "Leon Schmidt", date: "01.03.2026, 22:05" },
  { id: "6", type: "deposit", amount: 12000, by: "Anna Weber", date: "28.02.2026, 16:40" },
];

const FactionTreasury = () => {
  const [balance] = useState(247312);
  const [inputAmount, setInputAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");

  const handleAction = () => {
    if (!inputAmount || Number(inputAmount) <= 0) return;
    setInputAmount("");
  };

  const quickAmounts = [1000, 5000, 10000, 50000];

  return (
    <div className="ginshi_treasury_container flex flex-col flex-1 gap-3 overflow-hidden">
      {/* Page Header */}
      <div className="ginshi_treasury_header flex items-center gap-3 px-4 py-3 bg-white/[0.03] rounded-sm border border-white/[0.06]">
        <div className="p-1.5 rounded-sm bg-primary/15 border border-primary/20">
          <Landmark size={14} className="text-primary" style={{ filter: "drop-shadow(0 0 6px hsl(48 100% 50% / 0.5))" }} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-foreground">Fraktionskasse</span>
          <span className="text-xs font-medium text-muted-foreground">Verwalte das Vermögen deiner Fraktion</span>
        </div>
      </div>

      <div className="ginshi_treasury_content flex-1 overflow-y-auto flex flex-col gap-3">
        {/* Balance Card */}
        <div className="ginshi_treasury_balance relative rounded-sm border border-primary/[0.15] overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-black/60 to-black/80 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(48_100%_50%/0.06)_0%,transparent_60%)] pointer-events-none" />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-[1px] bg-gradient-to-r from-primary/40 to-transparent" />
          <div className="absolute top-0 left-0 w-[1px] h-6 bg-gradient-to-b from-primary/40 to-transparent" />
          <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-gradient-to-l from-primary/20 to-transparent" />
          <div className="absolute bottom-0 right-0 w-[1px] h-6 bg-gradient-to-t from-primary/20 to-transparent" />

          {/* Decorative coins image */}
          <img
            src={coinsImg}
            alt=""
            className="absolute bottom-0 right-0 w-[140px] h-[140px] object-contain opacity-[0.12] pointer-events-none select-none"
            draggable={false}
          />

          <div className="relative z-10 p-5 flex flex-col gap-1">
            <span className="ginshi_treasury_label text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Kontostand
            </span>
            <span className="ginshi_treasury_amount text-3xl font-extrabold text-primary tabular-nums tracking-tight" style={{ textShadow: "0 0 20px hsl(48 100% 50% / 0.3)" }}>
              {formatCurrency(balance)}
            </span>
            <div className="w-16 h-[2px] rounded-full bg-gradient-to-r from-primary/50 to-transparent mt-1" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="ginshi_treasury_stats grid grid-cols-3 gap-2">
          {[
            { icon: TrendingUp, label: "Einnahmen (Monat)", value: "$117.000", color: "text-success" },
            { icon: TrendingDown, label: "Ausgaben (Monat)", value: "$23.000", color: "text-destructive" },
            { icon: Users, label: "Mitglieder", value: "12", color: "text-info" },
          ].map((stat) => (
            <div key={stat.label} className="ginshi_stat_box flex items-center gap-2.5 p-3 rounded-sm bg-white/[0.02] border border-white/[0.06]">
              <div className="p-1.5 rounded-sm bg-white/[0.04]">
                <stat.icon size={13} className={stat.color} />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground truncate">{stat.label}</span>
                <span className={`text-sm font-extrabold tabular-nums ${stat.color}`}>{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Deposit / Withdraw Section */}
        <div className="ginshi_treasury_actions rounded-sm border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          {/* Tabs */}
          <div className="ginshi_treasury_tabs flex border-b border-white/[0.06]">
            <button
              onClick={() => setActiveTab("deposit")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                activeTab === "deposit"
                  ? "bg-success/[0.08] text-success border-b-2 border-success/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.02]"
              }`}
            >
              <ArrowDownToLine size={11} />
              Einzahlen
            </button>
            <button
              onClick={() => setActiveTab("withdraw")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                activeTab === "withdraw"
                  ? "bg-destructive/[0.08] text-destructive border-b-2 border-destructive/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.02]"
              }`}
            >
              <ArrowUpFromLine size={11} />
              Auszahlen
            </button>
          </div>

          <div className="p-3 flex flex-col gap-2.5">
            {/* Input */}
            <div className="ginshi_treasury_input flex items-center gap-2">
              <div className="flex-1 flex items-center bg-black/40 border border-white/[0.08] rounded-sm overflow-hidden focus-within:border-primary/30 transition-colors">
                <span className="pl-3 pr-1 text-xs font-bold text-primary/60">$</span>
                <input
                  type="number"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  placeholder="Betrag eingeben..."
                  className="flex-1 bg-transparent py-2 pr-3 text-sm font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none tabular-nums [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
              <button
                onClick={handleAction}
                className={`ginshi_btn_action px-4 py-2 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  activeTab === "deposit"
                    ? "bg-success/15 border border-success/30 text-success hover:bg-success/25 hover:border-success/50"
                    : "bg-destructive/15 border border-destructive/30 text-destructive hover:bg-destructive/25 hover:border-destructive/50"
                }`}
              >
                {activeTab === "deposit" ? "Einzahlen" : "Auszahlen"}
              </button>
            </div>

            {/* Quick amounts */}
            <div className="ginshi_quick_amounts flex gap-1.5">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setInputAmount(String(amt))}
                  className="flex-1 py-1.5 rounded-sm text-[10px] font-bold tabular-nums text-muted-foreground bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] hover:text-foreground transition-colors"
                >
                  {formatCurrency(amt)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="ginshi_treasury_history rounded-sm border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.06]">
            <Clock size={11} className="text-muted-foreground" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Letzte Transaktionen</span>
          </div>
          <div className="ginshi_transaction_list flex flex-col max-h-[160px] overflow-y-auto">
            {mockTransactions.map((tx) => (
              <div key={tx.id} className="ginshi_transaction_row flex items-center gap-3 px-3 py-2 border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors">
                <div className={`w-6 h-6 rounded-sm flex items-center justify-center flex-shrink-0 ${
                  tx.type === "deposit" ? "bg-success/10" : "bg-destructive/10"
                }`}>
                  {tx.type === "deposit"
                    ? <ArrowDownToLine size={10} className="text-success" />
                    : <ArrowUpFromLine size={10} className="text-destructive" />
                  }
                </div>
                <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                  <span className="text-[11px] font-semibold text-foreground truncate">{tx.by}</span>
                  <span className="text-[10px] text-muted-foreground">{tx.date}</span>
                </div>
                <span className={`text-xs font-extrabold tabular-nums ${
                  tx.type === "deposit" ? "text-success" : "text-destructive"
                }`}>
                  {tx.type === "deposit" ? "+" : "-"}{formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactionTreasury;
