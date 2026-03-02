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
  const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-accent/40 disabled:opacity-50 disabled:pointer-events-none";
  
  // Variant styles
  const variantStyles = {
    default: "btn-secondary",
    primary: "btn-primary btn-glow",
    secondary: "btn-secondary",
    ghost: "btn-ghost"
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
