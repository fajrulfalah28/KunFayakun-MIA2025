import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { semanticColors } from "../../styles/colors";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export default function Select({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;
  const hasValue = value !== "";

  // Determine width class based on className
  const getWidthClass = () => {
    if (className.includes("w-full")) return "w-full";
    if (className.includes("flex-1")) return "flex-1";
    return "w-[296px]";
  };

  return (
    <div className={`relative ${getWidthClass()}`} ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-[10px] h-[39px] px-3 py-[6px] rounded-[12px] w-full cursor-pointer transition-colors ${className}`}
        style={{ backgroundColor: semanticColors.bgTertiary }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = semanticColors.bgSecondary)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = semanticColors.bgTertiary)
        }
      >
        <span
          className="font-dm-sans font-regular text-sm flex-1 text-left"
          style={{
            color: hasValue
              ? semanticColors.bgDark
              : semanticColors.textSecondary,
          }}
        >
          {displayValue}
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{
            color: hasValue
              ? semanticColors.bgDark
              : semanticColors.textSecondary,
          }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-[12px] p-2 z-50 shadow-lg max-h-[200px] overflow-y-auto"
          style={{ backgroundColor: semanticColors.bgPrimary }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-[8px] cursor-pointer transition-colors font-dm-sans font-regular text-sm"
              style={{
                color: semanticColors.textPrimary,
                backgroundColor:
                  value === option.value
                    ? semanticColors.bgSecondary
                    : "transparent",
              }}
              onMouseEnter={(e) => {
                if (value !== option.value) {
                  e.currentTarget.style.backgroundColor =
                    semanticColors.bgSecondary;
                }
              }}
              onMouseLeave={(e) => {
                if (value !== option.value) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
