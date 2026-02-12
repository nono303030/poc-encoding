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
  const [sendingPlatform, setSendingPlatform] = useState<'bsft' | 'sfmc' | 'both' | null>(null);
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
          {/* ... existing summary items ... */}
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Project Name</span>
              <span className="font-medium text-foreground">Spring Campaign - March 2026</span>
            </div>
            {/* ... other items (kept implicitly by not modifying them, but wait, I am replacing the block) ... */}
            {/* better to use original content for the summary items I'm not changing, to avoid mistakes. 
               Actually, I can just insert the NEW card after the summary card or before the checklist. 
               The user said "dans confirm & send". 
               Let's insert it BEFORE the Manual Review Checklist. 
            */}
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

        {/* Sending Platform Selection */}
        <Card className="p-6 mb-6 border-primary/20 bg-primary/5">
          <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <Send className="w-4 h-4 text-primary" />
            Target Platform
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'bsft', label: 'BSFT send', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
              { id: 'sfmc', label: 'SFMC send', icon: 'M3 21l18 0M3 10h18M5 6l14 0M4 10l0 11M20 10l0 11M8 14l8 0' },
              { id: 'both', label: 'BSFT & SFMC', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
            ].map(platform => (
              <label
                key={platform.id}
                className={cn(
                  "relative flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary/50 hover:bg-background",
                  sendingPlatform === platform.id
                    ? "border-primary bg-background shadow-sm"
                    : "border-transparent bg-background/50"
                )}
              >
                <input
                  type="radio"
                  name="sendingPlatform"
                  value={platform.id}
                  checked={sendingPlatform === platform.id}
                  onChange={(e) => setSendingPlatform(e.target.value as any)}
                  className="sr-only"
                />
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors",
                  sendingPlatform === platform.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {/* Simple SVG icons for visual distinction */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={platform.icon} />
                  </svg>
                </div>
                <span className={cn(
                  "font-medium text-sm",
                  sendingPlatform === platform.id ? "text-primary" : "text-muted-foreground"
                )}>
                  {platform.label}
                </span>
                {sendingPlatform === platform.id && (
                  <div className="absolute top-2 right-2 text-primary">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </label>
            ))}
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
                  {!sendingPlatform ? 'Select Target Platform to Confirm' : 'Complete Checklist to Confirm'}
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
