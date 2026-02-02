import { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { useEmailWorkflow } from '@/contexts/EmailWorkflowContext';
import { Button } from '@/components/ui/button';
import { ChevronRight, Save, Eye } from 'lucide-react';
import { WorkflowStep } from '@/types/email';
import { EmailPreviewModal } from '@/components/preview/EmailPreviewModal';

const stepOrder: WorkflowStep[] = ['import', 'structure', 'images', 'validation', 'confirm'];

export function AppHeader() {
  const { emailStatus, currentStep, setCurrentStep, canProceed, projectName } = useEmailWorkflow();
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const currentIndex = stepOrder.indexOf(currentStep);
  const isLastStep = currentIndex === stepOrder.length - 1;

  const handleNext = () => {
    if (!isLastStep && canProceed()) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  return (
    <>
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
        {/* Left: Project info */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-foreground">{projectName}</h1>
          <StatusBadge status={emailStatus} size="sm" />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          
          {!isLastStep && (
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
              size="sm"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </header>

      <EmailPreviewModal open={previewOpen} onOpenChange={setPreviewOpen} />
    </>
  );
}
