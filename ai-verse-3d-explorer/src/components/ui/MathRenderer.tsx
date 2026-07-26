import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  math?: string;
  text?: string;
  inline?: boolean;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  math,
  text,
  inline = false,
  className = ''
}) => {
  // Direct math expression rendering
  if (math) {
    const html = useMemo(() => {
      try {
        return katex.renderToString(math, {
          displayMode: !inline,
          throwOnError: false
        });
      } catch (e) {
        return math;
      }
    }, [math, inline]);

    if (inline) {
      return (
        <span
          className={`inline-math font-mono text-cyan-300 ${className}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    return (
      <div
        className={`block-math py-1 px-2 overflow-x-auto text-cyan-300 font-mono ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Text with inline math parsing ($...$)
  if (text) {
    const parts = useMemo(() => {
      // Split by $...$
      const regex = /\$([^$]+)\$/g;
      const elements: React.ReactNode[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(text)) !== null) {
        // Plain text before match
        if (match.index > lastIndex) {
          elements.push(text.substring(lastIndex, match.index));
        }

        const formula = match[1];
        try {
          const katexHtml = katex.renderToString(formula, {
            displayMode: false,
            throwOnError: false
          });
          elements.push(
            <span
              key={match.index}
              className="inline-math text-cyan-300 font-mono px-1"
              dangerouslySetInnerHTML={{ __html: katexHtml }}
            />
          );
        } catch {
          elements.push(<code key={match.index} className="text-cyan-300">{formula}</code>);
        }

        lastIndex = regex.lastIndex;
      }

      if (lastIndex < text.length) {
        elements.push(text.substring(lastIndex));
      }

      return elements;
    }, [text]);

    return <span className={className}>{parts}</span>;
  }

  return null;
};
