import { useState } from "react";
import {
  Layers,
  Play,
  Info,
  X,
  ShoppingCart,
  Shield,
  Warehouse,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Users,
  User,
  Save,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// ─────────────────────────────────────────────────────────────
// Types & Config
// ─────────────────────────────────────────────────────────────

type ActionSource = "fraklager" | "waffenkammer" | "item-shop" | "waffen-shop";
type LoadoutOwner = "faction" | "personal";

interface LoadoutAction {
  id: string;
  source: ActionSource;
  item: string;
  amount: number;
}

interface Loadout {
  id: string;
  name: string;
  description: string;
  owner: LoadoutOwner;
  actions: LoadoutAction[];
}

// Limits
const MAX_LOADOUTS_PERSONAL = 5;
const MAX_ACTIONS_PER_LOADOUT = 10;

// Available items per source (for creation)
const availableItems: Record<ActionSource, string[]> = {
  "fraklager": ["Brot", "Wasser", "Verbandsmaterial", "Munition", "Medikit", "Adrenalin"],
  "waffenkammer": ["Pistole", "Karabiner", "SMG", "Schrotflinte"],
  "item-shop": ["Handschellen", "Funkgerät", "Schutzweste", "Medikit", "Taschenlampe", "Nagelbänder"],
  "waffen-shop": ["Karabiner MK2", "Pistole MK2", "Kampfgewehr"],
};

const sourceConfig: Record<ActionSource, { label: string; icon: typeof Warehouse; colorClass: string }> = {
  "fraklager": { label: "Fraklager", icon: Warehouse, colorClass: "loadout_source_storage" },
  "waffenkammer": { label: "Waffenkammer", icon: Shield, colorClass: "loadout_source_armory" },
  "item-shop": { label: "Item Shop", icon: ShoppingCart, colorClass: "loadout_source_itemshop" },
  "waffen-shop": { label: "Waffen Shop", icon: ShoppingCart, colorClass: "loadout_source_weaponshop" },
};

// ─────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────

const initialLoadouts: Loadout[] = [
  {
    id: "f1",
    name: "Standard Patrol",
    description: "Offizielle Fraktions-Ausrüstung für Streifendienst",
    owner: "faction",
    actions: [
      { id: "a1", source: "fraklager", item: "Wasser", amount: 3 },
      { id: "a2", source: "waffenkammer", item: "Pistole", amount: 1 },
      { id: "a3", source: "item-shop", item: "Handschellen", amount: 5 },
      { id: "a4", source: "item-shop", item: "Funkgerät", amount: 1 },
    ],
  },
  {
    id: "f2",
    name: "Heavy Response",
    description: "Schwere Ausrüstung für kritische Einsätze",
    owner: "faction",
    actions: [
      { id: "a5", source: "fraklager", item: "Verbandsmaterial", amount: 5 },
      { id: "a6", source: "fraklager", item: "Munition", amount: 40 },
      { id: "a7", source: "waffenkammer", item: "Karabiner", amount: 1 },
      { id: "a8", source: "item-shop", item: "Schutzweste", amount: 1 },
      { id: "a9", source: "waffen-shop", item: "Karabiner MK2", amount: 1 },
    ],
  },
  {
    id: "p1",
    name: "Mein Daily",
    description: "Meine persönliche tägliche Ausrüstung",
    owner: "personal",
    actions: [
      { id: "a10", source: "fraklager", item: "Brot", amount: 5 },
      { id: "a11", source: "fraklager", item: "Wasser", amount: 5 },
      { id: "a12", source: "waffenkammer", item: "Pistole", amount: 1 },
    ],
  },
  {
    id: "p2",
    name: "Medic Setup",
    description: "Für Sanitäter-Einsätze",
    owner: "personal",
    actions: [
      { id: "a13", source: "fraklager", item: "Verbandsmaterial", amount: 10 },
      { id: "a14", source: "fraklager", item: "Medikit", amount: 5 },
      { id: "a15", source: "item-shop", item: "Medikit", amount: 3 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const groupBySource = (actions: LoadoutAction[]) => {
  const groups: Record<ActionSource, LoadoutAction[]> = {
    "fraklager": [],
    "waffenkammer": [],
    "item-shop": [],
    "waffen-shop": [],
  };
  actions.forEach((a) => groups[a.source].push(a));
  return Object.entries(groups).filter(([, items]) => items.length > 0) as [ActionSource, LoadoutAction[]][];
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

const LoadoutsPage2 = () => {
  const [loadouts, setLoadouts] = useState<Loadout[]>(initialLoadouts);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "faction" | "personal">("all");

  // Editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingLoadout, setEditingLoadout] = useState<Loadout | null>(null);
  const [editorName, setEditorName] = useState("");
  const [editorDescription, setEditorDescription] = useState("");
  const [editorActions, setEditorActions] = useState<LoadoutAction[]>([]);

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const personalCount = loadouts.filter((l) => l.owner === "personal").length;
  const canCreatePersonal = personalCount < MAX_LOADOUTS_PERSONAL;

  const filteredLoadouts = loadouts.filter((l) => {
    if (activeTab === "faction") return l.owner === "faction";
    if (activeTab === "personal") return l.owner === "personal";
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // ───── Editor Functions ─────

  const openCreateEditor = () => {
    setEditingLoadout(null);
    setEditorName("");
    setEditorDescription("");
    setEditorActions([]);
    setEditorOpen(true);
  };

  const openEditEditor = (loadout: Loadout) => {
    setEditingLoadout(loadout);
    setEditorName(loadout.name);
    setEditorDescription(loadout.description);
    setEditorActions([...loadout.actions]);
    setEditorOpen(true);
  };

  const addAction = () => {
    if (editorActions.length >= MAX_ACTIONS_PER_LOADOUT) return;
    setEditorActions([
      ...editorActions,
      { id: generateId(), source: "fraklager", item: availableItems["fraklager"][0], amount: 1 },
    ]);
  };

  const updateAction = (id: string, field: keyof LoadoutAction, value: string | number) => {
    setEditorActions((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        if (field === "source") {
          const newSource = value as ActionSource;
          return { ...a, source: newSource, item: availableItems[newSource][0] };
        }
        return { ...a, [field]: value };
      })
    );
  };

  const removeAction = (id: string) => {
    setEditorActions((prev) => prev.filter((a) => a.id !== id));
  };

  const saveLoadout = () => {
    if (!editorName.trim() || editorActions.length === 0) return;

    if (editingLoadout) {
      // Update existing
      setLoadouts((prev) =>
        prev.map((l) =>
          l.id === editingLoadout.id
            ? { ...l, name: editorName, description: editorDescription, actions: editorActions }
            : l
        )
      );
    } else {
      // Create new personal
      const newLoadout: Loadout = {
        id: generateId(),
        name: editorName,
        description: editorDescription,
        owner: "personal",
        actions: editorActions,
      };
      setLoadouts((prev) => [...prev, newLoadout]);
    }
    setEditorOpen(false);
  };

  const deleteLoadout = (id: string) => {
    setLoadouts((prev) => prev.filter((l) => l.id !== id));
    setDeleteConfirm(null);
  };

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────

  return (
    <div className="ginshi_section">
      {/* Header */}
      <div className="ginshi_section_header">
        <div className="ginshi_section_header_icon">
          <Layers size={16} />
        </div>
        <div className="ginshi_section_header_content">
          <span className="ginshi_section_header_title">Loadouts</span>
          <span className="ginshi_section_header_subtitle">
            Fraktions- und persönliche Macros verwalten
          </span>
        </div>
        <div className="ginshi_section_header_badges">
          <div className="ginshi_badge">
            <Users size={10} className="ginshi_badge_icon" />
            <span className="ginshi_badge_value">
              {loadouts.filter((l) => l.owner === "faction").length} Fraktion
            </span>
          </div>
          <div className="ginshi_badge">
            <User size={10} className="ginshi_badge_icon" />
            <span className="ginshi_badge_value">
              {personalCount}/{MAX_LOADOUTS_PERSONAL} Eigene
            </span>
          </div>
        </div>
      </div>

      {/* Tabs & Create Button */}
      <div className="loadout2_toolbar">
        <div className="loadout2_tabs">
          <button
            className={`loadout2_tab ${activeTab === "all" ? "loadout2_tab_active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            Alle
          </button>
          <button
            className={`loadout2_tab ${activeTab === "faction" ? "loadout2_tab_active" : ""}`}
            onClick={() => setActiveTab("faction")}
          >
            <Users size={12} />
            Fraktion
          </button>
          <button
            className={`loadout2_tab ${activeTab === "personal" ? "loadout2_tab_active" : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            <User size={12} />
            Eigene
          </button>
        </div>

        <button
          className={`ginshi_btn_primary ${!canCreatePersonal ? "ginshi_btn_disabled" : ""}`}
          onClick={openCreateEditor}
          disabled={!canCreatePersonal}
          title={canCreatePersonal ? "Neues Loadout erstellen" : `Max. ${MAX_LOADOUTS_PERSONAL} eigene Loadouts`}
        >
          <Plus size={13} />
          Erstellen
        </button>
      </div>

      {/* Cards Grid */}
      <div className="loadout_grid">
        {filteredLoadouts.map((loadout) => {
          const isExpanded = expandedId === loadout.id;
          const grouped = groupBySource(loadout.actions);
          const totalItems = loadout.actions.reduce((s, a) => s + a.amount, 0);
          const isFaction = loadout.owner === "faction";

          return (
            <div
              key={loadout.id}
              className={`loadout_card ${isExpanded ? "loadout_card_expanded" : ""} ${
                isFaction ? "loadout_card_faction" : "loadout_card_personal"
              }`}
            >
              {/* Owner Badge */}
              <div className={`loadout2_owner_badge ${isFaction ? "loadout2_owner_faction" : "loadout2_owner_personal"}`}>
                {isFaction ? <Users size={10} /> : <User size={10} />}
                <span>{isFaction ? "Fraktion" : "Eigene"}</span>
              </div>

              {/* Card Header */}
              <div className="loadout_card_header">
                <div className={`loadout_card_icon ${isFaction ? "loadout_card_icon_faction" : ""}`}>
                  <Layers size={18} />
                </div>
                <div className="loadout_card_title_area">
                  <h3 className="loadout_card_name">{loadout.name}</h3>
                  <div className="loadout_card_meta">
                    <span className="loadout_card_meta_item">{loadout.actions.length} Aktionen</span>
                    <span className="loadout_card_meta_sep">·</span>
                    <span className="loadout_card_meta_item">{totalItems} Items</span>
                  </div>
                </div>
                <div className="loadout_card_actions">
                  {!isFaction && (
                    <>
                      <button
                        className="ginshi_action_btn ginshi_action_btn_warning"
                        onClick={() => openEditEditor(loadout)}
                        title="Bearbeiten"
                      >
                        <Pencil />
                      </button>
                      <button
                        className="ginshi_action_btn ginshi_action_btn_danger"
                        onClick={() => setDeleteConfirm(loadout.id)}
                        title="Löschen"
                      >
                        <Trash2 />
                      </button>
                    </>
                  )}
                  <button
                    className="ginshi_action_btn ginshi_action_btn_warning"
                    onClick={() => toggleExpand(loadout.id)}
                    title="Details"
                  >
                    {isExpanded ? <X /> : <Info />}
                  </button>
                  <button className="ginshi_btn_success ginshi_btn_sm" title="Ausführen">
                    <Play size={11} />
                    Ausführen
                  </button>
                </div>
              </div>

              {/* Expand Toggle Bar */}
              <button className="loadout_expand_bar" onClick={() => toggleExpand(loadout.id)}>
                <span className="loadout_expand_bar_text">{loadout.description}</span>
                <ChevronDown
                  size={14}
                  className={`loadout_expand_chevron ${isExpanded ? "loadout_expand_chevron_open" : ""}`}
                />
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="loadout_detail">
                  {grouped.map(([source, items]) => {
                    const config = sourceConfig[source];
                    const Icon = config.icon;
                    return (
                      <div key={source} className={`loadout_source_group ${config.colorClass}`}>
                        <div className="loadout_source_header">
                          <Icon size={13} />
                          <span>{config.label}</span>
                        </div>
                        <div className="loadout_source_items">
                          {items.map((item) => (
                            <div key={item.id} className="loadout_action_row">
                              <div className="loadout_action_dot" />
                              <span className="loadout_action_name">{item.item}</span>
                              <span className="loadout_action_amount">{item.amount}x</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Delete Confirm Overlay */}
              {deleteConfirm === loadout.id && (
                <div className="loadout2_delete_overlay">
                  <AlertCircle size={20} />
                  <span>Loadout löschen?</span>
                  <div className="loadout2_delete_btns">
                    <button className="ginshi_btn_destructive ginshi_btn_sm" onClick={() => deleteLoadout(loadout.id)}>
                      Ja, löschen
                    </button>
                    <button className="ginshi_btn_info ginshi_btn_sm" onClick={() => setDeleteConfirm(null)}>
                      Abbrechen
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredLoadouts.length === 0 && (
          <div className="loadout2_empty">
            <Layers size={32} />
            <span>Keine Loadouts in dieser Kategorie</span>
          </div>
        )}
      </div>

      {/* ─────── Editor Modal ─────── */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="loadout2_editor_dialog">
          <DialogHeader>
            <DialogTitle className="loadout2_editor_title">
              {editingLoadout ? "Loadout bearbeiten" : "Neues Loadout erstellen"}
            </DialogTitle>
            <DialogDescription className="loadout2_editor_subtitle">
              Max. {MAX_ACTIONS_PER_LOADOUT} Aktionen pro Loadout
            </DialogDescription>
          </DialogHeader>

          <div className="loadout2_editor_body">
            {/* Name & Description */}
            <div className="loadout2_editor_field">
              <label>Name</label>
              <input
                type="text"
                className="loadout2_editor_input"
                placeholder="z.B. Mein Daily Setup"
                value={editorName}
                onChange={(e) => setEditorName(e.target.value)}
                maxLength={30}
              />
            </div>
            <div className="loadout2_editor_field">
              <label>Beschreibung</label>
              <input
                type="text"
                className="loadout2_editor_input"
                placeholder="Optional: kurze Beschreibung"
                value={editorDescription}
                onChange={(e) => setEditorDescription(e.target.value)}
                maxLength={60}
              />
            </div>

            {/* Actions List */}
            <div className="loadout2_editor_actions_header">
              <span>Aktionen ({editorActions.length}/{MAX_ACTIONS_PER_LOADOUT})</span>
              <button
                className="ginshi_btn_primary ginshi_btn_sm"
                onClick={addAction}
                disabled={editorActions.length >= MAX_ACTIONS_PER_LOADOUT}
              >
                <Plus size={11} />
                Hinzufügen
              </button>
            </div>

            <div className="loadout2_editor_actions_list">
              {editorActions.map((action, idx) => {
                const srcConfig = sourceConfig[action.source];
                return (
                  <div key={action.id} className={`loadout2_editor_action_row ${srcConfig.colorClass}`}>
                    <span className="loadout2_editor_action_num">{idx + 1}</span>

                    <select
                      className="loadout2_editor_select loadout2_editor_select_source"
                      value={action.source}
                      onChange={(e) => updateAction(action.id, "source", e.target.value)}
                    >
                      {(Object.keys(sourceConfig) as ActionSource[]).map((src) => (
                        <option key={src} value={src}>
                          {sourceConfig[src].label}
                        </option>
                      ))}
                    </select>

                    <select
                      className="loadout2_editor_select loadout2_editor_select_item"
                      value={action.item}
                      onChange={(e) => updateAction(action.id, "item", e.target.value)}
                    >
                      {availableItems[action.source].map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      className="loadout2_editor_input loadout2_editor_input_amount"
                      min={1}
                      max={99}
                      value={action.amount}
                      onChange={(e) => updateAction(action.id, "amount", Math.max(1, parseInt(e.target.value) || 1))}
                    />

                    <button
                      className="ginshi_action_btn ginshi_action_btn_danger"
                      onClick={() => removeAction(action.id)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                );
              })}

              {editorActions.length === 0 && (
                <div className="loadout2_editor_empty">
                  <span>Noch keine Aktionen hinzugefügt</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="loadout2_editor_footer">
            <button className="ginshi_btn_info" onClick={() => setEditorOpen(false)}>
              Abbrechen
            </button>
            <button
              className="ginshi_btn_success"
              onClick={saveLoadout}
              disabled={!editorName.trim() || editorActions.length === 0}
            >
              <Save size={13} />
              Speichern
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoadoutsPage2;
