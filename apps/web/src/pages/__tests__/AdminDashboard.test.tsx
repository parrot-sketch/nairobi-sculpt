import { render, screen, waitFor } from '@testing-library/react';
import { AdminDashboard } from '../AdminDashboard';

const mockNavigate = jest.fn();
jest.mock('@tanstack/react-router', () => ({ useNavigate: () => mockNavigate }));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Admin', email: 'admin@nairobi-sculpt.com', role: 'ADMIN' },
    token: 't',
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
    signup: jest.fn(),
  }),
}));

describe('AdminDashboard', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        todayRevenue: 5000,
        monthRevenue: 20000,
        todayAppointments: 2,
        weekAppointments: 10,
        newPatientsThisWeek: 1,
        outstandingInvoices: 1500,
      }),
    });
  });

  test('renders metrics after fetching', async () => {
    render(<AdminDashboard />);

    await waitFor(() => expect(screen.getByText(/Today's Revenue/i)).toBeInTheDocument());
    expect(screen.getByText(/Today's Revenue/i)).toBeInTheDocument();
    expect(screen.getByText(/This Month's Revenue/i)).toBeInTheDocument();
    expect(screen.getByText(/Outstanding Invoices/i)).toBeInTheDocument();
  });
});
