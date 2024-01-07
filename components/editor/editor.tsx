/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CharacterLimitPlugin } from "@lexical/react/LexicalCharacterLimitPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import LexicalClickableLinkPlugin from "@lexical/react/LexicalClickableLinkPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import useLexicalEditable from "@lexical/react/useLexicalEditable";
import * as React from "react";
import { useEffect, useState } from "react";
import { CAN_USE_DOM } from "@/components/editor/shared/canUseDOM";

import { useSettings } from "./context/SettingsContext";
import { useSharedHistoryContext } from "./context/SharedHistoryContext";
import TableCellNodes from "./nodes/TableCellNodes";
import ActionsPlugin from "@/components/editor/plugins/ActionsPlugin";
import AutocompletePlugin from "@/components/editor/plugins/AutocompletePlugin";
import AutoEmbedPlugin from "@/components/editor/plugins/AutoEmbedPlugin";
import AutoLinkPlugin from "@/components/editor/plugins/AutoLinkPlugin";
import CodeActionMenuPlugin from "@/components/editor/plugins/CodeActionMenuPlugin";
import CodeHighlightPlugin from "@/components/editor/plugins/CodeHighlightPlugin";
import CollapsiblePlugin from "@/components/editor/plugins/CollapsiblePlugin";
import ComponentPickerPlugin from "@/components/editor/plugins/ComponentPickerPlugin";
import ContextMenuPlugin from "@/components/editor/plugins/ContextMenuPlugin";
import DragDropPaste from "@/components/editor/plugins/DragDropPastePlugin";
import DraggableBlockPlugin from "@/components/editor/plugins/DraggableBlockPlugin";
import EmojiPickerPlugin from "@/components/editor/plugins/EmojiPickerPlugin";
import EmojisPlugin from "@/components/editor/plugins/EmojisPlugin";

import FloatingLinkEditorPlugin from "@/components/editor/plugins/FloatingLinkEditorPlugin";
import FloatingTextFormatToolbarPlugin from "@/components/editor/plugins/FloatingTextFormatToolbarPlugin";
import ImagesPlugin from "@/components/editor/plugins/ImagesPlugin";
import InlineImagePlugin from "@/components/editor/plugins/InlineImagePlugin";
import KeywordsPlugin from "@/components/editor/plugins/KeywordsPlugin";
import { LayoutPlugin } from "@/components/editor/plugins/LayoutPlugin/LayoutPlugin";
import LinkPlugin from "@/components/editor/plugins/LinkPlugin";
import ListMaxIndentLevelPlugin from "@/components/editor/plugins/ListMaxIndentLevelPlugin";
import MarkdownShortcutPlugin from "@/components/editor/plugins/MarkdownShortcutPlugin";
import { MaxLengthPlugin } from "@/components/editor/plugins/MaxLengthPlugin";
import MentionsPlugin from "@/components/editor/plugins/MentionsPlugin";
import PageBreakPlugin from "@/components/editor/plugins/PageBreakPlugin";
import PollPlugin from "@/components/editor/plugins/PollPlugin";
import TabFocusPlugin from "@/components/editor/plugins/TabFocusPlugin";
import TableCellActionMenuPlugin from "@/components/editor/plugins/TableActionMenuPlugin";
import TableCellResizer from "@/components/editor/plugins/TableCellResizer";
import TableOfContentsPlugin from "@/components/editor/plugins/TableOfContentsPlugin";
import { TablePlugin as NewTablePlugin } from "@/components/editor/plugins/TablePlugin";
import ToolbarPlugin from "@/components/editor/plugins/ToolbarPlugin";
import TreeViewPlugin from "@/components/editor/plugins/TreeViewPlugin";
import TwitterPlugin from "@/components/editor/plugins/TwitterPlugin";
import YouTubePlugin from "@/components/editor/plugins/YouTubePlugin";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import ContentEditable from "@/components/editor/ui/ContentEditable";
import Placeholder from "@/components/editor/ui/Placeholder";
import FigmaPlugin from "@/components/editor/plugins/FigmaPlugin";
import EquationsPlugin from "@/components/editor/plugins/EquationsPlugin";
import ExcalidrawPlugin from "@/components/editor/plugins/ExcalidrawPlugin";

const skipCollaborationInit =
  // @ts-ignore
  window.parent != null && window.parent.frames.right === window;

export default function Editor(): JSX.Element {
  const { historyState } = useSharedHistoryContext();
  const {
    settings: {
      isCollab,
      isAutocomplete,
      isMaxLength,
      isCharLimit,
      isCharLimitUtf8,
      isRichText,
      showTreeView,
      showTableOfContents,
      shouldUseLexicalContextMenu,
      tableCellMerge,
      tableCellBackgroundColor,
    },
  } = useSettings();
  const isEditable = useLexicalEditable();
  const text = isCollab
    ? "Enter some collaborative rich text..."
    : isRichText
      ? "Enter some rich text..."
      : "Enter some plain text...";
  const placeholder = <Placeholder>{text}</Placeholder>;
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const cellEditorConfig = {
    namespace: "Playground",
    nodes: [...TableCellNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia("(max-width: 1025px)").matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener("resize", updateViewPortWidth);

    return () => {
      window.removeEventListener("resize", updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
    <>
      {isRichText && <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />}
      <div
        className={`editor-container ${showTreeView ? "tree-view" : ""} ${
          !isRichText ? "plain-text" : ""
        }`}
      >
        {isMaxLength && <MaxLengthPlugin maxLength={30} />}
        <DragDropPaste />
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        <ComponentPickerPlugin />
        <EmojiPickerPlugin />
        <AutoEmbedPlugin />

        <MentionsPlugin />
        <EmojisPlugin />
        <HashtagPlugin />
        <KeywordsPlugin />
        <AutoLinkPlugin />
        {isRichText ? (
          <>
            <HistoryPlugin externalHistoryState={historyState} />
            <RichTextPlugin
              contentEditable={
                <div className="editor-scroller">
                  <div className="editor" ref={onRef}>
                    <ContentEditable />
                  </div>
                </div>
              }
              placeholder={placeholder}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <MarkdownShortcutPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <TablePlugin
              hasCellMerge={tableCellMerge}
              hasCellBackgroundColor={tableCellBackgroundColor}
            />
            <TableCellResizer />
            <NewTablePlugin cellEditorConfig={cellEditorConfig}>
              <AutoFocusPlugin />
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="TableNode__contentEditable" />
                }
                placeholder={null}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <MentionsPlugin />
              <HistoryPlugin />
              <ImagesPlugin captionsEnabled={false} />
              <LinkPlugin />
              <LexicalClickableLinkPlugin />
              <FloatingTextFormatToolbarPlugin />
            </NewTablePlugin>
            <ImagesPlugin />
            <InlineImagePlugin />
            <LinkPlugin />
            <PollPlugin />
            <TwitterPlugin />
            <YouTubePlugin />
            <FigmaPlugin />
            {!isEditable && <LexicalClickableLinkPlugin />}
            <HorizontalRulePlugin />
            <EquationsPlugin />
            <ExcalidrawPlugin />
            <TabFocusPlugin />
            <TabIndentationPlugin />
            <CollapsiblePlugin />
            <PageBreakPlugin />
            <LayoutPlugin />
            {floatingAnchorElem && !isSmallWidthViewport && (
              <>
                <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                <FloatingLinkEditorPlugin
                  anchorElem={floatingAnchorElem}
                  isLinkEditMode={isLinkEditMode}
                  setIsLinkEditMode={setIsLinkEditMode}
                />
                <TableCellActionMenuPlugin
                  anchorElem={floatingAnchorElem}
                  cellMerge={true}
                />
                <FloatingTextFormatToolbarPlugin
                  anchorElem={floatingAnchorElem}
                />
              </>
            )}
          </>
        ) : (
          <>
            <PlainTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={placeholder}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin externalHistoryState={historyState} />
          </>
        )}
        {(isCharLimit || isCharLimitUtf8) && (
          <CharacterLimitPlugin
            charset={isCharLimit ? "UTF-16" : "UTF-8"}
            maxLength={5}
          />
        )}
        {isAutocomplete && <AutocompletePlugin />}
        <div>{showTableOfContents && <TableOfContentsPlugin />}</div>
        {shouldUseLexicalContextMenu && <ContextMenuPlugin />}
        <ActionsPlugin isRichText={isRichText} />
      </div>
      {showTreeView && <TreeViewPlugin />}
    </>
  );
}
