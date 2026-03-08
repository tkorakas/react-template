import { Flex, IconButton, Menu, Portal } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

type MenuItemBase = {
  value: string;
  color?: string;
};

type MenuItemWithOnClick = MenuItemBase & {
  label: ReactNode;
  onClick: () => void;
  asChild?: never;
  children?: never;
};

type MenuItemWithAsChild = MenuItemBase & {
  asChild: true;
  children: ReactNode;
  label?: never;
  onClick?: never;
};

type MenuItem = MenuItemWithOnClick | MenuItemWithAsChild;

type RowActionMenuProps = {
  items: MenuItem[];
  ariaLabel?: string;
};

export function RowActionMenu({
  items,
  ariaLabel = 'Actions',
}: RowActionMenuProps) {
  return (
    <Flex justify="flex-end">
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton aria-label={ariaLabel} variant="ghost" size="sm">
            <BsThreeDotsVertical />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {items.map(item =>
                item.asChild ? (
                  <Menu.Item
                    key={item.value}
                    value={item.value}
                    color={item.color}
                    asChild
                  >
                    {item.children}
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    key={item.value}
                    value={item.value}
                    color={item.color}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </Menu.Item>
                )
              )}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Flex>
  );
}
