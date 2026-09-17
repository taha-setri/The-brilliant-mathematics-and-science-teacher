import React from "react";
import katex from "katex";

interface MathRendererProps {
  content: string;
  className?: string;
  block?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  className = "",
  block = false,
}) => {
  if (!content) return null;

  // Check if content has LaTeX delimiters like $$...$$ or $...$
  const hasLatexDelimiters = /\$\$[\s\S]+?\$\$|\$[^\$]+?\$/.test(content);

  if (!hasLatexDelimiters) {
    // If it's a pure math formula or simple expression, try rendering if it contains math operators
    const looksLikeMath = /[=+\-×÷^_{}\\]|[0-9]+[a-zA-Z]/.test(content) && content.length < 120 && !content.includes(" ");
    if (looksLikeMath) {
      try {
        const html = katex.renderToString(content, {
          displayMode: block,
          throwOnError: false,
        });
        return (
          <span
            dir="ltr"
            className={`inline-block font-sans ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        // Fallback to plain text
      }
    }

    return <span className={className}>{content}</span>;
  }

  // Parse mixed text and LaTeX blocks
  const parts: React.ReactNode[] = [];
  const regex = /(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    const token = match[0];
    const isBlock = token.startsWith("$$");
    const formula = isBlock ? token.slice(2, -2) : token.slice(1, -1);

    try {
      const html = katex.renderToString(formula.trim(), {
        displayMode: isBlock,
        throwOnError: false,
      });
      parts.push(
        <span
          key={match.index}
          dir="ltr"
          className="inline-block mx-1 font-sans"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      parts.push(<code key={match.index} className="text-amber-700 bg-amber-50 px-1 rounded">{formula}</code>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return <span className={className}>{parts}</span>;
};
