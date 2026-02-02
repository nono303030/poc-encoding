import { useState, useEffect } from 'react';
import { ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useEmailWorkflow } from '@/contexts/EmailWorkflowContext';
import { useAppData } from '@/contexts/AppDataContext';
import { TagSelector } from './TagSelector';

export function MetadataStep() {
    const {
        projectName,
        setProjectName,
        selectedTags,
        setSelectedTags,
        setCurrentStep,
        canProceed
    } = useEmailWorkflow();

    const { categories } = useAppData();

    const handleToggleTag = (tagName: string, categoryId: string, isMulti: boolean) => {
        // Logic to enforce single/multi select
        if (selectedTags.includes(tagName)) {
            // Deselect
            setSelectedTags(selectedTags.filter(t => t !== tagName));
        } else {
            // Select
            if (isMulti) {
                setSelectedTags([...selectedTags, tagName]);
            } else {
                // Single select: Remove other tags from this category first
                const categoryTags = categories.find(c => c.id === categoryId)?.tags.map(t => t.name) || [];
                const otherTags = selectedTags.filter(t => !categoryTags.includes(t));
                setSelectedTags([...otherTags, tagName]);
            }
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-2">Campaign Metadata</h2>
                <p className="text-muted-foreground">
                    Define the identity of your email campaign. Proper tagging ensures easy retrieval later.
                </p>
            </div>

            <div className="grid gap-8">
                {/* Project Name Card */}
                <Card className="p-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="project-name" className="text-base font-semibold">Email Name</Label>
                            <Input
                                id="project-name"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="e.g. Spring Sale 2026 - Newsletter #1"
                                className="text-lg py-6"
                            />
                            <p className="text-sm text-muted-foreground">
                                This name will be used for your file exports and internal history.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Tagging Card */}
                <Card className="p-6">
                    <div className="mb-6 flex items-center gap-3 border-b pb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Tag className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Categorization</h3>
                            <p className="text-sm text-muted-foreground">Select tags to organize this campaign.</p>
                        </div>
                    </div>

                    <TagSelector
                        selectedTags={selectedTags}
                        onToggleTag={handleToggleTag}
                    />
                </Card>

                {/* Action Bar */}
                <div className="flex justify-end pt-4">
                    <Button
                        size="lg"
                        onClick={() => setCurrentStep('import')}
                        disabled={!canProceed()}
                        className="gap-2"
                    >
                        Next: Import Content
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
