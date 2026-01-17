import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Typography } from '@/components/Typography';
import { MetricCard } from '@/components/Admin/MetricCard';
import { AdminLayout } from '@/components/Layouts/AdminLayout';

interface DashboardMetrics {
  todayRevenue: number;
  monthRevenue: number;
  todayAppointments: number;
  weekAppointments: number;
  newPatientsThisWeek: number;
  outstandingInvoices: number;
}

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token: authToken } = useAuth();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const { getApiUrl } = await import('@/utils/getApiUrl');
        const apiUrl = getApiUrl();
        const response = await fetch(
          `${apiUrl}/admin/dashboard/metrics`,
          {
            headers: {
              Authorization: `Bearer ${authToken || localStorage.getItem('auth_token')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard metrics');
        }

        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [authToken]);

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center py-12">
          <Typography variant="body1" className="text-neutral-500">
            Loading dashboard...
          </Typography>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="bg-accent-50 border border-accent-200 rounded-lg p-6 max-w-md">
          <Typography variant="h3" className="text-accent-900 mb-2">
            Error
          </Typography>
          <Typography variant="body2" className="text-accent-700">
            {error}
          </Typography>
        </div>
      </AdminLayout>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Revenue Section */}
      <div className="mb-12">
        <Typography 
          variant="h2" 
          className="text-primary-900 mb-6 text-lg font-semibold"
        >
          Revenue
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard
            label="Today's Revenue"
            value={metrics.todayRevenue}
            format="currency"
            icon="💰"
          />
          <MetricCard
            label="This Month's Revenue"
            value={metrics.monthRevenue}
            format="currency"
            icon="📊"
          />
        </div>
      </div>

      {/* Appointments Section */}
      <div className="mb-12">
        <Typography 
          variant="h2" 
          className="text-primary-900 mb-6 text-lg font-semibold"
        >
          Appointments
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard
            label="Today's Appointments"
            value={metrics.todayAppointments}
            format="number"
            icon="📅"
          />
          <MetricCard
            label="This Week's Appointments"
            value={metrics.weekAppointments}
            format="number"
            icon="📆"
          />
        </div>
      </div>

      {/* Patients & Financial Section */}
      <div className="mb-12">
        <Typography 
          variant="h2" 
          className="text-primary-900 mb-6 text-lg font-semibold"
        >
          Operations
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard
            label="New Patients This Week"
            value={metrics.newPatientsThisWeek}
            format="number"
            icon="👥"
          />
          <MetricCard
            label="Outstanding Invoices"
            value={metrics.outstandingInvoices}
            format="currency"
            icon="💳"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-neutral-200 p-8">
        <Typography 
          variant="h2" 
          className="text-primary-900 mb-6 text-lg font-semibold"
        >
          Quick Navigation
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/users"
            className="p-5 rounded-lg border border-neutral-200 hover:border-secondary-300 hover:bg-secondary-50 transition-all group"
          >
            <Typography variant="body2" className="text-primary-700 font-semibold group-hover:text-secondary-700">
              👥 Users
            </Typography>
            <Typography variant="caption" className="text-neutral-500 mt-1 block">
              Manage user accounts
            </Typography>
          </a>
          <a
            href="/admin/analytics"
            className="p-5 rounded-lg border border-neutral-200 hover:border-secondary-300 hover:bg-secondary-50 transition-all group"
          >
            <Typography variant="body2" className="text-primary-700 font-semibold group-hover:text-secondary-700">
              📈 Analytics
            </Typography>
            <Typography variant="caption" className="text-neutral-500 mt-1 block">
              View detailed reports
            </Typography>
          </a>
          <a
            href="/admin/reports"
            className="p-5 rounded-lg border border-neutral-200 hover:border-secondary-300 hover:bg-secondary-50 transition-all group"
          >
            <Typography variant="body2" className="text-primary-700 font-semibold group-hover:text-secondary-700">
              📋 Reports
            </Typography>
            <Typography variant="caption" className="text-neutral-500 mt-1 block">
              Generate custom reports
            </Typography>
          </a>
          <a
            href="/admin/settings"
            className="p-5 rounded-lg border border-neutral-200 hover:border-secondary-300 hover:bg-secondary-50 transition-all group"
          >
            <Typography variant="body2" className="text-primary-700 font-semibold group-hover:text-secondary-700">
              ⚙️ Settings
            </Typography>
            <Typography variant="caption" className="text-neutral-500 mt-1 block">
              System configuration
            </Typography>
          </a>
        </div>
      </div>
    </AdminLayout>
  );
};
