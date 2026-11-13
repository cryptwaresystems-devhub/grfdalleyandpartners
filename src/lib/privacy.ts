import { cookieNoticeApproval, privacyPolicy, type PrivacyPolicy } from '../data/privacy';
function validDate(value: string | null) { return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value); }
export function isPrivacyPolicyApproved(policy: PrivacyPolicy = privacyPolicy, now = new Date()) {
  return policy.status === 'approved' && Boolean(policy.source?.trim() && policy.approvedBy?.trim()) && validDate(policy.approvedAt) && Date.parse(policy.approvedAt!) <= now.getTime() && validDate(policy.effectiveDate) && Date.parse(policy.effectiveDate!) <= now.getTime() && policy.sections.length > 0 && policy.sections.every(section => Boolean(section.heading.trim()) && section.paragraphs.length > 0 && section.paragraphs.every(paragraph => Boolean(paragraph.trim())));
}
export function isCookieNoticeApproved(notice = cookieNoticeApproval, now = new Date()) { return notice.status === 'approved' && Boolean(notice.source?.trim() && notice.approvedBy?.trim()) && validDate(notice.approvedAt) && Date.parse(notice.approvedAt!) <= now.getTime(); }
export function productionPrivacyIssues(policy = privacyPolicy, notice = cookieNoticeApproval) {
  return [!isPrivacyPolicyApproved(policy) ? 'The firm-approved Privacy Policy and its approval record are missing.' : '', !isCookieNoticeApproved(notice) ? 'Cookie notice wording and the consent implementation require recorded client approval.' : ''].filter(Boolean);
}
export function assertProductionPrivacy(policy = privacyPolicy, notice = cookieNoticeApproval) { const issues = productionPrivacyIssues(policy, notice); if (issues.length) throw new Error(`Production launch blocked: ${issues.join(' ')}`); }
