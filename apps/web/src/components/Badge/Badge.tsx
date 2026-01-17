import React from 'react';
import clsx from 'clsx';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary text-white',
  secondary: 'bg-bg-secondary text-text-primary border border-border-light',
  success: 'bg-success bg-opacity-10 text-success border border-success border-opacity-30',
  warning: 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-30',
  error: 'bg-error bg-opacity-10 text-error border border-error border-opacity-30',
  info: 'bg-info bg-opacity-10 text-info border border-info border-opacity-30',
};

const sizeClasses: Record<'sm' | 'md', string> = {
  sm: 'px-md py-xs text-xs font-semibold',
  md: 'px-lg py-sm text-sm font-semibold',
};

/**
 * Badge component for labels and tags
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" size="sm">Critical</Badge>
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'secondary', size = 'md', className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center rounded-full font-sans',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

export default Badge;
