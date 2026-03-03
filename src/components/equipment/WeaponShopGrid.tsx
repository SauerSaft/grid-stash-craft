import { ShoppingCart, Check, Wrench } from "lucide-react";

import weaponCarbine from "@/assets/weapons/WEAPON_CARBINERIFLE.webp";
import weaponPistol from "@/assets/weapons/WEAPON_PISTOL.webp";

interface ShopWeapon {
  id: string;
  name: string;
  price: number;
  image: string;
  owned: boolean;
  modifiable: boolean;
}

const mockShopWeapons: ShopWeapon[] = [
  { id: "1", name: "Karabiner", price: 15000, image: weaponCarbine, owned: true, modifiable: true },
  { id: "2", name: "Pistole", price: 5000, image: weaponPistol, owned: true, modifiable: true },
  { id: "3", name: "Karabiner MK2", price: 22000, image: weaponCarbine, owned: false, modifiable: false },
  { id: "4", name: "Pistole .50", price: 8500, image: weaponPistol, owned: false, modifiable: false },
  { id: "5", name: "Kampfgewehr", price: 18000, image: weaponCarbine, owned: true, modifiable: false },
  { id: "6", name: "Pistole MK2", price: 7500, image: weaponPistol, owned: false, modifiable: false },
];

const formatPrice = (price: number) =>
  `$${price.toLocaleString("de-DE")}`;

const WeaponShopGrid = () => {
  return (
    <div className="ginshi_shop_container flex flex-col flex-1 gap-3 overflow-hidden">
      {/* Page Header */}
      <div className="ginshi_shop_header flex items-center gap-3 px-4 py-3 bg-white/[0.03] rounded-sm border border-white/[0.06]">
        <div className="p-1.5 rounded-sm bg-primary/15 border border-primary/20">
          <ShoppingCart size={14} className="text-primary" style={{ filter: "drop-shadow(0 0 6px hsl(48 100% 50% / 0.5))" }} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-foreground">Waffen Shop</span>
          <span className="text-xs font-medium text-muted-foreground">Kaufe deine Dienstwaffen und modifiziere diese mit Aufsätzen!</span>
        </div>
      </div>

      {/* Grid */}
      <div className="ginshi_shop_grid flex-1 overflow-y-auto">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2.5">
          {mockShopWeapons.map((weapon) => (
            <div
              key={weapon.id}
              className="ginshi_weapon_card group flex flex-col rounded-sm overflow-hidden border border-primary/[0.12] bg-black/30 hover:border-primary/30 hover:bg-black/50 transition-all"
            >
              {/* Image Area */}
              <div className="ginshi_weapon_image relative h-[80px] bg-black/40 flex items-center justify-center overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent pointer-events-none" />
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-[1px] bg-gradient-to-r from-primary/30 to-transparent" />
                <div className="absolute top-0 left-0 w-[1px] h-3 bg-gradient-to-b from-primary/30 to-transparent" />
                <div className="absolute bottom-0 right-0 w-4 h-[1px] bg-gradient-to-l from-primary/20 to-transparent" />

                <img
                  src={weapon.image}
                  alt={weapon.name}
                  className="w-full h-full object-contain p-2 brightness-90 contrast-110"
                  draggable={false}
                />

                {/* Owned badge */}
                {weapon.owned && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-success/20 border border-success/40 flex items-center justify-center">
                    <Check size={8} className="text-success" />
                  </div>
                )}

                {/* Bottom line */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
              </div>

              {/* Content */}
              <div className="ginshi_weapon_info flex flex-col gap-1.5 p-2.5 pt-2">
                {/* Name */}
                <h3 className="ginshi_weapon_name text-xs font-bold text-foreground uppercase tracking-wide truncate leading-none">
                  {weapon.name}
                </h3>

                {/* Price */}
                <div className="ginshi_weapon_price flex items-center justify-between">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Preis</span>
                  <span className="text-xs font-extrabold text-primary tabular-nums tracking-tight">
                    {formatPrice(weapon.price)}
                  </span>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-white/[0.06]" />

                {/* Actions */}
                <div className="ginshi_weapon_actions flex gap-1.5">
                  {!weapon.owned ? (
                    <button className="ginshi_btn_buy flex-1 flex items-center justify-center gap-1 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-info/15 border border-info/30 text-info hover:bg-info/25 hover:border-info/50 transition-colors">
                      <ShoppingCart size={9} />
                      Kaufen
                    </button>
                  ) : (
                    <>
                      <button
                        disabled
                        className="ginshi_btn_equipped flex-1 flex items-center justify-center gap-1 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-success/10 border border-success/20 text-success/50 cursor-not-allowed"
                      >
                        <Check size={9} />
                        Ausgerüstet
                      </button>
                      {weapon.modifiable && (
                        <button className="ginshi_btn_modify flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 hover:border-primary/50 transition-colors">
                          <Wrench size={9} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeaponShopGrid;
