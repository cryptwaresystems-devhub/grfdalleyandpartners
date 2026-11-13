import { useCookieConsent } from '../privacy/CookieConsent';
import { useEffect, useState } from 'react';
import type { Insight } from '../../types/content';
import { approvedVideoUrl } from '../../lib/insights';
import { isPublished } from '../../lib/publication';

export function ApprovedVideo({ insight }: { insight: Insight }) {
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const { choices, openPreferences } = useCookieConsent();
  useEffect(() => { if (!choices.media) setLoadedUrl(null); }, [choices.media]);
  const url = approvedVideoUrl(insight.video);
  if (!url || !isPublished(insight)) return null;
  const provider = insight.video!.provider === 'youtube' ? 'YouTube' : 'Vimeo';
  return <section className="insight-video" aria-label={insight.video!.title}>{choices.media && loadedUrl === url ? <iframe title={insight.video!.title} src={url} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-presentation" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen /> : <div><h2>{insight.video!.title}</h2><p>Loading this video connects to {provider}, which may use cookies or collect viewing information.</p><button type="button" className="button button--outline" onClick={() => choices.media ? setLoadedUrl(url) : openPreferences()}>{choices.media ? `Load video from ${provider}` : 'Choose preferences to enable video'}</button></div>}</section>;
}
