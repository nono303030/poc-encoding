import { useAppData } from '@/contexts/AppDataContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface TagSelectorProps {
    selectedTags: string[]; // Array of Tag Names
    onToggleTag: (tagName: string, categoryId: string, isMulti: boolean) => void;
}

export function TagSelector({ selectedTags, onToggleTag }: TagSelectorProps) {
    const { categories } = useAppData();

    return (
        <div className="space-y-6">
            {categories.map((category) => (
                <div key={category.id} className="space-y-2">
                    {/* Category Header (Folder) */}
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-6 rounded-full" style={{ backgroundColor: category.color }} />
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            {category.name} ({category.isMultiSelect ? 'Multi' : 'Single'})
                        </h4>
                    </div>

                    {/* Tags Grid */}
                    <div className="flex flex-wrap gap-2 pl-4">
                        {category.tags.length === 0 ? (
                            <span className="text-xs text-muted-foreground italic">No tags in this folder</span>
                        ) : (
                            category.tags.map((tag) => {
                                const isSelected = selectedTags.includes(tag.name);

                                return (
                                    <button
                                        key={tag.id}
                                        onClick={() => onToggleTag(tag.name, category.id, category.isMultiSelect)}
                                        className={cn(
                                            "group relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all border",
                                            isSelected
                                                ? "bg-accent text-accent-foreground shadow-sm"
                                                : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:bg-accent/50"
                                        )}
                                        style={{
                                            borderColor: isSelected ? category.color : undefined,
                                            backgroundColor: isSelected ? `${category.color}15` : undefined
                                        }}
                                    >
                                        {isSelected && (
                                            <div
                                                className="absolute inset-0 rounded-md opacity-10"
                                                style={{ backgroundColor: category.color }}
                                            />
                                        )}

                                        <span
                                            className="w-2 h-2 rounded-full shrink-0 transition-colors"
                                            style={{
                                                backgroundColor: isSelected ? category.color : '#e5e7eb' // gray-200
                                            }}
                                        />
                                        <span className={cn("relative z-10", isSelected && "text-foreground")}>
                                            {tag.name}
                                        </span>

                                        {isSelected && <Check className="w-3.5 h-3.5 ml-1" style={{ color: category.color }} />}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
