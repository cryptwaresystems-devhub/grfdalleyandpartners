import { loadEnv } from 'vite';
import { siteOrigin } from '../src/lib/seo';
import { productionPrivacyIssues } from '../src/lib/privacy';

const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
const issues = productionPrivacyIssues();

if (!siteOrigin(env.VITE_SITE_URL)) {
  issues.push('Configure the approved HTTPS VITE_SITE_URL for canonical and sitemap URLs.');
}

if (env.VITE_CONTENT_MODE === 'management-preview') {
  issues.push('Management-preview content is enabled; use approved-only content for a public release.');
}

if (issues.length) {
  console.warn('Deployment builds are not blocked. Review these outstanding launch items:');
  for (const issue of issues) console.warn(`- ${issue}`);
} else {
  console.log('Production privacy and site-origin checks passed.');
}

if (env.VITE_PUBLIC_INDEXING !== 'true' || issues.length) {
  console.log('Search indexing remains disabled until all legal, origin, content, and indexing settings are approved.');
}
