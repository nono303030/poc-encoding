import { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  X, 
  Send,
  Download,
  Eye,
  CheckCircle2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEmailWorkflow } from '@/contexts/EmailWorkflowContext';
import { TestEmailDialog } from './TestEmailDialog';

type ViewMode = 'desktop' | 'mobile';

interface EmailPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmailPreviewModal({ open, onOpenChange }: EmailPreviewModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [testEmailOpen, setTestEmailOpen] = useState(false);
  const { contentBlocks, images, projectName } = useEmailWorkflow();

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold">Email Preview</DialogTitle>
                  <p className="text-sm text-muted-foreground">{projectName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('desktop')}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      viewMode === 'desktop' 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Monitor className="w-4 h-4" />
                    Desktop
                  </button>
                  <button
                    onClick={() => setViewMode('mobile')}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      viewMode === 'mobile' 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Smartphone className="w-4 h-4" />
                    Mobile
                  </button>
                </div>

                {/* Actions */}
                <Button variant="outline" size="sm" onClick={() => setTestEmailOpen(true)}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Test
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export HTML
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Preview Area */}
          <div className="flex-1 overflow-auto bg-muted/50 p-6">
            <div className="flex justify-center">
              <div 
                className={cn(
                  "bg-background rounded-lg shadow-elevated border border-border transition-all duration-300",
                  viewMode === 'desktop' ? "w-full max-w-[600px]" : "w-[375px]"
                )}
              >
                {/* Email Header Preview */}
                <div className="border-b border-border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">From:</span>
                    <span className="text-sm text-foreground">marketing@company.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Subject:</span>
                    <span className="text-sm font-medium text-foreground">Spring Collection - Exclusive Offers Inside!</span>
                  </div>
                </div>

                {/* Email Body Preview */}
                <div className="p-0">
                  <EmailBodyPreview 
                    contentBlocks={contentBlocks} 
                    images={images} 
                    viewMode={viewMode} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Status */}
          <div className="px-6 py-3 border-t border-border bg-muted/30 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Viewport: {viewMode === 'desktop' ? '600px' : '375px'}</span>
              <span>•</span>
              <span>{contentBlocks.length} blocks</span>
              <span>•</span>
              <span>{images.length} images</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-success font-medium">Preview Updated</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TestEmailDialog open={testEmailOpen} onOpenChange={setTestEmailOpen} />
    </>
  );
}

interface EmailBodyPreviewProps {
  contentBlocks: Array<{
    id: string;
    type: string;
    content: string;
    isRequired?: boolean;
  }>;
  images: Array<{
    id: string;
    name: string;
    url: string;
    altText: string;
  }>;
  viewMode: ViewMode;
}

function EmailBodyPreview({ contentBlocks, images, viewMode }: EmailBodyPreviewProps) {
  return (
    <div className="space-y-0">
      {contentBlocks.map((block) => (
        <div key={block.id}>
          {block.type === 'image' && (
            <div 
              className="w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center"
              style={{ height: viewMode === 'desktop' ? '200px' : '150px' }}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-2">
                  <img 
                    src="/placeholder.svg" 
                    alt={block.content}
                    className="w-10 h-10 opacity-50"
                  />
                </div>
                <span className="text-sm text-muted-foreground">{block.content}</span>
              </div>
            </div>
          )}

          {block.type === 'text' && (
            <div className={cn("px-6 py-4", viewMode === 'mobile' && "px-4 py-3")}>
              <p className={cn(
                "text-foreground leading-relaxed",
                viewMode === 'desktop' ? "text-base" : "text-sm"
              )}>
                {block.content}
              </p>
            </div>
          )}

          {block.type === 'button' && (
            <div className={cn("px-6 py-4 text-center", viewMode === 'mobile' && "px-4 py-3")}>
              <button 
                className={cn(
                  "bg-primary text-primary-foreground font-semibold rounded-lg",
                  viewMode === 'desktop' 
                    ? "px-8 py-3 text-base" 
                    : "px-6 py-2.5 text-sm w-full"
                )}
              >
                {block.content}
              </button>
            </div>
          )}

          {block.type === 'spacer' && (
            <div className="h-6" />
          )}

          {block.type === 'table' && (
            <div className={cn("px-6 py-4", viewMode === 'mobile' && "px-4 py-3")}>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="bg-muted rounded-lg p-3 text-center"
                  >
                    <div className="w-full aspect-square bg-primary/10 rounded-md mb-2 flex items-center justify-center">
                      <img 
                        src="/placeholder.svg" 
                        alt={`Product ${i}`}
                        className="w-8 h-8 opacity-40"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Product {i}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Footer */}
      <div className={cn(
        "bg-muted/50 px-6 py-6 text-center border-t border-border",
        viewMode === 'mobile' && "px-4 py-4"
      )}>
        <p className="text-xs text-muted-foreground mb-2">
          © 2026 Company Name. All rights reserved.
        </p>
        <div className="flex items-center justify-center gap-3 text-xs">
          <a href="#" className="text-primary hover:underline">Unsubscribe</a>
          <span className="text-muted-foreground">•</span>
          <a href="#" className="text-primary hover:underline">View in browser</a>
          <span className="text-muted-foreground">•</span>
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
