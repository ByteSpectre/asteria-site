"use client";

import type { PartialBlock } from "@blocknote/core";
import { filenameFromURL } from "@blocknote/core";
import { ru } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import {
  FilePanelController,
  useCreateBlockNote,
} from "@blocknote/react";
import type { ArticleContentValue } from "@/lib/article-content";
import { normalizeArticleContent } from "@/lib/article-content";
import { isImageUrl, normalizeImageUrl } from "@/lib/editor-images";
import { AsteriaFilePanel } from "@/components/editor/AsteriaFilePanel";

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

async function resolveEditorFileUrl(url: string) {
  const normalized = normalizeImageUrl(url) || url;
  if (normalized.startsWith("/")) {
    return `${window.location.origin}${normalized}`;
  }
  return normalized;
}

export function BlockNoteEditorClient({ initialValue, readOnly = false, onChange }: BlockNoteEditorClientProps) {
  const initialContent = normalizeArticleContent(initialValue) as PartialBlock[];
  const editor = useCreateBlockNote({
    initialContent,
    dictionary: russianDictionary,
    uploadFile: uploadEditorFile,
    resolveFileUrl: resolveEditorFileUrl,
    pasteHandler: ({ event, editor: blockEditor, defaultPasteHandler }) => {
      const text = event.clipboardData?.getData("text/plain")?.trim();
      if (text) {
        const url = normalizeImageUrl(text);
        if (url && isImageUrl(url)) {
          const block = blockEditor.getTextCursorPosition().block;
          blockEditor.updateBlock(block.id, {
            type: "image",
            props: {
              url,
              name: filenameFromURL(url),
              showPreview: true,
            },
          } as never);
          return true;
        }
      }

      return defaultPasteHandler();
    },
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
        filePanel={false}
        tableHandles={!readOnly}
        emojiPicker={!readOnly}
      >
        {!readOnly ? <FilePanelController filePanel={AsteriaFilePanel} /> : null}
      </BlockNoteView>
    </div>
  );
}
