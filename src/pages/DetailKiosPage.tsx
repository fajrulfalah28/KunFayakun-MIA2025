import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLocationDot, 
  faChevronRight,
  faUtensils,
  faMugHot,
  faCookie,
  faBowlRice,
  faIceCream,
  faLeaf,
  faPepperHot,
} from '@fortawesome/free-solid-svg-icons';
import { Header, Footer, ProductCard, Button, HalalIcon, CheckBadgeIcon } from '../components';
import { semanticColors, brandColors, colors } from '../styles/colors';
import ShopeeFoodIcon from '../components/icons/ShopeeFoodIcon';
import GoFoodIcon from '../components/icons/GoFoodIcon';
import WhatsappIcon from '../components/icons/WhatsappIcon';
import InstagramIcon from '../components/icons/InstagramIcon';

interface DetailKiosPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
  onNavigateToHome?: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToDetailKios: () => void;
}

export default function DetailKiosPage({
  onNavigateToLogin,
  onNavigateToSignUp,
  onNavigateToHome,
  onNavigateToSettings,
  onNavigateToDetailKios,
}: DetailKiosPageProps) {
  const [locationSearch, setLocationSearch] = useState('');
  const [umkmSearch, setUmkmSearch] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
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

  const totalStripes = isMobile ? 19 : isTablet ? 35 : 25;

  // Sample data - replace with actual props or API data
  const kiosData = {
    name: 'Warung Sate Padang Pak Jawa',
    description: 'Warung sate padang legendaris yang telah berdiri puluhan tahun. Menyajikan sate padang autentik dengan bumbu khas Minangkabau yang diwariskan turun-temurun. Setiap porsi disajikan dengan ketupat dan sambal merah yang pedas menggugah selera.',
    image: 'https://images.unsplash.com/photo-1634871572365-8bc444e6faea?w=1920&h=650&fit=crop&q=80&auto=format',
    establishedDate: '12-12-2020',
    operatingHours: '17:00 - 22:00',
    rating: 5.4,
    totalReviews: 1201,
    address: 'Jalan Kutai Utara Nomor 1, Kelurahan Sumber, Kecamatan Banjarsari, Kota Solo, Jawa Tengah.',
    isPilihanKami: true,
    jenisProduk: ['food', 'nusantara', 'halal'], // Array of category IDs
  };

  // Category definitions for display
  const categoryMap: Record<string, { label: string; icon: typeof faUtensils | null; iconColor: string | undefined; useHalalIcon?: boolean; useCheckBadge?: boolean }> = {
    food: { label: 'Makanan', icon: faUtensils, iconColor: '#FF6B35' },
    drinks: { label: 'Minuman', icon: faMugHot, iconColor: '#4A90E2' },
    snacks: { label: 'Cemilan', icon: faCookie, iconColor: '#D2691E' },
    coffee: { label: 'Kopi', icon: faMugHot, iconColor: '#6F4E37' },
    nusantara: { label: 'Nusantara', icon: faBowlRice, iconColor: semanticColors.textPrimary },
    dessert: { label: 'Dessert', icon: faIceCream, iconColor: '#FF69B4' },
    diet: { label: 'Diet', icon: faLeaf, iconColor: '#90EE90' },
    pedas: { label: 'Pedas', icon: faPepperHot, iconColor: '#FF4500' },
    halal: { label: 'Halal', icon: null, iconColor: undefined, useHalalIcon: true },
    featured: { label: 'Pilihan Kami', icon: null, iconColor: colors.secondary[500], useCheckBadge: true },
  };

  const products = [
    { id: 1, name: 'Sate Padang', price: 25000, image: 'https://images.unsplash.com/photo-1645696301019-35adcc18fc21?w=574&h=386&fit=crop&q=80&auto=format' },
    { id: 2, name: 'Sate Padang (10 tusuk)', price: 25000, image: 'https://images.unsplash.com/photo-1645696301019-35adcc18fc21?w=574&h=386&fit=crop&q=80&auto=format' },
    { id: 3, name: 'Sate Padang (15 tusuk)', price: 35000, image: 'https://images.unsplash.com/photo-1645696301019-35adcc18fc21?w=574&h=386&fit=crop&q=80&auto=format' },
    { id: 4, name: 'Sate Padang (20 tusuk)', price: 45000, image: 'https://images.unsplash.com/photo-1645696301019-35adcc18fc21?w=574&h=386&fit=crop&q=80&auto=format' },
    { id: 5, name: 'Extra Sambal', price: 3000, image: 'https://images.unsplash.com/photo-1713374989663-e5b165462fef?w=574&h=386&fit=crop&q=80&auto=format' },
    { id: 6, name: 'Extra Bumbu Kacang', price: 5000, image: 'https://i.pinimg.com/736x/5a/1d/6a/5a1d6a08ebaf33a402146fad69dbb283.jpg' },
    { id: 7, name: 'Ketupat', price: 5000, image: 'https://images.unsplash.com/photo-1621118209138-de12f6a48d5e?w=574&h=386&fit=crop&q=80&auto=format' },
    { id: 8, name: 'Lontong', price: 5000, image: 'https://i.pinimg.com/736x/f6/08/fd/f608fd04795d71a0f6a2a1079daff5fc.jpg' },
  ];

  const awningColor = kiosData.isPilihanKami ? colors.secondary[400] : brandColors.primary;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.neutral[3] }}>
      {/* Header */}
      <Header
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToSignUp={onNavigateToSignUp}
        onNavigateToHome={onNavigateToHome}
        onNavigateToDetailKios={onNavigateToDetailKios}
        userProfile={{
          imageUrl: undefined, // You can add a profile image URL here
          name: 'User',
          onClick: () => console.log('Profile clicked'),
          onSettingsClick: () => onNavigateToSettings?.(),
          onLogoutClick: () => {
            console.log('Logout clicked');
            // You can add logout logic here, e.g., navigate to login page
          },
        }}
        showSearch={true}
        locationSearch={locationSearch}
        onLocationSearchChange={setLocationSearch}
        umkmSearch={umkmSearch}
        onUmkmSearchChange={setUmkmSearch}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        priceFilter={priceFilter}
        onPriceFilterChange={setPriceFilter}
      />

      {/* Breadcrumb */}
      <section className="px-4 sm:px-6 lg:px-20 pt-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToHome}
              className="font-dm-sans font-regular text-sm cursor-pointer"
              style={{ color: semanticColors.textPrimary }}
            >
              Home
            </button>
            <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" style={{ color: semanticColors.textPrimary }} />
            <span className="font-dm-sans font-regular text-sm" style={{ color: semanticColors.textPrimary }}>
              {kiosData.name}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-20 py-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
            {/* Left Side - Banner Image & Info Card */}
            <div className="flex flex-col gap-4 w-full lg:w-fit">
              {/* Banner Image with Awning */}
              <div className="relative w-full flex-1 min-h-[193px] rounded-[12px] overflow-hidden">
                <img
                  src={kiosData.image}
                  alt={kiosData.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0"
                />
                
                {/* Striped Awning Top - Responsive stripe count */}
                <div className="absolute top-0 left-0 right-0 h-[37px] flex">
                  {[...Array(totalStripes)].map((_, i) => {
                    return (
                      <div
                        key={i}
                        className={`flex-1 h-full rounded-b-[12px] ${i === 0 ? 'rounded-tl-[12px]' : ''} ${i === totalStripes - 1 ? 'rounded-tr-[12px]' : ''}`}
                        style={{
                          backgroundColor: i % 2 === 0 ? awningColor : brandColors.white,
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Info Card - 2x2 Grid on mobile, Single Line on desktop */}
              <div
                className="grid grid-cols-2 sm:flex sm:flex-row items-center justify-center gap-3 sm:gap-6 px-4 sm:px-6 py-3 rounded-[12px] w-full sm:w-fit self-start"
                style={{ backgroundColor: semanticColors.bgPrimary }}
              >
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <p className="font-dm-sans font-regular text-xs sm:text-sm" style={{ color: semanticColors.textSecondary }}>
                    Berdiri Sejak
                  </p>
                  <p className="font-dm-sans font-bold text-base sm:text-lg" style={{ color: semanticColors.textPrimary }}>
                    {kiosData.establishedDate}
                  </p>
                </div>
                <div className="hidden sm:block h-12 w-px shrink-0" style={{ backgroundColor: colors.neutral[6] }} />
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <p className="font-dm-sans font-regular text-xs sm:text-sm" style={{ color: semanticColors.textSecondary }}>
                    Jam Buka
                  </p>
                  <p className="font-dm-sans font-bold text-base sm:text-lg" style={{ color: semanticColors.textPrimary }}>
                    {kiosData.operatingHours}
                  </p>
                </div>
                <div className="hidden sm:block h-12 w-px shrink-0" style={{ backgroundColor: colors.neutral[6] }} />
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <p className="font-dm-sans font-regular text-xs sm:text-sm" style={{ color: semanticColors.textSecondary }}>
                    Rating
                  </p>
                  <p className="font-dm-sans font-bold text-base sm:text-lg" style={{ color: semanticColors.textPrimary }}>
                    {kiosData.rating}
                  </p>
                </div>
                <div className="hidden sm:block h-12 w-px shrink-0" style={{ backgroundColor: colors.neutral[6] }} />
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <p className="font-dm-sans font-regular text-xs sm:text-sm" style={{ color: semanticColors.textSecondary }}>
                    Total Review
                  </p>
                  <p className="font-dm-sans font-bold text-base sm:text-lg" style={{ color: semanticColors.textPrimary }}>
                    {kiosData.totalReviews}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Kios Details & Map */}
            <div className="flex-1 flex flex-col gap-3">
              {/* Kios Details Card */}
              <div
                className="flex flex-col gap-4 p-6 rounded-[12px]"
                style={{ backgroundColor: semanticColors.bgPrimary }}
              >
                <div className="flex flex-col gap-1.5 pb-3 border-b" style={{ borderColor: colors.neutral[6] }}>
                  <h1
                    className="font-black text-2xl sm:text-3xl lg:text-4xl wrap-break-word"
                    style={{ fontFamily: "'Nunito', sans-serif", color: semanticColors.textPrimary }}
                  >
                    {kiosData.name}
                  </h1>
                  <p className="font-dm-sans font-regular text-xs wrap-break-word" style={{ color: semanticColors.textSecondary }}>
                    {kiosData.description}
                  </p>
                  
                  {/* Jenis Produk */}
                  {((kiosData.jenisProduk && kiosData.jenisProduk.length > 0) || kiosData.isPilihanKami) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {/* Pilihan Kami tag */}
                      {kiosData.isPilihanKami && (
                        <div
                          className="flex items-center gap-1.5 px-2 py-1 rounded-[8px]"
                          style={{ 
                            backgroundColor: semanticColors.bgPrimary,
                            border: `0.5px solid ${semanticColors.borderMedium}`
                          }}
                        >
                          <CheckBadgeIcon width={14} height={14} color={colors.secondary[500]} />
                          <span className="font-dm-sans font-regular text-xs" style={{ color: semanticColors.textPrimary }}>
                            Pilihan Kami
                          </span>
                        </div>
                      )}
                      
                      {/* Other jenis produk */}
                      {kiosData.jenisProduk && kiosData.jenisProduk.map((categoryId) => {
                        const category = categoryMap[categoryId];
                        if (!category) return null;
                        
                        return (
                          <div
                            key={categoryId}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-[8px]"
                            style={{ 
                              backgroundColor: semanticColors.bgPrimary,
                              border: `0.5px solid ${semanticColors.borderMedium}`
                            }}
                          >
                            {category.useHalalIcon ? (
                              <HalalIcon width={14} height={14} />
                            ) : category.useCheckBadge ? (
                              <CheckBadgeIcon width={14} height={14} color={category.iconColor || semanticColors.textPrimary} />
                            ) : category.icon ? (
                              <FontAwesomeIcon 
                                icon={category.icon} 
                                className="w-3.5 h-3.5" 
                                style={{ color: category.iconColor }}
                              />
                            ) : null}
                            <span className="font-dm-sans font-regular text-xs" style={{ color: semanticColors.textPrimary }}>
                              {category.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Temukan Kami Di */}
                <div className="flex items-center gap-4">
                  <p className="font-dm-sans font-regular text-xs" style={{ color: semanticColors.textSecondary }}>
                    Temukan Kami Di:
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="flex items-center justify-center p-2.5 rounded-full border cursor-pointer transition-colors"
                      style={{ borderColor: colors.neutral[6] }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = semanticColors.bgSecondary}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <ShopeeFoodIcon width={20} height={20} />
                    </button>
                    <button
                      className="flex items-center justify-center p-2.5 rounded-full border cursor-pointer transition-colors"
                      style={{ borderColor: colors.neutral[6] }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = semanticColors.bgSecondary}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <GoFoodIcon width={20} height={20} />
                    </button>
                    <button
                      className="flex items-center justify-center p-2.5 rounded-full border cursor-pointer transition-colors"
                      style={{ borderColor: colors.neutral[6] }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = semanticColors.bgSecondary}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <WhatsappIcon width={20} height={20} />
                    </button>
                    <button
                      className="flex items-center justify-center p-2.5 rounded-full border cursor-pointer transition-colors"
                      style={{ borderColor: colors.neutral[6] }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = semanticColors.bgSecondary}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <InstagramIcon width={20} height={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Google Map Card */}
              <div
                className="flex flex-col gap-4 p-6 rounded-[12px]"
                style={{ backgroundColor: semanticColors.bgPrimary }}
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4" style={{ color: semanticColors.textPrimary }} />
                    <h3 className="font-dm-sans font-bold text-sm" style={{ color: semanticColors.textPrimary }}>
                      Lihat Melalui Google Map
                    </h3>
                  </div>
                      <p className="font-dm-sans font-regular text-xs wrap-break-word" style={{ color: semanticColors.textSecondary }}>
                        {kiosData.address}
                      </p>
                </div>
                <div className="h-[144px] rounded-[12px] border-2 overflow-hidden" style={{ borderColor: colors.neutral[6] }}>
                  {/* Placeholder for Google Map - replace with actual map component */}
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.neutral[4] }}>
                    <p className="font-dm-sans font-regular text-sm" style={{ color: semanticColors.textSecondary }}>
                      Google Map Placeholder
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section className="px-4 sm:px-6 lg:px-20 py-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col gap-6">
            <h2 className="font-dm-sans font-bold text-lg" style={{ color: semanticColors.textPrimary }}>
              Katalog Produk
            </h2>
            
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={`${kiosData.name}-${product.id}`}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  kiosName={kiosData.name}
                />
              ))}
            </div>

            {/* Load More Button */}
            <div className="flex justify-center">
              <Button variant="primary" onClick={() => console.log('Load more products')}>
                Tampilkan lebih Banyak
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

