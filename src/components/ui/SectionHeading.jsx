import React from "react";
import Reveal from "./Reveal";

/**
 * The shared section header: numbered mono eyebrow, display-face title, lead.
 * The running index is what gives the page a sense of progression.
 */
const SectionHeading = ({ index, label, title, lead, className = "" }) => (
  <div className={`max-w-3xl ${className}`}>
    <Reveal variant="fade" className="eyebrow">
      <span>
        {index} <span className="opacity-40">/</span> {label}
      </span>
    </Reveal>

    <Reveal as="h2" delay={90} className="section-title">
      {title}
    </Reveal>

    {lead ? (
      <Reveal as="p" delay={170} className="section-lead">
        {lead}
      </Reveal>
    ) : null}
  </div>
);

export default SectionHeading;
