import { useState } from 'react';
import { Search, Calendar, User, Tag, Eye, X, Filter, Folder, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
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
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { EmailHistoryItem, EmailHistoryStatus } from '@/types/history';
import { format } from 'date-fns';
import { useAppData } from '@/contexts/AppDataContext';
import { Check } from 'lucide-react';

const statusConfig: Record<EmailHistoryStatus, { label: string; className: string; icon?: any }> = {
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
  ready: { label: 'Ready', className: 'bg-success-muted text-success' },
  sent: { label: 'Sent', className: 'bg-primary/10 text-primary' },
  archived: { label: 'Archived', className: 'bg-secondary text-secondary-foreground' },
};

export function HistoryTab() {
  const { emails, activeFilter, setFilter, categories, toggleTagFilter, toggleStatusFilter, resetFilters } = useAppData();

  const [searchQuery, setSearchQuery] = useState('');
  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedEmail, setSelectedEmail] = useState<EmailHistoryItem | null>(null);

  // Derived filters
  const allAuthors = Array.from(new Set(emails.map(e => e.author)));

  const filteredEmails = emails.filter(email => {
    // 1. Tags Filter (OR logic within, AND across categories if we wanted, but here it's just a flat list of active tags. 
    // Usually faceted search is OR within a category, AND across categories. 
    // For now, let's say if ANY tag matches, it shows? Or ALL? 
    // Reviewing sidebar logic: it was just "includes". 
    // Let's implement: Active Tags must be present (AND logic for tags? or OR?)
    // E-commerce usually: "Brand: Nike OR Adidas". 
    // Let's stick to: If tags selected, email must have AT LEAST ONE of selected tags? 
    // Or if I select "Newsletter", I want newsletters. If I select "Newsletter" AND "Fashion", do I want emails that are BOTH? 
    // Sidebar behavior was: click a tag -> show emails with that tag.
    // If I click another tag, it adds to list. 
    // Let's go with OR logic for tags, AND logic for Status+Tags.
    // Actually, widespread pattern is OR within same attribute (e.g. status), AND across different attributes.

    // BUT, since we have only one "Tags" filter in context for now (flat list), let's say OR.
    // Wait, the context `toggleTagFilter` adds to a list.
    // Let's assume standard faceted navigation:
    // Status: Ready OR Sent
    // AND
    // Tags: Newsletter OR Promo

    // Status Filter
    const matchesStatus = activeFilter.status.length === 0 || activeFilter.status.includes(email.status);

    // Tags Filter
    const matchesTags = activeFilter.tags.length === 0 || email.tags.some(tag => activeFilter.tags.includes(tag));

    // Search Filter
    // We moved search to context or local? Context has `search`. 
    // But `HistoryTab` had local `searchQuery`. 
    // Let's use local search for now or sync with context if we want global search.
    // The plan said "search: string" in FilterState. Let's use that.
    const matchesSearch = activeFilter.search
      ? email.name.toLowerCase().includes(activeFilter.search.toLowerCase())
      : true;


    // Local Date Filter
    const matchesDateFrom = !dateRange.from || email.createdAt >= dateRange.from;
    const matchesDateTo = !dateRange.to || email.createdAt <= dateRange.to;

    return matchesStatus && matchesTags && matchesSearch && matchesDateFrom && matchesDateTo;
  });

  const getTagColor = (tagName: string) => {
    const category = categories.find(c => c.tags.some(t => t.name === tagName));
    return category ? category.color : undefined;
  };

  const hasActiveFilters =
    activeFilter.search ||
    activeFilter.status.length > 0 ||
    activeFilter.tags.length > 0 ||
    dateRange.from ||
    dateRange.to;

  // Helper to clear all
  const clearAllFilters = () => {
    resetFilters();
    setDateRange({});
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground mb-1">Email History</h1>
              <p className="text-sm text-muted-foreground">
                Complete archive of all emails generated through the automation tool.
              </p>
            </div>
            {/* Active Filter Indicator */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/20 animate-in fade-in slide-in-from-top-2">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Active:</span>

                {/* Status Badges */}
                {activeFilter.status.map(status => (
                  <Badge key={status} variant="secondary" className={cn("gap-1 pl-1.5 pr-2.5 shadow-sm border border-border/50", statusConfig[status].className)}>
                    {statusConfig[status].label}
                  </Badge>
                ))}

                {/* Tag Badges */}
                {activeFilter.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1 pl-1.5 pr-2.5 bg-background shadow-sm border border-border/50">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getTagColor(tag) || 'currentColor' }} />
                    {tag}
                  </Badge>
                ))}

                {/* Date Badge */}
                {(dateRange.from || dateRange.to) && (
                  <Badge variant="secondary" className="gap-1 pl-1.5 pr-2.5 bg-background shadow-sm border border-border/50">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    {dateRange.from ? format(dateRange.from, 'MMM d') : ''}
                    {dateRange.to ? ` - ${format(dateRange.to, 'MMM d')}` : ''}
                  </Badge>
                )}

                <Separator orientation="vertical" className="h-4 mx-1" />

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 rounded-full hover:bg-destructive/10 hover:text-destructive -mr-1"
                  onClick={clearAllFilters}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="max-w-6xl flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by email name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setFilter({ ...activeFilter, search: e.target.value });
              }}
              className="pl-9"
            />
          </div>

          {/* Tags Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-dashed">
                <Tag className="mr-2 h-4 w-4" />
                Tags
                {activeFilter.tags.length > 0 && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                      {activeFilter.tags.length}
                    </Badge>
                    <div className="hidden space-x-1 lg:flex">
                      {activeFilter.tags.length > 2 ? (
                        <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                          {activeFilter.tags.length} selected
                        </Badge>
                      ) : (
                        activeFilter.tags.map((tag) => (
                          <Badge
                            variant="secondary"
                            key={tag}
                            className="rounded-sm px-1 font-normal"
                          >
                            {tag}
                          </Badge>
                        ))
                      )}
                    </div>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Tags" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {categories.map((category) => (
                    <CommandGroup key={category.id} heading={category.name}>
                      {category.tags.map((tag) => {
                        const isSelected = activeFilter.tags.includes(tag.name);
                        return (
                          <CommandItem
                            key={tag.id}
                            onSelect={() => toggleTagFilter(tag.name)}
                          >
                            <div
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50 [&_svg]:invisible"
                              )}
                            >
                              <Check className={cn("h-4 w-4")} />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                              <span>{tag.name}</span>
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  ))}
                  {activeFilter.tags.length > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => setFilter({ ...activeFilter, tags: [] })}
                          className="justify-center text-center"
                        >
                          Clear filters
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Status Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-dashed">
                <Filter className="mr-2 h-4 w-4" />
                Status
                {activeFilter.status.length > 0 && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                      {activeFilter.status.length}
                    </Badge>
                    <div className="hidden space-x-1 lg:flex">
                      {activeFilter.status.length > 2 ? (
                        <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                          {activeFilter.status.length} selected
                        </Badge>
                      ) : (
                        activeFilter.status.map((status) => (
                          <Badge
                            variant="secondary"
                            key={status}
                            className="rounded-sm px-1 font-normal"
                          >
                            {statusConfig[status].label}
                          </Badge>
                        ))
                      )}
                    </div>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Status" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {Object.entries(statusConfig).map(([status, config]) => {
                      const isSelected = activeFilter.status.includes(status as EmailHistoryStatus);
                      return (
                        <CommandItem
                          key={status}
                          onSelect={() => toggleStatusFilter(status as EmailHistoryStatus)}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <Check className={cn("h-4 w-4")} />
                          </div>
                          <span className={config.className + " px-2 py-0.5 rounded-sm text-xs"}>{config.label}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                  {activeFilter.status.length > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => setFilter({ ...activeFilter, status: [] })}
                          className="justify-center text-center"
                        >
                          Clear filters
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Author Filter (Local) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-dashed">
                <User className="mr-2 h-4 w-4" />
                Author
                {authorFilter !== 'all' && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-4" />
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                      {authorFilter}
                    </Badge>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Author" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => setAuthorFilter('all')}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          authorFilter === 'all'
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className={cn("h-4 w-4")} />
                      </div>
                      All Authors
                    </CommandItem>
                    {allAuthors.map((author) => {
                      const isSelected = authorFilter === author;
                      return (
                        <CommandItem
                          key={author}
                          onSelect={() => setAuthorFilter(isSelected ? 'all' : author)}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <Check className={cn("h-4 w-4")} />
                          </div>
                          {author}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Date Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}>
                <Calendar className="w-4 h-4 mr-2" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <span className="text-sm">{format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}</span>
                  ) : (
                    <span className="text-sm">From {format(dateRange.from, 'MMM d')}</span>
                  )
                ) : (
                  <span>Date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="max-w-6xl">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[35%]">Email Name</TableHead>
                  <TableHead className="w-[12%]">Created</TableHead>
                  <TableHead className="w-[12%]">Updated</TableHead>
                  <TableHead className="w-[12%]">Author</TableHead>
                  <TableHead className="w-[10%]">Status</TableHead>
                  <TableHead className="w-[19%]">Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmails.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No emails found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmails.map((email) => (
                    <TableRow
                      key={email.id}
                      className="cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => setSelectedEmail(email)}
                    >
                      <TableCell className="font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          {email.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(email.createdAt, 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(email.updatedAt, 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-sm">{email.author}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn('font-normal', statusConfig[email.status].className)}>
                          {statusConfig[email.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {email.tags.slice(0, 3).map(tag => {
                            const color = getTagColor(tag);
                            return (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs font-normal border-border/50"
                                style={{
                                  backgroundColor: color ? `${color}10` : undefined, // 10% opacity
                                  borderColor: color ? `${color}30` : undefined,
                                }}
                              >
                                {color && <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: color }} />}
                                {tag}
                              </Badge>
                            );
                          })}
                          {email.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs font-normal bg-transparent">
                              +{email.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mt-3">
            Showing {filteredEmails.length} of {emails.length} emails
          </p>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-lg">{selectedEmail?.name}</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedEmail?.status === 'draft' ? 'Draft Preview' : 'Email Details'}
                </p>
              </div>
              {selectedEmail && (
                <Badge className={cn('font-normal', statusConfig[selectedEmail.status].className)}>
                  {statusConfig[selectedEmail.status].label}
                </Badge>
              )}
            </div>
          </DialogHeader>

          {selectedEmail && (
            <div className="space-y-6 pt-2">
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Author</p>
                  <p className="text-sm font-medium">{selectedEmail.author}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Created</p>
                  <p className="text-sm font-medium">{format(selectedEmail.createdAt, 'MMMM d, yyyy')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Last Updated</p>
                  <p className="text-sm font-medium">{format(selectedEmail.updatedAt, 'MMMM d, yyyy')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Generated via</p>
                  <p className="text-sm font-medium text-primary">EmailEncode Automation</p>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedEmail.tags.map(tag => {
                    const color = getTagColor(tag);
                    return (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-accent text-accent-foreground border"
                        style={{ borderColor: color ? `${color}30` : 'transparent' }}
                      >
                        {color && <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: color }} />}
                        {tag}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Email Preview Placeholder */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted/30 px-4 py-2 border-b border-border flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Email Preview</span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    Open Full Preview
                  </Button>
                </div>
                <div className="p-8 bg-background/50 flex items-center justify-center min-h-[200px]">
                  <div className="text-center text-muted-foreground">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mx-auto mb-3">
                      <Eye className="w-6 h-6" />
                    </div>
                    <p className="text-sm">Email content preview</p>
                    <p className="text-xs mt-1">Click "Open Full Preview" for complete view</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
