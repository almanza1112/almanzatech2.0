import React from "react";
import {
  FiArrowUpRight,
  FiBarChart2,
  FiCpu,
  FiMonitor,
  FiSmartphone,
  FiTool,
  FiUsers,
} from "react-icons/fi";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

const SERVICES = [
  {
    icon: FiMonitor,
    title: "Websites",
    text: "Marketing sites, storefronts, and web apps built from scratch — fast, responsive, and yours to own outright. No templates, no license you have to keep renting.",
  },
  {
    icon: FiSmartphone,
    title: "Mobile Applications",
    text: "iOS and Android apps that feel native, from the first sketch through store launch.",
  },
  {
    icon: FiTool,
    title: "IT Support",
    text: "Networks, hardware, email, and backups handled — so your team is never sitting around waiting on tech.",
  },
  {
    icon: FiUsers,
    title: "Consulting",
    text: "Straight answers on stack, architecture, and spend before you commit a budget.",
  },
  {
    icon: FiBarChart2,
    title: "Data Analytics",
    text: "Dashboards and reporting that turn the data you already collect into decisions.",
  },
  {
    icon: FiCpu,
    title: "AI",
    text: "Chatbots, document processing, and AI features built into the software you already run — practical automation, not a science project.",
  },
];

const WhatWeDo = () => (
  <section id="services" className="section section--ruled">
    <div className="shell">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          index="01"
          label="What we do"
          title="Everything your business needs to run online."
          lead="You need a presence people trust and infrastructure that keeps up as you grow. We design and engineer both — with modern technology, in-house, and supported long after launch."
        />

        <Reveal delay={200} className="shrink-0">
          <a href="#contact" className="btn btn-primary">
            Get a quote
            <FiArrowUpRight aria-hidden="true" size={16} />
          </a>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
        {SERVICES.map((service, i) => {
          const Icon = service.icon;

          return (
            <Reveal key={service.title} delay={i * 80} className="card card-hover">
              <span
                className="absolute right-5 top-5 font-mono text-[0.65rem] tracking-widest text-muted opacity-40"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="icon-chip">
                <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
              </span>

              <div className="mt-6">
                <h3 className="card-title">{service.title}</h3>
                <p className="card-text">{service.text}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default WhatWeDo;
