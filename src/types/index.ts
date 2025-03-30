export interface Prompt {
  id: string | number;
  title: string;
  category: string;
  content: string;
  description?: string;
  tags: string[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string | number;
  name: string;
  count?: number;
}

export interface SearchResult {
  id: string | number;
  title: string;
  category: string;
  tags: string[];
}
