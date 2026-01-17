import { render, screen } from '@testing-library/react';
import { DoctorCard } from './DoctorCard';

// Mock doctor data
const mockDoctor = {
  id: 'doc-1',
  name: 'Dr. Sarah Kariuki',
  specialties: ['Dermatology', 'Aesthetics'],
  yearsExperience: 12,
  profileImage: 'https://example.com/doctor1.jpg',
  rating: 4.8,
  ratingCount: 245,
  isAvailable: true,
  consultationFee: 5000,
};

describe('DoctorCard Component', () => {
  it('renders doctor name', () => {
    render(<DoctorCard doctor={mockDoctor} onViewDetails={() => {}} />);
    expect(screen.getByText('Dr. Sarah Kariuki')).toBeInTheDocument();
  });

  it('displays specialties', () => {
    render(<DoctorCard doctor={mockDoctor} onViewDetails={() => {}} />);
    expect(screen.getByText('Dermatology, Aesthetics')).toBeInTheDocument();
  });

  it('shows years of experience', () => {
    render(<DoctorCard doctor={mockDoctor} onViewDetails={() => {}} />);
    expect(screen.getByText('12 years')).toBeInTheDocument();
  });

  it('displays rating', () => {
    render(<DoctorCard doctor={mockDoctor} onViewDetails={() => {}} />);
    expect(screen.getByText(/4\.8/)).toBeInTheDocument();
  });

  it('shows availability badge when available', () => {
    render(<DoctorCard doctor={mockDoctor} onViewDetails={() => {}} />);
    const badge = screen.getByText('Available');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-success');
  });

  it('shows unavailable badge when not available', () => {
    const unavailableDoctor = { ...mockDoctor, isAvailable: false };
    render(<DoctorCard doctor={unavailableDoctor} onViewDetails={() => {}} />);
    const badge = screen.getByText('Unavailable');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-error');
  });

  it('calls onViewDetails when View Profile button clicked', () => {
    const mockOnViewDetails = jest.fn();
    render(<DoctorCard doctor={mockDoctor} onViewDetails={mockOnViewDetails} />);
    
    const viewButton = screen.getByText('View Profile');
    viewButton.click();
    
    expect(mockOnViewDetails).toHaveBeenCalledWith('doc-1');
  });

  it('displays consultation fee', () => {
    render(<DoctorCard doctor={mockDoctor} onViewDetails={() => {}} />);
    expect(screen.getByText(/Ksh 5,000|KES 5,000/)).toBeInTheDocument();
  });

  it('renders with hover effect', () => {
    const { container } = render(
      <DoctorCard doctor={mockDoctor} onViewDetails={() => {}} />
    );
    const card = container.querySelector('[class*="hover"]');
    expect(card).toBeInTheDocument();
  });
});
