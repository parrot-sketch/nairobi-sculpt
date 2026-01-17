import { render, screen } from '@testing-library/react';
import Badge from './Badge';

describe('Badge Component', () => {
  it('renders badge with text', () => {
    render(<Badge>Badge</Badge>);
    expect(screen.getByText('Badge')).toBeInTheDocument();
  });

  it('renders with primary variant', () => {
    const { container } = render(<Badge variant="primary">Primary</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-primary');
  });

  it('renders with secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-bg-secondary');
  });

  it('renders with success variant', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-success');
  });

  it('renders with warning variant', () => {
    const { container } = render(<Badge variant="warning">Warning</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-warning');
  });

  it('renders with error variant', () => {
    const { container } = render(<Badge variant="error">Error</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-error');
  });

  it('renders with info variant', () => {
    const { container } = render(<Badge variant="info">Info</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-info');
  });

  it('renders with small size', () => {
    const { container } = render(<Badge size="sm">Small</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('text-xs');
  });

  it('renders with medium size', () => {
    const { container } = render(<Badge size="md">Medium</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('text-sm');
  });

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom">Badge</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('custom');
  });

  it('renders with default variant and size', () => {
    const { container } = render(<Badge>Default</Badge>);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-bg-secondary');
    expect(badge).toHaveClass('text-sm');
  });
});
