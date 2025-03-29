import React from 'react';

// A utility function to merge class names
const cn = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ');
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const Button = ({ 
  variant = "default", 
  size = "default", 
  className = "", 
  children, 
  ...props 
}: ButtonProps) => {
  // Base styles
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-[#8be9fd] focus:ring-offset-1 focus:ring-offset-gray-950 disabled:opacity-50 disabled:pointer-events-none";
  
  // Variant styles
  const variantStyles = {
    default: "bg-gray-800 text-gray-200 hover:bg-gray-700",
    primary: "bg-orange-600 text-white hover:bg-orange-700",
    secondary: "bg-purple-600 text-white hover:bg-purple-700",
    ghost: "bg-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
  };
  
  // Size styles
  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 py-1 text-xs",
    lg: "h-12 px-6 py-3 text-base"
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
