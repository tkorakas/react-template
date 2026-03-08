import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react';
import { createContext, useState, type ReactNode } from 'react';

interface DialogOptions {
  title: string;
  description: string;
  actionLabel: string;
  onSuccess: () => void | Promise<void>;
}

interface DialogContextValue {
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
}

export const DialogContext = createContext<DialogContextValue | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DialogOptions | null>(null);

  const openDialog = (newOptions: DialogOptions) => {
    setOptions(newOptions);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleAction = async () => {
    if (options?.onSuccess) {
      await options.onSuccess();
    }
    closeDialog();
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog.Root
        placement="center"
        open={isOpen}
        onOpenChange={e => setIsOpen(e.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{options?.title}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>{options?.description}</p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button>Cancel</Button>
                </Dialog.ActionTrigger>
                <Button onClick={handleAction}>{options?.actionLabel}</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </DialogContext.Provider>
  );
}
