import React from 'react';
import { SocialIcon } from '../ui/SocialIcons';

interface HeaderProps {
  onOpenSearch: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 py-4 px-6 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-green-400 text-transparent bg-clip-text">
            Prompt Library
          </span>
        </h1>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenSearch}
            className="px-4 py-2 bg-gray-800 rounded-full flex items-center gap-2 hover:bg-gray-700 transition-colors border border-purple-500/30"
            aria-label="Search prompts"
          >
            <Search size={18} className="text-purple-400" />
            <span className="hidden sm:inline">Search prompts...</span>
          </button>
          
          <div className="hidden sm:flex gap-3">
             {/* Social Media Icons using SimpleIcons */}
          <SocialIcon 
            type="twitter" 
            href="https://x.com/0fflineDocs" 
          />
          
          <SocialIcon 
            type="bluesky" 
            href="https://bsky.app/profile/simonhakansson.com" 
          />
          
          <SocialIcon 
            type="linkedin" 
            href="https://www.linkedin.com/in/simon-h%C3%A5kansson-20163b137/" 
          />
          
          <SocialIcon 
            type="mail" 
            href="mailto:simon.ludvig.hakansson@gmail.com" 
          />
          
          <SocialIcon 
            type="github" 
            href="https://github.com/0fflineDocs/" 
          />
          </div>
        </div>
      </div>
    </header>
  );
};

interface SocialIconProps {
  icon: React.ReactNode;
  href: string;
  label: string;
  hoverColor: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon, href, label, hoverColor }) => {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`text-gray-400 hover:${hoverColor} transition-colors`}
    >
      {icon}
    </a>
  );
};

export default Header;
