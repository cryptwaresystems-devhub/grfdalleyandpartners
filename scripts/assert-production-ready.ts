import { loadEnv } from 'vite';
import { assertProductionSeo } from '../src/lib/seo';
import { assertProductionPrivacy } from '../src/lib/privacy';
assertProductionPrivacy();
assertProductionSeo({ ...loadEnv('production', process.cwd(), ''), ...process.env });
console.log('Privacy launch checks passed. Other launch acceptance checks still apply.');
