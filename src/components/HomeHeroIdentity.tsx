import type { ReactNode } from "react";

type HomeHeroIdentityProps = {
  copy: ReactNode;
};

export function HomeHeroIdentity({ copy }: HomeHeroIdentityProps) {
  return (
    <div className="hero-identity">
      <p className="eyebrow">Personal content hub</p>
      <h1 className="hero-title site-hero-title" aria-label="二dd水 (DAL · DIL)">
        <span>二dd水</span>
        <span className="hero-title-sub">(DAL · DIL)</span>
      </h1>
      <p className="hero-tagline-gradient">聚数成海，滴水成智</p>
      <p className="hero-copy">{copy}</p>
    </div>
  );
}
