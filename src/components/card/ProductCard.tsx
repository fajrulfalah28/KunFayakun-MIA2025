import { useState, useEffect } from 'react';
import { semanticColors, brandColors, colors } from '../../styles/colors';
import { useFavorites } from '../../contexts/FavoritesContext';
import type { FavoriteProduct } from '../ui/FavoritesModal';

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  price: number;
  kiosName: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (isFavorite: boolean) => void;
}

export default function ProductCard({
  id,
  image,
  name,
  price,
  kiosName,
  isFavorite: externalIsFavorite,
  onFavoriteToggle,
}: ProductCardProps) {
  const { addFavorite, removeFavorite, isFavorite: checkIsFavorite } = useFavorites();
  const [favorite, setFavorite] = useState(() => externalIsFavorite ?? checkIsFavorite(id));

  useEffect(() => {
    setFavorite(checkIsFavorite(id));
  }, [id, checkIsFavorite]);

  const handleFavoriteClick = () => {
    const newFavoriteState = !favorite;
    setFavorite(newFavoriteState);
    
    if (newFavoriteState) {
      const favoriteProduct: FavoriteProduct = {
        id,
        productName: name,
        kiosName,
        image,
      };
      addFavorite(favoriteProduct);
    } else {
      removeFavorite(id);
    }
    
    onFavoriteToggle?.(newFavoriteState);
  };

  // Format price to Indonesian Rupiah format
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('IDR', 'Rp');
  };

  return (
    <div
      className="rounded-[12px] w-full"
      style={{ backgroundColor: semanticColors.bgPrimary }}
    >
      {/* Product Image with Favorite Button */}
      <div className="relative h-[193px] rounded-[12px] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Favorite Button - Top Right */}
        <div className="absolute top-3 right-3">
          <button
            onClick={handleFavoriteClick}
            className="rounded-full p-[10px] transition-colors cursor-pointer"
            style={{ 
              backgroundColor: semanticColors.bgPrimary,
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = semanticColors.bgSecondary}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = semanticColors.bgPrimary}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.5 15.5833C8.36667 15.5833 8.24167 15.5583 8.125 15.5083C7.99167 15.4583 7.88333 15.3833 7.8 15.2833C5.46667 13.15 3.68333 11.375 2.45 9.95833C1.21667 8.54167 0.6 7.23333 0.6 6.03333C0.6 4.83333 1 3.83333 1.8 3.03333C2.6 2.23333 3.6 1.83333 4.8 1.83333C5.6 1.83333 6.33333 2.02917 6.99999 2.42083C7.66666 2.8125 8.16667 3.31667 8.5 3.93333C8.83333 3.31667 9.33333 2.8125 9.99999 2.42083C10.6667 2.02917 11.4 1.83333 12.2 1.83333C13.4 1.83333 14.4 2.23333 15.2 3.03333C16 3.83333 16.4 4.83333 16.4 6.03333C16.4 7.23333 15.7833 8.54167 14.55 9.95833C13.3167 11.375 11.5333 13.15 9.2 15.2833C9.11667 15.3833 9.00833 15.4583 8.875 15.5083C8.75833 15.5583 8.63333 15.5833 8.5 15.5833Z"
                fill={favorite ? brandColors.primary : colors.neutral[7]}
                stroke={favorite ? brandColors.primary : colors.neutral[7]}
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          {/* Product Name */}
          <h3
            className="font-dm-sans font-bold text-lg line-clamp-2"
            style={{ color: semanticColors.textPrimary }}
          >
            {name}
          </h3>
          
          {/* Product Price */}
          <p
            className="font-dm-sans font-regular text-xs"
            style={{ color: semanticColors.textSecondary }}
          >
            {formatPrice(price)}
          </p>
        </div>
      </div>
    </div>
  );
}

