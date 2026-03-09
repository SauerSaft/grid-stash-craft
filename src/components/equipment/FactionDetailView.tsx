import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Users,
  Trash2,
  ShoppingCart,
  Car,
  MapPin,
  Settings,
  Shield,
} from "lucide-react";

// ─── Types ───
interface Rank {
  id: number;
  label: string;
  name: string;
  grade: number;
  salary: number;
}

interface ShopItem {
  id: number;
  type: "weapon" | "item";
  model: string;
  price: number;
}

interface Vehicle {
  id: number;
  model: string;
  label: string;
  type: "car" | "air" | "boat";
  price: number;
}

interface Marker {
  id: number;
  type: string;
  name: string;
  x: number;
  y: number;
  z: number;
}

interface FactionDetailProps {
  factionLabel: string;
  factionName: string;
  onBack: () => void;
}

// ─── Mock Data ───

const mockRanks: Rank[] = [
  { id: 1, label: "Azubi", name: "trainee", grade: 0, salary: 100 },
  { id: 2, label: "Officer", name: "officer", grade: 1, salary: 300 },
  { id: 3, label: "Sergeant", name: "sergeant", grade: 2, salary: 500 },
  { id: 4, label: "Lieutenant", name: "lieutenant", grade: 3, salary: 800 },
  { id: 5, label: "Captain", name: "captain", grade: 4, salary: 1200 },
];

const mockShopItems: ShopItem[] = [
  { id: 1, type: "weapon", model: "WEAPON_PISTOL", price: 500 },
  { id: 2, type: "weapon", model: "WEAPON_CARBINERIFLE", price: 2500 },
  { id: 3, type: "item", model: "Schutzweste", price: 800 },
  { id: 4, type: "item", model: "Medikit", price: 200 },
];

const mockVehicles: Vehicle[] = [
  { id: 1, model: "police", label: "Police Car", type: "car", price: 0 },
  { id: 2, model: "policeb", label: "Police Bike", type: "car", price: 0 },
  { id: 3, model: "polmav", label: "Police Maverick", type: "air", price: 0 },
];

const mockMarkers: Marker[] = [
  { id: 1, type: "bossmenu", name: "Boss Menu", x: 441.78, y: -981.22, z: 30.69 },
  { id: 2, type: "equipment", name: "Equipment", x: 452.12, y: -980.11, z: 30.69 },
  { id: 3, type: "garage_location", name: "Garage", x: 458.33, y: -1017.44, z: 28.07 },
];

type DetailTab = "ranks" | "shop" | "vehicles" | "markers" | "settings";

const tabs: { id: DetailTab; label: string; icon: typeof Shield }[] = [
  { id: "ranks", label: "Ränge", icon: Shield },
  { id: "shop", label: "Shop", icon: ShoppingCart },
  { id: "vehicles", label: "Fahrzeuge", icon: Car },
  { id: "markers", label: "Marker", icon: MapPin },
  { id: "settings", label: "Sonstige", icon: Settings },
];

const FactionDetailView = ({ factionLabel, onBack }: FactionDetailProps) => {
  const [activeTab, setActiveTab] = useState<DetailTab>("ranks");

  return (
    <div className="ginshi_section ginshi_section_tabbed">
      {/* Toolbar: Back + Tabs + Add Button */}
      <div className="ginshi_detail_toolbar">
        <button onClick={onBack} className="ginshi_btn_info" style={{ flexShrink: 0 }}>
          <ArrowLeft size={13} />
          Zurück
        </button>

        <div className="ginshi_tab_bar" style={{ flex: 1, justifyContent: "center" }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`ginshi_tab ${activeTab === tab.id ? "ginshi_tab_active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "ranks" && (
          <button className="ginshi_btn_primary" style={{ flexShrink: 0 }}>
            <Plus size={13} />
            Rang hinzufügen
          </button>
        )}
        {activeTab === "shop" && (
          <button className="ginshi_btn_primary" style={{ flexShrink: 0 }}>
            <Plus size={13} />
            Item hinzufügen
          </button>
        )}
        {activeTab === "vehicles" && (
          <button className="ginshi_btn_primary" style={{ flexShrink: 0 }}>
            <Plus size={13} />
            Fahrzeug hinzufügen
          </button>
        )}
        {activeTab === "markers" && (
          <button className="ginshi_btn_primary" style={{ flexShrink: 0 }}>
            <Plus size={13} />
            Marker hinzufügen
          </button>
        )}
        {activeTab === "settings" && <div style={{ width: "7rem" }} />}
      </div>

      <div className="ginshi_divider" />

      {/* Tab Title */}
      <div className="ginshi_detail_tab_title">
        <span className="ginshi_section_header_title" style={{ fontSize: "0.95rem" }}>
          {factionLabel}
        </span>
        <span style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.85rem", fontWeight: 500 }}>
          — {tabs.find((t) => t.id === activeTab)?.label} verwalten
        </span>
      </div>

      {/* ─── Ranks Tab ─── */}
      {activeTab === "ranks" && (
        <div className="ginshi_grid_table">
          <div className="ginshi_grid_thead faction_ranks_cols">
            <span className="ginshi_grid_th">ID</span>
            <span className="ginshi_grid_th">Label</span>
            <span className="ginshi_grid_th">Name</span>
            <span className="ginshi_grid_th" style={{ textAlign: "center" }}>Grad</span>
            <span className="ginshi_grid_th" style={{ textAlign: "center" }}>Gehalt</span>
            <span className="ginshi_grid_th" style={{ textAlign: "right" }}>Aktionen</span>
          </div>
          <div className="ginshi_grid_tbody">
            {mockRanks.map((rank) => (
              <div key={rank.id} className="ginshi_grid_row faction_ranks_cols">
                <span style={{ fontWeight: 700, color: "hsl(var(--muted-foreground))" }}>
                  {rank.id}
                </span>
                <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>
                  {rank.label}
                </span>
                <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "hsl(var(--muted-foreground))" }}>
                  {rank.name}
                </span>
                <span style={{ textAlign: "center", fontWeight: 700, color: "hsl(var(--foreground))" }}>
                  {rank.grade}
                </span>
                <span style={{ textAlign: "center", fontWeight: 700, color: "hsl(var(--success))" }}>
                  ${rank.salary}
                </span>
                <div className="ginshi_table_actions">
                  <button title="Bearbeiten" className="ginshi_action_btn ginshi_action_btn_warning">
                    <Pencil size={12} />
                  </button>
                  <button title="Rechte" className="ginshi_action_btn ginshi_action_btn_success">
                    <Users size={12} />
                  </button>
                  <button title="Löschen" className="ginshi_action_btn ginshi_action_btn_danger">
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Shop Tab ─── */}
      {activeTab === "shop" && (
        <div className="ginshi_grid_table">
          <div className="ginshi_grid_thead faction_shop_cols">
            <span className="ginshi_grid_th">Typ</span>
            <span className="ginshi_grid_th">Model</span>
            <span className="ginshi_grid_th" style={{ textAlign: "center" }}>Preis</span>
            <span className="ginshi_grid_th" style={{ textAlign: "right" }}>Aktionen</span>
          </div>
          <div className="ginshi_grid_tbody">
            {mockShopItems.map((item) => (
              <div key={item.id} className="ginshi_grid_row faction_shop_cols">
                <div>
                  <div
                    className={`ginshi_status_badge ${item.type === "weapon" ? "ginshi_status_badge_on" : "ginshi_status_badge_off"}`}
                    style={{ display: "inline-flex" }}
                  >
                    {item.type === "weapon" ? "Waffe" : "Item"}
                  </div>
                </div>
                <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "hsl(var(--foreground))" }}>
                  {item.model}
                </span>
                <span style={{ textAlign: "center", fontWeight: 700, color: "hsl(var(--primary))" }}>
                  ${item.price}
                </span>
                <div className="ginshi_table_actions">
                  <button title="Löschen" className="ginshi_action_btn ginshi_action_btn_danger">
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Vehicles Tab ─── */}
      {activeTab === "vehicles" && (
        <div className="ginshi_grid_table">
          <div className="ginshi_grid_thead faction_vehicle_cols">
            <span className="ginshi_grid_th">Model</span>
            <span className="ginshi_grid_th">Label</span>
            <span className="ginshi_grid_th" style={{ textAlign: "center" }}>Typ</span>
            <span className="ginshi_grid_th" style={{ textAlign: "center" }}>Preis</span>
            <span className="ginshi_grid_th" style={{ textAlign: "right" }}>Aktionen</span>
          </div>
          <div className="ginshi_grid_tbody">
            {mockVehicles.map((veh) => (
              <div key={veh.id} className="ginshi_grid_row faction_vehicle_cols">
                <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "hsl(var(--foreground))" }}>
                  {veh.model}
                </span>
                <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>
                  {veh.label}
                </span>
                <div style={{ textAlign: "center" }}>
                  <div className="ginshi_status_badge ginshi_status_badge_off" style={{ display: "inline-flex" }}>
                    {veh.type === "car" ? "Auto" : veh.type === "air" ? "Heli" : "Boot"}
                  </div>
                </div>
                <span style={{ textAlign: "center", fontWeight: 700, color: "hsl(var(--primary))" }}>
                  ${veh.price}
                </span>
                <div className="ginshi_table_actions">
                  <button title="Löschen" className="ginshi_action_btn ginshi_action_btn_danger">
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Markers Tab ─── */}
      {activeTab === "markers" && (
        <div className="ginshi_grid_table">
          <div className="ginshi_grid_thead faction_marker_cols">
            <span className="ginshi_grid_th">Typ</span>
            <span className="ginshi_grid_th">Name</span>
            <span className="ginshi_grid_th" style={{ textAlign: "center" }}>X</span>
            <span className="ginshi_grid_th" style={{ textAlign: "center" }}>Y</span>
            <span className="ginshi_grid_th" style={{ textAlign: "center" }}>Z</span>
            <span className="ginshi_grid_th" style={{ textAlign: "right" }}>Aktionen</span>
          </div>
          <div className="ginshi_grid_tbody">
            {mockMarkers.map((marker) => (
              <div key={marker.id} className="ginshi_grid_row faction_marker_cols">
                <div>
                  <div className="ginshi_status_badge ginshi_status_badge_on" style={{ display: "inline-flex" }}>
                    {marker.type}
                  </div>
                </div>
                <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>
                  {marker.name}
                </span>
                <span style={{ textAlign: "center", fontFamily: "monospace", fontSize: "0.82rem", color: "hsl(var(--muted-foreground))" }}>
                  {marker.x}
                </span>
                <span style={{ textAlign: "center", fontFamily: "monospace", fontSize: "0.82rem", color: "hsl(var(--muted-foreground))" }}>
                  {marker.y}
                </span>
                <span style={{ textAlign: "center", fontFamily: "monospace", fontSize: "0.82rem", color: "hsl(var(--muted-foreground))" }}>
                  {marker.z}
                </span>
                <div className="ginshi_table_actions">
                  <button title="Bearbeiten" className="ginshi_action_btn ginshi_action_btn_warning">
                    <Pencil size={12} />
                  </button>
                  <button title="Löschen" className="ginshi_action_btn ginshi_action_btn_danger">
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Settings Tab ─── */}
      {activeTab === "settings" && (
        <div className="ginshi_grid_table" style={{ alignItems: "center", justifyContent: "center", padding: "3rem" }}>
          <Settings size={36} style={{ opacity: 0.3, color: "hsl(var(--muted-foreground))" }} />
          <p style={{ opacity: 0.4, fontSize: "0.875rem", fontWeight: 600, color: "hsl(var(--muted-foreground))", marginTop: "0.5rem" }}>
            Weitere Einstellungen folgen
          </p>
        </div>
      )}
    </div>
  );
};

export default FactionDetailView;
