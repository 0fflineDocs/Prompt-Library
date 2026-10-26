import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Copy, Check } from 'lucide-react';
import { Prompt } from '../../types';
import PromptModal from './PromptModal';

interface PromptCardProps {
  prompt: Prompt;
  index?: number;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, index = 0 }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="surface-card frost-row"
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-sm font-semibold text-fg-0">{prompt.title}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-accent/30 bg-accent/10 text-accent">
            {prompt.category}
          </span>
        </div>
        
        <div className="h-24 overflow-hidden">
          <p className="text-fg-1 text-sm line-clamp-4">
            {prompt.description || prompt.content.substring(0, 150) + "..."}
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-divider">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm text-fg-1 hover:text-fg-0 flex items-center gap-1 transition-colors duration-200"
          >
            <Eye size={16} />
            View Prompt
          </button>
          
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 ${
              isCopied 
                ? 'border border-ok/30 bg-ok/10 text-ok'
                : 'border border-ok/30 bg-ok/10 hover:bg-ok/20 text-ok'
            } transition-colors duration-200 px-2.5 py-1 rounded-md text-xs font-medium`}
          >
            {isCopied ? (
              <>
                <Check size={14} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy
              </>
            )}
          </button>
        </div>
      </motion.div>

      {isModalOpen && (
        <PromptModal 
          prompt={prompt} 
          onClose={() => setIsModalOpen(false)}
          onCopy={handleCopy}
          isCopied={isCopied}
        />
      )}
    </>
  );
};

export default PromptCard;
