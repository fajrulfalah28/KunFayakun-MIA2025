import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faEye,
  faEyeSlash,
  faTimes,
  faPlus,
  faUser,
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
  const [namaDepan, setNamaDepan] = useState("Muhammad");
  const [namaBelakang, setNamaBelakang] = useState("Fajrul Falah");
  const [whatsappNumber, setWhatsappNumber] = useState("081234567890");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Kios Profile State
  const [kiosImages, setKiosImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=287&h=193&fit=crop",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=287&h=193&fit=crop",
  ]);
  const [kiosName, setKiosName] = useState("Sate Padang Pak Jawa");
  const [kiosDescription, setKiosDescription] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  );
  const [selectedJenisProduk, setSelectedJenisProduk] = useState<string[]>([
    "food",
    "nusantara",
  ]); // Array of selected category IDs
  const [establishedDay, setEstablishedDay] = useState("12");
  const [establishedMonth, setEstablishedMonth] = useState("Desember");
  const [establishedYear, setEstablishedYear] = useState("2020");
  const [openingTime, setOpeningTime] = useState("17:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const kiosAddress =
    "Jalan Kutai Utara Nomor 1, Kelurahan Sumber, Kecamatan Banjarsari, Kota Solo, Jawa Tengah.";
  const [shopeeFoodUrl, setShopeeFoodUrl] = useState("www.google.com");
  const [goFoodUrl, setGoFoodUrl] = useState("www.google.com");
  const [whatsappUrl, setWhatsappUrl] = useState("www.google.com");
  const [instagramUrl, setInstagramUrl] = useState("www.google.com");

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
  const [products, setProducts] = useState([
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=287&h=193&fit=crop",
      name: "Sate Ayam",
      price: "20000",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=287&h=193&fit=crop",
      name: "Sate Kambing",
      price: "25000",
    },
  ]);

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

  const handleRemoveKiosImage = (index: number) => {
    setKiosImages(kiosImages.filter((_, i) => i !== index));
  };

  const handleAddKiosImage = () => {
    if (kiosImages.length < 3) {
      setKiosImages([
        ...kiosImages,
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=287&h=193&fit=crop",
      ]);
    }
  };

  const handleRemoveProductImage = (id: number) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, image: "" } : p)));
  };

  const handleAddProductImage = (id: number) => {
    // In a real app, this would open a file picker
    console.log("Add image for product", id);
    // For demo, set a placeholder image
    setProducts(
      products.map((p) =>
        p.id === id
          ? {
              ...p,
              image:
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=287&h=193&fit=crop",
            }
          : p
      )
    );
  };

  const handleRemoveProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleUpdateProduct = (id: number) => {
    console.log("Update product", id);
  };

  const handleAddProduct = () => {
    const newId = Math.max(...products.map((p) => p.id), 0) + 1;
    setProducts([...products, { id: newId, image: "", name: "", price: "0" }]);
  };

  const descriptionCharCount = kiosDescription.length;
  const maxChars = 200;

  // Date options
  const days = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  const months = [
    { value: "Januari", label: "Januari" },
    { value: "Februari", label: "Februari" },
    { value: "Maret", label: "Maret" },
    { value: "April", label: "April" },
    { value: "Mei", label: "Mei" },
    { value: "Juni", label: "Juni" },
    { value: "Juli", label: "Juli" },
    { value: "Agustus", label: "Agustus" },
    { value: "September", label: "September" },
    { value: "Oktober", label: "Oktober" },
    { value: "November", label: "November" },
    { value: "Desember", label: "Desember" },
  ];

  const years = Array.from({ length: 50 }, (_, i) => {
    const year = 2024 - i;
    return { value: String(year), label: String(year) };
  });

  // Time options (hourly from 00:00 to 23:00)
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = String(i).padStart(2, "0");
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

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
          imageUrl: undefined,
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

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-20 py-6 flex-1">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-4">
          {/* Pengaturan Profil Section */}
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
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.neutral[4] }}
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      className="w-12 h-12"
                      style={{ color: colors.neutral[7] }}
                    />
                  </div>
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
                  onClick={() => console.log("Upload image")}
                  className="w-full sm:w-auto"
                >
                  Upload Gambar Baru
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setProfileImage(undefined)}
                  className="w-full sm:w-auto"
                >
                  Hapus
                </Button>
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
                    Nama Depan
                  </label>
                  <TextField
                    value={namaDepan}
                    onChange={(e) => setNamaDepan(e.target.value)}
                    placeholder="Muhammad"
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label
                    className="font-dm-sans font-bold text-sm"
                    style={{ color: semanticColors.textPrimary }}
                  >
                    Nama Belakang
                  </label>
                  <TextField
                    value={namaBelakang}
                    onChange={(e) => setNamaBelakang(e.target.value)}
                    placeholder="Fajrul Falah"
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
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="081234567890"
                  leftIcon={<WhatsappIcon width={16.667} height={16.667} />}
                  className="w-full"
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
                        src={image}
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
                      onClick={handleAddKiosImage}
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
              </div>

              {/* Berdiri Sejak & Jam Buka */}
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label
                    className="font-dm-sans font-bold text-sm"
                    style={{ color: semanticColors.textPrimary }}
                  >
                    Berdiri Sejak
                  </label>
                  <div className="flex gap-1.5">
                    <Select
                      value={establishedDay}
                      onChange={setEstablishedDay}
                      options={days}
                      placeholder="12"
                      className="flex-1"
                    />
                    <Select
                      value={establishedMonth}
                      onChange={setEstablishedMonth}
                      options={months}
                      placeholder="Desember"
                      className="flex-1"
                    />
                    <Select
                      value={establishedYear}
                      onChange={setEstablishedYear}
                      options={years}
                      placeholder="2020"
                      className="flex-1"
                    />
                  </div>
                </div>
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
                    {kiosAddress}
                  </p>
                </div>
                <div
                  className="h-[273px] rounded-[12px] border-2 overflow-hidden"
                  style={{ borderColor: colors.neutral[6] }}
                >
                  {/* Placeholder for Google Map */}
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: colors.neutral[4] }}
                  >
                    <p
                      className="font-dm-sans font-regular text-sm"
                      style={{ color: semanticColors.textSecondary }}
                    >
                      Google Map Placeholder
                    </p>
                  </div>
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
                    placeholder="www.google.com"
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
                    placeholder="www.google.com"
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
                    placeholder="www.google.com"
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
                    placeholder="www.google.com"
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
                          src={product.image}
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
                        onClick={() => handleAddProductImage(product.id)}
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
                          const numericValue = e.target.value.replace(
                            /[^\d]/g,
                            ""
                          );
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
                  onClick={handleAddProduct}
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
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
