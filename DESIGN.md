---
name: CV Interactive Lab
description: A field scientist's publication for computer vision — annotated, precise, alive.
colors:
  vellum-ground: "#FDFCFB"
  field-vellum: "#F8F7F4"
  white-surface: "#FFFFFF"
  observatory-ink: "#0F172A"
  dust-medium: "#64748B"
  dust-faint: "#94A3B8"
  specimen-border: "#E2E8F0"
  observatory-navy: "#1E3A8A"
  signal-blue: "#3B82F6"
  field-amber: "#B45309"
  indigo-tint: "#EEF2FF"
typography:
  display:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "clamp(2.5rem, 6vw, 4rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "clamp(1.5rem, 3vw, 2.5rem)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Lora, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.25em"
  mono:
    fontFamily: "Fira Code, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: "2px"
  sm: "4px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.observatory-navy}"
    textColor: "{colors.white-surface}"
    rounded: "{rounded.none}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "#172554"
    textColor: "{colors.white-surface}"
  module-card:
    backgroundColor: "{colors.white-surface}"
    textColor: "{colors.observatory-ink}"
    rounded: "{rounded.sm}"
    padding: "32px"
  module-card-active:
    backgroundColor: "{colors.white-surface}"
    textColor: "{colors.observatory-navy}"
  slider-panel:
    backgroundColor: "{colors.white-surface}"
    textColor: "{colors.observatory-ink}"
    rounded: "{rounded.sm}"
    padding: "32px"
  callout-tip:
    backgroundColor: "#F9F7F2"
    textColor: "{colors.observatory-ink}"
    rounded: "{rounded.sm}"
    padding: "32px"
---

# Design System: CV Interactive Lab

## 1. Overview

**Creative North Star: "The Field Book"**

This system is built on the metaphor of a scientist's field journal: observations recorded with precision, specimens annotated with care, every page a document of something seen and understood. Computer vision is the discipline of teaching machines to see — the visual system should feel like it was made by someone who takes seeing seriously. Not a lecture hall, not a dashboard. A field book: worn at the edges, authoritative at its core, surprising in its details.

The interactive demonstrations are the specimens under observation. Prose frames what the specimen shows. Typography is the notation system: Lora serif for sustained thought, Inter sans for technical labels and coordinates, Fira Code for values the machine has computed. The figure captions ("Plate 1.A", "Eq. 1.01") are not decoration — they are the language of someone who documents what they find.

This system explicitly rejects the generic EdTech register (progress gamification, rounded primaries, approachability as a design goal), the SaaS landing page (dark mode gradient heroes, glassmorphism panels, metric cards), and — most critically — the AI-generated editorial default: cream background, deep indigo-navy, eyebrow labels on every section, horizontal dividers between every block. The current codebase is that pattern. The design direction moves away from it toward something more specific: one surface that would be recognizable even if you covered the logo.

**Key Characteristics:**
- Demonstrated depth: interactives carry the visual weight, not decorative elements
- Scientific notation vocabulary: "Plate", "Fig.", "Eq.", "Annotation //" as consistent labeling language
- Serif-led typography with sans labels — the pair reads as "academic journal, not design blog"
- Restraint on surface (near-flat, minimal shadow), richness in interaction
- Near-square corners throughout (2–4px radius) — no friendly rounding, no sharp edges

## 2. Colors: The Observatory Palette

The palette is built around a deep navy that reads as institutional authority, a near-white ground that carries the paper metaphor without being warm-tinted by default, and a field amber used sparingly for accent and warmth.

### Primary
- **Observatory Navy** (`#1E3A8A`): The primary interactive color. Used on active states, primary buttons, selected nav items, slider thumbs, and key UI chrome. Deep enough to read as authoritative, not playful.
- **Signal Blue** (`#3B82F6`): Reserved for dynamic/data contexts — chart lines, hover accents, metric values. Not used for static UI chrome.

### Tertiary
- **Field Amber** (`#B45309`): The warmth accent. Used on tip callouts, occasional emphasis, and the hover state of the sidebar "begin" arrow. Rare — no more than one instance visible per screen at rest.

### Neutral
- **Vellum Ground** (`#FDFCFB`): Main body background. The field book's page. Marginally warm, not cream. At this luminosity it avoids the AI-generated sand/paper band.
- **Field Vellum** (`#F8F7F4`): Sidebar background. Slightly deeper than the ground to create depth without shadow.
- **White Surface** (`#FFFFFF`): Card backgrounds, panel insets, interactive component backgrounds. Lifts content off the ground.
- **Observatory Ink** (`#0F172A`): Primary text. Near-black with a deep blue cast — matches the navy family.
- **Dust Medium** (`#64748B`): Secondary text, muted labels, supporting copy.
- **Dust Faint** (`#94A3B8`): Tertiary labels, decorative metadata, icon default state.
- **Specimen Border** (`#E2E8F0`): Dividers, card borders, input strokes. Thin and quiet.
- **Indigo Tint** (`#EEF2FF`): Value display backgrounds, inline code fills. Connects interactive values to the navy family.

### Named Rules
**The Amber Rule.** Field amber appears on one element per screen at rest. It is a field note in the margin, not a highlight on every line. Overuse collapses the accent into background noise.

**The Navy Rule.** Observatory Navy is the action color. It appears on interactive state (hover, active, selected, primary button). Decorative use — dividers, background tints used as aesthetics — dilutes its signal. Remove it if the element is not interactive.

## 3. Typography

**Heading/Prose Font:** Lora (with Georgia, serif fallback)
**Label/UI Font:** Inter (with system-ui, sans-serif fallback)
**Value/Code Font:** Fira Code (monospace)

**Character:** Lora carries the argument — sustained, authoritative, pitched toward the reader who is reading. Inter handles the coordinates — terse, technical, uppercase-tracked, a different register entirely. The collision between them is the design: field notes in two hands, both legible.

### Hierarchy
- **Display** (weight 500, `clamp(2.5rem, 6vw, 4rem)`, line-height 1.1): Page titles only. Italic variant marks the emotional word in the heading ("Computer Vision *Interactive* Lab"). `text-wrap: balance`.
- **Headline** (weight 500, `clamp(1.5rem, 3vw, 2.5rem)`, line-height 1.2): Section headings within lesson pages. Often italic. `text-wrap: balance`.
- **Title** (weight 500, 1.25rem, line-height 1.3): Panel/card headings, sidebar module names. Serif but tighter.
- **Body** (weight 400, 1.125rem Lora, line-height 1.7): Lesson prose. Max line length 65–75ch. Uses `text-wrap: pretty`.
- **Label** (weight 700, 0.625rem Inter, letter-spacing 0.25em, uppercase): Figure captions, section markers, button text, nav meta. The notation voice.
- **Mono** (weight 400, 0.875rem Fira Code, line-height 1.5): Value displays, kernel values, numerical readouts. Indigo-tinted backgrounds when displayed as a chip.

### Named Rules
**The Italic Rule.** Italic is not emphasis — it is the emotional crux of a heading. One italic word per display-level heading, never on body prose for decoration.

**The Two-Register Rule.** Serif and sans must not bleed into each other's roles. Prose is always Lora. Metadata, labels, buttons, captions are always Inter. A sans-serif heading or a serif label is a mistake, not a choice.

## 4. Elevation

This system is near-flat. Surfaces do not sit at different elevations by default — depth is created through background tint (white card on vellum ground) and subtle border, not through shadow stacking. Shadows appear only as a response to state (hover, interactive focus) or to lift an interactive component above surrounding prose.

### Shadow Vocabulary
- **Ambient hover** (`0 20px 40px -15px rgba(0,0,0,0.05)`): Module cards on hover. Barely perceptible — the card rises fractionally, not dramatically.
- **Panel lift** (`0 30px 60px -15px rgba(0,0,0,0.05)`): Interactive laboratory panels and convolution visualizations. Marks "this is the specimen."
- **Surface shadow** (`box-shadow: 0 1px 3px rgba(0,0,0,0.04)`): Minimal lift for white panels floating on vellum. Used sparingly.

### Named Rules
**The Flat-by-Default Rule.** No element casts a shadow at rest unless it is white-surfaced on the vellum ground. Shadow is reserved for state (hover) or for interactive specimen panels. A decorative `shadow-xl` on a heading card is prohibited.

## 5. Components

### Buttons
- **Shape:** Near-square (2px radius). No friendly rounding.
- **Primary:** Observatory Navy background (`#1E3A8A`), white text, Inter Bold uppercase, letter-spacing 0.2em, 10px font size. Padding: 16px 24px. Hover: darkens to `#172554`. Active: `scale-95`. Disabled: `opacity-30`.
- **Loading state:** Fira Code spinner icon + "Processing..." label — same uppercase label register.
- No ghost or secondary button variant currently. When needed: thin `1px` Specimen Border stroke, navy text, no fill.

### Module Cards (Landing)
- White surface on vellum ground. 1px Specimen Border. 2px radius. Padding 32px.
- Hover: border shifts to `rgba(30, 58, 138, 0.3)` (navy at 30%), ambient hover shadow appears. Indigo-50/50 radial glow at top-right corner.
- Icon: 28px, strokeWidth 1.5. Default: Dust Faint. Hover: Observatory Navy.
- "Begin Module" link: 9px Inter Bold uppercase, animated underline arrow extends from 6px to 40px width in navy on hover.

### Lesson Panels (Interactive)
- White surface, `1px #F1F5F9` border, `rounded-sm`. Panel lift shadow. Padding 32px.
- Panel titles: Lora italic, navy, weight 500.
- Figure captions: 9–10px Inter Bold uppercase tracking-widest, Dust Faint.

### Callouts / Annotations
- **Current pattern (to revise):** Uses `border-left: 4px` colored stripe. This is explicitly banned by the design system. The field-book replacement: full top border (1px) in the accent color, tinted background fill, no stripe.
- Tip: `#F9F7F2` background, 1px Field Amber top border.
- Info: `#F0F4F8` background, 1px Signal Blue top border.
- Warning: `#FFF0F0` background, 1px rose top border.
- Voice: "Annotation // {title}" in 10px Inter Bold uppercase. Body in Lora italic.

### Slider Panel
- White surface, 1px `#F1F5F9` border, sm radius. Padding 32px (or compact: 12px).
- Slider track: 1px height, Specimen Border color.
- Thumb: 16px disc, Observatory Navy fill, 2px white border, shadow.
- Value chip: Indigo Tint background, navy text, Fira Code, 1px `#C7D2FE` border, sm radius.

### Navigation (Sidebar)
- Width: 288px. Background: Field Vellum. Right border: Specimen Border.
- Active item: white-surface card, `1px #F1F5F9` border, no shadow. Active icon: Observatory Navy.
- Default icon: Dust Faint. Hover: translates +4px right.
- Volume markers (I, II, III, IV): 9px Inter Bold, Dust Faint at rest, navy at active.
- Bottom Nav (mobile): white/90 with `backdrop-blur-xl`, top border Specimen Border. Icon 18px, label 8px uppercase.

### Figure / Plate Captions (Signature)
The annotated caption system is a distinctive voice element. Every interactive panel has a figure caption: "Fig. 1.1 — ...", "Plate 1.A — ...", "Eq. 1.01". These are 9–10px Inter Bold uppercase, letter-spacing widest (0.1em+), Dust Faint color, centered below the panel. Do not omit them from new interactive components — they are the system's notation voice.

## 6. Do's and Don'ts

### Do:
- **Do** use Lora serif for all headings and sustained prose. The two-register rule is structural, not stylistic.
- **Do** label every interactive panel with a figure or plate caption in the "Fig. N.N — Description" format. It is the system's voice.
- **Do** use italic for the emotional word in a display heading — one word, not a phrase.
- **Do** keep amber to one visible instance per screen at rest. Its scarcity is its meaning.
- **Do** use `text-wrap: balance` on headings and `text-wrap: pretty` on body prose.
- **Do** add `@media (prefers-reduced-motion: reduce)` alternatives for every animation — crossfade or instant, never stripped entirely.
- **Do** make every interactive control keyboard-accessible with a visible focus indicator in Observatory Navy.
- **Do** cap body text at 65–75ch line length.

### Don't:
- **Don't** place an uppercase tracked eyebrow label above every section. "CURRICULUM SEGMENT" above every `<h2>` is the AI-generated editorial default — the exact pattern this system is moving away from. Use them as deliberate accents (figure captions, sidebar meta), not as structural scaffolding for every heading.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on callouts, cards, or list items. The current Callout component uses this — it is a known debt, not a pattern to follow.
- **Don't** use gradient text (`background-clip: text` + gradient). Single solid color only.
- **Don't** use glassmorphism as a default aesthetic. The `.glass` utility exists but is not a default card style.
- **Don't** put Observatory Navy on decorative non-interactive elements (dividers, background tints, section ornaments). It is an action signal; diluting it breaks the interactive hierarchy.
- **Don't** add a shadow to every card. White surface on vellum ground creates depth without shadow. Reserve shadows for hover state and interactive specimen panels.
- **Don't** make this look like a SaaS landing page (Linear, Vercel): no gradient hero sections, no metric stat cards, no glassmorphism panels, no dark mode with purple gradients.
- **Don't** make this look like generic EdTech (Coursera, Khan Academy): no bright primary colors, no rounded progress bars, no emoji, no congratulatory micro-copy.
- **Don't** add numbered section markers (01 / 02 / 03) above content sections as scaffolding. The "L_01" / "L_02" pattern on module cards is contextual (a lesson index reference) — don't generalize it to every heading.
- **Don't** use two geometric sans-serif fonts together. Inter is the sole sans voice; Plus Jakarta Sans is declared but not in active use — do not introduce it into the visible type system.
