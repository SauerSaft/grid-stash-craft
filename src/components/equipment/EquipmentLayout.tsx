import { useState } from "react";
import { Package } from "lucide-react";
import EquipmentHeader from "./EquipmentHeader";
import CategorySidebar from "./CategorySidebar";
import StorageTable from "./StorageTable";
import ArmoryTable from "./ArmoryTable";
import bgImage from "@/assets/bg.png";
import gridImage from "@/assets/grid.png";

const EquipmentLayout = () => {
  const [selectedCategory, setSelectedCategory] = useState("fraklager");

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      {/* Main Container - bigger */}
      <div className="relative flex flex-col w-[75vw] h-[75vh] rounded-sm shadow-[0_0_80px_rgba(0,0,0,0.9),0_0_30px_rgba(255,217,0,0.04)] overflow-hidden">
        {/* Background image layer */}
        <img
          src={bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
        {/* Grid overlay - inside menu only */}
        <img
          src={gridImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none mix-blend-color-dodge opacity-60"
          draggable={false}
        />

        {/* Content on top */}
        <div className="relative z-10 flex flex-col h-full">
          <EquipmentHeader />

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="border-r border-white/[0.06] px-3 py-4 overflow-y-auto">
              <CategorySidebar selected={selectedCategory} onSelect={setSelectedCategory} />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              {selectedCategory === "fraklager" ? (
                <StorageTable />
              ) : selectedCategory === "waffenkammer" ? (
                <ArmoryTable />
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
    </div>
  );
};

export default EquipmentLayout;
