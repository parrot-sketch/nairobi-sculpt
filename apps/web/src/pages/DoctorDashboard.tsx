import { useAuth } from '@/contexts/AuthContext';
import { Link } from '@tanstack/react-router';
import { Header } from '@/components/Branding/Header';
import { Footer } from '@/components/Branding/Footer';

export const DoctorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header title={`Welcome, Dr. ${user?.name}`} showUserMenu={true} />
      
      <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-primary-600 mb-2">
              My Schedule
            </h2>
            <p className="text-neutral-600 mb-4">Manage your appointments and procedures</p>
            <Link to="/doctor/schedule" className="text-primary-500 hover:text-primary-600">
              View Schedule →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-primary-600 mb-2">
              Patient Records
            </h2>
            <p className="text-neutral-600 mb-4">Access and update patient information</p>
            <Link to="/doctor/patients" className="text-primary-500 hover:text-primary-600">
              View Patients →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-primary-600 mb-2">
              Procedures
            </h2>
            <p className="text-neutral-600 mb-4">Track and document procedures</p>
            <Link to="/doctor/procedures" className="text-primary-500 hover:text-primary-600">
              View Procedures →
            </Link>
          </div>
        </div>
      </div>
      </main>
      
      <Footer />
    </div>
  );
};
