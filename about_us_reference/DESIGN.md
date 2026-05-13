# Design System Document: The Cinematic Horizon

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Cinematic Horizon."** 

In aerospace, the horizon is the ultimate boundary—thin, luminous, and authoritative. This system moves away from the "boxy" nature of traditional SaaS platforms, instead favoring a high-end editorial experience that feels like a flight deck or a luxury cinematic title sequence. 

We achieve this through:
*   **Intentional Asymmetry:** Breaking the 12-column grid with oversized "hero" typography and offset imagery to create a sense of forward motion.
*   **Tonal Depth:** Moving beyond flat black into deep, layered navies and charcoals that mimic the layers of the atmosphere.
*   **Atmospheric Scale:** Using high-contrast typography scales (e.g., `display-lg` vs. `label-sm`) to create a sense of immense technical scale.

## 2. Colors & Surface Logic

This system utilizes a sophisticated dark-mode palette designed to reduce eye strain while maintaining a "high-tech" authority.

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to define sections or layouts. In this design system, boundaries are defined strictly through:
1.  **Background Shifts:** Using `surface-container-low` for secondary sections sitting on a `surface` background.
2.  **Tonal Transitions:** Subtle 1-2% shifts in color value to imply containment.
3.  **Negative Space:** Using the spacing scale to create distinct visual groups.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical, stacked layers.
*   **Base Layer:** `surface` (#131313) – The infinite background.
*   **Lowest Layer:** `surface-container-lowest` (#0e0e0e) – For "sunken" elements like search bars or code blocks.
*   **High Layer:** `surface-container-high` (#2a2a2a) – For primary cards and interactive modals.
*   **Highest Layer:** `surface-container-highest` (#353534) – For floating elements that require the most attention.

### The Glass & Gradient Rule
To achieve an "Apple-level" luxury feel, main CTAs and hero elements must utilize:
*   **Glassmorphism:** Use `surface-variant` with a 40-60% opacity and a `backdrop-filter: blur(20px)`. This creates a "heads-up display" (HUD) effect.
*   **Signature Glows:** Use the `primary-container` (#0066ff) as a soft, radial background glow (10-15% opacity, 200px blur) behind key product imagery to suggest engine thrust or atmospheric light.

## 3. Typography
Our typography conveys precision engineering and editorial authority.

*   **Headlines (`display` & `headline`):** We use **Inter** with **bold weights** and **tight tracking** (-0.02em to -0.04em). This gives the brand an "architectural" and "authoritative" feel.
*   **The Data Layer (`label`):** We use **Space Grotesk**. This is reserved for technical data, drone telemetry, and small caps metadata. It provides a geometric, "instrument panel" aesthetic that balances the clean nature of Inter.
*   **Body (`body`):** Inter at `body-md` is our workhorse. Keep line heights generous (1.5x+) to ensure the dark theme remains legible.

## 4. Elevation & Depth
Depth is not a "drop shadow"—it is a physical presence.

### The Layering Principle
Do not use shadows to lift elements. Instead, stack the container tiers. A `surface-container-low` card sitting on a `surface` background creates a natural, soft lift.

### Ambient Shadows
When an element must float (e.g., a dropdown or a modal), use **Ambient Shadows**. 
*   **Color:** Use a tinted version of `on-surface` at 5% opacity.
*   **Blur:** Use extra-diffused values (30px–60px). 
*   **Logic:** The shadow should look like blocked ambient light, not a dark gray smudge.

### The "Ghost Border" Fallback
If a border is required for accessibility:
*   Use `outline-variant` at **15% opacity**.
*   **Never** use 100% opaque borders. The border should be felt, not seen.

## 5. Components

### Buttons
*   **Primary:** Background `primary-container` (#0066ff), text `on-primary-container`. Apply a subtle 10% brightness hover state. Use `xl` (0.75rem) roundedness.
*   **Secondary/Glass:** `surface-variant` at 20% opacity with a `backdrop-blur`. This is our "Luxury Tech" signature button.
*   **Tertiary:** No background. `primary` text with a 2px bottom-aligned "accent bar" that appears only on hover.

### Cards
*   **Style:** Forbid divider lines. Separate content using `body-sm` for labels and `title-lg` for headers. Use vertical whitespace (32px+) to separate the card header from the body content.
*   **Background:** Use `surface-container-low` for standard cards.

### Input Fields
*   **State:** Default state is `surface-container-lowest` with a "Ghost Border."
*   **Focus:** Transition the border to `secondary` (#a9e9ff) and add a 2px outer glow of `secondary` at 10% opacity.

### Telemetry Chips (Custom Component)
*   **Usage:** For drone status or aerospace specs.
*   **Style:** Use **Space Grotesk** at `label-sm`. Background `secondary-container` at 20% opacity. Roundedness `full`.

## 6. Do’s and Don'ts

### Do:
*   **DO** use extreme typographic contrast. A 3.5rem headline next to a 0.75rem label creates the "Cinematic" feel.
*   **DO** use "Electric Blue" (`primary-container`) sparingly. It is a light source; treat it like a laser pointer, not a paint bucket.
*   **DO** lean into the `surface-container` tiers to create hierarchy.

### Don't:
*   **DON'T** use 1px solid dividers or borders. It breaks the "luxury tech" illusion.
*   **DON'T** use standard drop shadows (e.g., `0px 4px 4px rgba(0,0,0,0.25)`). They are too heavy for this system.
*   **DON'T** clutter the screen. If a section feels "busy," increase the vertical padding by 2x. Space is a luxury.