# G-Facture Design & Component Rules

Whenever creating or modifying components for this project, you MUST adhere to the following design system, aesthetics, and responsiveness rules established in the dashboard.

## 1. Design Aesthetics & Colors
- **Premium Feel**: Use a clean, modern aesthetic with ample breathing room (e.g. `p-6` on cards).
- **Color Palette**: 
  - Accents/Primary: `blue-600` (text, buttons, highlights).
  - Backgrounds: `slate-50` for app backgrounds, `white` for cards/panels.
  - Text: `slate-900` for headings, `slate-600` or `slate-500` for secondary text.
- **Borders**: Use `border-blue-200` for cards to give a subtle branded outline, and `border-slate-200` for generic dividers.

## 2. Interactive Elements & Animations
- **Global Transitions**: Use `transition-all duration-300 ease-in-out` (or `transition-colors`) on interactive elements to ensure smooth state changes.
- **Cards**: All cards must have a hover animation: `hover:-translate-y-1 hover:shadow-md hover:border-blue-300`.
- **Buttons**: Interactive outline or ghost buttons (like "Tout voir", Next/Prev) should invert colors on hover: `hover:bg-black hover:text-white`.
- **Search Bars**: Implement focus animations, e.g., expanding width on focus (`focus-within:max-w-md`), fading out shortcut keys, and changing the icon color (`group-focus-within:text-blue-500`). Use a focus ring: `focus-visible:ring-4 focus-visible:ring-blue-50 focus-visible:border-blue-200`.

## 3. Responsiveness (Mobile-First)
- **Fluid Layouts**: Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) to adapt layouts. E.g., `flex-col md:flex-row`.
- **Mobile Menus**: Hide full sidebars on mobile (`hidden md:flex`). Use a hamburger menu that opens a sliding drawer (`animate-in slide-in-from-left duration-300`) with a blurred backdrop (`backdrop-blur-sm bg-black/50`).
- **Touch Targets**: Ensure buttons on mobile are full width where appropriate (`w-full sm:w-auto`) and have sufficient padding for touch interactions.
- **User Profile**: Keep the user profile easily accessible, typically pinned at the bottom of navigation menus (`border-t p-4 shrink-0`).
