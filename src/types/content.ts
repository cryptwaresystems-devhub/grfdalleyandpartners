export type ApprovalStatus = 'draft' | 'in-review' | 'approved' | 'archived';
export interface Editorial { status: ApprovalStatus; source: string; approvedBy?: string; approvedAt?: string; publishedAt?: string; }
export interface ContentRecord { id: string; slug: string; name: string; editorial: Editorial; }
export interface Firm extends ContentRecord { email: string; telephone: string; foundedYear: number; domain: string; }
export interface Office extends ContentRecord { address: string | null; telephone: string | null; email: string | null; hours: string | null; }
export type ExpertiseKind = 'industry' | 'practice';
export interface ExpertiseRelationships {
  industryIds?: string[];
  practiceIds?: string[];
  lawyerIds?: string[];
  insightIds?: string[];
  matterIds?: string[];
  publicationIds?: string[];
}
export interface Expertise extends ContentRecord {
  summary: string | null;
  /** Legacy cross-taxonomy IDs, retained for existing content. */
  relatedIds: string[];
  /** Confirms the category name only; does not approve its narrative content. */
  labelApproval?: { status: 'confirmed' | 'pending'; source: string };
  relationships?: ExpertiseRelationships;
}
export interface Matter extends ContentRecord { summary: string; practiceIds: string[]; industryIds: string[]; }
export interface Publication extends ContentRecord {
  authorIds: string[]; practiceIds: string[]; industryIds: string[];
  publisher: string; year?: string; externalUrl?: string;
}
export interface BibliographicEntry { title: string; year?: string; }
export interface Lawyer extends ContentRecord {
  role: string; practiceIds: string[]; officeId: string | null; yearOfCall: number | null;
  education: string[]; memberships: string[]; linkedin: string | null; email: string | null;
  portrait: string | null; biography: string | null;
  practiceNames?: string[]; certifications?: string[]; suppliedPublications?: BibliographicEntry[];
  verification?: { status: 'source-checked'; biographyFileId: string; portraitFileId: string; photoMatch: 'embedded-portrait-match'; notes?: string[] };
}
export type InsightType = 'article' | 'case-review' | 'external-publication' | 'news' | 'event' | 'video' | 'award';
export interface Insight extends ContentRecord {
  type: InsightType; date: string; authorIds: string[]; practiceIds: string[]; industryIds: string[]; body: string; externalUrl?: string;
  datePrecision?: 'day' | 'month' | 'year'; publisher?: string; publisherNote?: string; subtitle?: string;
  verification?: { status: 'publisher-verified'; sourceUrl: string; checkedOn: string };
}
