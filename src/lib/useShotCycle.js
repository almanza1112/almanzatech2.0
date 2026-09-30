import { useEffect, useState } from "react";

export const useShotCycle = (count, { active, paused, reduced }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active || paused || reduced || count < 2) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 1300);
    return () => window.clearInterval(timer);
  }, [count, active, paused, reduced]);

  return index;
};
