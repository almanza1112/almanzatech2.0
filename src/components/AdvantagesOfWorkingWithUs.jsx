import React from "react";
import { FiAward, FiCode, FiDollarSign, FiZap } from "react-icons/fi";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

const ADVANTAGES = [
  {
    icon: FiCode,
    title: "Original Code",
    points: [
      "Every design and every line of code is 100% original and customizable.",
      "Your site or app stands out instead of looking like everyone else's.",
    ],
  },
  {
    icon: FiDollarSign,
    title: "Budget Friendly",
    points: [
      "Budgets can be tight. We understand, and we will work with you to find the right deal.",
      "We stand behind our work with a one-year guarantee on most projects once shipped.",
    ],
  },
  {
    icon: FiAward,
    title: "Seasoned Engineers",
    points: [
      "Experienced software engineers with different specializations under one roof.",
      "All work is done in-house — we do not outsource.",
    ],
  },
  {
    icon: FiZap,
    title: "On-time Results",
    points: [
      "Projects are delivered on time, and often ahead of it.",
      "We work quickly and efficiently to get you up and running.",
    ],
  },
];

const AdvantagesOfWorkingWithUs = () => (
  <section className="section section--alt section--ruled">
    <div className="shell">
      <SectionHeading
        index="05"
        label="Why us"
        title="What you get working with AlmanzaTech."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
        {ADVANTAGES.map((item, i) => {
          const Icon = item.icon;

          return (
            <Reveal
              key={item.title}
              delay={i * 90}
              className="card card-hover"
            >
              <span
                className="absolute right-5 top-5 font-mono text-[0.65rem] tracking-widest text-muted opacity-40"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="icon-chip">
                <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
              </span>

              <h3 className="mt-6 font-display text-lg font-semibold">
                {item.title}
              </h3>

              <ul className="mt-4 space-y-3.5">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span
                      className="mt-2.5 h-px w-3 shrink-0 bg-primary"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default AdvantagesOfWorkingWithUs;
