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
  AlertTriangle,
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
  label: string;
  amount: number;
  price: number;
  rankAccess?: string[];
}

interface Vehicle {
  id: number;
  model: string;
  label: string;
  type: "car" | "air" | "boat";
  price: number;
  rankAccess?: string[];
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
  { id: 2, label: "Rekrut", name: "trainee", grade: 1, salary: 150, rights: {} },
  { id: 3, label: "Officer", name: "officer", grade: 2, salary: 300, rights: { shop: true } },
  { id: 4, label: "Sergeant", name: "sergeant", grade: 3, salary: 500, rights: { shop: true, hire: true } },
  { id: 5, label: "Lieutenant", name: "lieutenant", grade: 4, salary: 800, rights: { shop: true, hire: true, promote: true } },
  { id: 6, label: "Captain", name: "captain", grade: 5, salary: 1200, rights: Object.fromEntries(RIGHTS_LIST.map(r => [r.key, true])) },
];

const mockShopItems: ShopItem[] = [
  { id: 1, type: "weapon", model: "WEAPON_PISTOL", label: "WEAPON_PISTOL", amount: 1, price: 500, rankAccess: ["trainee", "officer"] },
  { id: 2, type: "weapon", model: "WEAPON_CARBINERIFLE", label: "WEAPON_CARBINERIFLE", amount: 1, price: 2500, rankAccess: ["sergeant"] },
  { id: 3, type: "item", model: "vest", label: "Schutzweste", amount: 3, price: 800, rankAccess: [] },
  { id: 4, type: "item", model: "medikit", label: "Medikit", amount: 5, price: 200, rankAccess: ["trainee"] },
];

const mockVehicles: Vehicle[] = [
  { id: 1, model: "police", label: "Police Car", type: "car", price: 0, rankAccess: ["officer"] },
  { id: 2, model: "policeb", label: "Police Bike", type: "car", price: 0, rankAccess: ["sergeant"] },
  { id: 3, model: "polmav", label: "Police Maverick", type: "air", price: 0, rankAccess: ["lieutenant"] },
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
  const [shopItems, setShopItems] = useState<ShopItem[]>(mockShopItems);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);

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

  // ─── Delete Confirm (generic) ───
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "rank" | "shop" | "vehicle"; id: number; label: string } | null>(null);

  // ─── Shop Item Create/Edit Modal ───
  const [shopModalOpen, setShopModalOpen] = useState(false);
  const [editingShopItem, setEditingShopItem] = useState<ShopItem | null>(null);
  const [shopType, setShopType] = useState<"weapon" | "item">("weapon");
  const [shopModel, setShopModel] = useState("");
  const [shopItemName, setShopItemName] = useState("");
  const [shopItemLabel, setShopItemLabel] = useState("");
  const [shopAmount, setShopAmount] = useState(1);
  const [shopPrice, setShopPrice] = useState(0);

  // ─── Rank Access Modal (for shop items & vehicles) ───
  const [rankAccessModalOpen, setRankAccessModalOpen] = useState(false);
  const [rankAccessTarget, setRankAccessTarget] = useState<{ id: number; label: string; rankAccess?: string[]; source: "shop" | "vehicle" } | null>(null);
  const [rankAccessState, setRankAccessState] = useState<Record<string, boolean>>({});

  // ─── Vehicle Create/Edit Modal ───
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehModel, setVehModel] = useState("");
  const [vehLabel, setVehLabel] = useState("");
  const [vehType, setVehType] = useState<"car" | "air" | "boat">("car");
  const [vehPrice, setVehPrice] = useState(0);

  // ── Unique rank names ──
  const uniqueRankNames = [...new Set(ranks.map(r => r.name))];

  // ─── Rank handlers ───
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

  const handleNameInput = (val: string) => {
    setRankName(val.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""));
  };

  const activeRightsCount = Object.values(rightsState).filter(Boolean).length;

  // ─── Shop handlers ───
  const openCreateShopItem = () => {
    setEditingShopItem(null);
    setShopType("weapon");
    setShopModel("");
    setShopItemName("");
    setShopItemLabel("");
    setShopAmount(1);
    setShopPrice(0);
    setShopModalOpen(true);
  };

  const openEditShopItem = (item: ShopItem) => {
    setEditingShopItem(item);
    setShopType(item.type);
    setShopModel(item.model);
    setShopItemName(item.type === "item" ? item.model : "");
    setShopItemLabel(item.label);
    setShopAmount(item.amount);
    setShopPrice(item.price);
    setShopModalOpen(true);
  };

  const handleSaveShopItem = () => {
    const isWeapon = shopType === "weapon";
    const model = isWeapon ? shopModel : shopItemName;
    const label = isWeapon ? shopModel : shopItemLabel;
    const amount = isWeapon ? 1 : shopAmount;
    if (!model.trim()) return;

    if (editingShopItem) {
      setShopItems(prev => prev.map(i => i.id === editingShopItem.id ? { ...i, type: shopType, model, label, amount, price: shopPrice } : i));
    } else {
      const newId = shopItems.length > 0 ? Math.max(...shopItems.map(i => i.id)) + 1 : 1;
      setShopItems(prev => [...prev, { id: newId, type: shopType, model, label, amount, price: shopPrice, rankAccess: [] }]);
    }
    setShopModalOpen(false);
  };

  const openRankAccessModal = (source: "shop" | "vehicle", item: { id: number; label: string; rankAccess?: string[] }) => {
    setRankAccessTarget({ ...item, source });
    const state: Record<string, boolean> = {};
    uniqueRankNames.forEach(name => {
      state[name] = item.rankAccess?.includes(name) ?? false;
    });
    setRankAccessState(state);
    setRankAccessModalOpen(true);
  };

  const handleSaveRankAccess = () => {
    if (!rankAccessTarget) return;
    const access = Object.entries(rankAccessState).filter(([, v]) => v).map(([k]) => k);
    if (rankAccessTarget.source === "shop") {
      setShopItems(prev => prev.map(i => i.id === rankAccessTarget.id ? { ...i, rankAccess: access } : i));
    } else {
      setVehicles(prev => prev.map(v => v.id === rankAccessTarget.id ? { ...v, rankAccess: access } : v));
    }
    setRankAccessModalOpen(false);
  };

  // ─── Vehicle handlers ───
  const openCreateVehicle = () => {
    setEditingVehicle(null);
    setVehModel("");
    setVehLabel("");
    setVehType("car");
    setVehPrice(0);
    setVehicleModalOpen(true);
  };

  const openEditVehicle = (veh: Vehicle) => {
    setEditingVehicle(veh);
    setVehModel(veh.model);
    setVehLabel(veh.label);
    setVehType(veh.type);
    setVehPrice(veh.price);
    setVehicleModalOpen(true);
  };

  const handleSaveVehicle = () => {
    if (!vehModel.trim() || !vehLabel.trim()) return;
    if (editingVehicle) {
      setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? { ...v, model: vehModel, label: vehLabel, type: vehType, price: vehPrice } : v));
    } else {
      const newId = vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1;
      setVehicles(prev => [...prev, { id: newId, model: vehModel, label: vehLabel, type: vehType, price: vehPrice, rankAccess: [] }]);
    }
    setVehicleModalOpen(false);
  };

  // ─── Generic delete ───
  const handleDeleteRequest = (type: "rank" | "shop" | "vehicle", id: number, label: string) => {
    setDeleteTarget({ type, id, label });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "rank") {
      setRanks(prev => prev.filter(r => r.id !== deleteTarget.id));
    } else if (deleteTarget.type === "shop") {
      setShopItems(prev => prev.filter(i => i.id !== deleteTarget.id));
    } else if (deleteTarget.type === "vehicle") {
      setVehicles(prev => prev.filter(v => v.id !== deleteTarget.id));
    }
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
  };

  const activeRankAccessCount = Object.values(rankAccessState).filter(Boolean).length;

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
          <button className="ginshi_btn_primary" style={{ flexShrink: 0 }} onClick={openCreateShopItem}>
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
                  <button title="Löschen" className="ginshi_action_btn ginshi_action_btn_danger" onClick={() => handleDeleteRequest("rank", rank.id, rank.label)}>
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
            <span className="ginshi_grid_th">Anzeigename</span>
            <span className="ginshi_grid_th" style={{ textAlign: "center" }}>Anzahl</span>
            <span className="ginshi_grid_th" style={{ textAlign: "center" }}>Preis</span>
            <span className="ginshi_grid_th" style={{ textAlign: "right" }}>Aktionen</span>
          </div>
          <div className="ginshi_grid_tbody">
            {shopItems.map((item) => (
              <div key={item.id} className="ginshi_grid_row faction_shop_cols">
                <div>
                  <div className={`ginshi_status_badge ${item.type === "weapon" ? "ginshi_status_badge_on" : "ginshi_status_badge_off"}`} style={{ display: "inline-flex" }}>
                    {item.type === "weapon" ? "Waffe" : "Item"}
                  </div>
                </div>
                <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "hsl(var(--foreground))" }}>{item.model}</span>
                <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{item.label}</span>
                <span style={{ textAlign: "center", fontWeight: 700, color: "hsl(var(--foreground))" }}>{item.amount}x</span>
                <span style={{ textAlign: "center", fontWeight: 700, color: "hsl(var(--primary))" }}>${item.price}</span>
                <div className="ginshi_table_actions">
                  <button title="Bearbeiten" className="ginshi_action_btn ginshi_action_btn_warning" onClick={() => openEditShopItem(item)}>
                    <Pencil size={12} />
                  </button>
                  <button title="Rang Zugriff" className="ginshi_action_btn ginshi_action_btn_success" onClick={() => openRankAccessModal("shop", item)}>
                    <Users size={12} />
                  </button>
                  <button title="Löschen" className="ginshi_action_btn ginshi_action_btn_danger" onClick={() => handleDeleteRequest("shop", item.id, item.label)}>
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

      {/* ═══ Shop Item Create/Edit Modal ═══ */}
      <Dialog open={shopModalOpen} onOpenChange={setShopModalOpen}>
        <DialogContent className="ginshi_modal" style={{ maxWidth: 420 }}>
          <DialogTitle className="sr-only">
            {editingShopItem ? "Item bearbeiten" : "Item hinzufügen"}
          </DialogTitle>

          <div className="ginshi_modal_header">
            <div className="ginshi_accent_bar" />
            <span className="ginshi_modal_title">
              {editingShopItem ? (
                <>Item bearbeiten: <span>{editingShopItem.label}</span></>
              ) : (
                "Item hinzufügen"
              )}
            </span>
            <div className="ginshi_modal_spacer" />
            <button onClick={() => setShopModalOpen(false)} className="ginshi_modal_close">
              <X />
            </button>
          </div>

          <div className="ginshi_modal_body" style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <div className="ginshi_form_group">
              <label className="ginshi_form_label">Typ</label>
              <select
                className="ginshi_form_input ginshi_form_select"
                value={shopType}
                onChange={(e) => setShopType(e.target.value as "weapon" | "item")}
              >
                <option value="weapon">Waffe</option>
                <option value="item">Item</option>
              </select>
            </div>

            {shopType === "weapon" ? (
              <div className="ginshi_form_group">
                <label className="ginshi_form_label">Waffen Model</label>
                <input
                  type="text"
                  className="ginshi_form_input"
                  placeholder="WEAPON_PISTOL"
                  value={shopModel}
                  onChange={(e) => setShopModel(e.target.value)}
                />
              </div>
            ) : (
              <>
                <div className="ginshi_form_group">
                  <label className="ginshi_form_label">Item Name</label>
                  <input
                    type="text"
                    className="ginshi_form_input"
                    placeholder="phone"
                    value={shopItemName}
                    onChange={(e) => setShopItemName(e.target.value)}
                  />
                </div>
                <div className="ginshi_form_group">
                  <label className="ginshi_form_label">Label</label>
                  <input
                    type="text"
                    className="ginshi_form_input"
                    placeholder="Handy"
                    value={shopItemLabel}
                  onChange={(e) => setShopItemLabel(e.target.value)}
                />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                  <div className="ginshi_form_group">
                    <label className="ginshi_form_label">Anzahl</label>
                    <input
                      type="number"
                      className="ginshi_form_input"
                      min={1}
                      value={shopAmount}
                      onChange={(e) => setShopAmount(Number(e.target.value))}
                    />
                  </div>
                  <div className="ginshi_form_group">
                    <label className="ginshi_form_label">Preis</label>
                    <input
                      type="number"
                      className="ginshi_form_input"
                      min={0}
                      value={shopPrice}
                      onChange={(e) => setShopPrice(Number(e.target.value))}
                    />
                  </div>
                </div>
              </>
            )}

            {shopType === "weapon" && (
              <div className="ginshi_form_group">
                <label className="ginshi_form_label">Preis</label>
                <input
                  type="number"
                  className="ginshi_form_input"
                  min={0}
                  value={shopPrice}
                  onChange={(e) => setShopPrice(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          <div className="ginshi_modal_actions">
            <button onClick={handleSaveShopItem} className="ginshi_btn_primary" style={{ flex: 1 }}>
              {editingShopItem ? "Speichern" : "Hinzufügen"}
            </button>
            <button onClick={() => setShopModalOpen(false)} className="ginshi_btn_info" style={{ flex: 1 }}>
              Abbrechen
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══ Rank Access Modal ═══ */}
      <Dialog open={rankAccessModalOpen} onOpenChange={setRankAccessModalOpen}>
        <DialogContent className="ginshi_modal ginshi_modal_sm">
          <DialogTitle className="sr-only">
            Rang Zugriff: {rankAccessTarget?.label}
          </DialogTitle>

          <div className="ginshi_modal_header">
            <div className="ginshi_accent_bar" />
            <span className="ginshi_modal_title">
              Rang Zugriff: <span>{rankAccessTarget?.label}</span>
            </span>
            <div className="ginshi_modal_spacer" />
            <div className="ginshi_rights_counter">
              {activeRankAccessCount}/{uniqueRankNames.length}
            </div>
            <button onClick={() => setRankAccessModalOpen(false)} className="ginshi_modal_close">
              <X />
            </button>
          </div>

          <div className="ginshi_modal_body" style={{ padding: "0.75rem 1.25rem 1rem" }}>
            <div className="ginshi_checkbox_list">
              {uniqueRankNames.map((name) => {
                const active = !!rankAccessState[name];
                return (
                  <button
                    key={name}
                    className={`ginshi_checkbox_item ${active ? "ginshi_checkbox_item_active" : ""}`}
                    onClick={() => setRankAccessState(prev => ({ ...prev, [name]: !prev[name] }))}
                  >
                    <div className="ginshi_checkbox_box">
                      {active && <Check size={10} strokeWidth={3} />}
                    </div>
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="ginshi_modal_actions">
            <button onClick={handleSaveRankAccess} className="ginshi_btn_primary" style={{ flex: 1 }}>
              Speichern
            </button>
            <button onClick={() => setRankAccessModalOpen(false)} className="ginshi_btn_info" style={{ flex: 1 }}>
              Abbrechen
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══ Delete Confirm Dialog ═══ */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="ginshi_modal ginshi_modal_sm">
          <DialogTitle className="sr-only">Löschen bestätigen</DialogTitle>

          <div className="ginshi_confirm_body ginshi_confirm_danger">
            <div className="ginshi_confirm_icon_wrap">
              <AlertTriangle size={22} strokeWidth={2.5} />
            </div>
            <div className="ginshi_confirm_title">
              „{deleteTarget?.label}" löschen?
            </div>
            <p className="ginshi_confirm_desc">
              Bist du dir sicher? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
          </div>

          <div className="ginshi_confirm_actions">
            <button onClick={confirmDelete} className="ginshi_btn_danger" style={{ flex: 1 }}>
              <Trash2 size={12} />
              Löschen
            </button>
            <button onClick={() => setDeleteConfirmOpen(false)} className="ginshi_btn_info" style={{ flex: 1 }}>
              Abbrechen
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FactionDetailView;
