import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
  it('renders card container', () => {
    const { container } = render(
      <Card>
        <Card.Body>Content</Card.Body>
      </Card>
    );
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('renders with elevated style', () => {
    const { container } = render(
      <Card elevated>
        <Card.Body>Content</Card.Body>
      </Card>
    );
    const card = container.querySelector('div');
    expect(card).toHaveClass('shadow-elevated');
  });

  it('renders with hover effect', () => {
    const { container } = render(
      <Card hover>
        <Card.Body>Content</Card.Body>
      </Card>
    );
    const card = container.querySelector('div');
    expect(card).toHaveClass('hover:shadow-lg');
  });

  it('renders Card.Header subcomponent', () => {
    render(
      <Card>
        <Card.Header>Header Content</Card.Header>
      </Card>
    );
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('renders Card.Body subcomponent', () => {
    render(
      <Card>
        <Card.Body>Body Content</Card.Body>
      </Card>
    );
    expect(screen.getByText('Body Content')).toBeInTheDocument();
  });

  it('renders Card.Footer subcomponent', () => {
    render(
      <Card>
        <Card.Footer>Footer Content</Card.Footer>
      </Card>
    );
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('renders all subcomponents together', () => {
    render(
      <Card elevated>
        <Card.Header>Title</Card.Header>
        <Card.Body>Content</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        <Card.Body>Content</Card.Body>
      </Card>
    );
    const card = container.querySelector('div');
    expect(card).toHaveClass('custom-class');
  });
});
