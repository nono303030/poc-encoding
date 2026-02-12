import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  FileText,
  LayoutTemplate,
  Image,
  CheckSquare,
  Send,
  Check,
  History,
  Tags,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  Upload,
  Users,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmailWorkflow } from '@/contexts/EmailWorkflowContext';
import { useAppNavigation } from '@/contexts/AppNavigationContext';
import { useAppData } from '@/contexts/AppDataContext';
import { WorkflowStep } from '@/types/email';
import { MainView } from '@/types/history';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface StepItem {
  id: WorkflowStep;
  label: string;
  icon: React.ElementType;
}

interface MainNavItem {
  id: MainView;
  label: string;
  icon: React.ElementType;
}

const steps: StepItem[] = [
  { id: 'metadata', label: 'Campaign Info', icon: FileText },
  { id: 'import', label: 'Import Content', icon: Upload }, // Changed icon to distinguish
  { id: 'structure', label: 'Email Structure', icon: LayoutTemplate },
  { id: 'images', label: 'Images', icon: Image },
  { id: 'validation', label: 'Validation', icon: CheckSquare },
  { id: 'confirm', label: 'Confirm & Send', icon: Send },
];

const mainNavItems: MainNavItem[] = [
  { id: 'history', label: 'All Emails', icon: History },
  { id: 'criteria', label: 'Criteria Definition', icon: CheckSquare },
  { id: 'tagging', label: 'Tagging Plan', icon: Tags },
  { id: 'security', label: 'Security & Roles', icon: Users },
];

export function AppSidebar() {
  const { currentStep, setCurrentStep, getStepStatus, projectName, resetWorkflow } = useEmailWorkflow();
  const { currentView, setCurrentView } = useAppNavigation();
  const { categories, setFilter, activeFilter, toggleTagFilter, resetFilters } = useAppData();

  // Local state for expanded folders (default all open for now, or could store in local storage)
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['1', '2']);

  const handleNavClick = (view: MainView) => {
    setCurrentView(view);
    if (view === 'history') {
      resetFilters(); // Clear filter when clicking "All Emails"
    }
  };

  const handleTagClick = (tagName: string) => {
    toggleTagFilter(tagName);
    setCurrentView('history');
  };

  const toggleCategory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleStepClick = (stepId: WorkflowStep, isClickable: boolean) => {
    if (isClickable) {
      setCurrentView('workflow');
      setCurrentStep(stepId);
    }
  };

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col min-h-screen border-r border-sidebar-border">
      {/* Header */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-sidebar-accent flex items-center justify-center">
            <Send className="w-4 h-4 text-sidebar-primary" />
          </div>
          <span className="font-semibold text-sidebar-primary">EmailEncode</span>
        </div>
        <p className="text-xs text-sidebar-muted mt-3">Current Project</p>
        <p className="text-sm font-medium text-sidebar-foreground truncate">{projectName}</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {/* Workflow Steps */}
        <div className="px-4 mb-6">
          <Button
            className="w-full mb-3 gap-2 font-semibold shadow-md bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
            size="lg"
            onClick={() => {
              setCurrentView('workflow');
              setCurrentStep('metadata');
            }}
          >
            <Send className="w-4 h-4" />
            Encoder un email
          </Button>

          <Button
            className="w-full mb-6 gap-2 font-semibold shadow-sm border-2 border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"
            size="lg"
            variant="outline"
            onClick={() => setCurrentView('ai-workflow')}
          >
            <Sparkles className="w-4 h-4" />
            ✨ AI Mode
          </Button>

          <div className="relative pl-2">
            {/* Connecting Line */}
            <div className="absolute left-[29px] top-4 bottom-4 w-0.5 bg-sidebar-primary/20" />

            <ul className="space-y-4 relative">
              {steps.map((step, index) => {
                const status = getStepStatus(step.id);
                const isClickable = status === 'complete' || status === 'current';
                const isActive = currentView === 'workflow' && status === 'current';

                return (
                  <li key={step.id}>
                    <button
                      onClick={() => handleStepClick(step.id, isClickable)}
                      disabled={!isClickable}
                      className={cn(
                        "w-full flex items-center gap-3 group text-left",
                        !isClickable && "cursor-not-allowed"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all z-10 border-2",
                          status === 'complete'
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : isActive
                              ? "bg-sidebar-primary border-sidebar-primary text-sidebar-primary-foreground shadow-sm scale-110"
                              : "bg-sidebar-accent border-sidebar-accent/50 text-sidebar-muted"
                        )}
                      >
                        {status === 'complete' ? <Check className="w-4 h-4" /> : index + 1}
                      </div>
                      <div className="flex flex-col">
                        <span className={cn(
                          "text-sm font-medium leading-none transition-colors",
                          isActive ? "text-sidebar-primary" : "text-sidebar-foreground/80",
                          !isClickable && !isActive && status === 'pending' && "text-sidebar-muted"
                        )}>
                          {step.label}
                        </span>
                        {isActive && (
                          <span className="text-[10px] text-muted-foreground mt-1 font-medium text-sidebar-primary/80">
                            En cours
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Management & Tag Library */}
        <div className="px-4">
          <p className="text-xs font-medium text-sidebar-muted uppercase tracking-wider mb-3">
            Library
          </p>

          {/* Main Items */}
          <ul className="space-y-1 mb-4">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              // Active if view matches AND filter is empty (for History)
              const isActive = currentView === item.id && (item.id !== 'history' || (activeFilter.tags.length === 0 && activeFilter.status.length === 0));

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <Icon className="w-4 h-4 text-sidebar-muted/80" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>


        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-muted">
          <p>Need help?</p>
          <a href="#" className="text-sidebar-foreground hover:underline">
            View documentation →
          </a>
        </div>
      </div>
    </aside>
  );
}
