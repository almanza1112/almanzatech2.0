import { useEffect, useState } from "react";
import { supportsObserver } from "./motion";

// Final states are the default, including before the first animation frame.
export const useScrollProgress = (ref, { start, end, reduced }) => {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    setProgress(1);
    const element = ref.current;
    if (reduced || !element || typeof window.requestAnimationFrame !== "function") {
      return undefined;
    }

    let frame = null;
    let visible = true;
    const measure = () => {
      frame = null;
      const { top, height } = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (!height || !viewport) return;
      setProgress(Math.min(1, Math.max(0,
        (viewport * start - top) / (height + viewport * (start - end))
      )));
    };
    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(measure);
    };
    const onScroll = () => {
      if (visible) schedule();
    };

    // Skip offscreen scroll reads where supported; the listener also works alone.
    const observer = supportsObserver ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule(); // Measure the final position when leaving the viewport, too.
    }, { threshold: 0 }) : null;
    observer?.observe(element);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [ref, start, end, reduced]);

  return reduced ? 1 : progress;
};
