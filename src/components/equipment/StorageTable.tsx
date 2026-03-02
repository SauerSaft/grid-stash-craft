import { useState } from "react";
import { Package, ArrowDownToLine, ArrowUpFromLine, Minus, Plus } from "lucide-react";

interface StorageItem {
  id: string;
  name: string;
  stock: number;
  icon?: string;
}

const mockItems: StorageItem[] = [
  { id: "1", name: "Brot", stock: 50 },
  { id: "2", name: "Wasser", stock: 100 },
  { id: "3", name: "Verbandsmaterial", stock: 25 },
  { id: "4", name: "Munition", stock: 500 },
  { id: "5", name: "Erste-Hilfe-Kasten", stock: 12 },
  { id: "6", name: "Schutzweste", stock: 8 },
  { id: "7", name: "Funkgerät", stock: 30 },
  { id: "8", name: "Taschenlampe", stock: 45 },
];

type TabMode = "auslagern" | "einlagern";

const StorageTable = () => {
  const [activeTab, setActiveTab] = useState<TabMode>("auslagern");
  const [amounts, setAmounts] = useState<Record<string, number>>({});

  const getAmount = (id: string) => amounts[id] || 1;

  const setAmount = (id: string, val: number, max: number) => {
    setAmounts((prev) => ({ ...prev, [id]: Math.max(1, Math.min(val, max)) }));
  };

  const increment = (id: string, max: number) => {
    setAmount(id, getAmount(id) + 1, max);
  };

  const decrement = (id: string, max: number) => {
    setAmount(id, getAmount(id) - 1, max);
  };

  return (
    <div className="flex flex-col flex-1 gap-3 overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-card/60 rounded-sm border border-border/50">
        <div className="p-1.5 rounded-sm bg-primary/15 border border-primary/25">
          <Package size={14} className="text-primary" style={{ filter: "drop-shadow(0 0 6px rgba(255,217,0,0.5))" }} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-foreground">Fraklager</span>
          <span className="text-xs font-medium text-muted-foreground">Lagere hier Items der Fraktion ein und aus.</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5">
        <button
          onClick={() => setActiveTab("auslagern")}
          className={`
            flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all
            ${activeTab === "auslagern"
              ? "bg-primary/20 border border-primary/50 text-primary shadow-[0_0_10px_rgba(255,217,0,0.15)]"
              : "bg-secondary border border-border text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            }
          `}
        >
          <ArrowUpFromLine size={12} />
          Auslagern
        </button>
        <button
          onClick={() => setActiveTab("einlagern")}
          className={`
            flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all
            ${activeTab === "einlagern"
              ? "bg-primary/20 border border-primary/50 text-primary shadow-[0_0_10px_rgba(255,217,0,0.15)]"
              : "bg-secondary border border-border text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            }
          `}
        >
          <ArrowDownToLine size={12} />
          Einlagern
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto rounded-sm border border-border/50 bg-card/30">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_100px_140px_110px] px-4 py-2.5 border-b border-border/80 bg-background/80 sticky top-0 z-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Name</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground text-center">Bestand</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground text-center">Menge</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground text-right">Aktion</span>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col">
          {mockItems.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_100px_140px_110px] items-center px-4 py-2.5 border-b border-border/30 hover:bg-surface-hover transition-colors group"
            >
              {/* Name */}
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_6px_rgba(255,217,0,0.5)] transition-all" />
                <span className="text-sm font-semibold text-foreground tracking-tight">{item.name}</span>
              </div>

              {/* Stock Badge */}
              <div className="flex justify-center">
                <span className={`
                  inline-flex items-center justify-center min-w-[40px] px-2.5 py-0.5 rounded-sm text-xs font-bold tabular-nums
                  ${item.stock > 50
                    ? "bg-success/10 text-success border border-success/20"
                    : item.stock > 15
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-destructive/10 text-destructive border border-destructive/20"
                  }
                `}>
                  {item.stock}
                </span>
              </div>

              {/* Amount Stepper */}
              <div className="flex justify-center">
                <div className="flex items-center gap-0 rounded-sm border border-border/60 overflow-hidden bg-background/60">
                  <button
                    onClick={() => decrement(item.id, item.stock)}
                    className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors border-r border-border/40"
                  >
                    <Minus size={11} />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={item.stock}
                    value={getAmount(item.id)}
                    onChange={(e) => setAmount(item.id, parseInt(e.target.value) || 1, item.stock)}
                    className="w-12 h-7 text-center text-xs font-bold text-foreground bg-transparent outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => increment(item.id, item.stock)}
                    className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors border-l border-border/40"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                {activeTab === "auslagern" ? (
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wider bg-primary/15 border border-primary/35 text-primary hover:bg-primary/25 hover:border-primary/50 hover:shadow-[0_0_10px_rgba(255,217,0,0.2)] transition-all">
                    <ArrowUpFromLine size={10} />
                    Auslagern
                  </button>
                ) : (
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wider bg-success/15 border border-success/35 text-success hover:bg-success/25 hover:border-success/50 hover:shadow-[0_0_10px_rgba(76,217,100,0.2)] transition-all">
                    <ArrowDownToLine size={10} />
                    Einlagern
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorageTable;
