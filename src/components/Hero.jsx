import React from "react";
import { SITE } from "../data/site";
import { PAGE_COPY } from "../data/work";
import { track } from "../lib/analytics";

const Hero = () => (
  <section id="top" className="hero" aria-labelledby="hero-title">
    <div className="wrap">
      <h1 id="hero-title" className="hero-title">
        {PAGE_COPY.hero.heading}
      </h1>
      <p className="hero-proof hero-outline">
        {PAGE_COPY.hero.proof.split(/(in-house\.)/).map((part, index) =>
          index % 2 ? (
            <span className="keep-together" key={index}>{part}</span>
          ) : part
        )}
      </p>
      <div className="hero-actions">
        <a
          className="btn"
          href={PAGE_COPY.hero.cta.href}
          onClick={() =>
            track("cta_click", {
              label: PAGE_COPY.hero.cta.label,
              location: "hero",
            })
          }
        >
          {PAGE_COPY.hero.cta.label}
        </a>
        <span className="hero-call">
          {PAGE_COPY.hero.callLabel}{" "}
          <a
            className="text-link"
            href={SITE.phoneHref}
            onClick={() =>
              track("contact_click", { channel: "phone", location: "hero" })
            }
          >
            {SITE.phoneDisplay}
          </a>
        </span>
      </div>
    </div>
  </section>
);

export default Hero;
