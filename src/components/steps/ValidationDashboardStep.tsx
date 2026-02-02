import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Link,
  Code,
  FileCheck,
  Scale,
  Image as ImageIcon,
  Type,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEmailWorkflow } from '@/contexts/EmailWorkflowContext';
import { StatusBadgeMuted } from '@/components/layout/StatusBadge';
import { cn } from '@/lib/utils';

interface ValidationCheck {
  id: string;
  label: string;
  description: string;
  status: 'pass' | 'warning' | 'error' | 'pending';
  icon: React.ElementType;
  details?: string;
}

const validationChecks: ValidationCheck[] = [
  {
    id: 'links',
    label: 'Link Validation',
    description: 'All links are accessible and properly formatted',
    status: 'pass',
    icon: Link,
    details: '8 links verified successfully',
  },
  {
    id: 'tracking',
    label: 'Tracking & Scripts',
    description: 'UTM parameters and tracking pixels are configured',
    status: 'pass',
    icon: Code,
    details: 'Google Analytics tracking detected',
  },
  {
    id: 'blocks',
    label: 'Required Blocks',
    description: 'All mandatory content blocks are present',
    status: 'pass',
    icon: FileCheck,
    details: 'Header, CTA, and Footer blocks present',
  },
  {
    id: 'weight',
    label: 'Email Weight',
    description: 'Total email size within recommended limits',
    status: 'warning',
    icon: Scale,
    details: '105 KB total (limit: 102 KB)',
  },
  {
    id: 'images',
    label: 'Image Optimization',
    description: 'All images are properly sized and optimized',
    status: 'error',
    icon: ImageIcon,
    details: '1 image exceeds 200 KB limit',
  },
  {
    id: 'alt-text',
    label: 'Alt Text Coverage',
    description: 'All images have descriptive alternative text',
    status: 'warning',
    icon: Type,
    details: '1 of 3 images missing alt text',
  },
];

const statusIcons = {
  pass: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  pending: RefreshCw,
};

const statusColors = {
  pass: 'text-success',
  warning: 'text-warning',
  error: 'text-destructive',
  pending: 'text-muted-foreground animate-spin',
};

export function ValidationDashboardStep() {
  const { emailStatus, setCurrentStep } = useEmailWorkflow();

  const passCount = validationChecks.filter(c => c.status === 'pass').length;
  const warningCount = validationChecks.filter(c => c.status === 'warning').length;
  const errorCount = validationChecks.filter(c => c.status === 'error').length;

  const canProceed = errorCount === 0;

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Validation Dashboard</h2>
          <p className="text-muted-foreground">
            Final checks before your email is ready to send. All blocking issues must be resolved.
          </p>
        </div>

        {/* Overall Status Card */}
        <Card className={cn(
          "p-6 mb-8 border-2",
          emailStatus === 'ready' && "border-success/50 bg-success-muted",
          emailStatus === 'attention' && "border-warning/50 bg-warning-muted",
          emailStatus === 'blocking' && "border-destructive/50 bg-destructive-muted"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                emailStatus === 'ready' && "bg-success/20",
                emailStatus === 'attention' && "bg-warning/20",
                emailStatus === 'blocking' && "bg-destructive/20"
              )}>
                {emailStatus === 'ready' && <CheckCircle2 className="w-8 h-8 text-success" />}
                {emailStatus === 'attention' && <AlertTriangle className="w-8 h-8 text-warning" />}
                {emailStatus === 'blocking' && <XCircle className="w-8 h-8 text-destructive" />}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {emailStatus === 'ready' && 'Ready to Send'}
                  {emailStatus === 'attention' && 'Attention Needed'}
                  {emailStatus === 'blocking' && 'Blocking Issues Found'}
                </h3>
                <p className="text-muted-foreground">
                  {passCount} passed • {warningCount} warnings • {errorCount} errors
                </p>
              </div>
            </div>
            
            <StatusBadgeMuted status={emailStatus} size="lg" />
          </div>
        </Card>

        {/* Validation Checks */}
        <div className="space-y-3 mb-8">
          <h3 className="font-medium text-foreground mb-4">Validation Checklist</h3>
          
          {validationChecks.map((check) => {
            const StatusIcon = statusIcons[check.status];
            const Icon = check.icon;

            return (
              <Card 
                key={check.id}
                className={cn(
                  "p-4 transition-all",
                  check.status === 'pass' && "border-success/20 hover:border-success/40",
                  check.status === 'warning' && "border-warning/20 hover:border-warning/40",
                  check.status === 'error' && "border-destructive/20 hover:border-destructive/40"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={cn(
                    "w-6 h-6 shrink-0 flex items-center justify-center",
                    statusColors[check.status]
                  )}>
                    <StatusIcon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <h4 className="font-medium text-foreground">{check.label}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{check.description}</p>
                    {check.details && (
                      <p className={cn(
                        "text-xs mt-2",
                        check.status === 'pass' && "text-success",
                        check.status === 'warning' && "text-warning",
                        check.status === 'error' && "text-destructive"
                      )}>
                        {check.details}
                      </p>
                    )}
                  </div>

                  {/* Action */}
                  {check.status !== 'pass' && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="shrink-0"
                    >
                      Fix Issue
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Action Bar */}
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground font-medium">
                {canProceed 
                  ? 'All blocking issues resolved. You can proceed to confirmation.'
                  : 'Please resolve all blocking issues before proceeding.'
                }
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Last checked: Just now
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Re-run Checks
              </Button>
              <Button 
                onClick={() => setCurrentStep('confirm')}
                disabled={!canProceed}
              >
                {canProceed ? (
                  <>
                    Proceed to Confirmation
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  'Fix Issues First'
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
