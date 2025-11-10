interface SocialIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function ShopeeFoodIcon({ className = "", width = 20, height = 20 }: SocialIconProps) {
  return (
    <img
      src={new URL('./Shopee Food.svg', import.meta.url).href}
      alt="Shopee Food"
      width={width}
      height={height}
      className={className}
    />
  );
}

