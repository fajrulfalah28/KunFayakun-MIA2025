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
} from "firebase/firestore";
import { db } from "../firebase";

const KIOS_COLLECTIONS = [
  "Data Ayam & Geprek",
  "Data Bakso & Mie",
  "Data Jajanan & Snack",
  "Data Kafe & Kopi",
  "Data Katering & Lainnya",
  "Data Pecel Lele",
  "Data Pizza",
  "Data Seafood",
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

interface LandingPageProps {
  isLoggedIn: boolean;
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
  onNavigateToDetailKios: (id: string) => void;
}

// ———————————————————————————————————
// Helpers
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

const parseBool = (value: unknown): boolean => {
  if (value === true) return true;
  if (value === false) return false;
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return false;
};

const toUiKios = (
  doc: QueryDocumentSnapshot<DocumentData, DocumentData>
): UiKios => {
  const raw = doc.data() as Record<string, unknown>;
  let ratingNum = 0;
  if (typeof raw["Rating"] === "string") {
    ratingNum = parseFloat(raw["Rating"] as string);
  } else if (typeof raw["Rating"] === "number") {
    ratingNum = raw["Rating"] as number;
  }

  let categories = "Makanan";
  const rawKategori = raw["Kategori"];
  if (Array.isArray(rawKategori)) {
    categories = (rawKategori as string[]).join(", ");
  } else if (typeof rawKategori === "string") {
    categories = rawKategori as string;
  }

  const lowerCat = categories.toLowerCase();
  const halalKeywords = CATEGORY_MAP["Halal"] || [];
  const isHalalByCategory = halalKeywords.some((k) => lowerCat.includes(k));

  return {
    id: doc.id,

    image:
      (typeof raw["Foto UMKM"] === "string"
        ? (raw["Foto UMKM"] as string)
        : undefined) ||
      guessImageByCategory(raw["Kategori"] as string | string[] | undefined),

    placeImage:
      typeof raw["Foto Tempat"] === "string"
        ? (raw["Foto Tempat"] as string)
        : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",

    price:
      typeof raw["Harga Produk"] === "string"
        ? parseInt(raw["Harga Produk"] as string)
        : 0,

    name:
      (typeof raw["Nama UMKM"] === "string"
        ? (raw["Nama UMKM"] as string)
        : undefined) || "Nama UMKM",

    description:
      (typeof raw["Deskripsi UMKM"] === "string"
        ? (raw["Deskripsi UMKM"] as string)
        : undefined) ||
      `Tentang ${
        typeof raw["Nama UMKM"] === "string"
          ? (raw["Nama UMKM"] as string)
          : "UMKM"
      }`,

    categories,

    location:
      typeof raw["Alamat"] === "string"
        ? (raw["Alamat"] as string).split(",")[0]
        : "Indonesia",

    rating: ratingNum,

    operatingHours:
      typeof raw["Jam Operasional"] === "string"
        ? (raw["Jam Operasional"] as string)
        : "08:00 - 20:00",
    isPilihanKami:
      parseBool(raw["Pilihan Kami"]) ||
      parseBool(raw["pilihan kami"]) ||
      parseBool(raw["Rekomendasi"]) ||
      parseBool(raw["rekomendasi"]),

    isHalal:
      raw["Halal"] === true || raw["halal"] === true || isHalalByCategory,
  };
};

const fetchAllKios = async (): Promise<UiKios[]> => {
  const all: UiKios[] = [];

  for (const colName of KIOS_COLLECTIONS) {
    const colRef = collection(db, colName);
    const snap = await getDocs(colRef);

    snap.forEach((doc) => {
      all.push(toUiKios(doc));
    });
  }

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

const CATEGORY_MAP: Record<string, string[]> = {
  Makanan: ["ayam", "bakso", "mie", "seafood", "lele", "sate", "pizza"],
  Halal: [
    "ayam",
    "bakso",
    "mie",
    "seafood",
    "lele",
    "sate",
    "pizza",
    "kafe",
    "ayam bakar",
    "dessert",
  ],
  Minuman: ["kopi", "teh", "susu", "milkshake", "jus", "kafe"],
  Cemilan: ["snack", "jajanan", "roti", "pastry", "kue"],
  Kopi: ["kopi", "kafe"],
  Nusantara: ["ayam bakar", "sate", "soto", "rawon", "pecel"],
  Dessert: ["dessert", "es krim", "ice cream", "puding", "snack"],
  Pizza: ["pizza"],
  Seafood: ["seafood"],
};

export default function LandingPage({
  isLoggedIn,
  onNavigateToLogin,
  onNavigateToSignUp,
  onNavigateToDetailKios,
}: LandingPageProps) {
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

  // Build query sesuai filter
  // const buildBaseQuery = (): Query<FireKios> => {
  //   const col = collection(db, "kios") as CollectionReference<FireKios>;

  //   let qRef: Query<FireKios> = query(col, orderBy("Rating", "desc"));

  //   // kategori utama
  //   if (selected !== "all") {
  //     qRef = query(
  //       col,
  //       where("Kategori", "in", [selected]),
  //       orderBy("Rating", "desc")
  //     );
  //   }

  //   // halal / featured
  //   const wheres: ReturnType<typeof where>[] = [];
  //   if (onlyHalal) wheres.push(where("Halal", "==", true));
  //   if (onlyFeatured) wheres.push(where("Pilihan Kami", "==", true));

  //   if (wheres.length > 0) {
  //     // hanya halal/featured
  //     qRef = query(col, ...wheres, orderBy("Rating", "desc"));

  //     // kategori + halal/featured
  //     if (selected !== "all") {
  //       qRef = query(
  //         col,
  //         where("Kategori", "in", [selected]),
  //         ...wheres,
  //         orderBy("Rating", "desc")
  //       );
  //     }
  //   }

  //   return qRef;
  // };

  const clearFilters = () => {
    setOnlyFeatured(false);
    setOnlyHalal(false);
    setSelected("all");
  };

  const applyFilter = (all: UiKios[]): UiKios[] => {
    const filtered = [...all];

    // PILIHAN KAMI
    if (onlyFeatured) {
      return filtered
        .filter((x) => x.isPilihanKami)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10);
    }

    // HALAL
    if (onlyHalal) {
      return filtered
        .filter((x) => x.isHalal)
        .sort((a, b) => b.rating - a.rating);
    }

    // KATEGORI
    if (selected !== "all") {
      const keywords = CATEGORY_MAP[selected] || [];

      return filtered.filter((x) => {
        const cat = x.categories.toLowerCase();
        return keywords.some((k) => cat.includes(k));
      });
    }

    // DEFAULT - semua
    return filtered.sort((a, b) => b.rating - a.rating);
  };

  // Fetch pertama / saat filter berubah
  const fetchFirstPage = async () => {
    setLoading(true);
    try {
      const all = await fetchAllKios();

      const result = applyFilter(all);

      const firstPage = result.slice(0, PAGE_SIZE);
      setItems(firstPage);

      setCursor(firstPage.length);
    } finally {
      setLoading(false);
    }
  };

  const getAwningColor = (k: UiKios) => {
    if (onlyFeatured) return "yellow";
    if (selected === "all") return k.isPilihanKami ? "yellow" : "red";
    return "red";
  };

  // Load more
  const fetchNextPage = async () => {
    if (cursor === null) return;

    setLoadingMore(true);

    try {
      const all = await fetchAllKios();

      // filter kategori
      let filtered = all;

      if (selected !== "all") {
        const keywords = CATEGORY_MAP[selected] || [];
        filtered = filtered.filter((x) => {
          const cat = x.categories.toLowerCase();
          return keywords.some((k) => cat.includes(k));
        });
      }

      if (onlyHalal) filtered = filtered.filter((x) => x.isHalal);
      if (onlyFeatured) filtered = filtered.filter((x) => x.isPilihanKami);

      filtered = filtered.sort((a, b) => b.rating - a.rating);

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
  }, [selected, onlyFeatured, onlyHalal]);

  // Search lokal (client-side) untuk nama/alamat—cukup ringan
  const filtered = useMemo(() => {
    const nameQ = umkmSearch.trim().toLowerCase();
    const locQ = locationSearch.trim().toLowerCase();
    return items.filter((x) => {
      const okName = !nameQ || x.name.toLowerCase().includes(nameQ);
      const okLoc = !locQ || x.location.toLowerCase().includes(locQ);
      return okName && okLoc;
    });
  }, [items, umkmSearch, locationSearch]);

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
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToSignUp={onNavigateToSignUp}
        onNavigateToHome={() => {}}
        onNavigateToDetailKios={() => {}}
        showSearch
        locationSearch={locationSearch}
        onLocationSearchChange={setLocationSearch}
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
                imageUrl: "https://i.pravatar.cc/100",
                onClick: () => {},
                onSettingsClick: () => onNavigateToDetailKios("settings"),
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
              onViewClick={() => onNavigateToDetailKios(filtered[0].id)}
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
                      onClick={() => onNavigateToDetailKios(k.id)}
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
