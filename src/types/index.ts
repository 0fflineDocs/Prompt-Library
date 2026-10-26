export interface Prompt {
  id: string;
  title: string;
  category: string;
  content: string;
  description?: string;
  tags: string[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
