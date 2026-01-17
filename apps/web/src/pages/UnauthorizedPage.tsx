import { useNavigate } from '@tanstack/react-router';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-accent-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
          Access Denied
        </h2>
        <p className="text-neutral-600 mb-8">
          You do not have permission to access this page.
        </p>
        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};
