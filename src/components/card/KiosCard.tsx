import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faMugHot,
  faCookie,
  faBowlRice,
  faIceCream,
  faPepperHot,
  faPizzaSlice,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { semanticColors, brandColors, colors } from "../../styles/colors";
import HalalIcon from "../icons/HalalIcon";
import CheckBadgeIcon from "../icons/CheckBadgeIcon";

// Category mapping for icons and colors
// const categoryMap: Record<
//   string,
//   { icon: typeof faUtensils | null; iconColor: string }
// > = {
//   Makanan: { icon: faUtensils, iconColor: "#FF6B35" },
//   Minuman: { icon: faMugHot, iconColor: "#4A90E2" },
//   Cemilan: { icon: faCookie, iconColor: "#D2691E" },
//   Kopi: { icon: faMugHot, iconColor: "#6F4E37" },
//   Nusantara: { icon: faBowlRice, iconColor: semanticColors.textPrimary },
//   Dessert: { icon: faIceCream, iconColor: "#FF69B4" },
//   Diet: { icon: faLeaf, iconColor: "#90EE90" },
//   Pedas: { icon: faPepperHot, iconColor: "#FF4500" },
// };

const detectCategory = (
  categories: string
): { name: string; icon: IconDefinition; color: string }[] => {
  const text = categories.toLowerCase();

  const result: { name: string; icon: IconDefinition; color: string }[] = [];

  const mapping = [
    {
      name: "Makanan",
      keywords: ["ayam", "bakso", "mie", "nasi", "geprek", "goreng"],
      icon: faUtensils,
      color: "#FF6B35",
    },
    {
      name: "Minuman",
      keywords: ["teh", "kopi", "milk", "susu", "drink", "jus", "kafe"],
      icon: faMugHot,
      color: "#4A90E2",
    },
    {
      name: "Cemilan",
      keywords: ["snack", "cemilan", "kue", "jajanan"],
      icon: faCookie,
      color: "#D2691E",
    },
    { name: "Kopi", keywords: ["kopi"], icon: faMugHot, color: "#6F4E37" },
    {
      name: "Nusantara",
      keywords: ["sate", "rawon", "soto", "pecel", "lalapan"],
      icon: faBowlRice,
      color: semanticColors.textPrimary,
    },
    {
      name: "Dessert",
      keywords: ["dessert", "es krim", "ice cream", "puding", "snack"],
      icon: faIceCream,
      color: "#FF69B4",
    },
    {
      name: "Pizza",
      keywords: ["pizza"],
      icon: faPizzaSlice,
      color: "#90EE90",
    },
    {
      name: "Seafood",
      keywords: ["ikan", "udang", "cumi", "seafood"],
      icon: faPepperHot,
      color: "#FF4500",
    },
  ];

  mapping.forEach((m) => {
    if (m.keywords.some((k) => text.includes(k))) {
      result.push(m);
    }
  });

  return result.slice(0, 2);
};

interface KiosCardProps {
  image: string;
  name: string;
  categories: string;
  description?: string;
  location: string;
  rating: number;
  operatingHours: string;
  isPilihanKami?: boolean;
  isHalal?: boolean;
  onClick?: () => void;
  awningColor?: "yellow" | "red";
  price?: number;
}

export default function KiosCard({
  image,
  name,
  categories,
  description,
  location,
  rating,
  operatingHours,
  isPilihanKami = false,
  isHalal = false,
  onClick,
  awningColor = "red",
  price,
}: KiosCardProps) {
  const awningColorFinal =
    awningColor === "yellow"
      ? colors.secondary[400] // kuning
      : brandColors.primary; // merah
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const totalStripes = isMobile ? 19 : isTablet ? 17 : 15;

  return (
    <div
      className="group rounded-[12px] w-full cursor-pointer transition-all"
      style={{ backgroundColor: semanticColors.bgPrimary }}
      onClick={onClick}
    >
      {/* Image with Striped Awning Overlay */}
      <div className="relative h-[193px] rounded-t-[12px] overflow-hidden">
        {/* Background Image */}
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Striped Awning Overlay - Shrinks on hover */}
        <div className="absolute top-0 left-0 right-0 flex h-[20%] group-hover:h-[15%] transition-all duration-300">
          {/* Generate responsive stripes: 8 on mobile, 15 on desktop */}
          {[...Array(totalStripes)].map((_, i) => {
            return (
              <div
                key={i}
                className={`flex-1 h-full rounded-b-[12px] ${
                  i === 0 ? "rounded-tl-[12px]" : ""
                } ${i === totalStripes - 1 ? "rounded-tr-[12px]" : ""}`}
                style={{
                  backgroundColor:
                    i % 2 === 0 ? awningColorFinal : brandColors.white,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 flex flex-col gap-2">
        {/* Categories/Tags - Above Title */}
        <div className="flex gap-[6px] items-center overflow-hidden">
          {isPilihanKami && (
            <div className="flex items-center gap-1 shrink-0">
              <CheckBadgeIcon
                width={12}
                height={12}
                color={colors.secondary[400]}
              />
              <span
                className="font-dm-sans font-regular text-xs whitespace-nowrap"
                style={{ color: semanticColors.textPrimary }}
              >
                Pilihan Kami
              </span>
            </div>
          )}

          {isHalal && (
            <div className="flex items-center gap-1 shrink-0">
              <HalalIcon width={12} height={12} />
              <span
                className="font-dm-sans font-regular text-xs whitespace-nowrap"
                style={{ color: semanticColors.textPrimary }}
              >
                Halal
              </span>
            </div>
          )}

          {/* Category Tags */}
          {detectCategory(categories).map((c, index) => (
            <div key={index} className="flex items-center gap-1 shrink-0">
              <FontAwesomeIcon
                icon={c.icon}
                className="w-3 h-3"
                style={{
                  color: c.color,
                  width: "12px",
                  height: "12px",
                }}
              />
              <span
                className="font-dm-sans font-regular text-xs whitespace-nowrap"
                style={{ color: semanticColors.textPrimary }}
              >
                {c.name}
              </span>
            </div>
          ))}
        </div>

        {/* Shop Name and Description */}
        <div className="flex flex-col gap-0">
          <h3
            className="font-dm-sans font-bold text-lg line-clamp-1"
            style={{ color: semanticColors.textPrimary }}
          >
            {name}
          </h3>
          {description && (
            <p
              className="font-dm-sans font-regular text-xs line-clamp-1"
              style={{ color: semanticColors.textSecondary }}
            >
              {description}
            </p>
          )}
        </div>

        {price !== undefined && price > 0 && (
          <p
            className="font-dm-sans font-bold text-sm"
            style={{ color: brandColors.secondary }}
          >
            Rp {price.toLocaleString("id-ID")}
          </p>
        )}

        {/* Location, Rating, Operating Hours */}
        <div className="flex items-center gap-[6px] text-xs">
          {/* Location */}
          <div className="flex items-center gap-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 1.5C4.205 1.5 2.75 2.955 2.75 4.75C2.75 7.125 6 10.5 6 10.5C6 10.5 9.25 7.125 9.25 4.75C9.25 2.955 7.795 1.5 6 1.5ZM6 6C5.31 6 4.75 5.44 4.75 4.75C4.75 4.06 5.31 3.5 6 3.5C6.69 3.5 7.25 4.06 7.25 4.75C7.25 5.44 6.69 6 6 6Z"
                fill={semanticColors.bgDark}
              />
            </svg>
            <span
              className="font-dm-sans font-regular"
              style={{ color: semanticColors.bgDark }}
            >
              {location}
            </span>
          </div>

          <span style={{ color: semanticColors.bgDark }}>|</span>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 1.5L7.545 4.635L11 5.13L8.5 7.56L9.09 11L6 9.375L2.91 11L3.5 7.56L1 5.13L4.455 4.635L6 1.5Z"
                fill={brandColors.secondary}
                stroke={brandColors.secondary}
                strokeWidth="0.5"
              />
            </svg>
            <span
              className="font-dm-sans font-regular"
              style={{ color: semanticColors.bgDark }}
            >
              {rating.toFixed(1)}
            </span>
          </div>

          <span style={{ color: semanticColors.bgDark }}>|</span>

          {/* Operating Hours */}
          <div className="flex items-center gap-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 1.5C3.515 1.5 1.5 3.515 1.5 6C1.5 8.485 3.515 10.5 6 10.5C8.485 10.5 10.5 8.485 10.5 6C10.5 3.515 8.485 1.5 6 1.5ZM7.75 6.75H6C5.86 6.75 5.75 6.64 5.75 6.5V3.5C5.75 3.36 5.86 3.25 6 3.25C6.14 3.25 6.25 3.36 6.25 3.5V6.25H7.75C7.89 6.25 8 6.36 8 6.5C8 6.64 7.89 6.75 7.75 6.75Z"
                fill={semanticColors.bgDark}
              />
            </svg>
            <span
              className="font-dm-sans font-regular whitespace-nowrap"
              style={{ color: semanticColors.bgDark }}
            >
              {operatingHours}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
