import { useState } from 'react';
import { 
  Type, 
  Image, 
  Table2, 
  MousePointerClick, 
  GripVertical,
  Eye,
  Pencil,
  Trash2,
  Plus,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEmailWorkflow } from '@/contexts/EmailWorkflowContext';
import { cn } from '@/lib/utils';
import { ContentBlock } from '@/types/email';

const blockIcons = {
  text: Type,
  image: Image,
  table: Table2,
  button: MousePointerClick,
  spacer: GripVertical,
};

const blockLabels = {
  text: 'Text Block',
  image: 'Image',
  table: 'Table',
  button: 'Button',
  spacer: 'Spacer',
};

interface BlockItemProps {
  block: ContentBlock;
  isSelected: boolean;
  onClick: () => void;
}

function BlockItem({ block, isSelected, onClick }: BlockItemProps) {
  const Icon = blockIcons[block.type];

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
        isSelected 
          ? "border-primary bg-accent shadow-sm ring-2 ring-primary/20" 
          : "border-border hover:border-primary/50 hover:bg-accent/50"
      )}
    >
      {/* Drag handle */}
      <div className="text-muted-foreground opacity-50 group-hover:opacity-100 cursor-grab">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Icon */}
      <div className={cn(
        "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
        block.type === 'button' ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      )}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">
            {blockLabels[block.type]}
          </p>
          {block.isRequired && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
              Required
            </span>
          )}
        </div>
        {block.content && block.type !== 'spacer' && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {block.content}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 rounded hover:bg-muted">
          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        {!block.isRequired && (
          <button className="p-1.5 rounded hover:bg-destructive-muted">
            <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
          </button>
        )}
      </div>
    </div>
  );
}

export function EmailStructureStep() {
  const { contentBlocks, setCurrentStep } = useEmailWorkflow();
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Email Structure</h2>
          <p className="text-muted-foreground">
            Arrange and edit your content blocks. Drag to reorder, click to edit. 
            The structure is protected—you can't break the layout.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Block List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Content Blocks</h3>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Block
              </Button>
            </div>

            <div className="space-y-2">
              {contentBlocks.map((block) => (
                <BlockItem
                  key={block.id}
                  block={block}
                  isSelected={selectedBlock === block.id}
                  onClick={() => setSelectedBlock(block.id)}
                />
              ))}
            </div>

            <div className="mt-6">
              <Button onClick={() => setCurrentStep('images')}>
                Continue to Images
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Right: Preview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Live Preview</h3>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Full Preview
              </Button>
            </div>

            <Card className="overflow-hidden">
              {/* Email Preview Mock */}
              <div className="bg-muted p-4">
                <div className="bg-card rounded-lg shadow-sm max-w-md mx-auto">
                  {/* Header */}
                  <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center rounded-t-lg">
                    <div className="text-center">
                      <div className="w-16 h-8 bg-primary/20 rounded mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Hero Banner</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                    </div>

                    <div className="flex justify-center">
                      <div className="px-6 py-2 bg-primary rounded-md text-primary-foreground text-sm font-medium">
                        Shop Now
                      </div>
                    </div>

                    <div className="h-px bg-border my-4" />

                    {/* Product grid mock */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="aspect-square bg-muted rounded-md" />
                      <div className="aspect-square bg-muted rounded-md" />
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-border">
                      <div className="h-3 bg-muted rounded w-2/3 mx-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Info Box */}
            <Card className="mt-4 p-4 bg-accent border-primary/20">
              <p className="text-sm text-foreground">
                <strong>Structure Protected:</strong> Your email layout is based on tested templates. 
                You can edit content and reorder blocks, but the underlying HTML structure is maintained.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
