import { render, screen } from '@testing-library/react';
import { DoctorGrid } from './DoctorGrid';

const mockDoctors = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Kariuki',
    specialties: ['Dermatology'],
    yearsExperience: 12,
    profileImage: 'https://example.com/doctor1.jpg',
    rating: 4.8,
    ratingCount: 245,
    isAvailable: true,
    consultationFee: 5000,
  },
  {
    id: 'doc-2',
    name: 'Dr. James Mwangi',
    specialties: ['Plastic Surgery'],
    yearsExperience: 15,
    profileImage: 'https://example.com/doctor2.jpg',
    rating: 4.9,
    ratingCount: 312,
    isAvailable: true,
    consultationFee: 6000,
  },
];

describe('DoctorGrid Component', () => {
  it('renders all doctors', () => {
    render(
      <DoctorGrid doctors={mockDoctors} onSelectDoctor={() => {}} />
    );
    
    expect(screen.getByText('Dr. Sarah Kariuki')).toBeInTheDocument();
    expect(screen.getByText('Dr. James Mwangi')).toBeInTheDocument();
  });

  it('renders empty state when no doctors', () => {
    render(
      <DoctorGrid doctors={[]} onSelectDoctor={() => {}} />
    );
    
    expect(screen.getByText('No doctors found')).toBeInTheDocument();
  });

  it('applies responsive grid layout', () => {
    const { container } = render(
      <DoctorGrid doctors={mockDoctors} onSelectDoctor={() => {}} />
    );
    
    const grid = container.querySelector('[class*="grid"]');
    expect(grid).toBeInTheDocument();
  });

  it('calls onSelectDoctor with doctor ID when card clicked', () => {
    const mockOnSelect = jest.fn();
    render(
      <DoctorGrid doctors={mockDoctors} onSelectDoctor={mockOnSelect} />
    );
    
    const viewButtons = screen.getAllByText('View Profile');
    viewButtons[0].click();
    
    expect(mockOnSelect).toHaveBeenCalledWith('doc-1');
  });

  it('displays loading state', () => {
    render(
      <DoctorGrid doctors={[]} isLoading={true} onSelectDoctor={() => {}} />
    );
    
    expect(screen.getByText('Loading doctors...')).toBeInTheDocument();
  });

  it('displays error state', () => {
    const errorMessage = 'Failed to load doctors';
    render(
      <DoctorGrid 
        doctors={[]} 
        error={errorMessage}
        onSelectDoctor={() => {}} 
      />
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('handles pagination when provided', () => {
    render(
      <DoctorGrid 
        doctors={mockDoctors} 
        onSelectDoctor={() => {}}
        currentPage={1}
        totalPages={3}
      />
    );
    
    expect(screen.getByText(/Page 1 of 3/)).toBeInTheDocument();
  });
});
