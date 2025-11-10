import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { semanticColors } from '../../styles/colors';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        {label && (
          <label
            className="font-dm-sans font-bold text-sm mb-1"
            style={{ color: semanticColors.textPrimary }}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <div
            className="rounded-[12px] flex items-center gap-[10px] h-[39px] px-3 py-[6px] w-full"
            style={{ backgroundColor: semanticColors.bgTertiary }}
          >
            {leftIcon && (
              <div
                className="flex items-center shrink-0"
                style={{ color: semanticColors.bgDark }}
              >
                {leftIcon}
              </div>
            )}
            
            <input
              ref={ref}
              className={`
                flex-1 bg-transparent
                font-dm-sans font-regular text-sm
                border-0 outline-0
                focus:outline-none focus:ring-0
                ${className}
              `}
              style={{
                color: semanticColors.textPrimary,
              }}
              {...props}
            />
            
            {rightIcon && (
              <div
                className="flex items-center shrink-0"
                style={{ color: semanticColors.bgDark }}
              >
                {rightIcon}
              </div>
            )}
          </div>
          
          {error && (
            <p
              className="font-dm-sans font-regular text-xs text-right absolute top-full right-0 mt-1"
              style={{ color: semanticColors.error }}
            >
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

