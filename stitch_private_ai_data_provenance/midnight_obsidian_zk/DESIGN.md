---
name: Midnight Obsidian ZK
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#ffb3ad'
  on-tertiary: '#68000a'
  tertiary-container: '#ff7a73'
  on-tertiary-container: '#79000e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.025em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: -0.01em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: -0.005em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies a **dark cyber-minimalist luxury** aesthetic engineered for mission-critical enterprise zero-knowledge cryptography and AI governance. Built for cryptographers, compliance officers, and AI platform architects, the interface evokes sovereign authority, absolute mathematical precision, and unyielding privacy.

The emotional tone balances institutional trustworthiness with bleeding-edge cryptographic capability: quiet, dark obsidian environments, laser-focused data density, and razor-sharp clarity without theatrical sci-fi clutter. The interface communicates silent strength—data provenance verified by mathematics, requiring neither blind trust nor computational compromise.

## Colors

The palette leverages a deep obsidian hierarchy anchored by `#0B0F17` as the default canvas and base background. Elevated surfaces progress incrementally through tonal dark neutrals:
- **Surface Canvas**: `#0B0F17`
- **Surface Layer 1 (Card/Container)**: `#111827`
- **Surface Layer 2 (Raised Modules)**: `#162032`
- **Surface Layer 3 (Overlays/Popovers)**: `#1E293B`
- **Border / Structural Stroke**: `#1F2937` with elevated hover highlights at `#374151`

Accents carry strict semantic and cryptographic functions:
- **Primary Emerald (`#10B981`)**: Represents verified zero-knowledge state, validated provenance proofs, healthy pipeline integrity, and primary cryptographic executions.
- **Secondary Cyan (`#06B6D4`)**: Represents active ZK computation, pipeline orchestration, Midnight protocol hooks, and interactive anchors.
- **Tertiary Crimson (`#EF4444`)**: Signifies cryptographic anomalies, failed consensus, tampered hash trees, non-compliant datasets, and emergency revocation controls.
- **Text & Foreground Hierarchy**: High-legibility pure text `#F9FAFB` for primary readouts, `#9CA3AF` for metadata/labels, and `#4B5563` for inactive or disabled states.

## Typography

The typographic hierarchy establishes a structural contrast between modern humanist precision and rigid cryptographic data processing:
- **Headlines (`Plus Jakarta Sans`)**: Delivers geometric structure and executive authority for page titles, modal headlines, and primary metric overviews.
- **Body Text (`Inter`)**: Neutral, highly legible screen typography optimized for dense analytical logs, data schemas, and administrative documentation.
- **Data & Hashes (`JetBrains Mono`)**: Dedicated to hexadecimal strings, Merkle tree nodes, zero-knowledge circuit status indicators, timestamps, and key fingerprints. Numbers rendered with tabular figures ensure strict vertical alignment in financial and cryptographic audit tables.

## Layout & Spacing

The layout is built on a 12-column fluid grid system pinned to a maximum desktop container width of `1600px` to maintain dense monitoring efficiency across ultrawide command centers.

### Adaptive Breakpoints
- **Mobile (`< 768px`)**: Single-column vertical flow with `margin-mobile` (16px) margins. Tables condense into accordion-backed data modules. Hashes collapse into truncated formats (`0x1a2b...9f8c`) with one-touch copy targets.
- **Tablet (`768px - 1024px`)**: 6-column grid with `gutter-sm` (16px) gutters and 24px canvas margins. Side navigation shifts into an expandable drawer.
- **Desktop (`> 1024px`)**: Full 12-column architecture with persistent fixed utility sidebars (`280px`), structured data canvases, `gutter` (24px), and `margin` (32px).

Internal component rhythm is strictly proportional: inner padding matches `space-md` or `space-lg`, while element gaps within cards adhere to `space-xs` and `space-sm` increments.

## Elevation & Depth

This design system rejects deep, theatrical skeuomorphic drops and instead achieves depth through **tonal layering**, **1px crisp border framing**, and **micro-glow diffusion**:

1. **Layer 0 (Canvas Base)**: `#0B0F17` — Infinite floor without borders.
2. **Layer 1 (Card & Module Foundation)**: `#111827` framed by a 1px solid stroke of `#1F2937`. No drop shadow.
3. **Layer 2 (Interactive Cards / Hover / Dropdowns)**: `#162032` framed by `#374151`. Supported by a subtle directional shadow: `0 4px 20px -2px rgba(0, 0, 0, 0.5)`.
4. **Layer 3 (Modals / Overlays)**: `#1E293B` framed by `#4B5563` with a deep veil backdrop (`rgba(11, 15, 23, 0.85)` with `backdrop-filter: blur(8px)`).

**Cryptographic Glows**: Interactive verified elements or alert boundaries utilize pinpoint, low-spread ambient glows rather than blurry shadows:
- Verified State: `0 0 12px rgba(16, 185, 129, 0.15)`
- Processing / Active Midnight Node: `0 0 12px rgba(6, 182, 212, 0.15)`
- Breach / Verification Failure: `0 0 12px rgba(239, 68, 68, 0.2)`

## Shapes

The design system maintains a **Soft (`1`)** shape language, applying tight, engineered radiuses to reflect technical discipline:
- Standard inputs, buttons, chips, and small modules use `0.25rem` (4px).
- Structural dashboard cards, data tables, and cryptographic commitment panels use `rounded-lg` (`0.5rem` / 8px).
- Complex overlays, cryptographic modal dialogs, and slideouts use `rounded-xl` (`0.75rem` / 12px).
- Full circular rounding is restricted exclusively to status beacon indicators and circular avatar key identities.

## Components

### Buttons
- **Primary (ZK Action / Sign Proof)**: Solid `#10B981` background, `#0B0F17` high-contrast bold text. Hover shifts to `#059669` with an emerald micro-glow.
- **Secondary (Inspect Circuit / Node Query)**: Transparent `#111827` surface with a 1px `#1F2937` stroke and `#06B6D4` text. On hover, border shifts to `#06B6D4` with `rgba(6, 182, 212, 0.05)` fill.
- **Destructive (Revoke Access / Flag Tampering)**: 1px `#EF4444` stroke with `#EF4444` text and dark translucent fill (`rgba(239, 68, 68, 0.08)`).
- **Height & Spacing**: 36px default height for compact data density; `space-md` horizontal padding; `label-caps` or `code-md` typography.

### Status Indicators & Badges
- Constructed with a 1px border and low-opacity surface:
  - **Verified**: `#10B981` text, `rgba(16, 185, 129, 0.1)` background, `rgba(16, 185, 129, 0.25)` border, accompanied by a 6px pulsing emerald beacon.
  - **Computing Proof**: `#06B6D4` text, `rgba(6, 182, 212, 0.1)` background, `rgba(6, 182, 212, 0.25)` border.
  - **Tampered / Non-Compliant**: `#EF4444` text, `rgba(239, 68, 68, 0.1)` background, `rgba(239, 68, 68, 0.3)` border.

### Input Fields
- Deep charcoal background `#0B0F17`, 1px border `#1F2937`, text `#F9FAFB`.
- Focus state: Border transitions to `#06B6D4` with zero ambient ring offset, preserving sharp, high-contrast borders. Monospace font enabled by default on hash or cryptographic key input variants.

### Checkboxes & Radios
- 16x16px boxes with `#111827` background and `#374151` boundary. Checked state: `#10B981` solid fill with crisp dark tick mark.

### Cryptographic Commitment Cards
- Specialized card container featuring an integrated top utility strip: displays proof protocol, timestamp in `code-sm`, and verification state.
- Body displays dataset Merkle roots, Midnight consensus validation stamps, and zero-knowledge generation metrics.
- Outer border features a subtle gradient highlight from `#1F2937` to `#374151`.

### Audit Trail Tables
- Low-profile headers with uppercase `label-caps` typography and `#4B5563` dividers.
- Alternating subtle rows (`#111827` and `#0E1420`) with hover row highlight `#162032`.
- Hash columns leverage `JetBrains Mono` with one-click copy feedback micro-animations and inline ZK validation checkmarks.