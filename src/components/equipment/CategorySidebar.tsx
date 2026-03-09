interface Category {
  id: string;
  label: string;
  icon: "weapon" | "person";
}

const categories: Category[] = [
  { id: "waffen-shop", label: "Waffen Shop", icon: "weapon" },
  { id: "item-shop", label: "Item Shop", icon: "weapon" },
  { id: "waffenkammer", label: "Waffenkammer", icon: "weapon" },
  { id: "fraklager", label: "Fraklager", icon: "weapon" },
  { id: "loadouts", label: "Loadouts", icon: "weapon" },
  { id: "fraktionskasse", label: "Fraktionskasse", icon: "weapon" },
  { id: "mitglieder", label: "Mitglieder", icon: "person" },
  { id: "fraktionen", label: "Fraktionen", icon: "person" },
  { id: "logs", label: "Logs", icon: "weapon" },
];

interface CategorySidebarProps {
  selected: string;
  onSelect: (id: string) => void;
}

const WeaponIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="16" viewBox="0 0 586 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity={active ? "1" : "0.35"}>
      <path
        fillRule="evenodd"
        d="M 104 31 L 94.5 41 C 87.838131 48.012493 80.21061 48.523224 70.5 45 C 65.730485 43.269515 60.365376 38.273176 56 42.5 C 51.841622 46.526396 57.770564 49.777478 62 51.5 C 79.34484 58.564032 89.137238 68.757098 85 90 C 80.862762 111.2429 66.50779 108.84144 54 111 C 44.605682 112.62125 35.684815 112.57989 31 117 C 21.691257 125.78278 30.374381 135.57293 37 135 C 67.399774 132.37128 92.804902 155.62922 79 186 L 64 219 L 80 220 L 25 346 L 162 364 L 204 214 C 206.86761 203.75852 220.37594 197.49034 231 197 L 296 194 C 309.47228 193.3782 324.68919 181.28718 327 168 L 331 145 C 332.66023 135.45366 343.31086 126.09689 353 126 L 453 125 L 456 120 L 553 119 C 557.63057 118.95226 558.11925 111.23169 560 107 L 564 98 L 564 42 L 555 31 L 330 31 L 320 42 L 265 42 L 258 31 L 104 31 z M 259.25 131.5 L 291 131.5 C 327.00883 131.5 327.68261 189.5 291 189.5 L 259.25 189.5 C 225.79948 189.5 220.84579 131.5 259.25 131.5 z M 259.25 133.25 C 222.71575 133.12837 228.89926 188.45692 259.25 187.75 C 245.61922 169.21195 244.96103 150.90605 259.25 133.25 z"
        fill={active ? "hsl(48, 100%, 50%)" : "hsl(48, 100%, 50%)"}
      />
    </g>
  </svg>
);

const PersonIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity={active ? "1" : "0.35"}>
      <path
        d="M 12 2 C 6.48 2 2 6.48 2 12 C 2 17.52 6.48 22 12 22 C 17.52 22 22 17.52 22 12 C 22 6.48 17.52 2 12 2 z M 12 5 C 13.66 5 15 6.34 15 8 C 15 9.66 13.66 11 12 11 C 10.34 11 9 9.66 9 8 C 9 6.34 10.34 5 12 5 z M 12 12 C 13.65 12 15.29 12.6 16.6 13.9 C 16.75 13.98 16.88 14.07 17.02 14.14 C 17 14.43 16.96 14.71 16.89 14.99 C 16.5 16.28 15.65 17.37 14.5 17.99 C 13.26 18.64 12 18.5 12 18.5 C 12 18.5 10.74 18.64 9.5 17.99 C 8.35 17.37 7.5 16.28 7.11 14.99 C 7.04 14.71 7 14.43 6.98 14.14 C 7.12 14.07 7.25 13.98 7.4 13.9 C 8.71 12.6 10.35 12 12 12 z"
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
            {cat.icon === "person" ? <PersonIcon active={isSelected} /> : <WeaponIcon active={isSelected} />}
            <span className="ginshi_nav_label">{cat.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default CategorySidebar;
