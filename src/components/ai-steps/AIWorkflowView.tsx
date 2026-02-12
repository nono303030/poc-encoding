import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAIWorkflow } from '@/contexts/AIWorkflowContext';
import { AIImportStep } from './AIImportStep';
import { AIQuestionsStep } from './AIQuestionsStep';
import { AIPromptReviewStep } from './AIPromptReviewStep';
import { AIOptimizationStep } from './AIOptimizationStep';
import { AIExportStep } from './AIExportStep';
import { AIWorkflowStep } from '@/types/ai-workflow';
import {
    FileText,
    MessageSquare,
    ScrollText,
    Sparkles,
    Rocket,
    Check,
    ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppNavigation } from '@/contexts/AppNavigationContext';

interface StepConfig {
    id: AIWorkflowStep;
    label: string;
    icon: React.ElementType;
}

const AI_STEPS: StepConfig[] = [
    { id: 'gdoc-import', label: 'Import GDoc', icon: FileText },
    { id: 'ai-questions', label: 'Questions IA', icon: MessageSquare },
    { id: 'prompt-review', label: 'Prompt généré', icon: ScrollText },
    { id: 'optimization', label: 'Optimisation', icon: Sparkles },
    { id: 'export', label: 'Export', icon: Rocket },
];

const STEP_ORDER: AIWorkflowStep[] = AI_STEPS.map(s => s.id);

function StepContent() {
    const { currentStep } = useAIWorkflow();

    switch (currentStep) {
        case 'gdoc-import':
            return <AIImportStep />;
        case 'ai-questions':
            return <AIQuestionsStep />;
        case 'prompt-review':
            return <AIPromptReviewStep />;
        case 'optimization':
            return <AIOptimizationStep />;
        case 'export':
            return <AIExportStep />;
        default:
            return null;
    }
}

export function AIWorkflowView() {
    const { currentStep, setCurrentStep } = useAIWorkflow();
    const { setCurrentView } = useAppNavigation();
    const currentIdx = STEP_ORDER.indexOf(currentStep);

    const getStepStatus = (stepIdx: number) => {
        if (stepIdx < currentIdx) return 'complete';
        if (stepIdx === currentIdx) return 'current';
        return 'pending';
    };

    return (
        <div className="flex-1 flex flex-col bg-background/50">
            {/* Header */}
            <div className="border-b border-border bg-card px-8 py-4">
                <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentView('history')}
                            className="gap-2 text-muted-foreground"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Retour
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                AI Email Generator
                            </h1>
                            <p className="text-sm text-muted-foreground">Workflow 100% IA</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content with inline stepper */}
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-4xl mx-auto w-full">
                    {/* Stepper */}
                    <div className="flex items-center justify-between mb-8 px-4">
                        {AI_STEPS.map((step, idx) => {
                            const status = getStepStatus(idx);
                            const Icon = step.icon;
                            const isClickable = status === 'complete' || status === 'current';

                            return (
                                <div key={step.id} className="flex items-center flex-1 last:flex-initial">
                                    <button
                                        onClick={() => isClickable && setCurrentStep(step.id)}
                                        disabled={!isClickable}
                                        className={cn(
                                            "flex flex-col items-center gap-2 group relative",
                                            !isClickable && "cursor-not-allowed opacity-40"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center transition-all border-2",
                                                status === 'complete'
                                                    ? "bg-emerald-500 border-emerald-500 text-white"
                                                    : status === 'current'
                                                        ? "bg-primary border-primary text-primary-foreground shadow-lg scale-110"
                                                        : "bg-muted border-muted-foreground/20 text-muted-foreground"
                                            )}
                                        >
                                            {status === 'complete' ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                <Icon className="w-5 h-5" />
                                            )}
                                        </div>
                                        <span
                                            className={cn(
                                                "text-xs font-medium whitespace-nowrap",
                                                status === 'current'
                                                    ? "text-primary"
                                                    : status === 'complete'
                                                        ? "text-emerald-600"
                                                        : "text-muted-foreground"
                                            )}
                                        >
                                            {step.label}
                                        </span>
                                    </button>

                                    {/* Connector line */}
                                    {idx < AI_STEPS.length - 1 && (
                                        <div className="flex-1 mx-4 mt-[-18px]">
                                            <div
                                                className={cn(
                                                    "h-0.5 w-full transition-all",
                                                    idx < currentIdx ? "bg-emerald-500" : "bg-muted"
                                                )}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Step Content */}
                    <StepContent />
                </div>
            </div>
        </div>
    );
}
