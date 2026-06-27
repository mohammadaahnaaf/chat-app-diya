"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import type { Components } from "react-markdown";

const components: Components = {
  // Code blocks
  code({ className, children, ...props }) {
    const isBlock = className?.startsWith("language-");
    if (isBlock) {
      return (
        <pre className="my-3 rounded-lg bg-gray-900 dark:bg-black px-4 py-3 overflow-x-auto text-xs leading-relaxed">
          <code className={`${className} text-gray-100`} {...props}>
            {children}
          </code>
        </pre>
      );
    }
    return (
      <code
        className="rounded bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 text-xs font-mono text-gray-800 dark:text-gray-200"
        {...props}
      >
        {children}
      </code>
    );
  },
  // Headings
  h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-lg font-bold mt-3 mb-1.5">{children}</h2>,
  h3: ({ children }) => <h3 className="text-base font-semibold mt-2 mb-1">{children}</h3>,
  // Paragraph
  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  // Lists
  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5 pl-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5 pl-1">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-indigo-400 dark:border-indigo-600 pl-4 my-2 text-gray-600 dark:text-gray-400 italic">
      {children}
    </blockquote>
  ),
  // Table
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="min-w-full text-xs border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-gray-300 dark:border-gray-600 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 font-semibold text-left">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-300 dark:border-gray-600 px-3 py-1.5">{children}</td>
  ),
  // Horizontal rule
  hr: () => <hr className="my-3 border-gray-200 dark:border-gray-700" />,
  // Links
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-500 hover:underline"
    >
      {children}
    </a>
  ),
  // Strong / em
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
};

interface Props {
  content: string;
  streaming?: boolean;
}

export default function MarkdownMessage({ content, streaming }: Props) {
  return (
    <div className="prose-sm prose-gray dark:prose-invert max-w-none text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
      {streaming && (
        <span className="inline-block w-1.5 h-4 bg-gray-400 ml-0.5 align-middle animate-pulse" />
      )}
    </div>
  );
}
