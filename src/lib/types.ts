export type ChatMessageRole = "user" | "assistant" | "unknown";

export type ContentSection = "brainwave" | "yuan-shan" | "xiao-ju-deng";

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  speaker: string;
  content: string;
};

export type ChatRecordMeta = {
  title: string;
  title_en?: string;
  section: ContentSection;
  category?: string;
  topic: string;
  models: string[];
  source?: string;
  source_name?: string;
  source_url?: string;
  canonical_url?: string;
  summary?: string;
  summary_en?: string;
  published: boolean;
  created?: string;
  tags: string[];
  tags_zh?: string[];
  tags_en?: string[];
  language?: "zh" | "en" | "bilingual";
  insights?: string;
  rss_source?: string;
  score?: number;
  impact_score?: number;
  urgency_score?: number;
  confidence_score?: number;
  repo_path?: string;
  stack?: string[];
  status?: string;
};

export type ChatRecord = {
  slug: string;
  aliases?: string[];
  rawMarkdown: string;
  parseStatus: "complete" | "partial";
  meta: ChatRecordMeta;
  messages: ChatMessage[];
};

export type ArticleRecord = ChatRecord;

export type TopicSummary = {
  slug: string;
  name: string;
  chats: ChatRecord[];
  models: string[];
};

export type ModelSummary = {
  slug: string;
  name: string;
  chats: ChatRecord[];
};

export type TagSummary = {
  slug: string;
  name: string;
  chats: ChatRecord[];
};

export type InsightReference = {
  chatSlug: string;
  title: string;
  excerpt?: string;
};

export type ChatInsights = {
  summary: string;
  viewpoints: string[];
  conclusions: string[];
  references: InsightReference[];
};

export type TopicComparison = {
  consensus: string[];
  differences: string[];
  modelObservations: Array<{
    model: string;
    observation: string;
  }>;
  references: InsightReference[];
};

export type SearchSource = {
  chatSlug: string;
  section: ContentSection;
  title: string;
  topic: string;
  excerpt: string;
};

export type SectionSummary = {
  slug: ContentSection;
  name: string;
  articles: ArticleRecord[];
};

export type YuanShanCategorySummary = {
  slug: "ai" | "data" | "new-energy" | "traditional-ai" | "education-ai";
  name: string;
  articles: ArticleRecord[];
};
