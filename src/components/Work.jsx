import React, { useEffect, useRef, useState } from "react";
import { CASE_STUDIES, WEBSITES, PAGE_COPY } from "../data/work";
import { track } from "../lib/analytics";
import { supportsObserver, usePausedMotion, useReducedMotion } from "../lib/motion";
import { useShotCycle } from "../lib/useShotCycle";
import chinesepod700 from "../assets/chinesepod-app-700.webp";
import chinesepod1400 from "../assets/chinesepod-app-1400.webp";

const CARD_SIZES =
  "(min-width: 1000px) min(calc((100vw - 164px) / 3), 425px), (min-width: 600px) calc((100vw - 82px) / 2), calc(100vw - 40px)";
const FEATURED_SIZES =
  "(min-width: 1000px) min(calc((100vw - 146px) / 2), 647px), (min-width: 600px) calc((100vw - 82px) / 2), calc(100vw - 40px)";
const WEBSITE_SIZES =
  "(min-width: 1000px) min(calc((100vw - 128px) * .42), 551px), (min-width: 600px) calc(100vw - 64px), calc(100vw - 40px)";

const getCardMedia = (project) => {
  switch (project.slug) {
    case "nextplay":
      return { shots: project.media.website.map(({ img }) => img), phone: project.media.app[0].img };
    case "ambe":
      return { shots: [0, 2, 3].map((index) => project.media.website[index].img), phone: project.media.app[0].img };
    case "persyst":
      return { shots: [0, 1, 3].map((index) => project.media.app[index].img) };
    case "chinesepod":
      return { shots: [{ small: chinesepod700, large: chinesepod1400, width: 1400, height: 875 }] };
    default:
      return { shots: [project.img] };
  }
};

const ShotStack = ({ shots, index = 0, phone, sizes }) => (
  <div className="work-frame">
    {shots.map((img, shotIndex) => (
      <img
        key={img.large}
        className={`work-shot${shotIndex === index ? " work-shot--active" : ""}`}
        src={img.large}
        srcSet={img.width === 1400 ? `${img.small} 700w, ${img.large} 1400w` : undefined}
        sizes={img.width === 1400 ? sizes : undefined}
        width={img.width}
        height={img.height}
        alt=""
        loading="lazy"
        decoding="async"
      />
    ))}
    {phone && (
      <img className="work-phone" src={phone.small} width={phone.width} height={phone.height} alt="" loading="lazy" decoding="async" />
    )}
  </div>
);

const Tags = ({ tags }) => (
  <p className="work-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</p>
);

const CaseCard = ({ project, paused, reduced, illuminate }) => {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const { shots, phone } = getCardMedia(project);
  const index = useShotCycle(shots.length, { active: hovered || focused || inView, paused, reduced });

  useEffect(() => {
    if (!supportsObserver) return undefined;
    const media = window.matchMedia?.("(hover: none)");
    if (!media) return undefined;
    let observer;
    const observe = () => {
      observer?.disconnect();
      setInView(false);
      if (!media.matches) return;
      observer = new IntersectionObserver(([entry]) => {
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.6);
      }, { threshold: 0.6 });
      observer.observe(cardRef.current);
    };
    observe();
    if (media.addEventListener) media.addEventListener("change", observe);
    else media.addListener?.(observe);
    return () => {
      observer?.disconnect();
      if (media.removeEventListener) media.removeEventListener("change", observe);
      else media.removeListener?.(observe);
    };
  }, []);

  return (
    <a
      ref={cardRef}
      className="work-card"
      href={`/work/${project.slug}/`}
      onPointerEnter={(event) => {
        if (event.pointerType === "touch") return;
        setHovered(true);
        illuminate(event.currentTarget, project.slug);
      }}
      onPointerLeave={() => setHovered(false)}
      onPointerCancel={() => setHovered(false)}
      onFocus={(event) => {
        setFocused(true);
        illuminate(event.currentTarget, project.slug);
      }}
      onBlur={() => setFocused(false)}
      onClick={() => track("cta_click", {
        label: `${project.name} case study`, location: "work",
      })}
    >
      <ShotStack shots={shots} index={index} phone={phone} sizes={phone ? FEATURED_SIZES : CARD_SIZES} />
      <div className="work-body">
        <Tags tags={project.tags} />
        <h3>{project.name}</h3>
        <p className="work-text">{project.cardText}</p>
        <span className="work-more">{PAGE_COPY.work.caseLink}<span className="work-arrow" aria-hidden="true">→</span></span>
      </div>
    </a>
  );
};

const Work = () => {
  const { websitesCard } = PAGE_COPY.work;
  const sectionRef = useRef(null);
  const [paused] = usePausedMotion();
  const reduced = useReducedMotion();
  const illuminate = (card, slug) => {
    if (reduced || paused) return;
    const section = sectionRef.current;
    const bounds = section.getBoundingClientRect();
    const target = card.getBoundingClientRect();
    section.style.setProperty("--glow", `var(--c-${slug})`);
    if (bounds.width && bounds.height) {
      section.style.setProperty("--gx", `${100 * (target.left + target.width / 2 - bounds.left) / bounds.width}%`);
      section.style.setProperty("--gy", `${100 * (target.top + target.height / 2 - bounds.top) / bounds.height}%`);
    }
  };

  return (
    <section ref={sectionRef} id="work" className="work-section" aria-labelledby="work-title">
      <div className="wrap">
        <div className="work-head">
          <h2 id="work-title">{PAGE_COPY.work.heading}</h2>
          <p>{PAGE_COPY.work.intro}</p>
        </div>

        <ul className="work-grid">
          {CASE_STUDIES.map((project, index) => (
            <li
              className={`work-item ${index < 2 ? "work-item--featured" : "work-item--secondary"}${project.slug === "persyst" ? " work-item--persyst" : ""}`}
              key={project.slug}
              style={{ "--c": `var(--c-${project.slug})` }}
            >
              <CaseCard project={project} paused={paused} reduced={reduced} illuminate={illuminate} />
            </li>
          ))}

          <li id="websites" className="work-item work-item--websites" style={{ "--c": "var(--c-websites)" }}>
            <div
              className="work-card work-card--static"
              onPointerEnter={(event) => illuminate(event.currentTarget, "websites")}
              onFocus={(event) => illuminate(event.currentTarget, "websites")}
            >
              <ShotStack shots={[websitesCard.img]} sizes={WEBSITE_SIZES} />
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
      </div>
    </section>
  );
};

export default Work;
