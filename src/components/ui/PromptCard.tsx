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
        className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-5 hover:bg-slate-800 hover:border-slate-600/50 transition-colors duration-200"
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-sm font-semibold text-slate-50">{prompt.title}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
            {prompt.category}
          </span>
        </div>
        
        <div className="h-24 overflow-hidden">
          <p className="text-slate-400 text-sm line-clamp-4">
            {prompt.description || prompt.content.substring(0, 150) + "..."}
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-slate-700/30">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors duration-200"
          >
            <Eye size={16} />
            View Prompt
          </button>
          
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 ${
              isCopied 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
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
