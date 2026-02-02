import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { EmailWorkflowProvider } from '@/contexts/EmailWorkflowContext';
import { AppNavigationProvider, useAppNavigation } from '@/contexts/AppNavigationContext';
import { HistoryTab } from '@/components/tabs/HistoryTab';
import { TaggingPlanTab } from '@/components/tabs/TaggingPlanTab';
import { AppDataProvider } from '@/contexts/AppDataContext';

interface AppLayoutProps {
  children: ReactNode;
}

function MainContent({ children }: { children: ReactNode }) {
  const { currentView } = useAppNavigation();

  if (currentView === 'history') {
    return <HistoryTab />;
  }

  if (currentView === 'tagging') {
    return <TaggingPlanTab />;
  }

  return <>{children}</>;
}

function LayoutContent({ children }: AppLayoutProps) {
  const { currentView } = useAppNavigation();
  const showHeader = currentView === 'workflow';

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        {showHeader && <AppHeader />}
        <main className="flex-1 overflow-auto">
          <MainContent>{children}</MainContent>
        </main>
      </div>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <AppNavigationProvider>
      <EmailWorkflowProvider>
        <AppDataProvider>
          <LayoutContent>{children}</LayoutContent>
        </AppDataProvider>
      </EmailWorkflowProvider>
    </AppNavigationProvider>
  );
}
