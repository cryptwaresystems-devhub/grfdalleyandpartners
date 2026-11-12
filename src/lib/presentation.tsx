import { createContext, useContext, type PropsWithChildren } from 'react';

export type PresentationMode = 'approved-only' | 'management-preview';
export function resolvePresentationMode(value?: string): PresentationMode {
  return value === 'management-preview' ? 'management-preview' : 'approved-only';
}
// An explicit build option preserves the MVP for design review. Public builds
// fail closed; URL parameters cannot enable access to unapproved content.
export const sitePresentationMode = resolvePresentationMode(import.meta.env?.VITE_CONTENT_MODE);
const PresentationContext = createContext<PresentationMode>(sitePresentationMode);
export function PresentationProvider({ mode, children }: PropsWithChildren<{ mode: PresentationMode }>) {
  return <PresentationContext.Provider value={mode}>{children}</PresentationContext.Provider>;
}
export const usePresentationMode = () => useContext(PresentationContext);
