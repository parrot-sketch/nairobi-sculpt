import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders with primary variant by default', () => {
    const { container } = render(<Button>Primary</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-accent');
  });

  it('renders with secondary variant', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-bg-secondary');
  });

  it('renders with different sizes', () => {
    const { container: smallContainer } = render(<Button size="sm">Small</Button>);
    const smallButton = smallContainer.querySelector('button');
    expect(smallButton).toHaveClass('text-sm');

    const { container: largeContainer } = render(<Button size="lg">Large</Button>);
    const largeButton = largeContainer.querySelector('button');
    expect(largeButton).toHaveClass('text-lg');
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled') as HTMLButtonElement;
    expect(button).toBeDisabled();
  });

  it('handles full width', () => {
    const { container } = render(<Button fullWidth>Full Width</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('w-full');
  });

  it('renders loading spinner', () => {
    const { container } = render(<Button isLoading>Loading</Button>);
    const spinner = container.querySelector('svg');
    expect(spinner).toBeInTheDocument();
  });
});
