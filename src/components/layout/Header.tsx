import React from 'react';
import { Search } from 'lucide-react';
import { SocialIcon } from '../ui/SocialIcons';
import Button from '../ui/Button';

interface HeaderProps {
  onOpenSearch: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  return (
    <header className="sticky top-0 z-40 h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <h1 className="font-logo text-2xl font-bold text-slate-50">
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
            type="linkedin" 
            href="https://www.linkedin.com/in/simon-h%C3%A5kansson-20163b137/" 
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
