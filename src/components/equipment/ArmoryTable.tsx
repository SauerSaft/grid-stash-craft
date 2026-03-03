import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Shield } from "lucide-react";

import weaponCarbine from "@/assets/weapons/WEAPON_CARBINERIFLE.webp";
import weaponPistol from "@/assets/weapons/WEAPON_PISTOL.webp";

interface WeaponItem {
  id: string;
  name: string;
  stock: number;
  image: string;
  category: string;
}

const mockWeapons: WeaponItem[] = [
  { id: "1", name: "Karabiner", stock: 3, image: weaponCarbine, category: "Gewehr" },
  { id: "2", name: "Pistole", stock: 15, image: weaponPistol, category: "Handfeuerwaffe" },
  { id: "3", name: "Karabiner", stock: 8, image: weaponCarbine, category: "Gewehr" },
  { id: "4", name: "Pistole", stock: 42, image: weaponPistol, category: "Handfeuerwaffe" },
  { id: "5", name: "Karabiner", stock: 1, image: weaponCarbine, category: "Gewehr" },
];

type TabMode = "auslagern" | "einlagern";

const ArmoryTable = () => {
  const [activeTab, setActiveTab] = useState<TabMode>("auslagern");

  return (
    <div className="flex flex-col flex-1 gap-3 overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] rounded-sm border border-white/[0.06]">
        <div className="p-1.5 rounded-sm bg-primary/15 border border-primary/20">
          <Shield size={14} className="text-primary" style={{ filter: "drop-shadow(0 0 6px hsl(48 100% 50% / 0.5))" }} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-foreground">Waffenkammer</span>
          <span className="text-xs font-medium text-muted-foreground">Lagere hier dienstliche und beschlagnahmte Waffen ein und aus.</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5">
        <button
          onClick={() => setActiveTab("auslagern")}
          className={`
            flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all
            ${activeTab === "auslagern"
              ? "bg-primary/20 border border-primary/50 text-primary shadow-[0_0_10px_hsl(48_100%_50%_/_0.15)]"
              : "bg-white/[0.03] border border-white/[0.06] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
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
              ? "bg-primary/20 border border-primary/50 text-primary shadow-[0_0_10px_hsl(48_100%_50%_/_0.15)]"
              : "bg-white/[0.03] border border-white/[0.06] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
            }
          `}
        >
          <ArrowDownToLine size={12} />
          Einlagern
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto rounded-sm border border-white/[0.06] bg-white/[0.02]">
        {/* Table Header */}
        <div className="grid grid-cols-[120px_1fr_100px_110px] px-4 py-2.5 border-b border-white/[0.08] bg-black/50 sticky top-0 z-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Waffe</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Name</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground text-center">Bestand</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground text-right">Aktion</span>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col">
          {mockWeapons.map((weapon) => (
            <div
              key={weapon.id}
              className="grid grid-cols-[120px_1fr_100px_110px] items-center px-4 py-2 border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors group"
            >
              {/* Tactical Showcase Cell */}
              <div className="flex items-center">
                <div
                  className="
                    relative w-[100px] h-[44px] rounded-sm overflow-hidden
                    border border-primary/10 group-hover:border-primary/25
                    bg-black/60
                    transition-all
                  "
                  style={{
                    background: "linear-gradient(135deg, rgba(255,217,0,0.06) 0%, rgba(255,217,0,0.01) 35%, transparent 60%), rgba(0,0,0,0.6)",
                  }}
                >
                  {/* Corner accent line */}
                  <div className="absolute top-0 left-0 w-5 h-[1px] bg-gradient-to-r from-primary/40 to-transparent" />
                  <div className="absolute top-0 left-0 w-[1px] h-3 bg-gradient-to-b from-primary/40 to-transparent" />

                  {/* Weapon image */}
                  <img
                    src={weapon.image}
                    alt={weapon.name}
                    className="
                      absolute inset-0 w-full h-full object-contain p-1.5
                      filter brightness-90 contrast-110
                      group-hover:scale-[1.03] transition-transform
                    "
                    draggable={false}
                  />

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary/20 via-primary/8 to-transparent" />
                </div>
              </div>

              {/* Name */}
              <div className="flex items-center gap-2.5 pl-2">
                <div className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_6px_hsl(48_100%_50%_/_0.5)] transition-all" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground tracking-tight">{weapon.name}</span>
                  <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">{weapon.category}</span>
                </div>
              </div>

              {/* Stock Badge */}
              <div className="flex justify-center">
                <span className={`
                  inline-flex items-center justify-center min-w-[40px] px-2.5 py-0.5 rounded-sm text-xs font-bold tabular-nums
                  ${weapon.stock > 10
                    ? "bg-success/10 text-success border border-success/20"
                    : weapon.stock > 3
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-destructive/10 text-destructive border border-destructive/20"
                  }
                `}>
                  {weapon.stock}
                </span>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                {activeTab === "auslagern" ? (
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wider bg-primary/15 border border-primary/35 text-primary hover:bg-primary/25 hover:border-primary/50 hover:shadow-[0_0_10px_hsl(48_100%_50%_/_0.2)] transition-all">
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

export default ArmoryTable;
