"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ArrowLeft, Check, ExternalLink, ImagePlus, Plus, X } from "lucide-react";
import { saveArticleAction } from "@/app/admin/actions";
import { AsteriaEditor } from "@/components/editor/AsteriaEditor";
import { normalizeArticleContent } from "@/lib/article-content";
import { joinCategoryList, parseCategoryList } from "@/lib/category-list";
import { getArticleValidationMessage } from "@/lib/content-validation";
import { normalizeImageUrl } from "@/lib/editor-images";
import { isSafePreviewImageUrl } from "@/lib/safe-url";

type ArticleEditorFormProps = {
  categories: string[];
  article?: {
    id: string;
    title: string;
    category: string;
    excerpt: string;
    previewImage: string;
    content: unknown;
    published: boolean;
    publicHref: string;
  };
};

type PopPosition = {
  top: number;
  right: number;
};

function isRedirectError(cause: unknown) {
  return (
    typeof cause === "object" &&
    cause !== null &&
    "digest" in cause &&
    typeof (cause as { digest?: unknown }).digest === "string" &&
    String((cause as { digest: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export function ArticleEditorForm({ categories, article }: ArticleEditorFormProps) {
  const normalizedCategories = useMemo(() => {
    return Array.from(
      new Set(
        categories
          .map((category) => category.trim())
          .filter((category) => category.length > 0),
      ),
    );
  }, [categories]);

  const [title, setTitle] = useState(article?.title ?? "");

  const initialSelectedCategories = useMemo(() => {
    return parseCategoryList(article?.category ?? "");
  }, [article?.category]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialSelectedCategories);
  const [customCategory, setCustomCategory] = useState<string>("");

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [categoryMenuPosition, setCategoryMenuPosition] = useState<PopPosition | null>(null);
  const [addCategoryPopupPosition, setAddCategoryPopupPosition] = useState<PopPosition | null>(null);

  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [previewImage, setPreviewImage] = useState(article?.previewImage ?? "");
  const [previewUploading, setPreviewUploading] = useState(false);
  const [published, setPublished] = useState(article?.published ?? false);
  const [content, setContent] = useState(() =>
    normalizeArticleContent(article?.content),
  );

  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const previewFileInputRef = useRef<HTMLInputElement | null>(null);

  const menuCategories = useMemo(() => {
    return Array.from(new Set([...normalizedCategories, ...selectedCategories])).sort((a, b) =>
      a.localeCompare(b, "ru"),
    );
  }, [normalizedCategories, selectedCategories]);

  const getResolvedCategories = () => {
    const selected = selectedCategories;
    const custom = customCategory.trim();
    if (isAddingCategory && custom) return joinCategoryList([...selected, custom]);
    return joinCategoryList(selected);
  };

  const categoryButtonRef = useRef<HTMLButtonElement | null>(null);
  const addButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const customInputRef = useRef<HTMLInputElement | null>(null);

  const closeCategoryUI = useCallback(() => {
    setIsCategoryMenuOpen(false);
    setCategoryMenuPosition(null);
    setIsAddingCategory(false);
    setAddCategoryPopupPosition(null);
    setCustomCategory("");
  }, []);

  const updateCategoryMenuPosition = () => {
    const btn = categoryButtonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setCategoryMenuPosition({
      top: rect.bottom + 6,
      right: window.innerWidth - rect.right,
    });
  };

  const updateAddCategoryPopupPosition = () => {
    const btn = addButtonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setAddCategoryPopupPosition({
      top: rect.top - 6,
      right: window.innerWidth - rect.right,
    });
  };

  useEffect(() => {
    if (!isAddingCategory) return;
    const id = window.setTimeout(() => {
      customInputRef.current?.focus();
      customInputRef.current?.select();
    }, 0);
    return () => window.clearTimeout(id);
  }, [isAddingCategory]);

  useEffect(() => {
    if (!isCategoryMenuOpen && !isAddingCategory) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (menuRef.current?.contains(target)) return;
      if (popupRef.current?.contains(target)) return;
      if (categoryButtonRef.current?.contains(target)) return;
      if (addButtonRef.current?.contains(target)) return;

      closeCategoryUI();
    };

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [isCategoryMenuOpen, isAddingCategory, closeCategoryUI]);

  useEffect(() => {
    if (!isCategoryMenuOpen) return;

    const onReposition = () => updateCategoryMenuPosition();
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);

    return () => {
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [isCategoryMenuOpen]);

  useEffect(() => {
    if (!isAddingCategory) return;

    const onReposition = () => updateAddCategoryPopupPosition();
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);

    return () => {
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [isAddingCategory]);

  const openCategoryMenu = () => {
    if (isCategoryMenuOpen) {
      closeCategoryUI();
      return;
    }

    updateCategoryMenuPosition();

    setIsAddingCategory(false);
    setIsCategoryMenuOpen(true);
  };

  const openAddCategoryPopup = () => {
    if (isAddingCategory) {
      closeCategoryUI();
      return;
    }

    updateAddCategoryPopupPosition();

    setIsCategoryMenuOpen(false);
    setIsAddingCategory(true);
    setCustomCategory("");
  };

  const applyCustomCategory = () => {
    const trimmed = customCategory.trim();
    if (!trimmed) return;

    setSelectedCategories((previous) =>
      previous.includes(trimmed) ? previous : [...previous, trimmed],
    );
    setCustomCategory("");
    setIsAddingCategory(false);
    setAddCategoryPopupPosition(null);
  };

  const toggleCategory = (categoryOption: string) => {
    setSelectedCategories((previous) =>
      previous.includes(categoryOption)
        ? previous.filter((category) => category !== categoryOption)
        : [...previous, categoryOption],
    );
  };

  const hasCustomCategoryText = customCategory.trim().length > 0;

  const uploadPreviewFile = async (file: File) => {
    setPreviewUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "Не удалось загрузить превью.");
      }
      setPreviewImage(result.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось загрузить превью.");
    } finally {
      setPreviewUploading(false);
    }
  };

  const save = () => {
    const payload = {
      id: article?.id,
      title,
      category: getResolvedCategories(),
      excerpt,
      previewImage: normalizeImageUrl(previewImage) || previewImage.trim(),
      content,
      published,
    };
    const validationError = getArticleValidationMessage(payload);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    startTransition(async () => {
      try {
        await saveArticleAction(payload);
      } catch (cause) {
        if (isRedirectError(cause)) throw cause;
        setError(
          cause instanceof Error ? cause.message : "Не удалось сохранить статью.",
        );
      }
    });
  };

  return (
    <div className="admin-editor min-h-screen bg-cream">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink/10 bg-cream/95 px-4 backdrop-blur sm:px-7 lg:px-10">
        <Link
          href="/admin/knowledge"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.07em] text-ink/45 hover:text-wine"
        >
          <ArrowLeft size={14} strokeWidth={1.4} /> К списку
        </Link>
        <div className="flex items-center gap-2">
          {article?.published ? (
            <Link
              href={article.publicHref}
              target="_blank"
              aria-label="Открыть статью"
              className="flex h-10 w-10 items-center justify-center border border-ink/12 text-ink/45 hover:border-wine hover:text-wine"
            >
              <ExternalLink size={14} strokeWidth={1.4} />
            </Link>
          ) : null}
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="inline-flex h-10 items-center gap-2 bg-wine px-5 text-[10px] uppercase tracking-[0.07em] text-ivory hover:bg-wine-deep disabled:opacity-50"
          >
            <Check size={14} strokeWidth={1.5} />
            {pending ? "Сохраняем…" : "Сохранить"}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-7 lg:px-10 lg:py-14">
        <p className="text-[10px] uppercase tracking-[0.1em] text-wine">
          {article ? "Редактирование статьи" : "Новая статья"}
        </p>
        <textarea
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          rows={2}
          placeholder="Название статьи"
          className="mt-4 w-full resize-none bg-transparent text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.94] tracking-[-0.07em] outline-none placeholder:text-ink/18"
        />

        <div className="mt-7 grid gap-4 border-y border-ink/10 py-5 md:grid-cols-[1fr_1.5fr_auto] md:items-end">
          <div className="space-y-3">
            <label className="block">
              <span className="mb-2 block text-[9px] uppercase tracking-[0.09em] text-ink/38">Категория</span>
              <div className="flex items-center gap-2">
                <button
                  ref={categoryButtonRef}
                  type="button"
                  onClick={openCategoryMenu}
                  className="h-11 flex-1 border border-ink/12 bg-ivory px-3 text-left text-sm outline-none focus:border-ink/12 focus-visible:outline-none focus-visible:outline-0 focus-visible:ring-0"
                  aria-haspopup="listbox"
                  aria-expanded={isCategoryMenuOpen}
                >
                  {selectedCategories.length > 0
                    ? joinCategoryList(selectedCategories)
                    : "Выберите категории"}
                </button>

                <button
                  ref={addButtonRef}
                  type="button"
                  onClick={openAddCategoryPopup}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-ink/12 bg-ivory text-ink/55 outline-none transition-colors hover:border-ink/20 hover:text-ink focus-visible:outline-none focus-visible:outline-0 focus-visible:ring-0"
                  aria-label="Добавить новую категорию"
                  title="Добавить новую категорию"
                >
                  <Plus size={16} strokeWidth={1.7} />
                </button>
              </div>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-[9px] uppercase tracking-[0.09em] text-ink/38">
              Краткое описание
            </span>
            <input
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="О чём этот материал"
              className="h-11 w-full border border-ink/12 bg-ivory px-3 text-sm outline-none focus:border-ink/12 focus-visible:outline-none focus-visible:outline-0 focus-visible:ring-0"
            />
          </label>

          <label className="flex h-11 cursor-pointer items-center gap-3 border border-ink/12 bg-ivory px-4">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
              className="h-4 w-4 accent-[#431c26]"
            />
            <span className="text-[10px] uppercase tracking-[0.06em] text-ink/55">
              Опубликовать
            </span>
          </label>
        </div>

        <div className="mt-6 border border-ink/10 bg-ivory p-4 sm:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.09em] text-ink/38">Превью статьи</p>
              <p className="mt-1 text-[12px] text-ink/45">
                Показывается в сетке базы знаний. Можно загрузить файл или вставить URL.
              </p>
            </div>
            {previewImage ? (
              <button
                type="button"
                onClick={() => setPreviewImage("")}
                className="inline-flex h-9 items-center gap-2 border border-ink/12 px-3 text-[10px] uppercase tracking-[0.06em] text-ink/50 hover:border-ink/25 hover:text-ink"
              >
                <X size={13} strokeWidth={1.6} />
                Убрать
              </button>
            ) : null}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[240px_1fr]">
            <div className="aspect-[16/10] overflow-hidden border border-ink/10 bg-cream">
              {previewImage && isSafePreviewImageUrl(previewImage) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[11px] text-ink/30">
                  Нет превью
                </div>
              )}
            </div>

            <div className="space-y-3">
              <input
                value={previewImage}
                onChange={(event) => setPreviewImage(event.target.value)}
                placeholder="https://… или /api/uploads/…"
                className="h-11 w-full border border-ink/12 bg-cream/40 px-3 text-sm outline-none focus:border-ink/12 focus-visible:outline-none focus-visible:ring-0"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={previewUploading || pending}
                  onClick={() => previewFileInputRef.current?.click()}
                  className="inline-flex h-10 items-center gap-2 border border-ink/12 bg-cream/40 px-4 text-[10px] uppercase tracking-[0.06em] text-ink/55 transition-colors hover:border-ink/25 hover:text-ink disabled:opacity-50"
                >
                  <ImagePlus size={14} strokeWidth={1.5} />
                  {previewUploading ? "Загружаем…" : "Загрузить файл"}
                </button>
                <input
                  ref={previewFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (file) void uploadPreviewFile(file);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-5 border-l-2 border-wine pl-3 text-sm leading-relaxed text-wine"
          >
            {error}
          </p>
        ) : null}
        <div className="mt-8">
          <AsteriaEditor initialValue={article?.content} onChange={setContent} />
        </div>
      </div>

      {isCategoryMenuOpen && categoryMenuPosition ? (
        <div
          ref={menuRef}
          className="fixed z-50 w-56 border border-ink/10 bg-ivory p-1 text-left shadow-xl"
          style={{ top: categoryMenuPosition.top, right: categoryMenuPosition.right }}
          role="listbox"
        >
          {menuCategories.map((categoryOption) => (
            <button
              key={categoryOption}
              type="button"
              onClick={() => {
                toggleCategory(categoryOption);
              }}
              className="flex w-full items-center px-3 py-2 text-[12px] text-ink/65 outline-none hover:bg-cream hover:text-wine focus:outline-none focus-visible:outline-none"
            >
              <span className="mr-2 inline-flex w-4 items-center justify-center text-wine">
                {selectedCategories.includes(categoryOption) ? (
                  <Check size={12} strokeWidth={2} />
                ) : null}
              </span>
              {categoryOption}
            </button>
          ))}
        </div>
      ) : null}

      {isAddingCategory && addCategoryPopupPosition ? (
        <div
          ref={popupRef}
          className="fixed z-50 w-[340px] rounded-sm border border-ink/10 bg-ivory p-3 text-left shadow-[0_14px_32px_rgba(0,0,0,0.08)]"
          style={{
            top: addCategoryPopupPosition.top,
            right: addCategoryPopupPosition.right,
            transform: "translateY(-100%)",
          }}
        >
          <div className="mb-2 text-[9px] uppercase tracking-[0.09em] text-ink/38">
            Новая категория
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={customInputRef}
              value={customCategory}
              onChange={(event) => setCustomCategory(event.target.value)}
              placeholder="Например, Судебная практика"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  applyCustomCategory();
                }
              }}
              className="h-10 flex-1 rounded-sm border border-ink/12 bg-ivory px-3 text-sm outline-none focus:border-ink/12 focus-visible:outline-none focus-visible:outline-0 focus-visible:ring-0"
            />
            <button
              type="button"
              onClick={() => {
                if (hasCustomCategoryText) {
                  applyCustomCategory();
                  return;
                }
                closeCategoryUI();
              }}
              className="h-10 shrink-0 rounded-sm border border-ink/12 bg-ivory px-3 text-[10px] uppercase tracking-[0.06em] text-ink/55 transition-colors hover:border-ink/20 hover:text-ink focus-visible:outline-none focus-visible:outline-0 focus-visible:ring-0"
            >
              {hasCustomCategoryText ? "Добавить" : "Отмена"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
