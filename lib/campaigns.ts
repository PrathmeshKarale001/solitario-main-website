export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'upcoming';
  effectiveDate: string;
  lastUpdated: string;
  terms: string;
  slug: string;
}

export const CAMPAIGNS: Campaign[] = [
  // Akshaya Tritiya 2026 DELETED
];
