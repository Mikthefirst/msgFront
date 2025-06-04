// components/CodeRenderer.tsx
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeRendererProps {
  content: string;
}

const CODE_BLOCK_REGEX = /^```(\w+)?\n([\s\S]+?)```$/;

const CodeRenderer: React.FC<CodeRendererProps> = ({ content }) => {
  const match = content.match(CODE_BLOCK_REGEX);

  if (!match) {
    return <p>{content}</p>; // fallback: render as plain text
  }

  const language = match[1] || "plaintext";
  const code = match[2].trim();

  return (
    <SyntaxHighlighter language={language} style={darcula} wrapLongLines>
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeRenderer;
//<CodeRenderer content={message.content} />
