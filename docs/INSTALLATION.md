# Installing iFasting

The welcome screen, after language selection, explains the iPhone steps and offers an **Install app** button. Existing users can find the same shortcut on Overview or open the installation guide from Settings. Thai and English are supported.

## iPhone / iPad

1. Open the iFasting website in Safari.
2. Tap Share. Some Safari layouts place Share inside the page menu.
3. Scroll down and select Add to Home Screen.
4. If Open as Web App is shown, leave it enabled, then tap Add.

If the action is missing, scroll to the bottom of the Share menu, open Edit Actions, and add it. This follows [Apple's iPhone guide](https://support.apple.com/en-lamr/guide/iphone/iphea86e5236/ios).

A website button cannot trigger Safari's Add to Home Screen menu directly; the button opens the illustrated instructions. Do not substitute `navigator.share()` for installation: that is a separate sharing action.

## Other browsers

If the browser provides `beforeinstallprompt`, clicking Install app consumes that event and calls its native prompt. Otherwise, instructions explain how to use the browser menu. A failed native prompt also falls back to instructions.

The shortcut is hidden when the current context runs in standalone mode or receives `appinstalled`. Removing a shortcut after installation does not rerender forms or mutate health records. The app does not assume that accepting a prompt proves installation completed.

Open online once before offline use. Existing Safari-tab data may differ from Home Screen app data; export a JSON backup before moving and import it if needed.

Verification covers welcome and Overview entry points, 320px layout, manual instructions, standalone detection, native prompt consumption, and fallback. Actual iOS installation still requires an iPhone/iPad.
