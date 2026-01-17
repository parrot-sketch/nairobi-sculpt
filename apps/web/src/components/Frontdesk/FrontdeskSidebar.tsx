import { Link, useLocation } from '@tanstack/react-router';

const frontdeskMenuItems = [
  { label: 'Dashboard', path: '/frontdesk/dashboard', icon: '🖥️' },
  { label: 'Appointments', path: '/frontdesk/appointments', icon: '📅' },
  { label: 'Check-in', path: '/frontdesk/checkin', icon: '✓' },
  { label: 'Patients', path: '/frontdesk/patients', icon: '👤' },
];

/**
 * Frontdesk sidebar navigation component
 * Provides quick access to frontdesk functions
 */
export const FrontdeskSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 overflow-y-auto">
      <nav className="p-6 space-y-2">
        {frontdeskMenuItems.map((item) => {
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
