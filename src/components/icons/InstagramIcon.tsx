interface SocialIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function InstagramIcon({ className = "", width = 20, height = 20 }: SocialIconProps) {
  return (
    <img
      src={new URL('./Instagram.svg', import.meta.url).href}
      alt="Instagram"
      width={width}
      height={height}
      className={className}
    />
  );
}

