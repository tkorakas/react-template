import { Box, Button, Float, Popover, Portal } from '@chakra-ui/react';
import { useMemo, useState, type ReactNode } from 'react';
import { IoFilterSharp } from 'react-icons/io5';
import { countActiveFilters, type Filters } from './filters.utils';

interface FiltersPanelProps {
  children: (props: { close: () => void }) => ReactNode;
  filters: Filters;
}

export function FiltersPanel({ children, filters }: FiltersPanelProps) {
  const [open, setOpen] = useState(false);
  const filtersCount = useMemo(() => countActiveFilters(filters), [filters]);

  const close = () => setOpen(false);

  return (
    <Popover.Root
      lazyMount
      unmountOnExit
      open={open}
      onOpenChange={e => setOpen(e.open)}
    >
      <Popover.Trigger asChild>
        <Box position="relative">
          <Button variant="ghost" aria-label="Filters">
            <IoFilterSharp />
          </Button>
          {filtersCount > 0 && (
            <Float placement="top-end" offsetX="1" offsetY="1">
              <Box
                bg="blue.500"
                color="white"
                borderRadius="full"
                minW="5"
                h="5"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xs"
                fontWeight="bold"
                px="1"
              >
                {filtersCount}
              </Box>
            </Float>
          )}
        </Box>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Body>{children({ close })}</Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
