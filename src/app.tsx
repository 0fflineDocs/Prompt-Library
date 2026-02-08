import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import Button from './components/ui/Button';
import PromptCard from './components/ui/PromptCard';
import SearchModal from './components/SearchModal';
import { Prompt, Category } from './types';
import { fetchPrompts } from './lib/api';

const PromptLibrary: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch data once on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
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

  // Apply filters whenever category or search query changes
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

  return (
    <div className="bg-slate-900 min-h-screen font-sans text-slate-100">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />
      
      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category.name 
                  ? 'bg-slate-800 border border-slate-600/50 text-slate-100' 
                  : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600/50'
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
              {category.count && category.name !== 'All' && (
                <span className="ml-1 text-slate-500">({category.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Prompts Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-slate-400">Loading prompts...</div>
          </div>
        ) : filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrompts.map((prompt, index) => (
              <PromptCard key={prompt.id} prompt={prompt} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p>No prompts found. Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchModal 
            categories={categories} 
            onSearch={(query) => {
              setSearchQuery(query);
              setIsSearchOpen(false);
            }} 
            onClose={() => setIsSearchOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromptLibrary;
