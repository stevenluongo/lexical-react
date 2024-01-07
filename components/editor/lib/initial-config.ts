import PlaygroundNodes from "@/components/editor/nodes/PlaygroundNodes";
import { prepopulatedRichText } from "./prepopulatedRichText";
import PlaygroundEditorTheme from "@/components/editor/themes/PlaygroundEditorTheme";

export const initialConfig = {
  editorState: prepopulatedRichText,
  namespace: "Playground",
  nodes: [...PlaygroundNodes],
  onError: (error: Error) => {
    throw error;
  },
  theme: PlaygroundEditorTheme,
};
