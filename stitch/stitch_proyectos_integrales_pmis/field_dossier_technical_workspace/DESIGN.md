---
name: Field & Dossier Technical Workspace
colors:
  surface: '#f8faf6'
  surface-dim: '#d9dad7'
  surface-bright: '#f8faf6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f0'
  surface-container: '#edeeeb'
  surface-container-high: '#e7e9e5'
  surface-container-highest: '#e1e3df'
  on-surface: '#191c1a'
  on-surface-variant: '#414944'
  inverse-surface: '#2e312f'
  inverse-on-surface: '#f0f1ed'
  outline: '#717974'
  outline-variant: '#c0c8c3'
  surface-tint: '#3a6756'
  primary: '#023627'
  on-primary: '#ffffff'
  primary-container: '#1f4d3d'
  on-primary-container: '#8dbda8'
  inverse-primary: '#a1d1bc'
  secondary: '#80552b'
  on-secondary: '#ffffff'
  secondary-container: '#fec390'
  on-secondary-container: '#794e25'
  tertiary: '#610c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#82220e'
  on-tertiary-container: '#ff9680'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcedd7'
  primary-fixed-dim: '#a1d1bc'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#214f3f'
  secondary-fixed: '#ffdcc0'
  secondary-fixed-dim: '#f5bb88'
  on-secondary-fixed: '#2d1600'
  on-secondary-fixed-variant: '#653e16'
  tertiary-fixed: '#ffdad3'
  tertiary-fixed-dim: '#ffb4a4'
  on-tertiary-fixed: '#3e0500'
  on-tertiary-fixed-variant: '#852410'
  background: '#f8faf6'
  on-background: '#191c1a'
  surface-variant: '#e1e3df'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  data-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 22px
    letterSpacing: -0.02em
  data-mono-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-tabular:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  spacing-3xs: 0.125rem
  spacing-2xs: 0.25rem
  spacing-xs: 0.5rem
  spacing-sm: 0.75rem
  spacing-md: 1rem
  spacing-lg: 1.5rem
  spacing-xl: 2rem
  spacing-2xl: 3rem
  spacing-3xl: 4rem
  layout-margin-mobile: 1rem
  layout-margin-tablet: 1.5rem
  layout-margin-desktop: 2rem
  table-gutter: 0.75rem
---

## Brand & Style

This design system is tailored for an environmental, forestry, and civil engineering consultancy operating under stringent regulatory and field-verified standards. The visual philosophy balances the tactile precision of archival technical reports (paper stock, cartographic precision, clean tabular ledgers) with modern enterprise software utility.

### Core Philosophy & Target Audience
- **Audience:** Environmental auditors, forestry engineers, civil project managers, and executive directors reviewing compliance dossiers, environmental impact studies (EIA), and infrastructure milestones.
- **Tone:** Methodical, unhurried, authoritative, and scientifically rigorous. The interface eliminates decorative noise, prioritizing data integrity, spatial clarity, and dense technical readability.
- **Aesthetic Movement:** High-utility Modernist Corporate with archival tactile grounding. It avoids playful rounded shapes and neon accents in favor of razor-sharp data containers, disciplined hairline dividers, and subdued organic tones derived from field surveys.

## Colors

The palette is derived directly from raw survey materials: uncoated archival paper, deep pine canopy, weathered loam, and industrial field signage.

### Roles & Allocations
- **Primary (`#1F4D3D` - Deep Institutional Pine):** Applied to top-level navigation, structural headers, active tab underlines, primary commitment buttons, and validated environmental status indicators.
- **Secondary (`#9A6B3F` - Loam Earth):** Used for tasks in progress, pending field validations, mid-tier notices, and milestone markers that require engineer review without blocking operations.
- **Tertiary (`#B4462F` - Signal Ochre Red):** Reserved strictly for critical technical alerts, missed statutory deadlines, non-compliance findings, rejected environmental permits, and destructive actions.
- **Neutral (`#1C1F1D` - Carbon Ink):** Primary body text, tabular data, and high-emphasis data cells.
- **Base Canvas (`#F7F6F2` - Archival Stock):** The default root canvas, giving the workspace the visual comfort and low eye-strain of dense technical documentation.
- **Muted Surfaces (`#EFECE6` / `#E5E0D8`):** Table header backgrounds, sidebar chrome, well backgrounds, and active row hovers.
- **Hairline Borders (`#DDD8CE`):** All internal borders, cell dividers, and input field strokes.

### Executive Dark Mode
Executive presentation dashboards switch dynamically to a dense slate-charcoal canvas (`#141715`) with surface elevation panels (`#1B1F1D`), retaining the deep green (`#2D6A55`), soft amber (`#B58253`), and brick red (`#C95A43`) at adjusted luminosities to maintain contrast ratios compliant with WCAG AAA for numerical data.

## Typography

The typographic hierarchy prioritizes rapid scannability, structural clarity, and unambiguous scientific notation.

- **Primary Typeface (`Hanken Grotesk`):** Clean, crisp, non-distracting neo-grotesque architecture. Used for all structural titles, navigation elements, inputs, and analytical prose. Headings use medium and semi-bold weights without excessive mass.
- **Technical & Tabular Typeface (`JetBrains Mono`):** Assigned to project reference codes (e.g., `EIA-2024-089-B`), UTM geographical coordinates, cadastral parcel IDs, budget sums, soil density figures, and tabular row indices.
- **Tabular Figures & Metrics:** Every numeric display within analytical tables and metadata blocks must enforce `font-feature-settings: "tnum" 1, "zero" 1` to ensure perfect vertical alignment across ledger columns.

## Layout & Spacing

The layout is built on a disciplined, information-dense 12-column analytical grid with fixed left-hand hierarchical navigation and fluid content canvases designed to maximize horizontal space for multi-column data sheets.

### Spacing Discipline
- **Scale:** An arithmetic 4px / 8px scale ensuring predictable alignment across charts, forms, and data tables.
- **Data Densities:**
  - *Standard Form View:* 16px internal padding on cards and panels with 24px structural gap.
  - *Technical Ledger / Table View:* Compact 8px vertical cell padding and 12px horizontal padding to support 15+ column inspections without unnecessary scrolling.

### Breakpoints & Adaptability
- **Desktop (`>= 1280px`):** Permanent 260px left sidebar for multi-tier project navigation; main workspace expands to 100% viewport width with strict max-width thresholds (`1680px`) on single-column documentation views.
- **Tablet (`768px - 1279px`):** Sidebar collapses to an icon-and-code rail (64px); tables activate horizontal sticky headers and locked primary key columns.
- **Mobile (`< 768px`):** Content stacks into single cards; ledger tables convert to high-density summary list rows with tap-to-expand details.

## Elevation & Depth

Visual hierarchy does not rely on diffused drop shadows or blurred glassmorphism, which introduce visual ambiguity in dense technical tools. Depth is established through **architectural tonal layering** and **hairline demarcation**.

### Surface Layers
1. **Base Foundation (`#F7F6F2`):** The unadorned canvas for top-level pages.
2. **Elevated Panels & Dossier Cards (`#FFFFFF`):** High-focus workspaces, data inspection drawers, and editable records.
3. **Subdued Wells & Ledger Headers (`#EFECE6`):** Column header rows, read-only calculation sidebars, and grouped field metadata.

### Outlines & Boundaries
- All cards, panels, and input fields use a consistent 1px solid hairline (`#DDD8CE` in standard mode; `#2E3330` in dark mode).
- Modals and critical floating flyouts use a single structural drop shadow with zero spread: `0 4px 16px -2px rgba(28, 31, 29, 0.08)`, paired with a strict 1px border.

## Shapes

The interface embraces a functional, sharp-edged aesthetic with minimal corner softening (`roundedness: 1`).

- **Containers & Panels:** Softened with a precise `4px` radius (`rounded-sm`), preventing visual distraction while avoiding brutalist severity.
- **Badges, Tags & Status Pills:** Bounded by a uniform `2px` or `4px` radius; fully rounded pills are prohibited to maintain the architectural, dossier-like character.
- **Interactive Controls (Buttons & Inputs):** Fixed at `4px` radius to align with adjacent table cells and structural grids.

## Components

### Buttons
- **Primary:** Solid `#1F4D3D` fill, white `#FFFFFF` text, 1px `#1F4D3D` border, 4px radius. Font: `Hanken Grotesk` 13px weight 600. Active click state darkens to `#16392D`.
- **Secondary / Technical:** `#FFFFFF` background with 1px hairline border `#DDD8CE`, text `#1C1F1D`. Hover shifts background to `#EFECE6`.
- **Destructive:** Solid `#B4462F` fill, white text, for immediate irrecoverable operations (e.g., revoking license submission).
- **Subtle / Table Action:** Ghost background, `#1F4D3D` text, 1px transparent border, revealing a `#EFECE6` background on hover.

### Status Badges & Indicators
Status indicators are structured as compact, squared-off chips (2px radius) with an explicit 1px tinted border:
- **Validated / Approved / On Track:** Light pine tint `#E8EFEA`, border `#BDD6C9`, text `#1F4D3D`.
- **In Progress / Field Survey Ongoing:** Loam sand tint `#F6F1EB`, border `#E3D1C0`, text `#9A6B3F`.
- **Expired / Non-Compliant / Rejected:** Pale signal tint `#F9EBE8`, border `#EDBDB4`, text `#B4462F`.
- **Format:** Preceded by a 6px solid circular dot or technical code (e.g., `REV-REQ`).

### Data Tables & Ledgers
- **Header Row:** Background `#EFECE6`, text in `Hanken Grotesk` 11px uppercase weight 600 with `letter-spacing: 0.05em`. Bottom border 1.5px solid `#CCC6B8`.
- **Data Rows:** Background alternating between `#FFFFFF` and `#FAF9F6`. Height fixed at 36px (compact) or 44px (default). Internal borders: 1px solid `#EBE7DE`.
- **Numeric & Coordinate Alignment:** Right-aligned, using `JetBrains Mono` 13px with tabular figures enabled.
- **Row Selection:** Indicated by a 3px left border in `#1F4D3D` and subtle background tint `#F2F5F3`.

### Input Fields & Selects
- **Default State:** Background `#FFFFFF`, 1px border `#DDD8CE`, text `#1C1F1D` in 14px. Padding: 8px 12px.
- **Focus State:** 1px border `#1F4D3D` with an auxiliary 2px outer outline of `rgba(31, 77, 61, 0.15)`. No excessive blur.
- **Technical Units:** Append fixed monospaced labels on the right edge (e.g., `m³`, `ha`, `kg/m²`, `WGS84`) set in `#6E736E` background-subdued caps.

### Dossier Cards & Panels
- **Structure:** White container on `#F7F6F2` canvas, framed with a 1px border `#DDD8CE`.
- **Card Header:** Separated by a 1px hairline divider with document identifier badge positioned top-right (e.g., `SEC-04 // HYDROLOGY`).
- **Footer Metadata:** Compact 12px text in monospaced font showing last surveyor timestamp, cryptographic signature status, and audit revision ID.