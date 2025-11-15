import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBowlRice,
  faChevronRight,
  faCookie,
  faFish,
  faIceCream,
  faLeaf,
  faMugHot,
  faPepperHot,
  faPizzaSlice,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import {
  Banner,
  Button,
  CheckBadgeIcon,
  ChipSelector,
  FilterDropdown,
  Footer,
  HalalIcon,
  Header,
  KiosCard,
} from "../components";
import { colors, semanticColors } from "../styles/colors";
import {
  type DocumentData,
  QueryDocumentSnapshot,
  collection,
  getDocs,
  limit,
  query,
  collectionGroup,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const KIOS_COLLECTIONS = [
  "Data Ayam & Geprek",
  "Data Bakso & Mie",
  "Data Jajanan & Snack",
  "Data Kafe & Kopi",
  "Data Katering & Lainnya",
  "Data Pecel Lele",
  "Data Pizza",
  "Data Seafood",
  "kios",
] as const;

type FireKios = {
  "Nama UMKM": string;
  "Deskripsi UMKM"?: string;
  Kategori?: string | string[];
  Alamat?: string;
  Rating?: number | string;
  "Foto UMKM"?: string;
  "Foto Tempat"?: string;
  "Harga Produk"?: string;

  "Jam Operasional"?: string;
  "Pilihan Kami"?: boolean;
  Halal?: boolean;
};

type UiKios = {
  id: string; // doc.id
  image: string;
  placeImage: string;
  price: number;
  name: string;
  description: string;
  categories: string;
  location: string;
  rating: number;
  operatingHours: string;
  isPilihanKami: boolean;
  isHalal: boolean;
};

// ———————————————————————————————————
// Helpers
const CATEGORY_MAP: Record<string, string[]> = {
  Makanan: [
    "ayam",
    "bakso",
    "mie",
    "seafood",
    "pecel",
    "pizza",
    "snacks",
    "food",
  ],
  Halal: [
    "ayam",
    "bakso",
    "mie",
    "seafood",
    "pecel",
    "pizza",
    "snacks",
    "food",
  ],
  Minuman: ["kopi", "kafe"],
  Cemilan: ["snack", "jajanan", "roti", "pastry", "kue"],
  Kopi: ["kopi", "kafe"],
  Nusantara: ["pecel"],
  Dessert: ["snacks"],
  Pizza: ["pizza"],
  Seafood: ["seafood"],
};

const guessImageByCategory = (kategori?: string | string[]) => {
  const pick = (word: string) =>
    `https://source.unsplash.com/featured/574x386/?${encodeURIComponent(
      word
    )}&sig=${Math.random()}`;
  const cat = Array.isArray(kategori)
    ? (kategori[0] || "").toLowerCase()
    : (kategori || "").toLowerCase();
  if (cat.includes("ayam")) return pick("grilled-chicken");
  if (cat.includes("pizza")) return pick("pizza");
  if (cat.includes("nasi")) return pick("rice");
  if (cat.includes("seafood")) return pick("seafood");
  if (cat.includes("bakso")) return pick("meatball soup");
  if (cat.includes("sate")) return pick("satay");
  if (cat.includes("mie")) return pick("noodles");
  if (cat.includes("kopi")) return pick("coffee");
  if (cat.includes("jus") || cat.includes("buah")) return pick("juice");
  if (cat.includes("bakar") || cat.includes("grill")) return pick("grill");
  if (cat.includes("kuah") || cat.includes("soto") || cat.includes("sop"))
    return pick("soup");
  if (cat.includes("goreng")) return pick("fried food");
  return "https://images.unsplash.com/photo-1634871572365-8bc444e6faea?w=574&h=386&fit=crop&q=80&auto=format";
};

// const parseBool = (value: unknown): boolean => {
//   if (value === true) return true;
//   if (value === false) return false;
//   if (typeof value === "string") {
//     return value.toLowerCase() === "true";
//   }
//   return false;
// };

const toUiKios = (
  doc: QueryDocumentSnapshot<DocumentData, DocumentData>
): UiKios => {
  const raw = doc.data() as Record<string, any>;

  let categories = "Makanan";

  // 🔥 1. BACA kategori manual yang disimpan user
  if (typeof raw.kategori === "string" && raw.kategori) {
    categories = raw.kategori;
  }

  // 2. Jika user pilih chip jenisProduk
  else if (Array.isArray(raw.jenisProduk) && raw.jenisProduk.length > 0) {
    categories = raw.jenisProduk.join(", ");
  }

  // 3. Dari AI auto detect (jika ada)
  else if (typeof raw.kategoriTeridentifikasi === "string") {
    categories = raw.kategoriTeridentifikasi;
  }

  // 4. Dari dataset FIRESTORE lama
  else if (Array.isArray(raw["Kategori"])) {
    categories = raw["Kategori"].join(", ");
  } else if (typeof raw["Kategori"] === "string") {
    categories = raw["Kategori"];
  }

  // Convert rating
  const rating =
    typeof raw.Rating === "number"
      ? raw.Rating
      : typeof raw.Rating === "string"
      ? parseFloat(raw.Rating)
      : 0;

  // Halal otomatis
  const halalAuto =
    raw.Halal === true ||
    raw.halal === true ||
    categories.toLowerCase().includes("halal");

  return {
    id: doc.id,

    image: raw["Foto UMKM"] || raw.fotoKios || guessImageByCategory(categories),

    placeImage:
      raw["Foto Tempat"] ||
      (raw.fotoKios && raw.fotoKios[0]) ||
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",

    price:
      typeof raw["Harga Produk"] === "string"
        ? parseInt(raw["Harga Produk"])
        : 0,

    name: raw["Nama UMKM"] || raw.namaKios || "Nama UMKM",

    description:
      raw["Deskripsi UMKM"] ||
      raw.deskripsi ||
      `Tentang ${raw["Nama UMKM"] || "UMKM"}`,

    categories,

    location: raw["Alamat"] || raw.alamat?.text || "Lokasi tidak diketahui",

    rating,

    operatingHours:
      raw["Jam Operasional"] ||
      `${raw.jamBuka || "08:00"} - ${raw.jamTutup || "20:00"}`,

    isPilihanKami:
      raw["Pilihan Kami"] === true ||
      raw.pilihanKami === true ||
      raw.featured === true,

    isHalal: halalAuto,
  };
};

const fetchAllKios = async (): Promise<UiKios[]> => {
  const all: UiKios[] = [];

  // Ambil MEGA DATA lama
  for (const colName of KIOS_COLLECTIONS) {
    const colRef = collection(db, colName);
    const snap = await getDocs(colRef);
    snap.forEach((doc) => all.push(toUiKios(doc)));
  }

  // 🔥 Ambil semua kios baru buatan user
  const groupSnap = await getDocs(collectionGroup(db, "kios"));
  groupSnap.forEach((doc) => {
    all.push(toUiKios(doc));
  });

  return all;
};

const getIconForCategory = (kategori: string) => {
  const cat = kategori.toLowerCase();

  // Cek berdasarkan chipDefs yang sudah ada
  if (cat.includes("makanan")) return faUtensils;
  if (cat.includes("minuman")) return faMugHot;
  if (
    cat.includes("cemilan") ||
    cat.includes("snack") ||
    cat.includes("jajanan")
  )
    return faCookie;
  if (cat.includes("kopi") || cat.includes("kafe")) return faMugHot;
  if (cat.includes("nusantara")) return faBowlRice;
  if (cat.includes("dessert")) return faIceCream;
  if (cat.includes("pizza")) return faLeaf;
  if (cat.includes("seafood")) return faPepperHot;

  // Tambahan dari KIOS_COLLECTIONS
  if (cat.includes("ayam") || cat.includes("geprek")) return faUtensils;
  if (cat.includes("bakso") || cat.includes("mie")) return faBowlRice;

  return faUtensils;
};

export default function LandingPage() {
  const navigate = useNavigate();

  // Search/filter UI
  const [locationSearch, setLocationSearch] = useState("");
  const [umkmSearch, setUmkmSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>("");

  // Kategori
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("all"); // single main category
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [onlyHalal, setOnlyHalal] = useState(false);

  // Data & pagination
  const PAGE_SIZE = 8;
  const [items, setItems] = useState<UiKios[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const firstLoadRef = useRef(true);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const profileImageUrl = undefined;

  // Ambil daftar kategori unik dari Firestore (sekali di awal)
  useEffect(() => {
    (async () => {
      const snap = await getDocs(query(collection(db, "kios"), limit(200)));
      const set = new Set<string>();
      snap.forEach((doc) => {
        const k = (doc.data() as FireKios)["Kategori"];
        if (Array.isArray(k)) k.forEach((x) => x && set.add(x));
        else if (typeof k === "string" && k) set.add(k);
      });
      // fallback kalau kosong
      const base = [
        "Makanan",
        "Minuman",
        "Cemilan",
        "Kopi",
        "Nusantara",
        "Dessert",
        "Pizza",
        "Seafood",
      ];
      setAllCategories(Array.from(set).length ? Array.from(set) : base);
    })().catch(console.error);
  }, []);

  const clearFilters = () => {
    setOnlyFeatured(false);
    setOnlyHalal(false);
    setSelected("all");
  };

  // Fetch pertama / saat filter berubah
  const fetchFirstPage = async () => {
    setLoading(true);
    try {
      const all = await fetchAllKios();

      // Apply all filters: category, featured, halal, name, location, time, price
      let result = [...all];

      // Apply category filters
      if (onlyFeatured) {
        result = result.filter((x) => x.isPilihanKami);
      } else if (onlyHalal) {
        result = result.filter((x) => x.isHalal);
      } else if (selected !== "all") {
        const keywords = CATEGORY_MAP[selected] || [];

        result = result.filter((x) => {
          const cat = x.categories.toLowerCase();
          return keywords.some((k) => cat.includes(k));
        });
      }

      // Apply search filters
      const nameQ = umkmSearch.trim().toLowerCase();
      const locQ = locationSearch.trim().toLowerCase();
      if (nameQ || locQ) {
        result = result.filter((x) => {
          const okName = !nameQ || x.name.toLowerCase().includes(nameQ);
          const okLoc =
            !locQ ||
            x.location.toLowerCase().includes(locQ) ||
            // Additional check for more comprehensive location matching
            (locQ.includes("kelurahan") &&
              x.location
                .toLowerCase()
                .includes(locQ.replace("kelurahan", "").trim())) ||
            (locQ.includes("kecamatan") &&
              x.location
                .toLowerCase()
                .includes(locQ.replace("kecamatan", "").trim())) ||
            (locQ.includes("kota") &&
              x.location
                .toLowerCase()
                .includes(locQ.replace("kota", "").trim())) ||
            (locQ.includes("kabupaten") &&
              x.location
                .toLowerCase()
                .includes(locQ.replace("kabupaten", "").trim()));
          return okName && okLoc;
        });
      }

      // Additional filter to ensure location matches if "Depok" is part of the query
      if (locQ.toLowerCase().includes("depok")) {
        result = result.filter((x) =>
          x.location.toLowerCase().includes("depok")
        );
      }

      // Apply time and price sorting
      result = [...result]; // Create a copy for sorting

      // First sort by price if price filter is selected
      if (priceFilter) {
        if (priceFilter === "rendah-tinggi") {
          result.sort((a, b) => a.price - b.price);
        } else if (priceFilter === "tinggi-rendah") {
          result.sort((a, b) => b.price - a.price);
        }
      }
      // Then sort by time if time filter is selected
      else if (timeFilter) {
        if (timeFilter === "terbaru") {
          result.sort((a, b) => b.rating - a.rating);
        } else if (timeFilter === "terlama") {
          result.sort((a, b) => a.rating - b.rating);
        }
      }
      // Otherwise sort by rating
      else {
        result.sort((a, b) => b.rating - a.rating);
      }

      const firstPage = result.slice(0, PAGE_SIZE);
      setItems(firstPage);

      setCursor(firstPage.length);
    } finally {
      setLoading(false);
    }
  };

  const getAwningColor = (k: UiKios) => {
    if (k.isPilihanKami) return "yellow";
    return "red";
  };

  // Load more
  const fetchNextPage = async () => {
    if (cursor === null) return;

    setLoadingMore(true);

    try {
      const all = await fetchAllKios();

      // Apply all filters
      let filtered = all;

      // filter kategori
      if (onlyFeatured) {
        filtered = filtered.filter((x) => x.isPilihanKami);
      } else if (onlyHalal) {
        filtered = filtered.filter((x) => x.isHalal);
      } else if (selected !== "all") {
        const keywords = CATEGORY_MAP[selected] || [];
        filtered = filtered.filter((x) => {
          const cat = x.categories.toLowerCase();
          return keywords.some((k) => cat.includes(k));
        });
      }

      // Apply search filters
      const nameQ = umkmSearch.trim().toLowerCase();
      const locQ = locationSearch.trim().toLowerCase();
      if (nameQ || locQ) {
        filtered = filtered.filter((x) => {
          const okName = !nameQ || x.name.toLowerCase().includes(nameQ);
          const okLoc =
            !locQ ||
            x.location.toLowerCase().includes(locQ) ||
            // Additional check for more comprehensive location matching
            (locQ.includes("kelurahan") &&
              x.location
                .toLowerCase()
                .includes(locQ.replace("kelurahan", "").trim())) ||
            (locQ.includes("kecamatan") &&
              x.location
                .toLowerCase()
                .includes(locQ.replace("kecamatan", "").trim())) ||
            (locQ.includes("kota") &&
              x.location
                .toLowerCase()
                .includes(locQ.replace("kota", "").trim())) ||
            (locQ.includes("kabupaten") &&
              x.location
                .toLowerCase()
                .includes(locQ.replace("kabupaten", "").trim()));
          return okName && okLoc;
        });
      }

      // Additional filter to ensure location matches if "Depok" is part of the query
      if (locQ.toLowerCase().includes("depok")) {
        filtered = filtered.filter((x) =>
          x.location.toLowerCase().includes("depok")
        );
      }

      // Apply time and price sorting
      filtered = [...filtered]; // Create a copy for sorting

      // First sort by price if price filter is selected
      if (priceFilter) {
        if (priceFilter === "rendah-tinggi") {
          filtered.sort((a, b) => a.price - b.price);
        } else if (priceFilter === "tinggi-rendah") {
          filtered.sort((a, b) => b.price - a.price);
        }
      }
      // Then sort by time if time filter is selected
      else if (timeFilter) {
        if (timeFilter === "terbaru") {
          filtered.sort((a, b) => b.rating - a.rating);
        } else if (timeFilter === "terlama") {
          filtered.sort((a, b) => a.rating - b.rating);
        }
      }
      // Otherwise sort by rating
      else {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      const nextItems = filtered.slice(cursor, cursor + PAGE_SIZE);

      setItems((prev) => [...prev, ...nextItems]);

      // update cursor
      if (nextItems.length < PAGE_SIZE) {
        setCursor(null); // tidak ada data lagi
      } else {
        setCursor(cursor + PAGE_SIZE);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  // Trigger fetch saat kategori/flag berubah
  useEffect(() => {
    // hindari double-run pada strict mode
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
    }
    fetchFirstPage().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selected,
    onlyFeatured,
    onlyHalal,
    umkmSearch,
    locationSearch,
    timeFilter,
    priceFilter,
  ]);

  // Search lokal (client-side) untuk nama/alamat—cukup ringan
  const filtered = useMemo(() => {
    const nameQ = umkmSearch.trim().toLowerCase();
    const locQ = locationSearch.trim().toLowerCase();

    // Apply all filters: name, location
    let result = items;

    // Apply name and location filters
    // When location is selected, first filter by location, then by name if needed
    if (locQ) {
      result = result.filter((x) => {
        // List of kecamatan and kelurahan in Depok based on provided data
        const depokAreas = [
          // Kecamatan Beji
          "beji",
          "beji timur",
          "kemiri muka",
          "kukusan",
          "pondok cina",
          "tanah baru",
          // Kecamatan Pancoran Mas
          "pancoran mas",
          "depok",
          "depok jaya",
          "mampang",
          "rangkapan jaya",
          // Kecamatan Cipayung
          "cipayung",
          "cipayung jaya",
          "ratu jaya",
          "pondok jaya",
          "pondok terong",
          // Kecamatan Sukmajaya
          "sukmajaya",
          "abadijaya",
          "baktijaya",
          "mekarjaya",
          // Kecamatan Cimanggis
          "tugu",
          "mekarsari",
          "harjamukti",
          "curug",
          "cisalak pasar",
          "sukatani",
          // Kecamatan Cilodong
          "cilodong",
          "jatimulya",
          "kalibaru",
          "kalimulya",
          // Kecamatan Tapos
          "tapos",
          "cilangkap",
          "sukatani",
          "leuwinanggung",
          // Kecamatan Cinere
          "cinere",
          "gandul",
          "pangkalan jati",
          "pangkalan jati baru",
          // Kecamatan Limo
          "limo",
          "grogol",
          "krukut",
          "meruyung",
          // Kecamatan Sawangan
          "sawangan",
          "sawangan baru",
          "bedahan",
          "cinangka",
          // Kecamatan Bojongsari
          "bojongsari",
          "bojongsari baru",
          "curug",
          "duren mekar",
          "duren seribu",
          "pondok petir",
        ];

        // Also include kecamatan names for filtering
        const depokKecamatans = [
          "kecamatan beji",
          "beji",
          "kecamatan pancoran mas",
          "pancoran mas",
          "kecamatan cipayung",
          "cipayung",
          "kecamatan sukmajaya",
          "sukmajaya",
          "kecamatan cimanggis",
          "cimanggis",
          "kecamatan cilodong",
          "cilodong",
          "kecamatan tapos",
          "tapos",
          "kecamatan cinere",
          "cinere",
          "kecamatan limo",
          "limo",
          "kecamatan sawangan",
          "sawangan",
          "kecamatan bojongsari",
          "bojongsari",
        ];

        const locQLower = locQ.toLowerCase();

        // Check if the input matches any Depok area names
        const matchesArea = depokAreas.some(
          (area) => locQLower.includes(area) || area.includes(locQLower)
        );

        // Check if the input matches any kecamatan names
        const matchesKecamatan = depokKecamatans.some(
          (kec) => locQLower.includes(kec) || kec.includes(locQLower)
        );

        // If searching for a specific Depok area or kecamatan
        if (matchesArea || matchesKecamatan) {
          // Check if the item's location contains the area name and is in Depok
          const locationMatch =
            x.location.toLowerCase().includes(locQLower) ||
            depokAreas.some(
              (area) =>
                x.location.toLowerCase().includes(area) &&
                locQLower.includes(area)
            ) ||
            depokKecamatans.some(
              (kec) =>
                x.location.toLowerCase().includes(kec) &&
                locQLower.includes(kec)
            );

          // Also check if the location is in Depok
          const inDepok = x.location.toLowerCase().includes("depok");

          // Then apply name filter if also specified
          const nameCheck = !nameQ || x.name.toLowerCase().includes(nameQ);

          return locationMatch && inDepok && nameCheck;
        } else {
          // General search - match location and ensure it's in Depok
          const locationMatch = x.location.toLowerCase().includes(locQLower);
          const inDepok = x.location.toLowerCase().includes("depok");
          // Then apply name filter if also specified
          const nameCheck = !nameQ || x.name.toLowerCase().includes(nameQ);
          return locationMatch && inDepok && nameCheck;
        }
      });

      // Then apply name filter if also specified
      if (nameQ) {
        result = result.filter((x) => x.name.toLowerCase().includes(nameQ));
      }
    } else if (nameQ) {
      // If only name is specified, apply to all
      result = result.filter((x) => x.name.toLowerCase().includes(nameQ));
    }

    // Apply time and price sorting (we handle this client-side after filtering)
    result = [...result]; // Create a copy for sorting

    // First sort by price if price filter is selected
    if (priceFilter) {
      if (priceFilter === "rendah-tinggi") {
        result.sort((a, b) => a.price - b.price);
      } else if (priceFilter === "tinggi-rendah") {
        result.sort((a, b) => b.price - a.price);
      }
    }
    // Then sort by time if time filter is selected
    else if (timeFilter) {
      if (timeFilter === "terbaru") {
        result.sort((a, b) => b.rating - a.rating);
      } else if (timeFilter === "terlama") {
        result.sort((a, b) => a.rating - b.rating);
      }
    }
    // Otherwise sort by rating
    else {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [items, umkmSearch, locationSearch, timeFilter, priceFilter]);

  // Kumpulan chip kategori “fixed” (ikon)
  const chipDefs = [
    {
      id: "all",
      label: "Tampilkan Semua",
      icon: faUtensils,
      iconColor: semanticColors.textPrimary,
    },
    { id: "featured", label: "Pilihan Kami", special: "featured" as const },
    { id: "halal", label: "Halal", special: "halal" as const },
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
    { id: "dessert", label: "Dessert", icon: faIceCream, iconColor: "#FF69B4" },
    { id: "pizza", label: "Pizza", icon: faPizzaSlice, iconColor: "#90EE90" },
    {
      id: "seafood",
      label: "Seafood",
      icon: faFish,
      iconColor: "#FF4500",
    },
  ];

  // UI chips scroll
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  // ————————————————— UI
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: colors.neutral[3] }}
    >
      <Header
        onNavigateToLogin={() => navigate("/login")}
        onNavigateToSignUp={() => navigate("/signup")}
        onNavigateToHome={() => navigate("/")}
        onNavigateToDetailKios={(id) => navigate(`/detail/${id}`)}
        showSearch
        locationSearch={locationSearch}
        onLocationSearchChange={setLocationSearch}
        onLocationPlaceSelect={(_, location) => {
          setLocationSearch(location);
        }}
        umkmSearch={umkmSearch}
        onUmkmSearchChange={setUmkmSearch}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        priceFilter={priceFilter}
        onPriceFilterChange={setPriceFilter}
        userProfile={
          isLoggedIn
            ? {
                name: "User",
                imageUrl: profileImageUrl || undefined,
                onSettingsClick: () => navigate("/settings"),
                onLogoutClick: () => {
                  localStorage.removeItem("isLoggedIn");
                  window.location.reload();
                },
              }
            : undefined
        }
      />

      {/* Banner */}
      <section className="px-4 sm:px-6 lg:px-20 py-6">
        <div className="max-w-[1440px] mx-auto">
          {loading ? (
            <div className="flex justify-center py-16">
              <p style={{ color: semanticColors.textPrimary }}>Loading…</p>
            </div>
          ) : filtered.length > 0 ? (
            <Banner
              image={filtered[0].placeImage}
              title={filtered[0].name}
              description={`${
                filtered[0].description
              } — Harga mulai dari Rp${filtered[0].price.toLocaleString()}`}
              isPilihanKami={filtered[0].isPilihanKami}
              onViewClick={() => navigate(`/detail/${filtered[0].id}`)}
            />
          ) : (
            <Banner
              image="https://images.unsplash.com/photo-1634871572365-8bc444e6faea?w=1920&h=650&fit=crop&q=80&auto=format"
              title="UMKM tidak ditemukan"
              description="Coba ubah filter kategori atau pencarian."
              isPilihanKami={false}
              onViewClick={() => {}}
            />
          )}
        </div>
      </section>

      {/* Chips + Filter */}
      <section
        className="px-4 sm:px-6 lg:px-20 py-0 lg:py-3"
        style={{ backgroundColor: colors.neutral[3] }}
      >
        <div className="max-w-[1440px] mx-auto flex gap-4 items-center">
          <div
            ref={chipsContainerRef}
            className="flex gap-4 flex-1 min-w-0 overflow-x-auto scrollbar-hide scroll-smooth flex-nowrap"
            style={{ touchAction: "pan-x", WebkitOverflowScrolling: "touch" }}
          >
            {/* Kategori fixed */}
            {chipDefs.map((c) => {
              // PILIHAN KAMI
              if (c.special === "featured") {
                return (
                  <ChipSelector
                    key="featured"
                    icon={
                      <CheckBadgeIcon width={20} height={20} color="#facc15" />
                    }
                    isSelected={onlyFeatured}
                    onClick={() => {
                      setOnlyFeatured((v) => {
                        const newVal = !v;
                        if (newVal) {
                          setOnlyHalal(false);
                          setSelected("all");
                        }
                        return newVal;
                      });
                    }}
                  >
                    Pilihan Kami
                  </ChipSelector>
                );
              }

              // HALAL
              if (c.special === "halal") {
                return (
                  <ChipSelector
                    key="halal"
                    icon={<HalalIcon width={20} height={20} />}
                    isSelected={onlyHalal}
                    onClick={() => {
                      setOnlyHalal((v) => {
                        const newVal = !v;
                        if (newVal) {
                          setOnlyFeatured(false);
                          setSelected("all");
                        }
                        return newVal;
                      });
                    }}
                  >
                    Halal
                  </ChipSelector>
                );
              }

              // TAMPILKAN SEMUA
              if (c.id === "all") {
                return (
                  <ChipSelector
                    key="all"
                    icon={
                      <FontAwesomeIcon
                        icon={faUtensils}
                        style={{ color: "#2563eb" }}
                      />
                    }
                    isSelected={
                      selected === "all" && !onlyHalal && !onlyFeatured
                    }
                    onClick={clearFilters}
                  >
                    Tampilkan Semua
                  </ChipSelector>
                );
              }

              // KATEGORI
              return (
                <ChipSelector
                  key={c.id}
                  icon={
                    c.icon ? (
                      <FontAwesomeIcon
                        icon={c.icon}
                        className="w-5 h-5"
                        style={{ color: c.iconColor || "#444" }}
                      />
                    ) : null
                  }
                  isSelected={selected === c.label}
                  onClick={() => {
                    setSelected(c.label);
                    setOnlyFeatured(false);
                    setOnlyHalal(false);
                  }}
                >
                  {c.label}
                </ChipSelector>
              );
            })}

            {/* Kategori dinamis dari Firestore (kalau ada yang tidak ada di list di atas) */}
            {allCategories
              .filter((k) => !chipDefs.some((d) => d.label === k))
              .map((k) => (
                <ChipSelector
                  key={k}
                  icon={
                    <FontAwesomeIcon
                      icon={getIconForCategory(k)}
                      className="w-5 h-5"
                    />
                  }
                  isSelected={selected === k}
                  onClick={() => {
                    setSelected(k);
                    setOnlyFeatured(false);
                    setOnlyHalal(false);
                  }}
                  className="shrink-0"
                >
                  {k}
                </ChipSelector>
              ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <FilterDropdown
              label="Filter"
              timeFilter={timeFilter}
              priceFilter={priceFilter}
              onTimeFilterChange={setTimeFilter}
              onPriceFilterChange={setPriceFilter}
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 sm:px-6 lg:px-20 py-6 flex-1">
        <div className="max-w-[1440px] mx-auto">
          {loading ? (
            <div className="flex justify-center py-16">
              <p style={{ color: semanticColors.textPrimary }}>Memuat data…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex justify-center py-16">
              <p style={{ color: semanticColors.textPrimary }}>
                Tidak ada data kios
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[30px] mb-8">
                {filtered.map((k) => {
                  const showHalalStatus =
                    (selected === "all" || onlyHalal) && k.isHalal;

                  return (
                    <KiosCard
                      key={k.id}
                      image={k.placeImage}
                      name={k.name}
                      categories={k.categories}
                      description={k.description}
                      location={k.location}
                      rating={k.rating}
                      operatingHours={k.operatingHours}
                      isPilihanKami={k.isPilihanKami}
                      isHalal={showHalalStatus}
                      awningColor={getAwningColor(k)}
                      price={k.price}
                      onClick={() => navigate(`/detail/${k.id}`)}
                    />
                  );
                })}
              </div>

              {/* Load more */}
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  disabled={!cursor || loadingMore}
                  onClick={fetchNextPage}
                  rightIcon={
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="w-4 h-4"
                    />
                  }
                  className="px-8"
                >
                  {loadingMore
                    ? "Memuat..."
                    : cursor
                    ? "Tampilkan lebih Banyak"
                    : "Sudah tampil semua"}
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
