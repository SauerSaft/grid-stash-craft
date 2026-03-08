import iconEquipment from "@/assets/icon_ui_equipment.png";

const EquipmentHeader = () => {
  return (
    <header className="ginshi_header">
      <div className="ginshi_brand">
        <img
          className="ginshi_brand_icon"
          src={iconEquipment}
          alt=""
          draggable={false}
        />
        <div className="ginshi_brand_info">
          <div className="ginshi_brand_name">
            <span>LATENIGHT</span>
            <span>V</span>
          </div>
          <span className="ginshi_brand_sub">Ausrüstungen</span>
        </div>
      </div>
      <button className="ginshi_close">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </header>
  );
};

export default EquipmentHeader;
