import React from "react";
import { FiArrowUpRight, FiMapPin } from "react-icons/fi";
import WhoWeAreImg from "../assets/whoweare.png";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";
import { SITE } from "../data/site";

const WhoWeAre = () => (
  <section id="about" className="section section--ruled">
    <div className="shell">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Framed, duotoned so the photography reads as part of the system */}
        <Reveal variant="left" className="relative order-last lg:order-first">
          <div className="bracket-frame relative">
            <div className="duotone aspect-[3/2] w-full">
              <img
                src={WhoWeAreImg}
                width={750}
                height={500}
                loading="lazy"
                decoding="async"
                alt="A developer reviewing web and mobile application designs on a phone, tablet, and laptop"
              />
            </div>
          </div>

          <div className="relative z-10 -mt-10 ml-4 inline-flex flex-col border border-line-strong bg-ink px-6 py-4 sm:ml-8">
            <span className="font-display text-2xl font-bold leading-none text-primary">
              Est. {SITE.foundedYear}
            </span>
            <span className="mt-1.5 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted">
              <FiMapPin aria-hidden="true" size={12} />
              {SITE.location}
            </span>
          </div>
        </Reveal>

        <div>
          <SectionHeading
            index="04"
            label="Who we are"
            title="A small team that treats your project like our own."
          />

          <Reveal delay={120}>
            <p className="mt-7 leading-relaxed text-muted">
              Based in {SITE.location}, AlmanzaTech has been building custom
              applications for individuals and businesses since {SITE.foundedYear}.
              We are a dedicated team, all in-house, and nothing we ship gets handed
              off to a contractor you have never met.
            </p>

            <blockquote className="my-8 border-l-2 border-primary pl-6">
              <p className="font-display text-xl font-medium leading-snug sm:text-2xl">
                “Every final product we create should be a work of art.”
              </p>
            </blockquote>

            <p className="leading-relaxed text-muted">
              We treat you like family here, and a project is not finished until you
              are completely satisfied with it.
            </p>

            <a href="#contact" className="btn btn-primary mt-9">
              Work with us
              <FiArrowUpRight aria-hidden="true" size={16} />
            </a>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

export default WhoWeAre;
