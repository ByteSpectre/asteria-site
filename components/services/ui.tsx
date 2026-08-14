import type { ReactNode } from "react";
import Link from "next/link";
import Arrow from "@/components/Arrow";
import Star from "@/components/Star";
import LeadButton from "@/components/contact/LeadButton";

export function pad(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function SectionEyebrow({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={`eyebrow mb-4 flex items-center gap-2 sm:mb-5 ${
        light ? "text-ivory/55" : "text-wine"
      }`}
    >
      <Star className="h-2.5 w-2.5" />
      {children}
    </p>
  );
}

export function AccordionPanel({
  open,
  children,
  className = "",
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
      aria-hidden={!open}
      {...(!open ? { inert: true } : {})}
    >
      <div className={`overflow-hidden ${open ? "" : "pointer-events-none"}`}>
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}

export function ServiceBreadcrumb({
  category,
  title,
}: {
  category: string;
  title: string;
}) {
  return (
    <nav
      className="flex flex-wrap items-center gap-x-3 gap-y-1 py-5 sm:pt-6 sm:pb-8"
      aria-label="Навигация по разделу"
    >
      <span className="eyebrow text-ink/40">Услуги</span>
      <span className="eyebrow text-ink/25" aria-hidden>
        /
      </span>
      <span className="eyebrow text-ink/40">{category}</span>
      <span className="eyebrow hidden text-ink/25 sm:inline" aria-hidden>
        /
      </span>
      <span className="eyebrow hidden max-w-[28ch] truncate text-ink/55 sm:inline">{title}</span>
    </nav>
  );
}

export function MessengerButton({
  children,
  className = "",
  serviceName,
}: {
  children: ReactNode;
  className?: string;
  /** If set, opens service-order form with this title locked. */
  serviceName?: string;
}) {
  return (
    <LeadButton
      serviceName={serviceName}
      className={`type-label min-h-12 max-w-full w-full justify-center bg-wine px-5 py-3 text-center font-mono leading-tight uppercase text-ivory outline-none transition-colors focus-visible:ring-2 focus-visible:ring-wine focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:w-auto sm:px-6 ${className}`}
    >
      {children}
    </LeadButton>
  );
}

export function TextLink({
  href,
  children,
  light = false,
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
}) {
  const className = `type-label inline-flex items-center gap-2 font-mono uppercase transition-colors ${
    light ? "text-ivory/70 hover:text-ivory" : "text-ink/45 hover:text-wine"
  }`;

  if (href === "messenger") {
    return (
      <LeadButton showArrow={false} className={className}>
        {children}
        <Arrow className="h-3.5 w-3.5" />
      </LeadButton>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
      <Arrow className="h-3.5 w-3.5" />
    </Link>
  );
}

export function ServicePageShell({ children }: { children: ReactNode }) {
  return <div className="service-page overflow-x-clip bg-cream text-ink">{children}</div>;
}
