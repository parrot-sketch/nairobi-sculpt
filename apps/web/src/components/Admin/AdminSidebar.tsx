import { Link, useLocation } from '@tanstack/react-router';

const adminMenuItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
  { label: 'Users', path: '/admin/users', icon: '👥' },
  { label: 'Analytics', path: '/admin/analytics', icon: '📈' },
  { label: 'Reports', path: '/admin/reports', icon: '📋' },
  { label: 'Audit Logs', path: '/admin/logs', icon: '🔍' },
  { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
  { label: 'Backup', path: '/admin/backup', icon: '💾' },
];

/**
 * Admin sidebar navigation component
 * Provides quick access to all admin functions
 */
export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 overflow-y-auto">
      <nav className="p-6 space-y-2">
        {adminMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium
                ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
