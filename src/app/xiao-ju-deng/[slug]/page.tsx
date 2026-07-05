import { notFound, redirect } from "next/navigation";

import { AppShell } from "@/components/AppShell";
import { ArticleDetail } from "@/components/ArticleDetail";
import { getArticleBySectionSlug, getProducts } from "@/lib/content";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getArticleBySectionSlug("xiao-ju-deng", slug);

  if (!product) {
    notFound();
  }

  if (slug !== product.slug) {
    redirect(`/xiao-ju-deng/${product.slug}`);
  }

  const related = (await getProducts()).filter((item) => item.slug !== product.slug);

  return (
    <AppShell active="xiao-ju-deng">
      <ArticleDetail article={product} related={related} />
    </AppShell>
  );
}
