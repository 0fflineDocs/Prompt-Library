import { Prompt, Category } from '../types';

// Keep the prompt content out of the initial application bundle.
const promptFiles = import.meta.glob('../prompts/**/*.json', { eager: true });

export const mockPrompts: Prompt[] = Object.values(promptFiles).map(
  (module: any) => module.default,
);

export const mockCategories: Category[] = [
  { id: '1', name: 'All', count: mockPrompts.length },
  ...Array.from(new Set(mockPrompts.map((prompt) => prompt.category))).map(
    (category, index) => ({
      id: (index + 2).toString(),
      name: category,
      count: mockPrompts.filter((prompt) => prompt.category === category).length,
    }),
  ),
];
