import { useState } from "react";
import { Layers, Play, Info, X, Package, ShoppingCart, Shield, Warehouse, ChevronDown } from "lucide-react";

type ActionSource = "fraklager" | "waffenkammer" | "item-shop" | "waffen-shop";

interface LoadoutAction {
  source: ActionSource;
  item: string;
  amount: number;
}

interface Loadout {
  id: string;
  name: string;
  description: string;
  actions: LoadoutAction[];
}

const mockLoadouts: Loadout[] = [
  {
    id: "1",
    name: "Daily Equip",
    description: "Standard-Ausrüstung für den täglichen Dienst",
    actions: [
      { source: "fraklager", item: "Brot", amount: 5 },
      { source: "fraklager", item: "Wasser", amount: 5 },
      { source: "fraklager", item: "Verbandsmaterial", amount: 3 },
      { source: "fraklager", item: "Munition", amount: 20 },
      { source: "waffenkammer", item: "Pistole", amount: 1 },
      { source: "item-shop", item: "Handschellen", amount: 10 },
      { source: "waffen-shop", item: "Karabiner MK2", amount: 1 },
    ],
  },
  {
    id: "2",
    name: "Patrol Kit",
    description: "Leichte Ausrüstung für Streifendienst",
    actions: [
      { source: "fraklager", item: "Wasser", amount: 3 },
      { source: "fraklager", item: "Medikit", amount: 2 },
      { source: "waffenkammer", item: "Pistole", amount: 1 },
      { source: "item-shop", item: "Funkgerät", amount: 1 },
      { source: "item-shop", item: "Handschellen", amount: 5 },
    ],
  },
  {
    id: "3",
    name: "Heavy Response",
    description: "Schwere Ausrüstung für Einsätze mit hohem Risiko",
    actions: [
      { source: "fraklager", item: "Verbandsmaterial", amount: 5 },
      { source: "fraklager", item: "Munition", amount: 40 },
      { source: "fraklager", item: "Adrenalin", amount: 2 },
      { source: "waffenkammer", item: "Karabiner", amount: 1 },
      { source: "waffenkammer", item: "Pistole", amount: 1 },
      { source: "item-shop", item: "Schutzweste", amount: 1 },
      { source: "item-shop", item: "Medikit", amount: 3 },
      { source: "waffen-shop", item: "Karabiner MK2", amount: 1 },
    ],
  },
  {
    id: "4",
    name: "Medic Kit",
    description: "Sanitäter-Loadout mit Fokus auf Versorgung",
    actions: [
      { source: "fraklager", item: "Verbandsmaterial", amount: 10 },
      { source: "fraklager", item: "Medikit", amount: 5 },
      { source: "fraklager", item: "Adrenalin", amount: 3 },
      { source: "item-shop", item: "Medikit", amount: 5 },
      { source: "waffenkammer", item: "Pistole", amount: 1 },
    ],
  },
];

const sourceConfig: Record<ActionSource, { label: string; icon: typeof Package; colorClass: string }> = {
  "fraklager": { label: "Fraklager", icon: Warehouse, colorClass: "loadout_source_storage" },
  "waffenkammer": { label: "Waffenkammer", icon: Shield, colorClass: "loadout_source_armory" },
  "item-shop": { label: "Item Shop", icon: ShoppingCart, colorClass: "loadout_source_itemshop" },
  "waffen-shop": { label: "Waffen Shop", icon: ShoppingCart, colorClass: "loadout_source_weaponshop" },
};

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

const LoadoutsPage = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

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
            Erstelle Macros die mehrere Aktionen gleichzeitig ausführen
          </span>
        </div>
        <div className="ginshi_section_header_badges">
          <div className="ginshi_badge">
            <Layers size={10} className="ginshi_badge_icon" />
            <span className="ginshi_badge_value">{mockLoadouts.length} Loadouts</span>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="loadout_grid">
        {mockLoadouts.map((loadout) => {
          const isExpanded = expandedId === loadout.id;
          const grouped = groupBySource(loadout.actions);
          const totalItems = loadout.actions.reduce((s, a) => s + a.amount, 0);

          return (
            <div key={loadout.id} className={`loadout_card ${isExpanded ? "loadout_card_expanded" : ""}`}>
              {/* Card Header */}
              <div className="loadout_card_header">
                <div className="loadout_card_icon">
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
                          {items.map((item, i) => (
                            <div key={i} className="loadout_action_row">
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadoutsPage;
