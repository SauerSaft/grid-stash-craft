import { useEffect, useMemo, useRef, useState } from "react";
import {
  Ban,
  Search,
  X,
  Hash,
  Calendar,
  ShieldCheck,
  UserRound,
  Fingerprint,
  Pencil,
  RotateCcw,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

type BanStatus = "active" | "lifted" | "expired";

interface BanEntry {
  id: number;
  player: string;
  sourceId: number;
  identifier: string;
  steam: string;
  reason: string;
  detail: string;
  admin: string;
  date: string;
  expires: string;
  status: BanStatus;
  evidence: string;
}

const mockBans: BanEntry[] = [
  {
    id: 482,
    player: "Erik Brandt",
    sourceId: 92,
    identifier: "license:bb1100ee3322...",
    steam: "steam:110000122110099",
    reason: "Aimbot",
    detail: "Eindeutiger Aimbot in mehreren Clips beim Würfelpark-Shootout.",
    admin: "Kira S.",
    date: "27.04.2026 19:42",
    expires: "Permanent",
    status: "active",
    evidence: "Clip #c-9982",
  },
  {
    id: 481,
    player: "Tom Vasquez",
    sourceId: 17,
    identifier: "license:eeff2233aa11...",
    steam: "steam:110000139482710",
    reason: "Mehrfaches RDM",
    detail: "5+ RDM-Vorfälle innerhalb 30 Minuten am Pier.",
    admin: "Marek H.",
    date: "26.04.2026 23:11",
    expires: "10.05.2026",
    status: "active",
    evidence: "Ticket #119",
  },
  {
    id: 478,
    player: "Mika Carter",
    sourceId: 39,
    identifier: "license:e22c0fa8...",
    steam: "steam:110000122334455",
    reason: "Cheat-Verdacht",
    detail: "Verdacht entkräftet, Ban wurde nach Review aufgehoben.",
    admin: "Tomek R.",
    date: "11.02.2026 14:00",
    expires: "—",
    status: "lifted",
    evidence: "Review #r-441",
  },
  {
    id: 470,
    player: "Sven Krüger",
    sourceId: 0,
    identifier: "license:9911aabb44...",
    steam: "steam:110000177889900",
    reason: "Toxic Behaviour",
    detail: "Wiederholte verbale Übergriffe gegen Mitspieler im Voice.",
    admin: "Kira S.",
    date: "08.01.2026 22:30",
    expires: "08.02.2026",
    status: "expired",
    evidence: "Ticket #088",
  },
  {
    id: 462,
    player: "Lia Sommer",
    sourceId: 0,
    identifier: "license:7711aa88cc22...",
    steam: "steam:110000133445566",
    reason: "Exploit",
    detail: "Money-Exploit im ATM-System ausgenutzt.",
    admin: "Admin Team",
    date: "20.12.2025 02:14",
    expires: "Permanent",
    status: "active",
    evidence: "Logs #lg-7712",
  },
];

type FilterKey = "all" | "active" | "lifted" | "expired";

const filterTabs: { id: FilterKey; label: string; icon: typeof Ban }[] = [
  { id: "all", label: "Alle", icon: Ban },
  { id: "active", label: "Aktiv", icon: AlertCircle },
  { id: "lifted", label: "Aufgehoben", icon: RotateCcw },
  { id: "expired", label: "Abgelaufen", icon: Clock },
];

const statusMap: Record<BanStatus, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  active: { label: "Aktiv", cls: "ginshi_inline_badge_destructive", icon: AlertCircle },
  lifted: { label: "Aufgehoben", cls: "ginshi_inline_badge_success", icon: CheckCircle2 },
  expired: { label: "Abgelaufen", cls: "ginshi_inline_badge_primary", icon: Clock },
};

const StatusBadge = ({ status }: { status: BanStatus }) => {
  const s = statusMap[status];
  const Icon = s.icon;
  return (
    <span className={`ginshi_inline_badge ${s.cls}`}>
      <Icon size={10} />
      {s.label}
    </span>
  );
};

const BansPage = () => {
  const [bans] = useState<BanEntry[]>(mockBans);
  const [selectedId, setSelectedId] = useState<number>(mockBans[0].id);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bans.filter((b) => {
      if (filter !== "all" && b.status !== filter) return false;
      if (!q) return true;
      return (
        b.player.toLowerCase().includes(q) ||
        String(b.id).includes(q) ||
        b.identifier.toLowerCase().includes(q) ||
        b.reason.toLowerCase().includes(q) ||
        b.admin.toLowerCase().includes(q)
      );
    });
  }, [bans, query, filter]);

  const selected = bans.find((b) => b.id === selectedId) ?? filtered[0] ?? bans[0];
  const activeCount = bans.filter((b) => b.status === "active").length;

  return (
    <div className="ginshi_section">
      <div className="ginshi_section_header">
        <div className="ginshi_section_header_icon">
          <Ban size={14} />
        </div>
        <div className="ginshi_section_header_content">
          <span className="ginshi_section_header_title">Bannliste</span>
          <span className="ginshi_section_header_subtitle">
            Übersicht aller Bans, Reviews und ablaufender Sperren
          </span>
        </div>
        <div className="ginshi_section_header_badges">
          <div className="ginshi_badge">
            <Ban size={10} className="ginshi_badge_icon" />
            <span className="ginshi_badge_value">{bans.length} gesamt</span>
          </div>
          <div className="ginshi_badge_online">
            <AlertCircle size={10} className="ginshi_badge_online_dot ginshi_icon_destructive" />
            <span className="ginshi_badge_online_text">{activeCount} aktiv</span>
          </div>
        </div>
      </div>

      <div className="support_layout bans_layout">
        {/* LEFT */}
        <div className="support_list_panel">
          <div className="logs_search_wrap">
            <Search size={14} className="logs_search_icon" />
            <input
              className="logs_search_input"
              placeholder="Spieler, Grund, Admin oder ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="logs_search_clear" onClick={() => setQuery("")}>
                <X size={11} />
              </button>
            )}
          </div>

          <div className="bans_filter_row">
            <select
              className="bans_filter_select"
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterKey)}
            >
              {filterTabs.map((t) => {
                const count =
                  t.id === "all" ? bans.length : bans.filter((b) => b.status === t.id).length;
                return (
                  <option key={t.id} value={t.id}>
                    {t.label} ({count})
                  </option>
                );
              })}
            </select>
            <span className="bans_filter_count">
              <Ban size={11} />
              {filtered.length}
            </span>
          </div>

          <div className="support_ticket_list">
            {filtered.map((b) => {
              const isActive = b.id === selected?.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedId(b.id)}
                  className={`support_ticket_card ${isActive ? "support_ticket_card_active" : ""}`}
                >
                  <div className="support_ticket_meta">
                    <span className="support_ticket_id">
                      <Hash size={10} />
                      Ban #{b.id}
                    </span>
                    <span className="support_ticket_src">
                      <Calendar size={10} /> {b.date.split(" ")[0]}
                    </span>
                  </div>
                  <div className="support_ticket_name">{b.player}</div>
                  <div className="support_ticket_reason">{b.reason} — {b.detail}</div>
                  <div className="support_ticket_footer">
                    <StatusBadge status={b.status} />
                    <span className="support_ticket_supporter">
                      <ShieldCheck size={10} />
                      {b.admin}
                    </span>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="support_empty">
                <Ban size={20} />
                <span>Keine Bans gefunden</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        {selected && (
          <div className="support_detail_panel">
            <div className="support_detail_head">
              <div className="support_detail_head_main">
                <div className="support_detail_title">
                  Ban #{selected.id}
                  <span className="support_detail_srcid">{selected.player}</span>
                </div>
                <div className="support_detail_sub">
                  {selected.identifier} · {selected.steam}
                </div>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="support_quick_actions">
              <button className="ginshi_btn_primary">
                <UserRound size={13} /> Spielerprofil öffnen
              </button>
              <button className="ginshi_btn_info">
                <Pencil size={13} /> Bearbeiten
              </button>
              <button className="ginshi_btn_info">
                <Eye size={13} /> Beweise ansehen
              </button>
              {selected.status === "active" ? (
                <button className="ginshi_btn_success">
                  <RotateCcw size={13} /> Unban
                </button>
              ) : (
                <button className="ginshi_btn_destructive">
                  <Ban size={13} /> Re-Ban
                </button>
              )}
            </div>

            <div className="support_grid_2">
              <div className="support_box">
                <div className="support_box_head">
                  <Fingerprint size={12} />
                  <span>Spieler</span>
                </div>
                <div className="support_info_list">
                  <div className="support_info_row">
                    <span><UserRound size={11} /> Name</span>
                    <strong>{selected.player}</strong>
                  </div>
                  <div className="support_info_row">
                    <span><Hash size={11} /> Source ID</span>
                    <strong>{selected.sourceId || "—"}</strong>
                  </div>
                  <div className="support_info_row">
                    <span><Fingerprint size={11} /> License</span>
                    <strong>{selected.identifier}</strong>
                  </div>
                  <div className="support_info_row">
                    <span><Fingerprint size={11} /> Steam</span>
                    <strong>{selected.steam}</strong>
                  </div>
                </div>
              </div>

              <div className="support_box">
                <div className="support_box_head">
                  <ShieldCheck size={12} />
                  <span>Ban Info</span>
                </div>
                <div className="support_info_list">
                  <div className="support_info_row">
                    <span><AlertCircle size={11} /> Grund</span>
                    <strong>{selected.reason}</strong>
                  </div>
                  <div className="support_info_row">
                    <span><ShieldCheck size={11} /> Admin</span>
                    <strong>{selected.admin}</strong>
                  </div>
                  <div className="support_info_row">
                    <span><Calendar size={11} /> Erstellt</span>
                    <strong>{selected.date}</strong>
                  </div>
                  <div className="support_info_row">
                    <span><Clock size={11} /> Ablauf</span>
                    <strong>{selected.expires}</strong>
                  </div>
                  <div className="support_info_row">
                    <span><Eye size={11} /> Beweise</span>
                    <strong>{selected.evidence}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="support_box">
              <div className="support_box_head">
                <AlertCircle size={12} />
                <span>Beschreibung</span>
              </div>
              <div className="support_msg_text">{selected.detail}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BansPage;
