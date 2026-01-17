import { render, screen } from '@testing-library/react';
import { Heading, Paragraph, Label, Text } from './Typography';

describe('Typography Components', () => {
  describe('Heading', () => {
    it('renders h1 heading', () => {
      render(<Heading as="h1">Heading 1</Heading>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('renders h2 heading', () => {
      render(<Heading as="h2">Heading 2</Heading>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('renders h3 through h6 headings', () => {
      render(
        <>
          <Heading as="h3">H3</Heading>
          <Heading as="h4">H4</Heading>
          <Heading as="h5">H5</Heading>
          <Heading as="h6">H6</Heading>
        </>
      );
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 5 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 6 })).toBeInTheDocument();
    });

    it('applies appropriate size classes', () => {
      const { container } = render(<Heading as="h1">Large</Heading>);
      const heading = container.querySelector('h1');
      expect(heading).toHaveClass('text-5xl');
    });

    it('applies custom className', () => {
      const { container } = render(<Heading as="h1" className="custom">Text</Heading>);
      const heading = container.querySelector('h1');
      expect(heading).toHaveClass('custom');
    });
  });

  describe('Paragraph', () => {
    it('renders paragraph element', () => {
      render(<Paragraph>Paragraph text</Paragraph>);
      const paragraph = screen.getByText('Paragraph text');
      expect(paragraph.tagName).toBe('P');
    });

    it('applies base text styling', () => {
      const { container } = render(<Paragraph>Text</Paragraph>);
      const paragraph = container.querySelector('p');
      expect(paragraph).toHaveClass('text-base');
      expect(paragraph).toHaveClass('leading-normal');
    });

    it('applies custom className', () => {
      const { container } = render(<Paragraph className="custom">Text</Paragraph>);
      const paragraph = container.querySelector('p');
      expect(paragraph).toHaveClass('custom');
    });
  });

  describe('Label', () => {
    it('renders label element', () => {
      render(<Label htmlFor="input">Label text</Label>);
      const label = screen.getByText('Label text');
      expect(label.tagName).toBe('LABEL');
    });

    it('associates with input via htmlFor', () => {
      render(<Label htmlFor="test-input">Label</Label>);
      const label = screen.getByText('Label') as HTMLLabelElement;
      expect(label.htmlFor).toBe('test-input');
    });

    it('applies label styling', () => {
      const { container } = render(<Label htmlFor="input">Label</Label>);
      const label = container.querySelector('label');
      expect(label).toHaveClass('text-sm');
      expect(label).toHaveClass('font-medium');
    });
  });

  describe('Text', () => {
    it('renders span element', () => {
      const { container } = render(<Text>Small text</Text>);
      const text = container.querySelector('span');
      expect(text).toBeInTheDocument();
    });

    it('applies text styling', () => {
      const { container } = render(<Text>Small text</Text>);
      const text = container.querySelector('span');
      expect(text).toHaveClass('text-sm');
    });

    it('applies custom className', () => {
      const { container } = render(<Text className="custom">Text</Text>);
      const text = container.querySelector('span');
      expect(text).toHaveClass('custom');
    });
  });
});
