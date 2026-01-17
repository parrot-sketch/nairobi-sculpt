import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContext';
import { LoginPage } from '../LoginPage';

const mockNavigate = jest.fn();
jest.mock('@tanstack/react-router', () => ({ useNavigate: () => mockNavigate }));

describe('LoginPage', () => {
  test('renders form and submits using AuthProvider.login', async () => {
    // Provide a small wrapper that injects a mocked login implementation
    const MockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AuthProvider>
        {children}
      </AuthProvider>
    );

    // Override global fetch only for the login call (AuthProvider will call fetch)
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: 't', user: { id: '1', name: 'Admin', email: 'admin@nairobi-sculpt.com', role: 'ADMIN' } }),
    } as any);

    render(
      <MockProvider>
        <LoginPage />
      </MockProvider>
    );

    const email = screen.getByPlaceholderText(/your@email.com/i);
    const password = screen.getByPlaceholderText(/•{4,}/i);
    const submit = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(email, { target: { value: 'admin@nairobi-sculpt.com' } });
    fireEvent.change(password, { target: { value: 'password' } });
    fireEvent.click(submit);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(submit).toHaveTextContent(/signing in...|sign in/i);
  });
});
