import React from 'react';
import Card from '../Card';
import Badge from '../Badge';
import Button from '../Button';
import { Heading, Paragraph, Text } from '../Typography';
import type { DoctorProfile } from '../../types/doctor';

interface DoctorCardProps {
  doctor: DoctorProfile;
  onViewDetails: (id: string) => void;
}

/**
 * DoctorCard Component
 * Displays doctor information in a reusable card format
 * Uses Phase 1 Card component for consistent styling
 * 
 * @example
 * <DoctorCard doctor={doctor} onViewDetails={(id) => navigate(`/doctors/${id}`)} />
 */
export const DoctorCard = React.forwardRef<HTMLDivElement, DoctorCardProps>(
  ({ doctor, onViewDetails }, ref) => {
    const formatFee = (fee: number) => {
      return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        maximumFractionDigits: 0,
      }).format(fee);
    };

    const availabilityBadge = doctor.isAvailable ? (
      <Badge variant="success" size="sm" className="absolute top-4 right-4">
        Available
      </Badge>
    ) : (
      <Badge variant="error" size="sm" className="absolute top-4 right-4">
        Unavailable
      </Badge>
    );

    return (
      <Card ref={ref} hover elevated className="flex flex-col h-full">
        {/* Header with Image */}
        <Card.Header className="relative p-0 overflow-hidden bg-gray-200">
          <img
            src={doctor.profileImage}
            alt={doctor.name}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
          {availabilityBadge}
        </Card.Header>

        {/* Body Content */}
        <Card.Body className="flex-grow">
          {/* Name */}
          <Heading as="h3" className="mb-2">
            {doctor.name}
          </Heading>

          {/* Specialties */}
          <Paragraph className="text-sm text-text-secondary mb-3">
            {doctor.specialties.join(', ')}
          </Paragraph>

          {/* Meta Information */}
          <div className="space-y-2 mb-4">
            {/* Experience and Rating */}
            <div className="flex gap-2">
              <Badge variant="info" size="sm">
                {doctor.yearsExperience} years
              </Badge>
              <Badge variant="primary" size="sm" className="flex items-center gap-1">
                ★ {doctor.rating.toFixed(1)}
              </Badge>
            </div>

            {/* Rating Count */}
            <Text className="text-xs text-text-tertiary">
              {doctor.ratingCount} {doctor.ratingCount === 1 ? 'review' : 'reviews'}
            </Text>
          </div>

          {/* Consultation Fee */}
          <div className="bg-bg-secondary rounded-lg p-3 mb-4">
            <Text className="text-xs text-text-secondary block mb-1">
              Consultation Fee
            </Text>
            <Heading as="h4" className="text-lg">
              {formatFee(doctor.consultationFee)}
            </Heading>
          </div>
        </Card.Body>

        {/* Footer with Action Button */}
        <Card.Footer className="border-t border-border-light">
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => onViewDetails(doctor.id)}
            className="w-full"
          >
            View Profile
          </Button>
        </Card.Footer>
      </Card>
    );
  }
);

DoctorCard.displayName = 'DoctorCard';

export default DoctorCard;
