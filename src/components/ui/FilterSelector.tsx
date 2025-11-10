import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { semanticColors, brandColors, colors } from '../../styles/colors';

interface FilterSelectorProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'active' | 'dark';
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function FilterSelector({
  variant = 'default',
  children,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: FilterSelectorProps) {
  const baseStyles = 'font-dm-sans font-regular text-sm transition-all flex items-center justify-center gap-[10px] px-3 py-2 rounded-[12px] cursor-pointer';
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'active':
        return {
          style: {
            backgroundColor: semanticColors.bgPrimary,
            color: semanticColors.textPrimary,
            border: `2px solid ${brandColors.primary}`,
          },
          hoverStyle: {
            backgroundColor: semanticColors.bgSecondary,
          },
        };
      case 'dark':
        return {
          style: {
            backgroundColor: semanticColors.bgDark,
            color: semanticColors.textOnDark,
            border: 'none',
          },
          hoverStyle: {
            backgroundColor: colors.neutral[9],
          },
        };
      default: // 'default'
        return {
          style: {
            backgroundColor: semanticColors.bgPrimary,
            color: semanticColors.textPrimary,
            border: 'none',
          },
          hoverStyle: {
            backgroundColor: semanticColors.bgSecondary,
          },
        };
    }
  };

  const variantConfig = getVariantStyles();

  return (
    <button
      className={`${baseStyles} ${className}`}
      style={variantConfig.style}
      onMouseEnter={(e) => {
        if (variantConfig.hoverStyle?.backgroundColor) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = variantConfig.hoverStyle.backgroundColor;
        }
      }}
      onMouseLeave={(e) => {
        if (variantConfig.style.backgroundColor) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = variantConfig.style.backgroundColor as string;
        }
      }}
      {...props}
    >
      {leftIcon && <span className="flex items-center shrink-0 size-[16.667px]">{leftIcon}</span>}
      <span className="whitespace-nowrap">{children}</span>
      {rightIcon && <span className="flex items-center shrink-0 size-[16.667px]">{rightIcon}</span>}
    </button>
  );
}

