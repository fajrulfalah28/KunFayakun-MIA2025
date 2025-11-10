import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes, ReactNode, ChangeEvent } from 'react';
import { semanticColors } from '../../styles/colors';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ leftIcon, rightIcon, className = '', onChange, value, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState('');
    
    // Use controlled value if provided, otherwise use internal state
    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = currentValue !== null && currentValue !== undefined && String(currentValue).length > 0;
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    // Determine width class based on className
    const getWidthClass = () => {
      if (className.includes('w-full')) return 'w-full';
      if (className.includes('flex-1')) return 'flex-1';
      return 'w-[296px]';
    };

    return (
      <div
        className={`flex items-center gap-[10px] h-[39px] px-3 py-[6px] rounded-[12px] ${getWidthClass()}`}
        style={{ backgroundColor: semanticColors.bgTertiary }}
      >
        {leftIcon && (
          <div
            className="flex items-center shrink-0 size-[16.667px]"
            style={{ color: hasValue ? semanticColors.bgDark : semanticColors.textSecondary }}
          >
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          value={currentValue}
          onChange={handleChange}
          className={`flex-1 bg-transparent font-dm-sans font-regular text-sm border-0 outline-0 focus:outline-none focus:ring-0 ${className}`}
          style={{
            color: hasValue ? semanticColors.bgDark : semanticColors.textSecondary,
          }}
          {...props}
        />
        
        {rightIcon && (
          <div
            className="flex items-center shrink-0 size-[16.667px]"
            style={{ color: hasValue ? semanticColors.bgDark : semanticColors.textSecondary }}
          >
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;

