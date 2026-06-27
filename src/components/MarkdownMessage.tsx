"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import type { Components } from "react-markdown";

const components: Components = {
  code({ className, children, ...props }) {
    const isBlock = className?.startsWith("language-");
    if (isBlock) {
      return (
        <pre className="my-3 rounded-sm border-2 border-brown-mid bg-brown-deep px-4 py-3 overflow-x-auto text-xs leading-relaxed shadow-[2px_2px_0_#6b3a1f]">
          <code className={`${className} text-parchment`} {...props}>
            {children}
          </code>
        </pre>
      );
    }
    return (
      <code
        className="rounded-sm border border-golden bg-parchment-dark px-1.5 py-0.5 text-xs font-mono text-brown-dark"
        {...props}
      >
        {children}
      </code>
    );
  },
  h1: ({ children }) => (
    <h1 className="text-xl font-bold mt-4 mb-2 text-brown-dark border-b border-golden pb-1" style={{ fontFamily: "Georgia, serif" }}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-bold mt-3 mb-1.5 text-brown-dark" style={{ fontFamily: "Georgia, serif" }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold mt-2 mb-1 text-brown-mid" style={{ fontFamily: "Georgia, serif" }}>
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5 pl-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5 pl-1">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-golden pl-4 my-2 text-brown-mid italic bg-parchment rounded-sm py-1">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="min-w-full text-xs border-collapse border-2 border-golden">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-golden px-3 py-1.5 bg-brown-dark text-parchment font-bold text-left uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-golden px-3 py-1.5 text-brown-dark">{children}</td>
  ),
  hr: () => <hr className="my-3 border-golden" />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-crimson hover:text-crimson-dark underline"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-bold text-brown-dark">{children}</strong>,
  em: ({ children }) => <em className="italic text-brown-mid">{children}</em>,
};

interface Props {
  content: string;
  streaming?: boolean;
}

export default function MarkdownMessage({ content, streaming }: Props) {
  return (
    <div className="max-w-none text-sm text-brown-dark">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
      {streaming && (
        <span className="inline-block w-1.5 h-4 bg-golden ml-0.5 align-middle animate-pulse" />
      )}
    </div>
  );
}
