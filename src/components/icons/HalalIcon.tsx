interface HalalIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function HalalIcon({ className = "", width = 12, height = 12 }: HalalIconProps) {
  return (
    <img
      src={new URL('./Halal.svg', import.meta.url).href}
      alt="Halal"
      width={width}
      height={height}
      className={className}
    />
  );
}

