import { bg } from "@/constants";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { IProps } from "@/types";
import { useLocation } from "react-router-dom";

// Paths where header and footer should be hidden
const HIDDEN_HEADER_FOOTER_PATHS = [
  "/document",
];

export default function CommonLayout({ children }: IProps) {
  const location = useLocation();
  const shouldHideHeaderFooter = HIDDEN_HEADER_FOOTER_PATHS.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <div className={`${bg} min-h-screen flex flex-col`}>
      {!shouldHideHeaderFooter && <Navbar />}
      <div className="grow-1">{children}</div>
      {!shouldHideHeaderFooter && <Footer />}
    </div>
  );
}
