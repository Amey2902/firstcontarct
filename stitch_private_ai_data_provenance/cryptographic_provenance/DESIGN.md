---
name: Cryptographic Provenance
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#8d4b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#b15f00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 3.5rem
    fontWeight: '700'
    lineHeight: 4rem
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0.01em
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: -0.01em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a high-trust, audit-ready operational workspace tailored for enterprise AI security teams, data engineers, and compliance officers. The visual language blends Swiss modernist precision with cryptographic infrastructure cues: stark, pristine clarity over superfluous ornamentation, conveying absolute deterministic truth, data integrity, and forensic transparency.

The aesthetic fuses **Corporate / Modern** rigor with **Technical Minimalism**. It prioritizes dense information architectures, sub-pixel structural alignment, razor-sharp visual separations, and high-legibility contrasts. Interfaces evoke the clinical accuracy of a high-assurance audit room combined with the fluid speed of modern developer platforms.

## Colors

The palette balances clinical off-white canvas surfaces against deep slate typographic values, energized by calibrated cryptographic emeralds and system status accents:

- **Primary Canvas & Surfaces**: Base backdrop relies on `#F8FAFC` (Slate 50), tiered into `#FFFFFF` for primary cards/surfaces and `#F1F5F9` (Slate 100) for inset panels, code tracks, and table headers.
- **Structural Borders**: Architectural gridlines and dividers use `#E2E8F0` (Slate 200) for standard delineations and `#CBD5E1` (Slate 300) for active borders, hover states, and structural dividers.
- **Typography & Core Neutral**: `#0F172A` (Slate 900) ensures authoritative readability for titles and critical values; `#334155` (Slate 700) anchors body prose and secondary metrics; `#64748B` (Slate 500) governs metadata and timestamps.
- **Cryptographic Emerald (Primary)**: `#059669` (Emerald 600) and `#10B981` (Emerald 500) denote verified provenance, valid SHA-256 signatures, pristine training runs, and positive actions.
- **Cyber Cyan (Secondary)**: `#0284C7` (Sky 600) and `#0EA5E9` (Sky 500) signify active data streams, telemetry signals, lineage nodes, and interactive filters.
- **Audit Diagnostics (Feedback)**: `#D97706` (Amber 600) for unconfirmed batches, pipeline warnings, and drift flags; `#DC2626` (Ruby 600) explicitly flags compliance violations, poisoned datasets, and revoked cryptographic attestations.

## Typography

Typography establishes an unambiguous distinction between human-readable administrative summaries and machine-verified cryptographic data:

- **Hanken Grotesk** serves as the primary system face for display, headlines, and general interface text. Its razor-sharp geometry, open counters, and tight aperture ensure frictionless scanning of dense metrics, lineage trees, and permission graphs.
- **JetBrains Mono** anchors all deterministic data: cryptographic hashes (SHA-256, Merkle roots), data schema names, ledger keys, dataset sizes, timestamps, and compliance status indicators.
- **Uppercase Metadata**: When used for badges, table column headers, or inspection labels, apply `label-caps` with uppercase transformation and tracking to guarantee high-density legibility without visual bulk.

## Layout & Spacing

The layout is engineered around a fluid, structural grid system capable of presenting data-dense analytical telemetry:

- **Grid Geometry**: A 12-column layout on desktop viewports (`≥ 1280px`) with fixed structural sidebar anchors (pinned at `260px` or collapsed to `64px`), transitioning to an 8-column layout on tablet (`768px - 1279px`), and a 4-column column-flow on mobile (`< 768px`).
- **Rhythm & Metrics**: Spacing operates strictly on an 8pt architectural rhythm with 4pt micro-adjustments (`space-xs`). Margins compress gracefully on smaller viewports from `2rem` down to `1rem` to maximize mobile viewport utility for dense data logs.
- **Data Densities**: In tabular audit logs and lineage breakdowns, horizontal gutters between cells compress to `space-md` while vertical cell paddings scale down to `space-sm`, maximizing visible verification logs per screen fold.

## Elevation & Depth

This system avoids heavy, blurred atmospheric drop-shadows, which can muddy technical precision. Instead, depth is structured through **Tonal Layering** combined with **Low-Contrast Micro-Borders**:

- **Layer 0 (Canvas Base)**: `#F8FAFC` provides the foundational application background.
- **Layer 1 (Card & Module Surfaces)**: Pure `#FFFFFF` surfaces with a 1px perimeter outline of `#E2E8F0`. Hovering on interactive containers shifts the outline to `#CBD5E1` and introduces a faint, hairline ambient offset (`0 1px 3px 0 rgba(15, 23, 42, 0.04)`).
- **Layer 2 (Flyouts, Menus & Inset Drawers)**: `#FFFFFF` floating panels bound by 1px `#CBD5E1` paired with a directional, high-clarity shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 10px 15px -3px rgba(15, 23, 42, 0.04)`.
- **Layer 3 (Modals & Audit Inspections)**: Surface `#FFFFFF` paired with an overlay backdrop of `#0F172A` at 35% opacity, focused by a sharp dual shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.
- **Inset Recesses**: Data query consoles, raw JSON payloads, and hash inspector fields sit visually recessed within containers using `#F1F5F9` fills and inset borders (`box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04)`).

## Shapes

The interface embraces a **Soft (Level 1)** geometry, establishing a precise, industrial identity suited for enterprise governance:

- **Standard Elements (Buttons, Inputs, Badges)**: 0.25rem (`rounded-sm`) radius, creating crisp, defined perimeter bounds without brutalist sharpness.
- **Medium Panels (Cards, Modal Windows, Inspector Trays)**: 0.5rem (`rounded-lg`) radius, preserving structured alignment in multi-column dashboards.
- **Large Contextual Zones (Slide-out Drawers, Main Viewport Regions)**: 0.75rem (`rounded-xl`) maximum radius.
- **Data Chips & Verification Indicators**: Fixed at 0.25rem radius or complete capsule tags when displaying continuous cryptographic hash strings or audit tags.

## Components

### Buttons
- **Primary (Action/Verify)**: Solid `#059669` fill with white text, font weight 600, border radius `0.25rem`. On hover, transitions to `#047857` with a subtle elevation shift. Focus ring uses an outer 2px offset in `#10B981`.
- **Secondary (Inspect/Filter)**: Solid `#FFFFFF` fill with 1px border of `#CBD5E1` and text in `#0F172A`. On hover, background shifts to `#F8FAFC` and border to `#94A3B8`.
- **Tertiary/Ghost**: Transparent fill with `#334155` text; hover state utilizes `#F1F5F9`.
- **Destructive (Revoke Attestation)**: `#DC2626` fill with white text; hover shifts to `#B91C1C`.

### Form Fields & Inputs
- **Text Inputs & Filter Selectors**: `#FFFFFF` background with a 1px border in `#CBD5E1`. Internal text is `#0F172A`, placeholder is `#94A3B8`. 
- **Focus State**: Border transitions to `#0284C7` with a non-blur ring: `0 0 0 1px #0284C7`.
- **Cryptographic Input Fields**: Monospaced typography (`JetBrains Mono`), `#F8FAFC` surface fill, and an inline one-click copy accessory icon.

### Cards & Analytical Panels
- Base background `#FFFFFF` enclosed by a 1px solid `#E2E8F0` border.
- Header bars within cards feature optional bottom dividing borders (`#E2E8F0`) with uppercase subheadings (`label-caps`) in `#64748B`.

### Status Badges & Chips
- **Verified State**: `#ECFDF5` background, `#059669` text, 1px border `#A7F3D0`. Prefixed with a live emerald dot (`#10B981`).
- **Telemetry/Active State**: `#F0F9FF` background, `#0284C7` text, 1px border `#BAE6FD`.
- **Under Audit State**: `#FFFBEB` background, `#D97706` text, 1px border `#FDE68A`.
- **Violation State**: `#FEF2F2` background, `#DC2626` text, 1px border `#FECACA`.

### Checkboxes & Radios
- **Checkboxes**: 16px square, 1px border `#CBD5E1`, 0.25rem radius. Checked state applies `#059669` fill and a crisp white check glyph.
- **Radio Buttons**: 16px circle with a centered 6px solid `#059669` indicator when selected.

### Lineage Graph Nodes & Tree Elements
- Rectangular containers rendered in `#FFFFFF`, with a left accent border: 3px solid `#059669` (for verified inputs) or `#DC2626` (for poisoned inputs). Connection paths between nodes are rendered in 1.5px `#CBD5E1` dashed or solid vector lines.

### Hash & Provenance String Snippets
- Visual badge using `#F1F5F9` fill, `#0F172A` text, 1px border `#E2E8F0`, styled in `label-code`. On hover, highlights the entire snippet and reveals full string validation tooltips.