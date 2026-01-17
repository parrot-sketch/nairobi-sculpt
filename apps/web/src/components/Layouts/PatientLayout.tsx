import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Branding/Header';
import { Footer } from '@/components/Branding/Footer';

interface PatientLayoutProps {
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Patient-specific layout
 * Used for all patient dashboard pages
 */
export const PatientLayout: React.FC<PatientLayoutProps> = ({
  title,
  actions,
  children,
}) => {
  const { user } = useAuth();

  // Redirect if not patient
  if (user?.role !== 'PATIENT') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Access Denied
          </h1>
          <p className="text-neutral-600">
            Only patients can access this area.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <Header title={title} showUserMenu={true} actions={actions} />

      {/* Content Area */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
