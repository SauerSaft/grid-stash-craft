import { useState } from "react";
import { X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGinshiNotification } from "@/components/notifications/GinshiNotificationContext";

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
  const { notify } = useGinshiNotification();

  const equippedCount = attachments.filter((a) => a.equipped).length;

  const toggleAttachment = (id: string) => {
    setAttachments((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, equipped: !a.equipped } : a));
      const att = updated.find((a) => a.id === id)!;

      if (att.equipped) {
        notify({
          type: "success",
          title: `${att.name} ausgerüstet`,
          message: `Aufsatz wurde auf ${weaponName} montiert.`,
        });
      } else {
        notify({
          type: "warning",
          title: `${att.name} entfernt`,
          message: `Aufsatz wurde von ${weaponName} demontiert.`,
        });
      }

      return updated;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="ginshi_modal">
        <DialogTitle className="sr-only">Waffenmodifikation: {weaponName}</DialogTitle>

        {/* Header */}
        <div className="ginshi_modal_header">
          <div className="ginshi_accent_bar" />
          <span className="ginshi_modal_title">
            Waffenmodifikation: <span>{weaponName}</span>
          </span>
          <div className="ginshi_modal_spacer" />
          <button onClick={() => onOpenChange(false)} className="ginshi_modal_close">
            <X />
          </button>
        </div>

        {/* Weapon Display */}
        <div className="ginshi_modal_body">
          <div className="weaponmod_preview">
            <div className="ginshi_corner_tl" />
            <div className="ginshi_corner_br" />
            <div className="ginshi_radial_glow" />
            <img
              src={weaponImage}
              alt={weaponName}
              className="weaponmod_preview_img"
              draggable={false}
            />
          </div>
        </div>

        {/* Attachments Section */}
        <div className="ginshi_modal_body" style={{ paddingTop: 0 }}>
          <div className="ginshi_flex_between" style={{ marginBottom: "0.75rem" }}>
            <span className="ginshi_label">Verfügbare Aufsätze</span>
            <span className="ginshi_counter_badge">
              {equippedCount}/{attachments.length}
            </span>
          </div>

          <div className="weaponmod_grid">
            {attachments.map((att) => (
              <button
                key={att.id}
                onClick={() => toggleAttachment(att.id)}
                className={`weaponmod_slot ${att.equipped ? "weaponmod_slot_active" : ""}`}
              >
                <div className="weaponmod_slot_thumb">
                  <img src={att.image} alt={att.name} draggable={false} />
                  {att.equipped && (
                    <div className="weaponmod_slot_check">
                      <Check />
                    </div>
                  )}
                </div>

                <div className="weaponmod_slot_info">
                  <span className="weaponmod_slot_name">{att.name}</span>
                  {att.price != null && (
                    <span className="weaponmod_slot_price">{formatPrice(att.price)}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="ginshi_modal_actions">
          <button onClick={() => onOpenChange(false)} className="ginshi_btn_primary ginshi_btn_flex_1">
            Übernehmen
          </button>
          <button onClick={() => onOpenChange(false)} className="ginshi_btn_ghost ginshi_btn_flex_1">
            Abbrechen
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeaponModifyModal;
