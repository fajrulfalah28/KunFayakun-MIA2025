import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Input, Button } from "../components";
import { semanticColors } from "../styles/colors";
import ShopIcon from "../components/icons/ShopIcon";
import { useNavigate } from "react-router-dom";

export default function SignUpForm() {
  const navigate = useNavigate();

  // Random background images
  const bgImages = [
    "https://images.unsplash.com/photo-1692609748666-95c48797b47d?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1717657588624-16b762da95d6?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1616636830943-606a21a78788?auto=format&fit=crop&q=80&w=1920",
  ];
  const [currentBgImage] = useState(
    bgImages[Math.floor(Math.random() * bgImages.length)]
  );

  const [displayedImage, setDisplayedImage] = useState(currentBgImage);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = currentBgImage;

    img.onload = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setDisplayedImage(currentBgImage);
        setIsTransitioning(false);
      }, 3000);
    };
  }, [currentBgImage]);

  const [formData, setFormData] = useState({
    namaDepan: "",
    namaBelakang: "",
    contact: "",
    password: "",
    konfirmasiPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const contactDigits = formData.contact.replace(/\D/g, "");

    if (!formData.namaDepan.trim())
      newErrors.namaDepan = "Nama depan wajib diisi";
    if (!formData.namaBelakang.trim())
      newErrors.namaBelakang = "Nama belakang wajib diisi";
    if (contactDigits.length !== 11) newErrors.contact = "Harus 11 digit";
    if (formData.password.length < 8) newErrors.password = "Minimal 8 karakter";
    if (formData.password !== formData.konfirmasiPassword)
      newErrors.konfirmasiPassword = "Password tidak cocok";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 1500));

    // After successful signup → go to login
    navigate("/login");

    setIsLoading(false);
  };

  return (
    <div
      className="h-screen w-full flex flex-col lg:flex-row"
      style={{ backgroundColor: semanticColors.bgPrimary }}
    >
      {/* Background image */}
      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${displayedImage})` }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-3000"
          style={{
            backgroundImage: `url(${currentBgImage})`,
            opacity: isTransitioning ? 1 : 0,
          }}
        />
      </div>

      {/* Form */}
      <div className="flex flex-col items-center justify-center px-6 py-16 lg:min-w-[480px]">
        <div className="w-full max-w-[420px]">
          <div className="flex items-center justify-center gap-4 mb-10">
            <ShopIcon className="w-16 h-16" />
            <h1
              className="font-black text-5xl"
              style={{ color: semanticColors.textPrimary }}
            >
              KiosKu
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Nama Depan"
              value={formData.namaDepan}
              onChange={(e) =>
                setFormData({ ...formData, namaDepan: e.target.value })
              }
              error={errors.namaDepan}
            />

            <Input
              label="Nama Belakang"
              value={formData.namaBelakang}
              onChange={(e) =>
                setFormData({ ...formData, namaBelakang: e.target.value })
              }
              error={errors.namaBelakang}
            />

            <Input
              label="Kontak"
              placeholder="123-4567-8910"
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
              error={errors.contact}
              leftIcon={
                <span style={{ color: semanticColors.textPrimary }}>+62</span>
              }
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
              leftIcon={<FontAwesomeIcon icon={faKey} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              }
            />

            <Input
              label="Konfirmasi Password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.konfirmasiPassword}
              onChange={(e) =>
                setFormData({ ...formData, konfirmasiPassword: e.target.value })
              }
              error={errors.konfirmasiPassword}
              leftIcon={<FontAwesomeIcon icon={faKey} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEye : faEyeSlash}
                  />
                </button>
              }
            />
          </form>

          <div className="flex flex-col gap-3 mt-8">
            <Button isLoading={isLoading}>Daftar</Button>

            <p className="text-center" style={{ color: semanticColors.bgDark }}>
              Sudah punya akun?{" "}
              <button
                className="font-bold hover:underline"
                onClick={() => navigate("/login")}
              >
                Masuk.
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
