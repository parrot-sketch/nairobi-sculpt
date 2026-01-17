import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Branding/Header';
import { Footer } from '@/components/Branding/Footer';
import { FrontdeskSidebar } from '@/components/Frontdesk/FrontdeskSidebar';

interface FrontdeskLayoutProps {
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Frontdesk-specific layout with sidebar navigation
 * Used for all frontdesk dashboard pages
 */
export const FrontdeskLayout: React.FC<FrontdeskLayoutProps> = ({
  title,
  actions,
  children,
}) => {
  const { user } = useAuth();

  // Redirect if not frontdesk
  if (user?.role !== 'FRONTDESK') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Access Denied
          </h1>
          <p className="text-neutral-600">
            Only reception staff can access this area.
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
        <FrontdeskSidebar />

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
