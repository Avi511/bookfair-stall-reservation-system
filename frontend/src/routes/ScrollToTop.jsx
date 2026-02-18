import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ smooth = true }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const behavior = smooth ? "smooth" : "auto";
    window.scrollTo({ top: 0, behavior });
  }, [pathname, smooth]);

  return null;
}
