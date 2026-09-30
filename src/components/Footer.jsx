import React from "react";
import Logo from "../assets/almanzatech.png";
import { SITE } from "../data/site";
import { FOOTER_NAV_LINKS, PAGE_COPY } from "../data/work";

const [taglineStart, taglineAccent] = PAGE_COPY.footer.tagline.split(/(?=the systems behind them\.)/);

const Footer = () => (
  <footer className="foot-section">
    <div className="wrap">
      <p className="foot-statement" aria-hidden="true">
        {taglineStart}<span className="foot-accent">{taglineAccent}</span>
      </p>
      <div className="foot-main">
        <a className="foot-logo" href="/#top">
          <img
            src={Logo}
            alt={SITE.shortName}
            width={500}
            height={100}
            loading="lazy"
          />
        </a>
        <p className="sr-only">{PAGE_COPY.footer.tagline}</p>
        <nav className="foot-links" aria-label="Footer">
          {FOOTER_NAV_LINKS.map((link) => (
            <a key={link.id} href={`/#${link.id}`}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="foot-bottom">
        <p>
          <span>{PAGE_COPY.footer.copyright}</span>{" · "}
          <a className="privacy-footer-link" href={PAGE_COPY.footer.privacy.href}>
            {PAGE_COPY.footer.privacy.label}
          </a>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
