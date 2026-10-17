# David Tinashe Mutiswa — Premium Responsive Portfolio

**17 October 2026 · Responsive / dual-theme update**

This package improves the existing static HTML/CSS/JavaScript website while preserving its distinctive navy-and-lime brand identity, CV-aligned content, contact form and LinkedIn updates. It requires no build step or JavaScript framework.

## What's new

- **Dark and light themes:** Accessible sun/moon toggle in the top navigation on the homepage, privacy page and terms page. Defaults to the signature dark-and-lime theme; the visitor's choice is remembered using the browser's `localStorage` (key: `dtm-theme`). The toggle works with keyboard input and announces its next action to screen readers.
- **Unobstructed portrait:** The original supplied `dtm.jpg` is displayed using its native aspect ratio and `object-fit: contain`. No floating information cards, gradients, labels or photographic filters cover the image. Both professional highlight cards and the portrait caption are positioned *below* the picture in the layout at every screen size.
- **Responsive refinements:** Improved mobile hero spacing, typography, navigation and action buttons. Tested at 320px, 390px, 768px and 1440px without horizontal overflow in simulated Chromium renders.
- **Unified visual system:** Colours for navigation, statistics, portfolio cards, timelines, credentials, contact form, footer and legal pages adapt to the chosen mode.
- **Previous features preserved:** Searchable portfolio, project filters, career timeline, scroll reveals, count-up statistics, mobile menu, reading progress, accessible focus states, CV download and Formspree contact form.
- **LinkedIn:** `https://www.linkedin.com/in/tinashe-shenjere-8211621a4/` remains on the homepage and both legal page footers.

## Included files

| File | Purpose |
| --- | --- |
| `index.html` | Portfolio homepage, unobstructed portrait, toggle and CV content |
| `style.css` | Existing visual system plus premium dark/light and responsive refinements |
| `script.js` | Existing website interactions plus saved theme switcher |
| `dtm.jpg` | Original supplied photograph, not edited |
| `cv.pdf` | Original CV, downloadable from the website |
| `privacy.html` | Privacy policy with integrated header/toggle |
| `terms.html` | Terms of Service with integrated header/toggle |
| `favicon.svg` | DTM site icon |

## Preview locally

Open `index.html` in your browser. Or, if Python is installed, run this command **inside the website folder**:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000` in a browser.

## Publish to your existing GitHub Pages site

1. Unzip this package.
2. Open the folder `DTM_Portfolio_Premium_Responsive_2026`.
3. Upload **all eight files from inside that folder**, not the containing folder, to the root of your current GitHub Pages repository. Replace the matching existing files.
4. Commit the changes and allow GitHub Pages to redeploy.
5. Refresh with the browser's cache bypass if the old stylesheet is still visible, then check phone, tablet and desktop layouts.

## Important checks

- **Formspree:** The existing contact form action (`https://formspree.io/f/xblyvojy`) has been preserved. Please verify this is your active form and submit a test message on the *live* site; no test submissions were sent during this update.
- **Legal wording:** Existing Privacy Policy and Terms text and their original last-updated dates were retained. Review these pages if your data-handling practices have changed.
- **CV and portfolio:** Professional content has not been expanded beyond your previous CV-aligned site; review client/project details before publishing.
- **External font service:** Google Fonts loads over the network; if unavailable, the site uses system fallbacks.
- **Live deployment:** These are deliverable local files, not a publication to your GitHub account. The live website remains unchanged until you upload/commit the files.
