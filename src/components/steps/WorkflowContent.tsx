import { useEmailWorkflow } from '@/contexts/EmailWorkflowContext';
import { MetadataStep } from './MetadataStep';
import { ContentImportStep } from './ContentImportStep';
import { EmailStructureStep } from './EmailStructureStep';
import { ImageManagementStep } from './ImageManagementStep';
import { ValidationDashboardStep } from './ValidationDashboardStep';
import { ConfirmationStep } from './ConfirmationStep';

export function WorkflowContent() {
  const { currentStep } = useEmailWorkflow();

  switch (currentStep) {
    case 'metadata':
      return <MetadataStep />;
    case 'import':
      return <ContentImportStep />;
    case 'structure':
      return <EmailStructureStep />;
    case 'images':
      return <ImageManagementStep />;
    case 'validation':
      return <ValidationDashboardStep />;
    case 'confirm':
      return <ConfirmationStep />;
    default:
      return <ContentImportStep />;
  }
}
