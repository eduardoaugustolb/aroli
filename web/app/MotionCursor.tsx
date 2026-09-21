"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { getCursorTarget, getLinkTextRect } from "./cursor-target";
import {
  CURSORS,
  CursorShake,
  cursorShape,
  type CursorShape,
} from "./aroli-cursor";

// Círculo com morph em botões e links, sem rastro.
// Só transform no pointermove; leituras de DOM no máximo 1x por frame.
export function MotionCursor({
  mode = "circle",
}: {
  mode?: "circle" | "aroli";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const track = (event: PointerEvent) => {
      lastPointer.current =
        event.pointerType === "mouse"
          ? { x: event.clientX, y: event.clientY }
          : null;
    };
    const clear = () => {
      lastPointer.current = null;
    };
    window.addEventListener("pointermove", track);
    window.addEventListener("blur", clear);
    document.documentElement.addEventListener("pointerleave", clear);
    return () => {
      window.removeEventListener("pointermove", track);
      window.removeEventListener("blur", clear);
      document.documentElement.removeEventListener("pointerleave", clear);
    };
  }, []);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      if (mode === "aroli") {
        mm.add(
          {
            fine: "(hover: hover) and (pointer: fine)",
            reduce: "(prefers-reduced-motion: reduce)",
          },
          (context) => {
            if (!context.conditions?.fine) return;
            const reduce = !!context.conditions.reduce;
            const cursor = ref.current!;
            const sprite = cursor.querySelector<HTMLElement>(
              ".aroli-cursor-sprites",
            )!;
            const x = gsap.quickTo(cursor, "x", {
              duration: reduce ? 0 : 0.12,
              ease: "power3.out",
            });
            const y = gsap.quickTo(cursor, "y", {
              duration: reduce ? 0 : 0.12,
              ease: "power3.out",
            });
            const scaleX = gsap.quickTo(sprite, "scaleX", {
              duration: reduce ? 0 : 0.2,
              ease: "power2.out",
            });
            const scaleY = gsap.quickTo(sprite, "scaleY", {
              duration: reduce ? 0 : 0.2,
              ease: "power2.out",
            });
            const scale = (value: number) => {
              scaleX(value);
              scaleY(value);
            };
            let visible = false,
              ready = false,
              active = true,
              px = 0,
              py = 0,
              dragging = false,
              until = 0;
            let shape: CursorShape = "arrow";
            const shake = new CursorShake();
            const images = Array.from(cursor.querySelectorAll("img"));
            Promise.all(images.map((img) => img.decode()))
              .then(() => {
                if (!active) return;
                ready = true;
                if (
                  lastPointer.current &&
                  document.visibilityState === "visible"
                ) {
                  px = lastPointer.current.x;
                  py = lastPointer.current.y;
                  x(px, px);
                  y(py, py);
                  visible = true;
                  cursor.style.opacity = "1";
                  document.documentElement.classList.add(
                    "custom-cursor-active",
                  );
                }
              })
              .catch(() => {
                ready = false;
              });
            const hide = () => {
              visible = false;
              dragging = false;
              until = 0;
              shake.reset();
              scale(1);
              cursor.style.opacity = "0";
              document.documentElement.classList.remove("custom-cursor-active");
            };
            const move = (event: PointerEvent) => {
              if (event.pointerType !== "mouse" || !ready) {
                hide();
                return;
              }
              px = event.clientX;
              py = event.clientY;
              if (!visible) {
                x(px, px);
                y(py, py);
                visible = true;
                cursor.style.opacity = "1";
                document.documentElement.classList.add("custom-cursor-active");
              } else {
                x(px);
                y(py);
              }
              if (!reduce && shake.sample(px, py, performance.now())) {
                until = performance.now() + 850;
                scale(2.8);
                cursor.dataset.finding = "true";
              }
            };
            const frame = () => {
              if (!visible) return;
              const next = cursorShape(
                document.elementFromPoint(px, py),
                dragging,
              );
              if (next !== shape) {
                shape = next;
                cursor.dataset.shape = shape;
              }
              if (until && performance.now() > until) {
                until = 0;
                scale(1);
                delete cursor.dataset.finding;
              }
            };
            const down = (e: PointerEvent) => {
              dragging = !!(e.target as Element)?.closest(
                '[data-aroli-cursor="grab"],[data-aroli-cursor="grabbing"]',
              );
            };
            const up = () => {
              dragging = false;
            };
            cursor.dataset.shape = "arrow";
            gsap.ticker.add(frame);
            window.addEventListener("pointermove", move);
            window.addEventListener("pointerdown", down);
            window.addEventListener("pointerup", up);
            window.addEventListener("pointercancel", up);
            window.addEventListener("blur", hide);
            document.documentElement.addEventListener("pointerleave", hide);
            document.addEventListener("visibilitychange", hide);
            return () => {
              active = false;
              hide();
              gsap.ticker.remove(frame);
              window.removeEventListener("pointermove", move);
              window.removeEventListener("pointerdown", down);
              window.removeEventListener("pointerup", up);
              window.removeEventListener("pointercancel", up);
              window.removeEventListener("blur", hide);
              document.documentElement.removeEventListener(
                "pointerleave",
                hide,
              );
              document.removeEventListener("visibilitychange", hide);
            };
          },
        );
        return () => mm.revert();
      }
      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const cursor = ref.current!;
          const x = gsap.quickTo(cursor, "x", {
            duration: 0.35,
            ease: "power3.out",
          });
          const y = gsap.quickTo(cursor, "y", {
            duration: 0.35,
            ease: "power3.out",
          });
          const width = gsap.quickTo(cursor, "width", {
            duration: 0.25,
            ease: "power3.out",
          });
          const height = gsap.quickTo(cursor, "height", {
            duration: 0.25,
            ease: "power3.out",
          });
          let visible = false;
          let target: HTMLElement | null = null;
          let morphQueued = false;
          let px = 0,
            py = 0;
          const setTarget = (next: HTMLElement | null) => {
            if (next === target) return;
            target = next;
            morphQueued = true;
          };
          const hide = () => {
            visible = false;
            setTarget(null);
            morphQueued = false;
            cursor.style.opacity = "0";
            // Re-entry must start as a circle, even after leaving over a button.
            width(36, 36);
            height(36, 36);
            width.tween.pause();
            height.tween.pause();
            cursor.style.width = cursor.style.height = "36px";
            cursor.style.borderRadius = "50%";
            document.documentElement.classList.remove("custom-cursor-active");
          };
          // Roda no máximo 1x por frame: leituras caras fora do pointermove.
          const morph = () => {
            // Measure once, before the animation writes; also refresh on scroll.
            const button = target?.matches(
              "button, [data-cursor='button'], .more-list a",
            );
            let rect:
              | Pick<DOMRect, "left" | "top" | "bottom" | "width" | "height">
              | undefined = target?.getBoundingClientRect();
            if (target && !button) {
              rect = getLinkTextRect(target) ?? rect;
            }
            const tx = rect ? rect.left : px - 18;
            const ty = rect ? (button ? rect.top : rect.bottom) : py - 18;
            const targetStyle =
              button && target ? getComputedStyle(target) : null;
            const corners = [
              "borderTopLeftRadius",
              "borderTopRightRadius",
              "borderBottomRightRadius",
              "borderBottomLeftRadius",
            ] as const;
            for (const corner of corners) {
              // Keep units and elliptical radii; parseFloat loses that geometry.
              cursor.style[corner] = targetStyle
                ? targetStyle[corner]
                : rect
                  ? "1px"
                  : "50%";
            }
            width(rect ? rect.width : 36);
            height(rect ? (button ? rect.height : 2) : 36);
            if (!visible) {
              x(tx, tx);
              y(ty, ty);
            } else {
              x(tx);
              y(ty);
            }
          };
          const move = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") {
              hide();
              return;
            }
            px = event.clientX;
            py = event.clientY;
            // Só transform aqui: barato e acompanha o mouse sem atrasar o evento.
            if (!target) {
              x(px - 18);
              y(py - 18);
            }
            morphQueued = true;
            if (!visible) {
              visible = true;
              cursor.style.opacity = "1";
              document.documentElement.classList.add("custom-cursor-active");
              // Estreia sem voar da origem: posiciona de imediato.
              x(px - 18, px - 18);
              y(py - 18, py - 18);
            }
          };
          const frame = () => {
            if (!visible) return;
            // Re-check even with a stationary pointer: scroll/animations can hide,
            // replace or cover the current target without a pointermove event.
            setTarget(getCursorTarget(document.elementFromPoint(px, py)));
            if (morphQueued) {
              morphQueued = false;
              morph();
            }
          };
          const scroll = () => {
            if (!visible) return;
            // The same target can have a new position after scrolling.
            morphQueued = true;
          };
          const resize = () => {
            if (visible) morphQueued = true;
          };
          gsap.ticker.add(frame);
          window.addEventListener("pointermove", move);
          window.addEventListener("scroll", scroll, { passive: true });
          window.addEventListener("resize", resize);
          window.addEventListener("blur", hide);
          document.documentElement.addEventListener("pointerleave", hide);
          document.addEventListener("visibilitychange", hide);
          if (lastPointer.current)
            move(
              new PointerEvent("pointermove", {
                clientX: lastPointer.current.x,
                clientY: lastPointer.current.y,
                pointerType: "mouse",
              }),
            );
          return () => {
            hide();
            gsap.ticker.remove(frame);
            window.removeEventListener("pointermove", move);
            window.removeEventListener("scroll", scroll);
            window.removeEventListener("resize", resize);
            window.removeEventListener("blur", hide);
            document.documentElement.removeEventListener("pointerleave", hide);
            document.removeEventListener("visibilitychange", hide);
          };
        },
      );
      return () => mm.revert();
    },
    { scope: ref, dependencies: [mode], revertOnUpdate: true },
  );
  return (
    <div
      ref={ref}
      className={`motion-cursor${mode === "aroli" ? " motion-cursor--aroli" : ""}`}
      aria-hidden="true"
    >
      {mode === "aroli" && (
        <div className="aroli-cursor-sprites">
          {Object.entries(CURSORS).map(([name, [hx, hy]]) => (
            <img
              key={name}
              data-shape={name}
              src={`/playground/cursors/${name}.svg`}
              width="48"
              height="48"
              alt=""
              style={{ left: -hx, top: -hy }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
