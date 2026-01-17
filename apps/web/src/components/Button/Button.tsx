import React from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-dark active:bg-accent-dark disabled:bg-border-light disabled:text-text-tertiary',
  secondary: 'bg-bg-secondary text-text-primary hover:bg-bg-tertiary active:bg-border-medium disabled:bg-bg-secondary disabled:text-text-tertiary border border-border-light',
  danger: 'bg-error text-white hover:bg-[#8a1627] active:bg-[#8a1627] disabled:bg-border-light disabled:text-text-tertiary',
  ghost: 'text-text-primary hover:bg-bg-secondary active:bg-bg-tertiary disabled:text-text-tertiary',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-md py-xs text-sm font-medium',
  md: 'px-lg py-md text-base font-medium',
  lg: 'px-xl py-lg text-lg font-semibold',
};

/**
 * Button component with multiple variants and sizes
 * @example
 * <Button variant="primary">Click me</Button>
 * <Button variant="secondary" size="lg">Large secondary button</Button>
 * <Button isLoading>Loading...</Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          // Base styles
          'inline-flex items-center justify-center rounded-base font-sans transition-colors duration-base whitespace-nowrap cursor-pointer',
          // Disabled state
          'disabled:cursor-not-allowed disabled:opacity-60',
          // Variant and size
          variantClasses[variant],
          sizeClasses[size],
          // Full width
          fullWidth && 'w-full',
          // Custom classes
          className,
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-md h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
