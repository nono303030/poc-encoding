import { useState } from 'react';
import {
  Plus,
  Pencil,
  Archive,
  Check,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { TagCategory, Tag } from '@/types/history';
import { useAppData } from '@/contexts/AppDataContext';

const PRESET_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#84cc16', // lime
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#d946ef', // fuchsia
  '#ec4899', // pink
  '#64748b', // slate
];

export function TaggingPlanTab() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addTag,
    updateTag,
    deleteTag
  } = useAppData();

  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<TagCategory | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TagCategory | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'category' | 'tag'; item: TagCategory | Tag } | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: PRESET_COLORS[6],
    isMultiSelect: true,
    isRequired: false
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
      isMultiSelect: true,
      isRequired: false
    });
  };

  const openNewCategoryDialog = () => {
    setEditingCategory(null);
    resetForm();
    setCategoryDialogOpen(true);
  };

  const openEditCategoryDialog = (category: TagCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      isMultiSelect: category.isMultiSelect,
      isRequired: category.isRequired
    });
    setCategoryDialogOpen(true);
  };

  const openNewTagDialog = (category: TagCategory) => {
    setSelectedCategory(category);
    setEditingTag(null);
    setFormData(prev => ({ ...prev, name: '', description: '' }));
    setTagDialogOpen(true);
  };

  const openEditTagDialog = (tag: Tag, category: TagCategory) => {
    setSelectedCategory(category);
    setEditingTag(tag);
    setFormData(prev => ({ ...prev, name: tag.name, description: tag.description }));
    setTagDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!formData.name.trim()) return;

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        ...formData
      });
    } else {
      const newCategory: TagCategory = {
        id: `cat-${Date.now()}`,
        tags: [],
        ...formData
      };
      addCategory(newCategory);
    }
    setCategoryDialogOpen(false);
  };

  const handleSaveTag = () => {
    if (!formData.name.trim() || !selectedCategory) return;

    if (editingTag) {
      updateTag(selectedCategory.id, {
        ...editingTag,
        name: formData.name,
        description: formData.description
      });
    } else {
      const newTag: Tag = {
        id: `tag-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        usageCount: 0,
        categoryId: selectedCategory.id,
      };
      addTag(selectedCategory.id, newTag);
    }
    setTagDialogOpen(false);
  };

  const handleDeleteRequest = (type: 'category' | 'tag', item: TagCategory | Tag) => {
    setDeleteTarget({ type, item });
    setDeleteAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'category') {
      deleteCategory((deleteTarget.item as TagCategory).id);
    } else {
      const tag = deleteTarget.item as Tag;
      deleteTag(tag.categoryId, tag.id);
    }
    setDeleteAlertOpen(false);
    setDeleteTarget(null);
  };

  const canDelete = (item: TagCategory | Tag, type: 'category' | 'tag'): boolean => {
    if (type === 'category') {
      return (item as TagCategory).tags.every(t => t.usageCount === 0);
    }
    return (item as Tag).usageCount === 0;
  };

  return (
    <div className="flex-1 flex flex-col bg-background/50">
      {/* Header */}
      <div className="border-b border-border bg-card px-8 py-6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tagging Dimensions</h1>
              <p className="text-muted-foreground mt-1">
                Configure the taxonomy folders.
              </p>
            </div>
            {/* Header Action if needed */}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto w-full bg-card rounded-lg border shadow-sm flex flex-col">

          {/* Table Header */}
          <div className="flex items-center border-b px-6 py-3 bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="w-[4px] mr-4"></div> {/* Spacer for color strip */}
            <div className="w-1/6 min-w-[150px]">Name</div>
            <div className="w-1/4 min-w-[200px]">Description</div>
            <div className="flex-1">Tags</div>
            <div className="w-10"></div> {/* Actions */}
          </div>

          {/* List Rows */}
          <div className="flex-1">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group flex items-center border-b last:border-0 hover:bg-muted/20 transition-colors min-h-[64px]"
              >
                {/* Color Strip */}
                <div
                  className="w-[4px] self-stretch shrink-0"
                  style={{ backgroundColor: category.color }}
                />

                <div className="flex-1 flex items-center px-6 py-4 gap-4">
                  {/* Name */}
                  <div className="w-1/6 min-w-[150px] shrink-0">
                    <span className="font-bold text-sm uppercase tracking-tight text-foreground" style={{ color: category.color }}>
                      {category.name}
                    </span>
                    {(category.isRequired || !category.isMultiSelect) && (
                      <div className="flex gap-2 mt-1">
                        {category.isRequired && (
                          <span className="text-[10px] flex items-center gap-1 text-destructive font-medium" title="Required">
                            <AlertCircle className="w-3 h-3" /> Req
                          </span>
                        )}
                        {!category.isMultiSelect && (
                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded" title="Single Select">
                            1-Select
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="w-1/4 min-w-[200px] shrink-0 text-sm text-muted-foreground">
                    {category.description || '-'}
                  </div>

                  {/* Tags */}
                  <div className="flex-1 text-sm text-muted-foreground leading-relaxed">
                    {category.tags.length === 0 ? (
                      <span className="text-muted-foreground/30 italic">No tags</span>
                    ) : (
                      category.tags.map((tag, idx) => (
                        <span key={tag.id} className="inline-block mr-1">
                          <span
                            className="hover:text-foreground hover:underline cursor-pointer transition-colors"
                            onClick={() => openEditTagDialog(tag, category)}
                          >
                            {tag.name}
                          </span>
                          <span className="text-muted-foreground/50 text-xs ml-0.5">({tag.usageCount})</span>
                          {idx < category.tags.length - 1 && <span className="mr-1">,</span>}
                        </span>
                      ))
                    )}
                  </div>

                  {/* Actions */}
                  <div className="w-10 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openNewTagDialog(category)}>
                          <Plus className="w-4 h-4 mr-2" /> Add Tag
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditCategoryDialog(category)}>
                          <Pencil className="w-4 h-4 mr-2" /> Edit Folder
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteRequest('category', category)}
                          disabled={!canDelete(category, 'category')}
                        >
                          <Archive className="w-4 h-4 mr-2" /> Delete Folder
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Tag Folder Button */}
        <div className="max-w-7xl mx-auto w-full mt-6">
          <Button
            variant="outline"
            className="w-full border-dashed border-2 py-8 text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 h-auto flex flex-col gap-2"
            onClick={openNewCategoryDialog}
          >
            <Plus className="w-6 h-6" />
            <span className="font-medium">+ Add tag folder</span>
          </Button>
        </div>
      </div>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Folder' : 'New Tag Folder'}</DialogTitle>
            <DialogDescription>
              Create a new dimension for your tagging plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label>Name & Description</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                placeholder="FOLDER NAME (e.g. TRIGGER)"
              />
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description..."
                rows={2}
              />
            </div>

            <div className="space-y-3">
              <Label>Color Strip</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      formData.color === color ? "border-foreground scale-110 shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Multiple Selection</Label>
                  <p className="text-xs text-muted-foreground">
                    Multiple tags allowed?
                  </p>
                </div>
                <Switch
                  checked={formData.isMultiSelect}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isMultiSelect: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Required Field</Label>
                  <p className="text-xs text-muted-foreground">
                    Is this folder mandatory?
                  </p>
                </div>
                <Switch
                  checked={formData.isRequired}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRequired: checked }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCategory} disabled={!formData.name.trim()}>
              {editingCategory ? 'Save Changes' : 'Create Folder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag Dialog */}
      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTag ? 'Edit Tag' : 'New Tag'}</DialogTitle>
            <DialogDescription>
              {selectedCategory && (
                <span className="flex items-center gap-2">
                  Folder: <span className="font-bold" style={{ color: selectedCategory.color }}>{selectedCategory.name}</span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tag Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Newsletter"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Usage guidance..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <div className="flex-1 flex justify-between">
              {editingTag && (
                <Button
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleDeleteRequest('tag', editingTag!)}
                  disabled={!canDelete(editingTag!, 'tag')}
                >
                  Delete Tag
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" onClick={() => setTagDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveTag} disabled={!formData.name.trim()}>
                  Save
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === 'category' ? (
                "This will permanently delete the folder and all its tags. This action cannot be undone."
              ) : (
                "This will permanently delete the tag. This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
