import { useLayoutEffect } from "react";

export function useHashFocus() {
  useLayoutEffect(() => {
    const target = location.hash
      ? document.getElementById(decodeURIComponent(location.hash.slice(1)))
      : null;

    if (target?.matches("a, button")) {
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: "center", behavior: "instant" });
    }
  }, []);
}
