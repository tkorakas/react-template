import { useContext } from 'react';
import { DialogContext } from './dialog-provider';

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within DialogProvider');
  }
  return context;
}
