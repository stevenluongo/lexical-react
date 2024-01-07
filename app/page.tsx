"use client";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { SharedAutocompleteContext } from "@/components/editor/context/SharedAutocompleteContext";
import { SharedHistoryContext } from "@/components/editor/context/SharedHistoryContext";
import { initialConfig } from "@/components/editor/lib/initial-config";

import Editor from "@/components/editor/editor";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Hi</p>

      <LexicalComposer initialConfig={initialConfig}>
        <SharedHistoryContext>
          <SharedAutocompleteContext>
            <Editor />
          </SharedAutocompleteContext>
        </SharedHistoryContext>
      </LexicalComposer>
    </main>
  );
}
