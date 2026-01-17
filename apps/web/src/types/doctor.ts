/**
 * Frontend Doctor Profile Type
 * This is different from the backend DoctorProfile type
 * and matches what our components expect
 */
export interface DoctorProfile {
  id: string;
  name: string;
  specialties: string[];
  yearsExperience: number;
  profileImage: string;
  rating: number;
  ratingCount: number;
  isAvailable: boolean;
  consultationFee: number;
}

export interface DoctorGridProps {
  doctors: DoctorProfile[];
  onSelectDoctor: (id: string) => void;
  isLoading?: boolean;
  error?: string | null;
  pagination?: {
    currentPage: number;
    totalPages: number;
  };
}

export interface FilterBarProps {
  onFilterChange: (filters: { specialty?: string; sortBy?: string }) => void;
  onSearch: (query: string) => void;
  specialties?: string[];
}
