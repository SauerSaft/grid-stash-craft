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

const getStockClass = (stock: number) =>
  stock > 10 ? "ginshi_stock_badge_high" : stock > 3 ? "ginshi_stock_badge_mid" : "ginshi_stock_badge_low";

const ArmoryTable = () => {
  const [activeTab, setActiveTab] = useState<TabMode>("auslagern");

  return (
    <div className="ginshi_section ginshi_section_tabbed">
      {/* Page Header */}
      <div className="ginshi_section_header">
        <div className="ginshi_section_header_icon">
          <Shield size={16} />
        </div>
        <div className="ginshi_section_header_content">
          <span className="ginshi_section_header_title">Waffenkammer</span>
          <span className="ginshi_section_header_subtitle">Lagere hier dienstliche und beschlagnahmte Waffen ein und aus.</span>
        </div>
      </div>

      <div className="ginshi_divider" />

      {/* Tabs */}
      <div className="ginshi_tab_bar">
        <button
          onClick={() => setActiveTab("auslagern")}
          className={`ginshi_tab ${activeTab === "auslagern" ? "ginshi_tab_active" : ""}`}
        >
          <ArrowUpFromLine />
          Auslagern
        </button>
        <button
          onClick={() => setActiveTab("einlagern")}
          className={`ginshi_tab ${activeTab === "einlagern" ? "ginshi_tab_active" : ""}`}
        >
          <ArrowDownToLine />
          Einlagern
        </button>
      </div>

      <div className="ginshi_divider" />

      {/* Table */}
      <div className="ginshi_grid_table">
        <div className="ginshi_grid_thead armory_cols">
          <span className="ginshi_grid_th">Waffe</span>
          <span className="ginshi_grid_th">Name</span>
          <span className="ginshi_grid_th" style={{ textAlign: "center" }}>Bestand</span>
          <span className="ginshi_grid_th" style={{ textAlign: "right" }}>Aktion</span>
        </div>

        <div className="ginshi_grid_tbody">
          {mockWeapons.map((weapon) => (
            <div key={weapon.id} className="ginshi_grid_row armory_cols">
              {/* Tactical Showcase */}
              <div>
                <div className="armory_showcase">
                  <div className="armory_showcase_corner_tl" />
                  <img
                    src={weapon.image}
                    alt={weapon.name}
                    className="armory_showcase_img"
                    draggable={false}
                  />
                  <div className="armory_showcase_corner_br" />
                </div>
              </div>

              {/* Name */}
              <div className="ginshi_item_name" style={{ paddingLeft: "0.5rem" }}>
                <div className="ginshi_item_dot" />
                <span className="ginshi_item_name_text">{weapon.name}</span>
              </div>

              {/* Stock */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <span className={`ginshi_stock_badge ${getStockClass(weapon.stock)}`}>
                  {weapon.stock}
                </span>
              </div>

              {/* Action */}
              <div className="ginshi_table_actions">
                {activeTab === "auslagern" ? (
                  <button className="ginshi_btn_primary">
                    <ArrowUpFromLine />
                    Auslagern
                  </button>
                ) : (
                  <button className="ginshi_btn_success">
                    <ArrowDownToLine />
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
