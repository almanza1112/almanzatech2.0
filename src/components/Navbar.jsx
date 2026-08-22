import React, { useCallback, useEffect, useState } from "react";
import { FiArrowUpRight, FiMail, FiPhone } from "react-icons/fi";
import Logo from "../assets/almanzatech.png";
import useActiveSection from "../hooks/useActiveSection";
import useScrollState from "../hooks/useScrollState";
import { track } from "../lib/analytics";
import { scrollToId } from "../lib/motion";
import { NAV_IDS, NAV_LINKS, SITE } from "../data/site";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { scrolled, progress } = useScrollState();
  const active = useActiveSection(NAV_IDS);

  const close = useCallback(() => setOpen(false), []);

  // Lock body scroll while the mobile panel is up, and allow Escape to dismiss.
  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  // Close the panel if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!window.matchMedia) return undefined;

    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => {
      if (e.matches) close();
    };

    // Safari below 14 only has the deprecated addListener.
    if (mq.addEventListener) {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    if (mq.addListener) {
      mq.addListener(onChange);
      return () => mq.removeListener(onChange);
    }
    return undefined;
  }, [close]);

  /** Close first, then scroll — the body scroll lock has to lift before the
   *  document is able to move. */
  const handleMobileNav = (e, id) => {
    e.preventDefault();
    close();
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => scrollToId(id));
    });
  };

  return (
    <>
      <a className="skip-link" href="#services">
        Skip to content
      </a>

      <header
        className={`nav-shell ${scrolled ? "nav-shell--scrolled" : ""}`}
        style={{ "--progress": progress }}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 sm:px-8 md:px-10">
          <a
            href="#top"
            aria-label={`${SITE.shortName} — back to top`}
            className="relative z-50 shrink-0"
          >
            <img
              src={Logo}
              alt={`${SITE.name} logo`}
              width={500}
              height={100}
              className="h-auto w-[150px] transition-all duration-300 sm:w-[180px] md:w-[210px]"
            />
          </a>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="nav-link"
                data-active={active === link.id}
              >
                {link.label}
              </a>
            ))}

            <a
              href="#contact"
              onClick={() =>
                track("cta_click", { label: "Get a quote", location: "navbar" })
              }
              className="btn btn-primary !min-h-[2.75rem] !px-5"
            >
              Get a quote
              <FiArrowUpRight aria-hidden="true" size={15} />
            </a>
          </nav>

          {/* Mobile trigger — a real button with a 44px target */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            data-open={open}
            className="burger relative z-50 -mr-2 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className="burger-bar" />
            <span className="burger-bar" />
          </button>
        </div>

        <span className="nav-progress" aria-hidden="true" />
      </header>

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        className="mobile-panel md:hidden"
        data-open={open}
        aria-hidden={!open}
      >
        <div className="flex min-h-full flex-col px-6 pb-10 pt-28">
          <nav aria-label="Mobile">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleMobileNav(e, link.id)}
                className="mobile-link mobile-stagger"
                style={{ "--i": i }}
                tabIndex={open ? 0 : -1}
              >
                <span className="idx">0{i + 1}</span>
                {link.label}
              </a>
            ))}
          </nav>

          <div
            className="mobile-stagger mt-auto pt-10"
            style={{ "--i": NAV_LINKS.length }}
          >
            <div className="flex flex-col gap-4 font-mono text-sm">
              <a
                href={SITE.phoneHref}
                onClick={() =>
                  track("contact_click", {
                    channel: "phone",
                    location: "navbar",
                  })
                }
                tabIndex={open ? 0 : -1}
                className="flex items-center gap-3 text-muted transition-colors hover:text-primary"
              >
                <FiPhone aria-hidden="true" className="text-primary" size={16} />
                {SITE.phoneDisplay}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                onClick={() =>
                  track("contact_click", {
                    channel: "email",
                    location: "navbar",
                  })
                }
                tabIndex={open ? 0 : -1}
                className="flex items-center gap-3 text-muted transition-colors hover:text-primary"
              >
                <FiMail aria-hidden="true" className="text-primary" size={16} />
                {SITE.email}
              </a>
            </div>

            <a
              href="#contact"
              onClick={(e) => {
                track("cta_click", {
                  label: "Start a project",
                  location: "navbar",
                });
                handleMobileNav(e, "contact");
              }}
              tabIndex={open ? 0 : -1}
              className="btn btn-primary btn-block mt-7"
            >
              Start a project
              <FiArrowUpRight aria-hidden="true" size={16} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
