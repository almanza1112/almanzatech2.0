import React from "react";
import { PAGE_COPY, SERVICES } from "../data/work";
import { track } from "../lib/analytics";

const Services = () => (
  <section id="services" className="svc-section" aria-labelledby="services-title">
    <div className="wrap">
      <div className="svc-head">
        <h2 id="services-title">{PAGE_COPY.services.heading}</h2>
      </div>

      <ul className="svc-grid">
        {SERVICES.map((service) => (
          <li className="svc-card" key={service.name}>
            <h3>{service.name}</h3>
            <p className="svc-summary">{service.summary}</p>
            <ul className="svc-points">
              {service.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </li>
        ))}
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
