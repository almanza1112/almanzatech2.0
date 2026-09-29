import React, { useEffect, useState } from "react";
import { PAGE_COPY } from "../data/work";
import { track } from "../lib/analytics";
import { supportsObserver } from "../lib/motion";

const CallBar = () => {
  const [heroActionsVisible, setHeroActionsVisible] = useState(supportsObserver);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    if (!supportsObserver) return undefined;

    const heroActions = document.querySelector(".hero-actions");
    const contact = document.getElementById("contact");
    const heroObserver = new IntersectionObserver(
      ([entry]) => setHeroActionsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    const contactObserver = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.intersectionRatio >= 0.15),
      { threshold: [0, 0.15] }
    );

    if (heroActions) heroObserver.observe(heroActions);
    else setHeroActionsVisible(false);
    if (contact) contactObserver.observe(contact);

    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);

  const visible = !supportsObserver || (!heroActionsVisible && !contactVisible);

  return (
    <nav
      className={`callbar${visible ? "" : " callbar--hidden"}`}
      aria-label="Quick contact"
      aria-hidden={!visible}
    >
      <a
        className="callbar-call"
        href={PAGE_COPY.callbar.href}
        tabIndex={visible ? undefined : -1}
        onClick={() =>
          track("contact_click", { channel: "phone", location: "mobile_bar" })
        }
      >
        {PAGE_COPY.callbar.label}
      </a>
      <a
        className="callbar-start"
        href={PAGE_COPY.startProject.href}
        tabIndex={visible ? undefined : -1}
        onClick={() =>
          track("cta_click", {
            label: PAGE_COPY.startProject.label,
            location: "mobile_bar",
          })
        }
      >
        {PAGE_COPY.startProject.label}
      </a>
    </nav>
  );
};

export default CallBar;
