import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface SchoolLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SchoolLogo: React.FC<SchoolLogoProps> = ({ size = 'md', className = '' }) => {
  const { settings } = useSettings();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  if (!settings.logoUrl) {
    // Fallback to school initials if no logo
    return (
      <div className={`${sizeClasses[size]} ${className} bg-blue-600 rounded-full flex items-center justify-center`}>
        <span className="text-white font-bold text-sm">LASS</span>
      </div>
    );
  }

  return (
    <img
      src={settings.logoUrl}
      alt={`${settings.schoolName} Logo`}
      className={`${sizeClasses[size]} ${className} object-contain`}
      onError={(e) => {
        // Fallback if image fails to load
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        target.parentElement!.innerHTML = `
          <div class="${sizeClasses[size]} ${className} bg-blue-600 rounded-full flex items-center justify-center">
            <span class="text-white font-bold text-sm">LASS</span>
          </div>
        `;
      }}
    />
  );
};

export default SchoolLogo;
