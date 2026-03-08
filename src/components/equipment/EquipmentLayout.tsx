import { useState } from "react";
import { Package } from "lucide-react";
import EquipmentHeader from "./EquipmentHeader";
import CategorySidebar from "./CategorySidebar";
import StorageTable from "./StorageTable";
import ArmoryTable from "./ArmoryTable";
import WeaponShopGrid from "./WeaponShopGrid";
import FactionTreasury from "./FactionTreasury";
import FactionMembers from "./FactionMembers";
import FactionLogsV2 from "./FactionLogsV2";
import ItemShopGrid from "./ItemShopGrid";
import bgImage from "@/assets/bg.png";
import gridImage from "@/assets/grid.png";

const EquipmentLayout = () => {
  const [selectedCategory, setSelectedCategory] = useState("waffen-shop");

  return (
    <div className="ginshi_root">
      <div className="ginshi_panel">
        <img src={bgImage} alt="" className="ginshi_bg_pattern" draggable={false} />
        <img src={gridImage} alt="" className="ginshi_grid_overlay" draggable={false} />

        <EquipmentHeader />

        <div className="ginshi_body">
          <div className="ginshi_sidebar">
            <CategorySidebar selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>

          <div className="ginshi_content">
            {selectedCategory === "waffen-shop" ? (
              <WeaponShopGrid />
            ) : selectedCategory === "item-shop" ? (
              <ItemShopGrid />
            ) : selectedCategory === "fraklager" ? (
              <StorageTable />
            ) : selectedCategory === "waffenkammer" ? (
              <ArmoryTable />
            ) : selectedCategory === "fraktionskasse" ? (
              <FactionTreasury />
            ) : selectedCategory === "mitglieder" ? (
              <FactionMembers />
            ) : selectedCategory === "logs" ? (
              <FactionLogs />
            ) : selectedCategory === "logs-v2" ? (
              <FactionLogsV2 />
            ) : (
              <div className="ginshi_section" style={{ alignItems: "center", justifyContent: "center" }}>
                <Package size={48} style={{ opacity: 0.4, color: "hsl(var(--muted-foreground))" }} />
                <p style={{ opacity: 0.4, fontSize: "0.875rem", fontWeight: 600, color: "hsl(var(--muted-foreground))" }}>Noch nicht verfügbar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentLayout;
