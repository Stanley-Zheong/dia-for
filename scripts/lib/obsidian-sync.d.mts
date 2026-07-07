export interface SyncMarkdownFilesOptions {
  sourceDir: string;
  targetDir: string;
  dryRun?: boolean;
  publishedOnly?: boolean;
}

export interface SyncMarkdownFilesResult {
  copied: string[];
  removed: string[];
  skipped: string[];
  unchanged: string[];
}

export function syncMarkdownFiles(
  options: SyncMarkdownFilesOptions,
): Promise<SyncMarkdownFilesResult>;
