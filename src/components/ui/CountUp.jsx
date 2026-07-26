import React, { useEffect, useRef, useState } from "react";
import { clamp, easeOutExpo, prefersReducedMotion, supportsObserver } from "../../lib/motion";

/**
 * Counts from zero to `value` the first time it scrolls into view.
 * Falls back to the final value immediately when motion is reduced.
 */
const CountUp = ({
  value,
  duration = 1600,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}) => {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (!supportsObserver || prefersReducedMotion()) {
      setDisplay(value);
      return undefined;
    }

    let frame = null;

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();

        const startedAt = performance.now();
        const tick = (now) => {
          const t = clamp((now - startedAt) / duration, 0, 1);
          setDisplay(value * easeOutExpo(t));
          if (t < 1) frame = window.requestAnimationFrame(tick);
          else setDisplay(value);
        };
        frame = window.requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export default CountUp;
