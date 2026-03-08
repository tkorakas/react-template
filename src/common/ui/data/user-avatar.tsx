import { Box } from '@chakra-ui/react';

type UserAvatarProps = {
  name: string;
};

export function UserAvatar({ name }: UserAvatarProps) {
  const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    const firstInitial = parts[0].charAt(0).toUpperCase();
    const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  };

  return (
    <Box
      w="10"
      h="10"
      borderRadius="full"
      bg="gray.100"
      color="gray.700"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontWeight="bold"
      fontSize="sm"
      flexShrink={0}
    >
      {getInitials(name)}
    </Box>
  );
}
