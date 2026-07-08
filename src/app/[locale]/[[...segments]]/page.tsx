import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/AppShell";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleDetail } from "@/components/ArticleDetail";
import { ChatCard } from "@/components/ChatCard";
import { ChatTranscript } from "@/components/ChatTranscript";
import { HomeHeroIdentity, homeHeroCopy } from "@/components/HomeHeroIdentity";
import { KeywordFilter } from "@/components/KeywordFilter";
import { MarkdownContent } from "@/components/MarkdownContent";
import { MetaPills } from "@/components/MetaPills";
import {
  getAllArticles,
  getAllChats,
  getArticleBySectionSlug,
  getArticlesBySection,
  getChatBySlug,
  getModelBySlug,
  getModels,
  getProducts,
  getTagBySlug,
  getTags,
  getTopicBySlug,
  getTopics,
  getYuanShanCategories,
  getYuanShanCategoryBySlug,
} from "@/lib/content";
import { isLocale, locales, localizeArticle, t, withLocale, type Locale } from "@/lib/i18n";
import { keywordSummariesFor } from "@/lib/presentation";
import { sectionHref, sectionName } from "@/lib/routes";
import { slugify } from "@/lib/slug";

type LocalePageProps = {
  params: Promise<{ locale: string; segments?: string[] }>;
};

export async function generateStaticParams() {
  const [articles, tags, topics, models, yuanCategories] = await Promise.all([
    getAllArticles(),
    getTags(),
    getTopics(),
    getModels(),
    getYuanShanCategories(),
  ]);

  const baseSegments: string[][] = [
    [],
    ["brainwave"],
    ["yuan-shan"],
    ["xiao-ju-deng"],
    ["topics"],
    ["tags"],
    ["search"],
  ];
  const articleSegments = articles.map((article) => [article.meta.section, article.slug]);
  const tagSegments = tags.map((tag) => ["tags", tag.slug]);
  const topicSegments = topics.map((topic) => ["topics", topic.slug]);
  const modelSegments = models.map((model) => ["models", model.slug]);
  const categorySegments = yuanCategories.map((category) => ["yuan-shan", category.slug]);

  return locales.flatMap((locale) =>
    [
      ...baseSegments,
      ...articleSegments,
      ...tagSegments,
      ...topicSegments,
      ...modelSegments,
      ...categorySegments,
    ].map((segments) => ({ locale, segments })),
  );
}

async function Home({ locale }: { locale: Locale }) {
  const [articles, brainwaves, yuanShan, products, topics, tags] = await Promise.all([
    getAllArticles(),
    getArticlesBySection("brainwave"),
    getArticlesBySection("yuan-shan"),
    getArticlesBySection("xiao-ju-deng"),
    getTopics(),
    getTags(),
  ]);

  const cards = [
    {
      href: withLocale("/brainwave", locale),
      kicker: "Brainwave",
      name: t(locale, "脑电波", "Brainwave"),
      count: brainwaves.length,
      desc: t(locale, "我和大模型的对话、判断与技术/商业复盘。", "Conversations, judgments, technical notes, and business reviews with large models."),
    },
    {
      href: withLocale("/yuan-shan", locale),
      kicker: "Distant Hills",
      name: t(locale, "远山", "Distant Hills"),
      count: yuanShan.length,
      desc: t(locale, "RSS、公众号和行业信源筛选后的结构化情报。", "Structured intelligence from RSS, newsletters, and industry sources."),
    },
    {
      href: withLocale("/xiao-ju-deng", locale),
      kicker: "Little Lantern",
      name: t(locale, "小桔灯", "Little Lantern"),
      count: products.length,
      desc: t(locale, "产品矩阵、项目说明和后续可公开的产品页。", "Product matrix, project notes, and public product pages."),
    },
    {
      href: withLocale("/tags", locale),
      kicker: "Backlinks",
      name: t(locale, "标签网络", "Tag Network"),
      count: tags.length,
      desc: t(locale, "通过标签、话题和相关文章横向穿透内容。", "Traverse content through tags, topics, and related articles."),
    },
  ];

  return (
    <AppShell active="home" locale={locale}>
      <section className="hero hub-hero">
        <HomeHeroIdentity
          copy={t(
            locale,
            homeHeroCopy,
            "ErDDshui is a personal laboratory for data aggregation and cognitive archiving in the large-model era. It gathers, cleans, and produces multidimensional web data to resist everyday information noise. Instead of chasing fragmented trends, it distills highly generative dry knowledge and uses data-to-wisdom refinement to build a hard cognitive foundation for AI capability evolution and technical iteration.",
          )}
        />
        <div className="hub-cards" aria-label="Column shortcuts">
          {cards.map((section) => (
            <a key={section.href} href={section.href} className="hub-card">
              <span className="hub-card-kicker">{section.kicker}</span>
              <strong>{section.name}</strong>
              <span>{section.desc}</span>
              <span>{section.count} {t(locale, "篇", "posts")}</span>
            </a>
          ))}
        </div>
      </section>

      <div className="home-sections">
        <section className="section-block">
          <div className="section-head">
            <p className="eyebrow">Latest</p>
            <h2 className="block-title">{t(locale, "最新种子", "Latest Seeds")}</h2>
          </div>
          <div className="stream" aria-label="Latest posts">
            {articles.map((article) => (
              <ArticleCard key={`${article.meta.section}-${article.slug}`} article={article} locale={locale} />
            ))}
          </div>
        </section>
        <aside className="panel trends-panel">
          <p className="eyebrow">Trends</p>
          <h2>{t(locale, "最近话题", "Recent Topics")}</h2>
          <div className="trend-list">
            {topics.slice(0, 6).map((topic) => (
              <a key={topic.slug} href={withLocale(`/topics/${topic.slug}`, locale)}>
                <strong>{topic.name}</strong>
                <span>{topic.chats.length} {t(locale, "篇", "posts")}</span>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

async function BrainwaveList({ locale }: { locale: Locale }) {
  const chats = await getAllChats();
  const keywords = keywordSummariesFor(chats);
  return (
    <AppShell active="brainwave" locale={locale}>
      <div className="category-layout" data-filter-scope="brainwave">
        <section>
          <p className="eyebrow">Brainwave</p>
          <h1 className="page-title">{t(locale, "脑电波", "Brainwave")}</h1>
          <p className="page-intro">{t(locale, "与大模型的极限对垒，捕捉人机思辨的火花。", "Extreme sparring with large models, capturing the sparks of human-machine reasoning.")}</p>
          <div className="stream">{chats.map((chat) => <ChatCard key={chat.slug} chat={chat} locale={locale} />)}</div>
        </section>
        <aside className="panel">
          <h2>{t(locale, "栏目结构", "Structure")}</h2>
          <p>
            {t(
              locale,
              "拒绝灌水与公式化问答。这里完整复盘、记录并蒸馏高价值的 AI 对话全过程。通过拆解高阶 Prompt 架构与逻辑反向测试，探索 AI 的能力边界，把调教过程沉淀为可复用的启智方法论。",
              "No filler, no formulaic Q&A. This section records, reviews, and distills high-value AI conversations end to end, using advanced prompt architecture and reverse logic tests to probe model boundaries and turn tuning into reusable thinking methods.",
            )}
          </p>
          <KeywordFilter scope="brainwave" keywords={keywords} label={t(locale, "关键字：", "Keywords:")} />
        </aside>
      </div>
    </AppShell>
  );
}

async function BrainwaveDetail({ locale, slug }: { locale: Locale; slug: string }) {
  const chat = await getChatBySlug(slug);
  if (!chat) notFound();
  const display = localizeArticle(chat, locale);
  return (
    <AppShell active="brainwave" locale={locale}>
      <div className="content-grid with-tips">
        <aside className="sidebar article-nav" aria-label="Article navigation">
          <div className="sidebar-label">Brainwave</div>
          <nav className="sidebar-nav">
            <Link prefetch={false} href={withLocale("/brainwave", locale)}>{t(locale, "栏目首页", "Section home")}</Link>
            <Link prefetch={false} href={withLocale(`/topics/${slugify(display.meta.topic)}`, locale)}>{t(locale, "话题", "Topics")}</Link>
            <Link prefetch={false} href={withLocale("/tags", locale)}>{t(locale, "标签", "Tags")}</Link>
          </nav>
        </aside>
        <article className="article-body">
          <div className="article-meta">{t(locale, "首页", "Home")} / {sectionName("brainwave", locale)} / {display.meta.topic} · {display.meta.created ?? t(locale, "未标注日期", "Undated")}</div>
          <h1 className="article-title">{display.meta.title}</h1>
          <div className="article-lead"><MetaPills chat={display} locale={locale} /></div>
          <ChatTranscript chat={display} locale={locale} />
        </article>
        <aside className="tips-panel" aria-label="Article tips">
          <h2 className="tips-title">{t(locale, "关联 Tips", "Related Tips")}</h2>
          <div className="tip-related open">
            <div className="related-card">
              <strong>{t(locale, "价值提炼", "Insights")}</strong>
              {display.meta.insights ? <MarkdownContent content={display.meta.insights} /> : t(locale, "暂无价值提炼。", "No insights yet.")}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

async function SectionList({ locale, section }: { locale: Locale; section: "yuan-shan" | "xiao-ju-deng" }) {
  const articles = section === "yuan-shan" ? await getArticlesBySection("yuan-shan") : await getProducts();
  const categories = section === "yuan-shan" ? await getYuanShanCategories() : [];
  const keywords = section === "yuan-shan" ? keywordSummariesFor(articles) : [];
  return (
    <AppShell active={section} locale={locale}>
      <div className="category-layout" data-filter-scope={section}>
        <section>
          <p className="eyebrow">{sectionName(section, locale)}</p>
          <h1 className="page-title">{sectionName(section, locale)}</h1>
          <p className="page-intro">
            {section === "yuan-shan"
              ? t(locale, "全网数据自动化采集矩阵，构筑行业认知基座。", "An automated web-wide data collection matrix that builds the industry's cognitive base.")
              : t(locale, "产品矩阵介绍。第一版从本机 codebases 扫描候选项目，确认公开后进入这里。", "Product matrix pages for public projects and tools.")}
          </p>
          {categories.length > 0 ? (
            <div className="filter-bar" aria-label="Subcategory filters">
              <Link prefetch={false} className="filter active" href={sectionHref("yuan-shan", locale)}>{t(locale, "全部", "All")}</Link>
              {categories.map((category) => (
                <Link prefetch={false} className="filter" key={category.slug} href={withLocale(`/yuan-shan/${category.slug}`, locale)}>
                  {category.name} · {category.articles.length}
                </Link>
              ))}
            </div>
          ) : null}
          <div className="stream">{articles.map((article) => <ArticleCard key={article.slug} article={article} locale={locale} />)}</div>
        </section>
        <aside className="panel">
          <h2>{t(locale, "栏目结构", "Structure")}</h2>
          {section === "yuan-shan" ? (
            <>
              <p>
                {t(
                  locale,
                  "多种方式数据聚合引擎，随时获取全球动态。在这里，杂乱的生数据被清洗为结构化的行业数据矩阵，成为对抗信息噪声的防线与坚固的数据基座。",
                  "A multi-method data aggregation engine for global updates. Here, raw noisy data is cleaned into a structured industry data matrix: a defense against information noise and a durable data base.",
                )}
              </p>
              <KeywordFilter scope="yuan-shan" keywords={keywords} label={t(locale, "关键字：", "Keywords:")} />
            </>
          ) : (
            <p>{articles.length} {t(locale, "篇累计文章", "published articles")}</p>
          )}
        </aside>
      </div>
    </AppShell>
  );
}

async function YuanShanCategory({ locale, slug }: { locale: Locale; slug: string }) {
  const category = await getYuanShanCategoryBySlug(slug);
  if (!category) return null;
  return (
    <AppShell active="yuan-shan" locale={locale}>
      <div className="category-layout">
        <section>
          <p className="eyebrow">Distant Hills · {category.name}</p>
          <h1 className="page-title">{t(locale, "远山", "Distant Hills")} · {category.name}</h1>
          <p className="page-intro">{category.articles.length} {t(locale, "篇累计资讯。", "archived intelligence items.")}</p>
          <div className="stream">{category.articles.map((article) => <ArticleCard key={article.slug} article={article} locale={locale} />)}</div>
        </section>
      </div>
    </AppShell>
  );
}

async function SectionDetail({ locale, section, slug }: { locale: Locale; section: "yuan-shan" | "xiao-ju-deng"; slug: string }) {
  const article = await getArticleBySectionSlug(section, slug);
  if (!article) notFound();
  const related = (await getArticlesBySection(section)).filter((item) => item.slug !== article.slug && item.meta.category === article.meta.category);
  return (
    <AppShell active={section} locale={locale}>
      <ArticleDetail article={article} related={related} locale={locale} />
    </AppShell>
  );
}

async function TagsList({ locale }: { locale: Locale }) {
  const tags = await getTags();
  return (
    <AppShell active="tags" locale={locale}>
      <div className="topic-layout">
        <section>
          <p className="eyebrow">Tags</p>
          <h1 className="page-title">{t(locale, "标签", "Tags")}</h1>
          <div className="keyword-cloud">
            {tags.map((tag) => (
              <Link prefetch={false} key={tag.slug} href={withLocale(`/tags/${tag.slug}`, locale)} className="keyword">
                {tag.name} <span>{tag.chats.length}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

async function TagDetail({ locale, slug }: { locale: Locale; slug: string }) {
  const tag = await getTagBySlug(slug);
  if (!tag) notFound();
  return (
    <AppShell active="tags" locale={locale}>
      <div className="category-layout">
        <section>
          <p className="eyebrow">Tag</p>
          <h1 className="page-title">{tag.name}</h1>
          <p className="page-intro">{tag.chats.length} {t(locale, "篇公开文章。", "public articles.")}</p>
          <div className="stream">{tag.chats.map((article) => <ArticleCard key={`${article.meta.section}-${article.slug}`} article={article} locale={locale} />)}</div>
        </section>
      </div>
    </AppShell>
  );
}

async function TopicsList({ locale }: { locale: Locale }) {
  const topics = await getTopics();
  return (
    <AppShell active="topics" locale={locale}>
      <div className="topic-layout">
        <section>
          <p className="eyebrow">Topics</p>
          <h1 className="page-title">{t(locale, "话题", "Topics")}</h1>
          <div className="topic-cloud">
            {topics.map((topic) => (
              <Link prefetch={false} key={topic.slug} href={withLocale(`/topics/${topic.slug}`, locale)} className="topic-pill">
                {topic.name} · {topic.chats.length}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

async function TopicDetail({ locale, slug }: { locale: Locale; slug: string }) {
  const topic = await getTopicBySlug(slug);
  if (!topic) notFound();
  return (
    <AppShell active="topics" locale={locale}>
      <div className="category-layout">
        <section>
          <p className="eyebrow">Topic</p>
          <h1 className="page-title">{topic.name}</h1>
          <p className="page-intro">{topic.chats.length} {t(locale, "篇公开记录。", "public records.")}</p>
          <div className="stream">{topic.chats.map((chat) => <ChatCard key={chat.slug} chat={chat} locale={locale} />)}</div>
        </section>
      </div>
    </AppShell>
  );
}

async function ModelDetail({ locale, slug }: { locale: Locale; slug: string }) {
  const model = await getModelBySlug(slug);
  if (!model) notFound();
  return (
    <AppShell active="brainwave" locale={locale}>
      <div className="category-layout">
        <section>
          <p className="eyebrow">Model</p>
          <h1 className="page-title">{model.name}</h1>
          <p className="page-intro">{model.chats.length} {t(locale, "篇公开聊天记录。", "public chat records.")}</p>
          <div className="stream">{model.chats.map((chat) => <ChatCard key={chat.slug} chat={chat} locale={locale} />)}</div>
        </section>
      </div>
    </AppShell>
  );
}

function SearchPage({ locale }: { locale: Locale }) {
  return (
    <AppShell active="search" locale={locale}>
      <div className="topic-layout">
        <section>
          <p className="eyebrow">Search</p>
          <h1 className="page-title">{t(locale, "搜索公开记录", "Search Public Records")}</h1>
          <p className="page-intro">{t(locale, "用自然语言搜索已发布内容，结果会带来源链接，方便回到原始文章。", "Search published content and jump back to source articles.")}</p>
          <p className="article-callout">{t(locale, "搜索框暂沿用中文旧路由；双语搜索将在下一轮接入。", "The search UI currently uses the legacy route; bilingual search will be connected next.")}</p>
        </section>
      </div>
    </AppShell>
  );
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale: rawLocale, segments = [] } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const [head, slug] = segments;

  if (!head) return <Home locale={locale} />;
  if (head === "brainwave" || head === "chats") {
    return slug ? <BrainwaveDetail locale={locale} slug={slug} /> : <BrainwaveList locale={locale} />;
  }
  if (head === "yuan-shan") {
    if (!slug) return <SectionList locale={locale} section="yuan-shan" />;
    const categoryPage = await YuanShanCategory({ locale, slug });
    return categoryPage ?? <SectionDetail locale={locale} section="yuan-shan" slug={slug} />;
  }
  if (head === "xiao-ju-deng") {
    return slug ? <SectionDetail locale={locale} section="xiao-ju-deng" slug={slug} /> : <SectionList locale={locale} section="xiao-ju-deng" />;
  }
  if (head === "tags") return slug ? <TagDetail locale={locale} slug={slug} /> : <TagsList locale={locale} />;
  if (head === "topics") return slug ? <TopicDetail locale={locale} slug={slug} /> : <TopicsList locale={locale} />;
  if (head === "models" && slug) return <ModelDetail locale={locale} slug={slug} />;
  if (head === "search") return <SearchPage locale={locale} />;

  notFound();
}
