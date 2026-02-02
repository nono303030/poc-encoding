// Email encoding workflow types

export type WorkflowStep =
  | 'metadata'
  | 'import'
  | 'structure'
  | 'images'
  | 'validation'
  | 'confirm';

export type StepStatus = 'pending' | 'current' | 'complete';

export type EmailStatus = 'ready' | 'attention' | 'blocking';

export interface ValidationItem {
  id: string;
  label: string;
  status: 'pass' | 'warning' | 'error' | 'pending';
  message?: string;
}

export interface ImageAsset {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  sizeKb: number;
  altText: string;
  status: 'valid' | 'too-heavy' | 'missing-alt' | 'wrong-size';
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'table' | 'button' | 'spacer';
  content: string;
  isRequired?: boolean;
}

export interface EmailProject {
  id: string;
  name: string;
  status: EmailStatus;
  lastModified: Date;
  currentStep: WorkflowStep;
  stepsCompleted: WorkflowStep[];
  content: ContentBlock[];
  images: ImageAsset[];
  validations: ValidationItem[];
}
