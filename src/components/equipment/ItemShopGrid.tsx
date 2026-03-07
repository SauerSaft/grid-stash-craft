import { ShoppingBag, ShoppingCart } from "lucide-react";

interface ShopItem {
  id: string;
  name: string;
  price: number;
  amount: number;
}

const shopItems: ShopItem[] = [
  { id: "1", name: "Medikit", price: 250, amount: 10 },
  { id: "2", name: "Repairkit", price: 500, amount: 5 },
  { id: "3", name: "Schutzweste", price: 1500, amount: 3 },
  { id: "4", name: "Funkgerät", price: 300, amount: 5 },
  { id: "5", name: "Taschenlampe", price: 150, amount: 10 },
  { id: "6", name: "Adrenalin", price: 800, amount: 3 },
  { id: "7", name: "Handschellen", price: 200, amount: 10 },
  { id: "8", name: "Nagelbänder", price: 350, amount: 5 },
];

const formatPrice = (price: number) => `$${price.toLocaleString("de-DE")}`;

const ItemShopGrid = () => {
  return (
    <div className="ginshi_itemshop_container flex flex-col flex-1 gap-3 overflow-hidden">
      {/* Page Header */}
      <div className="ginshi_itemshop_header flex items-center gap-3 px-4 py-3 bg-white/[0.03] rounded-sm border border-white/[0.06]">
        <div className="p-1.5 rounded-sm bg-primary/15 border border-primary/20">
          <ShoppingBag size={14} className="text-primary" style={{ filter: "drop-shadow(0 0 6px hsl(48 100% 50% / 0.5))" }} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-foreground">Item Shop</span>
          <span className="text-xs font-medium text-muted-foreground">Kaufe Ausrüstung und Verbrauchsgüter für den Dienst</span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto rounded-sm border border-white/[0.06] bg-white/[0.02]">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_80px_100px_100px_110px] px-4 py-2.5 border-b border-white/[0.08] bg-black/50 sticky top-0 z-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Name</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground text-center">Menge</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground text-center">Stückpreis</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground text-center">Gesamt</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground text-right">Aktion</span>
        </div>

        {/* Rows */}
        <div className="flex flex-col">
          {shopItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_80px_100px_100px_110px] items-center px-4 py-2.5 border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors group"
            >
              {/* Name */}
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_6px_hsl(48_100%_50%_/_0.5)] transition-all" />
                <span className="text-sm font-semibold text-foreground tracking-tight">{item.name}</span>
              </div>

              {/* Amount Badge */}
              <div className="flex justify-center">
                <span className="inline-flex items-center justify-center min-w-[36px] px-2 py-0.5 rounded-sm text-xs font-bold tabular-nums bg-primary/10 text-primary border border-primary/20">
                  {item.amount}x
                </span>
              </div>

              {/* Unit Price */}
              <div className="flex justify-center">
                <span className="text-xs font-semibold tabular-nums text-muted-foreground">{formatPrice(item.price)}</span>
              </div>

              {/* Total */}
              <div className="flex justify-center">
                <span className="text-xs font-extrabold tabular-nums text-foreground">{formatPrice(item.price * item.amount)}</span>
              </div>

              {/* Buy Button */}
              <div className="flex justify-end">
                <button className="ginshi_btn_buy flex items-center gap-1 px-3 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wider bg-info/15 border border-info/30 text-info hover:bg-info/25 hover:border-info/50 hover:shadow-[0_0_10px_hsl(199_89%_48%_/_0.2)] transition-all">
                  <ShoppingCart size={10} />
                  Kaufen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemShopGrid;
