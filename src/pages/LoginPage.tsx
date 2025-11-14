import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Input, Button } from "../components";
import { semanticColors } from "../styles/colors";
import ShopIcon from "../components/icons/ShopIcon";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  // Ambil background random
  const bgImages = [
    "https://images.unsplash.com/photo-1692609748666-95c48797b47d?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1717657588624-16b762da95d6?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1616636830943-606a21a78788?auto=format&fit=crop&q=80&w=1920",
  ];
  const [currentBgImage] = useState(
    bgImages[Math.floor(Math.random() * bgImages.length)]
  );

  const [formData, setFormData] = useState({
    contact: "",
    password: "",
  });

  const [errors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Crossfade background
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    toast.success("Login berhasil!");

    localStorage.setItem("isLoggedIn", "true");
    window.dispatchEvent(new Event("storage"));

    navigate("/");
    setIsLoading(false);
  };

  return (
    <div
      className="h-screen w-full flex flex-col lg:flex-row"
      style={{ backgroundColor: semanticColors.bgPrimary }}
    >
      {/* Background side */}
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

      {/* Form side */}
      <div className="flex flex-col items-center justify-center px-6 py-16 lg:min-w-[480px]">
        <div className="w-full max-w-[420px]">
          <div className="flex items-center justify-center gap-4 mb-8">
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

            <Button isLoading={isLoading}>Masuk</Button>
          </form>

          {/* Signup link */}
          <div className="text-center mt-4">
            <p style={{ color: semanticColors.bgDark }}>
              Belum punya akun?
              <button
                className="font-bold ml-1 hover:underline"
                onClick={() => navigate("/signup")}
              >
                Daftar
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
