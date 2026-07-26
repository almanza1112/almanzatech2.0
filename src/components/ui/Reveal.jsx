import React from "react";
import useReveal from "../../hooks/useReveal";

/**
 * Wraps children in an element that animates into view on first scroll.
 *
 * @param {string} variant "up" (default) | "left" | "right" | "scale" | "fade"
 * @param {number} delay   stagger in ms
 */
const Reveal = ({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  className = "",
  children,
  ...rest
}) => {
  const ref = useReveal(delay);

  return (
    <Tag ref={ref} data-reveal={variant} className={className} {...rest}>
      {children}
    </Tag>
  );
};

export default Reveal;
