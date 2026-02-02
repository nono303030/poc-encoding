import { useState } from 'react';
import { Search, Filter, Calendar, User, Tag, Eye, Clock, ChevronDown, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const statusConfig: Record<EmailHistoryStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
  ready: { label: 'Ready', className: 'bg-success-muted text-success' },
  sent: { label: 'Sent', className: 'bg-primary/10 text-primary' },
  archived: { label: 'Archived', className: 'bg-secondary text-secondary-foreground' },
};

export function HistoryTab() {
  const { emails, activeFilter, setFilter, categories } = useAppData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedEmail, setSelectedEmail] = useState<EmailHistoryItem | null>(null);

  // Derived filters
  const allAuthors = Array.from(new Set(emails.map(e => e.author)));

  const filteredEmails = emails.filter(email => {
    // 1. Context Filter (Sidebar)
    const matchesContextFilter =
      activeFilter.type === 'all'
        ? true
        : activeFilter.type === 'tag'
          ? email.tags.includes(activeFilter.value)
          : activeFilter.type === 'status'
            ? email.status === activeFilter.value
            : true;

    // 2. Local Filters
    const matchesSearch = email.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || email.status === statusFilter;
    const matchesAuthor = authorFilter === 'all' || email.author === authorFilter;
    const matchesDateFrom = !dateRange.from || email.createdAt >= dateRange.from;
    const matchesDateTo = !dateRange.to || email.createdAt <= dateRange.to;

    return matchesContextFilter && matchesSearch && matchesStatus && matchesAuthor && matchesDateFrom && matchesDateTo;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setAuthorFilter('all');
    setDateRange({});
    setFilter({ type: 'all', value: '' }); // Clear sidebar filter too
  };

  const getTagColor = (tagName: string) => {
    const category = categories.find(c => c.tags.some(t => t.name === tagName));
    return category ? category.color : undefined;
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== 'all' ||
    authorFilter !== 'all' ||
    dateRange.from ||
    dateRange.to ||
    activeFilter.type !== 'all';

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
            {activeFilter.type === 'tag' && (
              <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/20 animate-in fade-in slide-in-from-top-2">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Active Filter:</span>
                <Badge variant="secondary" className="gap-1 pl-1.5 pr-2.5 bg-background shadow-sm border border-border/50">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getTagColor(activeFilter.value) || 'currentColor' }} />
                  {activeFilter.value}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 rounded-full hover:bg-destructive/10 hover:text-destructive -mr-1"
                  onClick={() => setFilter({ type: 'all', value: '' })}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          {/* Author Filter */}
          <Select value={authorFilter} onValueChange={setAuthorFilter}>
            <SelectTrigger className="w-[160px]">
              <User className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Author" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Authors</SelectItem>
              {allAuthors.map(author => (
                <SelectItem key={author} value={author}>{author}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <span className="text-sm">{format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}</span>
                  ) : (
                    <span className="text-sm">From {format(dateRange.from, 'MMM d')}</span>
                  )
                ) : (
                  <span className="text-muted-foreground">Date range</span>
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

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              Clear filters
            </Button>
          )}
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
