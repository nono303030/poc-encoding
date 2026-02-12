import { createContext, useContext, useState, ReactNode } from 'react';
import {
    AIWorkflowStep,
    AIQuestion,
    AIOptimizationSuggestion,
    AIGeneratedPrompt,
    ExportPlatform,
    ExportStatus,
} from '@/types/ai-workflow';

// Mock AI questions
const MOCK_QUESTIONS: AIQuestion[] = [
    {
        id: 'q1',
        question: "Quel est l'objectif principal de cet email ? (ex: promotion, information, onboarding...)",
        answer: '',
        type: 'select',
        options: ['Promotion', 'Newsletter', 'Onboarding', 'Transactionnel', 'Relance', 'Autre'],
        placeholder: 'Sélectionnez un objectif',
    },
    {
        id: 'q2',
        question: "Quelle est votre audience cible pour cet envoi ?",
        answer: '',
        type: 'text',
        placeholder: 'Ex: Abonnés actifs, nouveaux inscrits, segment VIP...',
    },
    {
        id: 'q3',
        question: "Quel ton souhaitez-vous donner à cet email ?",
        answer: '',
        type: 'select',
        options: ['Professionnel', 'Amical', 'Urgent', 'Inspirant', 'Humoristique'],
        placeholder: 'Sélectionnez un ton',
    },
    {
        id: 'q4',
        question: "Quel est le call-to-action principal ?",
        answer: '',
        type: 'text',
        placeholder: "Ex: S'inscrire à un webinar, acheter un produit, lire un article...",
    },
];

// Mock optimization suggestions
const MOCK_SUGGESTIONS: AIOptimizationSuggestion[] = [
    {
        id: 's1',
        type: 'content',
        title: 'Objet de l\'email trop long',
        description: 'Les objets de moins de 50 caractères ont un taux d\'ouverture supérieur de 12%.',
        before: 'Découvrez nos offres exceptionnelles pour cette fin de mois — ne ratez pas cette opportunité unique',
        after: '🔥 Offres flash : -30% jusqu\'à dimanche',
        accepted: null,
    },
    {
        id: 's2',
        type: 'content',
        title: 'CTA peu visible',
        description: 'Le bouton d\'appel à l\'action principal devrait être plus proéminent et utiliser un verbe d\'action fort.',
        before: 'Cliquez ici pour en savoir plus',
        after: 'Je profite de l\'offre →',
        accepted: null,
    },
    {
        id: 's3',
        type: 'image',
        title: 'Image hero trop lourde',
        description: 'L\'image principale fait 1.2MB. Compresser à < 200KB pour un chargement rapide.',
        before: 'hero-banner.png — 1.2MB (2400x800)',
        after: 'hero-banner.webp — 180KB (1200x400)',
        accepted: null,
    },
    {
        id: 's4',
        type: 'structure',
        title: 'Ajouter un preheader',
        description: 'Le preheader complète l\'objet dans l\'inbox et augmente le taux d\'ouverture de 7%.',
        before: '(aucun preheader défini)',
        after: 'Jusqu\'à -30% sur toute la boutique. Offre valable ce week-end uniquement.',
        accepted: null,
    },
];

interface AIWorkflowState {
    currentStep: AIWorkflowStep;
    gdocUrl: string;
    gdocContent: string | null;
    gdocLoading: boolean;
    questions: AIQuestion[];
    generatedPrompt: AIGeneratedPrompt | null;
    suggestions: AIOptimizationSuggestion[];
    exportPlatform: ExportPlatform | null;
    exportStatus: ExportStatus;

    // Actions
    setCurrentStep: (step: AIWorkflowStep) => void;
    nextStep: () => void;
    prevStep: () => void;
    setGdocUrl: (url: string) => void;
    importGdoc: () => void;
    updateAnswer: (questionId: string, answer: string) => void;
    generatePrompt: () => void;
    acceptSuggestion: (id: string) => void;
    rejectSuggestion: (id: string) => void;
    setExportPlatform: (platform: ExportPlatform) => void;
    startExport: () => void;
    resetWorkflow: () => void;
}

const STEP_ORDER: AIWorkflowStep[] = [
    'gdoc-import',
    'ai-questions',
    'prompt-review',
    'optimization',
    'export',
];

const AIWorkflowContext = createContext<AIWorkflowState | null>(null);

export function AIWorkflowProvider({ children }: { children: ReactNode }) {
    const [currentStep, setCurrentStep] = useState<AIWorkflowStep>('gdoc-import');
    const [gdocUrl, setGdocUrl] = useState('');
    const [gdocContent, setGdocContent] = useState<string | null>(null);
    const [gdocLoading, setGdocLoading] = useState(false);
    const [questions, setQuestions] = useState<AIQuestion[]>(MOCK_QUESTIONS);
    const [generatedPrompt, setGeneratedPrompt] = useState<AIGeneratedPrompt | null>(null);
    const [suggestions, setSuggestions] = useState<AIOptimizationSuggestion[]>(MOCK_SUGGESTIONS);
    const [exportPlatform, setExportPlatform] = useState<ExportPlatform | null>(null);
    const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');

    const nextStep = () => {
        const idx = STEP_ORDER.indexOf(currentStep);
        if (idx < STEP_ORDER.length - 1) {
            setCurrentStep(STEP_ORDER[idx + 1]);
        }
    };

    const prevStep = () => {
        const idx = STEP_ORDER.indexOf(currentStep);
        if (idx > 0) {
            setCurrentStep(STEP_ORDER[idx - 1]);
        }
    };

    const importGdoc = () => {
        setGdocLoading(true);
        // Simulate parsing delay
        setTimeout(() => {
            setGdocContent(
                `# Newsletter Mensuelle — Février 2026\n\n` +
                `Bonjour {{Prénom}},\n\n` +
                `Nous sommes ravis de vous présenter les nouveautés de ce mois-ci ! ` +
                `Découvrez nos dernières offres et contenus exclusifs réservés à nos abonnés.\n\n` +
                `## 🔥 Offre du mois\n` +
                `Profitez de **-30% sur toute la boutique** ce week-end uniquement.\n\n` +
                `## 📰 À la une\n` +
                `- Guide complet : Comment optimiser vos campagnes email en 2026\n` +
                `- Webinar : Les tendances du marketing digital\n` +
                `- Case study : +45% de taux d'ouverture en 3 mois\n\n` +
                `À très bientôt,\n` +
                `L'équipe Marketing`
            );
            setGdocLoading(false);
        }, 2000);
    };

    const updateAnswer = (questionId: string, answer: string) => {
        setQuestions(prev =>
            prev.map(q => (q.id === questionId ? { ...q, answer } : q))
        );
    };

    const generatePrompt = () => {
        const answers = questions.reduce((acc, q) => {
            acc[q.id] = q.answer;
            return acc;
        }, {} as Record<string, string>);

        setGeneratedPrompt({
            systemPrompt:
                `Tu es un expert en email marketing avec 15 ans d'expérience. ` +
                `Tu crées des emails HTML responsives, optimisés pour la délivrabilité ` +
                `et le taux de conversion.`,
            userPrompt:
                `Génère un email HTML complet basé sur les paramètres suivants:\n\n` +
                `- Objectif: ${answers.q1 || 'Non spécifié'}\n` +
                `- Audience cible: ${answers.q2 || 'Non spécifié'}\n` +
                `- Ton: ${answers.q3 || 'Non spécifié'}\n` +
                `- CTA principal: ${answers.q4 || 'Non spécifié'}\n\n` +
                `Contenu source (GDoc):\n${gdocContent?.substring(0, 200) || 'Aucun contenu importé'}...\n\n` +
                `Contraintes techniques:\n` +
                `- Email compatible Outlook, Gmail, Apple Mail\n` +
                `- Images max 200KB\n` +
                `- Largeur max 600px\n` +
                `- Alt text sur toutes les images\n` +
                `- Boutons bulletproof (VML fallback)`,
            fullPrompt: '',
        });

        // Set fullPrompt after building it
        setGeneratedPrompt(prev => prev ? {
            ...prev,
            fullPrompt: `[SYSTEM]\n${prev.systemPrompt}\n\n[USER]\n${prev.userPrompt}`,
        } : null);
    };

    const acceptSuggestion = (id: string) => {
        setSuggestions(prev =>
            prev.map(s => (s.id === id ? { ...s, accepted: true } : s))
        );
    };

    const rejectSuggestion = (id: string) => {
        setSuggestions(prev =>
            prev.map(s => (s.id === id ? { ...s, accepted: false } : s))
        );
    };

    const startExport = () => {
        setExportStatus('exporting');
        // Simulate export
        setTimeout(() => {
            setExportStatus('success');
        }, 3000);
    };

    const resetWorkflow = () => {
        setCurrentStep('gdoc-import');
        setGdocUrl('');
        setGdocContent(null);
        setGdocLoading(false);
        setQuestions(MOCK_QUESTIONS);
        setGeneratedPrompt(null);
        setSuggestions(MOCK_SUGGESTIONS);
        setExportPlatform(null);
        setExportStatus('idle');
    };

    return (
        <AIWorkflowContext.Provider
            value={{
                currentStep,
                gdocUrl,
                gdocContent,
                gdocLoading,
                questions,
                generatedPrompt,
                suggestions,
                exportPlatform,
                exportStatus,
                setCurrentStep,
                nextStep,
                prevStep,
                setGdocUrl,
                importGdoc,
                updateAnswer,
                generatePrompt,
                acceptSuggestion,
                rejectSuggestion,
                setExportPlatform,
                startExport,
                resetWorkflow,
            }}
        >
            {children}
        </AIWorkflowContext.Provider>
    );
}

export function useAIWorkflow() {
    const ctx = useContext(AIWorkflowContext);
    if (!ctx) throw new Error('useAIWorkflow must be used within AIWorkflowProvider');
    return ctx;
}
