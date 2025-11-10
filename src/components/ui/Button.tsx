import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { semanticColors, colors } from '../../styles/colors';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'primary-disabled' | 'secondary-disabled';
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  children,
  leftIcon,
  rightIcon,
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-dm-sans transition-all flex items-center justify-center gap-[10px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer h-[39px] px-6 py-[6px] rounded-[100px]';
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          className: 'font-bold text-sm',
          style: {
            backgroundColor: semanticColors.bgDark,
            color: semanticColors.textOnDark,
          },
          hoverStyle: {
            backgroundColor: colors.neutral[9], // Darker on hover
          },
        };
      case 'primary-disabled':
        return {
          className: 'font-bold text-sm',
          style: {
            backgroundColor: colors.neutral[9], // #454545
            color: semanticColors.textOnDark,
          },
          hoverStyle: {
            backgroundColor: colors.neutral[9],
          },
        };
      case 'secondary':
        return {
          className: 'font-regular text-sm',
          style: {
            backgroundColor: semanticColors.bgTertiary,
            color: semanticColors.textPrimary,
          },
          hoverStyle: {
            backgroundColor: colors.neutral[5], // Slightly darker on hover
          },
        };
      case 'secondary-disabled':
        return {
          className: 'font-regular text-sm',
          style: {
            backgroundColor: colors.neutral[6], // #BFBFBF
            color: semanticColors.textPrimary,
          },
          hoverStyle: {
            backgroundColor: colors.neutral[6],
          },
        };
      default:
        return {
          className: 'font-bold text-sm',
          style: {
            backgroundColor: semanticColors.bgDark,
            color: semanticColors.textOnDark,
          },
          hoverStyle: {
            backgroundColor: colors.neutral[9],
          },
        };
    }
  };

  const variantConfig = getVariantStyles();

  return (
    <button
      className={`${baseStyles} ${variantConfig.className} ${className}`}
      style={variantConfig.style}
      disabled={disabled || isLoading}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading && variantConfig.hoverStyle?.backgroundColor) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = variantConfig.hoverStyle.backgroundColor;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading && variantConfig.style.backgroundColor) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = variantConfig.style.backgroundColor;
        }
      }}
      {...props}
    >
      {leftIcon && <span className="flex items-center shrink-0">{leftIcon}</span>}
      {isLoading ? 'Memproses...' : children}
      {rightIcon && <span className="flex items-center shrink-0">{rightIcon}</span>}
    </button>
  );
}
