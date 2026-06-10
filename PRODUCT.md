# Product

## Register

brand

## Users

Two overlapping audiences:
- **CS students and learners** who navigate to a specific module to understand a computer vision concept through hands-on interaction. They're comfortable with math notation and want a demonstration that makes an abstract idea tangible.
- **Technical peers and evaluators** (recruiters, fellow engineers, researchers) who are assessing the builder's taste, depth, and engineering craft. They scan holistically before reading closely.

Both audiences arrive at the same surface. The work must satisfy the learner's need for clarity and the evaluator's appetite for craft simultaneously.

## Product Purpose

An interactive learning series for computer vision — four modules covering spatial convolution, feature detection, camera models, and epipolar geometry. Each module pairs rigorous pedagogical content with live, manipulable demonstrations. The project exists to teach, and to demonstrate what educational interfaces can be when built with genuine design investment.

Success looks like: a learner who understands what a kernel does *because they dragged one*, and an evaluator who recognizes the project as a portfolio piece with a distinct and deliberate point of view.

## Brand Personality

Curated · Distinctive · Alive

The series is not a textbook digitized — it is a publication. It has a voice and a visual identity that are specific to it. Interactives feel surprising. Prose breathes. Nothing looks generated; everything looks chosen.

## Anti-references

What this should explicitly NOT look like:

- **Generic EdTech** (Coursera, Khan Academy): Bright primaries, rounded buttons, progress gamification, emoji. Too approachable, too corporate, wrong register entirely.
- **SaaS landing page** (Linear, Vercel): Dark mode with gradient hero, metric stat cards, glassmorphism panels, feature grids. Sophisticated but the wrong emotional register for pedagogy.
- **AI-generated editorial** (the current default): Warm cream/off-white body background, deep indigo-navy primary, Lora serif headings, uppercase tracked eyebrow labels on every section, line dividers between every block. This is the training-data reflex the project must actively resist. The current codebase is here — every design decision going forward should move it somewhere more specific.
- **Data dashboard / analytics UI**: Chart-heavy, sidebar nav, dense tables. Functional and cold — wrong emotional register.

## Design Principles

1. **The interactive IS the argument.** Demonstrations are not illustrations that accompany the text — they are the primary content. Layout hierarchy should make this explicit: interactives command the most space and visual weight; prose serves to frame them.

2. **Distinctiveness over safety.** Actively resist the trained aesthetic. Warm cream backgrounds, indigo-navy, and eyebrow labels on every section are the AI-generated editorial default. Every design choice should feel like a decision, not a safe fallback.

3. **Precision as beauty.** Computer vision is a formal discipline — grids, coordinates, calibration marks, signal diagrams are its native visual vocabulary. Let that vocabulary inform the aesthetic rather than applying editorial warmth over technical content.

4. **One surface, two audiences.** The craft must be sophisticated enough to impress technical evaluators without creating cognitive overhead for learners. The interactives are the bridge: they satisfy the learner with clarity and the evaluator with engineering ambition.

5. **Earned complexity.** Interactive components justify their visual weight — they do real computation. Prose sections should breathe and step back. Never add ornament where content already carries the interest.

## Accessibility & Inclusion

- WCAG 2.1 AA minimum across all content.
- Reduced motion: all animations must degrade to crossfade or instant transition under `prefers-reduced-motion`.
- Math content rendered via KaTeX must be accompanied by prose explanations — do not rely on formulas alone.
- Interactive controls must be keyboard-accessible with visible focus indicators.
