import React, { useState } from 'react';
import Button from '../Button';
import { Label } from '../Typography';

export interface FilterBarProps {
  onFilterChange: (filters: { specialty?: string; sortBy?: string }) => void;
  onSearch: (query: string) => void;
  specialties?: string[];
}

const DEFAULT_SPECIALTIES = [
  'Dermatology',
  'Plastic Surgery',
  'Cosmetic Surgery',
  'Facial Aesthetics',
  'Non-Surgical Aesthetics',
  'Laser Treatment',
];

/**
 * FilterBar Component
 * Provides search, specialty filter, and sort options
 * 
 * @example
 * <FilterBar 
 *   onFilterChange={(filters) => setFilters(filters)}
 *   onSearch={(query) => setSearchTerm(query)}
 * />
 */
export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  ({ onFilterChange, onSearch, specialties = DEFAULT_SPECIALTIES }, ref) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');
    const [sortBy, setSortBy] = useState('rating');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      onSearch(value);
    };

    const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedSpecialty(value);
      onFilterChange({ specialty: value === 'all' ? undefined : value });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSortBy(value);
      onFilterChange({ sortBy: value });
    };

    const handleClear = () => {
      setSearchTerm('');
      setSelectedSpecialty('all');
      setSortBy('rating');
      onSearch('');
      onFilterChange({ specialty: undefined, sortBy: 'rating' });
    };

    return (
      <div
        ref={ref}
        className="bg-white rounded-lg border border-border-light shadow-base p-6 mb-8"
      >
        <div className="space-y-6">
          {/* Search Bar */}
          <div>
            <Label htmlFor="search-doctors" className="mb-2 block">
              Search
            </Label>
            <input
              id="search-doctors"
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Specialty Filter */}
            <div>
              <label htmlFor="specialty" className="mb-2 block text-sm font-medium">
                Specialty
              </label>
              <select
                id="specialty"
                value={selectedSpecialty}
                onChange={handleSpecialtyChange}
                className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="all">All Specialties</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty.toLowerCase()}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label htmlFor="sort-by" className="mb-2 block text-sm font-medium">
                Sort By
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={handleSortChange}
                className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="rating">Rating (High to Low)</option>
                <option value="experience">Experience (Most)</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

FilterBar.displayName = 'FilterBar';

export default FilterBar;
