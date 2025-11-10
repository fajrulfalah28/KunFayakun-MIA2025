import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Input, Button } from '../components';
import { semanticColors } from '../styles/colors';
import ShopIcon from '../components/icons/ShopIcon';

interface LoginPageProps {
  onNavigateToSignUp: () => void;
  onNavigateToHome?: () => void;
  currentBgImage: string;
}

export default function LoginPage({ onNavigateToSignUp, onNavigateToHome, currentBgImage }: LoginPageProps) {
  const [formData, setFormData] = useState({
    contact: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Crossfade state management
  const [displayedImage, setDisplayedImage] = useState(currentBgImage);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Standard crossfade implementation
  useEffect(() => {
    if (currentBgImage !== displayedImage) {
      // Preload the new image
      const img = new Image();
      img.src = currentBgImage;
      
      img.onload = () => {
        // Start the fade transition
        setIsTransitioning(true);
        
        // After fade completes, update the displayed image
        const timer = setTimeout(() => {
          setDisplayedImage(currentBgImage);
          setIsTransitioning(false);
        }, 3000); // Match CSS transition duration
        
        return () => clearTimeout(timer);
      };
    }
  }, [currentBgImage, displayedImage]);

  // Format phone number with dashes: XXX-XXXX-XXXX
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Apply formatting
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 7) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Kontak validation (format: XXX-XXXX-XXXX = 11 digits)
    const contactDigits = formData.contact.replace(/\D/g, '');
    if (!formData.contact.trim()) {
      newErrors.contact = 'Kontak wajib diisi';
    } else if (contactDigits.length !== 11) {
      newErrors.contact = 'Harus 11 digit (XXX-XXXX-XXXX)';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Minimal 8 karakter';
    } else if (formData.password.length > 64) {
      newErrors.password = 'Maksimal 64 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Login submitted:', formData);
      
      // Reset form
      setFormData({
        contact: '',
        password: '',
      });
      setErrors({});
      
      // Navigate to landing page after successful login
      if (onNavigateToHome) {
        onNavigateToHome();
      } else {
        alert('Login berhasil!');
      }
    } catch {
      setErrors({ submit: 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row" style={{ backgroundColor: semanticColors.bgPrimary }}>
      {/* Top Side - Image (mobile) / Left Side - Image (desktop) */}
      <div className="relative lg:flex-1 flex-1 lg:h-screen overflow-hidden order-1 lg:order-1 h-full w-full">
        {/* Base image layer - always visible */}
        <div
          className="absolute inset-0 bg-cover bg-center h-full w-full"
          style={{
            backgroundImage: `url(${displayedImage})`,
          }}
        />
        {/* Overlay image layer - fades in when transitioning */}
        <div
          className="absolute inset-0 bg-cover bg-center h-full w-full transition-opacity duration-3000 ease-in-out"
          style={{
            backgroundImage: `url(${currentBgImage})`,
            opacity: isTransitioning ? 1 : 0,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Bottom Side - Form (mobile) / Right Side - Form (desktop) */}
      <div className="flex flex-col items-center justify-start lg:justify-center px-6 py-16 lg:px-[64px] lg:w-auto lg:min-w-[590px] order-2 lg:order-2 overflow-y-auto" style={{ backgroundColor: semanticColors.bgPrimary }}>
        {/* Form Container - Hugging content */}
        <div className="w-full max-w-[462px] flex flex-col">
          {/* Logo & Title - Aligned to middle */}
          <div className="flex items-center justify-center gap-[16px] sm:gap-[20px] mb-8 lg:mb-12 shrink-0">
            <div className="w-[48px] h-[48px] sm:w-[64px] sm:h-[64px] lg:w-[72px] lg:h-[72px] flex items-center justify-center">
              <ShopIcon className="w-full h-full" />
            </div>
            <h1
              className="font-black text-5xl sm:text-6xl lg:text-5xl"
              style={{ fontFamily: "'Nunito', sans-serif", color: semanticColors.textPrimary }}
            >
              KiosKu
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
            {/* Kontak */}
            <Input
              label="Kontak"
              type="tel"
              placeholder="123-4567-8910"
              value={formData.contact}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                handleChange('contact', formatted);
              }}
              error={errors.contact}
              leftIcon={
                <span className="font-dm-sans font-regular text-sm" style={{ color: semanticColors.textPrimary }}>
                  +62
                </span>
              }
              maxLength={13}
            />

            {/* Password */}
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan Password"
              value={formData.password}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 64) {
                  handleChange('password', value);
                }
              }}
              error={errors.password}
              leftIcon={<FontAwesomeIcon icon={faKey} className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:opacity-70 transition-opacity cursor-pointer"
                >
                  <FontAwesomeIcon 
                    icon={showPassword ? faEye : faEyeSlash} 
                    className="w-4 h-4" 
                  />
                </button>
              }
              maxLength={64}
            />
          </form>

          {/* Buttons */}
          <div className="flex flex-col gap-2 w-full pt-8">
            <Button 
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Masuk
            </Button>

            <div className="flex items-center justify-center px-4 py-2 rounded-md h-[37px]">
              <p className="font-dm-sans font-regular text-sm text-center" style={{ color: semanticColors.bgDark }}>
                Belum mempunyai akun?{' '}
                <button
                  type="button"
                  onClick={onNavigateToSignUp}
                  className="font-bold hover:underline cursor-pointer"
                  style={{ color: semanticColors.bgDark }}
                >
                  Daftar.
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

