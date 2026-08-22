import { useEffect } from "react";
import { track } from "../lib/analytics";
import { supportsObserver } from "../lib/motion";

/**
 * Tracks the first time each requested section reaches the viewport's middle.
 *
 * @param {string[]} ids section ids in document order (pass a module-level
 *                       constant — a new array each render retears the effect)
 */
export default function useSectionViews(ids) {
  useEffect(() => {
    if (!supportsObserver) return undefined;

    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          track("section_view", { section_id: entry.target.id });
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);
}
