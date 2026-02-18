import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resets scroll to top on route changes
export default function ScrollToTop({ smooth = true }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const behavior = smooth ? "smooth" : "auto";
    window.scrollTo({ top: 0, behavior });
  }, [pathname, smooth]);

  return null;
}
