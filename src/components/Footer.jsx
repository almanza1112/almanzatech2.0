import React from "react";
import Logo from "../assets/almanzatech.png";
import { SITE } from "../data/site";
import { FOOTER_NAV_LINKS, PAGE_COPY } from "../data/work";

const Footer = () => (
  <footer className="foot-section wrap">
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
      <p>{PAGE_COPY.footer.tagline}</p>
      <nav className="foot-links" aria-label="Footer">
        {FOOTER_NAV_LINKS.map((link) => (
          <a key={link.id} href={`/#${link.id}`}>
            {link.label}
          </a>
        ))}
      </nav>
    </div>

    <div className="foot-bottom">
      <p>{PAGE_COPY.footer.copyright}</p>
    </div>
  </footer>
);

export default Footer;
