import { useEffect, useLayoutEffect } from "react";

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

/**
 * A link to a section on the same page scrolls there, but the browser leaves
 * focus on the link, so the next Tab would start back in the header. Focus
 * the section itself, so the next Tab starts from it.
 */
export function useSectionFocus() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href*='#']")
          : null;

      if (!link || link.pathname !== location.pathname || !link.hash) return;

      const target = document.getElementById(
        decodeURIComponent(link.hash.slice(1))
      );

      if (!target || target.matches("a, button")) return;

      setTimeout(() => {
        if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
        target.focus({ preventScroll: true });
      });
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);
}
