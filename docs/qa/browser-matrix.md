# Browser and device matrix

13 November 2026. The Browser skill was read and its supported runtime connection was attempted for the local site. The required browser-client.mjs module was unavailable. No substitute browser automation engine was used. Installed browser binaries, if any, are not evidence of an executed browser test.

| Environment required by SOW | Result | Evidence / follow-up |
| --- | --- | --- |
| Chrome, latest desktop | NOT TESTED | Browser session unavailable; record exact version/OS when executed |
| Firefox, latest desktop | NOT TESTED | Browser session unavailable; record exact version/OS when executed |
| Safari, latest macOS | NOT TESTED | No Safari/macOS test environment available |
| Edge, latest desktop | NOT TESTED | Browser session unavailable; record exact version/OS when executed |
| iOS Safari, phone/tablet | NOT TESTED | No iOS device/session available |
| Android Chrome, phone/tablet | NOT TESTED | No Android device/session available |
| Screen reader / device zoom / touch | NOT TESTED | Requires real browser/device and assistive technology |
| Lighthouse mobile/desktop, target >90 | NOT TESTED | Browser runtime unavailable; no scores measured |
| Happy DOM responsive CSS and keyboard checks | PASS, limited scope | 320, 390, 768, 1024 and 1440px fixtures; not a browser rendering or cross-browser result |

Required follow-up in each real browser: all seven sections, deep links and 404s; filters; mobile menu focus/Escape; consent rejection/revisit/withdrawal; forms and error announcements; portrait crops/overflow at 320/390/768/1024/1440px; 200% zoom, focus visibility and screen reader labels. Use only approved service test configuration for live delivery/calendar/GA4. Record actual date, OS, exact browser version, case, result and evidence. Do not convert this matrix to PASS based on DOM mocks.
