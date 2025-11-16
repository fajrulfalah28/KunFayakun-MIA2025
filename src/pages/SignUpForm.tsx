import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Input, Button } from "../components";
import { semanticColors } from "../styles/colors";
import ShopIcon from "../components/icons/ShopIcon";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

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
    username: "",
    email: "",
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

    if (!formData.username.trim()) newErrors.username = "Username wajib diisi";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (contactDigits.length < 11 || contactDigits.length > 12) {
      newErrors.contact = "Nomor HP harus 12–13 digit";
    }

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

    try {
      // 1. Daftar user di Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 2. Simpan data user ke Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: formData.username,
        email: formData.email,
        contact: formData.contact,
        photoURL: "",
        createdAt: new Date().toISOString(),
      });

      // 3. Tampilkan toast sukses
      toast.success("Pendaftaran berhasil!", {
        duration: 2000,
      });

      // 4. Delay 2 detik sebelum pindah ke login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan.");
    }

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
              label="Username"
              placeholder="Masukkan Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              error={errors.namaDepan}
            />

            <Input
              label="Email"
              placeholder="Masukkan Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.namaBelakang}
            />

            <Input
              label="Kontak"
              placeholder="823-4567-8910"
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
              error={errors.contact}
              leftIcon={
                <span
                  className="font-dm-sans font-regular text-sm"
                  style={{ color: semanticColors.textPrimary }}
                >
                  +62
                </span>
              }
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan Password"
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
              placeholder="Ulangi Password"
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

            <div className="flex flex-col gap-3 mt-8">
              <Button isLoading={isLoading} type="submit">
                Daftar
              </Button>
              <p
                className="text-center"
                style={{ color: semanticColors.bgDark }}
              >
                Sudah punya akun?{" "}
                <button
                  className="font-bold hover:underline"
                  onClick={() => navigate("/login")}
                >
                  Masuk
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
