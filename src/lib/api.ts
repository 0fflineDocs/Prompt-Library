import { Prompt, Category } from '../types';

// In a real application, this would be fetched from an API
// This is just mock data for demonstration purposes
const mockPrompts: Prompt[] = [
  { 
    id: '1', 
    title: "Creative Writing Assistant", 
    category: "Writing",
    content: "I want you to act as a creative writing coach. I'm working on a short story about [topic] and need help with developing compelling characters. Please provide guidance on how to make my characters more three-dimensional and believable.",
    tags: ["writing", "creativity", "character development"],
    createdAt: "2023-11-10T12:30:00Z"
  },
  { 
    id: '2', 
    title: "Data Analysis Helper", 
    category: "Technical",
    content: "I need help analyzing a dataset about [topic]. Can you suggest the key metrics I should look at and what visualization techniques would be most effective for understanding trends and patterns in this data?",
    tags: ["data", "analysis", "visualization"],
    createdAt: "2023-11-05T10:15:00Z",
    featured: true
  },
  { 
    id: '3', 
    title: "Learning Roadmap Creator", 
    category: "Education",
    content: "I want to learn [subject] from scratch. Can you create a structured learning roadmap for me, breaking down the process into manageable steps? Please include key concepts I need to master and recommended resources at each stage.",
    tags: ["learning", "education", "roadmap"],
    createdAt: "2023-11-12T14:45:00Z"
  },
  { 
    id: '4', 
    title: "Recipe Modifier", 
    category: "Cooking",
    content: "I have a recipe for [dish] that I'd like to modify to be [dietary preference: vegetarian/vegan/gluten-free/etc.]. Can you suggest appropriate substitutions for ingredients that don't fit this dietary preference while maintaining the flavor profile and texture of the original dish as much as possible?",
    tags: ["cooking", "recipe", "dietary"],
    createdAt: "2023-11-07T09:20:00Z"
  },
  { 
    id: '5', 
    title: "Email Template Creator", 
    category: "Business",
    content: "I need a professional email template for [purpose: following up with clients/requesting information/etc.]. The tone should be [formal/friendly/casual] and it should be concise but thorough. Please include customizable fields that I can adapt for different recipients and situations.",
    tags: ["email", "business", "communication"],
    createdAt: "2023-11-11T16:30:00Z",
    featured: true
  },
  { 
    id: '6', 
    title: "Code Refactoring Assistant", 
    category: "Technical",
    content: "I have a piece of [language] code that needs refactoring. The current implementation works but has issues with [problem]. Please help me improve this code by making it more efficient, readable, and maintainable while preserving the original functionality.",
    tags: ["code", "refactoring", "programming"],
    createdAt: "2023-11-09T11:15:00Z"
  }
];

const mockCategories: Category[] = [
  { id: '1', name: 'All', count: 6 },
  { id: '2', name: 'Writing', count: 1 },
  { id: '3', name: 'Technical', count: 2 },
  { id: '4', name: 'Education', count: 1 },
  { id: '5', name: 'Business', count: 1 },
  { id: '6', name: 'Cooking', count: 1 }
];

// Simulate API call with mock data
export const fetchPrompts = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    prompts: mockPrompts,
    categories: mockCategories
  };
};

// Simulate search API call
export const searchPrompts = async (query: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const lowerCaseQuery = query.toLowerCase();
  
  const results = mockPrompts.filter(prompt => 
    prompt.title.toLowerCase().includes(lowerCaseQuery) || 
    prompt.content.toLowerCase().includes(lowerCaseQuery) ||
    prompt.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
  ).map(prompt => ({
    id: prompt.id,
    title: prompt.title,
    category: prompt.category,
    tags: prompt.tags
  }));
  
  return results;
};