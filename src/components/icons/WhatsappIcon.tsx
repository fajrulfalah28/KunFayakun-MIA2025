interface SocialIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function WhatsappIcon({ className = "", width = 20, height = 20 }: SocialIconProps) {
  return (
    <img
      src={new URL('./Whatsapp.svg', import.meta.url).href}
      alt="WhatsApp"
      width={width}
      height={height}
      className={className}
    />
  );
}

