"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteArticleAction, deleteServiceAction } from "@/app/admin/actions";
import type { ContentRow } from "@/lib/content";

type ContentTableProps = {
  kind: "article" | "service";
  rows: ContentRow[];
  addHref: string;
  emptyTitle: string;
};

type MenuPosition = {
  top: number;
  right: number;
};

export function ContentTable({ kind, rows, addHref, emptyTitle }: ContentTableProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [pending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ru");
    if (!normalized) return rows;
    return rows.filter((row) => `${row.title} ${row.category}`.toLocaleLowerCase("ru").includes(normalized));
  }, [query, rows]);

  const closeMenu = () => {
    setOpenMenu(null);
    setMenuPosition(null);
  };

  const toggleMenu = (rowId: string) => {
    if (openMenu === rowId) {
      closeMenu();
      return;
    }

    const button = buttonRefs.current[rowId];
    if (!button) return;

    const rect = button.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 6,
      right: window.innerWidth - rect.right,
    });
    setOpenMenu(rowId);
  };

  useEffect(() => {
    if (!openMenu) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (buttonRefs.current[openMenu]?.contains(target)) return;
      closeMenu();
    };

    const onReposition = () => closeMenu();

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [openMenu]);

  const remove = (row: ContentRow) => {
    if (!window.confirm(`Удалить «${row.title}»? Это действие нельзя отменить.`)) return;
    closeMenu();
    startTransition(async () => {
      if (kind === "article") await deleteArticleAction(row.id);
      else await deleteServiceAction(row.id);
      router.refresh();
    });
  };

  const activeRow = openMenu ? filteredRows.find((row) => row.id === openMenu) : null;

  return (
    <section className="mt-8 border border-ink/10 bg-ivory">
      <div className="flex flex-col gap-3 border-b border-ink/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <label className="relative block w-full max-w-[480px]">
          <Search size={16} strokeWidth={1.4} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink/32" aria-hidden="true" />
          <span className="sr-only">Поиск</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск" className="h-11 w-full border border-ink/12 bg-cream/45 pr-4 pl-10 text-sm outline-none placeholder:text-ink/28 focus:border-wine" />
        </label>
        <Link href={addHref} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 bg-wine px-5 text-[10px] uppercase tracking-[0.07em] text-ivory transition-colors hover:bg-wine-deep">
          <Plus size={15} strokeWidth={1.5} aria-hidden="true" /> Добавить
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/10 text-[10px] uppercase tracking-[0.08em] text-ink/36">
              <th className="w-[52%] px-5 py-3 font-normal">Название {kind === "article" ? "статьи" : "услуги"}</th>
              <th className="w-[24%] px-5 py-3 font-normal">Категории</th>
              <th className="w-[18%] px-5 py-3 font-normal">Дата</th>
              <th className="w-14 px-3 py-3"><span className="sr-only">Действия</span></th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id} className="group border-b border-ink/8 last:border-0 hover:bg-wine/[0.025]">
                <td className="px-5 py-5">
                  <Link href={row.editHref} className="font-medium tracking-[-0.025em] hover:text-wine">{row.title}</Link>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${row.status === "PUBLISHED" ? "bg-[#728868]" : "bg-ink/22"}`} />
                    <span className="text-[9px] uppercase tracking-[0.07em] text-ink/32">{row.status === "PUBLISHED" ? "Опубликовано" : "Черновик"}</span>
                  </div>
                </td>
                <td className="px-5 py-5 text-[12px] text-ink/55">{row.category}</td>
                <td className="px-5 py-5 text-[12px] tabular-nums text-ink/45">{row.date}</td>
                <td className="px-3 py-5 text-right">
                  <button
                    ref={(node) => {
                      buttonRefs.current[row.id] = node;
                    }}
                    type="button"
                    aria-label={`Действия: ${row.title}`}
                    aria-expanded={openMenu === row.id}
                    onClick={() => toggleMenu(row.id)}
                    className="inline-flex h-9 w-9 items-center justify-center text-ink/35 hover:bg-ink/5 hover:text-wine"
                  >
                    <MoreHorizontal size={18} strokeWidth={1.5} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeRow && menuPosition ? (
        <div
          ref={menuRef}
          className="fixed z-50 w-44 border border-ink/10 bg-ivory p-1 text-left shadow-xl"
          style={{ top: menuPosition.top, right: menuPosition.right }}
        >
          <Link
            href={activeRow.editHref}
            onClick={closeMenu}
            className="flex items-center gap-2 px-3 py-2 text-[12px] text-ink/65 hover:bg-cream hover:text-wine"
          >
            <Pencil size={13} strokeWidth={1.5} />
            Редактировать
          </Link>
          <button
            type="button"
            disabled={pending}
            onClick={() => remove(activeRow)}
            className="flex w-full items-center gap-2 px-3 py-2 text-[12px] text-wine hover:bg-wine/6 disabled:opacity-50"
          >
            <Trash2 size={13} strokeWidth={1.5} />
            Удалить
          </button>
        </div>
      ) : null}

      {!filteredRows.length ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center px-5 text-center">
          <p className="text-xl tracking-[-0.04em]">{query ? "Ничего не найдено" : emptyTitle}</p>
          <p className="mt-2 max-w-[36ch] text-xs leading-relaxed text-ink/38">{query ? "Попробуйте изменить поисковый запрос." : "Нажмите «Добавить», чтобы создать первую запись."}</p>
        </div>
      ) : null}
    </section>
  );
}
