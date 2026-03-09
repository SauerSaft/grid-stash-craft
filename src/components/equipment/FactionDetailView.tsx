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
  X,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── Types ───
interface Rank {
  id: number;
  label: string;
  name: string;
  grade: number;
  salary: number;
  rights?: Record<string, boolean>;
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

// ─── Rights Definition ───
const RIGHTS_LIST = [
  { key: "shop", label: "Shop Zugriff", icon: ShoppingCart },
  { key: "item_storage_take", label: "Items aus Lager nehmen", icon: Shield },
  { key: "weapon_storage_take", label: "Waffen aus Lager nehmen", icon: Shield },
  { key: "bossmenu", label: "Boss Menü", icon: Settings },
  { key: "treasury", label: "Tresor / Geld", icon: Shield },
  { key: "hire", label: "Spieler einstellen", icon: Users },
  { key: "promote", label: "Spieler befördern", icon: Users },
  { key: "demote", label: "Spieler degradieren", icon: Users },
  { key: "fire", label: "Spieler entlassen", icon: Trash2 },
];

// ─── Mock Data ───
const initialRanks: Rank[] = [
  { id: 1, label: "Azubi", name: "trainee", grade: 0, salary: 100, rights: {} },
  { id: 2, label: "Officer", name: "officer", grade: 1, salary: 300, rights: { shop: true } },
  { id: 3, label: "Sergeant", name: "sergeant", grade: 2, salary: 500, rights: { shop: true, hire: true } },
  { id: 4, label: "Lieutenant", name: "lieutenant", grade: 3, salary: 800, rights: { shop: true, hire: true, promote: true } },
  { id: 5, label: "Captain", name: "captain", grade: 4, salary: 1200, rights: Object.fromEntries(RIGHTS_LIST.map(r => [r.key, true])) },
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

const tabsList: { id: DetailTab; label: string; icon: typeof Shield }[] = [
  { id: "ranks", label: "Ränge", icon: Shield },
  { id: "shop", label: "Shop", icon: ShoppingCart },
  { id: "vehicles", label: "Fahrzeuge", icon: Car },
  { id: "markers", label: "Marker", icon: MapPin },
  { id: "settings", label: "Sonstige", icon: Settings },
];

const FactionDetailView = ({ factionLabel, onBack }: FactionDetailProps) => {
  const [activeTab, setActiveTab] = useState<DetailTab>("ranks");
  const [ranks, setRanks] = useState<Rank[]>(initialRanks);

  // ─── Rank Create/Edit Modal ───
  const [rankModalOpen, setRankModalOpen] = useState(false);
  const [editingRank, setEditingRank] = useState<Rank | null>(null);
  const [rankLabel, setRankLabel] = useState("");
  const [rankName, setRankName] = useState("");
  const [rankGrade, setRankGrade] = useState(0);
  const [rankSalary, setRankSalary] = useState(0);

  // ─── Rights Modal ───
  const [rightsModalOpen, setRightsModalOpen] = useState(false);
  const [rightsRank, setRightsRank] = useState<Rank | null>(null);
  const [rightsState, setRightsState] = useState<Record<string, boolean>>({});

  const openCreateRank = () => {
    setEditingRank(null);
    setRankLabel("");
    setRankName("");
    setRankGrade(ranks.length > 0 ? Math.max(...ranks.map(r => r.grade)) + 1 : 0);
    setRankSalary(0);
    setRankModalOpen(true);
  };

  const openEditRank = (rank: Rank) => {
    setEditingRank(rank);
    setRankLabel(rank.label);
    setRankName(rank.name);
    setRankGrade(rank.grade);
    setRankSalary(rank.salary);
    setRankModalOpen(true);
  };

  const openRightsModal = (rank: Rank) => {
    setRightsRank(rank);
    setRightsState({ ...rank.rights });
    setRightsModalOpen(true);
  };

  const handleSaveRank = () => {
    if (!rankLabel.trim() || !rankName.trim()) return;
    if (editingRank) {
      setRanks(prev => prev.map(r => r.id === editingRank.id ? { ...r, label: rankLabel, name: rankName, grade: rankGrade, salary: rankSalary } : r));
    } else {
      const newId = ranks.length > 0 ? Math.max(...ranks.map(r => r.id)) + 1 : 1;
      setRanks(prev => [...prev, { id: newId, label: rankLabel, name: rankName, grade: rankGrade, salary: rankSalary, rights: {} }]);
    }
    setRankModalOpen(false);
  };

  const handleSaveRights = () => {
    if (!rightsRank) return;
    setRanks(prev => prev.map(r => r.id === rightsRank.id ? { ...r, rights: { ...rightsState } } : r));
    setRightsModalOpen(false);
  };

  const handleDeleteRank = (id: number) => {
    setRanks(prev => prev.filter(r => r.id !== id));
  };

  const handleNameInput = (val: string) => {
    setRankName(val.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""));
  };

  const activeRightsCount = Object.values(rightsState).filter(Boolean).length;

  return (
    <div className="ginshi_section ginshi_section_tabbed">
      {/* Toolbar */}
      <div className="ginshi_detail_toolbar">
        <button onClick={onBack} className="ginshi_btn_info" style={{ flexShrink: 0 }}>
          <ArrowLeft size={13} />
          Zurück
        </button>

        <div className="ginshi_tab_bar" style={{ flex: 1, justifyContent: "center" }}>
          {tabsList.map((tab) => {
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
          <button className="ginshi_btn_primary" style={{ flexShrink: 0 }} onClick={openCreateRank}>
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
          — {tabsList.find((t) => t.id === activeTab)?.label} verwalten
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
            {ranks.map((rank) => (
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
                  <button title="Bearbeiten" className="ginshi_action_btn ginshi_action_btn_warning" onClick={() => openEditRank(rank)}>
                    <Pencil size={12} />
                  </button>
                  <button title="Rechte" className="ginshi_action_btn ginshi_action_btn_success" onClick={() => openRightsModal(rank)}>
                    <Users size={12} />
                  </button>
                  <button title="Löschen" className="ginshi_action_btn ginshi_action_btn_danger" onClick={() => handleDeleteRank(rank.id)}>
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
                  <div className={`ginshi_status_badge ${item.type === "weapon" ? "ginshi_status_badge_on" : "ginshi_status_badge_off"}`} style={{ display: "inline-flex" }}>
                    {item.type === "weapon" ? "Waffe" : "Item"}
                  </div>
                </div>
                <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "hsl(var(--foreground))" }}>{item.model}</span>
                <span style={{ textAlign: "center", fontWeight: 700, color: "hsl(var(--primary))" }}>${item.price}</span>
                <div className="ginshi_table_actions">
                  <button title="Löschen" className="ginshi_action_btn ginshi_action_btn_danger"><Trash2 size={10} /></button>
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
                <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "hsl(var(--foreground))" }}>{veh.model}</span>
                <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{veh.label}</span>
                <div style={{ textAlign: "center" }}>
                  <div className="ginshi_status_badge ginshi_status_badge_off" style={{ display: "inline-flex" }}>
                    {veh.type === "car" ? "Auto" : veh.type === "air" ? "Heli" : "Boot"}
                  </div>
                </div>
                <span style={{ textAlign: "center", fontWeight: 700, color: "hsl(var(--primary))" }}>${veh.price}</span>
                <div className="ginshi_table_actions">
                  <button title="Löschen" className="ginshi_action_btn ginshi_action_btn_danger"><Trash2 size={10} /></button>
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
                  <div className="ginshi_status_badge ginshi_status_badge_on" style={{ display: "inline-flex" }}>{marker.type}</div>
                </div>
                <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{marker.name}</span>
                <span style={{ textAlign: "center", fontFamily: "monospace", fontSize: "0.82rem", color: "hsl(var(--muted-foreground))" }}>{marker.x}</span>
                <span style={{ textAlign: "center", fontFamily: "monospace", fontSize: "0.82rem", color: "hsl(var(--muted-foreground))" }}>{marker.y}</span>
                <span style={{ textAlign: "center", fontFamily: "monospace", fontSize: "0.82rem", color: "hsl(var(--muted-foreground))" }}>{marker.z}</span>
                <div className="ginshi_table_actions">
                  <button title="Bearbeiten" className="ginshi_action_btn ginshi_action_btn_warning"><Pencil size={12} /></button>
                  <button title="Löschen" className="ginshi_action_btn ginshi_action_btn_danger"><Trash2 size={10} /></button>
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

      {/* ═══ Rank Create/Edit Modal ═══ */}
      <Dialog open={rankModalOpen} onOpenChange={setRankModalOpen}>
        <DialogContent className="ginshi_modal" style={{ maxWidth: 420 }}>
          <DialogTitle className="sr-only">
            {editingRank ? "Rang bearbeiten" : "Rang hinzufügen"}
          </DialogTitle>

          <div className="ginshi_modal_header">
            <div className="ginshi_accent_bar" />
            <span className="ginshi_modal_title">
              {editingRank ? (
                <>Rang bearbeiten: <span>{editingRank.label}</span></>
              ) : (
                "Rang hinzufügen"
              )}
            </span>
            <div className="ginshi_modal_spacer" />
            <button onClick={() => setRankModalOpen(false)} className="ginshi_modal_close">
              <X />
            </button>
          </div>

          <div className="ginshi_modal_body" style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <div className="ginshi_form_group">
              <label className="ginshi_form_label">Anzeigename</label>
              <input
                type="text"
                className="ginshi_form_input"
                placeholder="z.B. Officer"
                value={rankLabel}
                onChange={(e) => setRankLabel(e.target.value)}
              />
            </div>
            <div className="ginshi_form_group">
              <label className="ginshi_form_label">Name</label>
              <input
                type="text"
                className="ginshi_form_input"
                placeholder="z.B. officer (klein, keine Leerzeichen)"
                value={rankName}
                onChange={(e) => handleNameInput(e.target.value)}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
              <div className="ginshi_form_group">
                <label className="ginshi_form_label">Grad</label>
                <input
                  type="number"
                  className="ginshi_form_input"
                  min={0}
                  value={rankGrade}
                  onChange={(e) => setRankGrade(Number(e.target.value))}
                />
              </div>
              <div className="ginshi_form_group">
                <label className="ginshi_form_label">Gehalt ($)</label>
                <input
                  type="number"
                  className="ginshi_form_input"
                  min={0}
                  value={rankSalary}
                  onChange={(e) => setRankSalary(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="ginshi_modal_actions">
            <button onClick={handleSaveRank} className="ginshi_btn_primary" style={{ flex: 1 }}>
              {editingRank ? "Speichern" : "Hinzufügen"}
            </button>
            <button onClick={() => setRankModalOpen(false)} className="ginshi_btn_info" style={{ flex: 1 }}>
              Abbrechen
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══ Rights Modal ═══ */}
      <Dialog open={rightsModalOpen} onOpenChange={setRightsModalOpen}>
        <DialogContent className="ginshi_modal ginshi_modal_md">
          <DialogTitle className="sr-only">
            Rechte: {rightsRank?.label}
          </DialogTitle>

          <div className="ginshi_modal_header">
            <div className="ginshi_accent_bar" />
            <span className="ginshi_modal_title">
              Rechte: <span>{rightsRank?.label}</span>
            </span>
            <div className="ginshi_modal_spacer" />
            <div className="ginshi_rights_counter">
              {activeRightsCount}/{RIGHTS_LIST.length}
            </div>
            <button onClick={() => setRightsModalOpen(false)} className="ginshi_modal_close">
              <X />
            </button>
          </div>

          <div className="ginshi_modal_body" style={{ padding: "0.75rem 1.25rem 1rem" }}>
            <div className="ginshi_toggle_list">
              {RIGHTS_LIST.map((right) => {
                const active = !!rightsState[right.key];
                return (
                  <button
                    key={right.key}
                    className={`ginshi_toggle_item ${active ? "ginshi_toggle_item_active" : ""}`}
                    onClick={() => setRightsState(prev => ({ ...prev, [right.key]: !prev[right.key] }))}
                  >
                    <div className={`ginshi_toggle_switch ${active ? "ginshi_toggle_switch_on" : ""}`}>
                      <div className="ginshi_toggle_knob">
                        {active && <Check size={8} strokeWidth={3} />}
                      </div>
                    </div>
                    <span className="ginshi_toggle_label">{right.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="ginshi_modal_actions">
            <button onClick={handleSaveRights} className="ginshi_btn_primary" style={{ flex: 1 }}>
              Speichern
            </button>
            <button onClick={() => setRightsModalOpen(false)} className="ginshi_btn_info" style={{ flex: 1 }}>
              Abbrechen
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FactionDetailView;
