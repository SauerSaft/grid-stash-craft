import { useState } from "react";
import { Landmark, ArrowDownToLine, ArrowUpFromLine, TrendingUp, TrendingDown, Clock, Wallet } from "lucide-react";

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
  { id: "7", type: "withdraw", amount: 5000, by: "Jonas Fischer", date: "27.02.2026, 10:12" },
  { id: "8", type: "deposit", amount: 40000, by: "Max Müller", date: "26.02.2026, 18:55" },
  { id: "9", type: "withdraw", amount: 20000, by: "Sophie Braun", date: "25.02.2026, 09:30" },
  { id: "10", type: "deposit", amount: 18000, by: "Leon Schmidt", date: "24.02.2026, 14:20" },
  { id: "11", type: "withdraw", amount: 3500, by: "Emma Hoffmann", date: "23.02.2026, 21:45" },
  { id: "12", type: "deposit", amount: 60000, by: "Max Müller", date: "22.02.2026, 12:10" },
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

  const stats = [
    { icon: TrendingUp, label: "Einnahmen (Monat)", value: "$117.000", colorClass: "ginshi_icon_success" },
    { icon: TrendingDown, label: "Ausgaben (Monat)", value: "$23.000", colorClass: "ginshi_icon_destructive" },
    { icon: Wallet, label: "Bargeld verfügbar", value: "$84.500", colorClass: "ginshi_icon_primary" },
  ];

  return (
    <div className="ginshi_section">
      {/* Page Header */}
      <div className="ginshi_section_header">
        <div className="ginshi_section_header_icon">
          <Landmark size={16} />
        </div>
        <div className="ginshi_section_header_content">
          <span className="ginshi_section_header_title">Fraktionskasse</span>
          <span className="ginshi_section_header_subtitle">Verwalte das Vermögen deiner Fraktion</span>
        </div>
      </div>

      <div className="ginshi_grid_tbody">
        {/* Balance Card */}
        <div className="treasury_balance_card">
          <div className="treasury_balance_bg" />
          <div className="treasury_balance_radial" />
          <div className="treasury_balance_corner_tl" />
          <div className="treasury_balance_corner_br" />

          {/* Decorative money icons */}
          <div className="treasury_balance_deco" style={{ bottom: "-0.5rem", right: "-0.5rem", transform: "rotate(-12deg)" }}>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.06 }}>
              <rect x="2" y="6" width="20" height="12" rx="2" stroke="hsl(48, 100%, 50%)" strokeWidth="0.8" />
              <circle cx="12" cy="12" r="3" stroke="hsl(48, 100%, 50%)" strokeWidth="0.8" />
              <path d="M2 9h2M20 9h2M2 15h2M20 15h2" stroke="hsl(48, 100%, 50%)" strokeWidth="0.8" />
            </svg>
          </div>
          <div className="treasury_balance_deco" style={{ bottom: "-1rem", right: "2.5rem", transform: "rotate(-20deg)" }}>
            <svg width="90" height="90" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.04 }}>
              <rect x="2" y="6" width="20" height="12" rx="2" stroke="hsl(48, 100%, 50%)" strokeWidth="0.8" />
              <circle cx="12" cy="12" r="3" stroke="hsl(48, 100%, 50%)" strokeWidth="0.8" />
            </svg>
          </div>
          <div className="treasury_balance_deco" style={{ bottom: "0.75rem", right: "6rem", transform: "rotate(5deg)" }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.05 }}>
              <circle cx="12" cy="12" r="8" stroke="hsl(48, 100%, 50%)" strokeWidth="0.8" />
              <path d="M12 8v8M9 10h6M9 14h6" stroke="hsl(48, 100%, 50%)" strokeWidth="0.8" />
            </svg>
          </div>

          <div className="treasury_balance_content">
            <span className="treasury_balance_label">Kontostand</span>
            <span className="treasury_balance_amount">{formatCurrency(balance)}</span>
            <div className="treasury_balance_line" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="treasury_stats_grid" style={{ marginTop: "0.75rem" }}>
          {stats.map((stat) => (
            <div key={stat.label} className="treasury_stat_box">
              <div className="treasury_stat_icon">
                <stat.icon className={stat.colorClass} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem", minWidth: 0 }}>
                <span className="treasury_stat_label">{stat.label}</span>
                <span className={`treasury_stat_value ${stat.colorClass}`}>{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Deposit / Withdraw Section */}
        <div className="treasury_actions_card" style={{ marginTop: "0.75rem" }}>
          <div className="ginshi_underline_tabs">
            <button
              onClick={() => setActiveTab("deposit")}
              className={`ginshi_underline_tab ${activeTab === "deposit" ? "ginshi_underline_tab_success" : ""}`}
            >
              <ArrowDownToLine />
              Einzahlen
            </button>
            <button
              onClick={() => setActiveTab("withdraw")}
              className={`ginshi_underline_tab ${activeTab === "withdraw" ? "ginshi_underline_tab_destructive" : ""}`}
            >
              <ArrowUpFromLine />
              Auszahlen
            </button>
          </div>

          <div className="treasury_actions_body">
            <div className="treasury_input_row">
              <div className="ginshi_input_wrapper">
                <span className="ginshi_input_prefix">$</span>
                <input
                  type="number"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  placeholder="Betrag eingeben..."
                  className="ginshi_input_field"
                />
              </div>
              <button
                onClick={handleAction}
                className={activeTab === "deposit" ? "ginshi_btn_success" : "ginshi_btn_destructive"}
              >
                {activeTab === "deposit" ? "Einzahlen" : "Auszahlen"}
              </button>
            </div>

            <div className="ginshi_chip_row">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setInputAmount(String(amt))}
                  className="ginshi_chip"
                >
                  {formatCurrency(amt)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="ginshi_list_card" style={{ marginTop: "0.75rem" }}>
          <div className="ginshi_list_header">
            <Clock />
            <span>Letzte Transaktionen</span>
          </div>
          <div className="ginshi_list_body">
            {mockTransactions.map((tx) => (
              <div key={tx.id} className="ginshi_list_row">
                <div className={`ginshi_list_icon ${tx.type === "deposit" ? "ginshi_list_icon_success" : "ginshi_list_icon_destructive"}`}>
                  {tx.type === "deposit"
                    ? <ArrowDownToLine className="ginshi_icon_success" />
                    : <ArrowUpFromLine className="ginshi_icon_destructive" />
                  }
                </div>
                <div className="ginshi_list_info">
                  <span className="ginshi_list_info_name">{tx.by}</span>
                  <span className="ginshi_list_info_sub">{tx.date}</span>
                </div>
                <span className={`ginshi_list_value ${tx.type === "deposit" ? "ginshi_icon_success" : "ginshi_icon_destructive"}`}>
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
