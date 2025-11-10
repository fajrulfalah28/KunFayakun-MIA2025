interface CheckBadgeIconProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

export default function CheckBadgeIcon({ 
  width = 12, 
  height = 12, 
  className = '',
  color = '#000000'
}: CheckBadgeIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 0.75C3.105 0.75 0.75 3.105 0.75 6C0.75 8.895 3.105 11.25 6 11.25C8.895 11.25 11.25 8.895 11.25 6C11.25 3.105 8.895 0.75 6 0.75ZM8.355 4.98L5.52 7.815C5.445 7.89 5.34 7.935 5.235 7.935C5.13 7.935 5.025 7.89 4.95 7.815L3.645 6.51C3.495 6.36 3.495 6.12 3.645 5.97C3.795 5.82 4.035 5.82 4.185 5.97L5.235 7.02L7.815 4.44C7.965 4.29 8.205 4.29 8.355 4.44C8.505 4.59 8.505 4.83 8.355 4.98Z"
        fill={color}
      />
    </svg>
  );
}

