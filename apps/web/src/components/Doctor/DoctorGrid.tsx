import React from 'react';
import { Paragraph, Heading } from '../Typography';
import { DoctorCard } from './DoctorCard';
import type { DoctorProfile } from '../../types/doctor';

interface DoctorGridProps {
  doctors: DoctorProfile[];
  onSelectDoctor: (id: string) => void;
  isLoading?: boolean;
  error?: string | null;
  currentPage?: number;
  totalPages?: number;
}

/**
 * DoctorGrid Component
 * Displays a responsive grid of doctor cards
 * Handles loading, error, and empty states
 * 
 * @example
 * <DoctorGrid 
 *   doctors={doctors} 
 *   onSelectDoctor={handleSelectDoctor}
 *   isLoading={loading}
 *   error={error}
 * />
 */
export const DoctorGrid = React.forwardRef<HTMLDivElement, DoctorGridProps>(
  (
    {
      doctors,
      onSelectDoctor,
      isLoading = false,
      error = null,
      currentPage,
      totalPages,
    },
    ref
  ) => {
    // Loading State
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <Paragraph className="mt-4">Loading doctors...</Paragraph>
        </div>
      );
    }

    // Error State
    if (error) {
      return (
        <div className="bg-error bg-opacity-10 border border-error border-opacity-30 rounded-lg p-4">
          <Heading as="h3" className="text-error mb-2">
            Error Loading Doctors
          </Heading>
          <Paragraph className="text-error">{error}</Paragraph>
        </div>
      );
    }

    // Empty State
    if (doctors.length === 0) {
      return (
        <div className="text-center py-12">
          <Heading as="h3" className="mb-2">
            No doctors found
          </Heading>
          <Paragraph className="text-text-secondary">
            Try adjusting your search filters
          </Paragraph>
        </div>
      );
    }

    return (
      <div ref={ref}>
        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onViewDetails={onSelectDoctor}
            />
          ))}
        </div>

        {/* Pagination Info */}
        {currentPage !== undefined && totalPages !== undefined && (
          <div className="flex justify-center py-4">
            <Paragraph className="text-sm text-text-secondary">
              Page {currentPage} of {totalPages}
            </Paragraph>
          </div>
        )}
      </div>
    );
  }
);

DoctorGrid.displayName = 'DoctorGrid';

export default DoctorGrid;
