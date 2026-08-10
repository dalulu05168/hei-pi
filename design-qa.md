# Design QA

## Scope

- Reference set: `图/3.png`, `图/4.png`, `图/6.png`, `图/7.png`, `图/8.png`, `图/9.png`, `图/10.png`, `图/15.png`.
- Verification viewport: 2048 × 1152, with the implementation and reference placed in the same comparison image.
- Latest user override applied: the navigation is in the top bar, can be hidden/restored, and the `ACTINVER INSTITUTIONAL CORE` heading is removed.

## Visual checks

- Global shell: single fixed top bar, no duplicated vertical navigation, no page-level scrolling, aligned content canvas.
- Typography: Microsoft YaHei UI / Segoe UI family across modules; numeric columns use tabular figures without switching to a different visual font.
- Color system: deep navy surfaces, muted silver text, blue-gray borders, and yellow as the only primary accent.
- Alignment: KPI cards, analysis panels, tables, and action bars share common horizontal and vertical edges.
- Interaction: bordered cards receive a raised hover treatment; the top navigation can be hidden and restored.
- Market page: combined US/Mexico layout, selectable instruments, period controls, live quote fields, candlesticks, and volume bars.
- Client detail: net-worth trend, allocation, risk metrics, and holdings are populated.
- Trading: overview trend, allocation, liquidity, records, and buy/sell entry controls are populated and aligned.
- Institutional blocks: 12 preloaded reservations, default selection, price trend, volume distribution, table rows, and action summary.

## Functional checks

- Production build: passed.
- Navigation hide/restore: passed.
- Market route switching and periodic refresh: passed.
- No blocking console errors observed during route verification.

final result: passed
