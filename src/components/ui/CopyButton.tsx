import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
}

const CopyButton = ({ text, className = "" }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "text-xs flex items-center gap-1 px-2 py-1 rounded-full transition-colors duration-300",
        "bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-[#8be9fd]",
        copied ? "text-[#50fa7b]" : "text-[#8be9fd]",
        className
      )}
      style={{ minWidth: '68px', justifyContent: 'center' }}
    >
      {copied ? (
        <>
          <svg 
            className="w-3 h-3 animate-pulse" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg 
            className="w-3 h-3" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
            />
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

export default CopyButton;
