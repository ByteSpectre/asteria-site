"use client";

import dynamic from "next/dynamic";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import type { ArticleContentValue } from "@/lib/article-content";

type AsteriaEditorProps = {
  initialValue?: unknown;
  readOnly?: boolean;
  onChange?: (value: ArticleContentValue) => void;
};

const BlockNoteEditorClient = dynamic(
  () =>
    import("@/components/editor/BlockNoteEditorClient").then(
      (mod) => mod.BlockNoteEditorClient,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-40 animate-pulse bg-ink/[0.025]" aria-label="Загрузка редактора" />
    ),
  },
);

export function AsteriaEditor(props: AsteriaEditorProps) {
  return <BlockNoteEditorClient {...props} />;
}
