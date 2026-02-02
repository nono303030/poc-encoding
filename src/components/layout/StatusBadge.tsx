import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmailStatus } from '@/types/email';

interface StatusBadgeProps {
  status: EmailStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const statusConfig = {
  ready: {
    icon: CheckCircle2,
    label: 'Ready to Send',
    className: 'status-ready',
    mutedClassName: 'status-ready-muted',
  },
  attention: {
    icon: AlertTriangle,
    label: 'Attention Needed',
    className: 'status-attention',
    mutedClassName: 'status-attention-muted',
  },
  blocking: {
    icon: XCircle,
    label: 'Issues Found',
    className: 'status-blocking',
    mutedClassName: 'status-blocking-muted',
  },
};

export function StatusBadge({ status, size = 'md', showLabel = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        config.className,
        sizeClasses[size]
      )}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}

export function StatusBadgeMuted({ status, size = 'md', showLabel = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        config.mutedClassName,
        sizeClasses[size]
      )}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}
