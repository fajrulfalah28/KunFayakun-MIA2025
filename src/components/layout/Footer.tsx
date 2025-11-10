import { colors } from '../../styles/colors';
import ShopIcon from '../icons/ShopIcon';

interface FooterProps {
  copyrightText?: string;
}

export default function Footer({ 
  copyrightText = '© 2025 Team KunFayakun. All rights reserved.' 
}: FooterProps) {
  return (
    <footer 
      className="py-6 px-4 sm:px-6 lg:px-20 mt-8"
      style={{ backgroundColor: colors.neutral[13] }}
    >
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-[10px] shrink-0">
          <div className="w-7 h-7 flex items-center justify-center">
            <ShopIcon className="w-full h-full" />
          </div>
          <h2
            className="font-black text-2xl sm:text-3xl"
            style={{ fontFamily: "'Nunito', sans-serif", color: colors.neutral[1] }}
          >
            KiosKu
          </h2>
        </div>

        {/* Copyright */}
        <p
          className="font-dm-sans font-regular text-xs sm:text-sm text-center sm:text-left"
          style={{ color: colors.neutral[1] }}
        >
          {copyrightText}
        </p>
      </div>
    </footer>
  );
}

