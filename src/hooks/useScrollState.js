import { useEffect, useState } from "react";
import { clamp, rafThrottle } from "../lib/motion";

/**
 * Scroll-derived UI state, from a single rAF-throttled listener.
 *
 * - `scrolled`  navbar has left the top of the page
 * - `progress`  0..1 read position, for the navbar progress bar
 * - `pastHero`  scrolled past the hero, used to reveal the sticky mobile CTA
 */
export default function useScrollState() {
  const [state, setState] = useState({
    scrolled: false,
    progress: 0,
    pastHero: false,
  });

  useEffect(() => {
    const read = () => {
      const y = window.scrollY || 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      setState((prev) => {
        const next = {
          scrolled: y > 24,
          progress: max > 0 ? clamp(y / max, 0, 1) : 0,
          pastHero: y > window.innerHeight * 0.75,
        };

        // Only re-render when something meaningful moved.
        if (
          prev.scrolled === next.scrolled &&
          prev.pastHero === next.pastHero &&
          Math.abs(prev.progress - next.progress) < 0.002
        ) {
          return prev;
        }
        return next;
      });
    };

    const onScroll = rafThrottle(read);
    read();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return state;
}
