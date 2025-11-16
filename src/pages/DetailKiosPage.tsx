import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, googleMapsApiKey } from "../firebase";

import {
  Header,
  Footer,
  ProductCard,
  GoFoodIcon,
  ShopeeFoodIcon,
  WhatsappIcon,
  InstagramIcon,
} from "../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faPizzaSlice,
} from "@fortawesome/free-solid-svg-icons";

import { semanticColors, brandColors, colors } from "../styles/colors";

import {
  faUtensils,
  faMugHot,
  faCookie,
  faBowlRice,
  faIceCream,
  faPepperHot,
} from "@fortawesome/free-solid-svg-icons";

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

type FirestoreKios = {
  "Nama UMKM": string;
  "Deskripsi UMKM"?: string;
  Alamat?: string;
  Rating?: string | number;
  "Total Review"?: string | number;
  "Tahun Berdiri"?: string;
  "Jam Buka"?: string;
  "Jam Operasional"?: string;
  "Pilihan Kami"?: boolean | string;
  Rekomendasi?: boolean | string;
  Kategori?: string | string[];
  "Place ID"?: string;
  "Foto UMKM"?: string;
  "Foto Tempat"?: string;
  "Foto Produk"?: string;
  "Harga Produk"?: string;
  "Website / IG / ShopeeFood / GoFood"?: string;
  "Katalog Produk"?: string;
  katalogProduk?: string;
};

type KiosData = {
  name: string;
  description: string;
  image: string;
  address: string;
  rating: number;
  totalReviews: number;
  establishedDate: string;
  operatingHours: string;
  isPilihanKami: boolean;
  jenisProduk: string[];
  placeId: string;
  socialLinks: string;
  katalogImage?: string;
};

type ProductItem = {
  id: number | string;
  name: string;
  price: number;
  image: string;
};

const convertFirestoreToKios = (raw: any): KiosData => {
  return {
    // NAME
    name: raw.namaKios ?? raw["Nama UMKM"] ?? "UMKM",

    // DESCRIPTION
    description:
      raw.deskripsi ??
      raw["Deskripsi UMKM"] ??
      `Tentang ${raw.namaKios ?? "UMKM"}`,

    // IMAGE: tempat dulu → fallback fotoKios → fallback default
    image:
      raw["Foto Tempat"] ??
      (Array.isArray(raw.fotoKios) ? raw.fotoKios[0] : null) ??
      raw["Foto UMKM"] ??
      "https://source.unsplash.com/800x600/?food",

    // ADDRESS
    address: raw.alamat?.text ?? raw["Alamat"] ?? "Alamat tidak tersedia",

    // RATING
    rating:
      typeof raw.rating === "number"
        ? raw.rating
        : parseFloat(raw.rating ?? raw.Rating ?? "0"),

    // TOTAL REVIEW
    totalReviews:
      typeof raw.totalReview === "number"
        ? raw.totalReview
        : parseInt(raw.totalReview ?? raw["Total Review"] ?? "0"),

    // OPERATING HOURS
    operatingHours:
      raw.jamBuka && raw.jamTutup
        ? `${raw.jamBuka} - ${raw.jamTutup}`
        : raw["Jam Operasional"] ?? raw["Jam Buka"] ?? "-",

    // PILIHAN KAMI
    isPilihanKami:
      raw.pilihanKami === true ||
      raw["Pilihan Kami"] === true ||
      raw.Rekomendasi === true,

    // ESTABLISHED DATE
    establishedDate: raw["Tahun Berdiri"] ?? "Tidak diketahui",
    // JENIS PRODUK
    jenisProduk: raw.kategori
      ? [raw.kategori.toLowerCase()] // kategori dari Settings
      : Array.isArray(raw.jenisProduk)
      ? raw.jenisProduk
      : Array.isArray(raw.Kategori)
      ? raw.Kategori
      : raw.Kategori
      ? [raw.Kategori]
      : [],

    // PLACE ID
    placeId: raw.alamat?.placeId ?? raw["Place ID"] ?? "",

    // 🔥 Tambahkan sosial media
    socialLinks: raw["Website / IG / ShopeeFood / GoFood"] ?? "",

    // KATALOG PRODUK
    katalogImage:
      Array.isArray(raw.katalogProduk) && raw.katalogProduk.length > 0
        ? raw.katalogProduk[0].image
        : null,
  };
};

const detectCategory = (categories: string) => {
  const text = categories.toLowerCase();

  const mapping = [
    {
      name: "Makanan",
      keywords: ["ayam", "bakso", "mie", "nasi", "geprek", "goreng"],
      icon: faUtensils,
      color: "#FF6B35",
    },
    {
      name: "Minuman",
      keywords: ["kopi", "susu", "milk", "teh", "drink", "jus"],
      icon: faMugHot,
      color: "#4A90E2",
    },
    {
      name: "Cemilan",
      keywords: ["snack", "cemilan", "kue", "jajanan"],
      icon: faCookie,
      color: "#D2691E",
    },
    { name: "Kopi", keywords: ["kopi"], icon: faMugHot, color: "#6F4E37" },
    {
      name: "Nusantara",
      keywords: ["sate", "rawon", "soto", "pecel", "lalapan"],
      icon: faBowlRice,
      color: "#000",
    },
    {
      name: "Dessert",
      keywords: ["dessert", "es krim", "ice cream", "puding"],
      icon: faIceCream,
      color: "#FF69B4",
    },
    {
      name: "Pizza",
      keywords: ["pizza"],
      icon: faPizzaSlice,
      color: "#90EE90",
    },
    {
      name: "Seafood",
      keywords: ["ikan", "udang", "cumi", "seafood"],
      icon: faPepperHot,
      color: "#FF4500",
    },
  ];

  return mapping.filter((m) => m.keywords.some((k) => text.includes(k)));
};

// Fungsi untuk mengekstrak URL dari teks socialLinks
const extractSocialLink = (text: string, platform: string): string => {
  // Cari URL dalam teks
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  if (platform === "whatsapp") {
    // Cek apakah ada nomor WhatsApp dalam teks
    const whatsappRegex =
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}/g;
    const match = text.match(whatsappRegex);
    if (match) {
      // Ambil nomor pertama dan format untuk link WhatsApp
      const phoneNumber = match[0].replace(/\D/g, "");
      // Format nomor untuk WhatsApp (tanpa nol di awal, dengan kode negara)
      let formattedNumber = phoneNumber;
      if (phoneNumber.startsWith("0")) {
        formattedNumber = "62" + phoneNumber.substring(1);
      } else if (phoneNumber.startsWith("62")) {
        formattedNumber = phoneNumber;
      }
      return `https://wa.me/${formattedNumber}`;
    }
    // Coba temukan URL yang berisi kata 'whatsapp'
    const urls = text.match(urlRegex);
    if (urls) {
      const whatsappUrl = urls.find((url) => url.includes("whatsapp"));
      if (whatsappUrl) {
        return whatsappUrl;
      }
    }
    return "#";
  }

  if (platform === "instagram") {
    // Cek apakah ada URL Instagram dalam teks
    const urls = text.match(urlRegex);
    if (urls) {
      const instagramUrl = urls.find((url) => url.includes("instagram.com"));
      if (instagramUrl) {
        return instagramUrl;
      }
    }
    // Jika hanya username Instagram
    const igUsernameRegex = /@?([\w.]+)/g;
    const igMatches = text.match(igUsernameRegex);
    if (igMatches) {
      // Coba temukan yang terlihat seperti username Instagram
      for (const match of igMatches) {
        if (
          match.includes("ig") ||
          match.includes("instagram") ||
          (!match.includes("@") && match.length <= 30 && !match.includes(" "))
        ) {
          const cleanUsername = match.replace("@", "").split(/[,\s]/)[0];
          if (cleanUsername) {
            return `https://www.instagram.com/${cleanUsername}`;
          }
        }
      }
    }
    return "#";
  }

  if (platform === "gofood") {
    // Cek apakah ada URL GoFood dalam teks
    const urls = text.match(urlRegex);
    if (urls) {
      const gofoodUrl = urls.find(
        (url) => url.includes("gofood.co.id") || url.includes("gojek.com")
      );
      if (gofoodUrl) {
        return gofoodUrl;
      }
    }
    return "#";
  }

  if (platform === "shopee") {
    // Cek apakah ada URL ShopeeFood dalam teks
    const urls = text.match(urlRegex);
    if (urls) {
      const shopeeFoodUrl = urls.find(
        (url) =>
          url.includes("shopee.co.id") &&
          (url.includes("food") || url.toLowerCase().includes("sf"))
      );
      if (shopeeFoodUrl) {
        return shopeeFoodUrl;
      }
    }
    return "#";
  }

  // Jika tidak ada URL eksplisit, kembalikan link default
  return "#";
};

export default function DetailKiosPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [kiosData, setKiosData] = useState<KiosData | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);

  // Responsive stripes
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const profileImageUrl = undefined;

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        let raw: FirestoreKios | null = null;

        // 🔍 CARI di semua koleksi
        for (const col of KIOS_COLLECTIONS) {
          const snap = await getDoc(doc(db, col, id));
          if (snap.exists()) {
            raw = snap.data() as FirestoreKios;
            break;
          }
        }

        if (!raw) {
          console.log("UMKM tidak ditemukan");
          setLoading(false);
          return;
        }

        setKiosData(convertFirestoreToKios(raw));

        let imageUrl = "";

        // Ambil dari Katalog Produk
        if (raw["Katalog Produk"]) {
          const katalogStr = raw["Katalog Produk"];
          if (typeof katalogStr === "string") {
            imageUrl = katalogStr.replace("Katalog:", "").trim();
          }
        }

        // Jika tetap kosong, fallback ke Foto Produk
        if (!imageUrl && raw["Foto Produk"]) {
          imageUrl = raw["Foto Produk"]!;
        }

        // Jika tetap kosong, pakai default
        if (!imageUrl) {
          imageUrl = "https://source.unsplash.com/800x600/?food";
        }

        if (Array.isArray(raw.katalogProduk)) {
          setProducts(
            raw.katalogProduk.map((p: any) => ({
              id: p.id,
              name: p.name,
              price: Number(p.price), // convert string → number
              image: p.image,
            }))
          );
        } else {
          setProducts([]);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center mt-20 text-lg text-gray-700">
        Loading...
      </div>
    );

  if (!kiosData)
    return (
      <div className="flex flex-col justify-center mt-20 text-center text-lg">
        UMKM tidak ditemukan
        <button className="mt-5 underline" onClick={() => navigate("/")}>
          Kembali ke Home
        </button>
      </div>
    );

  const totalStripes = isMobile ? 19 : isTablet ? 35 : 25;
  const awningColor = kiosData.isPilihanKami
    ? colors.secondary[400]
    : brandColors.primary;

  return (
    <div style={{ backgroundColor: colors.neutral[3] }}>
      <Header
        onNavigateToHome={() => navigate("/")}
        onNavigateToLogin={() => navigate("/login")}
        onNavigateToSignUp={() => navigate("/signup")}
        onNavigateToDetailKios={() => {}}
        showSearch
        locationSearch=""
        umkmSearch=""
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

      {/* Breadcrumb */}
      <section className="px-4 sm:px-6 lg:px-20 pt-6">
        <div className="max-w-[1440px] mx-auto flex items-center gap-2">
          <button onClick={() => navigate("/")} className="text-sm">
            Home
          </button>
          <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
          <span className="text-sm">{kiosData.name}</span>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="px-4 sm:px-6 lg:px-20 py-6">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8 lg:items-stretch">
          {/* Left: Banner + Info */}
          <div className="flex flex-col gap-4 w-full lg:w-fit lg:shrink-0">
            {/* Image with Awning */}
            <div className="relative w-full flex-1 rounded-[12px] overflow-hidden min-h-[330px]">
              <img
                src={kiosData.image}
                className="absolute inset-0 w-full h-full object-cover"
                alt={kiosData.name}
              />

              {/* Gradient Overlay */}
              <div
                className="absolute inset-0 rounded-[12px]"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.75))",
                }}
              />

              {/* Awning Cover */}
              <div className="absolute top-0 left-0 right-0 h-[37px] flex">
                {[...Array(totalStripes)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-full rounded-b-[12px] ${
                      i === 0 ? "rounded-tl-[12px]" : ""
                    } ${i === totalStripes - 1 ? "rounded-tr-[12px]" : ""}`}
                    style={{
                      backgroundColor: i % 2 === 0 ? awningColor : "#ffffff",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div
              className="flex items-center lg:justify-center lg:gap-3 px-6 py-3 rounded-[12px] w-full"
              style={{ backgroundColor: semanticColors.bgPrimary }}
            >
              <div className="flex-1 lg:flex-none flex flex-col gap-[6px] items-center">
                <p
                  className="font-dm-sans font-regular text-sm text-center"
                  style={{ color: semanticColors.textSecondary }}
                >
                  Jam Buka
                </p>
                <p
                  className="font-dm-sans font-bold text-lg"
                  style={{ color: semanticColors.textPrimary }}
                >
                  {kiosData.operatingHours}
                </p>
              </div>

              <div
                className="h-12 w-px"
                style={{
                  borderLeft: `1px solid ${semanticColors.borderMedium}`,
                }}
              />

              <div className="flex-1 lg:flex-none flex flex-col gap-[6px] items-center">
                <p
                  className="font-dm-sans font-regular text-sm text-center"
                  style={{ color: semanticColors.textSecondary }}
                >
                  Rating
                </p>
                <p
                  className="font-dm-sans font-bold text-lg"
                  style={{ color: semanticColors.textPrimary }}
                >
                  {kiosData.rating.toFixed(1)}
                </p>
              </div>

              <div
                className="h-12 w-px"
                style={{
                  borderLeft: `1px solid ${semanticColors.borderMedium}`,
                }}
              />

              <div className="flex-1 lg:flex-none flex flex-col gap-[6px] items-center">
                <p
                  className="font-dm-sans font-regular text-sm text-center"
                  style={{ color: semanticColors.textSecondary }}
                >
                  Total Review
                </p>
                <p
                  className="font-dm-sans font-bold text-lg"
                  style={{ color: semanticColors.textPrimary }}
                >
                  {kiosData.totalReviews}
                </p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col gap-3 w-full">
            {/* Details Card */}
            <div
              className="p-6 rounded-[12px] flex flex-col gap-4"
              style={{ backgroundColor: semanticColors.bgPrimary }}
            >
              {/* Title and Description */}
              <div className="flex flex-col gap-[6px] pb-3" style={{ borderBottom: `1px solid ${semanticColors.borderMedium}` }}>
                <h1
                  className="font-nunito font-black text-2xl sm:text-3xl lg:text-[36px] leading-[100%]"
                  style={{ color: semanticColors.textPrimary }}
                >
                  {kiosData.name}
                </h1>
                <p
                  className="font-dm-sans font-regular text-xs"
                  style={{ color: semanticColors.textSecondary }}
                >
                  {kiosData.description}
                </p>
              </div>

              {/* Category Chips */}
              <div className="flex gap-3 flex-wrap">
                {detectCategory(kiosData.jenisProduk.join(" ")).map(
                  (cat, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-[10px] px-3 py-2 rounded-[12px] border"
                      style={{
                        borderColor: semanticColors.borderMedium,
                        borderWidth: "0.5px",
                        backgroundColor: semanticColors.bgPrimary,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={cat.icon}
                        className="w-4 h-4"
                        style={{ color: cat.color }}
                      />
                      <span
                        className="font-dm-sans font-regular text-sm"
                        style={{ color: semanticColors.textPrimary }}
                      >
                        {cat.name}
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* Social Media Section */}
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <span
                  className="font-dm-sans font-regular text-[10px] sm:text-xs whitespace-nowrap"
                  style={{ color: semanticColors.textSecondary }}
                >
                  Temukan Kami Di:
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={extractSocialLink(kiosData.socialLinks, "shopee")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-[10px] rounded-full border"
                    style={{
                      borderColor: semanticColors.borderMedium,
                      borderWidth: "1px",
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    <ShopeeFoodIcon width={20} height={20} />
                  </a>
                  <a
                    href={extractSocialLink(kiosData.socialLinks, "gofood")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-[10px] rounded-full border"
                    style={{
                      borderColor: semanticColors.borderMedium,
                      borderWidth: "1px",
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    <GoFoodIcon width={20} height={20} />
                  </a>
                  <a
                    href={extractSocialLink(kiosData.socialLinks, "whatsapp")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-[10px] rounded-full border"
                    style={{
                      borderColor: semanticColors.borderMedium,
                      borderWidth: "1px",
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    <WhatsappIcon width={20} height={20} />
                  </a>
                  <a
                    href={extractSocialLink(kiosData.socialLinks, "instagram")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-[10px] rounded-full border"
                    style={{
                      borderColor: semanticColors.borderMedium,
                      borderWidth: "1px",
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    <InstagramIcon width={20} height={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div
              className="p-6 rounded-[12px] flex flex-col gap-4"
              style={{ backgroundColor: semanticColors.bgPrimary }}
            >
              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center gap-[6px]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 1.5C4.205 1.5 2.75 2.955 2.75 4.75C2.75 7.125 6 10.5 6 10.5C6 10.5 9.25 7.125 9.25 4.75C9.25 2.955 7.795 1.5 6 1.5ZM6 6C5.31 6 4.75 5.44 4.75 4.75C4.75 4.06 5.31 3.5 6 3.5C6.69 3.5 7.25 4.06 7.25 4.75C7.25 5.44 6.69 6 6 6Z"
                      fill={semanticColors.textPrimary}
                    />
                  </svg>
                  <h3
                    className="font-dm-sans font-bold text-sm"
                    style={{ color: semanticColors.textPrimary }}
                  >
                    Lihat Melalui Google Map
                  </h3>
                </div>
                <p
                  className="font-dm-sans font-regular text-xs"
                  style={{ color: semanticColors.textSecondary }}
                >
                  {kiosData.address}
                </p>
              </div>

              <div
                className="h-[144px] rounded-[12px] overflow-hidden border-2"
                style={{ borderColor: semanticColors.borderMedium }}
              >
                {kiosData.placeId ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.google.com/maps/embed/v1/place?q=place_id:${kiosData.placeId}&key=${googleMapsApiKey}`}
                    allowFullScreen
                    style={{ border: "none" }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: semanticColors.bgTertiary, color: semanticColors.textSecondary }}
                  >
                    Lokasi tidak tersedia
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="px-4 sm:px-6 lg:px-20 py-6">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-lg font-bold">Katalog Produk</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={String(p.id)}
                image={p.image}
                name={p.name}
                price={p.price}
                kiosName={kiosData.name}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
