import { useEffect, useRef } from "react";
import { getRevealObserver, prefersReducedMotion, supportsObserver } from "../lib/motion";

/**
 * Returns a ref to attach to any element carrying a `data-reveal` attribute.
 * The element fades/slides in the first time it scrolls into view.
 *
 * @param {number} delay stagger delay in ms
 */
export default function useReveal(delay = 0) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);

    // No observer support, or motion is unwelcome: show it straight away.
    if (!supportsObserver || prefersReducedMotion()) {
      el.classList.add("is-visible");
      return undefined;
    }

    const observer = getRevealObserver();
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [delay]);

  return ref;
}
