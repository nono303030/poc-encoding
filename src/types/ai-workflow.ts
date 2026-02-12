// AI Workflow V2 types — fully isolated from V1

export type AIWorkflowStep =
    | 'gdoc-import'
    | 'ai-questions'
    | 'prompt-review'
    | 'optimization'
    | 'export';

export interface AIQuestion {
    id: string;
    question: string;
    answer: string;
    type: 'text' | 'select' | 'multiselect';
    options?: string[];
    placeholder?: string;
}

export interface AIOptimizationSuggestion {
    id: string;
    type: 'content' | 'image' | 'structure';
    title: string;
    description: string;
    before: string;
    after: string;
    accepted: boolean | null; // null = not yet reviewed
}

export interface AIGeneratedPrompt {
    systemPrompt: string;
    userPrompt: string;
    fullPrompt: string;
}

export type ExportPlatform = 'sfmc' | 'bsft' | 'both';

export type ExportStatus = 'idle' | 'exporting' | 'success' | 'error';
