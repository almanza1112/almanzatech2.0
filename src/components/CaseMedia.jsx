import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CASE_PAGE_COPY } from "../data/work";

const IMAGE_SIZES =
  "(min-width: 1000px) min(calc(100vw - 128px), 1312px), (min-width: 600px) calc(100vw - 64px), calc(100vw - 40px)";
const APP_IMAGE_SIZES =
  "(min-width: 1000px) 880px, (min-width: 600px) calc(100vw - 64px), calc(100vw - 40px)";

const Carousel = ({ slides, label, eager, kind }) => {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [current, setCurrent] = useState(0);
  const variant = slides[0].img.width > slides[0].img.height ? "wide" : "tall";

  const readPosition = useCallback(() => {
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setAtStart(scrollLeft <= 1);
    setAtEnd(scrollLeft >= scrollWidth - clientWidth - 1);
    if (variant === "wide" && clientWidth > 0) {
      setCurrent(Math.max(0, Math.min(slides.length - 1, Math.round(scrollLeft / clientWidth))));
    }
  }, [slides.length, variant]);

  // Mounted panels need fresh measurements when their tab becomes visible.
  useLayoutEffect(() => {
    readPosition();
  });

  useEffect(() => {
    const track = trackRef.current;
    let frame = null;
    const onScroll = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        readPosition();
      });
    };
    track.addEventListener("scroll", onScroll);
    window.addEventListener("resize", readPosition);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", readPosition);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [readPosition]);

  const move = (direction) => {
    if ((direction < 0 && atStart) || (direction > 0 && atEnd)) return;
    const track = trackRef.current;
    let left;
    if (variant === "wide") {
      left = (current + direction) * track.clientWidth;
    } else {
      const firstSlide = track.children[0];
      const offsets = Array.from(track.children, (slide) => slide.offsetLeft - firstSlide.offsetLeft);
      left = direction > 0
        ? offsets.find((offset) => offset > track.scrollLeft + 1)
        : offsets.reverse().find((offset) => offset < track.scrollLeft - 1) ?? 0;
      if (left === undefined) return;
    }
    const behavior = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      ? "auto" : "smooth";
    track.scrollTo({ left, behavior });
  };

  return (
    <div className={`carousel ${variant === "wide" ? "carousel--wide" : "carousel--tall"} ${kind === "app" ? "carousel--app" : "carousel--website"}`} role="region" aria-roledescription="carousel" aria-label={label}>
      <ul
        className="carousel-track"
        ref={trackRef}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        {slides.map((slide, index) => {
          const { img, alt } = slide;
          const image = (
            <img
              src={img.small}
              srcSet={variant === "wide"
                ? `${img.small} ${Math.round(img.width / 2)}w, ${img.large} ${img.width}w`
                : `${img.small} 1x, ${img.large} 2x`}
              sizes={variant === "wide" ? (kind === "app" ? APP_IMAGE_SIZES : IMAGE_SIZES) : undefined}
              width={img.width}
              height={img.height}
              alt={alt}
              loading={eager && index === 0 ? "eager" : "lazy"}
            />
          );
          return (
            <li className="carousel-slide" key={img.large} aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}: ${slide.label}`}>
              {variant === "tall" ? (
                <figure>
                  {image}
                  <figcaption>{slide.label}</figcaption>
                </figure>
              ) : image}
            </li>
          );
        })}
      </ul>
      <div className="carousel-controls">
        {variant === "wide" && (
          <p className="carousel-status" aria-live="polite">
            <span className="carousel-count">{current + 1} / {slides.length}</span> {slides[current].label}
          </p>
        )}
        <button type="button" className="carousel-btn" aria-label={CASE_PAGE_COPY.media.previous} disabled={atStart} onClick={() => move(-1)}>
          <span aria-hidden="true">←</span>
        </button>
        <button type="button" className="carousel-btn" aria-label={CASE_PAGE_COPY.media.next} disabled={atEnd} onClick={() => move(1)}>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
};

const CaseMedia = ({ project }) => {
  const kinds = ["website", "app"].filter((kind) => project.media[kind].length > 0);
  const [selected, setSelected] = useState(kinds[0]);
  const tabs = useRef({});
  const carousel = (kind) => (
    <Carousel
      kind={kind}
      slides={project.media[kind]}
      label={`${project.name} ${kind === "website" ? "website" : "app"} screenshots`}
      eager={kind === kinds[0]}
    />
  );

  const onTabKeyDown = (event, kind) => {
    const index = kinds.indexOf(kind);
    let next;
    switch (event.key) {
      case "ArrowLeft": next = (index - 1 + kinds.length) % kinds.length; break;
      case "ArrowRight": next = (index + 1) % kinds.length; break;
      case "Home": next = 0; break;
      case "End": next = kinds.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setSelected(kinds[next]);
    tabs.current[kinds[next]].focus();
  };

  return (
    <div className="case-media">
      {kinds.length > 1 ? (
        <>
          <div role="tablist" aria-label={`${project.name} screenshots`}>
            {kinds.map((kind) => (
              <button
                type="button"
                className="case-tab"
                role="tab"
                key={kind}
                ref={(tab) => { tabs.current[kind] = tab; }}
                id={`case-tab-${kind}`}
                aria-selected={selected === kind}
                aria-controls={`case-panel-${kind}`}
                tabIndex={selected === kind ? 0 : -1}
                onClick={() => setSelected(kind)}
                onKeyDown={(event) => onTabKeyDown(event, kind)}
              >
                {CASE_PAGE_COPY.media[kind]}<span className="case-tab-count"> · {project.media[kind].length}</span>
              </button>
            ))}
          </div>
          {kinds.map((kind) => (
            <div role="tabpanel" key={kind} id={`case-panel-${kind}`} aria-labelledby={`case-tab-${kind}`} hidden={selected !== kind}>
              {carousel(kind)}
            </div>
          ))}
        </>
      ) : (
        <>
          <p className="case-media-label">{CASE_PAGE_COPY.media[kinds[0]]} · {project.media[kinds[0]].length}</p>
          {carousel(kinds[0])}
        </>
      )}
    </div>
  );
};

export default CaseMedia;
