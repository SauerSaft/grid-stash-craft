import { useMemo, useState } from "react";
import {
  LifeBuoy,
  Search,
  X,
  MapPin,
  Eye,
  Snowflake,
  HeartPulse,
  UserRound,
  Send,
  Inbox,
  Clock,
  Hash,
  Briefcase,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type TicketStatus = "open" | "assigned" | "waiting";

interface ChatMessage {
  id: string;
  from: "player" | "admin";
  author: string;
  time: string;
  text: string;
}

interface Ticket {
  id: number;
  time: string;
  player: string;
  sourceId: number;
  reason: string;
  detail: string;
  status: TicketStatus;
  identifier: string;
  steam: string;
  createdAgo: string;
  position: string;
  job: string;
  ping: number;
  supporter: string | null;
  messages: ChatMessage[];
}

const mockTickets: Ticket[] = [
  {
    id: 124,
    time: "23:41",
    player: "Nasser Almansouri",
    sourceId: 51,
    reason: "Falle durch die Map beim Würfelpark",
    detail: "Spieler fällt wiederholt durch die Map und kommt nicht raus.",
    status: "open",
    identifier: "license:4d8a9f12c7e1...",
    steam: "steam:110000112345678",
    createdAgo: "vor 3 Minuten",
    position: "235.1, -871.4, 30.4",
    job: "unemployed",
    ping: 42,
    supporter: null,
    messages: [
      { id: "m1", from: "player", author: "Nasser", time: "23:41", text: "Hey, ich falle die ganze Zeit durch die Map." },
      { id: "m2", from: "admin", author: "Du", time: "23:42", text: "Alles klar, ich schaue mir kurz deinen Screenshot und deine Position an." },
      { id: "m3", from: "player", author: "Nasser", time: "23:43", text: "Bin beim Würfelpark, komme nicht raus." },
    ],
  },
  {
    id: 123,
    time: "23:36",
    player: "Shreya Mercy",
    sourceId: 18,
    reason: "Frage zur Fraktionsbewerbung",
    detail: "Wie läuft das Prozedere für die Bewerbung bei einer Gang ab?",
    status: "waiting",
    identifier: "license:9b1c33aa...",
    steam: "steam:110000198765432",
    createdAgo: "vor 8 Minuten",
    position: "-712.0, 132.4, 56.1",
    job: "mechanic",
    ping: 31,
    supporter: "Kira S.",
    messages: [
      { id: "m1", from: "player", author: "Shreya", time: "23:36", text: "Hi, wie kann ich mich bei einer Fraktion bewerben?" },
      { id: "m2", from: "admin", author: "Kira S.", time: "23:38", text: "Auf der Website unter Fraktionen → Bewerbung. Kann dir den Link gleich schicken." },
    ],
  },
  {
    id: 122,
    time: "23:22",
    player: "kazi maaz",
    sourceId: 72,
    reason: "Spieler nimmt Hände nicht hoch",
    detail: "RP-Verweigerung beim Überfall auf den Tankstellen-Shop.",
    status: "assigned",
    identifier: "license:771fab09...",
    steam: "steam:110000156473829",
    createdAgo: "vor 22 Minuten",
    position: "25.7, -1347.3, 29.5",
    job: "unemployed",
    ping: 87,
    supporter: "Marek H.",
    messages: [
      { id: "m1", from: "player", author: "kazi", time: "23:22", text: "Spieler hebt die Hände nicht trotz aufgerichteter Waffe." },
      { id: "m2", from: "admin", author: "Marek H.", time: "23:24", text: "Ich komme gleich rüber und schaue es mir an." },
    ],
  },
  {
    id: 121,
    time: "23:05",
    player: "Mika Carter",
    sourceId: 39,
    reason: "Verdacht auf RDM",
    detail: "Wurde am Pier ohne RP einfach erschossen.",
    status: "open",
    identifier: "license:e22c0fa8...",
    steam: "steam:110000122334455",
    createdAgo: "vor 39 Minuten",
    position: "-1850.4, -1230.0, 13.0",
    job: "ems",
    ping: 54,
    supporter: null,
    messages: [
      { id: "m1", from: "player", author: "Mika", time: "23:05", text: "Wurde am Pier ohne RP umgenietet." },
    ],
  },
];

const statusMap: Record<TicketStatus, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  open: { label: "Offen", cls: "ginshi_inline_badge_destructive", icon: AlertCircle },
  assigned: { label: "Zugewiesen", cls: "ginshi_inline_badge_primary", icon: ShieldCheck },
  waiting: { label: "Wartet", cls: "ginshi_inline_badge_success", icon: CheckCircle2 },
};

const SupportPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedId, setSelectedId] = useState<number>(mockTickets[0].id);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tickets;
    return tickets.filter(
      (t) =>
        String(t.id).includes(q) ||
        t.player.toLowerCase().includes(q) ||
        String(t.sourceId).includes(q) ||
        t.reason.toLowerCase().includes(q),
    );
  }, [tickets, query]);

  const selected = tickets.find((t) => t.id === selectedId) ?? tickets[0];
  const openCount = tickets.filter((t) => t.status === "open").length;

  const sendMessage = () => {
    if (!draft.trim() || !selected) return;
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      from: "admin",
      author: "Du",
      time: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      text: draft.trim(),
    };
    setTickets((prev) =>
      prev.map((t) => (t.id === selected.id ? { ...t, messages: [...t.messages, newMsg] } : t)),
    );
    setDraft("");
  };

  const StatusBadge = ({ status }: { status: TicketStatus }) => {
    const s = statusMap[status];
    const Icon = s.icon;
    return (
      <span className={`ginshi_inline_badge ${s.cls}`}>
        <Icon size={10} />
        {s.label}
      </span>
    );
  };

  return (
    <div className="ginshi_section">
      {/* Section Header */}
      <div className="ginshi_section_header">
        <div className="ginshi_section_header_icon">
          <LifeBuoy size={14} />
        </div>
        <div className="ginshi_section_header_content">
          <span className="ginshi_section_header_title">Support</span>
          <span className="ginshi_section_header_subtitle">
            Bearbeite Spieler-Tickets und verwalte den Live-Support
          </span>
        </div>
        <div className="ginshi_section_header_badges">
          <div className="ginshi_badge">
            <Inbox size={10} className="ginshi_badge_icon" />
            <span className="ginshi_badge_value">{tickets.length} Tickets</span>
          </div>
          <div className="ginshi_badge_online">
            <Circle size={8} className="ginshi_badge_online_dot" />
            <span className="ginshi_badge_online_text">{openCount} offen</span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="support_layout">
        {/* LEFT: ticket list */}
        <div className="support_list_panel">
          <div className="logs_search_wrap">
            <Search size={14} className="logs_search_icon" />
            <input
              className="logs_search_input"
              placeholder="Ticket, Spieler, ID oder Grund suchen..."
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
            {filtered.map((t) => {
              const isActive = t.id === selectedId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedId(t.id)}
                  className={`support_ticket_card ${isActive ? "support_ticket_card_active" : ""}`}
                >
                  <div className="support_ticket_meta">
                    <span className="support_ticket_id">
                      <Hash size={10} />
                      {t.id} · {t.time}
                    </span>
                    <span className="support_ticket_src">ID {t.sourceId}</span>
                  </div>
                  <div className="support_ticket_name">{t.player}</div>
                  <div className="support_ticket_reason">{t.detail}</div>
                  <div className="support_ticket_footer">
                    <StatusBadge status={t.status} />
                    {t.supporter && (
                      <span className="support_ticket_supporter">
                        <ShieldCheck size={10} />
                        {t.supporter}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="support_empty">
                <Inbox size={20} />
                <span>Keine Tickets gefunden</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: detail */}
        <div className="support_detail_panel">
          {selected && (
            <>
              <div className="support_detail_head">
                <div className="support_detail_head_main">
                  <div className="support_detail_title">
                    {selected.player}
                    <span className="support_detail_srcid">[{selected.sourceId}]</span>
                  </div>
                  <div className="support_detail_sub">
                    {selected.identifier} · {selected.steam} · erstellt {selected.createdAgo}
                  </div>
                </div>
                <StatusBadge status={selected.status} />
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
                  <X size={13} /> Ticket schließen
                </button>
              </div>

              <div className="support_grid_2">
                <div className="support_box">
                  <div className="support_box_head">
                    <Eye size={12} />
                    <span>Spieler Screenshot</span>
                  </div>
                  <div className="support_screenshot">
                    <span className="support_screenshot_label">Screenshot wird live geladen…</span>
                  </div>
                </div>

                <div className="support_box">
                  <div className="support_box_head">
                    <ShieldCheck size={12} />
                    <span>Ticket Info</span>
                  </div>
                  <div className="support_info_list">
                    <div className="support_info_row">
                      <span>Grund</span>
                      <strong>{selected.reason}</strong>
                    </div>
                    <div className="support_info_row">
                      <span>
                        <MapPin size={11} /> Position
                      </span>
                      <strong>{selected.position}</strong>
                    </div>
                    <div className="support_info_row">
                      <span>
                        <Briefcase size={11} /> Job
                      </span>
                      <strong>{selected.job}</strong>
                    </div>
                    <div className="support_info_row">
                      <span>
                        <Wifi size={11} /> Ping
                      </span>
                      <strong>{selected.ping} ms</strong>
                    </div>
                    <div className="support_info_row">
                      <span>
                        <ShieldCheck size={11} /> Supporter
                      </span>
                      <strong>{selected.supporter ?? "Nicht zugewiesen"}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="support_box support_chat_box">
                <div className="support_box_head">
                  <Send size={12} />
                  <span>Support Chat</span>
                </div>

                <div className="support_chat">
                  {selected.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`support_msg ${m.from === "admin" ? "support_msg_admin" : "support_msg_player"}`}
                    >
                      <div className="support_msg_meta">
                        <span>{m.author}</span>
                        <span>
                          <Clock size={9} /> {m.time}
                        </span>
                      </div>
                      <div className="support_msg_text">{m.text}</div>
                    </div>
                  ))}
                </div>

                <div className="support_chat_input">
                  <div className="logs_search_wrap support_chat_input_wrap">
                    <input
                      className="logs_search_input"
                      placeholder="Nachricht an Spieler schreiben..."
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage();
                      }}
                    />
                  </div>
                  <button className="ginshi_btn_primary" onClick={sendMessage} disabled={!draft.trim()}>
                    <Send size={13} /> Senden
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Tiny dot component compatible with existing online badge
const Circle = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 8 8" className={className}>
    <circle cx="4" cy="4" r="4" fill="currentColor" />
  </svg>
);

export default SupportPage;
