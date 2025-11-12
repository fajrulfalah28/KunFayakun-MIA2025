import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faMugHot,
  faCookie,
  faChevronDown,
  faChevronRight,
  faBowlRice,
  faIceCream,
  faLeaf,
  faPepperHot,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  ChipSelector,
  KiosCard,
  Banner,
  HalalIcon,
  CheckBadgeIcon,
  FilterDropdown,
  Header,
  Footer,
} from "../components";
import { semanticColors, colors } from "../styles/colors";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
  onNavigateToDetailKios: () => void;
}

export default function LandingPage({
  onNavigateToLogin,
  onNavigateToSignUp,
  onNavigateToDetailKios,
}: LandingPageProps) {
  // Category filters with icon colors (for chip selector)
  const categories = [
    {
      id: "all",
      label: "Tampilkan Semua",
      icon: faUtensils,
      iconColor: semanticColors.textPrimary,
    },
    {
      id: "featured",
      label: "Pilihan Kami",
      icon: null,
      iconColor: colors.secondary[500],
      useCheckBadge: true,
    }, // Uses CheckBadgeIcon
    {
      id: "halal",
      label: "Halal",
      icon: null,
      iconColor: undefined,
      useHalalIcon: true,
    }, // Uses HalalIcon component
    { id: "food", label: "Makanan", icon: faUtensils, iconColor: "#FF6B35" }, // Orange
    { id: "drinks", label: "Minuman", icon: faMugHot, iconColor: "#4A90E2" }, // Blue
    { id: "snacks", label: "Cemilan", icon: faCookie, iconColor: "#D2691E" }, // Cookie/Brown
    { id: "coffee", label: "Kopi", icon: faMugHot, iconColor: "#6F4E37" }, // Coffee/Brown
    {
      id: "nusantara",
      label: "Nusantara",
      icon: faBowlRice,
      iconColor: semanticColors.textPrimary,
    },
    { id: "dessert", label: "Dessert", icon: faIceCream, iconColor: "#FF69B4" }, // Pink
    { id: "diet", label: "Diet", icon: faLeaf, iconColor: "#90EE90" }, // Light Green
    { id: "pedas", label: "Pedas", icon: faPepperHot, iconColor: "#FF4500" }, // Red Orange
  ];

  // All categories for dropdown
  const allCategories = [
    {
      id: "all",
      label: "Tampilkan Semua",
      icon: faUtensils,
      iconColor: semanticColors.textPrimary,
    },
    {
      id: "featured",
      label: "Pilihan Kami",
      icon: null,
      iconColor: colors.secondary[500],
      useCheckBadge: true,
    }, // Uses CheckBadgeIcon
    {
      id: "halal",
      label: "Halal",
      icon: null,
      iconColor: undefined,
      useHalalIcon: true,
    },
    { id: "food", label: "Makanan", icon: faUtensils, iconColor: "#FF6B35" },
    { id: "drinks", label: "Minuman", icon: faMugHot, iconColor: "#4A90E2" },
    { id: "snacks", label: "Cemilan", icon: faCookie, iconColor: "#D2691E" },
    { id: "coffee", label: "Kopi", icon: faMugHot, iconColor: "#6F4E37" },
    {
      id: "nusantara",
      label: "Nusantara",
      icon: faBowlRice,
      iconColor: semanticColors.textPrimary,
    },
    { id: "dessert", label: "Dessert", icon: faIceCream, iconColor: "#FF69B4" }, // Pink
    { id: "diet", label: "Diet", icon: faLeaf, iconColor: "#90EE90" }, // Light Green
    { id: "pedas", label: "Pedas", icon: faPepperHot, iconColor: "#FF4500" }, // Red Orange
  ];

  const [locationSearch, setLocationSearch] = useState("");
  const [umkmSearch, setUmkmSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "all",
  ]);
  const [lihatSemuaDropdown, setLihatSemuaDropdown] = useState(false);
  const [timeFilter, setTimeFilter] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [kiosData, setKiosData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const lihatSemuaRef = useRef<HTMLDivElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        lihatSemuaRef.current &&
        !lihatSemuaRef.current.contains(event.target as Node)
      ) {
        setLihatSemuaDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load kios data from Firestore
  useEffect(() => {
    const fetchKiosData = async () => {
      try {
        const q = query(collection(db, "kios"), orderBy("rating", "desc"));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const kiosList = querySnapshot.docs.map((doc, index) => {
            const data = doc.data();
            // Determine image based on category
            let categoryImage =
              "https://images.unsplash.com/photo-1634871572365-8bc444e6faea?w=574&h=386&fit=crop&q=80&auto=format";
            if (data["Kategori"] && typeof data["Kategori"] === "string") {
              const categoryLower = data["Kategori"].toLowerCase();
              if (categoryLower.includes("ayam")) {
                categoryImage =
                  "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=574&h=386&fit=crop&q=80&auto=format";
              } else if (categoryLower.includes("pizza")) {
                categoryImage =
                  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=574&h=386&fit=crop&q=80&auto=format";
              } else if (categoryLower.includes("nasi")) {
                categoryImage =
                  "https://images.unsplash.com/photo-1606755965493-7b6435c7c2e5?w=574&h=386&fit=crop&q=80&auto=format";
              } else if (categoryLower.includes("seafood")) {
                categoryImage =
                  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=574&h=386&fit=crop&q=80&auto=format";
              } else if (categoryLower.includes("bakso")) {
                categoryImage =
                  "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=574&h=386&fit=crop&q=80&auto=format";
              } else if (categoryLower.includes("sate")) {
                categoryImage =
                  "https://images.unsplash.com/photo-1645696301019-35adcc18fc21?w=574&h=386&fit=crop&q=80&auto=format";
              } else if (
                categoryLower.includes("mie") ||
                categoryLower.includes("mie")
              ) {
                categoryImage =
                  "https://images.unsplash.com/photo-1622343147636-106f278303b4?w=574&h=386&fit=crop&q=80&auto=format";
              } else if (
                categoryLower.includes("kopi") ||
                categoryLower.includes("coffee")
              ) {
                categoryImage =
                  "https://images.unsplash.com/photo-1624888465876-072fd1e0d3c7?w=574&h=386&fit=crop&q=80&auto=format";
              } else if (
                categoryLower.includes("jus") ||
                categoryLower.includes("buah")
              ) {
                categoryImage =
                  "https://images.unsplash.com/photo-1598679045187-2b0e6fff7f22?w=574&h=386&fit=crop&q=80&auto=format";
              } else if (
                categoryLower.includes("bakar") ||
                categoryLower.includes("grill")
              ) {
                categoryImage =
                  "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=574&h=386&fit=crop&q=80&auto=format";
              } else if (
                categoryLower.includes("kuah") ||
                categoryLower.includes("soto") ||
                categoryLower.includes("sop")
              ) {
                categoryImage =
                  "https://images.unsplash.com/photo-1585297643353-563d08671c69?w=574&h=386&fit=crop&q=80&auto=format";
              } else if (categoryLower.includes("goreng")) {
                categoryImage =
                  "https://images.unsplash.com/photo-1606755962588-9a4e3caffda3?w=574&h=386&fit=crop&q=80&auto=format";
              }
            }

            return {
              id: index + 1,
              image: categoryImage,
              name: data["Nama UMKM"] || "Nama UMKM tidak tersedia",
              description:
                data["Deskripsi UMKM"] ||
                `Tentang ${data["Nama UMKM"] || "UMKM"}`,
              categories: data["Kategori"] || "Makanan",
              location: data["Alamat"]
                ? data["Alamat"].split(",")[0]
                : "Indonesia", // Ambil bagian pertama alamat
              rating: parseFloat(data["Rating"]) || 0,
              operatingHours: data["Jam Operasional"] || "08:00 - 20:00",
              isPilihanKami: data["Pilihan Kami"] || false,
              isHalal: data["Halal"] || false,
            };
          });

          setKiosData(kiosList);
        } else {
          // Jika tidak ada dokumen ditemukan, gunakan data dummy
          setKiosData([
            {
              id: 1,
              image:
                "https://images.unsplash.com/photo-1592011432621-f7f576f44484?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXlhbSUyMGJha2FyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
              name: "Ayam Bakar Khas Bandung Teteh Vivi",
              description:
                "Ayam bakar khas Bandung teteh Vivi menyajikan ayam bakar yang lezat dan nikmat",
              categories: "Makanan, Nusantara",
              location: "Depok",
              rating: 4.6,
              operatingHours: "17:00 - 22:00",
              isPilihanKami: true,
              isHalal: true,
            },
            {
              id: 2,
              image:
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=574&h=386&fit=crop&q=80&auto=format",
              name: "Kedai Salad Sehat",
              description:
                "Kedai sehat yang fokus menyajikan makanan bergizi dan rendah kalori. Tempat favorit bagi yang ingin menjaga pola makan sehat tanpa mengorbankan rasa.",
              categories: "Makanan, Diet",
              location: "Jakarta",
              rating: 4.7,
              operatingHours: "10:00 - 20:00",
              isPilihanKami: true,
              isHalal: true,
            },
            {
              id: 3,
              image:
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=574&h=386&fit=crop&q=80&auto=format",
              name: "Pizzeria Italia Nusantara",
              description:
                "Restoran pizza dengan sentuhan lokal Indonesia. Menghadirkan pizza dengan topping unik yang menggabungkan cita rasa Italia dan Indonesia.",
              categories: "Makanan",
              location: "Bandung",
              rating: 4.5,
              operatingHours: "09:00 - 18:00",
              isPilihanKami: true,
              isHalal: true,
            },
            {
              id: 4,
              image:
                "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=574&h=386&fit=crop&q=80&auto=format",
              name: "Toko Kue Premium",
              description:
                "Toko kue spesialis kue premium dan pastry berkualitas tinggi. Menggunakan bahan-bahan pilihan dan teknik pembuatan yang teliti untuk hasil yang sempurna.",
              categories: "Dessert",
              location: "Surabaya",
              rating: 4.2,
              operatingHours: "11:00 - 21:00",
              isPilihanKami: true,
              isHalal: true,
            },
            {
              id: 5,
              image:
                "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=574&h=386&fit=crop&q=80&auto=format",
              name: "Cafe Brunch Favorit",
              description:
                "Cafe cozy yang terkenal dengan menu brunch dan breakfast yang lengkap. Suasana nyaman dan hangat, cocok untuk bersantai bersama keluarga atau teman.",
              categories: "Dessert",
              location: "Yogyakarta",
              rating: 4.8,
              operatingHours: "14:00 - 22:00",
              isPilihanKami: true,
              isHalal: true,
            },
            {
              id: 6,
              image:
                "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=574&h=386&fit=crop&q=80&auto=format",
              name: "Ramen House Asia",
              description:
                "Restoran ramen autentik dengan berbagai varian ramen dari berbagai negara Asia. Kuah yang kaya rasa dan bahan-bahan segar setiap harinya.",
              categories: "Makanan",
              location: "Medan",
              rating: 4.6,
              operatingHours: "07:00 - 15:00",
              isPilihanKami: true,
              isHalal: true,
            },
            {
              id: 7,
              image:
                "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=574&h=386&fit=crop&q=80&auto=format",
              name: "Burger Joint Klasik",
              description:
                "Tempat makan burger dengan konsep klasik Amerika. Burger dengan patty tebal, keju leleh, dan bahan-bahan segar yang membuat setiap gigitan memuaskan.",
              categories: "Makanan",
              location: "Denpasar",
              rating: 4.9,
              operatingHours: "12:00 - 22:00",
              isPilihanKami: true,
              isHalal: true,
            },
            {
              id: 8,
              image:
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=574&h=386&fit=crop&q=80&auto=format",
              name: "Rumah Makan Nusantara",
              description:
                "Rumah makan yang menghadirkan berbagai hidangan nusantara dalam satu tempat. Dari ayam goreng, daging bakar, hingga urap sayuran, semua tersedia di sini.",
              categories: "Makanan, Nusantara",
              location: "Makassar",
              rating: 4.3,
              operatingHours: "11:00 - 23:00",
              isPilihanKami: true,
              isHalal: true,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching kios data: ", error);
        // Fallback to sample data if there's an error
        setKiosData([
          {
            id: 1,
            image:
              "https://images.unsplash.com/photo-1634871572365-8bc444e6faea?w=574&h=386&fit=crop&q=80&auto=format",
            name: "Warung Sate Padang Pak Jawa",
            description:
              "Warung sate padang legendaris yang telah berdiri puluhan tahun. Menyajikan sate padang autentik dengan bumbu khas Minangkabau yang diwariskan turun-temurun.",
            categories: "Makanan, Nusantara",
            location: "Depok",
            rating: 4.6,
            operatingHours: "17:00 - 22:00",
            isPilihanKami: true,
            isHalal: true,
          },
          {
            id: 2,
            image:
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=574&h=386&fit=crop&q=80&auto=format",
            name: "Kedai Salad Sehat",
            description:
              "Kedai sehat yang fokus menyajikan makanan bergizi dan rendah kalori. Tempat favorit bagi yang ingin menjaga pola makan sehat tanpa mengorbankan rasa.",
            categories: "Makanan, Diet",
            location: "Jakarta",
            rating: 4.7,
            operatingHours: "10:00 - 20:00",
            isPilihanKami: true,
            isHalal: true,
          },
          {
            id: 3,
            image:
              "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=574&h=386&fit=crop&q=80&auto=format",
            name: "Pizzeria Italia Nusantara",
            description:
              "Restoran pizza dengan sentuhan lokal Indonesia. Menghadirkan pizza dengan topping unik yang menggabungkan cita rasa Italia dan Indonesia.",
            categories: "Makanan",
            location: "Bandung",
            rating: 4.5,
            operatingHours: "09:00 - 18:00",
            isPilihanKami: true,
            isHalal: true,
          },
          {
            id: 4,
            image:
              "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=574&h=386&fit=crop&q=80&auto=format",
            name: "Toko Kue Premium",
            description:
              "Toko kue spesialis kue premium dan pastry berkualitas tinggi. Menggunakan bahan-bahan pilihan dan teknik pembuatan yang teliti untuk hasil yang sempurna.",
            categories: "Dessert",
            location: "Surabaya",
            rating: 4.2,
            operatingHours: "11:00 - 21:00",
            isPilihanKami: true,
            isHalal: true,
          },
          {
            id: 5,
            image:
              "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=574&h=386&fit=crop&q=80&auto=format",
            name: "Cafe Brunch Favorit",
            description:
              "Cafe cozy yang terkenal dengan menu brunch dan breakfast yang lengkap. Suasana nyaman dan hangat, cocok untuk bersantai bersama keluarga atau teman.",
            categories: "Dessert",
            location: "Yogyakarta",
            rating: 4.8,
            operatingHours: "14:00 - 22:00",
            isPilihanKami: true,
            isHalal: true,
          },
          {
            id: 6,
            image:
              "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=574&h=386&fit=crop&q=80&auto=format",
            name: "Ramen House Asia",
            description:
              "Restoran ramen autentik dengan berbagai varian ramen dari berbagai negara Asia. Kuah yang kaya rasa dan bahan-bahan segar setiap harinya.",
            categories: "Makanan",
            location: "Medan",
            rating: 4.6,
            operatingHours: "07:00 - 15:00",
            isPilihanKami: true,
            isHalal: true,
          },
          {
            id: 7,
            image:
              "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=574&h=386&fit=crop&q=80&auto=format",
            name: "Burger Joint Klasik",
            description:
              "Tempat makan burger dengan konsep klasik Amerika. Burger dengan patty tebal, keju leleh, dan bahan-bahan segar yang membuat setiap gigitan memuaskan.",
            categories: "Makanan",
            location: "Denpasar",
            rating: 4.9,
            operatingHours: "12:00 - 22:00",
            isPilihanKami: true,
            isHalal: true,
          },
          {
            id: 8,
            image:
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=574&h=386&fit=crop&q=80&auto=format",
            name: "Rumah Makan Nusantara",
            description:
              "Rumah makan yang menghadirkan berbagai hidangan nusantara dalam satu tempat. Dari ayam goreng, daging bakar, hingga urap sayuran, semua tersedia di sini.",
            categories: "Makanan, Nusantara",
            location: "Makassar",
            rating: 4.3,
            operatingHours: "11:00 - 23:00",
            isPilihanKami: true,
            isHalal: true,
          },
        ]);
      } finally {
        // Pastikan loading state berubah menjadi false setelah selesai
        setLoading(false);
      }
    };

    fetchKiosData();
  }, []);

  // Handle category selection
  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === "all") {
      // "Tampilkan Semua" is exclusive - only select it
      setSelectedCategories(["all"]);
    } else {
      // Other categories can be selected together
      // If "all" is selected, remove it first
      const newSelection = selectedCategories.includes("all")
        ? [categoryId]
        : selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId) // Toggle off
        : [...selectedCategories.filter((id) => id !== "all"), categoryId]; // Toggle on

      setSelectedCategories(newSelection.length > 0 ? newSelection : ["all"]);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: colors.neutral[3] }}
    >
      {/* Header / Navigation */}
      <Header
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToSignUp={onNavigateToSignUp}
        onNavigateToHome={() => {}} // Landing page is home, so no-op
        onNavigateToDetailKios={onNavigateToDetailKios}
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

      {/* Hero Banner */}
      <section className="px-4 sm:px-6 lg:px-20 py-6">
        <div className="max-w-[1440px] mx-auto">
          {!loading && kiosData.length > 0 && (
            <Banner
              image={
                kiosData[0]?.image ||
                "https://images.unsplash.com/photo-1634871572365-8bc444e6faea?w=1920&h=650&fit=crop&q=80&auto=format"
              }
              title={kiosData[0]?.name || "Warung Sate Padang Pak Jawa"}
              description={
                kiosData[0]?.description ||
                "Warung sate padang legendaris yang telah berdiri puluhan tahun. Menyajikan sate padang autentik dengan bumbu khas Minangkabau yang diwariskan turun-temurun."
              }
              isPilihanKami={kiosData[0]?.isPilihanKami || true}
              onViewClick={onNavigateToDetailKios}
            />
          )}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <p
                className="font-dm-sans font-regular text-lg"
                style={{ color: semanticColors.textPrimary }}
              >
                Loading...
              </p>
            </div>
          )}
          {!loading && kiosData.length === 0 && (
            <Banner
              image="https://images.unsplash.com/photo-1634871572365-8bc444e6faea?w=1920&h=650&fit=crop&q=80&auto=format"
              title="Warung Sate Padang Pak Jawa"
              description="Warung sate padang legendaris yang telah berdiri puluhan tahun. Menyajikan sate padang autentik dengan bumbu khas Minangkabau yang diwariskan turun-temurun."
              isPilihanKami={true}
              onViewClick={onNavigateToDetailKios}
            />
          )}
        </div>
      </section>

      {/* Category Filters */}
      <section
        className="px-4 sm:px-6 lg:px-20 py-0 lg:py-3"
        style={{ backgroundColor: colors.neutral[3] }}
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center gap-2 sm:gap-4 lg:pb-2 pb-0">
            {/* Mobile: Only dropdowns */}
            <div className="flex lg:hidden gap-2 sm:gap-4">
              {/* Jenis Produk Dropdown Button (Mobile) */}
              <div className="relative flex-1" ref={lihatSemuaRef}>
                <button
                  className="flex items-center justify-between gap-[10px] px-3 py-2 rounded-[12px] h-[39px] cursor-pointer transition-colors whitespace-nowrap w-full"
                  style={{
                    backgroundColor: semanticColors.bgDark,
                    color: semanticColors.textOnDark,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  onClick={() => {
                    setLihatSemuaDropdown(!lihatSemuaDropdown);
                  }}
                >
                  <span className="font-dm-sans font-regular text-sm">
                    Jenis Produk
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`w-4 h-4 transition-transform ${
                      lihatSemuaDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Jenis Produk Dropdown */}
                {lihatSemuaDropdown && (
                  <div
                    className="absolute top-full left-0 mt-2 w-[280px] rounded-[12px] p-4 z-50 shadow-lg"
                    style={{ backgroundColor: semanticColors.bgPrimary }}
                  >
                    <div className="flex flex-col gap-3">
                      {allCategories.map((cat) => (
                        <label
                          key={cat.id}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.id)}
                            onChange={() => handleCategoryClick(cat.id)}
                            className="w-4 h-4 cursor-pointer"
                            style={{ accentColor: semanticColors.bgDark }}
                          />
                          <div className="flex items-center gap-2">
                            {cat.useHalalIcon ? (
                              <HalalIcon width={16} height={16} />
                            ) : cat.useCheckBadge ? (
                              <CheckBadgeIcon
                                width={16}
                                height={16}
                                color={
                                  cat.iconColor || semanticColors.textPrimary
                                }
                              />
                            ) : cat.icon ? (
                              <FontAwesomeIcon
                                icon={cat.icon}
                                className="w-4 h-4"
                                style={{ color: cat.iconColor }}
                              />
                            ) : null}
                            <span
                              className="font-dm-sans font-regular text-sm"
                              style={{ color: semanticColors.textPrimary }}
                            >
                              {cat.label}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Filter Dropdown Button (Mobile) */}
              <div className="flex-1">
                <FilterDropdown
                  label="Filter"
                  timeFilter={timeFilter}
                  priceFilter={priceFilter}
                  onTimeFilterChange={setTimeFilter}
                  onPriceFilterChange={setPriceFilter}
                  className="w-full"
                />
              </div>
            </div>

            {/* Desktop: Chips on left, dropdowns on right */}
            <div
              ref={chipsContainerRef}
              className="hidden lg:flex gap-4 flex-1 min-w-0 overflow-x-auto scrollbar-hide scroll-smooth flex-nowrap"
              style={{
                touchAction: "pan-x",
                WebkitOverflowScrolling: "touch",
                cursor: "grab",
              }}
              onMouseDown={(e) => {
                const container = chipsContainerRef.current;
                if (!container) return;

                const startX = e.pageX;
                let currentScroll = container.scrollLeft;
                container.style.cursor = "grabbing";
                let lastX = startX;
                let velocity = 0;
                let lastTime = Date.now();
                let rafId: number | null = null;

                const onMouseMove = (e: MouseEvent) => {
                  const currentTime = Date.now();
                  const timeDelta = Math.max(currentTime - lastTime, 1);
                  const currentVelocity = (e.pageX - lastX) / timeDelta;

                  velocity = currentVelocity * 0.3 + velocity * 0.7; // Smooth velocity with exponential moving average
                  lastX = e.pageX;
                  lastTime = currentTime;

                  // Use requestAnimationFrame for smooth updates
                  if (!rafId) {
                    rafId = requestAnimationFrame(() => {
                      const diffX = lastX - startX;
                      container.scrollLeft = currentScroll - diffX;
                      rafId = null;
                    });
                  }

                  e.preventDefault();
                };

                const onMouseUp = () => {
                  container.style.cursor = "grab";
                  document.removeEventListener("mousemove", onMouseMove);
                  document.removeEventListener("mouseup", onMouseUp);

                  if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                  }

                  // Update current scroll position
                  currentScroll = container.scrollLeft;

                  // Add momentum scrolling
                  if (Math.abs(velocity) > 0.1) {
                    const momentum = velocity * 20; // Momentum multiplier
                    const targetScroll = currentScroll - momentum;
                    const startScroll = currentScroll;
                    const distance = targetScroll - startScroll;
                    const duration = 400; // ms
                    const startTime = Date.now();

                    const easeOut = (t: number) => {
                      return 1 - Math.pow(1 - t, 3); // Cubic ease-out
                    };

                    const animateMomentum = () => {
                      const elapsed = Date.now() - startTime;
                      const progress = Math.min(elapsed / duration, 1);
                      const eased = easeOut(progress);

                      currentScroll = startScroll + distance * eased;
                      container.scrollLeft = currentScroll;

                      if (progress < 1) {
                        requestAnimationFrame(animateMomentum);
                      }
                    };

                    requestAnimationFrame(animateMomentum);
                  }
                };

                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
              }}
            >
              {categories.map((cat) => (
                <ChipSelector
                  key={cat.id}
                  icon={
                    cat.useHalalIcon ? (
                      <HalalIcon width={20} height={20} />
                    ) : cat.useCheckBadge ? (
                      <CheckBadgeIcon
                        width={20}
                        height={20}
                        color={cat.iconColor || semanticColors.textPrimary}
                      />
                    ) : cat.icon ? (
                      <FontAwesomeIcon icon={cat.icon} className="w-5 h-5" />
                    ) : null
                  }
                  iconColor={cat.iconColor}
                  isSelected={selectedCategories.includes(cat.id)}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="shrink-0"
                >
                  {cat.label}
                </ChipSelector>
              ))}
            </div>

            {/* Desktop: Lihat Semua & Filter on right - Hug content */}
            <div className="hidden lg:flex gap-4 items-center shrink-0">
              {/* Lihat Semua Dropdown Button (Desktop) */}
              <div className="relative" ref={lihatSemuaRef}>
                <button
                  className="flex items-center gap-[10px] px-3 py-2 rounded-[12px] h-[39px] cursor-pointer transition-colors whitespace-nowrap"
                  style={{
                    backgroundColor: semanticColors.bgDark,
                    color: semanticColors.textOnDark,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  onClick={() => {
                    setLihatSemuaDropdown(!lihatSemuaDropdown);
                  }}
                >
                  <span className="font-dm-sans font-regular text-sm">
                    Lihat Semua
                  </span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`w-4 h-4 transition-transform ${
                      lihatSemuaDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Lihat Semua Dropdown */}
                {lihatSemuaDropdown && (
                  <div
                    className="absolute top-full right-0 mt-2 w-[280px] rounded-[12px] p-4 z-50 shadow-lg"
                    style={{ backgroundColor: semanticColors.bgPrimary }}
                  >
                    <div className="flex flex-col gap-3">
                      {allCategories.map((cat) => (
                        <label
                          key={cat.id}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.id)}
                            onChange={() => handleCategoryClick(cat.id)}
                            className="w-4 h-4 cursor-pointer"
                            style={{ accentColor: semanticColors.bgDark }}
                          />
                          <div className="flex items-center gap-2">
                            {cat.useHalalIcon ? (
                              <HalalIcon width={16} height={16} />
                            ) : cat.useCheckBadge ? (
                              <CheckBadgeIcon
                                width={16}
                                height={16}
                                color={
                                  cat.iconColor || semanticColors.textPrimary
                                }
                              />
                            ) : cat.icon ? (
                              <FontAwesomeIcon
                                icon={cat.icon}
                                className="w-4 h-4"
                                style={{ color: cat.iconColor }}
                              />
                            ) : null}
                            <span
                              className="font-dm-sans font-regular text-sm"
                              style={{ color: semanticColors.textPrimary }}
                            >
                              {cat.label}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Filter Dropdown Button (Desktop) */}
              <div>
                <FilterDropdown
                  label="Filter"
                  timeFilter={timeFilter}
                  priceFilter={priceFilter}
                  onTimeFilterChange={setTimeFilter}
                  onPriceFilterChange={setPriceFilter}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kios Grid */}
      <section className="px-4 sm:px-6 lg:px-20 py-6 flex-1">
        <div className="max-w-[1440px] mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p
                className="font-dm-sans font-regular text-lg"
                style={{ color: semanticColors.textPrimary }}
              >
                Loading...
              </p>
            </div>
          ) : kiosData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p
                className="font-dm-sans font-regular text-lg"
                style={{ color: semanticColors.textPrimary }}
              >
                Tidak ada data kios ditemukan
              </p>
            </div>
          ) : (
            <>
              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[30px] mb-8">
                {kiosData.map((kios, index) => (
                  <KiosCard
                    key={kios.id}
                    image={kios.image}
                    name={kios.name}
                    categories={kios.categories}
                    description={kios.description}
                    location={kios.location}
                    rating={kios.rating}
                    operatingHours={kios.operatingHours}
                    isPilihanKami={kios.isPilihanKami}
                    isHalal={kios.isHalal}
                    onClick={
                      index === 0
                        ? onNavigateToDetailKios
                        : () => console.log("View kios", kios.id)
                    }
                  />
                ))}
              </div>

              {/* Load More Button */}
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  onClick={() => console.log("Load more")}
                  rightIcon={
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="w-4 h-4"
                    />
                  }
                  className="px-8"
                >
                  Tampilkan lebih Banyak
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
