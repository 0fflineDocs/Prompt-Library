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
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl bg-slate-900 border border-slate-700/50 shadow-2xl"
        tabIndex={-1}
      >
        <div className="p-5 border-b border-slate-700/30 flex justify-between items-center sticky top-0 bg-slate-900 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-50">{prompt.title}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
              {prompt.category}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-full hover:bg-slate-800 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5">
          {prompt.description && (
            <div className="mb-4 pb-4 border-b border-slate-700/30">
              <h4 className="text-sm font-medium text-slate-400 mb-2">Description:</h4>
              <p className="text-slate-300">{prompt.description}</p>
            </div>
          )}
          
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-2">Prompt:</h4>
            <pre className="text-slate-200 whitespace-pre-wrap font-sans text-sm">
              {prompt.content}
            </pre>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-6">
            {prompt.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border border-slate-700/50 bg-slate-800/50 text-slate-300">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="p-5 border-t border-slate-700/30 sticky bottom-0 bg-slate-900 backdrop-blur-sm flex justify-end">
          <button
            onClick={onCopy}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              isCopied 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
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
