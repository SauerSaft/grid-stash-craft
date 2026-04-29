import { useMemo, useState } from "react";
import {
  Users,
  Search,
  X,
  Wifi,
  Briefcase,
  Hash,
  ShieldAlert,
  Ban,
  StickyNote,
  Wrench,
  UserRound,
  MapPin,
  Eye,
  Snowflake,
  HeartPulse,
  Send,
  Clock,
  Fingerprint,
  Calendar,
  Coins,
  CircleDot,
} from "lucide-react";

type PlayerStatus = "online" | "offline";

interface PlayerWarning {
  id: string;
  date: string;
  reason: string;
  admin: string;
}

interface PlayerBanRecord {
  id: string;
  date: string;
  reason: string;
  admin: string;
  active: boolean;
}

interface PlayerNote {
  id: string;
  date: string;
  text: string;
  admin: string;
}

interface Player {
  id: number;
  name: string;
  status: PlayerStatus;
  ping: number;
  job: string;
  identifier: string;
  steam: string;
  discord: string;
  joined: string;
  playtime: string;
  cash: number;
  bank: number;
  warnings: PlayerWarning[];
  bans: PlayerBanRecord[];
  notes: PlayerNote[];
}

const mockPlayers: Player[] = [
  {
    id: 51,
    name: "Nasser Almansouri",
    status: "online",
    ping: 42,
    job: "unemployed",
    identifier: "license:4d8a9f12c7e1...",
    steam: "steam:110000112345678",
    discord: "discord:284711902837465",
    joined: "12.01.2025",
    playtime: "182h",
    cash: 2400,
    bank: 18750,
    warnings: [
      { id: "w1", date: "12.04.2026", reason: "Leichtes RDM am Pier", admin: "Kira S." },
    ],
    bans: [],
    notes: [
      { id: "n1", date: "20.03.2026", text: "Fragt regelmäßig nach Fraktionsplätzen.", admin: "Marek H." },
    ],
  },
  {
    id: 18,
    name: "Shreya Mercy",
    status: "online",
    ping: 31,
    job: "mechanic",
    identifier: "license:9b1c33aa...",
    steam: "steam:110000198765432",
    discord: "discord:912348112093744",
    joined: "02.11.2024",
    playtime: "412h",
    cash: 800,
    bank: 92100,
    warnings: [],
    bans: [],
    notes: [],
  },
  {
    id: 72,
    name: "kazi maaz",
    status: "online",
    ping: 87,
    job: "unemployed",
    identifier: "license:771fab09...",
    steam: "steam:110000156473829",
    discord: "discord:730294857192034",
    joined: "18.07.2025",
    playtime: "94h",
    cash: 50,
    bank: 1200,
    warnings: [
      { id: "w1", date: "01.04.2026", reason: "RP-Verweigerung", admin: "Marek H." },
      { id: "w2", date: "10.04.2026", reason: "Hände nicht hochgenommen", admin: "Kira S." },
    ],
    bans: [],
    notes: [],
  },
  {
    id: 39,
    name: "Mika Carter",
    status: "online",
    ping: 54,
    job: "ems",
    identifier: "license:e22c0fa8...",
    steam: "steam:110000122334455",
    discord: "discord:556610293847261",
    joined: "05.06.2025",
    playtime: "238h",
    cash: 3100,
    bank: 41200,
    warnings: [],
    bans: [
      { id: "b1", date: "11.02.2026", reason: "Cheat-Verdacht (entkräftet)", admin: "Tomek R.", active: false },
    ],
    notes: [],
  },
  {
    id: 14,
    name: "Leon Vega",
    status: "offline",
    ping: 0,
    job: "police",
    identifier: "license:aa1110bb...",
    steam: "steam:110000133221100",
    discord: "discord:441029384756102",
    joined: "22.09.2024",
    playtime: "612h",
    cash: 5400,
    bank: 134000,
    warnings: [],
    bans: [],
    notes: [
      { id: "n1", date: "15.02.2026", text: "PD Lead Kandidat.", admin: "Admin Team" },
    ],
  },
  {
    id: 88,
    name: "Yuki Tanaka",
    status: "offline",
    ping: 0,
    job: "taxi",
    identifier: "license:bb22aa11...",
    steam: "steam:110000144556677",
    discord: "discord:998877665544332",
    joined: "30.12.2025",
    playtime: "47h",
    cash: 220,
    bank: 3100,
    warnings: [],
    bans: [],
    notes: [],
  },
];

type DetailTab = "overview" | "warnings" | "bans" | "notes";

const tabs: { id: DetailTab; label: string; icon: typeof UserRound }[] = [
  { id: "overview", label: "Übersicht", icon: UserRound },
  { id: "warnings", label: "Verwarnungen", icon: ShieldAlert },
  { id: "bans", label: "Bans", icon: Ban },
  { id: "notes", label: "Notizen", icon: StickyNote },
];

const PlayersPage = () => {
  const [players] = useState<Player[]>(mockPlayers);
  const [selectedId, setSelectedId] = useState<number>(mockPlayers[0].id);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<DetailTab>("overview");
  const [noteDraft, setNoteDraft] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return players;
    return players.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        String(p.id).includes(q) ||
        p.identifier.toLowerCase().includes(q) ||
        p.job.toLowerCase().includes(q),
    );
  }, [players, query]);

  const selected = players.find((p) => p.id === selectedId) ?? players[0];
  const onlineCount = players.filter((p) => p.status === "online").length;

  const StatusPill = ({ status }: { status: PlayerStatus }) => (
    <span
      className={`ginshi_inline_badge ${
        status === "online" ? "ginshi_inline_badge_success" : "ginshi_inline_badge_destructive"
      }`}
    >
      <CircleDot size={10} />
      {status === "online" ? "Online" : "Offline"}
    </span>
  );

  return (
    <div className="ginshi_section">
      <div className="ginshi_section_header">
        <div className="ginshi_section_header_icon">
          <Users size={14} />
        </div>
        <div className="ginshi_section_header_content">
          <span className="ginshi_section_header_title">Spieler</span>
          <span className="ginshi_section_header_subtitle">
            Suche, inspiziere und verwalte alle Spieler des Servers
          </span>
        </div>
        <div className="ginshi_section_header_badges">
          <div className="ginshi_badge">
            <Users size={10} className="ginshi_badge_icon" />
            <span className="ginshi_badge_value">{players.length} gesamt</span>
          </div>
          <div className="ginshi_badge_online">
            <CircleDot size={8} className="ginshi_badge_online_dot" />
            <span className="ginshi_badge_online_text">{onlineCount} online</span>
          </div>
        </div>
      </div>

      <div className="support_layout">
        {/* LEFT */}
        <div className="support_list_panel">
          <div className="logs_search_wrap">
            <Search size={14} className="logs_search_icon" />
            <input
              className="logs_search_input"
              placeholder="Spieler, ID, Job oder Identifier..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="logs_search_clear" onClick={() => setQuery("")}>
                <X size={11} />
              </button>
            )}
          </div>

          <div className="support_ticket_list">
            {filtered.map((p) => {
              const isActive = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(p.id);
                    setTab("overview");
                  }}
                  className={`support_ticket_card ${isActive ? "support_ticket_card_active" : ""}`}
                >
                  <div className="support_ticket_meta">
                    <span className="support_ticket_id">
                      <Hash size={10} />
                      ID {p.id}
                    </span>
                    <span className="support_ticket_src">
                      <Wifi size={10} /> {p.status === "online" ? `${p.ping}ms` : "—"}
                    </span>
                  </div>
                  <div className="support_ticket_name">{p.name}</div>
                  <div className="support_ticket_reason">
                    {p.identifier}
                  </div>
                  <div className="support_ticket_footer">
                    <StatusPill status={p.status} />
                    <span className="support_ticket_supporter">
                      <Briefcase size={10} />
                      {p.job}
                    </span>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="support_empty">
                <Users size={20} />
                <span>Keine Spieler gefunden</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="support_detail_panel">
          <div className="support_detail_head">
            <div className="support_detail_head_main">
              <div className="support_detail_title">
                {selected.name}
                <span className="support_detail_srcid">[{selected.id}]</span>
              </div>
              <div className="support_detail_sub">
                {selected.identifier} · {selected.steam} · {selected.discord}
              </div>
            </div>
            <StatusPill status={selected.status} />
          </div>

          <div className="support_quick_actions">
            <button className="ginshi_btn_primary">
              <MapPin size={13} /> Goto
            </button>
            <button className="ginshi_btn_primary">
              <UserRound size={13} /> Bring
            </button>
            <button className="ginshi_btn_info">
              <Eye size={13} /> Spectate
            </button>
            <button className="ginshi_btn_info">
              <Snowflake size={13} /> Freeze
            </button>
            <button className="ginshi_btn_success">
              <HeartPulse size={13} /> Revive
            </button>
            <button className="ginshi_btn_destructive">
              <Wrench size={13} /> Kick
            </button>
            <button className="ginshi_btn_destructive">
              <Ban size={13} /> Bannen
            </button>
          </div>

          {/* Tabs */}
          <div className="ginshi_tab_bar">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              const count =
                t.id === "warnings"
                  ? selected.warnings.length
                  : t.id === "bans"
                  ? selected.bans.length
                  : t.id === "notes"
                  ? selected.notes.length
                  : null;
              return (
                <button
                  key={t.id}
                  className={`ginshi_tab ${isActive ? "ginshi_tab_active" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  <Icon size={14} />
                  {t.label}
                  {count !== null && (
                    <span
                      className={`ginshi_tab_count ${
                        isActive ? "ginshi_tab_count_active" : "ginshi_tab_count_inactive"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {tab === "overview" && (
            <div className="support_grid_2">
              <div className="support_box">
                <div className="support_box_head">
                  <Fingerprint size={12} />
                  <span>Stammdaten</span>
                </div>
                <div className="support_info_list">
                  <div className="support_info_row">
                    <span><Hash size={11} /> Source ID</span>
                    <strong>{selected.id}</strong>
                  </div>
                  <div className="support_info_row">
                    <span><Briefcase size={11} /> Job</span>
                    <strong>{selected.job}</strong>
                  </div>
                  <div className="support_info_row">
                    <span><Wifi size={11} /> Ping</span>
                    <strong>{selected.status === "online" ? `${selected.ping} ms` : "—"}</strong>
                  </div>
                  <div className="support_info_row">
                    <span><Calendar size={11} /> Beigetreten</span>
                    <strong>{selected.joined}</strong>
                  </div>
                  <div className="support_info_row">
                    <span><Clock size={11} /> Spielzeit</span>
                    <strong>{selected.playtime}</strong>
                  </div>
                </div>
              </div>

              <div className="support_box">
                <div className="support_box_head">
                  <Coins size={12} />
                  <span>Wirtschaft & Identität</span>
                </div>
                <div className="support_info_list">
                  <div className="support_info_row">
                    <span><Coins size={11} /> Bargeld</span>
                    <strong>${selected.cash.toLocaleString("de-DE")}</strong>
                  </div>
                  <div className="support_info_row">
                    <span><Coins size={11} /> Bank</span>
                    <strong>${selected.bank.toLocaleString("de-DE")}</strong>
                  </div>
                  <div className="support_info_row">
                    <span><Fingerprint size={11} /> License</span>
                    <strong>{selected.identifier}</strong>
                  </div>
                  <div className="support_info_row">
                    <span><Fingerprint size={11} /> Steam</span>
                    <strong>{selected.steam}</strong>
                  </div>
                  <div className="support_info_row">
                    <span><Fingerprint size={11} /> Discord</span>
                    <strong>{selected.discord}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "warnings" && (
            <div className="support_box">
              <div className="support_box_head">
                <ShieldAlert size={12} />
                <span>Verwarnungen ({selected.warnings.length})</span>
              </div>
              {selected.warnings.length === 0 ? (
                <div className="support_empty"><ShieldAlert size={20} /><span>Keine Verwarnungen</span></div>
              ) : (
                <div className="support_info_list">
                  {selected.warnings.map((w) => (
                    <div key={w.id} className="support_info_row">
                      <span><Calendar size={11} /> {w.date} · {w.admin}</span>
                      <strong>{w.reason}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "bans" && (
            <div className="support_box">
              <div className="support_box_head">
                <Ban size={12} />
                <span>Ban-Historie ({selected.bans.length})</span>
              </div>
              {selected.bans.length === 0 ? (
                <div className="support_empty"><Ban size={20} /><span>Keine Bans</span></div>
              ) : (
                <div className="support_info_list">
                  {selected.bans.map((b) => (
                    <div key={b.id} className="support_info_row">
                      <span><Calendar size={11} /> {b.date} · {b.admin}</span>
                      <strong>
                        {b.reason}{" "}
                        <span
                          className={`ginshi_inline_badge ${
                            b.active ? "ginshi_inline_badge_destructive" : "ginshi_inline_badge_success"
                          }`}
                          style={{ marginLeft: 8 }}
                        >
                          {b.active ? "Aktiv" : "Aufgehoben"}
                        </span>
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "notes" && (
            <div className="support_box">
              <div className="support_box_head">
                <StickyNote size={12} />
                <span>Notizen ({selected.notes.length})</span>
              </div>
              {selected.notes.length === 0 ? (
                <div className="support_empty"><StickyNote size={20} /><span>Keine Notizen</span></div>
              ) : (
                <div className="support_info_list">
                  {selected.notes.map((n) => (
                    <div key={n.id} className="support_info_row">
                      <span><Calendar size={11} /> {n.date} · {n.admin}</span>
                      <strong>{n.text}</strong>
                    </div>
                  ))}
                </div>
              )}

              <div className="support_chat_input">
                <div className="logs_search_wrap support_chat_input_wrap">
                  <input
                    className="logs_search_input"
                    placeholder="Neue Notiz hinzufügen..."
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                  />
                </div>
                <button className="ginshi_btn_primary" disabled={!noteDraft.trim()} onClick={() => setNoteDraft("")}>
                  <Send size={13} /> Speichern
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayersPage;
