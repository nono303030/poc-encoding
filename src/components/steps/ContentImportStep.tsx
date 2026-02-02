import { useState } from 'react';
import { FileText, Upload, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEmailWorkflow } from '@/contexts/EmailWorkflowContext';
import { cn } from '@/lib/utils';

export function ContentImportStep() {
  const { setContentImported, contentImported, setCurrentStep } = useEmailWorkflow();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImport = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setContentImported(true);
    }, 1500);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImport();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Import Your Content</h2>
        <p className="text-muted-foreground">
          Start by importing your email content from Word or Google Docs. 
          We'll handle all the formatting cleanup for you.
        </p>
      </div>

      {/* Import Zone */}
      {!contentImported ? (
        <Card
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed transition-all duration-200 cursor-pointer",
            isDragging 
              ? "border-primary bg-accent" 
              : "border-border hover:border-primary/50 hover:bg-accent/50",
            isProcessing && "pointer-events-none opacity-70"
          )}
        >
          <div className="p-12 text-center">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-8 h-8 text-primary animate-pulse-soft" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Processing your content...</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cleaning formatting and preparing for layout
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground mb-2">
                  Drag and drop your document here
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Supports .docx, .doc, Google Docs, and .txt files
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Button onClick={handleImport} variant="default">
                    <FileText className="w-4 h-4 mr-2" />
                    Browse Files
                  </Button>
                  <span className="text-muted-foreground text-sm">or</span>
                  <Button variant="outline" onClick={handleImport}>
                    Import from Google Docs
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      ) : (
        <Card className="border-success/30 bg-success-muted">
          <div className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Content imported successfully</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Your content has been cleaned and is ready for layout. 
                  All formatting issues have been handled automatically.
                </p>
                
                {/* Preview summary */}
                <div className="bg-card rounded-lg border border-border p-4 mb-4">
                  <p className="text-sm font-medium text-foreground mb-2">Content Summary</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Paragraphs</p>
                      <p className="font-medium text-foreground">12</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Images</p>
                      <p className="font-medium text-foreground">4</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Links</p>
                      <p className="font-medium text-foreground">8</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => setCurrentStep('structure')}
                  >
                    Continue to Structure
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setContentImported(false)}
                  >
                    Import Different File
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Reassurance Messages */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm">Content is Safe</p>
              <p className="text-muted-foreground text-xs mt-1">
                Your original document remains unchanged
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm">Auto-Formatting</p>
              <p className="text-muted-foreground text-xs mt-1">
                Messy styles are cleaned automatically
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm">Preview First</p>
              <p className="text-muted-foreground text-xs mt-1">
                Review everything before committing
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
