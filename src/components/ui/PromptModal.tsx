// src/components/ui/PromptModal.tsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { Prompt } from '../../types';

interface PromptModalProps {
  prompt: Prompt;
  onClose: () => void;
  onCopy: () => void;
  isCopied: boolean;
}

const PromptModal: React.FC<PromptModalProps> = ({ prompt, onClose, onCopy, isCopied }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Focus modal when it opens
    modalRef.current?.focus();
    
    // Add event listener for escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

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
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClickOutside}
    >
      <motion.div 
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="scroll-panel w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl bg-bg-1 border border-border/70 shadow-hard"
        tabIndex={-1}
      >
        <div className="p-5 border-b border-divider flex justify-between items-center sticky top-0 bg-bg-1 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-fg-0">{prompt.title}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-accent/30 bg-accent/10 text-accent">
              {prompt.category}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-fg-1 hover:text-fg-0 p-1 rounded-full hover:bg-bg-2 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5">
          {prompt.description && (
            <div className="mb-4 pb-4 border-b border-divider">
              <h4 className="text-sm font-medium text-fg-1 mb-2">Description:</h4>
              <p className="text-fg-1">{prompt.description}</p>
            </div>
          )}
          
          <div>
            <h4 className="text-sm font-medium text-fg-1 mb-2">Prompt:</h4>
            <pre className="text-fg-0 whitespace-pre-wrap font-sans text-sm">
              {prompt.content}
            </pre>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-6">
            {prompt.tags.map((tag) => (
               <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border border-border bg-bg-2/60 text-fg-1">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="p-5 border-t border-divider sticky bottom-0 bg-bg-1 backdrop-blur-sm flex justify-end">
          <button
            onClick={onCopy}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isCopied 
                ? 'border border-ok/30 bg-ok/10 text-ok'
                : 'border border-ok/30 bg-ok/10 hover:bg-ok/20 text-ok'
            }`}
          >
            {isCopied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy Prompt
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PromptModal;
