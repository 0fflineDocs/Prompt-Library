import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

const Button = ({ 
  variant = "default", 
  size = "default", 
  className = "", 
  children, 
  ...props 
}: ButtonProps) => (
  <button
    className={cn(
      "inline-flex items-center justify-start rounded-md text-sm font-medium transition-colors",
      "focus:outline-none focus:ring-1 focus:ring-[#8be9fd] focus:ring-offset-2 focus:ring-offset-gray-950",
      "disabled:opacity-50 disabled:pointer-events-none",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;
