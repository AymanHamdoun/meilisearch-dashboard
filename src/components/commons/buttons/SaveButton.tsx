import React from 'react';
import { ActionButton } from './ActionButton';

interface SaveButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  success?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loadingText?: string;
  successText?: string;
  defaultText?: string;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  success = false,
  size = 'md',
  className = '',
  loadingText = 'Saving...',
  successText = '✓ Success',
  defaultText = 'Save'
}) => {
  const getButtonClass = () => {
    if (loading) return 'bg-gray-400 cursor-not-allowed';
    if (success) return 'bg-primary hover:primary-midfaint';
    return 'bg-primary hover:bg-primary-dark';
  };

  return (
    <ActionButton
      onClick={onClick}
      disabled={disabled || success}
      loading={loading}
      variant="primary"
      size={size}
      className={`${getButtonClass()} ${className}`}
      loadingText={loadingText}
    >
      {success ? successText : defaultText}
    </ActionButton>
  );
};