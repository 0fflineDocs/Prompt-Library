// src/components/ui/PromptModal.tsx
import React, { useEffect, useRef } from 'react';
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
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={handleClickOutside}
    >
      <div 
        ref={modalRef}
        className="bg-gray-800 w-full max-w-3xl rounded-xl shadow-2xl border border-gray-700 animate-slide-up max-h-[90vh] flex flex-col overflow-hidden"
        tabIndex={-1}
      >
        <div className="p-5 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-white">{prompt.title}</h3>
            <span className="text-xs font-medium px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">
              {prompt.category}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto">
          <pre className="text-gray-300 whitespace-pre-wrap font-sans">
            {prompt.content}
          </pre>
          
          <div className="flex flex-wrap gap-2 mt-6">
            {prompt.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="p-5 border-t border-gray-700 sticky bottom-0 bg-gray-800 flex justify-end">
          <button
            onClick={onCopy}
            className={`flex items-center gap-1 ${
              isCopied 
                ? 'bg-green-600/30 text-green-400' 
                : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
            } transition-colors px-4 py-2 rounded-md text-sm`}
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
      </div>
    </div>
  );
};

export default PromptModal;
