import { firm } from './firm';
import { offices } from './offices';
import { industries } from './industries';
import { practices } from './practices';
import { lawyers } from './lawyers';
import { insights } from './insights';
import { matters } from './matters';
import { publications } from './publications';
import { isPublished, publishedOnly } from '../lib/publication';
// Use this boundary for future public views; source records are editorial inputs.
export function getPublicContent(now = new Date()) {
 return {
  firm: isPublished(firm, now) ? firm : null,
  offices: publishedOnly(offices, now), industries: publishedOnly(industries, now),
  practices: publishedOnly(practices, now), lawyers: publishedOnly(lawyers, now),
  insights: publishedOnly(insights, now),
  matters: publishedOnly(matters, now), publications: publishedOnly(publications, now),
 };
}
