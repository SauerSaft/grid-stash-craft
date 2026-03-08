import { useState } from "react";
import { ScrollText, ShoppingCart, Shield, Package, Landmark, ArrowDownToLine, ArrowUpFromLine, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

type LogTab = "waffenshop" | "waffenkammer" | "fraklager" | "frakkasse";

interface BaseLog {
  id: number;
  name: string;
  date: string;
}

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

  const currentPage = pages[activeTab];
  const setCurrentPage = (p: number) => setPages((prev) => ({ ...prev, [activeTab]: p }));

  const allLogs = activeTab === "waffenshop" ? shopLogs : activeTab === "waffenkammer" ? armoryLogs : activeTab === "fraklager" ? storageLogs : treasuryLogs;
  const totalPages = Math.ceil(allLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = allLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
    const rowBase = "grid grid-cols-[44px_1fr_1fr_90px] items-center px-3 py-[7px] border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors";

    if (activeTab === "waffenshop") {
      return (
        <div key={log.id} className={rowBase}>
          <span className="text-[10px] font-bold tabular-nums text-muted-foreground/50">#{log.id}</span>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-primary/40" />
            <span className="text-[11.5px] font-semibold text-foreground">{log.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShoppingCart size={9} className="text-primary/60" />
            <span className="text-[10.5px] font-medium text-primary/80">{log.weapon}</span>
            <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-primary/10 border border-primary/20 text-primary">Gekauft</span>
          </div>
          <span className="text-[9.5px] tabular-nums text-muted-foreground/50 text-right">{log.date}</span>
        </div>
      );
    }

    if (activeTab === "waffenkammer") {
      const isOut = (log as ArmoryLog).direction === "out";
      return (
        <div key={log.id} className={rowBase}>
          <span className="text-[10px] font-bold tabular-nums text-muted-foreground/50">#{log.id}</span>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-primary/40" />
            <span className="text-[11.5px] font-semibold text-foreground">{log.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {isOut ? <ArrowUpFromLine size={9} className="text-destructive/80" /> : <ArrowDownToLine size={9} className="text-success/80" />}
            <span className="text-[10.5px] font-medium text-foreground/80">{(log as ArmoryLog).weapon}</span>
            <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${isOut ? "bg-destructive/10 border border-destructive/20 text-destructive" : "bg-success/10 border border-success/20 text-success"}`}>
              {isOut ? "Entnommen" : "Eingelagert"}
            </span>
          </div>
          <span className="text-[9.5px] tabular-nums text-muted-foreground/50 text-right">{log.date}</span>
        </div>
      );
    }

    if (activeTab === "fraklager") {
      const sLog = log as StorageLog;
      const sOut = sLog.direction === "out";
      return (
        <div key={log.id} className={rowBase}>
          <span className="text-[10px] font-bold tabular-nums text-muted-foreground/50">#{log.id}</span>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-primary/40" />
            <span className="text-[11.5px] font-semibold text-foreground">{log.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {sOut ? <ArrowUpFromLine size={9} className="text-destructive/80" /> : <ArrowDownToLine size={9} className="text-success/80" />}
            <span className="text-[10.5px] font-medium text-foreground/80">{sLog.item}</span>
            <span className={`text-[8px] font-bold tabular-nums px-1.5 py-0.5 rounded-sm ${sOut ? "bg-destructive/10 border border-destructive/20 text-destructive" : "bg-success/10 border border-success/20 text-success"}`}>
              {sOut ? `-${sLog.amount}` : `+${sLog.amount}`}
            </span>
          </div>
          <span className="text-[9.5px] tabular-nums text-muted-foreground/50 text-right">{log.date}</span>
        </div>
      );
    }

    // frakkasse
    const tLog = log as TreasuryLog;
    const isDep = tLog.type === "deposit";
    return (
      <div key={log.id} className={rowBase}>
        <span className="text-[10px] font-bold tabular-nums text-muted-foreground/50">#{log.id}</span>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-primary/40" />
          <span className="text-[11.5px] font-semibold text-foreground">{log.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isDep ? <ArrowDownToLine size={9} className="text-success/80" /> : <ArrowUpFromLine size={9} className="text-destructive/80" />}
          <span className={`text-[10.5px] font-extrabold tabular-nums ${isDep ? "text-success" : "text-destructive"}`}>
            {isDep ? "+" : "-"}${tLog.amount.toLocaleString("de-DE")}
          </span>
          <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${isDep ? "bg-success/10 border border-success/20 text-success" : "bg-destructive/10 border border-destructive/20 text-destructive"}`}>
            {isDep ? "Einzahlung" : "Auszahlung"}
          </span>
        </div>
        <span className="text-[9.5px] tabular-nums text-muted-foreground/50 text-right">{log.date}</span>
      </div>
    );
  };

  const activeTabData = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="ginshi_logs_v2 flex flex-col flex-1 overflow-hidden">
      {/* Single unified card */}
      <div className="flex flex-col flex-1 overflow-hidden rounded-sm border border-white/[0.06] bg-white/[0.02]">

        {/* ─── Section Header ─── */}
        <div className="px-4 pt-3.5 pb-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-sm bg-primary/15 border border-primary/20">
              <ScrollText size={14} className="text-primary" style={{ filter: "drop-shadow(0 0 6px hsl(48 100% 50% / 0.5))" }} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-foreground">Logs</span>
              <span className="text-[10.5px] font-medium text-muted-foreground">Alle Aktivitäten der Fraktion im Überblick</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Gesamt</span>
              <span className="text-xs font-extrabold tabular-nums text-primary">{allLogs.length}</span>
            </div>
          </div>
        </div>

        {/* ─── Divider + Tab Bar (inside the card) ─── */}
        <div className="px-4 pt-3 pb-0">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        </div>

        <div className="flex items-center gap-1 px-4 pt-2.5 pb-2.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center gap-1.5 px-3 py-[6px] rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-primary/15 border border-primary/30 text-primary"
                    : "bg-transparent border border-transparent text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                }`}
              >
                <tab.icon size={10} className={isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground/60"} />
                {tab.label}
                <span className={`text-[8px] font-extrabold tabular-nums ml-0.5 px-1 py-0 rounded-sm ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "bg-white/[0.04] text-muted-foreground/50"
                }`}>
                  {tab.count}
                </span>
                {/* Active indicator line */}
                {isActive && (
                  <div className="absolute -bottom-[10.5px] left-2 right-2 h-[2px] rounded-full bg-primary/60" style={{ filter: "drop-shadow(0 0 4px hsl(48 100% 50% / 0.4))" }} />
                )}
              </button>
            );
          })}
        </div>

        {/* ─── Inset area: subtle column labels + rows ─── */}
        <div className="mx-3 mt-1 mb-0 flex flex-col flex-1 overflow-hidden rounded-sm border border-white/[0.04] bg-black/25">
          {/* Column labels as a soft inner header */}
          <div className="grid grid-cols-[44px_1fr_1fr_90px] px-3 py-1.5 bg-white/[0.015]">
            <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/30">ID</span>
            <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/30">Name</span>
            <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/30">Details</span>
            <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/30 text-right">Zeit</span>
          </div>
          <div className="h-px w-full bg-white/[0.04]" />

          {/* ─── Rows ─── */}
          <div className="flex-1 overflow-y-auto">
            {paginatedLogs.map(renderRow)}
          </div>
        </div>

        {/* ─── Pagination Footer (inside the card) ─── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.04]">
            <span className="text-[9px] tabular-nums text-muted-foreground/40">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, allLogs.length)} von {allLogs.length}
            </span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1 rounded-sm text-muted-foreground/50 hover:text-foreground hover:bg-white/[0.05] disabled:opacity-15 disabled:pointer-events-none transition-colors"
              >
                <ChevronsLeft size={11} />
              </button>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-sm text-muted-foreground/50 hover:text-foreground hover:bg-white/[0.05] disabled:opacity-15 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft size={11} />
              </button>
              {getPageRange().map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`min-w-[24px] h-[24px] rounded-sm text-[9px] font-bold tabular-nums transition-all ${
                    p === currentPage
                      ? "bg-primary/20 border border-primary/30 text-primary"
                      : "text-muted-foreground/50 hover:text-foreground hover:bg-white/[0.05]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-sm text-muted-foreground/50 hover:text-foreground hover:bg-white/[0.05] disabled:opacity-15 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight size={11} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1 rounded-sm text-muted-foreground/50 hover:text-foreground hover:bg-white/[0.05] disabled:opacity-15 disabled:pointer-events-none transition-colors"
              >
                <ChevronsRight size={11} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FactionLogsV2;
