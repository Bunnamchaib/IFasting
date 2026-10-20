# iFasting icon assets

Platform-ready icons for the app and future exports. The high-resolution master is `icon-master.png`.

The opaque square artwork fills the complete canvas, without the original black exterior margin or baked rounded corners. The complete ring/leaf symbol group is visually centered with balanced surrounding space. iOS applies its Home Screen mask. These icons are declared `purpose: any`; they are not advertised as Android maskable-safe artwork.

| Asset | Dimensions | Use |
| --- | --- | --- |
| icon-master.png | Original generated resolution | Master artwork |
| apple-touch-icon.png | 180 × 180 | iPhone Home Screen icon |
| icon-192.png | 192 × 192 | PWA / in-app logo |
| icon-512.png | 512 × 512 | PWA installation |
| favicon.png | 32 × 32 | Browser tab |

The HTML includes an explicit apple-touch-icon link and apple-mobile-web-app-title. The service worker preloads the deployed icons. An already installed Home Screen icon can remain cached by iOS; remove only the Home Screen shortcut and add it again if the icon does not change. Export health data before changing browser/install contexts.
