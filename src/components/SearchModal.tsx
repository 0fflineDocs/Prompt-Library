import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
      onClick={handleClickOutside}
    >
      <motion.div 
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="scroll-panel w-full max-w-2xl rounded-xl bg-bg-1 border border-border/70 shadow-hard"
      >
        <div className="p-4 flex items-center border-b border-divider">
          <Search size={20} className="text-fg-1 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by keyword, category, or tag..."
            className="w-full px-2 py-1.5 bg-transparent text-fg-0 placeholder-muted text-sm outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={onClose}
            className="text-fg-1 hover:text-fg-0 p-1 transition-colors duration-200"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="scroll-panel p-4 max-h-96 overflow-y-auto">
          <div className="text-sm text-fg-1 mb-2">Categories</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <button 
                key={category.id}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-bg-2/60 border border-border text-fg-1 hover:text-fg-0 hover:border-accent/30 transition-colors duration-200"
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.name}
                {category.count && category.name !== 'All' && (
                  <span className="ml-1 text-muted">({category.count})</span>
                )}
              </button>
            ))}
          </div>
          
          <div className="mt-4 text-center text-muted text-sm">
            <p>Type your search query and press Enter</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchModal;
