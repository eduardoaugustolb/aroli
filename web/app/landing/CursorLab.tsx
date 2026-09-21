"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

export function CursorLab({
  mode,
  onMode,
}: {
  mode: "circle" | "aroli";
  onMode: (mode: "circle" | "aroli") => void;
}) {
  const [clicks, setClicks] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [width, setWidth] = useState(62);
  const [busy, setBusy] = useState(false);
  const [help, setHelp] = useState(false);
  const drag = useRef<{
    x: number;
    y: number;
    startX: number;
    startY: number;
  } | null>(null);
  const area = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const begin = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      startX: position.x,
      startY: position.y,
    };
    setDragging(true);
  };
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current || !area.current) return;
    setPosition({
      x: Math.max(
        0,
        Math.min(
          area.current.clientWidth - 140,
          drag.current.startX + event.clientX - drag.current.x,
        ),
      ),
      y: Math.max(
        0,
        Math.min(110, drag.current.startY + event.clientY - drag.current.y),
      ),
    });
  };
  const end = () => {
    drag.current = null;
    setDragging(false);
  };
  return (
    <section
      id="cursor"
      className="experience-section cursor-lab"
      aria-labelledby="cursor-heading"
    >
      <div className="experience-heading">
        <p className="eyebrow">01 / O AMBIENTE RESPONDE</p>
        <h2 id="cursor-heading">
          O próximo gesto
          <br />
          <em>é seu.</em>
        </h2>
        <p>
          O mesmo silêncio. Uma nova presença. O círculo dá lugar ao conjunto
          Aroli Pointer. Descubra como cada gesto muda de forma.
        </p>
      </div>
      <div className="experience-panel cursor-panel">
        <div className="lab-toolbar">
          <span className="lab-caption">UM PONTEIRO. VÁRIAS INTENÇÕES.</span>
          <div className="segmented" aria-label="Estilo do cursor">
            {(["circle", "aroli"] as const).map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={mode === value}
                onClick={() => onMode(value)}
              >
                {value === "circle" ? "Círculo" : "Aroli Pointer"}
              </button>
            ))}
          </div>
        </div>
        <div className="cursor-playground">
          <div className="cursor-gesture">
            <span className="gesture-number">01 / apontar</span>
            <button
              type="button"
              className="gesture-action"
              onClick={() => setClicks((n) => n + 1)}
            >
              Um pequeno clique <span aria-hidden="true">↗</span>
            </button>
            <span className="gesture-note" aria-live="polite">
              {clicks
                ? `${clicks} ${clicks === 1 ? "gesto registrado" : "gestos registrados"}`
                : "Passe. Clique. Sinta a resposta."}
            </span>
          </div>
          <div className="cursor-gesture">
            <label className="gesture-number" htmlFor="cursor-text">
              02 / selecionar
            </label>
            <input
              id="cursor-text"
              defaultValue="O foco está nos detalhes."
              aria-label="Texto para testar seleção"
            />
            <span className="gesture-note">
              Selecione uma palavra. Escreva outra.
            </span>
          </div>
          <div className="cursor-gesture drag-gesture">
            <span className="gesture-number">03 / mover</span>
            <div ref={area} className="drag-space">
              <button
                type="button"
                className="drag-token"
                data-aroli-cursor={dragging ? "grabbing" : "grab"}
                style={{
                  transform: `translate(${position.x}px,${position.y}px)`,
                }}
                onPointerDown={begin}
                onPointerMove={move}
                onPointerUp={end}
                onPointerCancel={end}
                onLostPointerCapture={end}
                onKeyDown={(event) => {
                  const moves: Record<string, [number, number]> = {
                    ArrowLeft: [-10, 0],
                    ArrowRight: [10, 0],
                    ArrowUp: [0, -10],
                    ArrowDown: [0, 10],
                  };
                  if (moves[event.key]) {
                    event.preventDefault();
                    const [x, y] = moves[event.key];
                    setPosition((p) => ({
                      x: Math.max(
                        0,
                        Math.min(
                          (area.current?.clientWidth ?? 140) - 140,
                          p.x + x,
                        ),
                      ),
                      y: Math.max(0, Math.min(110, p.y + y)),
                    }));
                  }
                }}
                aria-label="Mover peça, use o mouse ou as setas"
              >
                {dragging ? "Na sua mão" : "Arraste aqui"}{" "}
                <span aria-hidden="true">⠿</span>
              </button>
            </div>
            <span className="gesture-note">
              Uma mão aberta. Um movimento contínuo.
            </span>
          </div>
          <div className="cursor-gesture">
            <label className="gesture-number" htmlFor="cursor-width">
              04 / ajustar
            </label>
            <div
              className="resize-demo"
              style={{ width: `${width}%` }}
              data-aroli-cursor="ew-resize"
            >
              <span>{width}%</span>
            </div>
            <input
              id="cursor-width"
              aria-label="Largura da peça"
              type="range"
              min="35"
              max="100"
              value={width}
              data-aroli-cursor="ew-resize"
              onChange={(event) => setWidth(Number(event.target.value))}
            />
          </div>
        </div>
        <div className="cursor-extra">
          <button
            type="button"
            data-aroli-cursor={busy ? "wait" : "hover"}
            onClick={() => {
              if (busy) return;
              setBusy(true);
              timer.current = setTimeout(() => setBusy(false), 1800);
            }}
          >
            {busy ? "Preparando…" : "Experimente esperar"}
          </button>
          <button
            type="button"
            data-aroli-cursor="help"
            aria-expanded={help}
            onClick={() => setHelp((v) => !v)}
          >
            Uma ajuda?
          </button>
          <button type="button" disabled>
            Indisponível
          </button>
          <span role="status">
            {help
              ? "Cada contexto usa o SVG original do tema Aroli."
              : "Passe sobre os controles para descobrir outras formas."}
          </span>
        </div>
        <div className="find-cursor-note">
          <span className="shake-glyph" aria-hidden="true">
            ↔
          </span>
          <div>
            <strong>Perdeu o cursor? Chame por ele.</strong>
            <p>
              Com Aroli ativo, sacuda o mouse rapidamente. O ponteiro cresce por
              um instante e volta ao tamanho original.
            </p>
            <small>
              Em telas de toque, explore as peças com o dedo. Movimento reduzido
              desativa o efeito de busca.
            </small>
          </div>
          <span className={`mode-indicator ${mode === "aroli" ? "is-on" : ""}`}>
            {mode === "aroli" ? "Aroli ativo" : "Ative Aroli acima"}
          </span>
        </div>
      </div>
    </section>
  );
}
