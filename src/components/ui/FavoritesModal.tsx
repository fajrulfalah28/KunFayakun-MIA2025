import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { semanticColors, colors } from '../../styles/colors';

export interface FavoriteProduct {
  id: string;
  productName: string;
  kiosName: string;
  image: string;
}

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteProduct[];
  onRemoveFavorite: (id: string) => void;
  onNavigateToDetailKios?: () => void;
}

export default function FavoritesModal({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onNavigateToDetailKios,
}: FavoritesModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="w-full max-w-[600px] max-h-[80vh] rounded-[12px] flex flex-col"
        style={{ backgroundColor: semanticColors.bgPrimary }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b" style={{ borderColor: colors.neutral[6] }}>
          <h2
            className="font-black text-xl sm:text-2xl"
            style={{ fontFamily: "'Nunito', sans-serif", color: semanticColors.textPrimary }}
          >
            Favorit Saya
          </h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-colors shrink-0"
            style={{ backgroundColor: semanticColors.bgTertiary }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.neutral[5]}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = semanticColors.bgTertiary}
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" style={{ color: semanticColors.textPrimary }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="font-dm-sans font-regular text-sm" style={{ color: semanticColors.textSecondary }}>
                Belum ada produk favorit
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:gap-4">
              {favorites.map((favorite) => {
                const handleItemClick = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  // Don't navigate if clicking on the delete button
                  const target = e.target as HTMLElement;
                  if (target.closest('button')) {
                    return;
                  }
                  if (onNavigateToDetailKios) {
                    console.log('Navigating to DetailKiosPage');
                    onNavigateToDetailKios();
                    onClose();
                  } else {
                    console.warn('onNavigateToDetailKios is undefined in FavoritesModal');
                  }
                };

                return (
                  <div
                    key={favorite.id}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-[12px] transition-colors cursor-pointer"
                    style={{ backgroundColor: semanticColors.bgSecondary }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.neutral[4]}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = semanticColors.bgSecondary}
                    onClick={handleItemClick}
                  >
                    {/* Product Image */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[8px] overflow-hidden shrink-0">
                      <img
                        src={favorite.image}
                        alt={favorite.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-dm-sans font-bold text-sm sm:text-base truncate"
                        style={{ color: semanticColors.textPrimary }}
                      >
                        {favorite.productName}
                      </h3>
                      <p
                        className="font-dm-sans font-regular text-xs sm:text-sm truncate"
                        style={{ color: semanticColors.textSecondary }}
                      >
                        {favorite.kiosName}
                      </p>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(favorite.id);
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-colors shrink-0"
                      style={{ backgroundColor: semanticColors.bgTertiary }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.neutral[5]}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = semanticColors.bgTertiary}
                    >
                      <FontAwesomeIcon icon={faTimes} className="w-4 h-4" style={{ color: semanticColors.textPrimary }} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

