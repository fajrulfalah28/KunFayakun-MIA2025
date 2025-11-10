import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { semanticColors } from '../../styles/colors';

interface FilterDropdownProps {
  label: string;
  timeFilter: string;
  priceFilter: string;
  onTimeFilterChange: (value: string) => void;
  onPriceFilterChange: (value: string) => void;
  className?: string;
}

export default function FilterDropdown({
  label,
  timeFilter,
  priceFilter,
  onTimeFilterChange,
  onPriceFilterChange,
  className = '',
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTimeFilterToggle = (value: string) => {
    // Toggle: if already selected, unselect it
    if (timeFilter === value) {
      onTimeFilterChange('');
    } else {
      onTimeFilterChange(value);
    }
  };

  const handlePriceFilterToggle = (value: string) => {
    // Toggle: if already selected, unselect it
    if (priceFilter === value) {
      onPriceFilterChange('');
    } else {
      onPriceFilterChange(value);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        className={`flex items-center justify-between gap-[10px] px-3 py-2 rounded-[12px] h-[39px] cursor-pointer transition-colors whitespace-nowrap ${className.includes('w-full') ? 'w-full' : ''}`}
        style={{ backgroundColor: semanticColors.bgDark, color: semanticColors.textOnDark }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-dm-sans font-regular text-sm">{label}</span>
        <FontAwesomeIcon 
          icon={faChevronDown} 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 sm:right-0 sm:left-auto mt-2 w-[280px] sm:w-[280px] rounded-[12px] p-4 z-50 shadow-lg"
          style={{ backgroundColor: semanticColors.bgPrimary }}
        >
          <div className="flex flex-col gap-6">
            {/* Durasi Waktu Section */}
            <div className="flex flex-col gap-3">
              <h3
                className="font-dm-sans font-bold text-sm"
                style={{ color: semanticColors.textPrimary }}
              >
                Durasi Waktu
              </h3>
              <div className="flex flex-col gap-2">
                        <label 
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            handleTimeFilterToggle('terbaru');
                          }}
                        >
                          <input
                            type="radio"
                            name={`timeFilter-${label}`}
                            value="terbaru"
                            checked={timeFilter === 'terbaru'}
                            onChange={() => {}}
                            className="w-4 h-4 cursor-pointer"
                            style={{ accentColor: semanticColors.bgDark }}
                            readOnly
                          />
                          <span
                            className="font-dm-sans font-regular text-sm"
                            style={{ color: semanticColors.textPrimary }}
                          >
                            Terbaru
                          </span>
                        </label>
                        <label 
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            handleTimeFilterToggle('terlama');
                          }}
                        >
                          <input
                            type="radio"
                            name={`timeFilter-${label}`}
                            value="terlama"
                            checked={timeFilter === 'terlama'}
                            onChange={() => {}}
                            className="w-4 h-4 cursor-pointer"
                            style={{ accentColor: semanticColors.bgDark }}
                            readOnly
                          />
                          <span
                            className="font-dm-sans font-regular text-sm"
                            style={{ color: semanticColors.textPrimary }}
                          >
                            Terlama
                          </span>
                        </label>
              </div>
            </div>

            {/* Harga Section */}
            <div className="flex flex-col gap-3">
              <h3
                className="font-dm-sans font-bold text-sm"
                style={{ color: semanticColors.textPrimary }}
              >
                Harga
              </h3>
              <div className="flex flex-col gap-2">
                        <label 
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePriceFilterToggle('rendah-tinggi');
                          }}
                        >
                          <input
                            type="radio"
                            name={`priceFilter-${label}`}
                            value="rendah-tinggi"
                            checked={priceFilter === 'rendah-tinggi'}
                            onChange={() => {}}
                            className="w-4 h-4 cursor-pointer"
                            style={{ accentColor: semanticColors.bgDark }}
                            readOnly
                          />
                          <span
                            className="font-dm-sans font-regular text-sm"
                            style={{ color: semanticColors.textPrimary }}
                          >
                            Rendah-Tinggi
                          </span>
                        </label>
                        <label 
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePriceFilterToggle('tinggi-rendah');
                          }}
                        >
                          <input
                            type="radio"
                            name={`priceFilter-${label}`}
                            value="tinggi-rendah"
                            checked={priceFilter === 'tinggi-rendah'}
                            onChange={() => {}}
                            className="w-4 h-4 cursor-pointer"
                            style={{ accentColor: semanticColors.bgDark }}
                            readOnly
                          />
                          <span
                            className="font-dm-sans font-regular text-sm"
                            style={{ color: semanticColors.textPrimary }}
                          >
                            Tinggi-Rendah
                          </span>
                        </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

