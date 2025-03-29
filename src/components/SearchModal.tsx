import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Category, SearchResult } from '../types';
import { searchPrompts } from '../lib/api';

interface SearchModalProps {
  categories: Category[];
  onSearch: (query: string) => void;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ categories, onSearch, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when modal opens
    inputRef.current?.focus();
    
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    
    // Add event listener for escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    // Search as you type with debounce
    const handler = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        const searchResults = await searchPrompts(query);
        setResults(searchResults);
        setIsLoading(false);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      // Save to recent searches
      const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      
      onSearch(query);
    }
  };

  const handleCategoryClick = (category: string) => {
    // If "All" is clicked, clear the search, otherwise search for the category
    if (category === 'All') {
      onSearch('');
    } else {
      onSearch(category);
    }
    onClose();
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    onSearch(search);
    onClose();
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-start justify-center pt-24 px-4 z-50 search-modal"
      onClick={handleClickOutside}
    >
      <div 
        ref={modalRef}
        className="bg-gray-800 w-full max-w-2xl rounded-xl shadow-2xl border border-gray-700 search-modal-content"
      >
        <div className="p-4 flex items-center border-b border-gray-700">
          <Search size={20} className="text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by keyword, category, or tag..."
            className="bg-transparent border-none outline-none text-white w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="text-sm text-gray-400 mb-2">Categories</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <button 
                key={category.id}
                className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 transition-colors"
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.name}
                {category.count && category.name !== 'All' && (
                  <span className="ml-1 text-gray-400">({category.count})</span>
                )}
              </button>
            ))}
          </div>
          
          {isLoading ? (
            <div className="py-4 text-center text-gray-400">Searching...</div>
          ) : results.length > 0 ? (
            <>
              <div className="text-sm text-gray-400 mt-4 mb-2">Results</div>
              <div className="space-y-2">
                {results.map((result) => (
                  <button
                    key={result.id}
                    className="w-full text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => {
                      onSearch(result.title);
                      onClose();
                    }}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium text-white">{result.title}</span>
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                        {result.category}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {result.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs text-gray-400">#{tag}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : recentSearches.length > 0 && !query ? (
            <>
              <div className="text-sm text-gray-400 mt-4 mb-2">Recent Searches</div>
              <div className="space-y-2">
                {recentSearches.map((search) => (
                  <div 
                    key={search}
                    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-gray-300 cursor-pointer"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    <Search size={14} />
                    <span>{search}</span>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;