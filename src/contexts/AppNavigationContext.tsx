import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MainView } from '@/types/history';

interface AppNavigationContextType {
  currentView: MainView;
  setCurrentView: (view: MainView) => void;
}

const AppNavigationContext = createContext<AppNavigationContextType | undefined>(undefined);

export function AppNavigationProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<MainView>('workflow');

  return (
    <AppNavigationContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </AppNavigationContext.Provider>
  );
}

export function useAppNavigation() {
  const context = useContext(AppNavigationContext);
  if (context === undefined) {
    throw new Error('useAppNavigation must be used within an AppNavigationProvider');
  }
  return context;
}
