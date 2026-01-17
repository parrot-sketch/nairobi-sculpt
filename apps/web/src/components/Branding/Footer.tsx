import React from 'react';
import { Logo } from './Logo';
import { Typography } from '@/components/Typography';

/**
 * Application footer with branding, links, and legal info
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white border-t border-primary-800 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Branding */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Logo variant="white" size={36} />
            </div>
            <Typography 
              variant="caption" 
              className="text-neutral-300 block mb-4"
            >
              Professional clinical management system for Nairobi Sculpt Aesthetic Centre
            </Typography>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com/nairobisculpt" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-accent-400 transition"
                aria-label="Facebook"
              >
                f
              </a>
              <a 
                href="https://instagram.com/nairobi_sculpt" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-accent-400 transition"
                aria-label="Instagram"
              >
                📷
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <Typography 
              variant="label" 
              className="text-white font-bold mb-4 block"
            >
              Product
            </Typography>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/admin/dashboard" 
                  className="text-neutral-300 hover:text-accent-400 transition text-sm"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a 
                  href="/admin/patients" 
                  className="text-neutral-300 hover:text-accent-400 transition text-sm"
                >
                  Patients
                </a>
              </li>
              <li>
                <a 
                  href="/admin/doctors" 
                  className="text-neutral-300 hover:text-accent-400 transition text-sm"
                >
                  Doctors
                </a>
              </li>
              <li>
                <a 
                  href="/admin/billing" 
                  className="text-neutral-300 hover:text-accent-400 transition text-sm"
                >
                  Billing
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <Typography 
              variant="label" 
              className="text-white font-bold mb-4 block"
            >
              Support
            </Typography>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:support@nairobisculpt.co.ke" 
                  className="text-neutral-300 hover:text-accent-400 transition text-sm"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-neutral-300 hover:text-accent-400 transition text-sm"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-neutral-300 hover:text-accent-400 transition text-sm"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-neutral-300 hover:text-accent-400 transition text-sm"
                >
                  Status
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <Typography 
              variant="label" 
              className="text-white font-bold mb-4 block"
            >
              Contact
            </Typography>
            <ul className="space-y-3 text-sm">
              <li className="text-neutral-300">
                📍 4th Avenue Towers, 13th Floor
                <br />
                Nairobi, Kenya
              </li>
              <li>
                <a 
                  href="tel:+254759067388" 
                  className="text-neutral-300 hover:text-accent-400 transition"
                >
                  📞 +254 759 067 388
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@nairobisculpt.co.ke" 
                  className="text-neutral-300 hover:text-accent-400 transition"
                >
                  ✉️ info@nairobisculpt.co.ke
                </a>
              </li>
              <li className="pt-2 text-neutral-400 text-xs">
                Mon - Sat: 8:00 AM - 5:00 PM
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Bottom */}
        <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Typography 
            variant="caption" 
            className="text-neutral-400"
          >
            © {currentYear} Nairobi Sculpt Aesthetic Centre. All rights reserved.
          </Typography>
          <div className="flex gap-6">
            <a 
              href="#" 
              className="text-neutral-400 hover:text-accent-400 transition text-xs"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-neutral-400 hover:text-accent-400 transition text-xs"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-neutral-400 hover:text-accent-400 transition text-xs"
            >
              Cookie Policy
            </a>
            <a 
              href="#" 
              className="text-neutral-400 hover:text-accent-400 transition text-xs"
            >
              HIPAA Compliance
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
