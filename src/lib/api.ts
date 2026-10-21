// Load the prompt catalog in one async chunk while the existing loading state is visible.
export const fetchPrompts = async () => {
  const promptData = import('./promptData');

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const { mockPrompts, mockCategories } = await promptData;

  return {
    prompts: mockPrompts,
    categories: mockCategories,
  };
};
