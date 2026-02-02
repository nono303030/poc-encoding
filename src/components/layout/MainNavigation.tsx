import { useAppNavigation } from '@/contexts/AppNavigationContext';
import { MainView } from '@/types/history';
import { cn } from '@/lib/utils';
import { FileText, History, Tags } from 'lucide-react';

interface NavItem {
  id: MainView;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'workflow', label: 'Workflow', icon: FileText },
  { id: 'history', label: 'History', icon: History },
  { id: 'tagging', label: 'Tagging Plan', icon: Tags },
];

export function MainNavigation() {
  const { currentView, setCurrentView } = useAppNavigation();

  return (
    <nav className="flex items-center gap-1 px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              isActive 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
