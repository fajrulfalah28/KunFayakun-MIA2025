interface SocialIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function GoFoodIcon({ className = "", width = 20, height = 20 }: SocialIconProps) {
  return (
    <img
      src={new URL('./GoFood.svg', import.meta.url).href}
      alt="GoFood"
      width={width}
      height={height}
      className={className}
    />
  );
}

