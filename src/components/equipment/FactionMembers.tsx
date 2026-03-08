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

const getRankClass = (level: number) => {
  if (level >= 5) return "ginshi_rank_5";
  if (level >= 4) return "ginshi_rank_4";
  if (level >= 3) return "ginshi_rank_3";
  if (level >= 2) return "ginshi_rank_2";
  return "ginshi_rank_1";
};

const getRankDotClass = (level: number) => {
  if (level >= 4) return "ginshi_rank_dot ginshi_rank_dot_high";
  if (level >= 3) return "ginshi_rank_dot ginshi_rank_dot_mid";
  return "ginshi_rank_dot ginshi_rank_dot_low";
};

const FactionMembers = () => {
  const [members] = useState(mockMembers);
  const onlineCount = members.filter((m) => m.online).length;

  return (
    <div className="ginshi_section">
      {/* Page Header */}
      <div className="ginshi_section_header">
        <div className="ginshi_section_header_icon">
          <Users size={14} />
        </div>
        <div className="ginshi_section_header_content">
          <span className="ginshi_section_header_title">Mitglieder</span>
          <span className="ginshi_section_header_subtitle">Verwalte die Mitglieder deiner Fraktion</span>
        </div>
        <div className="ginshi_section_header_badges">
          <div className="ginshi_badge">
            <Users size={10} className="ginshi_badge_icon" />
            <span className="ginshi_badge_value">{members.length}</span>
          </div>
          <div className="ginshi_badge_online">
            <Circle size={6} fill="hsl(var(--success))" className="ginshi_badge_online_dot" />
            <span className="ginshi_badge_online_text">{onlineCount} Online</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="ginshi_table_wrapper">
        <div className="ginshi_table_scroll">
          <table className="ginshi_table">
            <thead className="ginshi_thead">
              <tr className="ginshi_tr_head">
                <th className="ginshi_th">Name</th>
                <th className="ginshi_th" style={{ width: 140 }}>Rang</th>
                <th className="ginshi_th ginshi_th_center" style={{ width: 80 }}>Status</th>
                <th className="ginshi_th ginshi_th_right" style={{ width: 130 }}>Aktionen</th>
              </tr>
            </thead>
            <tbody className="ginshi_tbody">
              {members
                .sort((a, b) => b.rankLevel - a.rankLevel || a.name.localeCompare(b.name))
                .map((member) => (
                  <tr key={member.id} className="ginshi_tr">
                    {/* Name */}
                    <td className="ginshi_td">
                      <div className="ginshi_member_name">
                        <div className="ginshi_member_avatar">
                          {member.rankLevel >= 5 ? (
                            <Crown size={11} className="ginshi_icon_primary" />
                          ) : (
                            <span className="ginshi_member_avatar_initials">
                              {member.name.split(" ").map((n) => n[0]).join("")}
                            </span>
                          )}
                        </div>
                        <span className="ginshi_member_name_text">{member.name}</span>
                      </div>
                    </td>

                    {/* Rank */}
                    <td className="ginshi_td">
                      <div className="ginshi_member_rank">
                        <div className={getRankDotClass(member.rankLevel)} />
                        <span className={`ginshi_rank_text ${getRankClass(member.rankLevel)}`}>
                          {member.rank}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="ginshi_td ginshi_td_center">
                      <div>
                        <div className={`ginshi_status_badge ${member.online ? "ginshi_status_badge_on" : "ginshi_status_badge_off"}`}>
                          <Circle size={5} fill={member.online ? "hsl(var(--success))" : "transparent"} className={member.online ? "ginshi_icon_success" : ""} />
                          {member.online ? "On" : "Off"}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="ginshi_td">
                      <div className="ginshi_table_actions">
                        <button title="Befördern" className="ginshi_action_btn ginshi_action_btn_success">
                          <ChevronUp size={12} />
                        </button>
                        <button title="Degradieren" className="ginshi_action_btn ginshi_action_btn_warning">
                          <ChevronDown size={12} />
                        </button>
                        <button title="Kündigen" className="ginshi_action_btn ginshi_action_btn_danger">
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
