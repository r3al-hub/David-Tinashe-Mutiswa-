# David Tinashe Mutiswa — Portfolio Website (2026 refresh)

A complete, responsive static website refreshed against the supplied 2026 CV, using the existing website's HTML/CSS/JavaScript architecture. No build tooling or paid animation library is required.

## Files

- `index.html` — homepage, career timeline, searchable/filterable project portfolio, expertise, credentials and contact form.
- `style.css` — responsive visual system, motion, layout, mobile navigation and legal-page styling.
- `script.js` — reveal/counter animation, active navigation, project filters, search, scroll progress and contact-form feedback.
- `dtm.jpg` — supplied portrait.
- `cv.pdf` — supplied CV, linked by the download buttons.
- `privacy.html` and `terms.html` — reformatted pages retaining the original policy wording and original last-updated date.
- `favicon.svg` — branded vector icon.

## How to preview

Open `index.html` in a modern browser. For a local web server, from inside the folder run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## How to publish

Upload **all eight files to the same directory** on your static host (for instance, a GitHub Pages repository root). The site uses relative paths, so it works both at the domain root and under a project subdirectory. Leave filenames unchanged unless you also update links.

## Important checks before going live

1. The contact form retains the existing Formspree action (`https://formspree.io/f/xblyvojy`). Confirm this form belongs to you, is active, and is accepting submissions; send a test message after publishing. No form submissions were sent during development.
2. Review the privacy and terms wording for legal accuracy and ensure the privacy policy accurately describes Formspree and any analytics or hosting services you use. Their existing **8 July 2025** revision date was retained, not altered to imply legal review.
3. Review CV, client/project naming, status descriptions and contact details before publishing. Content reflects the supplied CV; project details are intentionally limited to statements the document supports.
4. If you have a live website URL, you can add the correct canonical and `og:url` metadata after publishing. Old example placeholders were removed.
5. The site uses Google Fonts; it falls back to system fonts if they are unavailable. All other design and animation code is bundled locally.

## Accessibility and performance

Keyboard-operated filters and navigation, visible focus indicators, skip link, reduced-motion support, semantic headings, form feedback, responsive layouts and no large front-end framework.
