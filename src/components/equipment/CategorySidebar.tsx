import { useState } from "react";

interface Category {
  id: string;
  label: string;
}

const categories: Category[] = [
  { id: "waffen-shop", label: "Waffen Shop" },
  { id: "item-shop", label: "Item Shop" },
  { id: "waffenkammer", label: "Waffenkammer" },
  { id: "fraklager", label: "Fraklager" },
  { id: "fraktionskasse", label: "Fraktionskasse" },
  { id: "mitglieder", label: "Mitglieder" },
  { id: "logs", label: "Logs" },
  { id: "logs-v2", label: "Logs V2" },
];

interface CategorySidebarProps {
  selected: string;
  onSelect: (id: string) => void;
}

const WeaponIcon = ({ active }: { active: boolean }) => (
  <svg width="16" height="13" viewBox="0 0 586 400" fill="none">
    <g opacity={active ? "1" : "0.35"}>
      <path
        d="M 104 31 L 94.5 41 C 87.838131 48.012493 80.21061 48.523224 70.5 45 C 65.730485 43.269515 60.365376 38.273176 56 42.5 C 51.841622 46.526396 57.770564 49.777478 62 51.5 C 79.34484 58.564032 89.137238 68.757098 85 90 C 80.862762 111.2429 66.50779 108.84144 54 111 L 553 119 C 557.63057 118.95226 558.11925 111.23169 560 107 L 564 98 L 564 42 L 555 31 L 330 31 L 320 42 L 265 42 L 258 31 L 104 31 z M 259.25 131.5 L 291 131.5 C 327.00883 131.5 327.68261 189.5 291 189.5 L 259.25 189.5 C 225.79948 189.5 220.84579 131.5 259.25 131.5 z"
        fill={active ? "hsl(48, 100%, 50%)" : "hsl(48, 100%, 50%)"}
      />
    </g>
  </svg>
);

const CategorySidebar = ({ selected, onSelect }: CategorySidebarProps) => {
  return (
    <nav className="ginshi_nav">
      {categories.map((cat) => {
        const isSelected = cat.id === selected;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`ginshi_nav_item ${isSelected ? "ginshi_nav_item_active" : ""}`}
          >
            <div className={`ginshi_nav_indicator ${isSelected ? "ginshi_nav_indicator_active" : ""}`} />
            <WeaponIcon active={isSelected} />
            <span className="ginshi_nav_label">{cat.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default CategorySidebar;
