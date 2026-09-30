import React, { useEffect } from "react";
import { CASE_STUDIES, CASE_PAGE_COPY, TESTIMONIALS } from "../data/work";
import { track } from "../lib/analytics";
import CaseMedia from "./CaseMedia";

const CaseText = ({ children }) =>
  children.split(/(sign-in|assist-mode|scroll-driven)/g).map((part, index) =>
    index % 2 ? <span className="keep-together" key={index}>{part}</span> : part
  );

const CaseStudyPage = ({ slug }) => {
  const index = CASE_STUDIES.findIndex((project) => project.slug === slug);
  const project = CASE_STUDIES[index];
  const next = CASE_STUDIES[(index + 1) % CASE_STUDIES.length];
  const testimonial = TESTIMONIALS.find(
    ({ projectId }) => projectId === project.testimonialId
  );

  useEffect(() => {
    document.title = `${project.name} case study · AlmanzaTech`;
  }, [project.name]);

  const trackClick = (label) => track("cta_click", { label, location: "case_study" });

  return (
    <article className="case-page wrap" aria-labelledby="case-title">
      <a className="case-back text-link" href={CASE_PAGE_COPY.back.href}>
        {CASE_PAGE_COPY.back.label}
      </a>
      <header className="case-header">
        <p className="case-kicker">{project.kicker}</p>
        <h1 id="case-title" className="case-title">{project.name}</h1>
        <p className="case-role">{project.roleLine}</p>
        <p className="case-lede">{project.outcome}</p>
      </header>

      <CaseMedia key={project.slug} project={project} />

      <div className="case-body">
        <div className="case-copy">
          {project.summary && <p><CaseText>{project.summary}</CaseText></p>}
          {project.paragraphs.map((paragraph) => (
            <p key={paragraph}><CaseText>{paragraph}</CaseText></p>
          ))}
          {project.buildNote && (
            <>
              <h2>{project.buildNote.heading}</h2>
              <p><CaseText>{project.buildNote.text}</CaseText></p>
              <p className="case-context">{project.context}</p>
            </>
          )}
        </div>
        <div className="case-details">
          {project.stack && (
            <div>
              <h2 className="case-label">{CASE_PAGE_COPY.builtWith}</h2>
              <p>{project.stack}</p>
            </div>
          )}
          <div className="case-links">
            {project.links.map((link) => (
              <a
                className="text-link"
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick(`${project.name}: ${link.label}`)}
              >
                {link.label}
                <span className="ext" aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
          {project.context && !project.buildNote && (
            <p className="case-context">{project.context}</p>
          )}
        </div>
      </div>

      {testimonial && (
        <figure className="case-quote">
          <blockquote><p>{testimonial.quote}</p></blockquote>
          <figcaption>{testimonial.attribution}</figcaption>
        </figure>
      )}

      <nav className="case-next" aria-label={CASE_PAGE_COPY.nextProject}>
        <p className="case-label">{CASE_PAGE_COPY.nextProject}</p>
        <a
          className="text-link"
          href={`/work/${next.slug}/`}
          onClick={() => trackClick(`Next: ${next.name}`)}
        >
          {next.name}<span aria-hidden="true"> →</span>
        </a>
      </nav>

      <section className="case-cta" aria-labelledby="case-cta-title">
        <h2 id="case-cta-title">{CASE_PAGE_COPY.heading}</h2>
        <a
          className="btn btn--ink"
          href={CASE_PAGE_COPY.cta.href}
          onClick={() => trackClick(CASE_PAGE_COPY.cta.label)}
        >
          {CASE_PAGE_COPY.cta.label}
        </a>
      </section>
    </article>
  );
};

export default CaseStudyPage;
