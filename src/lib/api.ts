import { Prompt, Category } from '../types';

// Dynamically import all JSON files in the prompts directory
const promptFiles = import.meta.glob('../prompts/**/*.json', { eager: true });

const mockPrompts: Prompt[] = Object.values(promptFiles).map((module: any) => module.default);

// Generate categories dynamically based on the imported prompts
const mockCategories: Category[] = [
  { id: '1', name: 'All', count: mockPrompts.length },
  ...Array.from(
    new Set(mockPrompts.map((prompt) => prompt.category))
  ).map((category, index) => ({
    id: (index + 2).toString(),
    name: category,
    count: mockPrompts.filter((prompt) => prompt.category === category).length,
  })),
];

// Simulate API call with mock data
export const fetchPrompts = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    prompts: mockPrompts,
    categories: mockCategories,
  };
};
