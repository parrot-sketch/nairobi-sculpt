import { useNavigate } from '@tanstack/react-router';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center px-6">
        {/* 404 Heading */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-slate-900 mb-2">404</h1>
          <p className="text-xl text-slate-600 font-medium">Page Not Found</p>
        </div>

        {/* Error Message */}
        <p className="text-slate-500 text-lg mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-slate-200 text-slate-900 font-medium rounded-lg hover:bg-slate-300 transition-colors"
          >
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-3">Need help?</p>
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};
