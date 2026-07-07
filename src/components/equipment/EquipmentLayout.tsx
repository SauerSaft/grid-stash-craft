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
import FactionsView from "./FactionsView";
import ItemShopGrid from "./ItemShopGrid";
import StarterpaketPage from "./StarterpaketPage";
import LoadoutsPage2 from "./LoadoutsPage2";
import MoneyLaunderingPage from "./MoneyLaunderingPage";
import SupportPage from "./SupportPage";
import PlayersPage from "./PlayersPage";
import BansPage from "./BansPage";
import bgImage from "@/assets/bg.png";
import gridImage from "@/assets/grid.png";

const EquipmentLayout = () => {
  const [selectedCategory, setSelectedCategory] = useState("waffen-shop");

  return (
    <div className="ginshi_root fixed inset-0 z-[9999] flex items-center justify-center">

      <div className="relative flex h-[87vh] w-[82vw] flex-col overflow-hidden rounded-[0.4vw] border-[0.052vw] border-[rgba(168,85,247,0.18)] bg-[rgba(10,8,14,0.97)] shadow-[0_1vw_4vw_rgba(0,0,0,0.85)]">
        <img
          src={bgImage}
          alt=""
          draggable={false}
          className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover object-center opacity-80"
        />
        <img
          src={gridImage}
          alt=""
          draggable={false}
          className="pointer-events-none absolute inset-0 z-[2] h-full w-full object-cover object-center opacity-40 [mix-blend-mode:color-dodge]"
        />

        <EquipmentHeader />

        <div className="relative z-10 flex flex-1 overflow-hidden">
          <div className="overflow-y-auto border-r-[0.052vw] border-[var(--glass-border)] p-3">
            <CategorySidebar selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>

          <div className="flex flex-1 flex-col overflow-hidden p-4">
            {selectedCategory === "waffen-shop" ? (
              <WeaponShopGrid />
            ) : selectedCategory === "item-shop" ? (
              <ItemShopGrid />
            ) : selectedCategory === "starterpaket" ? (
              <StarterpaketPage />
            ) : selectedCategory === "fraklager" ? (
              <StorageTable />
            ) : selectedCategory === "loadouts" ? (
              <LoadoutsPage2 />
            ) : selectedCategory === "waffenkammer" ? (
              <ArmoryTable />
            ) : selectedCategory === "fraktionskasse" ? (
              <FactionTreasury />
            ) : selectedCategory === "geldwaesche" ? (
              <MoneyLaunderingPage />
            ) : selectedCategory === "support" ? (
              <SupportPage />
            ) : selectedCategory === "spieler" ? (
              <PlayersPage />
            ) : selectedCategory === "bans" ? (
              <BansPage />
            ) : selectedCategory === "mitglieder" ? (
              <FactionMembers />
            ) : selectedCategory === "fraktionen" ? (
              <FactionsView />
            ) : selectedCategory === "logs" ? (
              <FactionLogsV2 />
            ) : (
              <div className="ginshi_section items-center justify-center">
                <Package size={48} className="text-muted-foreground opacity-40" />
                <p className="text-sm font-semibold text-muted-foreground opacity-40">
                  Noch nicht verfügbar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentLayout;
