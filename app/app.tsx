"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { isDevPlayground } from "@/components/editor/lib/appSettings";
import {
  SettingsContext,
  useSettings,
} from "@/components/editor/context/SettingsContext";
import { SharedAutocompleteContext } from "@/components/editor/context/SharedAutocompleteContext";
import { SharedHistoryContext } from "@/components/editor/context/SharedHistoryContext";
import PlaygroundNodes from "@/components/editor/nodes/PlaygroundNodes";
import DocsPlugin from "@/components/editor/plugins/DocsPlugin";
import PasteLogPlugin from "@/components/editor/plugins/PasteLogPlugin";
import { TableContext } from "@/components/editor/plugins/TablePlugin";
import Settings from "@/components/editor/lib/Settings";
import PlaygroundEditorTheme from "@/components/editor/themes/PlaygroundEditorTheme";
import Editor from "@/components/editor/editor";
import { getPrepopulatedRichText } from "@/components/editor/utils/getPrepopulatedRichText";

export default function LexicalEditor(): JSX.Element {
  const {
    settings: { emptyEditor },
  } = useSettings();

  const initialConfig = {
    editorState: emptyEditor ? undefined : getPrepopulatedRichText,
    namespace: "Playground",
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <SettingsContext>
      <LexicalComposer initialConfig={initialConfig}>
        <SharedHistoryContext>
          <TableContext>
            <SharedAutocompleteContext>
              <div className="editor-shell">
                <Editor />
              </div>
              <Settings />
              {isDevPlayground ? <DocsPlugin /> : null}
              {isDevPlayground ? <PasteLogPlugin /> : null}
            </SharedAutocompleteContext>
          </TableContext>
        </SharedHistoryContext>
      </LexicalComposer>
    </SettingsContext>
  );
}
