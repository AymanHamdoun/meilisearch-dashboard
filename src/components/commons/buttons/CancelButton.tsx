import React from 'react';
import { ActionButton } from './ActionButton';

interface CancelButtonProps {
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export const CancelButton: React.FC<CancelButtonProps> = ({
  onClick,
  disabled = false,
  size = 'md',
  className = '',
  children = 'Cancel'
}) => {
  return (
    <ActionButton
      onClick={onClick}
      disabled={disabled}
      variant="secondary"
      size={size}
      className={className}
    >
      {children}
    </ActionButton>
  );
};