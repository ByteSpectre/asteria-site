import Link from "next/link";
import Arrow from "@/components/Arrow";

export default function AdminNotFound() {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-20 sm:px-8 md:py-28">
      <p className="type-label font-mono uppercase text-wine">Ошибка 404</p>
      <h1 className="type-section-title font-display mt-4">Материал не найден</h1>
      <p className="type-body mt-5 max-w-[46ch] text-ink/55">
        Возможно, запись была удалена или ссылка устарела. Вернитесь к списку
        материалов и выберите нужный раздел.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/admin/knowledge"
          className="group type-label inline-flex h-12 items-center justify-center gap-3 bg-wine px-7 font-mono uppercase text-ivory transition-colors hover:bg-wine-deep"
        >
          База знаний
          <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link
          href="/admin/services"
          className="type-label inline-flex h-12 items-center justify-center border border-ink/15 px-7 font-mono uppercase text-ink/70 transition-colors hover:border-ink/35 hover:text-ink"
        >
          Услуги
        </Link>
      </div>
    </div>
  );
}
