import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { Prompt } from '../../types';

interface PromptCardProps {
  prompt: Prompt;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setIsCopied(true);
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="prompt-card bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 shadow-lg">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-white">{prompt.title}</h3>
          <span className="text-xs font-medium px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">
            {prompt.category}
          </span>
        </div>
        
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-24'}`}>
          <p className="text-gray-300 text-sm mb-4">
            {prompt.content}
          </p>
          
          {isExpanded && (
            <div className="flex flex-wrap gap-2 mt-4">
              {prompt.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-700">
          <button
            onClick={toggleExpand}
            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Hide full prompt" : "View full prompt"}
          >
            {isExpanded ? (
              <>
                <ChevronUp size={16} />
                Hide
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                View more
              </>
            )}
          </button>
          
          <button
            onClick={handleCopy}
            className={`copy-btn flex items-center gap-1 ${
              isCopied 
                ? 'bg-green-600/30 text-green-400' 
                : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
            } transition-colors px-3 py-1 rounded-full text-sm`}
            aria-label="Copy prompt to clipboard"
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
  );
};

export default PromptCard;