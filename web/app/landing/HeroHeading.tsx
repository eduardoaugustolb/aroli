"use client";

import { ArrowDownIcon } from "@phosphor-icons/react";
import type { MouseEvent } from "react";

type HeroHeadingProps = {
  onExplore: (event: MouseEvent<HTMLButtonElement>) => void;
};

export function HeroHeading({ onExplore }: HeroHeadingProps) {
  return (
    <div className="landing-heading">
      <span className="hero-kicker">Aroli Themes</span>
      <h1>
        Tudo encontra
        <br />
        seu lugar.
      </h1>
      <p>
        Suas ferramentas, em sintonia. Temas, tipografia e pequenos gestos que
        fazem do seu espaço um ambiente só seu.
      </p>
      <button type="button" className="cta" onClick={onExplore}>
        Explorar os temas{" "}
        <span aria-hidden="true">
          <ArrowDownIcon size={14} />
        </span>
      </button>
    </div>
  );
}
