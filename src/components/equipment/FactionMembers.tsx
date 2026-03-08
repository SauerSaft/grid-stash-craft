import { useState } from "react";
import { Users, Crown, ChevronUp, ChevronDown, UserX, Circle } from "lucide-react";

interface Member {
  id: string;
  name: string;
  rank: string;
  rankLevel: number;
  online: boolean;
  joinDate: string;
}

const mockMembers: Member[] = [
  { id: "1", name: "Max Müller", rank: "Anführer", rankLevel: 5, online: true, joinDate: "12.01.2025" },
  { id: "2", name: "Leon Schmidt", rank: "Vize-Anführer", rankLevel: 4, online: true, joinDate: "15.02.2025" },
  { id: "3", name: "Anna Weber", rank: "Leutnant", rankLevel: 3, online: false, joinDate: "20.03.2025" },
  { id: "4", name: "Jonas Fischer", rank: "Sergeant", rankLevel: 2, online: true, joinDate: "05.04.2025" },
  { id: "5", name: "Sophie Braun", rank: "Sergeant", rankLevel: 2, online: false, joinDate: "18.05.2025" },
  { id: "6", name: "Lukas Wagner", rank: "Rekrut", rankLevel: 1, online: false, joinDate: "02.06.2025" },
  { id: "7", name: "Emma Hoffmann", rank: "Rekrut", rankLevel: 1, online: true, joinDate: "14.07.2025" },
  { id: "8", name: "Felix Becker", rank: "Rekrut", rankLevel: 1, online: false, joinDate: "28.08.2025" },
  { id: "9", name: "Mia Schulz", rank: "Sergeant", rankLevel: 2, online: true, joinDate: "10.09.2025" },
  { id: "10", name: "Paul Richter", rank: "Rekrut", rankLevel: 1, online: false, joinDate: "22.11.2025" },
];

const getRankColor = (level: number) => {
  if (level >= 5) return "text-primary";
  if (level >= 4) return "text-primary/80";
  if (level >= 3) return "text-info";
  if (level >= 2) return "text-foreground";
  return "text-muted-foreground";
};

const FactionMembers = () => {
  const [members] = useState(mockMembers);
  const onlineCount = members.filter((m) => m.online).length;

  return (
    <div className="ginshi_members_container flex flex-col flex-1 gap-3 overflow-hidden">
      {/* Page Header */}
      <div className="ginshi_members_header flex items-center gap-3 px-4 py-3 bg-white/[0.03] rounded-sm border border-white/[0.06]">
        <div className="p-1.5 rounded-sm bg-primary/15 border border-primary/20">
          <Users size={14} className="text-primary" style={{ filter: "drop-shadow(0 0 6px hsl(48 100% 50% / 0.5))" }} />
        </div>
        <div className="flex flex-col flex-1">
          <span className="text-sm font-bold tracking-tight text-foreground">Mitglieder</span>
          <span className="text-xs font-medium text-muted-foreground">Verwalte die Mitglieder deiner Fraktion</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="ginshi_member_count flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white/[0.03] border border-white/[0.06]">
            <Users size={10} className="text-muted-foreground" />
            <span className="text-[10px] font-bold tabular-nums text-foreground">{members.length}</span>
          </div>
          <div className="ginshi_member_online flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-success/[0.06] border border-success/15">
            <Circle size={6} fill="hsl(var(--success))" className="text-success" />
            <span className="text-[10px] font-bold tabular-nums text-success">{onlineCount} Online</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="ginshi_members_table flex-1 rounded-sm border border-white/[0.06] bg-white/[0.02] overflow-hidden flex flex-col">
        <div className="ginshi_members_scroll flex-1 overflow-y-auto">
          <table className="ginshi_table w-full border-collapse">
            <thead className="ginshi_thead">
              <tr className="ginshi_thead_row border-b border-white/[0.06] bg-white/[0.02]">
                <th className="ginshi_th ginshi_th_name text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground text-left px-4 py-2.5">Name</th>
                <th className="ginshi_th ginshi_th_rank text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground text-left px-4 py-2.5 w-[140px]">Rang</th>
                <th className="ginshi_th ginshi_th_status text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground text-center px-4 py-2.5 w-[80px]">Status</th>
                <th className="ginshi_th ginshi_th_actions text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground text-right px-4 py-2.5 w-[130px]">Aktionen</th>
              </tr>
            </thead>
            <tbody className="ginshi_tbody">
              {members
                .sort((a, b) => b.rankLevel - a.rankLevel || a.name.localeCompare(b.name))
                .map((member) => (
                  <tr
                    key={member.id}
                    className="ginshi_member_row border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Name */}
                    <td className="ginshi_td ginshi_td_name px-4 py-2">
                      <div className="ginshi_member_name flex items-center gap-2.5 min-w-0">
                        <div className="ginshi_member_avatar w-7 h-7 rounded-sm bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                          {member.rankLevel >= 5 ? (
                            <Crown size={11} className="text-primary" />
                          ) : (
                            <span className="text-[10px] font-bold text-muted-foreground">
                              {member.name.split(" ").map((n) => n[0]).join("")}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-foreground truncate">{member.name}</span>
                      </div>
                    </td>

                    {/* Rank */}
                    <td className="ginshi_td ginshi_td_rank px-4 py-2">
                      <div className="ginshi_member_rank flex items-center gap-1.5 min-w-0">
                        <div className={`ginshi_rank_dot w-1 h-1 rounded-full flex-shrink-0 ${member.rankLevel >= 4 ? "bg-primary" : member.rankLevel >= 3 ? "bg-info" : "bg-muted-foreground/40"}`} />
                        <span className={`text-[11px] font-semibold truncate ${getRankColor(member.rankLevel)}`}>
                          {member.rank}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="ginshi_td ginshi_td_status px-4 py-2">
                      <div className="flex justify-center">
                        <div className={`ginshi_status_badge flex items-center gap-1 px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider ${
                          member.online
                            ? "bg-success/10 border border-success/20 text-success"
                            : "bg-white/[0.03] border border-white/[0.06] text-muted-foreground"
                        }`}>
                          <Circle size={5} fill={member.online ? "hsl(var(--success))" : "transparent"} className={member.online ? "text-success" : "text-muted-foreground/50"} />
                          {member.online ? "On" : "Off"}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="ginshi_td ginshi_td_actions px-4 py-2">
                      <div className="ginshi_member_actions flex items-center justify-end gap-1">
                        <button
                          title="Befördern"
                          className="ginshi_btn_promote w-6 h-6 flex items-center justify-center rounded-sm bg-success/[0.06] border border-success/15 text-success/60 hover:bg-success/15 hover:border-success/30 hover:text-success transition-colors"
                        >
                          <ChevronUp size={12} />
                        </button>
                        <button
                          title="Degradieren"
                          className="ginshi_btn_demote w-6 h-6 flex items-center justify-center rounded-sm bg-primary/[0.06] border border-primary/15 text-primary/60 hover:bg-primary/15 hover:border-primary/30 hover:text-primary transition-colors"
                        >
                          <ChevronDown size={12} />
                        </button>
                        <button
                          title="Kündigen"
                          className="ginshi_btn_kick w-6 h-6 flex items-center justify-center rounded-sm bg-destructive/[0.06] border border-destructive/15 text-destructive/60 hover:bg-destructive/15 hover:border-destructive/30 hover:text-destructive transition-colors"
                        >
                          <UserX size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FactionMembers;
