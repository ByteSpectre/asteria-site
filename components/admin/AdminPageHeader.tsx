import Link from "next/link";
import { ExternalLink } from "lucide-react";

type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  publicHref?: string;
};

export function AdminPageHeader({ eyebrow, title, description, publicHref }: AdminPageHeaderProps) {
  return (
    <header className="flex flex-col gap-6 border-b border-ink/10 pb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-[0.11em] text-wine">{eyebrow}</p>
        <h1 className="mt-3 text-[clamp(2.75rem,6vw,5.25rem)] leading-[0.92] tracking-[-0.07em]">{title}</h1>
        <p className="mt-5 max-w-[56ch] text-sm leading-relaxed text-ink/45">{description}</p>
      </div>
      {publicHref ? (
        <Link href={publicHref} target="_blank" className="inline-flex h-10 shrink-0 items-center gap-2 border border-ink/12 px-4 text-[10px] uppercase tracking-[0.07em] text-ink/48 transition-colors hover:border-wine hover:text-wine">
          Открыть на сайте <ExternalLink size={13} strokeWidth={1.4} />
        </Link>
      ) : null}
    </header>
  );
}
