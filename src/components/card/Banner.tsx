import { useState, useEffect } from 'react';
import { semanticColors, brandColors } from '../../styles/colors';
import Button from '../ui/Button';
import CheckBadgeIcon from '../icons/CheckBadgeIcon';

interface BannerProps {
  image: string;
  title: string;
  description: string;
  isPilihanKami?: boolean;
  onViewClick?: () => void;
}

export default function Banner({
  image,
  title,
  description,
  isPilihanKami = false,
  onViewClick,
}: BannerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const totalStripes = isMobile ? 17 : isTablet ? 25 : 51;
  return (
    <div className="relative w-full h-[300px] sm:h-[300px] lg:h-[400px] rounded-[12px] overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 100%)',
          }}
        />
      </div>

      {/* Striped Awning Top - Responsive stripe count */}
      <div className="absolute top-0 left-0 right-0 h-[57px] flex">
        {/* Generate responsive stripes: 15 on mobile, 51 on desktop */}
        {[...Array(totalStripes)].map((_, i) => {
          return (
            <div
              key={i}
              className={`flex-1 h-full rounded-b-[12px] ${i === 0 ? 'rounded-tl-[12px]' : ''} ${i === totalStripes - 1 ? 'rounded-tr-[12px]' : ''}`}
              style={{
                backgroundColor: i % 2 === 0 ? brandColors.primary : brandColors.white,
              }}
            />
          );
        })}
      </div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 lg:p-8">
        {/* Bottom Content */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-8">
          {/* Text Content */}
          <div className="flex flex-col flex-1 max-w-[1035px]">
            {/* Pilihan Kami Badge */}
            {isPilihanKami && (
              <div
                className="inline-flex items-center gap-2 px-3 py-[6px] rounded-[100px] self-start mb-2"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              >
                <CheckBadgeIcon width={14} height={14} color={brandColors.white} />
                <span
                  className="font-dm-sans font-regular text-xs sm:text-sm"
                  style={{ color: brandColors.white }}
                >
                  Pilihan Kami
                </span>
              </div>
            )}

            {/* Title - Nunito Black 60px */}
            <h1
              className="font-black text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight sm:leading-normal"
              style={{ 
                fontFamily: "'Nunito', sans-serif",
                color: brandColors.white 
              }}
            >
              {title}
            </h1>
            
            {/* Description */}
            <p
              className="font-dm-sans font-regular text-xs sm:text-sm leading-normal mt-2"
              style={{ color: brandColors.white }}
            >
              {description}
            </p>
          </div>

          {/* View Button */}
          <Button
            variant="secondary"
            onClick={onViewClick}
            rightIcon={
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.375 12.75L10.625 8.5L6.375 4.25"
                  stroke={semanticColors.textPrimary}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
            className="shrink-0 w-full sm:w-auto"
          >
            Lihat
          </Button>
        </div>
      </div>
    </div>
  );
}

