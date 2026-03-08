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
      <DialogContent className="ginshi_modal">
        <DialogTitle className="sr-only">Waffenmodifikation: {weaponName}</DialogTitle>

        {/* Header */}
        <div className="ginshi_modal_header">
          <div className="ginshi_modal_header_indicator" />
          <div className="ginshi_modal_header_content">
            <Crosshair />
            <span className="ginshi_modal_header_title">
              Waffenmodifikation: <span>{weaponName}</span>
            </span>
          </div>
          <button onClick={() => onOpenChange(false)} className="ginshi_close_sm">
            <X />
          </button>
        </div>

        {/* Weapon Display */}
        <div className="ginshi_modal_weapon_display">
          <div className="ginshi_corner_tl" />
          <div className="ginshi_corner_br" />
          <div className="ginshi_modal_weapon_display_glow" />
          <img
            src={weaponImage}
            alt={weaponName}
            className="ginshi_modal_weapon_img"
            draggable={false}
          />
        </div>

        {/* Attachments Section */}
        <div className="ginshi_modal_section">
          <div className="ginshi_modal_section_header">
            <span className="ginshi_modal_section_label">Verfügbare Aufsätze</span>
            <span className="ginshi_modal_section_counter">
              {equippedCount}/{attachments.length}
            </span>
          </div>

          <div className="ginshi_modal_grid">
            {attachments.map((att) => (
              <button
                key={att.id}
                onClick={() => toggleAttachment(att.id)}
                className={`ginshi_attachment ${att.equipped ? "ginshi_attachment_active" : ""}`}
              >
                <div className="ginshi_attachment_img">
                  <img src={att.image} alt={att.name} draggable={false} />
                  {att.equipped && (
                    <div className="ginshi_attachment_equipped_overlay">
                      <Check />
                    </div>
                  )}
                </div>
                <div className="ginshi_attachment_info">
                  <span className="ginshi_attachment_name">{att.name}</span>
                  {att.price != null && (
                    <span className="ginshi_attachment_price">{formatPrice(att.price)}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="ginshi_modal_actions">
          <button onClick={() => onOpenChange(false)} className="ginshi_modal_btn ginshi_modal_btn_confirm">
            Übernehmen
          </button>
          <button onClick={() => onOpenChange(false)} className="ginshi_modal_btn ginshi_modal_btn_cancel">
            Abbrechen
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeaponModifyModal;
