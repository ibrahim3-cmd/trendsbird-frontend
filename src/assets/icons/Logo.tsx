import { useNavigate } from "react-router-dom";
import logoWhite from "../images/logo-white.png"
import logoBlack from "../images/logo-black.png"
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";

export default function Logo({ route = "/", src = "", isLoading = false }: { route?: string, src?: string, isLoading?: boolean }) {
  const navigate = useNavigate();

  const { theme } = useTheme();

  const fallbackLogo = theme === "dark" ? logoWhite : logoBlack;

  const [imgSrc, setImgSrc] = useState<string>(src || fallbackLogo);

  useEffect(() => {
    setImgSrc(src || fallbackLogo);
  }, [src, fallbackLogo]);

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className="h-16 w-40 bg-muted animate-pulse rounded" />
    );
  }

  // After loading completes, show org logo if available, otherwise fallback to theme logo
  return (
    <div onClick={() => navigate(route)} className="cursor-pointer">
      {/* <span className="font-bold text-2xl text-[#189AF8]">{name}</span> */}
      <img src={imgSrc} alt="Logo" className="h-16" onError={() => {
        setImgSrc(fallbackLogo);
      }} />
    </div>
  );
}
