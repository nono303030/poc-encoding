import { useState } from 'react';
import { 
  Send, 
  Mail, 
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface TestEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SendStatus = 'idle' | 'sending' | 'success' | 'error';

export function TestEmailDialog({ open, onOpenChange }: TestEmailDialogProps) {
  const [email, setEmail] = useState('');
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle');

  const handleSend = async () => {
    if (!email) return;
    
    setSendStatus('sending');
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSendStatus('success');
    
    // Reset after showing success
    setTimeout(() => {
      setSendStatus('idle');
      setEmail('');
      onOpenChange(false);
    }, 2000);
  };

  const handleClose = () => {
    if (sendStatus !== 'sending') {
      setSendStatus('idle');
      setEmail('');
      onOpenChange(false);
    }
  };

  const isValidEmail = email.includes('@') && email.includes('.');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Send Test Email</DialogTitle>
              <DialogDescription>
                Preview how your email looks in real email clients
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {sendStatus === 'success' ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success animate-check-in" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Test Email Sent!
            </h3>
            <p className="text-sm text-muted-foreground">
              Check your inbox at <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={sendStatus === 'sending'}
                  className="h-11"
                />
              </div>

              {/* Quick select recent emails */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Quick Select</Label>
                <div className="flex flex-wrap gap-2">
                  {['test@company.com', 'qa@company.com', 'marketing@company.com'].map((quickEmail) => (
                    <button
                      key={quickEmail}
                      onClick={() => setEmail(quickEmail)}
                      disabled={sendStatus === 'sending'}
                      className={cn(
                        "px-3 py-1.5 text-xs rounded-full border transition-colors",
                        email === quickEmail 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-muted border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {quickEmail}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info message */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  The test email will include all current content, images, and links. 
                  Check your spam folder if you don't receive it within a few minutes.
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                onClick={handleClose}
                disabled={sendStatus === 'sending'}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSend}
                disabled={!isValidEmail || sendStatus === 'sending'}
              >
                {sendStatus === 'sending' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Test Email
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
