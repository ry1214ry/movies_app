import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useKeyboardShortcuts(searchInputRef) {
  const navigate = useNavigate();

  useEffect(() => {
    let pendingKey = null;
    let timeout = null;

    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      const isInput =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      if (e.key === "Escape") {
        if (isInput) e.target.blur();
        return;
      }

      if (isInput) return;

      if (e.key === "/" && searchInputRef?.current) {
        e.preventDefault();
        searchInputRef.current.focus();
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        navigate("/contact");
        return;
      }

      if (pendingKey === "g") {
        clearTimeout(timeout);
        pendingKey = null;
        switch (e.key) {
          case "h":
            navigate("/");
            break;
          case "m":
            navigate("/movies");
            break;
          case "f":
            navigate("/favorites");
            break;
          case "w":
            navigate("/watchlist");
            break;
          case "t":
            navigate("/trending");
            break;
          default:
            break;
        }
        return;
      }

      if (e.key === "g") {
        pendingKey = "g";
        timeout = setTimeout(() => {
          pendingKey = null;
        }, 1000);
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate, searchInputRef]);
}
