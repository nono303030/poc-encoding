import {
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Pencil,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEmailWorkflow } from '@/contexts/EmailWorkflowContext';
import { cn } from '@/lib/utils';
import { ImageAsset } from '@/types/email';

const statusConfig = {
  valid: {
    icon: CheckCircle2,
    label: 'Ready',
    color: 'text-success',
    bg: 'bg-success-muted',
  },
  'too-heavy': {
    icon: XCircle,
    label: 'Too Heavy',
    color: 'text-destructive',
    bg: 'bg-destructive-muted',
  },
  'missing-alt': {
    icon: AlertTriangle,
    label: 'Missing Alt Text',
    color: 'text-warning',
    bg: 'bg-warning-muted',
  },
  'wrong-size': {
    icon: AlertTriangle,
    label: 'Wrong Size',
    color: 'text-warning',
    bg: 'bg-warning-muted',
  },
};

interface ImageCardProps {
  image: ImageAsset;
  onUpdate: (id: string, updates: Partial<ImageAsset>) => void;
}

function ImageCard({ image, onUpdate }: ImageCardProps) {
  const config = statusConfig[image.status];
  const StatusIcon = config.icon;

  const handleOptimize = () => {
    // Simulate optimization taking 500ms
    // For now direct update
    onUpdate(image.id, {
      status: 'valid',
      sizeKb: Math.round(image.sizeKb * 0.6) // Simulate 40% reduction
    });
  };

  const handleFixAltText = () => {
    onUpdate(image.id, {
      status: 'valid',
      altText: image.name.split('.')[0].replace(/-/g, ' ') // Use filename as default
    });
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all",
      image.status === 'valid' && "border-success/30",
      image.status === 'too-heavy' && "border-destructive/30",
      (image.status === 'missing-alt' || image.status === 'wrong-size') && "border-warning/30"
    )}>
      {/* Image Preview */}
      <div className="aspect-video bg-muted relative">
        <img
          src={image.url}
          alt={image.altText || image.name}
          className="w-full h-full object-cover"
        />

        {/* Status Badge */}
        <div className={cn(
          "absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
          config.bg,
          config.color
        )}>
          <StatusIcon className="w-3 h-3" />
          {config.label}
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <p className="font-medium text-foreground text-sm truncate mb-3">
          {image.name}
        </p>

        <div className="grid grid-cols-3 gap-2 text-xs mb-4">
          <div>
            <p className="text-muted-foreground">Dimensions</p>
            <p className="font-medium text-foreground">{image.width} × {image.height}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Size</p>
            <p className={cn(
              "font-medium",
              image.sizeKb > 200 ? "text-destructive" : "text-foreground"
            )}>
              {image.sizeKb} KB
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Alt Text</p>
            <p className={cn(
              "font-medium truncate",
              image.altText ? "text-foreground" : "text-warning"
            )}>
              {image.altText || 'Missing'}
            </p>
          </div>
        </div>

        {/* Actions based on status */}
        {image.status === 'too-heavy' && (
          <Button size="sm" className="w-full" variant="outline" onClick={handleOptimize}>
            <RefreshCw className="w-3.5 h-3.5 mr-2" />
            Optimize Image
          </Button>
        )}

        {image.status === 'missing-alt' && (
          <Button size="sm" className="w-full" variant="outline" onClick={handleFixAltText}>
            <Pencil className="w-3.5 h-3.5 mr-2" />
            Add Alt Text
          </Button>
        )}

        {image.status === 'valid' && (
          <div className="flex items-center gap-1 text-xs text-success">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready for email</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export function ImageManagementStep() {
  const { images, setCurrentStep, updateImage } = useEmailWorkflow();

  const validCount = images.filter(i => i.status === 'valid').length;
  const warningCount = images.filter(i => i.status === 'missing-alt' || i.status === 'wrong-size').length;
  const errorCount = images.filter(i => i.status === 'too-heavy').length;

  const handleOptimizeAll = () => {
    // Find all images that need optimization or fix
    images.forEach(img => {
      if (img.status === 'too-heavy') {
        updateImage(img.id, {
          status: 'valid',
          sizeKb: Math.round(img.sizeKb * 0.6)
        });
      } else if (img.status === 'missing-alt') {
        updateImage(img.id, {
          status: 'valid',
          altText: img.name.split('.')[0].replace(/-/g, ' ')
        });
      }
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Image Management</h2>
          <p className="text-muted-foreground">
            Review and optimize all images in your email. Each image must meet size
            and accessibility requirements.
          </p>
        </div>

        {/* Summary Bar */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-sm text-foreground">{validCount} Ready</span>
              </div>
              {warningCount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-sm text-foreground">{warningCount} Need Attention</span>
                </div>
              )}
              {errorCount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm text-foreground">{errorCount} Blocking Issues</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleOptimizeAll}>
                <Download className="w-4 h-4 mr-2" />
                Optimize All
              </Button>
              <Button variant="outline" size="sm">
                <ImageIcon className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </div>
          </div>
        </Card>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {images.map((image) => (
            <ImageCard key={image.id} image={image} onUpdate={updateImage} />
          ))}
        </div>

        {/* Requirements Info */}
        <Card className="p-4 bg-muted/50 mb-6">
          <h4 className="font-medium text-foreground mb-2">Image Requirements</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Maximum file size: <strong>200 KB</strong> per image</li>
            <li>• All images must have descriptive alt text for accessibility</li>
            <li>• Recommended format: JPEG for photos, PNG for graphics</li>
            <li>• Hero images should be 600px wide</li>
          </ul>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setCurrentStep('structure')}>
            Back to Structure
          </Button>

          <Button
            onClick={() => setCurrentStep('validation')}
            disabled={errorCount > 0}
          >
            {errorCount > 0 ? (
              'Fix Issues to Continue'
            ) : (
              <>
                Continue to Validation
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
