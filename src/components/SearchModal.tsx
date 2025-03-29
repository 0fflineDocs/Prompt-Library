import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Category } from '../types';

interface SearchModalProps {
  categories: Category[];
  onSearch: (query: string) => void;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ categories, onSearch, onClose }) => {
  const [query, setQuery] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when modal opens
    inputRef.current?.focus();
    
    // Add event listener for escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleCategoryClick = (category: string) => {
    // If "All" is clicked, clear the search, otherwise search for the category
    if (category === 'All') {
      onSearch('');
    } else {
      onSearch(category);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(query);
      onClose();
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
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
          
          <div className="mt-4 text-center text-gray-400">
            <p>Type your search query and press Enter</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
