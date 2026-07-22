"use client";

import { useState } from "react";
import { SERVICES } from "@/lib/data";
import Reveal from "@/components/Reveal";
import Star from "@/components/Star";
import SectionConstellation from "@/components/SectionConstellation";

type Tab = "individuals" | "business";

const TABS = [
  { id: "individuals" as const, label: "Для физических лиц" },
  { id: "business" as const, label: "Для юридических лиц" },
];

export default function Services() {
  const [tab, setTab] = useState<Tab>("individuals");
  const items = SERVICES[tab];

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-cream py-20 md:py-28 lg:py-32"
    >
      <SectionConstellation tone="wine" opacity={0.025} />
      <div className="container-x relative z-10 mx-auto max-w-[1440px]">
        <Reveal>
          <p className="eyebrow mb-5 flex items-center gap-2 text-wine">
            <Star className="h-2.5 w-2.5" />
            Услуги
          </p>
            <h2 className="type-section-title-lg font-display max-w-[14ch] font-semibold">
            16 практик.
            <br />
            <span className="italic">Одна команда.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mt-10 md:mt-12">
          <div
            role="tablist"
            aria-label="Тип клиента"
            className="relative grid max-w-xl grid-cols-2 border border-ink/15"
          >
            <span
              aria-hidden="true"
              className={`absolute inset-y-0 w-1/2 bg-wine transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                tab === "business" ? "translate-x-full" : "translate-x-0"
              }`}
            />
            {TABS.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(item.id)}
                  className={`type-label relative z-10 cursor-pointer px-4 py-4 text-left font-mono uppercase transition-colors duration-300 md:px-6 ${
                    active ? "text-ivory" : "text-ink/70 hover:text-ink"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <ul className="mt-2 border-t border-ink/15" role="tabpanel">
          {items.map((service, i) => {
            const num = String(i + 1).padStart(2, "0");

            return (
              <li key={`${tab}-${service.title}`} className="border-b border-ink/15">
                <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-x-4 gap-y-2 px-3 py-6 text-ink transition-colors duration-300 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,0.95fr)] md:items-baseline md:gap-x-8 md:px-5 md:py-7 hover:bg-wine hover:text-ivory">
                  <span className="type-label font-mono opacity-40">
                    {num}
                  </span>

                  <h3 className="type-service-title font-display font-medium">
                    {service.title}
                  </h3>

                  <p className="type-body-sm col-start-2 max-w-[40ch] opacity-55 md:col-start-auto md:justify-self-end md:text-right">
                    {service.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
