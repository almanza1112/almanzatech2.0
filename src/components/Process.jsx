import React from "react";
import { PAGE_COPY, PROCESS_STEPS } from "../data/work";

const Process = () => (
  <section id="process" className="process-section" aria-labelledby="process-title">
    <div className="wrap">
      <div className="process-head">
        <h2 id="process-title">{PAGE_COPY.process.heading}</h2>
        <p>{PAGE_COPY.process.intro}</p>
      </div>
      <ol className="process-steps">
        {PROCESS_STEPS.map((step, index) => (
          <li className="process-step" key={step.heading}>
            <span className="process-number" aria-hidden="true">{index + 1}</span>
            <h3>{step.heading}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default Process;
