import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from './FilterBar';

describe('FilterBar Component', () => {
  const mockOnFilterChange = jest.fn();
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all filter inputs', () => {
    render(
      <FilterBar
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByPlaceholderText('Search doctors...')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /specialty/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /sort by/i })).toBeInTheDocument();
  });

  it('handles search input', () => {
    render(
      <FilterBar
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    const searchInput = screen.getByPlaceholderText(
      'Search doctors...'
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Sarah' } });

    expect(mockOnSearch).toHaveBeenCalledWith('Sarah');
  });

  it('handles specialty filter change', () => {
    render(
      <FilterBar
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    const specialtySelect = screen.getByRole(
      'combobox',
      { name: /specialty/i }
    ) as HTMLSelectElement;
    fireEvent.change(specialtySelect, { target: { value: 'dermatology' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      specialty: 'dermatology',
    });
  });

  it('handles sort option change', () => {
    render(
      <FilterBar
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    const sortSelect = screen.getByRole(
      'combobox',
      { name: /sort by/i }
    ) as HTMLSelectElement;
    fireEvent.change(sortSelect, { target: { value: 'experience' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      sortBy: 'experience',
    });
  });

  it('calls onFilterChange with multiple filters', () => {
    render(
      <FilterBar
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    const specialtySelect = screen.getByRole('combobox', { name: /specialty/i });
    fireEvent.change(specialtySelect, { target: { value: 'plastic surgery' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      specialty: 'plastic surgery',
    });
  });

  it('displays correct specialty options', () => {
    render(
      <FilterBar
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByText('All Specialties')).toBeInTheDocument();
    expect(screen.getByText('Dermatology')).toBeInTheDocument();
    expect(screen.getByText('Plastic Surgery')).toBeInTheDocument();
  });

  it('displays correct sort options', () => {
    render(
      <FilterBar
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByText('Rating (High to Low)')).toBeInTheDocument();
    expect(screen.getByText('Experience (Most)')).toBeInTheDocument();
    expect(screen.getByText('Name (A-Z)')).toBeInTheDocument();
  });

  it('clears search with clear button', () => {
    render(
      <FilterBar
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    const searchInput = screen.getByPlaceholderText(
      'Search doctors...'
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Sarah' } });

    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);

    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('has accessible labels for all inputs', () => {
    render(
      <FilterBar
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByRole('combobox', { name: /specialty/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /sort by/i })).toBeInTheDocument();
  });

  it('clears all filters when clear button is clicked', () => {
    render(
      <FilterBar
        onFilterChange={mockOnFilterChange}
        onSearch={mockOnSearch}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search doctors...') as HTMLInputElement;
    const specialtySelect = screen.getByRole('combobox', { name: /specialty/i }) as HTMLSelectElement;
    const sortSelect = screen.getByRole('combobox', { name: /sort by/i }) as HTMLSelectElement;

    fireEvent.change(searchInput, { target: { value: 'John' } });
    fireEvent.change(specialtySelect, { target: { value: 'dermatology' } });
    fireEvent.change(sortSelect, { target: { value: 'name' } });

    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);

    expect(mockOnSearch).toHaveBeenCalledWith('');
    expect(mockOnFilterChange).toHaveBeenLastCalledWith({ specialty: undefined, sortBy: 'rating' });
  });
});
