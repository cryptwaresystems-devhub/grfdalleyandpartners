export const CONSENT_KEY = 'grf-cookie-preferences';
export const CONSENT_VERSION = 1;
export const CONSENT_LIFETIME = 180 * 24 * 60 * 60 * 1000;
export interface CookieChoices { analytics: boolean; media: boolean }
export interface SavedConsent extends CookieChoices { version: number; savedAt: number }
export const essentialOnly: CookieChoices = { analytics: false, media: false };
export function parseConsent(raw: string | null, now = Date.now()): SavedConsent | null {
  try {
    const value = JSON.parse(raw ?? 'null');
    if (!value || value.version !== CONSENT_VERSION || typeof value.analytics !== 'boolean' || typeof value.media !== 'boolean' || typeof value.savedAt !== 'number' || !Number.isFinite(value.savedAt) || value.savedAt > now || now - value.savedAt >= CONSENT_LIFETIME) return null;
    return { version: value.version, savedAt: value.savedAt, analytics: value.analytics, media: value.media };
  } catch { return null; }
}
export function saveConsent(storage: Pick<Storage, 'setItem'>, choices: CookieChoices, now = Date.now()) { storage.setItem(CONSENT_KEY, JSON.stringify({ version: CONSENT_VERSION, savedAt: now, analytics: choices.analytics, media: choices.media })); }
