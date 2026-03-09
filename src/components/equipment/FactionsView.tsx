import { useState } from "react";
import { Users, Plus, Search, X, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import FactionDetailView from "./FactionDetailView";

interface Faction {
  id: string;
  label: string;
  name: string;
  type: "job" | "gang";
  ranks: number;
  markers: number;
}

const mockFactions: Faction[] = [
  { id: "1", label: "Los Santos Police", name: "police", type: "job", ranks: 5, markers: 3 },
  { id: "2", label: "Ballas Gang", name: "ballas", type: "gang", ranks: 4, markers: 2 },
  { id: "3", label: "Grove Street Families", name: "grove", type: "gang", ranks: 6, markers: 4 },
  { id: "4", label: "Los Santos Medical", name: "ambulance", type: "job", ranks: 5, markers: 3 },
  { id: "5", label: "Vagos", name: "vagos", type: "gang", ranks: 3, markers: 1 },
  { id: "6", label: "Mechaniker", name: "mechanic", type: "job", ranks: 4, markers: 2 },
];

const factionTypes = [
  { value: "", label: "-- Wählen --" },
  { value: "police", label: "Staatsfrak" },
  { value: "gang", label: "Badfrak" },
  { value: "neutral", label: "Neutral" },
  { value: "ambulance", label: "Medic" },
  { value: "mechanic", label: "Mechaniker" },
  { value: "tacticalmedic", label: "Tacticalmedic" },
];

const FactionsView = () => {
  const [factions] = useState(mockFactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState("");
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);

  const filtered = factions.filter(
    (f) =>
      f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    // placeholder
    setCreateOpen(false);
    setNewName("");
    setNewLabel("");
    setNewType("");
  };

  if (selectedFaction) {
    return (
      <FactionDetailView
        factionLabel={selectedFaction.label}
        factionName={selectedFaction.name}
        onBack={() => setSelectedFaction(null)}
      />
    );
  }

  return (
    <div className="ginshi_section">
      {/* Header */}
      <div className="ginshi_section_header">
        <div className="ginshi_section_header_icon">
          <Users size={14} />
        </div>
        <div className="ginshi_section_header_content">
          <span className="ginshi_section_header_title">Fraktions Verwaltung</span>
          <span className="ginshi_section_header_subtitle">Jobs und Fraktionen verwalten</span>
        </div>
        <div className="ginshi_section_header_badges">
          <div className="ginshi_badge">
            <Users size={10} className="ginshi_badge_icon" />
            <span className="ginshi_badge_value">{factions.length}</span>
          </div>
          <button className="ginshi_btn_primary" onClick={() => setCreateOpen(true)}>
            <Plus size={13} />
            <span>Fraktion Erstellen</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="logs_search_wrap">
        <Search size={12} className="logs_search_icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Nach Fraktionsnamen oder Label suchen…"
          className="logs_search_input"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="logs_search_clear">
            <X size={12} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="ginshi_table_wrapper">
        <div className="ginshi_table_scroll">
          <table className="ginshi_table">
            <thead className="ginshi_thead">
              <tr className="ginshi_tr_head">
                <th className="ginshi_th">Job Label</th>
                <th className="ginshi_th">Job Name</th>
                <th className="ginshi_th">Typ</th>
                <th className="ginshi_th ginshi_th_center">Ränge</th>
                <th className="ginshi_th ginshi_th_center">Marker</th>
                <th className="ginshi_th ginshi_th_right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="ginshi_tbody">
              {filtered.map((faction) => (
                <tr key={faction.id} className="ginshi_tr">
                  <td className="ginshi_td">
                    <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>
                      {faction.label}
                    </span>
                  </td>
                  <td className="ginshi_td">
                    <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "hsl(var(--muted-foreground))" }}>
                      {faction.name}
                    </span>
                  </td>
                  <td className="ginshi_td">
                    <div
                      className={
                        faction.type === "job"
                          ? "ginshi_status_badge ginshi_status_badge_on"
                          : "ginshi_status_badge ginshi_status_badge_off"
                      }
                      style={{ display: "inline-flex" }}
                    >
                      {faction.type}
                    </div>
                  </td>
                  <td className="ginshi_td ginshi_td_center">
                    <span style={{ fontWeight: 700, color: "hsl(var(--foreground))" }}>
                      {faction.ranks}
                    </span>
                  </td>
                  <td className="ginshi_td ginshi_td_center">
                    <span style={{ fontWeight: 700, color: "hsl(var(--foreground))" }}>
                      {faction.markers}
                    </span>
                  </td>
                  <td className="ginshi_td">
                    <div className="ginshi_table_actions">
                      <button title="Details" className="ginshi_action_btn ginshi_action_btn_warning" onClick={() => setSelectedFaction(faction)}>
                        <Eye size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr className="ginshi_tr">
                  <td className="ginshi_td" colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "hsl(var(--muted-foreground))" }}>
                    Keine Fraktionen gefunden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="ginshi_modal" style={{ maxWidth: 420 }}>
          <DialogTitle className="sr-only">Fraktion erstellen</DialogTitle>

          <div className="ginshi_modal_header">
            <div className="ginshi_accent_bar" />
            <span className="ginshi_modal_title">Fraktion erstellen</span>
            <div className="ginshi_modal_spacer" />
            <button onClick={() => setCreateOpen(false)} className="ginshi_modal_close">
              <X />
            </button>
          </div>

          <div className="ginshi_modal_body" style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <div className="ginshi_form_group">
              <label className="ginshi_form_label">Job Name</label>
              <input
                type="text"
                className="ginshi_form_input"
                placeholder="z.B. police"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="ginshi_form_group">
              <label className="ginshi_form_label">Job Label</label>
              <input
                type="text"
                className="ginshi_form_input"
                placeholder="z.B. Los Santos Police Department"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>
            <div className="ginshi_form_group">
              <label className="ginshi_form_label">Typ</label>
              <select
                className="ginshi_form_select"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
              >
                {factionTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="ginshi_modal_actions">
            <button onClick={handleCreate} className="ginshi_btn_primary" style={{ flex: 1 }}>
              Erstellen
            </button>
            <button onClick={() => setCreateOpen(false)} className="ginshi_btn_destructive" style={{ flex: 1 }}>
              Abbrechen
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FactionsView;
