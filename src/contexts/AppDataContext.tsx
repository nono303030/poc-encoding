import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TagCategory, EmailHistoryItem, Tag } from '@/types/history';

interface FilterState {
    type: 'tag' | 'status' | 'all';
    value: string;
}

interface AppDataContextType {
    categories: TagCategory[];
    emails: EmailHistoryItem[];
    activeFilter: FilterState;
    setFilter: (filter: FilterState) => void;
    // Actions for Categories
    addCategory: (category: TagCategory) => void;
    updateCategory: (category: TagCategory) => void;
    deleteCategory: (id: string) => void;
    // Actions for Tags
    addTag: (categoryId: string, tag: Tag) => void;
    updateTag: (categoryId: string, tag: Tag) => void;
    deleteTag: (categoryId: string, tagId: string) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// Initial Mock Data
const INITIAL_CATEGORIES: TagCategory[] = [
    {
        id: '1',
        name: 'Format',
        description: 'Email format and type classification',
        color: '#3b82f6',
        isMultiSelect: false,
        isRequired: true,
        tags: [
            { id: '1a', name: 'Newsletter', description: 'Regular newsletter communications', usageCount: 24, categoryId: '1' },
            { id: '1b', name: 'Promotional', description: 'Sales and promotional emails', usageCount: 18, categoryId: '1' },
            { id: '1c', name: 'Transactional', description: 'Order confirmations, receipts', usageCount: 12, categoryId: '1' },
            { id: '1d', name: 'Trigger', description: 'Automated trigger-based emails', usageCount: 8, categoryId: '1' },
        ],
    },
    {
        id: '2',
        name: 'Product',
        description: 'Product category classification',
        color: '#ec4899',
        isMultiSelect: true,
        isRequired: false,
        tags: [
            { id: '2a', name: 'Fashion', description: 'Clothing and accessories', usageCount: 15, categoryId: '2' },
            { id: '2b', name: 'Beauty', description: 'Beauty and cosmetics', usageCount: 9, categoryId: '2' },
            { id: '2c', name: 'Home', description: 'Home and living products', usageCount: 6, categoryId: '2' },
            { id: '2d', name: 'All Products', description: 'Cross-category emails', usageCount: 11, categoryId: '2' },
        ],
    },
    {
        id: '3',
        name: 'Language',
        description: 'Email language and regional targeting',
        color: '#8b5cf6',
        isMultiSelect: false,
        isRequired: true,
        tags: [
            { id: '3a', name: 'French', description: 'French language emails', usageCount: 42, categoryId: '3' },
            { id: '3b', name: 'English', description: 'English language emails', usageCount: 28, categoryId: '3' },
            { id: '3c', name: 'German', description: 'German language emails', usageCount: 14, categoryId: '3' },
        ],
    },
    {
        id: '4',
        name: 'Audience',
        description: 'Target audience segmentation',
        color: '#10b981',
        isMultiSelect: true,
        isRequired: false,
        tags: [
            { id: '4a', name: 'VIP', description: 'High-value customer segment', usageCount: 7, categoryId: '4' },
            { id: '4b', name: 'New Subscribers', description: 'Recent sign-ups', usageCount: 5, categoryId: '4' },
            { id: '4c', name: 'Inactive', description: 'Win-back campaigns', usageCount: 3, categoryId: '4' },
            { id: '4d', name: 'All Subscribers', description: 'Full subscriber base', usageCount: 19, categoryId: '4' },
        ],
    },
    {
        id: '5',
        name: 'Campaign',
        description: 'Marketing campaign classification',
        color: '#f59e0b',
        isMultiSelect: false,
        isRequired: false,
        tags: [
            { id: '5a', name: 'Spring 2026', description: 'Spring collection launch', usageCount: 4, categoryId: '5' },
            { id: '5b', name: 'Holiday', description: 'Holiday season campaigns', usageCount: 8, categoryId: '5' },
            { id: '5c', name: 'Flash Sale', description: 'Limited-time offers', usageCount: 6, categoryId: '5' },
            { id: '5d', name: 'Welcome', description: 'Welcome series emails', usageCount: 3, categoryId: '5' },
        ],
    },
];

const INITIAL_EMAILS: EmailHistoryItem[] = [
    {
        id: '1',
        name: 'Spring Collection Launch',
        createdAt: new Date('2026-01-28'),
        updatedAt: new Date('2026-01-30'),
        author: 'Marie Dupont',
        status: 'sent',
        tags: ['Newsletter', 'Spring 2026', 'Fashion', 'French'],
    },
    {
        id: '2',
        name: 'Flash Sale Announcement',
        createdAt: new Date('2026-01-25'),
        updatedAt: new Date('2026-01-26'),
        author: 'Jean Martin',
        status: 'sent',
        tags: ['Promo', 'Flash Sale', 'All Products'],
    },
    {
        id: '3',
        name: 'Welcome Series - Day 1',
        createdAt: new Date('2026-01-20'),
        updatedAt: new Date('2026-02-01'),
        author: 'Sophie Bernard',
        status: 'ready',
        tags: ['Automation', 'Welcome', 'Onboarding'],
    },
    {
        id: '4',
        name: 'Product Restock Alert',
        createdAt: new Date('2026-01-15'),
        updatedAt: new Date('2026-01-18'),
        author: 'Marie Dupont',
        status: 'draft',
        tags: ['Trigger', 'Restock', 'Beauty'],
    },
    {
        id: '5',
        name: 'Holiday Gift Guide 2025',
        createdAt: new Date('2025-12-01'),
        updatedAt: new Date('2025-12-15'),
        author: 'Jean Martin',
        status: 'archived',
        tags: ['Newsletter', 'Holiday', 'Gift Guide'],
    },
    {
        id: '6',
        name: 'VIP Early Access',
        createdAt: new Date('2026-01-22'),
        updatedAt: new Date('2026-01-24'),
        author: 'Sophie Bernard',
        status: 'sent',
        tags: ['VIP', 'Exclusive', 'Fashion'],
    },
];

export function AppDataProvider({ children }: { children: ReactNode }) {
    const [categories, setCategories] = useState<TagCategory[]>(INITIAL_CATEGORIES);
    const [emails, setEmails] = useState<EmailHistoryItem[]>(INITIAL_EMAILS);
    const [activeFilter, setActiveFilter] = useState<FilterState>({ type: 'all', value: '' });

    // Categories Actions
    const addCategory = (category: TagCategory) => {
        setCategories(prev => [...prev, category]);
    };

    const updateCategory = (category: TagCategory) => {
        setCategories(prev => prev.map(c => c.id === category.id ? category : c));
    };

    const deleteCategory = (id: string) => {
        setCategories(prev => prev.filter(c => c.id !== id));
    };

    // Tags Actions
    const addTag = (categoryId: string, tag: Tag) => {
        setCategories(prev => prev.map(c =>
            c.id === categoryId
                ? { ...c, tags: [...c.tags, tag] }
                : c
        ));
    };

    const updateTag = (categoryId: string, tag: Tag) => {
        setCategories(prev => prev.map(c =>
            c.id === categoryId
                ? { ...c, tags: c.tags.map(t => t.id === tag.id ? tag : t) }
                : c
        ));
    };

    const deleteTag = (categoryId: string, tagId: string) => {
        setCategories(prev => prev.map(c =>
            c.id === categoryId
                ? { ...c, tags: c.tags.filter(t => t.id !== tagId) }
                : c
        ));
    };

    return (
        <AppDataContext.Provider value={{
            categories,
            emails,
            activeFilter,
            setFilter: setActiveFilter,
            addCategory,
            updateCategory,
            deleteCategory,
            addTag,
            updateTag,
            deleteTag
        }}>
            {children}
        </AppDataContext.Provider>
    );
}

export function useAppData() {
    const context = useContext(AppDataContext);
    if (context === undefined) {
        throw new Error('useAppData must be used within an AppDataProvider');
    }
    return context;
}
