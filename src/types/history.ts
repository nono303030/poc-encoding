// History and Tagging Plan types

export type EmailHistoryStatus = 'draft' | 'ready' | 'sent' | 'archived';

export interface EmailHistoryItem {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  status: EmailHistoryStatus;
  tags: string[];
}

export interface TagCategory {
  id: string;
  name: string;
  description: string;
  color: string; // Hex color code for visual distinction
  icon?: string; // Icon name from lucide-react
  isMultiSelect: boolean; // If false, acts as single-select (radio behavior)
  isRequired: boolean; // If true, at least one tag from this category must be selected
  tags: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  description: string;
  usageCount: number;
  categoryId: string;
}

export type MainView = 'workflow' | 'history' | 'tagging';
