export interface PrivacyPolicy {
  status: 'missing' | 'draft' | 'approved';
  source: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  effectiveDate: string | null;
  sections: { heading: string; paragraphs: string[] }[];
}
// Only the firm's explicitly approved legal text belongs here. Requester-authorized
// marketing copy is not sufficient approval for this legal document.
export const privacyPolicy: PrivacyPolicy = { status: 'missing', source: null, approvedBy: null, approvedAt: null, effectiveDate: null, sections: [] };
export const cookieNoticeApproval: { status: 'pending' | 'approved'; source: string | null; approvedBy: string | null; approvedAt: string | null } = { status: 'pending', source: null, approvedBy: null, approvedAt: null };
