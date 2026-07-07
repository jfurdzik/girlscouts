import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const VARIANTS: Record<string, string> = {
  primary: 'bg-brand hover:bg-brand-dark text-white shadow-sm',
  secondary: 'bg-white border border-brand text-brand hover:bg-brand-light',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
};

export default function Button({
  children,
  className = '',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`font-semibold px-5 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
