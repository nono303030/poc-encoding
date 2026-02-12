import { useState } from 'react';
import { useAppData } from '@/contexts/AppDataContext';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TagCategory } from '@/types/history';
import { AlertCircle, FileText, CheckCircle2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';

export function CriteriaDefinitionTab() {
    const { categories, updateCategory, addCategory } = useAppData();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [newCriterionName, setNewCriterionName] = useState('');
    const [newCriterionDesc, setNewCriterionDesc] = useState('');

    const handleAddCriterion = () => {
        if (!newCriterionName.trim()) return;

        const newCategory: TagCategory = {
            id: `cat-${Date.now()}`,
            name: newCriterionName,
            description: newCriterionDesc,
            color: '#64748b', // Default slate color
            isMultiSelect: true,
            isRequired: false,
            tags: []
        };

        addCategory(newCategory);
        setNewCriterionName('');
        setNewCriterionDesc('');
        setDialogOpen(false);
    };

    return (
        <div className="flex-1 flex flex-col bg-background/50">
            {/* Header */}
            <div className="border-b border-border bg-card px-8 py-6">
                <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Criteria Definition</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage mandatory characteristics and validation rules for your emails.
                        </p>
                    </div>
                    <Button onClick={() => setDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Criterion
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-6xl mx-auto w-full space-y-6">

                    {/* Main Configuration Card */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Mandatory Characteristics</h2>
                                <p className="text-sm text-muted-foreground">
                                    Select which criteria must be defined for every email.
                                </p>
                            </div>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[30%]">Characteristic Name</TableHead>
                                    <TableHead className="w-[40%]">Description</TableHead>
                                    <TableHead className="w-[15%] text-center">Required?</TableHead>
                                    <TableHead className="w-[15%] text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category.id} className="hover:bg-muted/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-1 h-8 rounded-full"
                                                    style={{ backgroundColor: category.color }}
                                                />
                                                <span className="font-medium text-foreground">{category.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {category.description || '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center">
                                                <Switch
                                                    checked={category.isRequired}
                                                    onCheckedChange={(checked) => updateCategory({ ...category, isRequired: checked })}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {category.isRequired ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                                                    <AlertCircle className="w-3 h-3" />
                                                    Mandatory
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Optional
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Helper Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4 bg-primary/5 border-primary/20">
                            <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Impact on Workflow
                            </h3>
                            <p className="text-sm text-foreground/80">
                                Mandatory criteria must be selected during the "Tagging Plan" step of the email creation workflow.
                                Users will not be able to proceed to validation if these are missing.
                            </p>
                        </Card>
                        <Card className="p-4 bg-muted/50">
                            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Best Practices
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Keep mandatory fields to a minimum to avoid friction.
                                Typically, "Format" and "Language" are good candidates for mandatory fields.
                            </p>
                        </Card>
                    </div>

                </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Criterion</DialogTitle>
                        <DialogDescription>
                            Define a new characteristic that emails can be tagged with.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Criterion Name</Label>
                            <Input
                                placeholder="e.g. Season"
                                value={newCriterionName}
                                onChange={(e) => setNewCriterionName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="What does this criterion describe?"
                                value={newCriterionDesc}
                                onChange={(e) => setNewCriterionDesc(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleAddCriterion}
                            disabled={!newCriterionName.trim()}
                        >
                            Create Criterion
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
