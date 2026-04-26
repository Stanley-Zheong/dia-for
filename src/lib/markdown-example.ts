function expandCompactMarkdown(value: string) {
  return value
    .replace(/\s+(#{1,6}\s+)/g, "\n\n$1")
    .replace(/\s+(-\s+)/g, "\n$1")
    .replace(/\s*(\|.*?\|)(?=\s+\||\s+##|\n|$)/g, "\n$1")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function normalizeMarkdownExampleBlocks(content: string) {
  return content.replace(
    /^text\s*\n\s*\n(`+)([^\n]*?)\1\s*$/gm,
    (_, fence: string, rawTemplate: string) => {
      const codeFence = fence.length >= 3 ? "````" : "```";
      return `${codeFence}text\n${expandCompactMarkdown(rawTemplate)}\n${codeFence}`;
    },
  );
}
