import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SystemSettings } from '../types';

interface SettingsContextType {
  settings: SystemSettings;
  updateSettings: (newSettings: SystemSettings) => void;
}

const defaultSettings: SystemSettings = {
  schoolName: 'Lutumba Adventist',
  logoUrl: '/src/assets/WhatsApp Image 2025-08-19 at 12.04.32_594ea3b2.jpg',
  contactEmail: '',
  contactPhone: '',
  address: '',
  academicYear: '2024',
  currentTerm: 'Term 1'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
  initialSettings?: SystemSettings;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ 
  children, 
  initialSettings = defaultSettings 
}) => {
  const [settings, setSettings] = useState<SystemSettings>(initialSettings);

  const updateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
