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
  const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-slate-600/50 disabled:opacity-50 disabled:pointer-events-none";
  
  // Variant styles
  const variantStyles = {
    default: "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700/50",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-emerald-600 text-white hover:bg-emerald-700",
    ghost: "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
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
