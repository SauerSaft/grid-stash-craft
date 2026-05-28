import iconEquipment from "@/assets/icon_ui_equipment.png";

const EquipmentHeader = () => {
  return (
    <header className="relative z-10 flex h-[3.4vw] min-h-[3.4vw] flex-shrink-0 items-center border-b-[0.052vw] border-white/[0.07] px-[1.2vw]">
      <div className="flex items-center gap-0">
        <img
          src={iconEquipment}
          alt=""
          draggable={false}
          className="mt-[0.3vw] h-[2.1vw] w-[2.1vw] flex-shrink-0 object-contain [filter:drop-shadow(rgba(255,215,56,0.75)_-0.85vw_0_1.04vw)]"
        />
        <div className="ml-[-0.78vw] flex flex-col gap-[0.1vw]">
          <div className="flex items-baseline gap-[0.15vw] leading-none">
            <span className="font-orbitron text-[1.15vw] font-bold tracking-[-0.02em] text-white [text-shadow:rgba(255,255,255,0.25)_0_0_0.63vw]">
              LATENIGHT
            </span>
            <span className="-ml-[0.15vw] inline-block skew-x-[-10deg] bg-[linear-gradient(188deg,rgb(255,217,0)_0%,rgba(202,172,0,0.85)_100%)] bg-clip-text font-orbitron text-[1.65vw] font-bold text-transparent">
              V
            </span>
          </div>
          <span className="text-[0.68vw] font-semibold uppercase leading-none tracking-[0.06em] text-[rgba(255,217,0,0.75)]">
            Ausrüstungen
          </span>
        </div>
      </div>
      <button
        type="button"
        className="ml-auto flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[var(--radius)] border border-destructive/25 bg-destructive/15 p-0 text-destructive transition-colors hover:border-destructive/40 hover:bg-destructive/25"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 1L13 13M13 1L1 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </header>
  );
};

export default EquipmentHeader;
