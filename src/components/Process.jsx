import React from "react";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

const STEPS = [
  {
    title: "Discover",
    text: "We learn your business, your customers, and what success actually looks like for you.",
  },
  {
    title: "Scope",
    text: "A clear plan, a timeline, and a quote you agree to before any code gets written.",
  },
  {
    title: "Build",
    text: "Design and development in-house, with progress you can see every week.",
  },
  {
    title: "Launch",
    text: "Testing, deployment, and handover — including training for your team.",
  },
  {
    title: "Support",
    text: "A full year of guaranteed support on most projects, and we stay reachable after that.",
  },
];

const Process = () => (
  <section id="process" className="section section--ruled">
    <div className="shell">
      <SectionHeading
        index="02"
        label="How we work"
        title="A process you can actually follow."
        lead="No black box, no surprise invoices. You know what happens next at every stage, and who to call when you need us."
      />

      <div className="relative mt-12 md:mt-20">
        {/* Horizontal rail linking the step markers on wide screens */}
        <div
          className="absolute left-[10%] right-[10%] top-6 hidden h-px lg:block"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--line-strong) 8%, var(--line-strong) 92%, transparent)",
          }}
          aria-hidden="true"
        />

        <ol className="lg:grid lg:grid-cols-5 lg:gap-6">
          {STEPS.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={i * 110}
              className="process-step relative flex gap-5 pb-10 last:pb-0 lg:block lg:pb-0"
            >
              {/* Vertical connector between markers on narrow screens */}
              {i < STEPS.length - 1 ? (
                <span
                  className="absolute bottom-0 left-6 top-[3.5rem] w-px lg:hidden"
                  style={{
                    background:
                      "linear-gradient(to bottom, var(--line-strong), transparent)",
                  }}
                  aria-hidden="true"
                />
              ) : null}

              <span className="process-node">{String(i + 1).padStart(2, "0")}</span>

              <div className="pt-2 lg:mt-7 lg:pt-0">
                <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                <p className="card-text lg:pr-4">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

export default Process;
