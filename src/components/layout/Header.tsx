import React from 'react';
import { Search } from 'lucide-react';
import { SocialIcon } from '../ui/SocialIcons';
import Button from '../ui/Button';

interface HeaderProps {
  onOpenSearch: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 py-4 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-blue-400 text-transparent bg-clip-text">
          Prompt Library
        </h1>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full p-2"
            onClick={onOpenSearch}
            title="Search"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Social Media Icons */}
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
    </header>
  );
};

export default Header;
