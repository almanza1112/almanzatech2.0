import React from "react";
import { FiArrowUp, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import Logo from "../assets/almanzatech.png";
import { NAV_LINKS, SITE } from "../data/site";
import { track } from "../lib/analytics";

const SERVICES = [
  "Websites",
  "Mobile Applications",
  "IT Support",
  "Consulting",
  "Data Analytics",
  "AI",
];

// The extra bottom padding on mobile keeps the sticky call/quote bar clear of
// the footer content.
const Footer = () => (
  <footer className="section section--alt section--ruled py-16 pb-28 md:py-20 md:pb-20">
    <div className="shell">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <img
            src={Logo}
            alt={`${SITE.name} logo`}
            width={500}
            height={100}
            className="h-auto w-[180px]"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            Custom websites, mobile apps, and IT support — designed and engineered
            in-house for businesses and entrepreneurs since {SITE.foundedYear}.
          </p>
          <p className="mt-5 flex items-center gap-2.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted">
            <FiMapPin aria-hidden="true" className="text-primary" size={13} />
            {SITE.location}
          </p>
        </div>

        <nav className="md:col-span-3" aria-label="Services">
          <h2 className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-primary">
            Services
          </h2>
          <ul className="mt-5 space-y-3">
            {SERVICES.map((service) => (
              <li key={service}>
                <a href="#services" className="link-underline text-sm text-muted">
                  {service}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="md:col-span-2" aria-label="Footer">
          <h2 className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-primary">
            Company
          </h2>
          <ul className="mt-5 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="link-underline text-sm text-muted">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <h2 className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-primary">
            Get in touch
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a
                href={SITE.phoneHref}
                onClick={() =>
                  track("contact_click", {
                    channel: "phone",
                    location: "footer",
                  })
                }
                className="flex items-center gap-2.5 text-muted transition-colors hover:text-primary"
              >
                <FiPhone aria-hidden="true" size={14} />
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                onClick={() =>
                  track("contact_click", {
                    channel: "email",
                    location: "footer",
                  })
                }
                className="flex items-center gap-2.5 break-all text-muted transition-colors hover:text-primary"
              >
                <FiMail aria-hidden="true" size={14} />
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-line pt-7 sm:flex-row sm:items-center">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>

        <a
          href="#top"
          className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted transition-colors hover:text-primary"
        >
          Back to top
          <FiArrowUp aria-hidden="true" size={13} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
