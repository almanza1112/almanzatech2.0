import React from "react";
import CountUp from "./ui/CountUp";
import Reveal from "./ui/Reveal";
import { SITE, yearsInBusiness } from "../data/site";

/** Every figure here is drawn from claims already made elsewhere on the site —
 *  nothing invented. */
const STATS = [
  {
    value: yearsInBusiness(),
    suffix: "",
    label: "Years in business",
    note: `Building since ${SITE.foundedYear}`,
  },
  {
    value: 100,
    suffix: "%",
    label: "Original code",
    note: "Never a template",
  },
  {
    value: 6,
    suffix: "",
    label: "Services in-house",
    note: "Nothing outsourced",
  },
  {
    value: 12,
    suffix: "",
    label: "Months of support",
    note: "Guaranteed on most projects",
  },
];

const Proof = () => (
  <section
    className="section section--alt section--ruled relative overflow-hidden !py-14 md:!py-20"
    aria-label="AlmanzaTech at a glance"
  >
    <div
      className="blueprint-grid blueprint-grid--masked absolute inset-0 opacity-60"
      aria-hidden="true"
    />

    <div className="shell relative">
      <ul className="grid grid-cols-2 gap-y-10 sm:gap-y-12 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <Reveal
            as="li"
            key={stat.label}
            delay={i * 100}
            className="border-l border-line px-5 sm:px-7"
          >
            <p className="font-display text-4xl font-bold leading-none text-primary sm:text-5xl">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-3 font-display text-sm font-semibold sm:text-base">
              {stat.label}
            </p>
            <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted">
              {stat.note}
            </p>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);

export default Proof;
