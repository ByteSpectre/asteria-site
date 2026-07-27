"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, BriefcaseBusiness } from "lucide-react";

const items = [
  { href: "/admin/knowledge", label: "База знаний", icon: BookOpenText },
  { href: "/admin/services", label: "Услуги", icon: BriefcaseBusiness },
];

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="px-3 py-6" aria-label="Управление контентом">
      <p className="mb-3 px-3 text-[9px] uppercase tracking-[0.13em] text-ivory/32">Управление</p>
      <ul className="space-y-1">
        {items.map((item, index) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link href={item.href} className={`flex items-center gap-3 px-3 py-3 text-sm transition-colors ${active ? "bg-ivory text-wine-deep" : "text-ivory/58 hover:bg-ivory/7 hover:text-ivory"}`}>
                <span className={`text-[9px] tabular-nums ${active ? "text-wine/45" : "text-ivory/25"}`}>0{index + 1}</span>
                <Icon size={16} strokeWidth={1.45} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
