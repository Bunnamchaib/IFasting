# iFasting icon assets — 2026-10-20

User-approved visual reference: the supplied navy app icon with turquoise clock ring, white hands and two mint leaves. The low-resolution reference was reconstructed with the built-in image generation editor, then deterministically resized with Sharp/Lanczos3 for platform assets. The master remains in this repository for future exports.

The opaque square artwork fills the complete canvas, without the original black exterior margin or baked rounded corners. The complete ring/leaf symbol group is visually centered with balanced surrounding space. iOS applies its Home Screen mask. These icons are declared `purpose: any`; they are not advertised as Android maskable-safe artwork.

| Asset | Dimensions | Use |
| --- | --- | --- |
| icon-master.png | Original generated resolution | Master artwork |
| apple-touch-icon.png | 180 × 180 | iPhone Home Screen icon |
| icon-192.png | 192 × 192 | PWA / in-app logo |
| icon-512.png | 512 × 512 | PWA installation |
| favicon.png | 32 × 32 | Browser tab |

The HTML includes an explicit apple-touch-icon link and apple-mobile-web-app-title. The service worker cache was bumped to v2 and preloads the deployed icons. An already installed Home Screen icon can remain cached by iOS; remove only the Home Screen shortcut and add it again if the icon does not change. Export health data before changing browser/install contexts.

## Built-in editor prompt

Edit the attached iFasting app icon into a production-quality high-resolution square app icon master. Preserve the original identity faithfully: a cyan/turquoise near-complete circular clock ring, white clock hands, and exactly two fresh mint green leaves emerging at the upper-right of the ring, on a deep navy blue background with subtle blue lighting at the top. Reconstruct crisp smooth edges and clean fine detail from the low-resolution reference, no blur, no pixelation, no lettering. IMPORTANT: remove ALL outside black margin, crop away the old rounded tile outline, and extend the deep navy background seamlessly to all four edges of the new square canvas. No transparent corners, no pre-rounded corners, no borders, no device mockup, no drop shadow outside a tile. Apple iOS will mask the corners itself. Visually center the COMPLETE symbol group (ring + hands + both leaves) both horizontally and vertically with balanced margins; keep all meaningful symbol parts inside the central 76% of the square for safe cropping. Original colors and proportions, premium polished simple mark, minimal subtle gradient rather than glare. Output one square 1024x1024 or larger opaque PNG app icon.

References: [Apple Safari Web Content Guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html), [MDN app icons](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Define_app_icons).
