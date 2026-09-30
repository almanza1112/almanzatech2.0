import React from "react";
import { PAGE_COPY, SERVICES } from "../data/work";
import { track } from "../lib/analytics";
import ambeWeb from "../assets/case/ambe-web-1-700.webp";
import ambeApp from "../assets/case/ambe-app-2-600.webp";
import nextplayApp from "../assets/case/nextplay-app-1-600.webp";
import curzonreloApp from "../assets/case/curzonrelo-app-4-600.webp";
import nextplayPlan from "../assets/case/nextplay-app-2-600.webp";
import nextplayHealth from "../assets/case/nextplay-app-5-600.webp";
// Pexels, free commercial use: https://www.pexels.com/photo/450035/
import itDesk from "../assets/stock/it-desk-800.webp";

const visuals = {
  Websites: { images: [ambeWeb], caption: "Ambé Wellness" },
  "Mobile apps": {
    images: [ambeApp, nextplayApp, curzonreloApp],
    caption: "Ambé · NextPlay · CurzonRelo",
  },
  "IT support": { images: [itDesk] },
  "Data and AI": { images: [nextplayPlan, nextplayHealth], caption: "NextPlay Nutrition" },
};

const Services = () => (
  <section id="services" className="svc-section" aria-labelledby="services-title">
    <div className="wrap">
      <div className="svc-head">
        <h2 id="services-title">{PAGE_COPY.services.heading}</h2>
      </div>

      <ul className="svc-list">
        {SERVICES.map((service) => {
          const { images, caption } = visuals[service.name];
          return (
            <li className="svc-row" key={service.name}>
              <h3 className="svc-name">{service.name}</h3>
              <div>
                <p className="svc-summary">{service.summary}</p>
                <ul className="svc-points">
                  {service.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              <figure className={`svc-visual${images.length > 1 ? " svc-visual--phones" : ""}`}>
                {images.map((src) => <img key={src} src={src} alt="" loading="lazy" decoding="async" />)}
                {caption && <figcaption>{caption}</figcaption>}
              </figure>
            </li>
          );
        })}
      </ul>

      <div className="svc-more">
        <p>{PAGE_COPY.services.intro}</p>
        <a
          className="btn"
          href={PAGE_COPY.services.cta.href}
          onClick={() =>
            track("cta_click", {
              label: PAGE_COPY.services.cta.label,
              location: "services",
            })
          }
        >
          {PAGE_COPY.services.cta.label}
        </a>
      </div>
    </div>
  </section>
);

export default Services;
