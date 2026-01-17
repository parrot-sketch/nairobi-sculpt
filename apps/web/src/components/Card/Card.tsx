import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevated?: boolean;
  hover?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Card sub-components
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('border-b border-border-light px-lg py-base', className)}
      {...props}
    >
      {children}
    </div>
  ),
);

CardHeader.displayName = 'CardHeader';

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={clsx('px-lg py-base', className)} {...props}>
      {children}
    </div>
  ),
);

CardBody.displayName = 'CardBody';

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('border-t border-border-light px-lg py-base', className)}
      {...props}
    >
      {children}
    </div>
  ),
);

CardFooter.displayName = 'CardFooter';

/**
 * Card component for content grouping
 * @example
 * <Card>
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content</Card.Body>
 * </Card>
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, elevated = false, hover = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-lg bg-bg-primary border border-border-light',
          elevated && 'shadow-elevated',
          !elevated && 'shadow-base',
          hover && 'transition-shadow duration-base hover:shadow-lg cursor-pointer',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
) as React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>> & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
};

Card.displayName = 'Card';
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
export { Card, CardHeader, CardBody, CardFooter };
