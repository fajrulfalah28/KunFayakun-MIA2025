import type { ReactNode } from "react";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faSearch,
  faUser,
  faGear,
  faRightFromBracket,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";
import TextField from "../ui/TextField";
import LocationAutocomplete from "../ui/LocationAutocomplete";
import FilterDropdown from "../ui/FilterDropdown";
import FavoritesModal from "../ui/FavoritesModal";
import { useFavorites } from "../../contexts/FavoritesContext";
import { semanticColors, brandColors, colors } from "../../styles/colors";
import ShopIcon from "../icons/ShopIcon";
import DefaultProfileAvatar from "../icons/DefaultProfileAvatar";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase";

interface HeaderProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
  onNavigateToHome?: () => void;
  onNavigateToDetailKios?: (id: string) => void;
  favoritesCount?: number; // Deprecated - kept for backward compatibility
  onFavoritesClick?: () => void;
  // Profile picture (if provided, shows profile instead of login/signup buttons)
  userProfile?: {
    imageUrl?: string;
    name?: string;
    onClick?: () => void;
    onSettingsClick?: () => void;
    onLogoutClick?: () => void;
  };
  // Search fields (optional - for landing page)
  showSearch?: boolean;
  locationSearch?: string;
  onLocationSearchChange?: (value: string) => void;
  onLocationPlaceSelect?: (placeId: string, location: string) => void;
  umkmSearch?: string;
  onUmkmSearchChange?: (value: string) => void;
  timeFilter?: string;
  onTimeFilterChange?: (value: string) => void;
  priceFilter?: string;
  onPriceFilterChange?: (value: string) => void;
  // Fallback for custom center content
  centerContent?: ReactNode;
}

export default function Header({
  onNavigateToLogin,
  onNavigateToSignUp,
  onNavigateToHome,
  onNavigateToDetailKios,
  onFavoritesClick,
  userProfile,
  showSearch = false,
  locationSearch = "",
  onLocationSearchChange,
  onLocationPlaceSelect,
  umkmSearch = "",
  onUmkmSearchChange,
  timeFilter = "",
  onTimeFilterChange,
  priceFilter = "",
  onPriceFilterChange,
  centerContent,
}: HeaderProps) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const { favorites, removeFavorite } = useFavorites();

  const handleFavoritesClick = () => {
    setIsFavoritesModalOpen(true);
    onFavoritesClick?.();
  };

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data();
      setProfilePhoto(data?.photoURL || null);
    });

    return () => unsub();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Check profile dropdown
      if (isProfileDropdownOpen) {
        const mobileProfileDropdown = document.querySelector(
          "[data-mobile-profile-dropdown]"
        );
        const profileButton = document.querySelector("[data-profile-button]");

        // Don't close if clicking inside dropdown or on profile button
        if (mobileProfileDropdown && mobileProfileDropdown.contains(target)) {
          return;
        }
        if (profileButton && profileButton.contains(target)) {
          return;
        }
        setIsProfileDropdownOpen(false);
      }

      // Check if click is outside mobile menu AND not on hamburger button
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        if (
          hamburgerButtonRef.current &&
          !hamburgerButtonRef.current.contains(target)
        ) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    if (isProfileDropdownOpen || isMobileMenuOpen) {
      // Use 'click' event which fires after button clicks complete
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);

      return () => {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("touchend", handleClickOutside);
      };
    }
  }, [isProfileDropdownOpen, isMobileMenuOpen]);
  return (
    <header
      className="sticky top-0 z-50 py-4 sm:py-6 px-4 sm:px-6 lg:px-20"
      style={{ backgroundColor: colors.neutral[1] }}
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Mobile Header: Logo + Hamburger */}
        <div className="flex lg:hidden items-center justify-between w-full">
          <button
            onClick={() => onNavigateToHome?.()}
            className="flex items-center gap-[10px] cursor-pointer shrink-0"
          >
            <div className="w-7 h-7 flex items-center justify-center">
              <ShopIcon className="w-full h-full" />
            </div>
            <h1
              className="font-black text-2xl"
              style={{
                fontFamily: "'Nunito', sans-serif",
                color: semanticColors.textPrimary,
              }}
            >
              KiosKu
            </h1>
          </button>

          <div className="flex items-center gap-2">
            {/* Show Favorites & Profile if userProfile exists */}
            {userProfile && (
              <>
                {/* Favorites with Badge */}
                <div className="relative">
                  <button
                    className="flex items-center justify-center p-2 rounded-full w-[39px] h-[39px] cursor-pointer transition-colors"
                    style={{ backgroundColor: semanticColors.bgTertiary }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        colors.neutral[5])
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        semanticColors.bgTertiary)
                    }
                    onClick={handleFavoritesClick}
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="w-5 h-5"
                      style={{ color: brandColors.primary }}
                    />
                  </button>
                  <div
                    className="absolute top-0 right-0 flex items-center justify-center rounded-full min-w-[13px] h-[13px] px-1"
                    style={{ backgroundColor: semanticColors.bgDark }}
                  >
                    <span
                      className="font-dm-sans font-regular text-[8px]"
                      style={{ color: semanticColors.textOnDark }}
                    >
                      {favorites.length}
                    </span>
                  </div>
                </div>

                {/* Profile Picture */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    }}
                    data-profile-button
                    className="flex items-center justify-center rounded-full w-[39px] h-[39px] cursor-pointer transition-colors overflow-hidden"
                    style={{ backgroundColor: semanticColors.bgTertiary }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        colors.neutral[5])
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        semanticColors.bgTertiary)
                    }
                    aria-label={userProfile.name || "Profile"}
                  >
                    {isProfileDropdownOpen ? (
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="w-5 h-5"
                        style={{ color: semanticColors.textPrimary }}
                      />
                    ) : userProfile.imageUrl ? (
                      <img
                        src={userProfile.imageUrl}
                        alt={userProfile.name || "Profile"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faUser}
                        className="w-5 h-5"
                        style={{ color: semanticColors.textPrimary }}
                      />
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Favorites icon - Only show if no userProfile */}
            {!userProfile && (
              <button
                onClick={onNavigateToLogin}
                className="flex items-center justify-center p-2 rounded-full w-[39px] h-[39px] cursor-pointer transition-colors"
                style={{ backgroundColor: semanticColors.bgTertiary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.neutral[5])
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    semanticColors.bgTertiary)
                }
                aria-label="Lihat favorit"
                title="Lihat favorit"
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  className="w-5 h-5"
                  style={{ color: brandColors.primary }}
                />
              </button>
            )}

            {/* Masuk Button - Only show if no userProfile */}
            {!userProfile && (
              <Button
                variant="primary"
                onClick={onNavigateToLogin}
                className="shrink-0"
              >
                Masuk
              </Button>
            )}

            <button
              ref={hamburgerButtonRef}
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="flex items-center justify-center p-2 rounded-full w-[39px] h-[39px] cursor-pointer transition-colors"
              style={{ backgroundColor: semanticColors.bgTertiary }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = colors.neutral[5])
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  semanticColors.bgTertiary)
              }
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faTimes : faSearch}
                className="w-5 h-5"
                style={{ color: semanticColors.textPrimary }}
              />
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex flex-row items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => onNavigateToHome?.()}
            className="flex items-center gap-[10px] cursor-pointer shrink-0"
          >
            <div className="w-7 h-7 flex items-center justify-center">
              <ShopIcon className="w-full h-full" />
            </div>
            <h1
              className="font-black text-3xl"
              style={{
                fontFamily: "'Nunito', sans-serif",
                color: semanticColors.textPrimary,
              }}
            >
              KiosKu
            </h1>
          </button>

          {/* Center Content (Search Fields & Filter) - Optional */}
          {(showSearch || centerContent) && (
            <div className="flex items-center gap-4 flex-1 max-w-[692px]">
              {showSearch ? (
                <>
                  <LocationAutocomplete
                    placeholder="Masukkan Lokasi Anda "
                    value={locationSearch}
                    onChange={onLocationSearchChange}
                    onPlaceSelect={onLocationPlaceSelect}
                    className="flex-1"
                  />

                  <TextField
                    placeholder="Nyari UMKM apa nih?"
                    value={umkmSearch}
                    onChange={(e) => onUmkmSearchChange?.(e.target.value)}
                    leftIcon={
                      <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
                    }
                    className="flex-1"
                  />

                  {onTimeFilterChange && onPriceFilterChange && (
                    <FilterDropdown
                      label="Filter Pencarian"
                      timeFilter={timeFilter}
                      priceFilter={priceFilter}
                      onTimeFilterChange={onTimeFilterChange}
                      onPriceFilterChange={onPriceFilterChange}
                    />
                  )}
                </>
              ) : (
                centerContent
              )}
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Favorites with Badge - Only show if userProfile exists */}
            {userProfile && (
              <div className="relative">
                <button
                  className="flex items-center justify-center p-2 rounded-full w-[39px] h-[39px] cursor-pointer transition-colors"
                  style={{ backgroundColor: semanticColors.bgTertiary }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.neutral[5])
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      semanticColors.bgTertiary)
                  }
                  onClick={handleFavoritesClick}
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="w-5 h-5"
                    style={{ color: brandColors.primary }}
                  />
                </button>
                <div
                  className="absolute top-0 right-0 flex items-center justify-center rounded-full min-w-[13px] h-[13px] px-1"
                  style={{ backgroundColor: semanticColors.bgDark }}
                >
                  <span
                    className="font-dm-sans font-regular text-[8px]"
                    style={{ color: semanticColors.textOnDark }}
                  >
                    {favorites.length}
                  </span>
                </div>
              </div>
            )}

            {/* Profile Picture or Login/Signup Buttons */}
            {userProfile ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    userProfile.onClick?.();
                  }}
                  className="flex items-center justify-center rounded-full w-[39px] h-[39px] cursor-pointer transition-colors overflow-hidden"
                  style={{ backgroundColor: semanticColors.bgTertiary }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.neutral[5])
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      semanticColors.bgTertiary)
                  }
                  aria-label={userProfile.name || "Profile"}
                >
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <DefaultProfileAvatar size={40} />
                  )}
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div
                    className="hidden lg:block absolute top-full right-0 mt-2 w-[200px] rounded-[12px] p-2 z-50 shadow-lg"
                    style={{ backgroundColor: semanticColors.bgPrimary }}
                  >
                    <div className="flex flex-col gap-1">
                      {/* Settings */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          userProfile.onSettingsClick?.();
                          setIsProfileDropdownOpen(false);
                        }}
                        onTouchEnd={(e) => {
                          e.stopPropagation();
                          userProfile.onSettingsClick?.();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-[8px] cursor-pointer transition-colors w-full text-left"
                        style={{ color: semanticColors.textPrimary }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            semanticColors.bgSecondary)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <FontAwesomeIcon
                          icon={faGear}
                          className="w-4 h-4"
                          style={{ color: semanticColors.textPrimary }}
                        />
                        <span className="font-dm-sans font-regular text-sm">
                          Pengaturan
                        </span>
                      </button>

                      {/* Logout */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          userProfile.onLogoutClick?.();
                          setIsProfileDropdownOpen(false);
                        }}
                        onTouchEnd={(e) => {
                          e.stopPropagation();
                          userProfile.onLogoutClick?.();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-[8px] cursor-pointer transition-colors w-full text-left"
                        style={{ color: semanticColors.textPrimary }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            semanticColors.bgSecondary)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <FontAwesomeIcon
                          icon={faRightFromBracket}
                          className="w-4 h-4"
                          style={{ color: semanticColors.textPrimary }}
                        />
                        <span className="font-dm-sans font-regular text-sm">
                          Keluar
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Favorites icon - Only show if no userProfile */}
                {!userProfile && (
                  <button
                    onClick={onNavigateToLogin}
                    className="flex items-center justify-center p-2 rounded-full w-[39px] h-[39px] cursor-pointer transition-colors"
                    style={{ backgroundColor: semanticColors.bgTertiary }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        colors.neutral[5])
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        semanticColors.bgTertiary)
                    }
                    aria-label="Lihat favorit"
                    title="Lihat favorit"
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="w-5 h-5"
                      style={{ color: brandColors.primary }}
                    />
                  </button>
                )}

                <Button variant="secondary" onClick={onNavigateToLogin}>
                  Masuk
                </Button>

                <Button variant="primary" onClick={onNavigateToSignUp}>
                  Daftar
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden flex flex-col gap-6 pt-4"
          >
            {/* Search Fields */}
            {showSearch && (
              <div className="flex flex-col gap-3">
                <LocationAutocomplete
                  placeholder="Masukkan Lokasi Anda "
                  value={locationSearch}
                  onChange={onLocationSearchChange}
                  onPlaceSelect={onLocationPlaceSelect}
                  className="w-full"
                />

                <TextField
                  placeholder="Nyari UMKM apa nih?"
                  value={umkmSearch}
                  onChange={(e) => onUmkmSearchChange?.(e.target.value)}
                  leftIcon={
                    <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
                  }
                  className="w-full"
                />

                {onTimeFilterChange && onPriceFilterChange && (
                  <FilterDropdown
                    label="Filter Pencarian"
                    timeFilter={timeFilter}
                    priceFilter={priceFilter}
                    onTimeFilterChange={onTimeFilterChange}
                    onPriceFilterChange={onPriceFilterChange}
                    className="w-full"
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Profile Dropdown */}
        {isProfileDropdownOpen && userProfile && (
          <div
            ref={profileDropdownRef}
            data-mobile-profile-dropdown
            className="lg:hidden flex flex-col gap-4 pt-4"
          >
            {/* Settings */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                userProfile.onSettingsClick?.();
                setIsProfileDropdownOpen(false);
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                userProfile.onSettingsClick?.();
                setIsProfileDropdownOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-[8px] cursor-pointer transition-colors w-full text-left"
              style={{
                color: semanticColors.textPrimary,
                backgroundColor: semanticColors.bgTertiary,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  semanticColors.bgSecondary)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  semanticColors.bgTertiary)
              }
            >
              <FontAwesomeIcon
                icon={faGear}
                className="w-5 h-5"
                style={{ color: semanticColors.textPrimary }}
              />
              <span className="font-dm-sans font-regular text-sm">
                Pengaturan
              </span>
            </button>

            {/* Logout */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                userProfile.onLogoutClick?.();
                setIsProfileDropdownOpen(false);
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                userProfile.onLogoutClick?.();
                setIsProfileDropdownOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-[8px] cursor-pointer transition-colors w-full text-left"
              style={{
                color: semanticColors.textPrimary,
                backgroundColor: semanticColors.bgTertiary,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  semanticColors.bgSecondary)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  semanticColors.bgTertiary)
              }
            >
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="w-5 h-5"
                style={{ color: semanticColors.textPrimary }}
              />
              <span className="font-dm-sans font-regular text-sm">Keluar</span>
            </button>
          </div>
        )}
      </div>

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        favorites={favorites}
        onRemoveFavorite={removeFavorite}
        onNavigateToDetailKios={onNavigateToDetailKios}
      />
    </header>
  );
}
