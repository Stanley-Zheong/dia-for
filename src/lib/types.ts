export type ChatMessageRole = "user" | "assistant" | "unknown";

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  speaker: string;
  content: string;
};

export type ChatRecordMeta = {
  title: string;
  topic: string;
  models: string[];
  source?: string;
  published: boolean;
  created?: string;
  tags: string[];
};

export type ChatRecord = {
  slug: string;
  rawMarkdown: string;
  parseStatus: "complete" | "partial";
  meta: ChatRecordMeta;
  messages: ChatMessage[];
};

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
  title: string;
  topic: string;
  excerpt: string;
};
