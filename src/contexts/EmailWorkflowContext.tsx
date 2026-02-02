import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  WorkflowStep,
  EmailStatus,
  ValidationItem,
  ImageAsset,
  ContentBlock
} from '@/types/email';

interface EmailWorkflowState {
  currentStep: WorkflowStep;
  emailStatus: EmailStatus;
  projectName: string;
  contentImported: boolean;
  validations: ValidationItem[];
  images: ImageAsset[];
  contentBlocks: ContentBlock[];
  userConfirmed: boolean;
  selectedTags: string[];
}

interface EmailWorkflowContextType extends EmailWorkflowState {
  setCurrentStep: (step: WorkflowStep) => void;
  setProjectName: (name: string) => void;
  setContentImported: (imported: boolean) => void;
  setUserConfirmed: (confirmed: boolean) => void;
  setSelectedTags: (tags: string[]) => void;
  getStepStatus: (step: WorkflowStep) => 'pending' | 'current' | 'complete';
  canProceed: () => boolean;
}

const defaultValidations: ValidationItem[] = [
  { id: 'links', label: 'All links are valid', status: 'pending' },
  { id: 'tracking', label: 'Tracking scripts verified', status: 'pending' },
  { id: 'blocks', label: 'Mandatory blocks present', status: 'pending' },
  { id: 'weight', label: 'Email weight under limit', status: 'pending' },
  { id: 'images', label: 'Images optimized', status: 'pending' },
  { id: 'alt-text', label: 'Alt text complete', status: 'pending' },
];

const defaultImages: ImageAsset[] = [
  {
    id: '1',
    name: 'hero-banner.jpg',
    url: '/placeholder.svg',
    width: 600,
    height: 300,
    sizeKb: 85,
    altText: 'Spring Collection Banner',
    status: 'valid'
  },
  {
    id: '2',
    name: 'product-1.png',
    url: '/placeholder.svg',
    width: 300,
    height: 300,
    sizeKb: 245,
    altText: '',
    status: 'missing-alt'
  },
  {
    id: '3',
    name: 'footer-logo.png',
    url: '/placeholder.svg',
    width: 150,
    height: 50,
    sizeKb: 320,
    altText: 'Company Logo',
    status: 'too-heavy'
  },
];

const defaultContentBlocks: ContentBlock[] = [
  { id: '1', type: 'image', content: 'Hero Banner', isRequired: true },
  { id: '2', type: 'text', content: 'Welcome to our Spring Collection! Discover the latest trends and exclusive offers.', isRequired: true },
  { id: '3', type: 'button', content: 'Shop Now', isRequired: true },
  { id: '4', type: 'spacer', content: '' },
  { id: '5', type: 'table', content: 'Product Grid', isRequired: false },
  { id: '6', type: 'text', content: 'Terms and conditions apply. Unsubscribe link below.' },
];

const EmailWorkflowContext = createContext<EmailWorkflowContextType | undefined>(undefined);

const stepOrder: WorkflowStep[] = ['metadata', 'import', 'structure', 'images', 'validation', 'confirm'];

export function EmailWorkflowProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('metadata');
  const [projectName, setProjectName] = useState('Spring Campaign - March 2026');
  const [contentImported, setContentImported] = useState(false);
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [validations] = useState<ValidationItem[]>(defaultValidations);
  const [images] = useState<ImageAsset[]>(defaultImages);
  const [contentBlocks] = useState<ContentBlock[]>(defaultContentBlocks);

  const getEmailStatus = (): EmailStatus => {
    const hasErrors = images.some(img => img.status === 'too-heavy');
    const hasWarnings = images.some(img => img.status === 'missing-alt');

    if (hasErrors) return 'blocking';
    if (hasWarnings) return 'attention';
    return 'ready';
  };

  const getStepStatus = (step: WorkflowStep): 'pending' | 'current' | 'complete' => {
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);

    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 'metadata':
        return projectName.trim().length > 0 && selectedTags.length > 0;
      case 'import':
        return contentImported;
      case 'structure':
        return true;
      case 'images':
        return !images.some(img => img.status === 'too-heavy');
      case 'validation':
        return !validations.some(v => v.status === 'error');
      case 'confirm':
        return userConfirmed;
      default:
        return true;
    }
  };

  return (
    <EmailWorkflowContext.Provider
      value={{
        currentStep,
        emailStatus: getEmailStatus(),
        projectName,
        contentImported,
        validations,
        images,
        contentBlocks,
        userConfirmed,
        selectedTags,
        setCurrentStep,
        setProjectName,
        setContentImported,
        setUserConfirmed,
        setSelectedTags,
        getStepStatus,
        canProceed,
      }}
    >
      {children}
    </EmailWorkflowContext.Provider>
  );
}

export function useEmailWorkflow() {
  const context = useContext(EmailWorkflowContext);
  if (context === undefined) {
    throw new Error('useEmailWorkflow must be used within an EmailWorkflowProvider');
  }
  return context;
}
