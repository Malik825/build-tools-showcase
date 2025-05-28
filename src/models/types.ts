export interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  downloads: string;
  lastUpdate: string;
  features: string[];
  color: string;
  icon: string;
  tryLink: string;
}

export type SortOption = 'popularity' | 'name' | 'recent' | 'category';