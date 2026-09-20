"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CursorLab } from "./CursorLab";
import { FontLab } from "./FontLab";
import { preloadUmbraCursors } from "../umbra-cursor";

gsap.registerPlugin(useGSAP, ScrollTrigger);
export function ExperienceSections({
  mode,
  onMode,
}: {
  mode: "circle" | "umbra";
  onMode: (mode: "circle" | "umbra") => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const section = root.current?.querySelector("#cursor");
    if (!section) return;
    const preload = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void preloadUmbraCursors();
          preload.disconnect();
        }
      },
      { rootMargin: "800px 0px", threshold: 0 },
    );
    // The first arrival introduces Umbra. Later manual choices remain in
    // charge, including when scrolling back from the font lab.
    const arrival = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onMode("umbra");
          arrival.disconnect();
        }
      },
      { rootMargin: "-10% 0px -25% 0px", threshold: 0 },
    );
    preload.observe(section);
    arrival.observe(section);
    return () => {
      preload.disconnect();
      arrival.disconnect();
    };
  }, [onMode]);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        root.current
          ?.querySelectorAll<HTMLElement>(".story-bridge")
          .forEach((bridge) => {
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: bridge,
                start: "top 85%",
                end: "bottom 45%",
                scrub: 0.4,
              },
            });
            timeline
              .fromTo(
                bridge.querySelector(".story-thread"),
                { scaleY: 0 },
                {
                  scaleY: 1,
                  transformOrigin: "top",
                  ease: "none",
                  duration: 1,
                },
                0,
              )
              .fromTo(
                bridge.querySelector(".story-word"),
                { opacity: 0.2, y: 24 },
                { opacity: 1, y: 0, ease: "none", duration: 0.6 },
                0.25,
              );
          });
        root.current
          ?.querySelectorAll<HTMLElement>(".experience-section")
          .forEach((section) => {
            gsap.from(section.querySelector(".experience-heading"), {
              y: 32,
              opacity: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: { trigger: section, start: "top 88%", once: true },
            });
            gsap.from(section.querySelector(".experience-panel"), {
              y: 40,
              opacity: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section.querySelector(".experience-panel"),
                start: "top 94%",
                once: true,
              },
            });
          });
        let active = true;
        document.fonts.ready.then(() => {
          if (active) ScrollTrigger.refresh();
        });
        return () => {
          active = false;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className="experience-story">
      <div className="story-bridge">
        <div className="story-thread" aria-hidden="true" />
        <p className="story-word">
          Você já viu o ambiente.
          <br />
          <span>Agora, toque a ideia.</span>
        </p>
      </div>
      <CursorLab mode={mode} onMode={onMode} />
      <div className="story-bridge story-bridge--type">
        <div className="story-thread" aria-hidden="true" />
        <p className="story-word">
          O gesto encontra uma linha.
          <br />
          <span>A linha encontra sua voz.</span>
        </p>
        <span className="story-caret" aria-hidden="true">
          I
        </span>
      </div>
      <FontLab />
      <div className="story-outro">
        <p>
          Do gesto à palavra.
          <br />
          Agora, leve esse ambiente com você.
        </p>
        <a href="#mais">Escolha por onde começar ↓</a>
      </div>
    </div>
  );
}
