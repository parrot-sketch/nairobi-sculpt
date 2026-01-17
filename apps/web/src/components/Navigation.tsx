import { useAuth } from '@/contexts/AuthContext';
import { Link } from '@tanstack/react-router';

export const Navigation = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-primary-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">
          Nairobi Sculpt
        </Link>
        <div className="flex gap-6 items-center">
          <span className="text-sm">
            {user.name} ({user.role})
          </span>
          <button
            onClick={logout}
            className="bg-accent-500 hover:bg-accent-600 px-4 py-2 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
