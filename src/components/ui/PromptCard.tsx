import React, { useState } from 'react';
import { Eye, Copy, Check } from 'lucide-react';
import { Prompt } from '../../types';
import PromptModal from './PromptModal';

interface PromptCardProps {
  prompt: Prompt;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 shadow-lg">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-white">{prompt.title}</h3>
            <span className="text-xs font-medium px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">
              {prompt.category}
            </span>
          </div>
          
          <div className="h-24 overflow-hidden">
            <p className="text-gray-300 text-sm mb-4 line-clamp-4">
              {prompt.description || prompt.content.substring(0, 150) + "..."}
            </p>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-700">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <Eye size={16} />
              View Prompt
            </button>
            
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 ${
                isCopied 
                  ? 'bg-green-600/30 text-green-400' 
                  : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
              } transition-colors px-3 py-1 rounded-full text-sm`}
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
        </div>
      </div>

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
