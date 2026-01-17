import React from 'react';

export interface LogoProps {
  /**
   * Display variant
   * - full: Full wordmark (logo + text)
   * - icon: Icon only
   * - monochrome: Black icon (print, grayscale)
   * - white: White icon (dark backgrounds)
   */
  variant?: 'full' | 'icon' | 'monochrome' | 'white';
  
  /**
   * Size in pixels
   * @default 32
   */
  size?: number;
  
  /**
   * CSS class for additional styling
   */
  className?: string;
  
  /**
   * Optional link destination
   */
  href?: string;
}

/**
 * Nairobi Sculpt Logo Component
 * 
 * Renders the brand logo with proper sizing, spacing, and variants.
 * Follows BRANDING_SYSTEM.md guidelines.
 * 
 * Logo assets should be placed in: /apps/web/public/branding/logo/
 * - logo-full.svg (full wordmark)
 * - logo-icon-only.svg (icon only)
 * - logo-monochrome.svg (black for print)
 * - logo-white.svg (white for dark backgrounds)
 * 
 * @example
 * ```tsx
 * <Logo variant="full" size={40} />
 * <Logo variant="icon" size={32} href="/dashboard" />
 * ```
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 32,
  className = '',
  href,
}) => {
  // Map variant to actual logo file
  const logoMap: Record<string, string> = {
    full: '/branding/logo/logo-full.svg',
    icon: '/branding/logo/logo-icon-only.svg',
    monochrome: '/branding/logo/logo-monochrome.svg',
    white: '/branding/logo/logo-white.svg',
  };

  const logoSrc = logoMap[variant];
  const dimensions = variant === 'full' ? { width: size * 3, height: size } : { width: size, height: size };

  const LogoImage = (
    <img
      src={logoSrc}
      alt="Nairobi Sculpt"
      width={dimensions.width}
      height={dimensions.height}
      className={`${className} object-contain`}
    />
  );

  if (href) {
    return (
      <a href={href} className="inline-block" title="Nairobi Sculpt">
        {LogoImage}
      </a>
    );
  }

  return <>{LogoImage}</>;
};
