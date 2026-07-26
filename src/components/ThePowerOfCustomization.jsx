import React from "react";
import { FiClock, FiExternalLink, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import CountUp from "./ui/CountUp";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

const FACTS = [
  {
    icon: FiTrendingUp,
    value: 200,
    suffix: "%",
    headline: "higher conversion",
    text: "A well-designed site can convert up to 200% better — and more than 400% better where the user experience is genuinely superior.",
    source: "Forrester",
    href: "https://www.forrester.com/blogs/09-10-15-leaving_user_experience_to_chance_hurts_companies/",
  },
  {
    icon: FiTrendingDown,
    value: 40,
    suffix: "%",
    headline: "leave after 3 seconds",
    text: "Around 40% of users abandon a site or app that takes longer than three seconds to load. Performance is not a nice-to-have.",
    source: "Google",
    href: "https://www.youtube.com/watch?v=YJGCZCaIZkQ&ab_channel=GoogleChromeDevelopers",
  },
  {
    icon: FiClock,
    value: 10,
    suffix: "s",
    headline: "to make an impression",
    text: "Ten seconds is all you get before a visitor decides whether to stay. We make sure every one of them counts.",
    source: "Sagipl",
    href: "https://blog.sagipl.com/web-design-statistics/",
  },
];

const ThePowerOfCustomization = () => (
  <section className="section section--alt section--ruled">
    <div className="shell">
      <SectionHeading
        index="03"
        label="Why it matters"
        title="Design is not decoration. It is revenue."
        lead="The difference between a site that works and one that merely exists shows up in the numbers."
      />

      <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
        {FACTS.map((fact, i) => {
          const Icon = fact.icon;

          return (
            <Reveal
              key={fact.source}
              delay={i * 110}
              className="card card-hover justify-between"
            >
              <div>
                <span className="icon-chip">
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                </span>

                <p className="mt-7 font-display text-5xl font-bold leading-none text-primary sm:text-6xl">
                  <CountUp value={fact.value} suffix={fact.suffix} />
                </p>
                <h3 className="mt-3 font-display text-base font-semibold uppercase tracking-wide">
                  {fact.headline}
                </h3>
                <p className="card-text">{fact.text}</p>
              </div>

              <a
                href={fact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 self-start font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted transition-colors hover:text-primary"
              >
                Source: {fact.source}
                <FiExternalLink aria-hidden="true" size={12} />
              </a>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default ThePowerOfCustomization;
