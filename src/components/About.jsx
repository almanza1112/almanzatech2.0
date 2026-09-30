import React, { useRef } from "react";
import { CASE_STUDIES, PAGE_COPY, TESTIMONIALS } from "../data/work";
import { useReducedMotion } from "../lib/motion";
import { useScrollProgress } from "../lib/useScrollProgress";

const About = () => {
  const copy = PAGE_COPY.about;
  const leadRef = useRef(null);
  const reduced = useReducedMotion();
  const progress = useScrollProgress(leadRef, { start: 0.9, end: 0.45, reduced });
  const words = copy.lead.split(/(\s+)/);
  const litWords = Math.round(progress * Math.ceil(words.length / 2));

  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <div className="wrap">
        <h2 className="about-kicker" id="about-title">{copy.heading}</h2>
        <p className="about-lead" ref={leadRef}>
          {reduced ? copy.lead : words.map((word, index) => index % 2 ? word : (
            <span
              className={`about-word${index / 2 >= litWords ? " about-word--dim" : ""}`}
              key={index}
            >{word}</span>
          ))}
        </p>
        <p className="about-body">{copy.body}</p>

        <h3 className="about-reviews-title">{copy.reviewsHeading}</h3>
        <ul className="about-quotes">
          {TESTIMONIALS.map((testimonial) => {
            const project = CASE_STUDIES.find(({ slug }) => slug === testimonial.projectId);
            return (
              <li key={testimonial.projectId}>
                <figure
                  className="about-quote"
                  style={{ "--c": `var(--c-${project ? project.slug : "websites"})` }}
                >
                  <blockquote><p>{testimonial.quote}</p></blockquote>
                  <figcaption>
                    {project ? (
                      <>
                        {testimonial.attribution.slice(0, -project.name.length)}
                        <a href={`/work/${project.slug}/`}>{project.name}</a>
                      </>
                    ) : testimonial.attribution}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default About;
