interface BadgeProps {
  children: React.ReactNode;
  color?: 'green' | 'gray' | 'amber' | 'red' | 'blue';
  className?: string;
}

const COLORS: Record<string, string> = {
  green: 'bg-brand-light text-brand-dark',
  gray: 'bg-gray-100 text-gray-500',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
};

export default function Badge({ children, color = 'green', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${COLORS[color]} ${className}`}
    >
      {children}
    </span>
  );
}
