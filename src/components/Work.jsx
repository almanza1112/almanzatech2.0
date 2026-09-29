import React from "react";
import { CASE_STUDIES, WEBSITES, PAGE_COPY } from "../data/work";
import { track } from "../lib/analytics";

// Three equal columns inside the 1312px cap at desktop, two at tablet, one on phones.
const CARD_SIZES =
  "(min-width: 1000px) min(calc((100vw - 176px) / 3), 421px), (min-width: 600px) calc((100vw - 88px) / 2), calc(100vw - 40px)";

const CardImage = ({ img }) => (
  <div className="work-frame">
    <img
      src={img.small}
      srcSet={`${img.small} 700w, ${img.large} 1400w`}
      sizes={CARD_SIZES}
      width={img.width}
      height={img.height}
      alt=""
      loading="lazy"
    />
  </div>
);

const Tags = ({ tags }) => <p className="work-tags">{tags.join(" · ")}</p>;

const Work = () => {
  const { websitesCard } = PAGE_COPY.work;

  return (
    <section id="work" className="work-section wrap" aria-labelledby="work-title">
      <div className="work-head">
        <h2 id="work-title">{PAGE_COPY.work.heading}</h2>
        <p>{PAGE_COPY.work.intro}</p>
      </div>

      <ul className="work-grid">
        {CASE_STUDIES.map((project) => (
          <li key={project.slug}>
            {/* The whole card is one link so the click target matches what reads as one item. */}
            <a
              className="work-card"
              href={`/work/${project.slug}/`}
              onClick={() => track("cta_click", {
                label: `${project.name} case study`, location: "work",
              })}
            >
              <CardImage img={project.img} />
              <div className="work-body">
                <Tags tags={project.tags} />
                <h3>{project.name}</h3>
                <p className="work-text">{project.cardText}</p>
                <span className="work-more">{PAGE_COPY.work.caseLink}</span>
              </div>
            </a>
          </li>
        ))}

        <li id="websites">
          <div className="work-card work-card--static">
            <CardImage img={websitesCard.img} />
            <div className="work-body">
              <Tags tags={websitesCard.tags} />
              <h3>{websitesCard.name}</h3>
              <ul className="work-sites">
                {WEBSITES.map((site) => (
                  <li key={site.id}>
                    <a
                      className="work-site-link"
                      href={site.links[0].href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track("cta_click", {
                        label: `${site.name}: ${site.links[0].label}`, location: "work",
                      })}
                    >
                      <span className="work-site-name">{site.name}</span>
                      <span className="ext" aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    <span className="work-site-short">{site.short}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </section>
  );
};

export default Work;
