---
name: Verified Paper
colors:
  surface: '#fcf9f2'
  surface-dim: '#dcdad3'
  surface-bright: '#fcf9f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ec'
  surface-container: '#f0eee7'
  surface-container-high: '#ebe8e1'
  surface-container-highest: '#e5e2db'
  on-surface: '#1c1c18'
  on-surface-variant: '#45464d'
  inverse-surface: '#31312c'
  inverse-on-surface: '#f3f0ea'
  outline: '#76777e'
  outline-variant: '#c6c6ce'
  surface-tint: '#535e7b'
  primary: '#09152e'
  on-primary: '#ffffff'
  primary-container: '#1f2a44'
  on-primary-container: '#8691b0'
  inverse-primary: '#bbc6e7'
  secondary: '#845400'
  on-secondary: '#ffffff'
  secondary-container: '#ffb958'
  on-secondary-container: '#744900'
  tertiary: '#1f1400'
  on-tertiary: '#ffffff'
  tertiary-container: '#382804'
  on-tertiary-container: '#a78f61'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#bbc6e7'
  on-primary-fixed: '#0f1b34'
  on-primary-fixed-variant: '#3b4662'
  secondary-fixed: '#ffddb6'
  secondary-fixed-dim: '#ffb958'
  on-secondary-fixed: '#2a1800'
  on-secondary-fixed-variant: '#643f00'
  tertiary-fixed: '#fcdfab'
  tertiary-fixed-dim: '#dfc391'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#57441d'
  background: '#fcf9f2'
  on-background: '#1c1c18'
  surface-variant: '#e5e2db'
  paper-bg: '#FAF7F0'
  ink-navy: '#1F2A44'
  verified-gold: '#C98A2C'
  success-sage: '#5E7A63'
  error-brick: '#B4482F'
  rule-grey: '#D8D2C4'
typography:
  display-lg:
    fontFamily: Source Serif 4
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-mono:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-caps:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
---

## Brand & Style

The brand personality is authoritative yet accessible—positioning itself as the "official record" of student life. It avoids the fleeting trends of social media apps in favor of a "Verified Paper" aesthetic. This style draws inspiration from academic journals, high-end stationery, and physical credentials.

The design movement is **Modern Editorial**. It prioritizes legibility, structured information density, and a tactile feel achieved through color and linework rather than shadows. The UI should evoke the feeling of a freshly printed document: crisp, permanent, and trustworthy. It is designed for college students who require a reliable tool for high-stakes campus navigation, from digital ID entry to academic scheduling.

## Colors

The palette is anchored by a warm, off-white "Paper" base, which reduces eye strain compared to pure white and provides a sophisticated, organic foundation. 

- **Ink Navy** serves as the primary color for all text, primary buttons, and structural elements, mimicking high-quality printing ink.
- **Verified Gold** is reserved strictly for trust signals, "verified" states, and key interactive highlights, functioning like a foil stamp on a diploma.
- **Success Sage** and **Error Brick** are muted to maintain the editorial tone, ensuring that alerts do not break the sophisticated atmosphere of the app.
- **Rule Grey** is used for the 1px borders that define the grid, acting as "guides" on a page.

## Typography

This system utilizes a high-contrast typographic pairing to establish its "Official" voice. 

- **Headlines:** Use **Source Serif 4**. It provides a scholarly, trustworthy weight to page titles and section headers. 
- **Body & UI:** **Public Sans** is used for all functional text. It is a clean, institutional grotesk that ensures high legibility in dense data views.
- **Data & Metrics:** **IBM Plex Mono** is used for numeric values, student ID numbers, timestamps, and status codes. This monospaced choice reinforces the "database" and "verified record" nature of the application.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy that mimics the margins of a printed journal. 

- **Mobile:** A 4-column grid with 20px outside margins.
- **Desktop/Tablet:** A 12-column grid with 40px margins, centered with a maximum content width of 1200px to maintain line-length readability.
- **Rhythm:** All spacing is based on a 4px baseline, but the system favors "Generous Internal Padding" within cards (24px) to ensure the UI feels airy and premium. Elements should be aligned to the grid rules strictly, creating a sense of structured order.

## Elevation & Depth

This system intentionally rejects shadows and blurs. Depth is communicated through **Tonal Layers and Rule Lines**.

- **Level 0 (Base):** The Paper (#FAF7F0) background.
- **Level 1 (Cards/Surface):** Flat white (#FFFFFF) containers or Paper-colored containers defined by a 1px Rule Grey (#D8D2C4) border.
- **Interaction:** Depth is signaled by color fills or border-weight changes rather than lifting the element off the page. When an element is pressed, it should feel like it is being "stamped" into the paper, not floating above it.

## Shapes

The shape language balances the "Official" (sharp/rectilinear) with the "Modern" (soft/approachable).

- **Cards:** Use a consistent 12px radius. This is soft enough to feel modern but structured enough to feel like a physical card.
- **Buttons/Actions:** Use an 8px radius. This slightly tighter corner provides a more "active" and "precise" feel compared to the layout cards.
- **Tags/Badges:** Use a full "Pill" radius for status tags to distinguish them clearly from structural elements.

## Components

### Verified Badge
The signature element of the system. It is a circular "Stamp" motif using the **Verified Gold** color. It should feature a 1.5px stroke icon (check or crest) and is used exclusively for verified student identities or official campus notices.

### Buttons
- **Primary:** Solid **Ink Navy** fill with White text. 8px radius.
- **Secondary:** **Rule Grey** 1px border with **Ink Navy** text.
- **Tertiary:** Text-only with an underline on hover, using the Mono font for a "technical" feel.

### Cards
Cards must have a 1px **Rule Grey** border and no shadow. The header of a card should often be separated by a 1px horizontal rule. Use 24px padding for "Editorial" cards and 16px for "Data" cards.

### Input Fields
Inputs are rectangular with an 8px radius and a 1px **Rule Grey** border. When focused, the border changes to **Ink Navy** (2px) or **Verified Gold**. Labels should use the `label-caps` typography style.

### Iconography
All icons must use a consistent 1.5px stroke weight with capped ends. Avoid filled icons unless used as a status indicator.

### Student ID Component
A specialized card component that mimics the physical ID, using a subtle vertical layout, the **IBM Plex Mono** for the ID number, and a large **Verified Gold** stamp in the corner.