import { Button as ChakraButton, type ButtonProps } from '@chakra-ui/react';

interface CustomButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button = ({
  variant = 'primary',
  children,
  ...props
}: CustomButtonProps) => {
  const getVariantProps = () => {
    switch (variant) {
      case 'primary':
        return { colorScheme: 'blue', variant: 'solid' as const };
      case 'secondary':
        return { colorScheme: 'gray', variant: 'solid' as const };
      case 'outline':
        return { variant: 'outline' as const, colorScheme: 'blue' };
      default:
        return { colorScheme: 'blue', variant: 'solid' as const };
    }
  };

  return (
    <ChakraButton {...getVariantProps()} {...props}>
      {children}
    </ChakraButton>
  );
};

export default Button;
