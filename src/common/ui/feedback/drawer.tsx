import {
  CloseButton,
  Drawer as ChakraDrawer,
  Heading,
  Portal,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

type DrawerProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
};

export function Drawer({
  title,
  isOpen,
  onClose,
  children,
  size = 'md',
}: DrawerProps) {
  return (
    <ChakraDrawer.Root
      open={isOpen}
      onOpenChange={e => !e.open && onClose()}
      placement="end"
      size={size}
    >
      <Portal>
        <ChakraDrawer.Backdrop />
        <ChakraDrawer.Positioner>
          <ChakraDrawer.Content>
            <ChakraDrawer.Header borderBottomWidth="1px">
              <Heading size="md">{title}</Heading>
              <ChakraDrawer.CloseTrigger asChild position="absolute" top={3} right={3}>
                <CloseButton size="sm" />
              </ChakraDrawer.CloseTrigger>
            </ChakraDrawer.Header>
            <ChakraDrawer.Body py={6}>{children}</ChakraDrawer.Body>
          </ChakraDrawer.Content>
        </ChakraDrawer.Positioner>
      </Portal>
    </ChakraDrawer.Root>
  );
}
