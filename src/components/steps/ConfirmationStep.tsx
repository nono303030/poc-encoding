import { useState } from 'react';
import { 
  CheckCircle2, 
  Shield, 
  Eye,
  Clock,
  Send,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useEmailWorkflow } from '@/contexts/EmailWorkflowContext';
import { cn } from '@/lib/utils';
import { EmailPreviewModal } from '@/components/preview/EmailPreviewModal';

export function ConfirmationStep() {
  const { userConfirmed, setUserConfirmed, emailStatus } = useEmailWorkflow();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [checks, setChecks] = useState({
    reviewed: false,
    tested: false,
    approved: false,
  });

  const allChecked = checks.reviewed && checks.tested && checks.approved;

  const handleCheckChange = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirm = () => {
    if (allChecked) {
      setUserConfirmed(true);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Final Confirmation</h2>
          <p className="text-muted-foreground">
            Your email has passed all automated checks. Please complete the manual review below.
          </p>
        </div>

        {/* Summary Card */}
        <Card className="p-6 mb-6">
          <h3 className="font-medium text-foreground mb-4">Email Summary</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Project Name</span>
              <span className="font-medium text-foreground">Spring Campaign - March 2026</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Content Blocks</span>
              <span className="font-medium text-foreground">6 blocks</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Images</span>
              <span className="font-medium text-foreground">3 images (230 KB total)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Links</span>
              <span className="font-medium text-foreground">8 links verified</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Email Status</span>
              <div className="flex items-center gap-2">
                {emailStatus === 'ready' && <CheckCircle2 className="w-4 h-4 text-success" />}
                <span className={cn(
                  "font-medium",
                  emailStatus === 'ready' && "text-success"
                )}>
                  {emailStatus === 'ready' && 'Ready'}
                  {emailStatus === 'attention' && 'Needs Attention'}
                  {emailStatus === 'blocking' && 'Has Issues'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Manual Checklist */}
        <Card className="p-6 mb-6">
          <h3 className="font-medium text-foreground mb-4">Manual Review Checklist</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please confirm you have completed the following:
          </p>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox 
                checked={checks.reviewed}
                onCheckedChange={() => handleCheckChange('reviewed')}
                className="mt-0.5"
              />
              <div>
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  I have reviewed all content
                </p>
                <p className="text-sm text-muted-foreground">
                  Text, images, and links have been manually verified for accuracy
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox 
                checked={checks.tested}
                onCheckedChange={() => handleCheckChange('tested')}
                className="mt-0.5"
              />
              <div>
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  I have sent a test email
                </p>
                <p className="text-sm text-muted-foreground">
                  The email has been tested in multiple email clients
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox 
                checked={checks.approved}
                onCheckedChange={() => handleCheckChange('approved')}
                className="mt-0.5"
              />
              <div>
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  I have stakeholder approval
                </p>
                <p className="text-sm text-muted-foreground">
                  All required approvals have been obtained
                </p>
              </div>
            </label>
          </div>
        </Card>

        {/* Last Checks Info */}
        <Card className="p-4 bg-muted/50 mb-6">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-foreground font-medium">Last Automated Checks</p>
              <p className="text-muted-foreground">
                Link validation, tracking verification, and image optimization completed just now. 
                No hidden changes have been made to your email.
              </p>
            </div>
          </div>
        </Card>

        {/* Confirmation Actions */}
        {!userConfirmed ? (
          <div className="space-y-4">
            <Button 
              onClick={handleConfirm}
              disabled={!allChecked}
              className="w-full h-12 text-base"
              size="lg"
            >
              {allChecked ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  I Confirm This Email Is Ready
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Complete Checklist to Confirm
                </>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              This confirmation will mark the email as approved in your project history.
            </p>
          </div>
        ) : (
          <Card className="p-8 bg-success-muted border-success/30 text-center">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Email Confirmed & Ready
            </h3>
            <p className="text-muted-foreground mb-6">
              Your email has been confirmed and is ready for deployment. 
              You can now export the HTML or send through your email platform.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" onClick={() => setPreviewOpen(true)}>
                <Eye className="w-4 h-4 mr-2" />
                View Final Preview
              </Button>
              <Button>
                <Send className="w-4 h-4 mr-2" />
                Export HTML
              </Button>
            </div>
          </Card>
        )}

        <EmailPreviewModal open={previewOpen} onOpenChange={setPreviewOpen} />
      </div>
    </div>
  );
}
