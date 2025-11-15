import { useState, useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faEye,
  faEyeSlash,
  faTimes,
  faPlus,
  faUtensils,
  faMugHot,
  faCookie,
  faBowlRice,
  faIceCream,
  faLeaf,
  faPepperHot,
} from "@fortawesome/free-solid-svg-icons";
import {
  Header,
  Footer,
  Button,
  TextField,
  Input,
  Select,
  ChipSelector,
  HalalIcon,
} from "../components";
import { semanticColors, colors } from "../styles/colors";
import WhatsappIcon from "../components/icons/WhatsappIcon";
import ShopeeFoodIcon from "../components/icons/ShopeeFoodIcon";
import GoFoodIcon from "../components/icons/GoFoodIcon";
import InstagramIcon from "../components/icons/InstagramIcon";
import { useNavigate } from "react-router-dom";
import DefaultProfileAvatar from "../components/icons/DefaultProfileAvatar";
import { doc, GeoPoint, onSnapshot, setDoc } from "firebase/firestore";
import { db, auth, googleMapsApiKey } from "../firebase";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// Tipe data untuk produk (memperbolehkan File untuk upload baru)
type Product = {
  id: number;
  image: string | File | null;
  name: string;
  price: string;
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const goLogin = () => navigate("/login");
  const goSignup = () => navigate("/signup");
  const goHome = () => navigate("/");
  const goDetailKios = () => navigate("/detail/:id");
  const goSettings = () => navigate("/settings");

  const [locationSearch, setLocationSearch] = useState("");
  const [umkmSearch, setUmkmSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  // Profile Settings State
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined
  );
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Kios Profile State
  const [kiosImages, setKiosImages] = useState<(string | File)[]>([]); // Bisa string (URL) atau File
  const [kiosName, setKiosName] = useState("");
  const [kiosDescription, setKiosDescription] = useState("");
  const [selectedJenisProduk, setSelectedJenisProduk] = useState<string[]>([]);
  const [openingTime, setOpeningTime] = useState("17:00");
  const [closingTime, setClosingTime] = useState("22:00");

  // Jadikan state agar bisa dimuat dari Firestore
  const [kiosAddress, setKiosAddress] = useState(
    "Klik di peta untuk mengatur lokasi..."
  );
  const [kiosPlaceId, setKiosPlaceId] = useState<string | null>(null);
  const [kiosGeopoint, setKiosGeopoint] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerInstanceRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const [shopeeFoodUrl, setShopeeFoodUrl] = useState("");
  const [goFoodUrl, setGoFoodUrl] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [isSavingKios, setIsSavingKios] = useState(false); // State untuk loading simpan

  // Refs untuk File Inputs
  const kiosImageInputRef = useRef<HTMLInputElement>(null);
  const productImageInputRef = useRef<HTMLInputElement>(null);
  const [activeProductUploadId, setActiveProductUploadId] = useState<
    number | null
  >(null);

  const [kategoriManual, setKategoriManual] = useState<string>("");

  const kategoriOptions = [
    "ayam",
    "bakso",
    "mie",
    "seafood",
    "pecel",
    "pizza",
    "snacks",
    "food",
    "kopi",
  ];

  // Available jenis produk categories
  const jenisProdukOptions = [
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
    { id: "diet", label: "Diet", icon: faLeaf, iconColor: "#90EE90" },
    { id: "pedas", label: "Pedas", icon: faPepperHot, iconColor: "#FF4500" },
    {
      id: "halal",
      label: "Halal",
      icon: null,
      iconColor: undefined,
      useHalalIcon: true,
    },
  ];

  const handleJenisProdukToggle = (categoryId: string) => {
    if (selectedJenisProduk.includes(categoryId)) {
      setSelectedJenisProduk(
        selectedJenisProduk.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedJenisProduk([...selectedJenisProduk, categoryId]);
    }
  };

  // Product Catalog State
  const [products, setProducts] = useState<Product[]>([]);

  const updateHapusContainerRef = useRef<HTMLDivElement>(null);
  const tambahProdukContainerRef = useRef<HTMLDivElement>(null);

  // Sync button widths on products change and window resize
  useEffect(() => {
    const syncWidths = () => {
      if (updateHapusContainerRef.current && tambahProdukContainerRef.current) {
        const width = updateHapusContainerRef.current.offsetWidth;
        tambahProdukContainerRef.current.style.width = `${width}px`;
      }
    };

    // Initial sync with a small delay to ensure DOM is rendered
    const timeoutId = setTimeout(syncWidths, 0);

    // Listen for window resize
    window.addEventListener("resize", syncWidths);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", syncWidths);
    };
  }, [products]);

  // Load User Profile Data
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUsername(data.username || "");
        setEmail(data.email || "");
        setWhatsappNumber(data.contact || "");
        setProfileImage(data.photoURL || ""); // 🔥 otomatis update UI
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRemoveKiosImage = (index: number) => {
    // TODO: Implement logic to delete from storage if it's an uploaded URL
    setKiosImages(kiosImages.filter((_, i) => i !== index));
  };

  // --- LOGIKA UPLOAD GAMBAR KIOS ---
  const handleAddKiosImageClick = () => {
    if (kiosImages.length < 3) {
      kiosImageInputRef.current?.click();
    } else {
      alert("Maksimal 3 gambar kios.");
    }
  };

  const handleKiosImageFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 10MB");
      return;
    }
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      alert("Format harus PNG/JPG/JPEG");
      return;
    }

    if (kiosImages.length < 3) {
      setKiosImages([...kiosImages, file]);
    }
    // Clear the file input
    if (e.target) e.target.value = "";
  };

  const placeMarkerAndPanTo = useCallback(
    (latLng: google.maps.LatLng) => {
      if (!mapInstanceRef.current || !geocoderRef.current) return;

      // Hapus marker lama
      if (markerInstanceRef.current) {
        markerInstanceRef.current.setMap(null);
      }

      // Buat marker baru
      markerInstanceRef.current = new google.maps.Marker({
        position: latLng,
        map: mapInstanceRef.current,
      });

      // Lakukan reverse geocoding
      geocoderRef.current.geocode({ location: latLng }, (results, status) => {
        if (status === "OK") {
          if (results && results[0]) {
            // Update state dengan data lokasi baru
            setKiosAddress(results[0].formatted_address);
            setKiosPlaceId(results[0].place_id);
            setKiosGeopoint({
              lat: latLng.lat(),
              lng: latLng.lng(),
            });
          } else {
            window.alert("Tidak ada hasil yang ditemukan");
          }
        } else {
          window.alert("Geocoder gagal: " + status);
        }
      });
    },
    [] // Dependencies kosong, karena refs tidak berubah
  );

  const initMap = useCallback(() => {
    if (!mapRef.current) return;

    const depok = { lat: -6.4025, lng: 106.7942 };
    const initialCenter = kiosGeopoint || depok;

    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: 15,
      restriction: {
        latLngBounds: {
          north: -6.3,
          south: -6.5,
          west: 106.7,
          east: 106.9,
        },
        strictBounds: false,
      },
    });

    geocoderRef.current = new google.maps.Geocoder();

    if (kiosGeopoint) {
      markerInstanceRef.current = new google.maps.Marker({
        position: kiosGeopoint,
        map: mapInstanceRef.current,
      });
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.addListener(
        "click",
        (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          placeMarkerAndPanTo(e.latLng);
        }
      );
    }
  }, [kiosGeopoint, placeMarkerAndPanTo]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Jika sudah pernah loaded
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    // Load script manual
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => initMap();
    document.body.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        google.maps.event.clearInstanceListeners(mapInstanceRef.current);
      }
    };
  }, [initMap, kiosGeopoint]);

  // --- LOGIKA UPLOAD GAMBAR PRODUK ---
  const handleProductImageClick = (id: number) => {
    setActiveProductUploadId(id);
    productImageInputRef.current?.click();
  };

  const handleProductImageFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || activeProductUploadId === null) return;

    // Validasi
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 10MB");
      return;
    }
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      alert("Format harus PNG/JPG/JPEG");
      return;
    }

    setProducts(
      products.map((p) =>
        p.id === activeProductUploadId ? { ...p, image: file } : p
      )
    );
    setActiveProductUploadId(null);
    // Clear the file input
    if (e.target) e.target.value = "";
  };

  const handleRemoveProductImage = (id: number) => {
    // TODO: Implement logic to delete from storage
    setProducts(products.map((p) => (p.id === id ? { ...p, image: null } : p)));
  };

  const handleRemoveProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleUpdateProduct = (id: number) => {
    console.log("Update product", id);
    // Di aplikasi nyata, ini mungkin akan menyimpan SATU produk ini ke DB
    // Tapi untuk sekarang, kita simpan semua via Tombol "Simpan Profil Kios"
    alert(
      "Perubahan produk akan disimpan saat Anda menekan 'Simpan Profil Kios' di bagian bawah."
    );
  };

  const handleAddProduct = () => {
    const newId = Math.max(...products.map((p) => p.id), 0) + 1;
    setProducts([
      ...products,
      { id: newId, image: null, name: "", price: "0" },
    ]);
  };

  const descriptionCharCount = kiosDescription.length;
  const maxChars = 200;

  // Time options (hourly from 00:00 to 23:00)
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = String(i).padStart(2, "0");
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran < 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 10MB");
      return;
    }

    // Validasi tipe file
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      alert("Format harus PNG/JPG/JPEG");
      return;
    }

    setIsUploading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Anda harus login terlebih dahulu");
        return;
      }

      const storage = getStorage();
      const filePath = `profile_images/${user.uid}`;
      const storageRef = ref(storage, filePath);

      // Upload file ke storage
      await uploadBytes(storageRef, file);

      // Dapatkan URL download
      const downloadURL = await getDownloadURL(storageRef);

      // Update Firestore user
      await updateProfilePhoto(user.uid, downloadURL);

      // Set preview di UI
      setProfileImage(downloadURL);
    } catch (err) {
      console.error(err);
      alert("Gagal upload gambar");
    }

    setIsUploading(false);
  };

  async function updateProfilePhoto(uid: string, url: string) {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { photoURL: url }, { merge: true });
  }

  const handleRemovePhoto = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const storage = getStorage();
      const fileRef = ref(storage, `profile_images/${user.uid}`);

      // Hapus dari storage
      await deleteObject(fileRef).catch(() => {});

      // Hapus dari Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { photoURL: null }, { merge: true });

      // Hapus di UI
      setProfileImage(undefined);
    } catch (err) {
      console.error(err);
    }
  };

  // --- FUNGSI SIMPAN PROFIL KIOS ---

  // Fungsi helper untuk upload gambar Kios
  async function uploadKiosImage(file: File, index: number) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const storage = getStorage();
    // Gunakan nama file unik untuk menghindari timpaan
    const path = `kios_images/${user.uid}/img_${index}_${Date.now()}`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  // Fungsi helper untuk upload gambar Produk
  async function uploadProductImage(file: File, productId: number) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const storage = getStorage();
    const path = `product_images/${
      user.uid
    }/product_${productId}_${Date.now()}`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  // Fungsi untuk menyimpan data Kios ke Firestore
  async function saveKiosProfile(data: any) {
    const user = auth.currentUser;
    if (!user) {
      alert("Harus login terlebih dahulu");
      return;
    }

    // Simpan ke koleksi 'kios' dengan ID user
    const kiosRef = doc(db, "kios", user.uid);
    await setDoc(kiosRef, data, { merge: true });

    alert("Profil kios berhasil disimpan!");
  }

  // Handler utama untuk tombol "Simpan Profil Kios"
  async function handleSaveKiosProfile() {
    const user = auth.currentUser;
    if (!user) {
      alert("Anda harus login untuk menyimpan profil kios.");
      return;
    }

    setIsSavingKios(true);

    try {
      // 1. Upload Kios Images (yg berupa File)
      const finalKiosImageUrls = await Promise.all(
        kiosImages.map(async (image, index) => {
          if (typeof image === "string") {
            return image; // Ini adalah URL yg sudah ada
          } else {
            // Ini adalah File, upload
            return await uploadKiosImage(image, index);
          }
        })
      );

      // 2. Upload Product Images (yg berupa File)
      const finalKatalogProduk = await Promise.all(
        products.map(async (product) => {
          if (product.image instanceof File) {
            const imageUrl = await uploadProductImage(
              product.image,
              product.id
            );
            return { ...product, image: imageUrl };
          } else {
            // Ini adalah string URL atau null
            return { ...product, image: product.image || null };
          }
        })
      );

      // 3. Bangun objek data kios
      const kiosData = {
        namaKios: kiosName,
        deskripsi: kiosDescription,
        jenisProduk: selectedJenisProduk,
        jamBuka: openingTime,
        jamTutup: closingTime,
        rating: 0, // Sesuai permintaan
        totalReview: 0, // Sesuai permintaan
        kategori: kategoriManual,
        alamat: {
          text: kiosAddress,
          placeId: kiosPlaceId || "", // Simpan Place ID
          geopoint: kiosGeopoint
            ? new GeoPoint(kiosGeopoint.lat, kiosGeopoint.lng) // Simpan GeoPoint
            : null,
        },
        fotoKios: finalKiosImageUrls,
        katalogProduk: finalKatalogProduk,
        kontakOnline: {
          shopee: shopeeFoodUrl,
          gofood: goFoodUrl,
          whatsapp: whatsappUrl,
          instagram: instagramUrl,
        },
      };

      // 4. Simpan ke Firestore
      await saveKiosProfile(kiosData);
    } catch (error) {
      console.error("Gagal menyimpan profil kios:", error);
      alert("Terjadi kesalahan saat menyimpan profil kios.");
    }

    setIsSavingKios(false);
  }

  // --- KATEGORI GLOBAL (SESUAI PERMINTAAN) ---
  // const CATEGORY_MAP: Record<string, string[]> = {
  //   Makanan: [
  //     "ayam",
  //     "bakso",
  //     "mie",
  //     "seafood",
  //     "pecel",
  //     "pizza",
  //     "snacks",
  //     "food",
  //   ],
  //   Halal: [
  //     "ayam",
  //     "bakso",
  //     "mie",
  //     "seafood",
  //     "pecel",
  //     "pizza",
  //     "snacks",
  //     "food",
  //   ],
  //   Minuman: ["kopi", "kafe"],
  //   Cemilan: ["snack", "jajanan", "roti", "pastry", "kue"],
  //   Kopi: ["kopi", "kafe"],
  //   Nusantara: ["pecel"],
  //   Dessert: ["snacks"],
  //   Pizza: ["pizza"],
  //   Seafood: ["seafood"],
  // };

  // function getKategoriGlobal(selected: string[]) {
  //   const result = new Set<string>();

  //   selected.forEach((item) => {
  //     Object.entries(CATEGORY_MAP).forEach(([kategori, daftar]) => {
  //       if (daftar.includes(item)) result.add(kategori);
  //     });
  //   });

  //   return Array.from(result);
  // }

  // --- EFEK UNTUK MEMUAT DATA KIOS SAAT HALAMAN DIBUKA ---
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Muat data dari 'kios/{uid}'
    const kiosRef = doc(db, "kios", user.uid);

    const unsub = onSnapshot(kiosRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();

        setKiosName(data.namaKios || "");
        setKiosImages(data.fotoKios || []);
        setKiosDescription(data.deskripsi || "");
        setSelectedJenisProduk(data.jenisProduk || []);
        setOpeningTime(data.jamBuka || "17:00");
        setClosingTime(data.jamTutup || "22:00");
        setProducts(data.katalogProduk || []);
        setKategoriManual(data.kategori || "");

        // Muat data alamat
        setKiosAddress(
          data.alamat?.text || "Klik di peta untuk mengatur lokasi..."
        );
        setKiosPlaceId(data.alamat?.placeId || null);
        if (data.alamat?.geopoint) {
          // Konversi Firestore GeoPoint ke objek lat/lng
          setKiosGeopoint({
            lat: data.alamat.geopoint.latitude,
            lng: data.alamat.geopoint.longitude,
          });
        } else {
          setKiosGeopoint(null);
        }

        // Muat data kontak online
        setShopeeFoodUrl(data.kontakOnline?.shopee || "");
        setGoFoodUrl(data.kontakOnline?.gofood || "");
        setWhatsappUrl(data.kontakOnline?.whatsapp || "");
        setInstagramUrl(data.kontakOnline?.instagram || "");
      }
    });

    return () => unsub();
  }, []);

  const fileInputProductRef = useRef<HTMLInputElement>(null);

  const handleUploadProductClick = () => {
    fileInputProductRef.current?.click();
  };

  const handleProductUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 10MB");
      return;
    }
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      alert("Format harus PNG/JPG/JPEG");
      return;
    }

    const newId = Math.max(...products.map((p) => p.id), 0) + 1;

    // Upload ke Firebase
    const imageUrl = await uploadProductImage(file, newId);

    // Tambah product baru
    setProducts([
      ...products,
      { id: newId, image: imageUrl, name: "", price: "0" },
    ]);

    e.target.value = "";
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: colors.neutral[3] }}
    >
      {/* Header */}
      <Header
        onNavigateToLogin={goLogin}
        onNavigateToSignUp={goSignup}
        onNavigateToHome={goHome}
        onNavigateToDetailKios={goDetailKios}
        userProfile={{
          imageUrl: profileImage,
          name: "User",
          onClick: () => {},
          onSettingsClick: goSettings,
          onLogoutClick: () => {
            console.log("Logout");
            goLogin();
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

      {/* Input file tersembunyi */}
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        ref={kiosImageInputRef}
        onChange={handleKiosImageFileChange}
        style={{ display: "none" }}
      />
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        ref={productImageInputRef}
        onChange={handleProductImageFileChange}
        style={{ display: "none" }}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputProductRef}
        style={{ display: "none" }}
        onChange={handleProductUpload}
      />

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-20 py-6 flex-1">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-4">
          {/* Pengaturan Profil Section */}
          <div
            className="flex flex-col gap-4 p-6 rounded-[12px]"
            style={{ backgroundColor: semanticColors.bgPrimary }}
          >
            {/* ... (Kode Pengaturan Profil Anda tidak berubah) ... */}

            {/* Section Title */}
            <div
              className="flex flex-col gap-3 pb-3 border-b"
              style={{ borderColor: colors.neutral[6] }}
            >
              <h1
                className="font-black text-4xl"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: semanticColors.textPrimary,
                }}
              >
                Pengaturan Profil
              </h1>
            </div>

            {/* Profile Picture */}
            <div
              className="flex flex-col sm:flex-row gap-4 items-center pb-4 border-b"
              style={{ borderColor: colors.neutral[6] }}
            >
              <div
                className="relative rounded-full shrink-0"
                style={{ width: "96px", height: "96px" }}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <DefaultProfileAvatar size={96} />
                )}
              </div>
              <div className="flex flex-col gap-0.5 flex-1 w-full sm:w-auto text-center sm:text-left">
                <p
                  className="font-dm-sans font-bold text-sm"
                  style={{ color: semanticColors.textPrimary }}
                >
                  Gambar Profil
                </p>
                <p
                  className="font-dm-sans font-regular text-xs"
                  style={{ color: semanticColors.textSecondary }}
                >
                  PNG, JPEG dibawah 10MB
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="primary"
                  onClick={handleUploadClick}
                  className="w-full sm:w-auto"
                >
                  {isUploading ? "Mengupload..." : "Upload Gambar Baru"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleRemovePhoto}
                  className="w-full sm:w-auto"
                >
                  Hapus
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* Nama Akun */}
            <div
              className="flex flex-col gap-3 pb-4 border-b"
              style={{ borderColor: colors.neutral[6] }}
            >
              <h2
                className="font-dm-sans font-bold text-lg"
                style={{ color: semanticColors.textPrimary }}
              >
                Nama Akun
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label
                    className="font-dm-sans font-bold text-sm"
                    style={{ color: semanticColors.textPrimary }}
                  >
                    Username
                  </label>
                  <TextField
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label
                    className="font-dm-sans font-bold text-sm"
                    style={{ color: semanticColors.textPrimary }}
                  >
                    Email
                  </label>
                  <TextField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div
              className="flex flex-col gap-3 pb-4 border-b"
              style={{ borderColor: colors.neutral[6] }}
            >
              <h2
                className="font-dm-sans font-bold text-lg"
                style={{ color: semanticColors.textPrimary }}
              >
                Contact
              </h2>
              <div className="flex flex-col gap-1.5 max-w-[608px]">
                <label
                  className="font-dm-sans font-bold text-sm"
                  style={{ color: semanticColors.textPrimary }}
                >
                  Nomor Whatsapp
                </label>
                <TextField
                  value={`+62 ${
                    whatsappNumber.startsWith("62")
                      ? whatsappNumber.slice(2)
                      : whatsappNumber.startsWith("0")
                      ? whatsappNumber.slice(1)
                      : whatsappNumber
                  }`}
                  disabled
                  leftIcon={<WhatsappIcon width={16.667} height={16.667} />}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-3">
              <h2
                className="font-dm-sans font-bold text-lg"
                style={{ color: semanticColors.textPrimary }}
              >
                Password
              </h2>
              <div className="flex flex-col gap-4 items-end">
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label
                      className="font-dm-sans font-bold text-sm"
                      style={{ color: semanticColors.textPrimary }}
                    >
                      Password Sekarang
                    </label>
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="****************"
                      leftIcon={
                        <FontAwesomeIcon icon={faKey} className="w-4 h-4" />
                      }
                      rightIcon={
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="cursor-pointer"
                        >
                          <FontAwesomeIcon
                            icon={showCurrentPassword ? faEyeSlash : faEye}
                            className="w-4 h-4"
                          />
                        </button>
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label
                      className="font-dm-sans font-bold text-sm"
                      style={{ color: semanticColors.textPrimary }}
                    >
                      Password Baru
                    </label>
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="****************"
                      leftIcon={
                        <FontAwesomeIcon icon={faKey} className="w-4 h-4" />
                      }
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="cursor-pointer"
                        >
                          <FontAwesomeIcon
                            icon={showNewPassword ? faEyeSlash : faEye}
                            className="w-4 h-4"
                          />
                        </button>
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={() => console.log("Update password")}
                  className="w-full sm:w-auto"
                >
                  Update Password
                </Button>
              </div>
            </div>
          </div>

          {/* Profil Kios Section */}
          <div
            className="flex flex-col gap-4 p-6 rounded-[12px]"
            style={{ backgroundColor: semanticColors.bgPrimary }}
          >
            {/* Section Title */}
            <div
              className="flex flex-col gap-3 pb-3 border-b"
              style={{ borderColor: colors.neutral[6] }}
            >
              <h1
                className="font-black text-4xl"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: semanticColors.textPrimary,
                }}
              >
                Profil Kios
              </h1>
            </div>

            {/* Tentang Kios */}
            <div
              className="flex flex-col gap-3 pb-4 border-b"
              style={{ borderColor: colors.neutral[6] }}
            >
              <h2
                className="font-dm-sans font-bold text-lg"
                style={{ color: semanticColors.textPrimary }}
              >
                Tentang Kios
              </h2>

              {/* Gambar Kios */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <p
                    className="font-dm-sans font-bold text-sm"
                    style={{ color: semanticColors.textPrimary }}
                  >
                    Gambar Kios
                  </p>
                  <p
                    className="font-dm-sans font-regular text-xs"
                    style={{ color: semanticColors.textSecondary }}
                  >
                    PNG, JPEG dibawah 10MB
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  {kiosImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-full sm:w-[287px] h-[193px] rounded-[12px] overflow-hidden"
                    >
                      <img
                        src={
                          typeof image === "string"
                            ? image
                            : URL.createObjectURL(image)
                        }
                        alt={`Kios ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemoveKiosImage(index)}
                        className="absolute top-3 right-3 flex items-center justify-center p-2.5 rounded-full cursor-pointer"
                        style={{ backgroundColor: semanticColors.bgPrimary }}
                      >
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="w-5 h-5"
                          style={{ color: semanticColors.textPrimary }}
                        />
                      </button>
                    </div>
                  ))}
                  {kiosImages.length < 3 && (
                    <button
                      onClick={handleAddKiosImageClick} // Diubah
                      className="w-full sm:w-[287px] h-[193px] rounded-[12px] flex items-center justify-center cursor-pointer transition-colors"
                      style={{ backgroundColor: colors.neutral[6] }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          colors.neutral[7])
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          colors.neutral[6])
                      }
                    >
                      <div
                        className="flex items-center justify-center p-2.5 rounded-full"
                        style={{ backgroundColor: semanticColors.bgPrimary }}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="w-5 h-5"
                          style={{ color: semanticColors.textPrimary }}
                        />
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Nama Kios */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-dm-sans font-bold text-sm"
                  style={{ color: semanticColors.textPrimary }}
                >
                  Nama Kios
                </label>
                <TextField
                  value={kiosName}
                  onChange={(e) => setKiosName(e.target.value)}
                  placeholder="Sata Padang Pak Jawa"
                  className="w-full"
                />
              </div>

              {/* Deskripsi Kios */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-dm-sans font-bold text-sm"
                  style={{ color: semanticColors.textPrimary }}
                >
                  Deskripsi Kios
                </label>
                <div className="flex flex-col gap-1.5 items-end">
                  <textarea
                    value={kiosDescription}
                    onChange={(e) => setKiosDescription(e.target.value)}
                    placeholder="Lorem ipsum dolor sit amet..."
                    className="w-full h-[86px] px-3 py-[6px] rounded-[12px] font-dm-sans font-regular text-sm resize-none border-0 outline-0 focus:outline-none focus:ring-0"
                    style={{
                      backgroundColor: semanticColors.bgTertiary,
                      color: semanticColors.textPrimary,
                    }}
                    maxLength={maxChars} // Batasi input
                  />
                  <p
                    className="font-dm-sans font-regular text-xs"
                    style={{ color: semanticColors.textSecondary }}
                  >
                    Maksimal 200 Huruf, {descriptionCharCount}/{maxChars}{" "}
                    digunakan
                  </p>
                </div>
              </div>

              {/* Jenis Produk */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="font-dm-sans font-bold text-sm"
                  style={{ color: semanticColors.textPrimary }}
                >
                  Jenis Produk
                </label>
                <p
                  className="font-dm-sans font-regular text-xs"
                  style={{ color: semanticColors.textSecondary }}
                >
                  Pilih jenis produk yang dijual di kios Anda
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {jenisProdukOptions.map((category) => (
                    <ChipSelector
                      key={category.id}
                      icon={
                        category.useHalalIcon ? (
                          <HalalIcon width={20} height={20} />
                        ) : category.icon ? (
                          <FontAwesomeIcon
                            icon={category.icon}
                            className="w-5 h-5"
                          />
                        ) : null
                      }
                      iconColor={category.iconColor}
                      isSelected={selectedJenisProduk.includes(category.id)}
                      onClick={() => handleJenisProdukToggle(category.id)}
                    >
                      {category.label}
                    </ChipSelector>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-dm-sans font-bold text-sm"
                    style={{ color: semanticColors.textPrimary }}
                  >
                    Kategori
                  </label>

                  <select
                    value={kategoriManual}
                    onChange={(e) => setKategoriManual(e.target.value)}
                    className="w-full p-2 rounded border"
                    style={{
                      backgroundColor: semanticColors.bgTertiary,
                      color: semanticColors.textPrimary,
                      borderColor: colors.neutral[6],
                    }}
                  >
                    <option value="">-- Pilih kategori --</option>
                    {kategoriOptions.map((item) => (
                      <option key={item} value={item}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Jam Buka */}
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label
                    className="font-dm-sans font-bold text-sm"
                    style={{ color: semanticColors.textPrimary }}
                  >
                    Jam Buka
                  </label>
                  <div className="flex gap-1.5 items-center">
                    <Select
                      value={openingTime}
                      onChange={setOpeningTime}
                      options={timeOptions}
                      placeholder="17:00"
                      className="flex-1"
                    />
                    <span
                      className="font-dm-sans font-regular text-xs"
                      style={{ color: semanticColors.textPrimary }}
                    >
                      -
                    </span>
                    <Select
                      value={closingTime}
                      onChange={setClosingTime}
                      options={timeOptions}
                      placeholder="22:00"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Lokasi Kios */}
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-col gap-0">
                  <label
                    className="font-dm-sans font-bold text-sm"
                    style={{ color: semanticColors.textPrimary }}
                  >
                    Lokasi Kios
                  </label>
                  <p
                    className="font-dm-sans font-regular text-xs wrap-break-word"
                    style={{ color: semanticColors.textSecondary }}
                  >
                    {/* Tampilkan alamat yang didapat dari Geocoder */}
                    {kiosAddress}
                  </p>
                </div>
                <div
                  className="h-[273px] rounded-[12px] border-2 overflow-hidden"
                  style={{ borderColor: colors.neutral[6] }}
                >
                  {/* --- MODIFIKASI: Div ini akan menjadi container peta --- */}
                  <div ref={mapRef} className="w-full h-full" />
                </div>
              </div>
            </div>

            {/* Contact Kios Online */}
            <div
              className="flex flex-col gap-3 pb-4 border-b"
              style={{ borderColor: colors.neutral[6] }}
            >
              <h2
                className="font-dm-sans font-bold text-lg"
                style={{ color: semanticColors.textPrimary }}
              >
                Contact Kios Online
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label
                    className="font-dm-sans font-bold text-sm"
                    style={{ color: semanticColors.textPrimary }}
                  >
                    Shopee Food
                  </label>
                  <TextField
                    value={shopeeFoodUrl}
                    onChange={(e) => setShopeeFoodUrl(e.target.value)}
                    placeholder="https://shopeefood.co.id/..."
                    leftIcon={<ShopeeFoodIcon width={16.667} height={16.667} />}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label
                    className="font-dm-sans font-bold text-sm"
                    style={{ color: semanticColors.textPrimary }}
                  >
                    GoFood
                  </label>
                  <TextField
                    value={goFoodUrl}
                    onChange={(e) => setGoFoodUrl(e.target.value)}
                    placeholder="https://gofood.co.id/..."
                    leftIcon={<GoFoodIcon width={16.667} height={16.667} />}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label
                    className="font-dm-sans font-bold text-sm"
                    style={{ color: semanticColors.textPrimary }}
                  >
                    Whatsapp
                  </label>
                  <TextField
                    value={whatsappUrl}
                    onChange={(e) => setWhatsappUrl(e.target.value)}
                    placeholder="https://wa.me/62..."
                    leftIcon={<WhatsappIcon width={16.667} height={16.667} />}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label
                    className="font-dm-sans font-bold text-sm"
                    style={{ color: semanticColors.textPrimary }}
                  >
                    Instagram
                  </label>
                  <TextField
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/..."
                    leftIcon={<InstagramIcon width={16.667} height={16.667} />}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Katalog Produk */}
            <div className="flex flex-col gap-3">
              <h2
                className="font-dm-sans font-bold text-lg"
                style={{ color: semanticColors.textPrimary }}
              >
                Katalog Produk
              </h2>
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col sm:flex-row gap-4 items-end pb-16 md:pb-0"
                >
                  <div className="relative w-full sm:w-[105.58px] h-[71px] rounded-[4.415px] overflow-hidden shrink-0">
                    {product.image ? (
                      <>
                        <img
                          src={
                            typeof product.image === "string"
                              ? product.image
                              : URL.createObjectURL(product.image)
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleRemoveProductImage(product.id)}
                          className="absolute top-1 right-1 flex items-center justify-center p-1 rounded-full cursor-pointer"
                          style={{ backgroundColor: semanticColors.bgPrimary }}
                        >
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="w-4 h-4"
                            style={{ color: semanticColors.textPrimary }}
                          />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleProductImageClick(product.id)} // Diubah
                        className="w-full h-full flex items-center justify-center cursor-pointer transition-colors"
                        style={{ backgroundColor: colors.neutral[6] }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            colors.neutral[7])
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            colors.neutral[6])
                        }
                      >
                        <div
                          className="flex items-center justify-center p-1.5 rounded-full"
                          style={{ backgroundColor: semanticColors.bgPrimary }}
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            className="w-4 h-4"
                            style={{ color: semanticColors.textPrimary }}
                          />
                        </div>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label
                        className="font-dm-sans font-bold text-sm"
                        style={{ color: semanticColors.textPrimary }}
                      >
                        Nama Produk
                      </label>
                      <TextField
                        value={product.name}
                        onChange={(e) => {
                          setProducts(
                            products.map((p) =>
                              p.id === product.id
                                ? { ...p, name: e.target.value }
                                : p
                            )
                          );
                        }}
                        placeholder="Sate Ayam"
                        className="w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label
                        className="font-dm-sans font-bold text-sm"
                        style={{ color: semanticColors.textPrimary }}
                      >
                        Harga
                      </label>
                      <TextField
                        value={
                          product.price === "0"
                            ? ""
                            : `Rp ${parseInt(product.price).toLocaleString(
                                "id-ID"
                              )}`
                        }
                        onChange={(e) => {
                          const numericValue =
                            e.target.value.replace(/[^\d]/g, "") || "0";
                          setProducts(
                            products.map((p) =>
                              p.id === product.id
                                ? { ...p, price: numericValue }
                                : p
                            )
                          );
                        }}
                        placeholder="Rp 20.000"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div
                    className="flex gap-2 shrink-0 w-full sm:w-auto"
                    ref={updateHapusContainerRef}
                  >
                    <Button
                      variant="primary"
                      onClick={() => handleUpdateProduct(product.id)}
                      className="flex-1 sm:flex-none"
                    >
                      Update
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleRemoveProduct(product.id)}
                      className="flex-1 sm:flex-none"
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add Product Button */}
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <button
                  onClick={handleUploadProductClick}
                  className="w-full sm:w-[105.58px] h-[71px] rounded-[4.415px] flex items-center justify-center cursor-pointer transition-colors shrink-0"
                  style={{ backgroundColor: colors.neutral[6] }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.neutral[7])
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.neutral[6])
                  }
                >
                  <div
                    className="flex items-center justify-center p-1.5 rounded-full"
                    style={{ backgroundColor: semanticColors.bgPrimary }}
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="w-4 h-4"
                      style={{ color: semanticColors.textPrimary }}
                    />
                  </div>
                </button>
                <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label
                      className="font-dm-sans font-bold text-sm"
                      style={{ color: semanticColors.textPrimary }}
                    >
                      Nama Produk
                    </label>
                    <TextField
                      placeholder="Nama Produk"
                      className="w-full"
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label
                      className="font-dm-sans font-bold text-sm"
                      style={{ color: semanticColors.textPrimary }}
                    >
                      Harga
                    </label>
                    <TextField placeholder="Rp 0" className="w-full" disabled />
                  </div>
                </div>
                <div
                  className="flex gap-2 shrink-0 w-full sm:w-auto"
                  ref={tambahProdukContainerRef}
                >
                  <Button
                    variant="primary"
                    onClick={handleAddProduct}
                    className="w-full"
                  >
                    Tambah Produk
                  </Button>
                </div>
              </div>
            </div>

            {/* --- TOMBOL SIMPAN UTAMA --- */}
            <div className="flex justify-end pt-4 mt-4 border-t border-neutral-6">
              <Button
                variant="primary"
                onClick={handleSaveKiosProfile}
                disabled={isSavingKios}
                className="w-full sm:w-auto"
              >
                {isSavingKios ? "Menyimpan..." : "Simpan Profil Kios"}
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
