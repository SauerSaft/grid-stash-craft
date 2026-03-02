import { X, Minimize2 } from "lucide-react";
import iconEquipment from "@/assets/icon_ui_equipment.png";

const EquipmentHeader = () => {
  return (
    <header className="flex items-center justify-between px-6 h-14 border-b border-white/[0.06] flex-shrink-0">
      <div className="flex items-center gap-3">
        <img
          src={iconEquipment}
          alt=""
          className="w-9 h-9"
          style={{ filter: "drop-shadow(-8px 0 12px rgba(255, 215, 56, 0.75))" }}
          draggable={false}
        />
        <div className="flex flex-col leading-none" style={{ marginLeft: "-0.5rem" }}>
          <div className="flex items-baseline gap-1">
            <span className="font-orbitron text-lg font-bold tracking-tight text-foreground">LATENIGHT</span>
            <span className="font-orbitron text-2xl font-bold text-primary" style={{ transform: "skewX(-8deg)", display: "inline-block" }}>V</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <svg width="10" height="10" viewBox="0 0 13 13" fill="none">
              <path
                d="M12.2616 6.27C12.0308 3.34385 9.68618 0.999231 6.76003 0.768462C6.60311 0.759231 6.43695 0.75 6.28003 0.75C2.96618 0.75 0.280029 3.43615 0.280029 6.75C0.280029 10.0638 2.96618 12.75 6.28003 12.75C9.59388 12.75 12.28 10.0638 12.28 6.75C12.28 6.59308 12.2708 6.42692 12.2616 6.27ZM7.09234 7.56231L6.28003 9.05769L5.46772 7.56231L3.97234 6.75L5.46772 5.93769L6.28003 4.44231L7.09234 5.93769L8.58772 6.75L7.09234 7.56231Z"
                fill="hsl(48, 100%, 50%)"
              />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Ausrüstungen</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-7 h-7 rounded-sm bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/[0.2] transition-colors">
          <Minimize2 size={14} />
        </button>
        <button className="w-7 h-7 rounded-sm bg-destructive/15 border border-destructive/25 flex items-center justify-center text-destructive hover:bg-destructive/25 hover:border-destructive/40 transition-colors">
          <X size={14} />
        </button>
      </div>
    </header>
  );
};

export default EquipmentHeader;
