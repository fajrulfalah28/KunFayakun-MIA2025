import type { ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react';
import { useRef } from 'react';
import { semanticColors } from '../../styles/colors';

interface ChipSelectorProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  isSelected?: boolean;
  iconColor?: string;
}

export default function ChipSelector({
  children,
  icon,
  isSelected = false,
  iconColor,
  className = '',
  onClick,
  ...props
}: ChipSelectorProps) {
  const baseStyles = 'font-dm-sans font-regular text-sm transition-all flex items-center justify-center gap-[10px] px-3 py-2 rounded-[12px] cursor-pointer';
  const isDraggingRef = useRef(false);
  
  const getStyles = () => {
    if (isSelected) {
      return {
        style: {
          backgroundColor: semanticColors.bgPrimary,
          color: semanticColors.textPrimary,
          border: `0.5px solid ${semanticColors.textPrimary}`,
        },
        hoverStyle: {
          backgroundColor: semanticColors.bgSecondary,
        },
      };
    }
    
    return {
      style: {
        backgroundColor: semanticColors.bgPrimary,
        color: semanticColors.textPrimary,
        border: `0.5px solid ${semanticColors.borderMedium}`,
      },
      hoverStyle: {
        backgroundColor: semanticColors.bgSecondary,
      },
    };
  };

  const styleConfig = getStyles();
  const customStyle = (props as { style?: CSSProperties })?.style || {};

  return (
    <button
      className={`${baseStyles} whitespace-nowrap ${className}`}
      style={{ ...styleConfig.style, userSelect: 'none', ...customStyle }}
      onMouseDown={(e) => {
        // Allow dragging to scroll parent container
        const container = e.currentTarget.closest('[data-scrollable-container="true"]') as HTMLElement || 
                         e.currentTarget.closest('[style*="overflow-x-auto"]') as HTMLElement;
        if (!container) return;
        
        const startX = e.pageX;
        const startY = e.pageY;
        const startScroll = container.scrollLeft;
        isDraggingRef.current = false;
        let lastX = startX;
        let velocity = 0;
        let lastTime = Date.now();
        
        const onMouseMove = (e: MouseEvent) => {
          const currentTime = Date.now();
          const timeDelta = Math.max(currentTime - lastTime, 1);
          const diffX = e.pageX - startX;
          const diffY = e.pageY - startY;
          const currentVelocity = (e.pageX - lastX) / timeDelta;
          
          // Only consider it dragging if horizontal movement is greater than vertical
          // and movement is more than 5px
          if (Math.abs(diffX) > 5 && Math.abs(diffX) > Math.abs(diffY)) {
            isDraggingRef.current = true;
            velocity = currentVelocity * 0.3 + velocity * 0.7; // Smooth velocity with exponential moving average
            lastX = e.pageX;
            lastTime = currentTime;
            
            // Scroll the container - drag left scrolls right, drag right scrolls left
            const scrollDiff = startX - e.pageX;
            container.scrollLeft = startScroll + scrollDiff;
            
            e.preventDefault();
            e.stopPropagation();
          }
        };
        
        const onMouseUp = (e: MouseEvent) => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          
          // Add momentum scrolling if dragging
          if (isDraggingRef.current && Math.abs(velocity) > 0.1) {
            const currentScroll = container.scrollLeft;
            const momentum = velocity * 20; // Momentum multiplier
            const targetScroll = currentScroll - momentum;
            const momentumStartScroll = currentScroll;
            const distance = targetScroll - momentumStartScroll;
            const duration = 400; // ms
            const startTime = Date.now();
            
            const easeOut = (t: number) => {
              return 1 - Math.pow(1 - t, 3); // Cubic ease-out
            };
            
            const animateMomentum = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = easeOut(progress);
              
              const scrollPos = momentumStartScroll + distance * eased;
              container.scrollLeft = scrollPos;
              
              if (progress < 1) {
                requestAnimationFrame(animateMomentum);
              }
            };
            
            requestAnimationFrame(animateMomentum);
          }
          
          // Prevent click if we dragged
          if (isDraggingRef.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        };
        
        // Stop propagation so container handler doesn't interfere
        e.stopPropagation();
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp, { once: true });
      }}
      onClick={(e) => {
        // Prevent click if we were dragging
        if (isDraggingRef.current) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        onClick?.(e);
      }}
      onMouseEnter={(e) => {
        if (styleConfig.hoverStyle?.backgroundColor) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = styleConfig.hoverStyle.backgroundColor;
        }
      }}
      onMouseLeave={(e) => {
        if (styleConfig.style.backgroundColor) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = styleConfig.style.backgroundColor;
        }
      }}
      {...props}
    >
      {icon && (
        <span className="flex items-center shrink-0 w-5 h-5" style={{ color: iconColor || semanticColors.textPrimary }}>
          {icon}
        </span>
      )}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
}

