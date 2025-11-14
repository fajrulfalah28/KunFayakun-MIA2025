import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, googleMapsApiKey } from "../firebase";

import { Header, Footer, ProductCard, CheckBadgeIcon } from "../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
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

const convertFirestoreToKios = (raw: FirestoreKios): KiosData => {
  const ratingNum =
    typeof raw.Rating === "number" ? raw.Rating : parseFloat(raw.Rating ?? "0");

  const totalReviewNum =
    typeof raw["Total Review"] === "number"
      ? raw["Total Review"]
      : parseInt(raw["Total Review"] ?? "0");

  return {
    name: raw["Nama UMKM"],
    description: raw["Deskripsi UMKM"] ?? `Tentang ${raw["Nama UMKM"]}`,

    // 🔥 FIX foto tempat
    image: raw["Foto Tempat"] ?? raw["Foto UMKM"] ?? "",

    address: raw["Alamat"] ?? "",
    rating: ratingNum,
    totalReviews: totalReviewNum,

    // 🔥 Hapus "Berdiri Sejak" (isi tetap tapi tidak dipakai UI)
    establishedDate: raw["Tahun Berdiri"] ?? "",

    operatingHours: raw["Jam Buka"] ?? raw["Jam Operasional"] ?? "-",

    // 🔥 FIX pilihan kami
    isPilihanKami:
      raw["Pilihan Kami"] === true ||
      raw.Rekomendasi === true ||
      raw.Rekomendasi === "true",

    // 🔥 convert kategori jadi array
    jenisProduk: Array.isArray(raw.Kategori)
      ? raw.Kategori
      : raw.Kategori
      ? [raw.Kategori]
      : [],

    placeId: raw["Place ID"] ?? "",

    // 🔥 Tambahkan sosial media
    socialLinks: raw["Website / IG / ShopeeFood / GoFood"] ?? "",
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
      color: "90EE90",
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

export default function DetailKiosPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [kiosData, setKiosData] = useState<KiosData | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);

  // Responsive stripes
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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

        setProducts([
          {
            id: 1,
            name: raw["Nama UMKM"] + " — Produk 1",
            price: parseInt(raw["Harga Produk"] ?? "0"),
            image: imageUrl,
          },
        ]);

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
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8">
          {/* Left: Banner + Info */}
          <div className="flex flex-col gap-4 w-full lg:w-fit">
            <div className="relative w-full min-h-[330px] rounded-[12px] overflow-hidden">
              <img
                src={kiosData.image}
                className="absolute inset-0 w-full h-full object-cover"
                alt={kiosData.name}
              />

              {/* Awning Cover */}
              <div className="absolute top-0 left-0 right-0 h-[37px] flex">
                {[...Array(totalStripes)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-full ${
                      i === 0 ? "rounded-tl-[12px]" : ""
                    } ${i === totalStripes - 1 ? "rounded-tr-[12px]" : ""}`}
                    style={{
                      backgroundColor: i % 2 === 0 ? awningColor : "#ffffff",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Info Grid */}
            <div
              className="grid grid-cols-2 sm:flex gap-6 px-6 py-3 rounded-[12px]"
              style={{ backgroundColor: semanticColors.bgPrimary }}
            >
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-500">Jam Buka</p>
                <p className="text-lg font-bold">{kiosData.operatingHours}</p>
              </div>

              <div className="hidden sm:block h-12 w-px bg-gray-300" />

              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-500">Rating</p>
                <p className="text-lg font-bold">{kiosData.rating}</p>
              </div>

              <div className="hidden sm:block h-12 w-px bg-gray-300" />

              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-500">Total Review</p>
                <p className="text-lg font-bold">{kiosData.totalReviews}</p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col gap-4">
            <div
              className="p-6 rounded-[12px]"
              style={{ backgroundColor: semanticColors.bgPrimary }}
            >
              <h1 className="text-3xl font-black">{kiosData.name}</h1>
              <p className="mt-1 text-gray-600">{kiosData.description}</p>

              <div className="flex gap-2 mt-3 flex-wrap">
                {kiosData.isPilihanKami && (
                  <div className="flex items-center px-2 py-1 border rounded-md gap-1">
                    <CheckBadgeIcon width={14} height={14} />
                    <span className="text-xs">Pilihan Kami</span>
                  </div>
                )}

                {/* Halal */}
                {kiosData.jenisProduk.some((c) =>
                  c.toLowerCase().includes("halal")
                ) && (
                  <div className="flex items-center px-2 py-1 border rounded-md gap-1">
                    <span className="text-xs">Halal</span>
                  </div>
                )}

                {/* Kategori */}
                {detectCategory(kiosData.jenisProduk.join(" ")).map(
                  (cat, i) => (
                    <div
                      key={i}
                      className="flex items-center px-2 py-1 border rounded-md gap-1"
                    >
                      <FontAwesomeIcon
                        icon={cat.icon}
                        className="w-3 h-3"
                        style={{ color: cat.color }}
                      />
                      <span className="text-xs">{cat.name}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {kiosData.socialLinks.trim() !== "" && (
              <div className="flex items-center gap-3 mt-3">
                <span className="text-sm text-gray-500">Temukan Kami di:</span>

                {kiosData.socialLinks.includes("instagram") && (
                  <img src="/icons/ig.svg" className="w-6 h-6" />
                )}

                {kiosData.socialLinks.includes("gofood") && (
                  <img src="/icons/gofood.svg" className="w-6 h-6" />
                )}

                {kiosData.socialLinks.includes("shopee") && (
                  <img src="/icons/shopee.svg" className="w-6 h-6" />
                )}
              </div>
            )}

            {/* Map */}
            <div
              className="p-6 rounded-[12px]"
              style={{ backgroundColor: semanticColors.bgPrimary }}
            >
              <div className="flex gap-2 items-center">
                <FontAwesomeIcon icon={faLocationDot} />
                <h3 className="font-bold text-sm">Lokasi UMKM</h3>
              </div>

              <p className="text-xs text-gray-600 mt-1">{kiosData.address}</p>

              <div className="h-[150px] rounded-[12px] border mt-3 overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.google.com/maps/embed/v1/place?q=place_id:${kiosData.placeId}&key=${googleMapsApiKey}`}
                  allowFullScreen
                />
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
