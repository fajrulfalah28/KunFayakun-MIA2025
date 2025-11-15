import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faTimes } from '@fortawesome/free-solid-svg-icons';
import { semanticColors } from '../../styles/colors';

interface LocationAutocompleteProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onPlaceSelect?: (placeId: string, location: string) => void;
  className?: string;
}

export interface LocationAutocompleteHandle {
  clear: () => void;
}

const LocationAutocomplete = forwardRef<LocationAutocompleteHandle, LocationAutocompleteProps>(
  ({ placeholder = "Masukkan Lokasi Anda", value, onChange, onPlaceSelect, className = '' }, ref) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [suggestions, setSuggestions] = useState<{ placeId: string; description: string }[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const [isInitialized, setIsInitialized] = useState(false);
    
    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize Google Maps services after component mounts
    useEffect(() => {
      const initAutocomplete = () => {
        if (typeof google !== 'undefined' && google.maps && google.maps.places) {
          autocompleteService.current = new google.maps.places.AutocompleteService();
          setIsInitialized(true);
        }
      };

      // Check if script is already loaded
      if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        initAutocomplete();
      } else {
        // If script is not loaded yet, try again after a delay
        const timer = setTimeout(initAutocomplete, 1000);
        return () => clearTimeout(timer);
      }
    }, []);

    // Handle external value changes
    useEffect(() => {
      if (value !== inputValue) {
        setInputValue(value || '');
      }
    }, [value]);

    // Update suggestions when input changes
    useEffect(() => {
      if (!inputValue.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      if (isInitialized && autocompleteService.current) {
        // Debounce the API call
        const timeoutId = setTimeout(() => {
          autocompleteService.current?.getPlacePredictions(
            { 
              input: inputValue,
              types: ['(regions)'], // General regions but we'll filter results
              componentRestrictions: { country: 'ID' },
              location: new google.maps.LatLng(-6.38035, 106.83467), // Coordinates for Depok
              radius: 20000 // 20km radius around Depok
            },
            (predictions, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                // List of kecamatan and kelurahan in Depok based on provided data
                const depokAreas = [
                  // Kecamatan Beji
                  'beji', 'beji timur', 'kemiri muka', 'kukusan', 'pondok cina', 'tanah baru',
                  // Kecamatan Pancoran Mas
                  'pancoran mas', 'depok', 'depok jaya', 'mampang', 'rangkapan jaya',
                  // Kecamatan Cipayung
                  'cipayung', 'cipayung jaya', 'ratu jaya', 'pondok jaya', 'pondok terong',
                  // Kecamatan Sukmajaya
                  'sukmajaya', 'abadijaya', 'baktijaya', 'mekarjaya',
                  // Kecamatan Cimanggis
                  'tugu', 'mekarsari', 'harjamukti', 'curug', 'cisalak pasar', 'sukatani',
                  // Kecamatan Cilodong
                  'cilodong', 'jatimulya', 'kalibaru', 'kalimulya',
                  // Kecamatan Tapos
                  'tapos', 'cilangkap', 'sukatani', 'leuwinanggung',
                  // Kecamatan Cinere
                  'cinere', 'gandul', 'pangkalan jati', 'pangkalan jati baru',
                  // Kecamatan Limo
                  'limo', 'grogol', 'krukut', 'meruyung',
                  // Kecamatan Sawangan
                  'sawangan', 'sawangan baru', 'bedahan', 'cinangka',
                  // Kecamatan Bojongsari
                  'bojongsari', 'bojongsari baru', 'curug', 'duren mekar', 'duren seribu', 'pondok petir'
                ];
                
                // Also include kecamatan names for filtering
                const depokKecamatans = [
                  'kecamatan beji', 'beji', 'kecamatan pancoran mas', 'pancoran mas',
                  'kecamatan cipayung', 'cipayung', 'kecamatan sukmajaya', 'sukmajaya',
                  'kecamatan cimanggis', 'cimanggis', 'kecamatan cilodong', 'cilodong',
                  'kecamatan tapos', 'tapos', 'kecamatan cinere', 'cinere',
                  'kecamatan limo', 'limo', 'kecamatan sawangan', 'sawangan',
                  'kecamatan bojongsari', 'bojongsari'
                ];
                
                // Filter results to only include areas that are in Depok
                const filteredResults = predictions.filter(prediction => {
                  const descLower = prediction.description.toLowerCase();
                  
                  // Check if the description contains any of the specific areas in Depok
                  const containsDepokArea = depokAreas.some(area => 
                    descLower.includes(area) || area.includes(descLower.split(',')[0].trim())
                  );
                  
                  // Check if the description contains any kecamatan names in Depok
                  const containsDepokKecamatan = depokKecamatans.some(kec => 
                    descLower.includes(kec) || kec.includes(descLower.split(',')[0].trim())
                  );
                  
                  // Also allow general mentions of "depok" in the result
                  const containsDepok = descLower.includes('depok');
                  
                  return containsDepokArea || containsDepokKecamatan || containsDepok;
                });
                
                const results = filteredResults.map(prediction => ({
                  placeId: prediction.place_id,
                  description: prediction.description
                }));
                
                setSuggestions(results);
                setShowSuggestions(true);
                setActiveSuggestionIndex(-1);
              } else {
                setSuggestions([]);
                setShowSuggestions(false);
              }
            }
          );
        }, 300);

        return () => clearTimeout(timeoutId);
      }
    }, [inputValue, isInitialized]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : -1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
          selectSuggestion(suggestions[activeSuggestionIndex]);
        } else if (suggestions.length > 0) {
          selectSuggestion(suggestions[0]);
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    };

    const selectSuggestion = (suggestion: { placeId: string; description: string }) => {
      setInputValue(suggestion.description);
      onChange?.(suggestion.description);
      onPlaceSelect?.(suggestion.placeId, suggestion.description);
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onChange?.(newValue);
      
      if (!newValue.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const handleClear = () => {
      setInputValue('');
      onChange?.('');
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    };

    // Expose clear method to parent components
    useImperativeHandle(ref, () => ({
      clear: handleClear
    }));

    return (
      <div className={`relative ${className}`}>
        <div
          className={`flex items-center gap-[10px] h-[39px] px-3 py-[6px] rounded-[12px] w-full`}
          style={{ backgroundColor: semanticColors.bgTertiary }}
        >
          <div
            className="flex items-center shrink-0 size-[16.667px]"
            style={{ color: inputValue ? semanticColors.bgDark : semanticColors.textSecondary }}
          >
            <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4" />
          </div>

          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue && setShowSuggestions(true)}
            className="flex-1 bg-transparent font-dm-sans font-regular text-sm border-0 outline-0 focus:outline-none focus:ring-0"
            style={{
              color: inputValue ? semanticColors.bgDark : semanticColors.textSecondary,
            }}
          />

          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center justify-center size-[16.667px]"
              style={{ color: semanticColors.textSecondary }}
            >
              <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            className="absolute top-full left-0 w-full mt-1 rounded-[12px] shadow-lg z-10 max-h-60 overflow-y-auto"
            style={{ backgroundColor: semanticColors.bgPrimary }}
          >
            <ul className="py-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.placeId}
                  onClick={() => selectSuggestion(suggestion)}
                  className={`px-4 py-2 cursor-pointer text-left ${
                    index === activeSuggestionIndex ? 'bg-blue-100' : ''
                  }`}
                  style={{
                    color: semanticColors.textPrimary,
                    backgroundColor: index === activeSuggestionIndex ? '#dbeafe' : 'transparent'
                  }}
                >
                  <div className="font-dm-sans font-regular text-sm">
                    {suggestion.description}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

LocationAutocomplete.displayName = 'LocationAutocomplete';

export default LocationAutocomplete;