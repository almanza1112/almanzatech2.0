import React, { useRef } from "react";
import { PAGE_COPY, PROCESS_STEPS } from "../data/work";
import { useReducedMotion } from "../lib/motion";
import { useScrollProgress } from "../lib/useScrollProgress";
// Pexels (free commercial use): https://www.pexels.com/photo/10375878/
import ownerCall800 from "../assets/stock/owner-call-800.webp";
import ownerCall1600 from "../assets/stock/owner-call-1600.webp";

const Process = () => {
  const stepsRef = useRef(null);
  const reduced = useReducedMotion();
  const progress = useScrollProgress(stepsRef, { start: 0.8, end: 0.35, reduced });

  return (
    <section id="process" className="proc-section" aria-labelledby="process-title">
      <div className="proc-photo" aria-hidden="true">
        <img
          src={ownerCall800}
          srcSet={`${ownerCall800} 800w, ${ownerCall1600} 1600w`}
          sizes="(min-width: 1000px) 50vw, 100vw"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="proc-body">
        <h2 id="process-title">{PAGE_COPY.process.heading}</h2>
        <p className="proc-intro">{PAGE_COPY.process.intro}</p>
        <ol className="proc-steps" ref={stepsRef} style={{ "--p": progress }}>
          {PROCESS_STEPS.map((step, index) => (
            <li
              className={`proc-step${progress >= index / (PROCESS_STEPS.length - 1) ? " proc-step--lit" : ""}`}
              key={step.heading}
            >
              <span className="proc-number" aria-hidden="true">{index + 1}</span>
              <div>
                <h3>{step.heading}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Process;
