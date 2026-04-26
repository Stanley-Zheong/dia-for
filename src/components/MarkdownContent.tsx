import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import { normalizeMarkdownExampleBlocks } from "@/lib/markdown-example";

type MarkdownContentProps = {
  content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  const normalizedContent = normalizeMarkdownExampleBlocks(content);

  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}
