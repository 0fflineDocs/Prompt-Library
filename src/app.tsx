import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import PromptCard from './components/ui/PromptCard';
import SearchModal from './components/SearchModal';
import { Prompt, Category } from './types';
import { fetchPrompts } from './lib/api';

const App: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, this would fetch from your API
        const data = await fetchPrompts();
        setPrompts(data.prompts);
        setFilteredPrompts(data.prompts);
        setCategories(data.categories);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading prompts:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let result = prompts;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(prompt => prompt.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(prompt => 
        prompt.title.toLowerCase().includes(lowerCaseQuery) || 
        prompt.content.toLowerCase().includes(lowerCaseQuery) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
      );
    }
    
    setFilteredPrompts(result);
  }, [selectedCategory, searchQuery, prompts]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearchOpen(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-gray-100">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />
      
      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                selectedCategory === category.name 
                  ? 'bg-gray-700 border-purple-500/50 text-white' 
                  : 'bg-gray-800 border-purple-500/20 text-gray-300 hover:border-purple-500/50'
              }`}
              onClick={() => handleCategoryChange(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse-slow text-purple-400">Loading prompts...</div>
          </div>
        ) : filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No prompts found. Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <SearchModal 
          categories={categories} 
          onSearch={handleSearch} 
          onClose={() => setIsSearchOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;