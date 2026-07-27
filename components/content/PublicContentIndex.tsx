"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";

export type PublicContentItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  href: string;
  description?: string;
};

type PublicContentIndexProps = {
  items: PublicContentItem[];
  itemLabel: string;
  emptyLabel: string;
};

export function PublicContentIndex({ items, itemLabel, emptyLabel }: PublicContentIndexProps) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ru");
    if (!normalized) return items;
    return items.filter((item) => `${item.title} ${item.category} ${item.description ?? ""}`.toLocaleLowerCase("ru").includes(normalized));
  }, [items, query]);

  return (
    <section className="border border-ink/10 bg-ivory">
      <div className="border-b border-ink/10 p-4 sm:p-5">
        <label className="relative block w-full max-w-[520px]">
          <Search size={16} strokeWidth={1.4} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink/30" />
          <span className="sr-only">Поиск</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск" className="h-12 w-full border border-ink/12 bg-cream/40 pr-4 pl-10 text-sm outline-none placeholder:text-ink/28 focus:border-wine" />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/10 text-[10px] uppercase tracking-[0.08em] text-ink/35">
              <th className="w-[58%] px-5 py-3 font-normal">Название {itemLabel}</th>
              <th className="w-[24%] px-5 py-3 font-normal">Категории</th>
              <th className="w-[18%] px-5 py-3 font-normal">Дата</th>
              <th className="w-12"><span className="sr-only">Открыть</span></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.id} className="group border-b border-ink/8 last:border-0 hover:bg-wine/[0.025]">
                <td className="px-5 py-6">
                  <Link href={item.href} className="block text-[clamp(1rem,1.6vw,1.3rem)] font-medium tracking-[-0.035em] group-hover:text-wine">{item.title}</Link>
                  {item.description ? <p className="mt-2 max-w-[64ch] text-[11px] leading-relaxed text-ink/38">{item.description}</p> : null}
                </td>
                <td className="px-5 py-6 text-[12px] text-ink/50">{item.category}</td>
                <td className="px-5 py-6 text-[12px] tabular-nums text-ink/40">{item.date}</td>
                <td className="pr-5 text-right"><ArrowUpRight size={17} strokeWidth={1.35} className="inline text-ink/25 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-wine" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!visible.length ? <div className="flex min-h-[260px] items-center justify-center px-5 text-sm text-ink/38">{query ? "По вашему запросу ничего не найдено." : emptyLabel}</div> : null}
    </section>
  );
}
