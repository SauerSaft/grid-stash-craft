## Ziel

Die folgenden Bereiche von `ginshi_*`-CSS-Klassen auf reine Tailwind-Utilities umstellen, **ohne dass sich das Aussehen ändert**:

1. **Panel-Shell** (`EquipmentLayout.tsx`)
   `ginshi_root`, `ginshi_panel`, `ginshi_bg_pattern`, `ginshi_grid_overlay`, `ginshi_body`, `ginshi_sidebar`, `ginshi_content`
2. **Header** (`EquipmentHeader.tsx`)
   `ginshi_header`, `ginshi_brand`, `ginshi_brand_icon`, `ginshi_brand_info`, `ginshi_brand_name` (mit unterschiedlichem Styling für 1./2. span), `ginshi_brand_sub`, `ginshi_close`
3. **Geldwäsche-Page** (`MoneyLaunderingPage.tsx`)
   Alle verwendeten Klassen: `ginshi_section*`, `ginshi_badge*`, `ginshi_grid_tbody`, `ginshi_corner_tl/br`, `ginshi_input_wrapper/prefix/field`, `ginshi_btn_primary`, `ginshi_btn_success`, `ginshi_chip*`, `ginshi_list_header`, `treasury_actions_card/body`, `treasury_input_row`, `launder_owner_banner` (+ `_own`/`_foreign`), `launder_owner_icon/text/title/sub/pct/*`, `launder_capture_track/fill/btn/_active/spin`, `launder_breakdown`, `launder_break_box/_fee/_payout/_label/_value/_arrow`, `launder_progress_card`, `launder_state*`, `launder_progress_track/fill/shine/ticks`

Memory-Regel „NO Tailwind utility classes" wird wie besprochen entfernt.

## Vorgehen

### 1. Tailwind-Config erweitern
In `tailwind.config.ts` ergänzen, damit Tailwind die Marken-Tokens kennt:
- `colors.gold` mit den Gold-Varianten (basiert auf `--gold-rgb`)
- `fontFamily.orbitron`
- `boxShadow.panel` für den großen Panel-Schatten
- `keyframes/animation` für `launder_spin` und den `progress_shine`-Sweep
- evtl. ein paar `backgroundImage` Tokens für die Gradient-Layer (sonst per `bg-[linear-gradient(...)]` arbitrary)

### 2. JSX umschreiben
Jeden Klassennamen 1:1 durch die äquivalenten Tailwind-Utilities ersetzen — exakt mit `vw`-Werten via arbitrary values (`w-[82vw]`, `border-[0.052vw]` usw.), damit das Skalierungsverhalten identisch bleibt. Komplexe Sachen (Filter-Drop-Shadow, mehrlagige Gradients, Clip-Paths für Corner-Markierungen) werden via arbitrary values inline gesetzt:
- `filter-[drop-shadow(...)]`
- `bg-[linear-gradient(...)]`
- `[clip-path:polygon(...)]`
- `[mix-blend-mode:color-dodge]`

### 3. CSS entfernen
Die konvertierten Klassen aus `src/index.css` / `src/custom.css` rauswerfen, damit es keine doppelten Definitionen / toten Klassen gibt. Klassen, die noch von anderen Komponenten genutzt werden (z. B. `ginshi_section`, `ginshi_input_*`, `ginshi_btn_primary`, `ginshi_chip`, `ginshi_corner_*` werden auch von Treasury, Logs, etc. verwendet), bleiben im CSS bestehen — sonst zerlege ich andere Seiten. **Nur Klassen, die ausschließlich in den drei oben genannten Dateien vorkommen, werden gelöscht** (insbesondere alle `launder_*` und `treasury_actions_*`).

### 4. Memory aktualisieren
`mem://index.md` und `mem://style/css-architecture`: die NO-Tailwind-Regel und der `ginshi_`-Prefix-Zwang werden entfernt bzw. abgeschwächt („Tailwind erlaubt, geteilte Patterns dürfen weiterhin in `@layer components` mit `ginshi_`-Prefix leben").

### 5. QA
- Visueller Vergleich Vorher/Nachher im Preview (Screenshot der Geldwäsche-Seite + Panel-Shell)
- Type-Check via Build
- Check, dass kein anderer Bereich Klassen verloren hat

## Wichtige Hinweise / Trade-offs

- **JSX wird deutlich länger.** Eine Zeile wie `<div className="ginshi_panel">` wird zu ~15 Tailwind-Utilities mit arbitrary values. Das ist die Konsequenz aus "Tailwind statt zentralisiertes CSS".
- **Geteilte Klassen** (`ginshi_section`, `ginshi_input_*`, `ginshi_btn_primary`, `ginshi_chip`, `ginshi_corner_*`, `ginshi_list_header`, `ginshi_badge*`) werden in der Geldwäsche-Seite auch inline-Tailwind, **bleiben aber zusätzlich als CSS bestehen**, weil andere Pages (Treasury, Bans, Support, Players, Logs …) sie noch nutzen. Sonst müsste ich ~15 weitere Komponenten anfassen.
- **Pixel-genauigkeit:** Ich übernehme alle `vw`-Werte 1:1 als arbitrary values. Falls Tailwind bei irgendeinem Edge-Case (z. B. `mix-blend-mode`, custom keyframes) abweicht, fixe ich es nachträglich basierend auf dem Screenshot-Vergleich.
- **Geschätzte Größenordnung:** ~600–800 LOC JSX-Änderungen + Config-Erweiterung + CSS-Cleanup. Eine Iteration.

Sag Bescheid wenn ich loslegen soll oder etwas anders priorisieren soll (z. B. nur Panel-Shell + Header zuerst, Geldwäsche separat).