import { useEffect, useState } from "react";
import { supportsObserver } from "../lib/motion";

/**
 * Tracks which section is currently under a band near the middle of the
 * viewport, so the navbar can highlight the matching link.
 *
 * @param {string[]} ids section element ids, in document order
 */
export default function useActiveSection(ids) {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!supportsObserver) return undefined;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return undefined;

    const visible = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });

        // Keep the last known section when the band falls between two of them.
        const first = ids.find((id) => visible.has(id));
        if (first) setActive(first);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
