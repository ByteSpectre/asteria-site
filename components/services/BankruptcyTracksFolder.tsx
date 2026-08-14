"use client";

import Reveal from "@/components/Reveal";
import LeadButton from "@/components/contact/LeadButton";
import { SectionEyebrow } from "@/components/services/ui";

type TrackLink = {
  label: string;
  href: string;
  kind?: "article" | "messenger";
};

export type BankruptcyTrack = {
  title: string;
  summary: string;
  label: string;
  actions: readonly string[];
  note: string | null;
  links: readonly TrackLink[];
};

const CTA_LABEL = "Узнать, подходит ли вам банкротство";

function CheckIcon({ light = false }: { light?: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`mt-0.5 h-4 w-4 shrink-0 ${light ? "text-ivory" : "text-wine"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M2.2 6.1 4.7 8.5 9.8 3.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BankruptcyTracksFolder({
  tracks,
}: {
  tracks: readonly BankruptcyTrack[];
}) {
  return (
    <section className="relative overflow-hidden bg-cream py-16 text-ink sm:py-20 md:py-28">
      <div className="container-x relative z-10 mx-auto max-w-[1440px]">
        <Reveal>
          <SectionEyebrow>Наши услуги</SectionEyebrow>
          <h2 className="type-section-title font-display max-w-[14ch]">Три сценария защиты</h2>
          <p className="type-body-sm mt-5 max-w-[42ch] text-ink/55">
            Выберите ситуацию — состав работ и следующий шаг уже внутри карточки.
          </p>
        </Reveal>

        <ul className="mt-12 flex flex-col gap-5 md:mt-16 md:gap-6">
          {tracks.map((track, index) => {
            const featured = track.label === "Ипотека";

            return (
              <li key={track.title}>
                <Reveal delay={index * 0.05}>
                  <article className={featured ? "bg-wine text-ivory" : "bg-ivory text-ink"}>
                    <div className="grid lg:grid-cols-2">
                      <div className="flex flex-col justify-between gap-12 px-8 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14 lg:pr-14">
                        <div className="text-left">
                          <p className={`eyebrow ${featured ? "text-ivory/45" : "text-ink/40"}`}>
                            {track.label}
                          </p>
                          <h3
                            className={`font-display mt-4 text-[clamp(1.625rem,2.2vw,2.25rem)] leading-[1.2] font-medium tracking-[-0.035em] sm:mt-5 ${
                              featured ? "text-ivory" : "text-ink"
                            }`}
                          >
                            {track.title}
                          </h3>
                          <p
                            className={`type-body-sm mt-4 max-w-[34ch] ${
                              featured ? "text-ivory/65" : "text-ink/55"
                            }`}
                          >
                            {track.summary}
                          </p>
                        </div>
                        <div className="text-left">
                          <LeadButton
                            serviceName={track.title}
                            className={
                              featured
                                ? "type-label h-12 max-w-full justify-center bg-ivory px-5 font-mono uppercase text-wine transition-colors hover:bg-cream sm:px-7"
                                : "type-label h-12 max-w-full justify-center bg-wine px-5 font-mono uppercase text-ivory transition-colors hover:bg-wine-deep sm:px-7"
                            }
                          >
                            {CTA_LABEL}
                          </LeadButton>
                        </div>
                      </div>

                      <div className="px-8 py-10 text-left sm:px-10 sm:py-12 lg:px-12 lg:py-14 lg:pl-14">
                        <p className={`eyebrow ${featured ? "text-ivory/45" : "text-ink/40"}`}>
                          Что входит
                        </p>
                        <ul className="mt-5 space-y-3.5">
                          {track.actions.map((action) => (
                            <li
                              key={action}
                              className={`flex items-start gap-3 type-body-sm ${
                                featured ? "text-ivory/70" : "text-ink/65"
                              }`}
                            >
                              <CheckIcon light={featured} />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                        {track.note ? (
                          <p
                            className={`type-body-sm mt-6 border-l-2 pl-4 ${
                              featured
                                ? "border-ivory/30 text-ivory/50"
                                : "border-wine/30 text-ink/45"
                            }`}
                          >
                            {track.note}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
