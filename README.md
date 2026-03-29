# Reychem — reychem.co.uk

UK-based REACH compliance consultancy helping Indian chemical manufacturers and formulators export legally to the UK and EU.

Live site: [reychem.co.uk](https://reychem.co.uk)

---

## Stack

- HTML5, CSS3 custom properties, vanilla JavaScript
- No framework, no build tool, no dependencies
- Hosted on GitHub Pages via GitHub Actions CI/CD
- Google Fonts (Inter + Montserrat)
- Formspree for contact form
- Google Analytics 4 with GDPR consent gating

---

## Pages

| File | Description |
|---|---|
| `index.html` | Home — hero, services overview, how it works, why Reychem, CTA |
| `services.html` | Six REACH services in detail |
| `products-india-uk.html` | Product categories, HS codes, tonnage thresholds |
| `about.html` | Who we are, how we work, specialist network model |
| `contact.html` | Contact form, WhatsApp link, FAQ |

---

## Key features

**Design**
- Navy + Amber colour scheme (`#0F3460` / `#D97706`)
- Light ivory hero (`#FFFBF0` to `#F5F8FF` gradient) across all pages
- Montserrat 700 wordmark at `letter-spacing: 0.28em`
- Transparent PNG logo with background flood-fill removed via Python + Pillow
- Scroll-triggered fade animations via IntersectionObserver
- Animated stat counters

**Navigation**
- Fixed nav with frosted glass on scroll
- Full-screen mobile overlay menu
- Safari-compatible: `backdrop-filter` cleared on open to avoid fixed-position containing block bug

**Cookie consent and analytics**
- GA4 script removed from `<head>` entirely
- Two-button banner: Accept analytics / Essential only
- `loadGA4()` injects the script tag dynamically on acceptance only
- Consent stored in `localStorage` under `rc-cookies-analytics` or `rc-cookies-essential`
- Backward-compatible with legacy `rc-cookies-ok` key

**Responsive**
- Tested on iPhone Safari, Chrome Android
- `overflow-x: clip` on `html` prevents layout overflow from flex/grid minimum width issues
- `min-width: 0` on hero grid items to allow shrinking below content size

---

## Structure

```
reychem-redesign/
├── assets/
│   ├── css/
│   │   └── style.css          # Single stylesheet, ~2000 lines, CSS custom properties
│   ├── js/
│   │   └── main.js            # Nav, scroll animations, FAQ accordion, cookie consent, counters
│   └── images/
│       └── reychem-mark.png   # Transparent PNG logo (606x591, processed from 1408x768 original)
├── index.html
├── services.html
├── products-india-uk.html
├── about.html
├── contact.html
└── .github/
    └── workflows/             # GitHub Actions deployment to GitHub Pages
```

---

## Local development

No build step required. Open any HTML file directly in a browser, or serve with any static file server:

```bash
npx serve .
# or
python3 -m http.server 8000
```

---

## Deployment

Pushes to `main` deploy automatically to GitHub Pages via the Actions workflow. No manual steps required.

---

## CSS architecture

All styles live in `assets/css/style.css`. Structure:

1. CSS custom properties (tokens)
2. Reset
3. Typography
4. Layout (container, section, grid utilities)
5. Buttons
6. Navigation
7. Hero
8. Components (badges, cards, steps, stats, FAQ, forms)
9. Footer
10. Responsive breakpoints (1024px, 768px, 480px)

Colour tokens:
```css
--primary:      #0F3460   /* Deep Navy */
--accent:       #D97706   /* Amber */
--accent-light: #FEF3C7   /* Pale gold */
--bg:           #FAFAF9   /* Warm white */
--bg-dark:      #081E3F   /* Midnight */
```
