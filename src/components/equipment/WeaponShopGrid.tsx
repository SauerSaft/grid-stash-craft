import { useState } from "react";
import { ShoppingCart, Check, Wrench } from "lucide-react";
import WeaponModifyModal from "./WeaponModifyModal";

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
  const [modifyWeapon, setModifyWeapon] = useState<ShopWeapon | null>(null);

  return (
    <div className="ginshi_section">
      {/* Page Header */}
      <div className="ginshi_section_header">
        <div className="ginshi_section_header_icon">
          <ShoppingCart size={16} />
        </div>
        <div className="ginshi_section_header_content">
          <span className="ginshi_section_header_title">Waffen Shop</span>
          <span className="ginshi_section_header_subtitle">Kaufe deine Dienstwaffen und modifiziere diese mit Aufsätzen!</span>
        </div>
      </div>

      {/* Grid */}
      <div className="weaponshop_grid">
        <div className="weaponshop_grid_inner">
          {mockShopWeapons.map((weapon) => (
            <div key={weapon.id} className="weaponshop_card">
              {/* Image Area */}
              <div className="weaponshop_card_image">
                <div className="weaponshop_card_image_gradient" />
                <div className="weaponshop_card_corner_tl" />
                <div className="weaponshop_card_corner_br" />

                <img
                  src={weapon.image}
                  alt={weapon.name}
                  className="weaponshop_card_img"
                  draggable={false}
                />

                {weapon.owned && (
                  <div className="weaponshop_card_owned">
                    <Check />
                  </div>
                )}

                <div className="weaponshop_card_divider_bottom" />
              </div>

              {/* Content */}
              <div className="weaponshop_card_content">
                <h3 className="weaponshop_card_name">{weapon.name}</h3>

                <div className="weaponshop_card_price_row">
                  <span className="weaponshop_card_price_label">Preis</span>
                  <span className="weaponshop_card_price_value">{formatPrice(weapon.price)}</span>
                </div>

                <div className="weaponshop_card_line" />

                <div className="weaponshop_card_actions">
                  {!weapon.owned ? (
                    <button className="weaponshop_btn_buy">
                      <ShoppingCart />
                      Kaufen
                    </button>
                  ) : (
                    <>
                      <button disabled className="weaponshop_btn_equipped">
                        <Check />
                        Ausgerüstet
                      </button>
                      {weapon.modifiable && (
                        <button
                          onClick={() => setModifyWeapon(weapon)}
                          className="weaponshop_btn_modify"
                        >
                          <Wrench />
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

      {/* Modify Modal */}
      {modifyWeapon && (
        <WeaponModifyModal
          open={!!modifyWeapon}
          onOpenChange={(open) => { if (!open) setModifyWeapon(null); }}
          weaponName={modifyWeapon.name}
          weaponImage={modifyWeapon.image}
        />
      )}
    </div>
  );
};

export default WeaponShopGrid;
