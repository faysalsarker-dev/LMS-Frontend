

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import type { EditorState } from "lexical";
import { ToolbarPlugin } from "./ToolbarPlugin";

interface RichTextEditorProps {
  value?: string;
  onChange: (content: string) => void;
}

const theme = {
  paragraph: "mb-2",
  heading: {
    h1: "text-3xl font-bold mb-4",
    h2: "text-2xl font-bold mb-3",
    h3: "text-xl font-bold mb-2",
  },
  list: {
    ul: "list-disc ml-6 mb-2",
    ol: "list-decimal ml-6 mb-2",
    listitem: "mb-1",
  },
  quote: "border-l-4 border-primary pl-4 italic my-4 text-muted-foreground",
  code: "bg-muted p-4 rounded-md font-mono text-sm mb-2 block",
  link: "text-primary hover:underline cursor-pointer",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "bg-muted px-1 rounded font-mono text-sm",
  },
};


export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  let initialEditorState: string | undefined;
  try {
    if (value) {
      JSON.parse(value); 
      initialEditorState = value;
    }
  } catch (err) {
    console.warn("Invalid Lexical JSON provided to RichTextEditor:", err);
    initialEditorState = undefined; 
  }

  const initialConfig = {
    editorState: initialEditorState,
    namespace: "BlogEditor",
    theme,
    onError: (error: Error) => console.error(error),
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
    ],
  };

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const json = JSON.stringify(editorState.toJSON());
      onChange(json);
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border border-border rounded-lg overflow-hidden bg-popover">
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[300px] p-4 outline-none prose prose-sm max-w-none" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
                Start writing your blog post...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <OnChangePlugin onChange={handleChange} />
    
      </div>
    </LexicalComposer>
  );
};