import React, { useEffect, useRef, useState } from "react";
import Logo from "../assets/almanzatech.png";
import { SITE } from "../data/site";
import { DESKTOP_NAV_LINKS, NAV_LINKS, PAGE_COPY } from "../data/work";

const Navbar = ({ isHome = true }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 40);
  const summaryRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      summaryRef.current?.focus();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className={`hdr-shell${!isHome || scrolled ? " hdr-shell--solid" : ""}`}>
      <a className="skip-link" href={PAGE_COPY.header.skipLink.href}>
        {PAGE_COPY.header.skipLink.label}
      </a>

      <div className="wrap hdr-inner">
        <a
          className="hdr-logo"
          href="/#top"
          aria-label={`${SITE.shortName} — back to top`}
        >
          <img src={Logo} alt={SITE.shortName} width={500} height={100} />
        </a>

        <nav className="hdr-nav" aria-label="Primary">
          {DESKTOP_NAV_LINKS.map((link) => (
            <a className="hdr-link" key={link.id} href={`/#${link.id}`}>
              {link.label}
            </a>
          ))}
        </nav>

        <details
          className="hdr-menu"
          open={open}
          onToggle={(event) => setOpen(event.currentTarget.open)}
        >
          <summary ref={summaryRef}>{PAGE_COPY.header.menu}</summary>
          <nav className="hdr-panel" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`/#${link.id}`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
};

export default Navbar;
