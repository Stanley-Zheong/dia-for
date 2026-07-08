import Image from "next/image";

import { illustrationForArticle } from "@/lib/illustrations";
import type { ArticleRecord } from "@/lib/types";

type ArticleIllustrationProps = {
  article: ArticleRecord;
};

export function ArticleIllustration({ article }: ArticleIllustrationProps) {
  const illustration = illustrationForArticle(article);

  return (
    <figure className="article-illustration">
      <Image
        src={illustration.src}
        alt={illustration.alt}
        width={1200}
        height={675}
        sizes="(max-width: 900px) 100vw, 760px"
        loading="lazy"
        unoptimized
      />
    </figure>
  );
}
