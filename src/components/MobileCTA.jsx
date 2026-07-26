import React, { useEffect, useState } from "react";
import { FiArrowUpRight, FiPhone } from "react-icons/fi";
import useScrollState from "../hooks/useScrollState";
import { supportsObserver } from "../lib/motion";
import { SITE } from "../data/site";

/**
 * Sticky call/quote bar for phones. Slides in once the hero is behind you, so
 * the two things a visitor most wants are always one tap away — then gets out
 * of the way again when they reach the contact form itself.
 */
const MobileCTA = () => {
  const { pastHero } = useScrollState();
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    const target = document.getElementById("contact");
    if (!target || !supportsObserver) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setAtContact(entry.isIntersecting),
      { threshold: 0.15 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const visible = pastHero && !atContact;

  return (
    <div className="mobile-cta" data-visible={visible} aria-hidden={!visible}>
      <a
        href={SITE.phoneHref}
        className="bg-ink-2 text-primary"
        tabIndex={visible ? 0 : -1}
      >
        <FiPhone aria-hidden="true" size={15} />
        Call us
      </a>
      <a href="#contact" className="bg-primary text-ink" tabIndex={visible ? 0 : -1}>
        Get a quote
        <FiArrowUpRight aria-hidden="true" size={15} />
      </a>
    </div>
  );
};

export default MobileCTA;
