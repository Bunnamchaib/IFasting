# Profile photo and Thai / English — 2026-10-20

The main app remains a self-contained index.html. Its English message catalog is embedded in the `translations` script; `t(source)` translates explicit app strings at render time, never user names or imported records. Dates and times use th-TH or en-GB. Fresh installations and existing records without a selected language show a bilingual chooser before onboarding/dashboard. The choice is persisted in settings and can be changed with TH / EN in Settings.

Profile editing and onboarding include a photo chooser, preview, approximate stored image size, and remove button. Processing stays in-browser: supported raster image → centered square crop → 128 × 128 canvas → JPEG compression → data URL capped at 20,000 characters. Input limit is 10 MB / 40 megapixels; unsupported HEIC/HEIF decoding shows a JPEG/PNG fallback message. Original image metadata is not copied into the new canvas output. Photos are written only when saving the profile, so canceling discards edits. Pending uploads are tracked per form and operation; a canceled older upload cannot unblock a newer form's Save button or overwrite its preview.

## Compatibility

Schema version remains 1 with additive fields:

- `profile.avatar`: JPEG data URL or null; missing old field becomes null.
- `settings.language`: th / en / null; missing old field becomes null.

The IndexedDB connection version advances to 2 without recreating the existing document store. Previously open v1 tabs receive versionchange and stop writes, so their older validators cannot strip photo/language fields. They must reload to continue. This changes the storage connection version, not the JSON backup schema version.

Validation rejects external photo URLs, SVG, oversize/invalid data URLs and unknown languages before database writes. Replace-import restores the file's photo and language. When an old backup has no language, import retains the current selected language. Merge keeps the device's existing profile/settings by the established merge policy; use replace to restore another profile. No external image upload or translation service is used.

## Verification

- Existing health-history tests plus legacy backup migration, photo/language roundtrip, photo removal, and invalid imports.
- Browser: first-run bilingual chooser, English onboarding, all five main views and Settings, TH/EN switching and reload persistence.
- Browser: a ~1.4 MB icon test image becomes 128 × 128, 4,511 data-URL characters (~4 KB image), saves and exports. JSON import into a separate empty origin restores the photo and English preference. Canceling a removal preserves the saved photo.
- Regression harness executes the actual upload and submit handlers with controlled asynchronous decoding; verifies a canceled upload cannot allow a newer pending photo to save too early.
- Regression covers translated toast/Undo rendering; a local variable that shadowed the translation helper was found during browser checks and renamed before release.
- Browser migration from an existing v1 database retained photo, language, active timer and health records. An old connected tab showed the update banner and its attempted water save did not change the stored total.
- Actual iPhone HEIC selection and installation should still be checked on a physical device.
