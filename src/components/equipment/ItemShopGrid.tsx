import { ShoppingBag, Plus, Heart, Wrench, Shield, Radio, Flashlight, Zap } from "lucide-react";

interface ShopItem {
  id: string;
  name: string;
  price: number;
  quickAmounts: number[];
  icon: typeof Heart;
  color: string;
}

const shopItems: ShopItem[] = [
  { id: "1", name: "Medikit", price: 250, quickAmounts: [1, 5, 10, 25], icon: Heart, color: "text-red-400" },
  { id: "2", name: "Repairkit", price: 500, quickAmounts: [1, 5, 10], icon: Wrench, color: "text-blue-400" },
  { id: "3", name: "Schutzweste", price: 1500, quickAmounts: [1, 3, 5], icon: Shield, color: "text-primary" },
  { id: "4", name: "Funkgerät", price: 300, quickAmounts: [1, 5, 10], icon: Radio, color: "text-emerald-400" },
  { id: "5", name: "Taschenlampe", price: 150, quickAmounts: [1, 5, 10, 20], icon: Flashlight, color: "text-amber-300" },
  { id: "6", name: "Adrenalin", price: 800, quickAmounts: [1, 3, 5], icon: Zap, color: "text-orange-400" },
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

      {/* Grid */}
      <div className="ginshi_itemshop_grid flex-1 overflow-y-auto">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-2.5">
          {shopItems.map((item) => (
            <div
              key={item.id}
              className="ginshi_item_card group flex flex-col rounded-sm overflow-hidden border border-primary/[0.12] bg-black/30 hover:border-primary/30 hover:bg-black/50 transition-all"
            >
              {/* Icon Area */}
              <div className="relative h-[72px] bg-black/40 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 w-4 h-[1px] bg-gradient-to-r from-primary/30 to-transparent" />
                <div className="absolute top-0 left-0 w-[1px] h-3 bg-gradient-to-b from-primary/30 to-transparent" />
                <div className="absolute bottom-0 right-0 w-4 h-[1px] bg-gradient-to-l from-primary/20 to-transparent" />

                <item.icon
                  size={30}
                  className={`${item.color} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`}
                  strokeWidth={1.5}
                />

                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1.5 p-2.5 pt-2">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide truncate leading-none">
                  {item.name}
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Stückpreis</span>
                  <span className="text-xs font-extrabold text-primary tabular-nums tracking-tight">
                    {formatPrice(item.price)}
                  </span>
                </div>

                <div className="w-full h-[1px] bg-white/[0.06]" />

                {/* Quick Buy Buttons */}
                <div className="flex flex-col gap-1">
                  {item.quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      className="ginshi_btn_quickbuy flex items-center justify-between px-2.5 py-[5px] rounded-sm text-[10px] font-bold bg-white/[0.03] border border-white/[0.06] hover:bg-primary/15 hover:border-primary/30 hover:text-primary transition-all group/btn"
                    >
                      <span className="flex items-center gap-1 text-muted-foreground group-hover/btn:text-primary transition-colors">
                        <Plus size={8} className="opacity-50" />
                        <span className="tabular-nums">{amount}x</span>
                        <span className="uppercase tracking-wider">{item.name}</span>
                      </span>
                      <span className="tabular-nums font-extrabold text-foreground/60 group-hover/btn:text-primary transition-colors">
                        {formatPrice(item.price * amount)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemShopGrid;
