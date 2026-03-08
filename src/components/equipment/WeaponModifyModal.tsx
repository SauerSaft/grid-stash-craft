import { useState } from "react";
import { X, Check, Crosshair } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import scopeImg from "@/assets/attachments/scope.png";
import flashlightImg from "@/assets/attachments/flashlight.png";
import suppressorImg from "@/assets/attachments/suppressor.png";
import gripImg from "@/assets/attachments/grip.png";

interface Attachment {
  id: string;
  name: string;
  image: string;
  price?: number;
  equipped: boolean;
}

interface WeaponModifyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weaponName: string;
  weaponImage: string;
}

const getAttachmentsForWeapon = (_name: string): Attachment[] => [
  { id: "scope", name: "Zielvorrichtung", image: scopeImg, price: 500, equipped: false },
  { id: "flashlight", name: "Taschenlampe", image: flashlightImg, equipped: false },
  { id: "suppressor", name: "Schalldämpfer", image: suppressorImg, price: 350, equipped: false },
  { id: "grip", name: "Handschutz", image: gripImg, price: 250, equipped: false },
];

const formatPrice = (price: number) => `$${price.toLocaleString("de-DE")}`;

const WeaponModifyModal = ({ open, onOpenChange, weaponName, weaponImage }: WeaponModifyModalProps) => {
  const [attachments, setAttachments] = useState<Attachment[]>(() => getAttachmentsForWeapon(weaponName));

  const equippedCount = attachments.filter((a) => a.equipped).length;

  const toggleAttachment = (id: string) => {
    setAttachments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, equipped: !a.equipped } : a))
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="ginshi_modify_modal max-w-[700px] p-0 gap-0 bg-black/95 border border-primary/[0.12] rounded-sm overflow-hidden backdrop-blur-xl">
        <DialogTitle className="sr-only">Waffenmodifikation: {weaponName}</DialogTitle>

        {/* Header */}
        <div className="ginshi_modify_header flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <div className="w-[3px] h-5 rounded-full bg-primary" style={{ boxShadow: "0 0 8px hsl(48 100% 50% / 0.4)" }} />
          <div className="flex items-center gap-2 flex-1">
            <Crosshair size={13} className="text-primary" />
            <span className="text-sm font-bold tracking-tight text-foreground">
              Waffenmodifikation: <span className="text-primary">{weaponName}</span>
            </span>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="ginshi_modify_close w-6 h-6 flex items-center justify-center rounded-sm bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-destructive/30 transition-colors"
          >
            <X size={11} className="text-muted-foreground" />
          </button>
        </div>

        {/* Weapon Display */}
        <div className="ginshi_modify_weapon_display relative mx-4 mt-4 h-[140px] rounded-sm bg-black/60 border border-white/[0.06] overflow-hidden flex items-center justify-center">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-[1px] bg-gradient-to-r from-primary/30 to-transparent" />
          <div className="absolute top-0 left-0 w-[1px] h-5 bg-gradient-to-b from-primary/30 to-transparent" />
          <div className="absolute bottom-0 right-0 w-6 h-[1px] bg-gradient-to-l from-primary/20 to-transparent" />
          <div className="absolute bottom-0 right-0 w-[1px] h-5 bg-gradient-to-t from-primary/20 to-transparent" />
          {/* Radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(48_100%_50%/0.03)_0%,transparent_70%)] pointer-events-none" />

          <img
            src={weaponImage}
            alt={weaponName}
            className="max-h-[110px] max-w-[85%] object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
            draggable={false}
          />
        </div>

        {/* Attachments Section */}
        <div className="ginshi_modify_attachments flex flex-col gap-2.5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Verfügbare Aufsätze</span>
            <span className="text-[10px] font-bold tabular-nums text-primary/70 bg-primary/[0.08] border border-primary/[0.12] rounded-sm px-2 py-0.5">
              {equippedCount}/{attachments.length}
            </span>
          </div>

          <div className="ginshi_modify_grid grid grid-cols-2 gap-2">
            {attachments.map((att) => (
              <button
                key={att.id}
                onClick={() => toggleAttachment(att.id)}
                className={`ginshi_attachment_box group relative flex items-center gap-2.5 p-2 rounded-sm border transition-colors ${
                  att.equipped
                    ? "bg-primary/[0.08] border-primary/25"
                    : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]"
                }`}
              >
                {/* Attachment image */}
                <div className="ginshi_attachment_img relative w-10 h-10 rounded-sm bg-black/50 border border-white/[0.04] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={att.image}
                    alt={att.name}
                    className="w-8 h-8 object-contain brightness-90"
                    draggable={false}
                  />
                  {att.equipped && (
                    <div className="absolute inset-0 bg-primary/[0.06] flex items-center justify-center">
                      <Check size={14} className="text-primary" style={{ filter: "drop-shadow(0 0 4px hsl(48 100% 50% / 0.5))" }} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="ginshi_attachment_info flex flex-col items-start gap-0.5 min-w-0">
                  <span className="text-[11px] font-bold text-foreground truncate w-full text-left leading-tight">
                    {att.name}
                  </span>
                  {att.price != null && (
                    <span className="text-[10px] font-semibold text-primary/80 tabular-nums">
                      {formatPrice(att.price)}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="ginshi_modify_actions flex gap-2 px-4 pb-4">
          <button
            onClick={() => onOpenChange(false)}
            className="ginshi_btn_confirm flex-1 py-2 rounded-sm text-[11px] font-bold uppercase tracking-wider bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 hover:border-primary/50 transition-colors"
          >
            Übernehmen
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="ginshi_btn_cancel flex-1 py-2 rounded-sm text-[11px] font-bold uppercase tracking-wider bg-white/[0.03] border border-white/[0.06] text-muted-foreground hover:bg-white/[0.06] hover:border-white/[0.1] transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeaponModifyModal;
