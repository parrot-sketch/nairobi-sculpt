import React from 'react';
import clsx from 'clsx';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

/**
 * Heading component for semantic HTML structure
 */
const Heading = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ children, as: Component = 'h1', className, ...props }, ref) => {
    const sizeClasses: Record<string, string> = {
      h1: 'text-5xl font-bold',
      h2: 'text-4xl font-bold',
      h3: 'text-3xl font-semibold',
      h4: 'text-2xl font-semibold',
      h5: 'text-xl font-semibold',
      h6: 'text-lg font-semibold',
    };

    return React.createElement(
      Component as React.ElementType,
      {
        ref,
        className: clsx(
          'font-heading text-text-primary',
          sizeClasses[Component] || 'text-lg font-semibold',
          className,
        ),
        ...props,
      },
      children,
    );
  },
);

Heading.displayName = 'Heading';

/**
 * Paragraph component for body text
 */
const Paragraph = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ children, className, ...props }, ref) => (
    <p
      ref={ref}
      className={clsx(
        'font-sans text-base text-text-primary leading-normal',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  ),
);

Paragraph.displayName = 'Paragraph';

/**
 * Label component for form labels and secondary text
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className, ...props }, ref) => (
    <label
      ref={ref}
      className={clsx(
        'font-sans text-sm font-medium text-text-secondary',
        className,
      )}
      {...props}
    >
      {children}
    </label>
  ),
);

Label.displayName = 'Label';

/**
 * Text component for tertiary text and hints
 */
const Text = React.forwardRef<HTMLSpanElement, TypographyProps>(
  ({ children, className, ...props }, ref) => (
    <span
      ref={ref}
      className={clsx(
        'font-sans text-sm text-text-tertiary',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  ),
);

Text.displayName = 'Text';

/**
 * Unified Typography component that supports variants
 */
interface UnifiedTypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'label' | 'caption';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';
}

const Typography = React.forwardRef<HTMLElement, UnifiedTypographyProps>(
  ({ children, variant = 'body1', as, className, ...props }, ref) => {
    const variantClasses: Record<string, { element: string; classes: string }> = {
      h1: { element: 'h1', classes: 'text-5xl font-bold' },
      h2: { element: 'h2', classes: 'text-4xl font-bold' },
      h3: { element: 'h3', classes: 'text-3xl font-semibold' },
      h4: { element: 'h4', classes: 'text-2xl font-semibold' },
      h5: { element: 'h5', classes: 'text-xl font-semibold' },
      h6: { element: 'h6', classes: 'text-lg font-semibold' },
      body1: { element: 'p', classes: 'text-base leading-normal' },
      body2: { element: 'p', classes: 'text-sm leading-normal' },
      label: { element: 'label', classes: 'text-sm font-medium' },
      caption: { element: 'span', classes: 'text-xs' },
    };

    const config = variantClasses[variant] || variantClasses.body1;
    const Component = (as || config.element) as React.ElementType;

    return React.createElement(
      Component,
      {
        ref,
        className: clsx(
          'font-sans text-text-primary',
          config.classes,
          className,
        ),
        ...props,
      },
      children,
    );
  },
);

Typography.displayName = 'Typography';

export { Heading, Paragraph, Label, Text, Typography };
