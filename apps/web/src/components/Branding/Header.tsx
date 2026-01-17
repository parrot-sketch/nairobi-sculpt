import React from 'react';
import { Logo } from './Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Typography } from '@/components/Typography';

export interface HeaderProps {
  /**
   * Show user menu/logout option
   */
  showUserMenu?: boolean;
  
  /**
   * Page title/breadcrumb
   */
  title?: string;
  
  /**
   * Additional actions (search, filters, etc.)
   */
  actions?: React.ReactNode;
}

/**
 * Main application header with branding
 * 
 * Features:
 * - Nairobi Sculpt logo and brand identity
 * - User role indicator
 * - Navigation context
 * - Professional medical aesthetic
 * 
 * @example
 * ```tsx
 * <Header 
 *   title="Patient Management"
 *   showUserMenu={true}
 * />
 * ```
 */
export const Header: React.FC<HeaderProps> = ({
  showUserMenu = true,
  title,
  actions,
}) => {
  const { user, logout } = useAuth();

  const roleLabel: Record<string, string> = {
    ADMIN: 'Administrator',
    DOCTOR: 'Physician',
    FRONTDESK: 'Reception',
    PATIENT: 'Patient',
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo & Branding */}
          <div className="flex items-center gap-4">
            <Logo variant="icon" size={40} href="/dashboard" />
            <div className="flex flex-col">
              <Typography 
                variant="h3" 
                className="text-primary-900 font-bold text-lg"
              >
                Nairobi Sculpt
              </Typography>
              <Typography 
                variant="caption" 
                className="text-neutral-500 -mt-1"
              >
                Clinical Management System
              </Typography>
            </div>
          </div>

          {/* Title/Breadcrumb */}
          {title && (
            <div className="flex-1 ml-8">
              <Typography 
                variant="body1" 
                className="text-primary-700 font-semibold"
              >
                {title}
              </Typography>
            </div>
          )}

          {/* Actions & User Menu */}
          <div className="flex items-center gap-6">
            {actions && (
              <div className="flex items-center gap-4">
                {actions}
              </div>
            )}

            {showUserMenu && user && (
              <div className="flex items-center gap-4 pl-6 border-l border-neutral-200">
                <div className="text-right">
                  <Typography 
                    variant="body2" 
                    className="text-primary-900 font-semibold"
                  >
                    {user.name}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    className="text-neutral-500"
                  >
                    {roleLabel[user.role] || user.role}
                  </Typography>
                </div>
                
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-primary-700 hover:bg-neutral-100 rounded-lg transition-colors"
                  title="Sign out"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
