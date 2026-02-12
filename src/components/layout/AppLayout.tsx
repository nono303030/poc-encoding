import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { EmailWorkflowProvider } from '@/contexts/EmailWorkflowContext';
import { AppNavigationProvider, useAppNavigation } from '@/contexts/AppNavigationContext';
import { HistoryTab } from '@/components/tabs/HistoryTab';
import { TaggingPlanTab } from '@/components/tabs/TaggingPlanTab';
import { CriteriaDefinitionTab } from '@/components/tabs/CriteriaDefinitionTab';
import { AppDataProvider } from '@/contexts/AppDataContext';

interface AppLayoutProps {
  children: ReactNode;
}

import { SecurityRolesTab } from '../tabs/SecurityRolesTab';
import { AIWorkflowView } from '../ai-steps/AIWorkflowView';
import { AIWorkflowProvider } from '@/contexts/AIWorkflowContext';

function MainContent({ children }: { children: ReactNode }) {
  const { currentView } = useAppNavigation();

  if (currentView === 'history') {
    return <HistoryTab />;
  }

  if (currentView === 'tagging') {
    return <TaggingPlanTab />;
  }

  if (currentView === 'criteria') {
    return <CriteriaDefinitionTab />;
  }

  if (currentView === 'security') {
    return <SecurityRolesTab />;
  }

  if (currentView === 'ai-workflow') {
    return <AIWorkflowView />;
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
          <AIWorkflowProvider>
            <LayoutContent>{children}</LayoutContent>
          </AIWorkflowProvider>
        </AppDataProvider>
      </EmailWorkflowProvider>
    </AppNavigationProvider>
  );
}
