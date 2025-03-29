import React from 'react';
import { Search } from 'lucide-react';
import Button from '../ui/Button';
import { SocialIcon } from '../ui/SocialIcons';

interface HeaderProps {
  onOpenSearch: () => void;
}

const Header = ({ onOpenSearch }: HeaderProps) => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 py-4 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">
          KQL Library
        </h1>
        <div className="flex items-center gap-3">
          <Button
            className="text-gray-400 hover:text-gray-300 p-2 rounded-full hover:bg-gray-800/50"
            onClick={onOpenSearch}
            title="Search"
          >
            <Search className="w-5 h-5" />
          </Button>

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
    </header>
  );
};

export default Header;
