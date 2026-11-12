// Editorial browsing groups, not additional services or approved practice copy.
export const practiceGroups = [
  { id: 'business', title: 'Business & transactions', practiceIds: ['banking-financial-services', 'corporate-and-commercial', 'employment-labour', 'insolvency-restructuring', 'international-cross-border', 'mergers-acquisitions', 'technology-intellectual-property'] },
  { id: 'disputes', title: 'Disputes & protection', practiceIds: ['arbitration-mediation', 'commercial-litigation', 'criminal', 'human-rights', 'litigation-dispute-resolution', 'recovery'] },
  { id: 'sectors', title: 'Sector-focused practice', practiceIds: ['aviation-transportation', 'construction', 'energy-utilities', 'health-care', 'mining', 'oil-and-gas'] },
  { id: 'property', title: 'Property & private clients', practiceIds: ['real-property', 'wills-trusts-estates'] },
] as const;
