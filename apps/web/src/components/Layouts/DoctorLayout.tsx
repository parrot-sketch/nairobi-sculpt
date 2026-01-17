import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Branding/Header';
import { Footer } from '@/components/Branding/Footer';
import { DoctorSidebar } from '@/components/Doctor/DoctorSidebar';

interface DoctorLayoutProps {
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Doctor-specific layout with sidebar navigation
 * Used for all doctor dashboard pages
 */
export const DoctorLayout: React.FC<DoctorLayoutProps> = ({
  title,
  actions,
  children,
}) => {
  const { user } = useAuth();

  // Redirect if not doctor
  if (user?.role !== 'DOCTOR') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Access Denied
          </h1>
          <p className="text-neutral-600">
            Only physicians can access this area.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <Header title={title} showUserMenu={true} actions={actions} />

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <DoctorSidebar />

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
