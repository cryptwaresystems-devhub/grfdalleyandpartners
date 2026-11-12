import type { ReactNode } from 'react';
export function PreviewNotice({ title = 'Profile preview', children }: { title?: string; children: ReactNode }) {
  return <div className="provisional-notice"><span>{title}</span><p>{children}</p></div>;
}
