import { useState } from 'react';
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
  Upload
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
  { id: 'tagging', label: 'Tagging Plan', icon: Tags },
];

export function AppSidebar() {
  const { currentStep, setCurrentStep, getStepStatus, projectName } = useEmailWorkflow();
  const { currentView, setCurrentView } = useAppNavigation();
  const { categories, setFilter, activeFilter } = useAppData();

  // Local state for expanded folders (default all open for now, or could store in local storage)
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['1', '2']);

  const handleNavClick = (view: MainView) => {
    setCurrentView(view);
    if (view === 'history') {
      setFilter({ type: 'all', value: '' }); // Clear filter when clicking "All Emails"
    }
  };

  const handleTagClick = (tagName: string) => {
    setFilter({ type: 'tag', value: tagName });
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
          <p className="text-xs font-medium text-sidebar-muted uppercase tracking-wider mb-3">
            Current Workflow
          </p>
          <ul className="space-y-1">
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
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left",
                      isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                      status === 'complete' && "text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer",
                      status === 'current' && !isActive && "text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer",
                      status === 'pending' && "text-sidebar-muted cursor-not-allowed opacity-60"
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 transition-all",
                        status === 'complete' && "bg-emerald-500/20 text-emerald-600",
                        status === 'current' && "bg-sidebar-primary text-sidebar-primary-foreground ring-2 ring-sidebar-primary/30",
                        status === 'pending' && "bg-sidebar-border text-sidebar-muted"
                      )}
                    >
                      {status === 'complete' ? <Check className="w-3 h-3" /> : index + 1}
                    </div>
                    <span className="text-sm font-medium">{step.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
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
              const isActive = currentView === item.id && (item.id !== 'history' || activeFilter.type === 'all');

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

          {/* Smart Folders / Tag Tree */}
          <p className="text-xs font-medium text-sidebar-muted uppercase tracking-wider mb-2 mt-6">
            Smart Folders
          </p>
          <div className="space-y-1">
            {categories.map((category) => (
              <Collapsible
                key={category.id}
                open={expandedCategories.includes(category.id)}
                onOpenChange={() => setExpandedCategories(prev =>
                  prev.includes(category.id) ? prev : [...prev, category.id]
                )}
              >
                <div className="flex items-center group">
                  <button
                    onClick={(e) => toggleCategory(category.id, e)}
                    className="p-1 hover:bg-sidebar-accent/50 rounded mr-1 text-sidebar-muted"
                  >
                    {expandedCategories.includes(category.id) ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                  <div className="flex items-center gap-2 flex-1 py-1.5 px-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/30 cursor-pointer select-none"
                    onClick={(e) => toggleCategory(category.id, e)}
                  >
                    <FolderOpen className="w-4 h-4" style={{ color: category.color }} />
                    <span className="truncate">{category.name}</span>
                  </div>
                </div>

                <CollapsibleContent className="pl-6 border-l border-sidebar-border/50 ml-2.5">
                  <div className="pt-1 pb-1 space-y-0.5">
                    {category.tags.length === 0 ? (
                      <p className="text-xs text-sidebar-muted px-2 py-1 italic">Empty</p>
                    ) : (
                      category.tags.map((tag) => {
                        const isFiltered = activeFilter.type === 'tag' && activeFilter.value === tag.name;
                        return (
                          <button
                            key={tag.id}
                            onClick={() => handleTagClick(tag.name)}
                            className={cn(
                              "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors text-left",
                              isFiltered
                                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
                            )}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="truncate">{tag.name}</span>
                            <span className="ml-auto text-xs opacity-50">{tag.usageCount}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
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
