import { useState } from "react";
import { Package } from "lucide-react";
import EquipmentHeader from "./EquipmentHeader";
import CategorySidebar from "./CategorySidebar";
import StorageTable from "./StorageTable";

const EquipmentLayout = () => {
  const [selectedCategory, setSelectedCategory] = useState("fraklager");

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      {/* Grid overlay */}
      <div className="game-grid-overlay" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col w-[85vw] max-w-[1200px] h-[80vh] max-h-[700px] bg-background/95 border border-border/40 rounded-sm shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_20px_rgba(255,217,0,0.03)] backdrop-blur-sm overflow-hidden">
        <EquipmentHeader />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="border-r border-border/40 px-3 py-4 overflow-y-auto">
            <CategorySidebar selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            {selectedCategory === "fraklager" ? (
              <StorageTable />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center opacity-40">
                  <Package size={48} className="mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-semibold text-muted-foreground">Noch nicht verfügbar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentLayout;
