import React from "react";
import { CASE_STUDIES, PAGE_COPY, TESTIMONIALS } from "../data/work";

const About = () => {
  const copy = PAGE_COPY.about;

  return (
    <section id="about" className="about-section wrap" aria-labelledby="about-title">
      <div className="about-head">
        <h2 id="about-title">{copy.heading}</h2>
        <p className="about-lead">{copy.lead}</p>
        <p className="about-body">{copy.body}</p>
      </div>

      <h3 className="about-reviews-title">{copy.reviewsHeading}</h3>
      <ul className="about-quotes">
        {TESTIMONIALS.map((testimonial) => {
          const project = CASE_STUDIES.find(({ slug }) => slug === testimonial.projectId);
          return (
            <li key={testimonial.projectId}>
              <figure className="about-quote">
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
    </section>
  );
};

export default About;
