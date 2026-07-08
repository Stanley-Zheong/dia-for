import type { ReactNode } from "react";

type HomeHeroIdentityProps = {
  copy?: ReactNode;
};

export const homeHeroCopy =
  "“二DD水”是专注大模型时代数据汇集与认知归档的个人实验室。致力于全网多维数据的聚合、清洗与原生产出，对抗日常的信息噪声。不追逐碎片化的热点，只沉淀高启发性的脱水干货，通过聚数成海、滴水成智的提炼过程，为 AI 的能力演进与技术迭代构筑硬核的认知底座。";

export function HomeHeroIdentity({ copy = homeHeroCopy }: HomeHeroIdentityProps) {
  return (
    <div className="hero-identity">
      <p className="eyebrow">二DD水</p>
      <h1 className="hero-title site-hero-title hero-tagline-gradient">
        聚数成海，滴水成智
      </h1>
      <p className="hero-copy">{copy}</p>
    </div>
  );
}
