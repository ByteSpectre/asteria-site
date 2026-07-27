"use client";

import { filenameFromURL } from "@blocknote/core";
import {
  UploadTab,
  useBlockNoteEditor,
  useComponentsContext,
  useDictionary,
  type FilePanelProps,
} from "@blocknote/react";
import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useState,
} from "react";
import { normalizeImageUrl } from "@/lib/editor-images";

function AsteriaEmbedTab(props: FilePanelProps) {
  const Components = useComponentsContext()!;
  const dict = useDictionary();
  const editor = useBlockNoteEditor();
  const block = editor.getBlock(props.blockId)!;

  const [currentURL, setCurrentURL] = useState("");
  const [error, setError] = useState("");

  const applyUrl = useCallback(() => {
    const normalized = normalizeImageUrl(currentURL);
    if (!normalized) {
      setError("Укажите полный URL изображения, например https://example.com/photo.jpg");
      return;
    }

    setError("");
    editor.updateBlock(block.id, {
      props: {
        name: filenameFromURL(normalized),
        url: normalized,
        showPreview: true,
      } as never,
    });
  }, [block.id, currentURL, editor]);

  return (
    <Components.FilePanel.TabPanel className="bn-tab-panel">
      <Components.FilePanel.TextInput
        className="bn-text-input"
        placeholder={dict.file_panel.embed.url_placeholder}
        value={currentURL}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setCurrentURL(event.currentTarget.value);
          if (error) setError("");
        }}
        onKeyDown={(event: KeyboardEvent) => {
          if (event.key === "Enter" && !event.nativeEvent.isComposing) {
            event.preventDefault();
            applyUrl();
          }
        }}
        data-test="embed-input"
      />
      {error ? <p className="mt-2 text-xs text-wine">{error}</p> : null}
      <Components.FilePanel.Button
        className="bn-button"
        onClick={applyUrl}
        data-test="embed-input-button"
      >
        {dict.file_panel.embed.embed_button[block.type] ||
          dict.file_panel.embed.embed_button.file}
      </Components.FilePanel.Button>
    </Components.FilePanel.TabPanel>
  );
}

export function AsteriaFilePanel(props: FilePanelProps) {
  const Components = useComponentsContext()!;
  const dict = useDictionary();
  const editor = useBlockNoteEditor();
  const [loading, setLoading] = useState(false);

  const tabs = [
    ...(editor.uploadFile
      ? [
          {
            name: dict.file_panel.upload.title,
            tabPanel: <UploadTab blockId={props.blockId} setLoading={setLoading} />,
          },
        ]
      : []),
    {
      name: dict.file_panel.embed.title,
      tabPanel: <AsteriaEmbedTab blockId={props.blockId} />,
    },
  ];

  const [openTab, setOpenTab] = useState(tabs[0]?.name ?? dict.file_panel.embed.title);

  return (
    <Components.FilePanel.Root
      className="bn-panel"
      defaultOpenTab={openTab}
      openTab={openTab}
      setOpenTab={setOpenTab}
      tabs={tabs}
      loading={loading}
    />
  );
}
