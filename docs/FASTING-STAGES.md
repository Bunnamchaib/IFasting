# Fasting stages and responsive forms

The fasting screen shows an estimated current stage, a five-stage timeline, and the same stage beneath the timer. The stage is derived from the saved start timestamp and refreshes every second, including when an open screen crosses a boundary.

| Stage | Elapsed time | Educational topic |
| --- | --- | --- |
| 1 | 0–under 4 hours | Digestion |
| 2 | 4–under 12 hours | Stored energy |
| 3 | 12–under 18 hours | Increasing fat use |
| 4 | 18–under 24 hours | Fat and ketones |
| 5 | 24 hours onward | Extended fasting and cell recycling |

These are approximate educational ranges, not measurements or targets. Stage 5 remains selected after 48 hours; it does not reset when the 24-hour clock ring completes. Before starting, no stage is highlighted. Both Thai and English are supported. No saved-data schema changes are required.

The copy avoids claiming a precise metabolic switch, maximum fat burning, hormone levels, muscle preservation, or timed autophagy activation. Human evidence does not establish those states from a timer alone:

- [Physiological responses to acute fasting](https://pubmed.ncbi.nlm.nih.gov/35142356/)
- [Autophagy markers in mouse and human tissues](https://pubmed.ncbi.nlm.nih.gov/35660501/)

Forms use zero-minimum grid tracks, bounded native controls, wrapping messages, and one column below 480 CSS pixels. Mobile inputs use 16px text; WebKit date/time value alignment is explicitly set. Dialogs retain vertical scrolling and browser-native pickers.

Run `node --test tests/*.test.cjs` for data compatibility, photo upload, localization, stage boundaries, and live stage transitions. Browser checks cover 320px and 390px frames, Thai/English content, profile time fields, and date/time dialogs. Physical iPhone/Safari gesture and native-picker positioning still require device verification.
