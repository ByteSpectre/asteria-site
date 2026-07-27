"use client";

import type { PartialBlock } from "@blocknote/core";
import { ru } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import type { ArticleContentValue } from "@/lib/article-content";
import { normalizeArticleContent } from "@/lib/article-content";

type BlockNoteEditorClientProps = {
  initialValue?: unknown;
  readOnly?: boolean;
  onChange?: (value: ArticleContentValue) => void;
};

const russianDictionary = {
  ...ru,
  placeholders: {
    ...ru.placeholders,
    default: "Введите текст или нажмите «/» для команд",
    emptyDocument: "Начните писать или нажмите «/» для выбора блока",
  },
};

async function uploadEditorFile(file: File) {
  const formData = new FormData();
  formData.set("file", file);

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    body: formData,
  });

  const result = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !result.url) {
    throw new Error(result.error ?? "Не удалось загрузить файл");
  }

  return result.url;
}

export function BlockNoteEditorClient({ initialValue, readOnly = false, onChange }: BlockNoteEditorClientProps) {
  const initialContent = normalizeArticleContent(initialValue) as PartialBlock[];
  const editor = useCreateBlockNote({
    initialContent,
    dictionary: russianDictionary,
    uploadFile: uploadEditorFile,
  });

  return (
    <div className={readOnly ? "asteria-blocknote asteria-blocknote--readonly" : "asteria-blocknote asteria-blocknote--editable"}>
      <BlockNoteView
        editor={editor}
        editable={!readOnly}
        theme="light"
        onChange={() => onChange?.(editor.document as unknown as ArticleContentValue)}
        formattingToolbar={!readOnly}
        linkToolbar={!readOnly}
        slashMenu={!readOnly}
        sideMenu={!readOnly}
        filePanel={!readOnly}
        tableHandles={!readOnly}
        emojiPicker={!readOnly}
      />
    </div>
  );
}
