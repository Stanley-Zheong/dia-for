import { AppShell } from "@/components/AppShell";
import { ArticleCard } from "@/components/ArticleCard";
import { HomeHeroIdentity } from "@/components/HomeHeroIdentity";
import { getAllArticles, getArticlesBySection, getTags, getTopics } from "@/lib/content";

export default async function HomePage() {
  const [articles, brainwaves, yuanShan, products, topics, tags] = await Promise.all([
    getAllArticles(),
    getArticlesBySection("brainwave"),
    getArticlesBySection("yuan-shan"),
    getArticlesBySection("xiao-ju-deng"),
    getTopics(),
    getTags(),
  ]);

  return (
    <AppShell active="home">
      <section className="hero hub-hero">
        <HomeHeroIdentity copy="脑电波记录你和大模型的对话，远山沉淀 RSS 行业资讯，小桔灯整理产品矩阵。所有文章累计保存，并可通过栏目、标签和详情页穿透访问。" />
        <div className="hub-cards" aria-label="Column shortcuts">
          {[
            { href: "/brainwave", kicker: "Brainwave", name: "脑电波", count: brainwaves.length, desc: "我和大模型的对话、判断与技术/商业复盘。" },
            { href: "/yuan-shan", kicker: "Distant Hills", name: "远山", count: yuanShan.length, desc: "RSS、公众号和行业信源筛选后的结构化情报。" },
            { href: "/xiao-ju-deng", kicker: "Little Lantern", name: "小桔灯", count: products.length, desc: "产品矩阵、项目说明和后续可公开的产品页。" },
            { href: "/tags", kicker: "Backlinks", name: "标签网络", count: tags.length, desc: "通过标签、话题和相关文章横向穿透内容。" },
          ].map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="hub-card"
            >
              <span className="hub-card-kicker">{section.kicker}</span>
              <strong>{section.name}</strong>
              <span>{section.desc}</span>
              <span>{section.count} 篇</span>
            </a>
          ))}
        </div>
      </section>

      <div className="home-sections">
        <section className="section-block">
          <div className="section-head">
            <p className="eyebrow">Latest</p>
            <h2 className="block-title">最新种子</h2>
          </div>
          <div className="stream" aria-label="Latest posts">
            {articles.map((article) => (
              <ArticleCard key={`${article.meta.section}-${article.slug}`} article={article} />
            ))}
          </div>
        </section>

        <aside className="panel trends-panel">
          <p className="eyebrow">Trends</p>
          <h2>最近话题</h2>
          <div className="trend-list">
            {topics.slice(0, 6).map((topic) => (
              <a key={topic.slug} href={`/topics/${topic.slug}`}>
                <strong>{topic.name}</strong>
                <span>{topic.chats.length} 篇 · {topic.models.join("、") || "未标注模型"}</span>
              </a>
            ))}
          </div>
        </aside>

        <section className="section-block keyword-section">
          <div className="section-head">
            <p className="eyebrow">Hot keywords</p>
            <h2 className="block-title">关键词索引</h2>
          </div>
          <div className="keyword-cloud">
            {tags.slice(0, 18).map((tag) => (
              <a key={tag.slug} className="keyword" href={`/tags/${tag.slug}`}>
                {tag.name} <span>{tag.chats.length}</span>
              </a>
            ))}
          </div>
        </section>

        <aside className="panel map-panel">
          <p className="eyebrow">Backlink map</p>
          <h2>轻量双链地图</h2>
          <div className="link-map" aria-hidden="true">
            <span className="node node-main">Agent</span>
            <span className="node node-a">RSS</span>
            <span className="node node-b">Prompt</span>
            <span className="node node-c">产品</span>
            <span className="node node-d">Skill</span>
          </div>
          <p>标签、话题和相关文章把散落的对话、资讯和产品页连成一个可浏览的内容网络。</p>
        </aside>
      </div>
    </AppShell>
  );
}
