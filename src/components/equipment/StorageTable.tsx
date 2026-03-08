import { useState } from "react";
import { Package, ArrowDownToLine, ArrowUpFromLine, Minus, Plus } from "lucide-react";

interface StorageItem {
  id: string;
  name: string;
  stock: number;
}

const mockItems: StorageItem[] = [
  { id: "1", name: "Brot", stock: 50 },
  { id: "2", name: "Wasser", stock: 100 },
  { id: "3", name: "Verbandsmaterial", stock: 25 },
  { id: "4", name: "Munition", stock: 500 },
  { id: "5", name: "Erste-Hilfe-Kasten", stock: 12 },
  { id: "6", name: "Schutzweste", stock: 8 },
  { id: "7", name: "Funkgerät", stock: 30 },
  { id: "8", name: "Taschenlampe", stock: 45 },
];

type TabMode = "auslagern" | "einlagern";

const getStockClass = (stock: number) =>
  stock > 50 ? "ginshi_stock_badge_high" : stock > 15 ? "ginshi_stock_badge_mid" : "ginshi_stock_badge_low";

const StorageTable = () => {
  const [activeTab, setActiveTab] = useState<TabMode>("auslagern");
  const [amounts, setAmounts] = useState<Record<string, number>>({});

  const getAmount = (id: string) => amounts[id] || 1;

  const setAmount = (id: string, val: number, max: number) => {
    setAmounts((prev) => ({ ...prev, [id]: Math.max(1, Math.min(val, max)) }));
  };

  return (
    <div className="ginshi_section ginshi_section_tabbed">
      {/* Page Header */}
      <div className="ginshi_section_header">
        <div className="ginshi_section_header_icon">
          <Package size={16} />
        </div>
        <div className="ginshi_section_header_content">
          <span className="ginshi_section_header_title">Fraklager</span>
          <span className="ginshi_section_header_subtitle">Lagere hier Items der Fraktion ein und aus.</span>
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
        <div className="ginshi_grid_thead storage_cols">
          <span className="ginshi_grid_th">Name</span>
          <span className="ginshi_grid_th" style={{ textAlign: "center" }}>Bestand</span>
          <span className="ginshi_grid_th" style={{ textAlign: "center" }}>Menge</span>
          <span className="ginshi_grid_th" style={{ textAlign: "right" }}>Aktion</span>
        </div>

        <div className="ginshi_grid_tbody">
          {mockItems.map((item) => (
            <div key={item.id} className="ginshi_grid_row storage_cols">
              {/* Name */}
              <div className="ginshi_item_name">
                <div className="ginshi_item_dot" />
                <span className="ginshi_item_name_text">{item.name}</span>
              </div>

              {/* Stock */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <span className={`ginshi_stock_badge ${getStockClass(item.stock)}`}>
                  {item.stock}
                </span>
              </div>

              {/* Amount Stepper */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div className="ginshi_stepper">
                  <button
                    onClick={() => setAmount(item.id, getAmount(item.id) - 1, item.stock)}
                    className="ginshi_stepper_btn ginshi_stepper_btn_left"
                  >
                    <Minus />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={item.stock}
                    value={getAmount(item.id)}
                    onChange={(e) => setAmount(item.id, parseInt(e.target.value) || 1, item.stock)}
                    className="ginshi_stepper_input"
                  />
                  <button
                    onClick={() => setAmount(item.id, getAmount(item.id) + 1, item.stock)}
                    className="ginshi_stepper_btn ginshi_stepper_btn_right"
                  >
                    <Plus />
                  </button>
                </div>
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

export default StorageTable;
