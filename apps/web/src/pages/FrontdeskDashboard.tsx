import { useAuth } from '@/contexts/AuthContext';
import { Link } from '@tanstack/react-router';
import { Header } from '@/components/Branding/Header';
import { Footer } from '@/components/Branding/Footer';

export const FrontdeskDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header title={`Welcome, ${user?.name}`} showUserMenu={true} />
      
      <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-primary-600 mb-2">
              Appointments
            </h2>
            <p className="text-neutral-600 mb-4">Schedule and manage appointments</p>
            <Link to="/frontdesk/appointments" className="text-primary-500 hover:text-primary-600">
              Manage →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-primary-600 mb-2">
              Check-in
            </h2>
            <p className="text-neutral-600 mb-4">Process patient check-in</p>
            <Link to="/frontdesk/checkin" className="text-primary-500 hover:text-primary-600">
              Check In →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-primary-600 mb-2">
              Patient Inquiry
            </h2>
            <p className="text-neutral-600 mb-4">Look up patient information</p>
            <Link to="/frontdesk/patients" className="text-primary-500 hover:text-primary-600">
              Search →
            </Link>
          </div>
        </div>
      </div>
      </main>
      
      <Footer />
    </div>
  );
};
