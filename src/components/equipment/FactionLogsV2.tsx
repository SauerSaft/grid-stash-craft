import { useState, useMemo } from "react";
import { ScrollText, ShoppingCart, Shield, Package, Landmark, ArrowDownToLine, ArrowUpFromLine, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X } from "lucide-react";

type LogTab = "waffenshop" | "waffenkammer" | "fraklager" | "frakkasse";

interface BaseLog { id: number; name: string; date: string; }
interface ShopLog extends BaseLog { weapon: string; }
interface ArmoryLog extends BaseLog { weapon: string; direction: "in" | "out"; }
interface StorageLog extends BaseLog { item: string; amount: number; direction: "in" | "out"; }
interface TreasuryLog extends BaseLog { amount: number; type: "deposit" | "withdraw"; }

const names = ["Max Müller", "Leon Schmidt", "Anna Weber", "Lukas Fischer", "Sophie Becker", "Jonas Wagner", "Lena Hoffmann", "Tim Braun"];
const weapons = ["Karabiner", "Pistole", "SMG", "Schrotflinte", "Scharfschütze", "Micro-SMG"];
const items = ["Schutzweste", "Medikit", "Reparaturkit", "Funkgerät", "Handschellen", "Nagelbänder"];

const rDate = () => `0${Math.floor(Math.random() * 7) + 1}.03.26 ${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const shopLogs: ShopLog[] = Array.from({ length: 87 }, (_, i) => ({ id: i + 1, name: pick(names), weapon: pick(weapons), date: rDate() }));
const armoryLogs: ArmoryLog[] = Array.from({ length: 64 }, (_, i) => ({ id: i + 1, name: pick(names), weapon: pick(weapons.slice(0, 4)), direction: Math.random() > 0.5 ? "in" : "out", date: rDate() }));
const storageLogs: StorageLog[] = Array.from({ length: 112 }, (_, i) => ({ id: i + 1, name: pick(names), item: pick(items), amount: Math.floor(Math.random() * 20) + 1, direction: Math.random() > 0.5 ? "in" : "out", date: rDate() }));
const treasuryLogs: TreasuryLog[] = Array.from({ length: 53 }, (_, i) => ({ id: i + 1, name: pick(names), amount: (Math.floor(Math.random() * 50) + 1) * 1000, type: Math.random() > 0.4 ? "deposit" : "withdraw", date: rDate() }));

const tabs: { id: LogTab; label: string; icon: typeof ShoppingCart; count: number }[] = [
  { id: "waffenshop", label: "Waffenshop", icon: ShoppingCart, count: shopLogs.length },
  { id: "waffenkammer", label: "Waffenkammer", icon: Shield, count: armoryLogs.length },
  { id: "fraklager", label: "Fraklager", icon: Package, count: storageLogs.length },
  { id: "frakkasse", label: "Frakkasse", icon: Landmark, count: treasuryLogs.length },
];

const ITEMS_PER_PAGE = 15;

const FactionLogsV2 = () => {
  const [activeTab, setActiveTab] = useState<LogTab>("waffenshop");
  const [pages, setPages] = useState<Record<LogTab, number>>({ waffenshop: 1, waffenkammer: 1, fraklager: 1, frakkasse: 1 });
  const [searchQuery, setSearchQuery] = useState("");

  const currentPage = pages[activeTab];
  const setCurrentPage = (p: number) => setPages((prev) => ({ ...prev, [activeTab]: p }));

  const allLogs = activeTab === "waffenshop" ? shopLogs : activeTab === "waffenkammer" ? armoryLogs : activeTab === "fraklager" ? storageLogs : treasuryLogs;

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return allLogs;
    const q = searchQuery.toLowerCase();
    return allLogs.filter((log: any) =>
      log.name.toLowerCase().includes(q) ||
      log.date.includes(q) ||
      ("weapon" in log && log.weapon.toLowerCase().includes(q)) ||
      ("item" in log && log.item.toLowerCase().includes(q))
    );
  }, [allLogs, searchQuery]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getPageRange = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    const range: number[] = [];
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  };

  const renderRow = (log: any) => {
    if (activeTab === "waffenshop") {
      return (
        <div key={log.id} className="ginshi_grid_row logs_cols">
          <span className="logs_row_id">#{log.id}</span>
          <div className="logs_row_name">
            <div className="logs_row_dot" />
            <span className="logs_row_name_text">{log.name}</span>
          </div>
          <div className="logs_row_detail">
            <ShoppingCart className="ginshi_icon_primary" style={{ opacity: 0.6 }} />
            <span className="logs_row_detail_text" style={{ color: "hsl(var(--primary) / 0.8)" }}>{log.weapon}</span>
            <span className="ginshi_inline_badge ginshi_inline_badge_primary">Gekauft</span>
          </div>
          <span className="logs_row_date">{log.date}</span>
        </div>
      );
    }

    if (activeTab === "waffenkammer") {
      const isOut = (log as ArmoryLog).direction === "out";
      return (
        <div key={log.id} className="ginshi_grid_row logs_cols">
          <span className="logs_row_id">#{log.id}</span>
          <div className="logs_row_name">
            <div className="logs_row_dot" />
            <span className="logs_row_name_text">{log.name}</span>
          </div>
          <div className="logs_row_detail">
            {isOut ? <ArrowUpFromLine className="ginshi_icon_destructive" style={{ opacity: 0.8 }} /> : <ArrowDownToLine className="ginshi_icon_success" style={{ opacity: 0.8 }} />}
            <span className="logs_row_detail_text" style={{ color: "hsl(var(--foreground) / 0.8)" }}>{(log as ArmoryLog).weapon}</span>
            <span className={`ginshi_inline_badge ${isOut ? "ginshi_inline_badge_destructive" : "ginshi_inline_badge_success"}`}>
              {isOut ? "Entnommen" : "Eingelagert"}
            </span>
          </div>
          <span className="logs_row_date">{log.date}</span>
        </div>
      );
    }

    if (activeTab === "fraklager") {
      const sLog = log as StorageLog;
      const sOut = sLog.direction === "out";
      return (
        <div key={log.id} className="ginshi_grid_row logs_cols">
          <span className="logs_row_id">#{log.id}</span>
          <div className="logs_row_name">
            <div className="logs_row_dot" />
            <span className="logs_row_name_text">{log.name}</span>
          </div>
          <div className="logs_row_detail">
            {sOut ? <ArrowUpFromLine className="ginshi_icon_destructive" style={{ opacity: 0.8 }} /> : <ArrowDownToLine className="ginshi_icon_success" style={{ opacity: 0.8 }} />}
            <span className="logs_row_detail_text" style={{ color: "hsl(var(--foreground) / 0.8)" }}>{sLog.item}</span>
            <span className={`ginshi_inline_badge ${sOut ? "ginshi_inline_badge_destructive" : "ginshi_inline_badge_success"}`}>
              {sOut ? `-${sLog.amount}` : `+${sLog.amount}`}
            </span>
          </div>
          <span className="logs_row_date">{log.date}</span>
        </div>
      );
    }

    const tLog = log as TreasuryLog;
    const isDep = tLog.type === "deposit";
    return (
      <div key={log.id} className="ginshi_grid_row logs_cols">
        <span className="logs_row_id">#{log.id}</span>
        <div className="logs_row_name">
          <div className="logs_row_dot" />
          <span className="logs_row_name_text">{log.name}</span>
        </div>
        <div className="logs_row_detail">
          {isDep ? <ArrowDownToLine className="ginshi_icon_success" style={{ opacity: 0.8 }} /> : <ArrowUpFromLine className="ginshi_icon_destructive" style={{ opacity: 0.8 }} />}
          <span className={`logs_row_detail_text ${isDep ? "ginshi_icon_success" : "ginshi_icon_destructive"}`} style={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
            {isDep ? "+" : "-"}${tLog.amount.toLocaleString("de-DE")}
          </span>
          <span className={`ginshi_inline_badge ${isDep ? "ginshi_inline_badge_success" : "ginshi_inline_badge_destructive"}`}>
            {isDep ? "Einzahlung" : "Auszahlung"}
          </span>
        </div>
        <span className="logs_row_date">{log.date}</span>
      </div>
    );
  };

  return (
    <div className="ginshi_section ginshi_section_tabbed">
      {/* Page Header */}
      <div className="ginshi_section_header">
        <div className="ginshi_section_header_icon">
          <ScrollText size={16} />
        </div>
        <div className="ginshi_section_header_content">
          <span className="ginshi_section_header_title">Logs</span>
          <span className="ginshi_section_header_subtitle">Alle Aktivitäten der Fraktion im Überblick</span>
        </div>
        <div className="ginshi_section_header_badges">
          <div className="ginshi_badge">
            <ScrollText size={10} className="ginshi_badge_icon" />
            <span className="ginshi_badge_value">
              {searchQuery.trim() ? `${filteredLogs.length} / ${allLogs.length}` : allLogs.length} Einträge
            </span>
          </div>
        </div>
      </div>

      <div className="ginshi_divider" />

      {/* Tab Bar */}
      <div className="ginshi_tab_bar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchQuery(""); setCurrentPage(1); }}
              className={`ginshi_tab ${isActive ? "ginshi_tab_active" : ""}`}
            >
              <tab.icon />
              {tab.label}
              <span className={`ginshi_tab_count ${isActive ? "ginshi_tab_count_active" : "ginshi_tab_count_inactive"}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="ginshi_divider" />

      {/* Search Bar */}
      <div style={{ padding: "8px 14px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "hsl(var(--surface))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "var(--radius)",
          padding: "0 10px",
          height: "32px",
          transition: "border-color 0.15s",
        }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.5)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "hsl(var(--border))")}
        >
          <Search size={13} style={{ color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Suchen nach Name, Waffe, Item…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "hsl(var(--foreground))",
              fontSize: "12px",
              fontFamily: "inherit",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
              style={{ color: "hsl(var(--muted-foreground))", lineHeight: 0, cursor: "pointer", background: "none", border: "none", padding: 0, flexShrink: 0 }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="ginshi_grid_table">
        <div className="ginshi_grid_thead logs_cols">
          <span className="ginshi_grid_th">ID</span>
          <span className="ginshi_grid_th">Name</span>
          <span className="ginshi_grid_th">Details</span>
          <span className="ginshi_grid_th" style={{ textAlign: "right" }}>Zeit</span>
        </div>

        <div className="ginshi_grid_tbody">
          {paginatedLogs.map(renderRow)}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="ginshi_pagination">
            <span className="ginshi_pagination_info">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, allLogs.length)} von {allLogs.length}
            </span>
            <div className="ginshi_pagination_btns">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="ginshi_page_btn">
                <ChevronsLeft />
              </button>
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="ginshi_page_btn">
                <ChevronLeft />
              </button>
              {getPageRange().map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`ginshi_page_num ${p === currentPage ? "ginshi_page_num_active" : ""}`}
                >
                  {p}
                </button>
              ))}
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="ginshi_page_btn">
                <ChevronRight />
              </button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="ginshi_page_btn">
                <ChevronsRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FactionLogsV2;
