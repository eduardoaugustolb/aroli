import opentype from '../aroli/node_modules/opentype.js';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

// Original centerline drawings, in font coordinates (y points up).
// No external font is opened, transformed, traced or renamed by this build.
const out = join(import.meta.dir, 'dist');
mkdirSync(out, { recursive: true });
type Point = [number, number];
type Drawing = [number, string];
const drawings: Record<string, Drawing> = {
  A: [660, 'M70 0 L330 690 L590 0 M157 235 L503 235'],
  B: [640, 'M105 0 L105 680 L340 680 C570 680 580 360 340 360 L105 360 M340 360 C610 360 610 0 340 0 L105 0'],
  C: [690, 'M603 577 C547 658 469 691 363 691 C190 691 95 551 95 340 C95 129 190 -11 363 -11 C469 -11 547 22 603 103'],
  D: [700, 'M105 0 L105 680 L325 680 C515 680 605 545 605 340 C605 135 515 0 325 0 L105 0'],
  E: [580, 'M507 680 L105 680 L105 0 L517 0 M105 352 L462 352'],
  F: [560, 'M105 0 L105 680 L505 680 M105 352 L452 352'],
  G: [730, 'M610 577 C551 659 470 691 365 691 C187 691 95 551 95 340 C95 125 192 -11 375 -11 C484 -11 573 35 623 104 L623 320 L388 320'],
  H: [710, 'M105 0 L105 680 M605 0 L605 680 M105 346 L605 346'],
  I: [270, 'M135 0 L135 680'],
  J: [490, 'M385 680 L385 175 C385 51 337 -11 230 -11 C139 -11 87 37 72 118'],
  K: [645, 'M105 0 L105 680 M575 680 L105 244 M304 429 L585 0'],
  L: [545, 'M105 680 L105 0 L491 0'],
  M: [835, 'M105 0 L105 680 L417 97 L730 680 L730 0'],
  N: [710, 'M105 0 L105 680 L605 0 L605 680'],
  O: [745, 'M372 691 C184 691 95 549 95 340 C95 131 184 -11 372 -11 C560 -11 650 131 650 340 C650 549 560 691 372 691 Z'],
  P: [620, 'M105 0 L105 680 L335 680 C584 680 584 327 335 327 L105 327'],
  Q: [745, 'M372 691 C184 691 95 549 95 340 C95 131 184 -11 372 -11 C560 -11 650 131 650 340 C650 549 560 691 372 691 Z M440 146 L667 -78'],
  R: [650, 'M105 0 L105 680 L335 680 C584 680 584 327 335 327 L105 327 M330 327 L591 0'],
  S: [620, 'M529 586 C494 656 420 691 318 691 C204 691 100 635 100 524 C100 416 200 389 321 351 C448 312 533 280 533 168 C533 51 429 -11 310 -11 C196 -11 117 32 72 114'],
  T: [610, 'M47 680 L563 680 M305 680 L305 0'],
  U: [695, 'M105 680 L105 224 C105 63 191 -11 347 -11 C503 -11 590 63 590 224 L590 680'],
  V: [650, 'M64 680 L325 0 L586 680'],
  W: [955, 'M65 680 L253 0 L478 641 L702 0 L890 680'],
  X: [635, 'M73 680 L562 0 M562 680 L73 0'],
  Y: [630, 'M65 680 L315 339 L565 680 M315 339 L315 0'],
  Z: [610, 'M82 680 L535 680 L75 0 L540 0'],
  a: [545, 'M102 423 C147 476 201 506 277 506 C393 506 445 447 445 341 L445 0 M442 282 C378 295 325 302 270 297 C148 288 87 242 87 143 C87 43 155 -10 248 -10 C337 -10 409 34 445 110'],
  b: [595, 'M102 0 L102 720 M102 364 C140 456 204 506 292 506 C429 506 500 401 500 248 C500 95 429 -10 292 -10 C204 -10 140 40 102 133'],
  c: [540, 'M458 419 C419 477 361 506 288 506 C161 506 87 404 87 248 C87 92 161 -10 288 -10 C361 -10 419 19 458 77'],
  d: [595, 'M493 0 L493 720 M493 364 C455 456 391 506 303 506 C166 506 95 401 95 248 C95 95 166 -10 303 -10 C391 -10 455 40 493 133'],
  e: [560, 'M90 257 L471 257 C479 402 420 506 291 506 C157 506 87 400 87 248 C87 87 163 -10 302 -10 C378 -10 429 17 470 62'],
  f: [345, 'M130 0 L130 568 C130 679 180 726 261 726 C285 726 303 723 321 716 M40 490 L313 490'],
  g: [595, 'M490 496 L490 -19 C490 -153 417 -211 294 -211 C215 -211 152 -189 105 -144 M490 364 C452 456 388 506 300 506 C163 506 92 403 92 255 C92 107 163 5 300 5 C388 5 452 55 490 148'],
  h: [585, 'M102 0 L102 720 M102 346 C138 456 206 506 297 506 C419 506 481 437 481 308 L481 0'],
  i: [245, 'M122 0 L122 496'],
  j: [255, 'M139 496 L139 -64 C139 -169 110 -211 31 -211 C12 -211 -4 -208 -18 -203'],
  k: [535, 'M102 0 L102 720 M461 496 L102 183 M261 322 L480 0'],
  l: [245, 'M122 0 L122 720'],
  m: [885, 'M102 0 L102 496 M102 351 C134 455 194 506 276 506 C389 506 447 438 447 314 L447 0 M447 351 C481 455 543 506 628 506 C739 506 781 438 781 314 L781 0'],
  n: [585, 'M102 0 L102 496 M102 346 C138 456 206 506 297 506 C419 506 481 437 481 308 L481 0'],
  o: [585, 'M292 506 C157 506 87 402 87 248 C87 94 157 -10 292 -10 C427 -10 498 94 498 248 C498 402 427 506 292 506 Z'],
  p: [595, 'M102 -210 L102 496 M102 364 C140 456 204 506 292 506 C429 506 500 401 500 248 C500 95 429 -10 292 -10 C204 -10 140 40 102 133'],
  q: [595, 'M493 -210 L493 496 M493 364 C455 456 391 506 303 506 C166 506 95 401 95 248 C95 95 166 -10 303 -10 C391 -10 455 40 493 133'],
  r: [365, 'M102 0 L102 496 M102 328 C141 451 207 506 293 506 C309 506 325 504 337 500'],
  s: [495, 'M412 426 C374 482 316 506 248 506 C147 506 85 453 85 379 C85 302 148 281 250 253 C352 225 416 199 416 121 C416 36 337 -10 243 -10 C164 -10 99 20 64 73'],
  t: [365, 'M137 640 L137 132 C137 29 171 -7 247 -7 C278 -7 306 0 331 13 M42 490 L326 490'],
  u: [585, 'M102 496 L102 184 C102 57 164 -10 285 -10 C377 -10 445 40 481 150 M481 496 L481 0'],
  v: [515, 'M60 496 L257 0 L455 496'],
  w: [765, 'M60 496 L213 0 L382 455 L551 0 L705 496'],
  x: [515, 'M72 496 L443 0 M443 496 L72 0'],
  y: [515, 'M60 496 L257 0 M455 496 L241 -69 C200 -177 164 -211 101 -211 C79 -211 60 -207 43 -201'],
  z: [495, 'M77 496 L420 496 L72 0 L427 0'],
  '0': [600, 'M300 691 C151 691 94 553 94 340 C94 127 151 -11 300 -11 C449 -11 506 127 506 340 C506 553 449 691 300 691 Z'],
  '1': [410, 'M63 546 L237 680 L237 0 M94 0 L375 0'],
  '2': [575, 'M83 554 C111 647 183 691 289 691 C407 691 487 616 487 509 C487 409 418 351 318 261 L84 0 L507 0'],
  '3': [575, 'M91 607 C135 662 201 691 287 691 C405 691 480 625 480 528 C480 429 411 365 299 354 L233 354 M299 354 C426 354 502 282 502 180 C502 66 415 -11 288 -11 C195 -11 119 24 77 87'],
  '4': [600, 'M426 0 L426 680 L73 206 L540 206'],
  '5': [575, 'M488 680 L132 680 L109 370 C156 400 213 417 276 417 C414 417 494 336 494 207 C494 77 409 -11 283 -11 C191 -11 121 22 78 87'],
  '6': [600, 'M486 623 C444 668 391 691 319 691 C158 691 92 536 92 307 C92 94 178 -11 307 -11 C438 -11 512 86 512 211 C512 332 439 415 317 415 C211 415 136 353 95 259'],
  '7': [545, 'M60 680 L489 680 L216 0'],
  '8': [600, 'M300 354 C178 354 105 423 105 523 C105 629 184 691 300 691 C416 691 495 629 495 523 C495 423 422 354 300 354 Z M300 354 C164 354 88 282 88 178 C88 60 177 -11 300 -11 C423 -11 512 60 512 178 C512 282 436 354 300 354 Z'],
  '9': [600, 'M114 57 C156 12 209 -11 281 -11 C442 -11 508 144 508 373 C508 586 422 691 293 691 C162 691 88 594 88 469 C88 348 161 265 283 265 C389 265 464 327 505 421'],
  '.': [245, ''], ',': [245, 'M132 58 C132 -11 118 -55 83 -95'],
  ':': [245, ''], ';': [245, 'M132 58 C132 -11 118 -55 83 -95'],
  '!': [270, 'M135 680 L135 175'],
  '?': [530, 'M81 564 C103 646 174 691 271 691 C375 691 451 629 451 532 C451 440 388 397 323 345 C272 305 258 268 258 189'],
  '-': [375, 'M68 255 L307 255'], '_': [530, 'M34 -109 L496 -109'],
  '+': [590, 'M295 496 L295 38 M65 267 L525 267'],
  '=': [590, 'M65 367 L525 367 M65 167 L525 167'],
  '/': [405, 'M48 -100 L357 740'], '\\': [405, 'M48 740 L357 -100'],
  '|': [250, 'M125 740 L125 -170'],
  '(': [345, 'M279 765 C60 556 60 155 279 -95'],
  ')': [345, 'M66 765 C285 556 285 155 66 -95'],
  '[': [335, 'M276 735 L119 735 L119 -75 L276 -75'],
  ']': [335, 'M59 735 L216 735 L216 -75 L59 -75'],
  '{': [390, 'M321 735 C177 735 187 655 187 536 L187 440 C187 365 146 330 76 330 C146 330 187 295 187 220 L187 124 C187 5 177 -75 321 -75'],
  '}': [390, 'M69 735 C213 735 203 655 203 536 L203 440 C203 365 244 330 314 330 C244 330 203 295 203 220 L203 124 C203 5 213 -75 69 -75'],
  '<': [550, 'M468 496 L87 255 L468 14'], '>': [550, 'M82 496 L463 255 L82 14'],
  "'": [210, 'M105 700 L105 492'], '"': [350, 'M100 700 L100 492 M250 700 L250 492'],
  '`': [320, 'M104 732 L236 617'], '^': [520, 'M78 365 L260 680 L442 365'],
  '~': [560, 'M67 220 C148 375 353 115 493 280'],
  '*': [430, 'M215 715 L215 375 M63 631 L366 457 M63 457 L366 631'],
  '#': [630, 'M238 700 L150 -20 M488 700 L400 -20 M75 461 L580 461 M48 218 L553 218'],
  '%': [780, 'M123 0 L657 680 M192 690 C53 690 53 411 192 411 C331 411 331 690 192 690 Z M588 269 C449 269 449 -10 588 -10 C727 -10 727 269 588 269 Z'],
  '&': [700, 'M621 0 L189 464 C110 554 159 691 284 691 C406 691 455 551 352 461 L171 305 C12 165 107 -11 276 -11 C442 -11 536 163 572 321'],
  '@': [940, 'M762 50 C683 -20 583 -49 465 -49 C215 -49 93 110 93 332 C93 568 247 707 473 707 C700 707 847 582 847 378 C847 240 789 156 709 156 C652 156 626 190 636 263 L673 493 M652 375 C633 463 581 508 506 508 C394 508 334 408 334 291 C334 198 389 151 460 151 C545 151 607 212 636 303'],
  '$': [620, 'M529 586 C494 656 420 691 318 691 C204 691 100 635 100 524 C100 416 200 389 321 351 C448 312 533 280 533 168 C533 51 429 -11 310 -11 C196 -11 117 32 72 114 M305 775 L305 -92'],
};

function polygon(path: any, points: Point[]) {
  if (!points.length) return;
  path.moveTo(...points[0]);
  for (const point of points.slice(1)) path.lineTo(...point);
  path.close();
}
function dot(path: any, x: number, y: number, r: number) {
  polygon(path, Array.from({ length: 40 }, (_, i) => {
    const a = -i * Math.PI / 20;
    return [x + Math.cos(a) * r, y + Math.sin(a) * r] as Point;
  }));
}
function outline(data: string, weight: number, constantJoins = false, alignBaseline = false) {
  const path = new opentype.Path();
  const tokens = data.match(/[MLCZ]|-?\d+(?:\.\d+)?/g) ?? [];
  let points: Point[] = [], i = 0;
  function flushRaw(closed = false) {
    if (points.length < 2) { points = []; return; }
    if (closed && Math.hypot(points[0][0] - points.at(-1)![0], points[0][1] - points.at(-1)![1]) < .01) points.pop();
    const normal = (a: Point, b: Point): Point => {
      const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
      return [-dy / len, dx / len];
    };
    // Clamping a miter at acute diagonal reversals distorts the whole joint
    // (pinched inner valley, spiked outer edge), starving V/Y/v/w of ink.
    // Construct these diagonal letters from constant-width strokes with round
    // joins, like the wide capitals below.
    if (constantJoins) {
      for (let j = 0; j < points.length - 1; j++) {
        const a = points[j], b = points[j + 1], n = normal(a, b);
        const x = n[0] * weight / 2, y = n[1] * weight / 2 * .94;
        polygon(path, [[a[0] + x, a[1] + y], [b[0] + x, b[1] + y],
          [b[0] - x, b[1] - y], [a[0] - x, a[1] - y]]);
      }
      for (const [x, y] of points.slice(1, -1)) dot(path, x, y, weight / 2);
      points = [];
      return;
    }
    const side = (sign: number): Point[] => points.map((p, j) => {
      const previous = points[j - 1] ?? (closed ? points.at(-1)! : p);
      const next = points[j + 1] ?? (closed ? points[0] : p);
      const a = j === 0 && !closed ? normal(p, next) : normal(previous, p);
      const b = j === points.length - 1 && !closed ? a : normal(p, next);
      const denominator = Math.max(.4, 1 + a[0] * b[0] + a[1] * b[1]);
      return [p[0] + sign * weight / 2 * (a[0] + b[0]) / denominator,
        p[1] + sign * weight / 2 * .94 * (a[1] + b[1]) / denominator];
    });
    if (closed) { polygon(path, side(1)); polygon(path, side(-1).reverse()); }
    else polygon(path, [...side(1), ...side(-1).reverse()]);
    points = [];
  }
  function flush(closed = false) {
    const start = path.commands.length;
    const skeletonBottom = Math.min(...points.map(p => p[1]));
    // Cap tops: a centerline at y=680 is not a cap line. Horizontal bars land
    // their edge at 680 + hw*.94, but vertical stems end in butt caps at 680
    // and diagonal caps land short by |dx|/len*hw*.94 (H/I/L/U/J sit a full
    // half-stroke low). Lift open-contour endpoints to the bar edge of THIS
    // weight so every cap shares one line; the target must stay
    // weight-relative (a fixed target would pin Bold stems below Bold bars).
    // Round bowls keep their ~11 overshoot above the line; closed loops stay.
    if (alignBaseline && !closed && points.length >= 2) {
      const capEdge = 680 + weight / 2 * .94;
      for (const [idx, other] of [[0, 1], [points.length - 1, points.length - 2]] as const) {
        const [x, y] = points[idx];
        if (y !== 680) continue;
        const [ox, oy] = points[other];
        const len = Math.hypot(ox - x, oy - y) || 1;
        points[idx] = [x, capEdge - (Math.abs(ox - x) / len) * weight / 2 * .94];
      }
    }
    flushRaw(closed);
    // A centerline at y=0 is not a baseline: expanding a horizontal stroke
    // pushes its bottom below zero, unlike a vertical stem. Anchor each
    // baseline-bearing contour independently, keeping descenders untouched.
    // Round bowls retain their original 10–11 unit optical overshoot.
    if (!alignBaseline || skeletonBottom < -12 || skeletonBottom > 5) return;
    const commands = path.commands.slice(start).filter(c => c.type !== 'Z');
    const bottom = Math.min(...commands.map(c => c.y));
    const target = Math.min(0, skeletonBottom);
    const anchor = 180;
    for (const command of commands) {
      if (command.y < anchor)
        command.y = target + (command.y - bottom) * (anchor - target) / (anchor - bottom);
    }
  }
  const point = (): Point => [Number(tokens[i++]), Number(tokens[i++])];
  while (i < tokens.length) {
    const command = tokens[i++];
    if (command === 'M') { flush(); points.push(point()); }
    else if (command === 'L') points.push(point());
    else if (command === 'C') {
      const start = points.at(-1)!, a = point(), b = point(), end = point();
      for (let step = 1; step <= 32; step++) {
        const t = step / 32, u = 1 - t;
        points.push([u ** 3 * start[0] + 3 * u * u * t * a[0] + 3 * u * t * t * b[0] + t ** 3 * end[0],
          u ** 3 * start[1] + 3 * u * u * t * a[1] + 3 * u * t * t * b[1] + t ** 3 * end[1]]);
      }
    } else if (command === 'Z') flush(true);
    else throw new Error(`Unexpected drawing command ${command}`);
  }
  flush();
  return path;
}
const run = (args: string[]) => {
  const result = spawnSync(args[0], args.slice(1), { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`${args[0]}: ${result.stderr || result.error}`);
};
const name = (cp: number) => `uni${cp.toString(16).padStart(4, '0').toUpperCase()}`;
for (const [style, weightClass, stroke] of [['Regular', 400, 65], ['Medium', 500, 80], ['SemiBold', 600, 95], ['Bold', 700, 112]] as const) {
  const glyphs: any[] = [];
  const byCharacter = new Map<string, any>();
  const add = (character: string, width: number, path: any) => {
    const glyph = new opentype.Glyph({ name: name(character.codePointAt(0)!), unicode: character.codePointAt(0), advanceWidth: width, path });
    glyphs.push(glyph); byCharacter.set(character, glyph);
  };
  glyphs.push(new opentype.Glyph({ name: '.notdef', advanceWidth: 600, path: outline('M100 0 L100 680 L500 680 L500 0 L100 0 Z M100 0 L500 680', stroke) }));
  add(' ', 260, new opentype.Path());
  for (const [ch, [width, data]] of Object.entries(drawings)) {
    // Acute diagonal joints (A/M/N/W/V/Y/v/w) need more ink + round joins to
    // match H/O: miters spike the A apex (+33) and starve V of ink. Sharp
    // single corners spike too (1 flag +30, 4 corner +15), so 1/4 get round
    // joins at base weight to keep digits optically even.
    const BUMP = 'AMNWVYvw';
    const ROUND = BUMP + '14';
    const path = outline(data, stroke * (BUMP.includes(ch) ? 1.06 : 1), ROUND.includes(ch), /^[A-Za-z0-9]$/.test(ch));
    if ('ij'.includes(ch)) dot(path, ch === 'i' ? 122 : 139, 646, stroke * .62);
    if ('.:;!?'.includes(ch)) dot(path, ch === '?' ? 258 : width / 2, 31, stroke * .65);
    if (':;'.includes(ch)) dot(path, width / 2, 369, stroke * .65);
    add(ch, width, path);
  }
  for (let cp = 0xc0; cp <= 0xff; cp++) {
    const ch = String.fromCodePoint(cp), [base, accent] = [...ch.normalize('NFD')];
    if (!accent || !byCharacter.has(base)) continue;
    const original = byCharacter.get(base), path = new opentype.Path();
    // Dotless i under accents; l and i retain deliberately different ascenders.
    path.extend(base === 'i' ? outline(drawings.i[1], stroke).commands : original.path.commands);
    const cx = original.advanceWidth / 2, top = base === base.toUpperCase() ? 811 : 641;
    const accents: Record<string, string> = {
      '\u0300': `M${cx - 68} ${top + 59} L${cx + 45} ${top - 36}`,
      '\u0301': `M${cx - 45} ${top - 36} L${cx + 68} ${top + 59}`,
      '\u0302': `M${cx - 109} ${top - 30} L${cx} ${top + 54} L${cx + 109} ${top - 30}`,
      '\u0303': `M${cx - 118} ${top - 16} C${cx - 48} ${top + 88} ${cx + 44} ${top - 89} ${cx + 118} ${top + 20}`,
      '\u0327': `M${cx + 13} -18 L${cx - 17} -81 C${cx + 104} -64 ${cx + 87} -196 ${cx - 45} -162`,
    };
    if (accents[accent]) path.extend(outline(accents[accent], stroke * .8).commands);
    else if (accent === '\u0308') { dot(path, cx - 85, top, stroke * .57); dot(path, cx + 85, top, stroke * .57); }
    else if (accent === '\u030a') path.extend(outline(`M${cx} ${top + 79} C${cx - 90} ${top + 79} ${cx - 90} ${top - 49} ${cx} ${top - 49} C${cx + 90} ${top - 49} ${cx + 90} ${top + 79} ${cx} ${top + 79} Z`, stroke * .65).commands);
    else continue;
    add(ch, original.advanceWidth, path);
  }
  const extras: Record<string, Drawing> = {
    '–': [600, 'M45 255 L555 255'], '—': [940, 'M45 255 L895 255'],
    '−': [590, 'M65 267 L525 267'], '×': [590, 'M115 447 L475 87 M475 447 L115 87'],
    '→': [900, 'M70 310 L797 310 M535 561 L797 310 L535 59'],
    '←': [900, 'M830 310 L103 310 M365 561 L103 310 L365 59'],
    '↑': [590, 'M295 0 L295 680 M55 440 L295 680 L535 440'],
    '↓': [590, 'M295 680 L295 0 M55 240 L295 0 L535 240'],
    '‘': [230, 'M142 731 C100 669 95 622 103 572'], '’': [230, 'M127 731 C135 681 130 634 88 572'],
    '“': [390, 'M142 731 C100 669 95 622 103 572 M302 731 C260 669 255 622 263 572'],
    '”': [390, 'M127 731 C135 681 130 634 88 572 M287 731 C295 681 290 634 248 572'],
    '°': [365, 'M182 709 C30 709 30 478 182 478 C334 478 334 709 182 709 Z'],
  };
  for (const [ch, [width, data]] of Object.entries(extras)) add(ch, width, outline(data, stroke));
  for (const [ch, positions] of [['…', [110, 310, 510]], ['·', [122]], ['•', [190]]] as const) {
    const path = new opentype.Path();
    for (const x of positions) dot(path, x, ch === '…' ? 31 : 267, stroke * (ch === '•' ? 1.2 : .65));
    add(ch, ch === '…' ? 620 : ch === '•' ? 380 : 245, path);
  }
  add('\u00a0', 260, new opentype.Path());
  const copyright = outline('M390 697 C-15 697 -15 -17 390 -17 C795 -17 795 697 390 697 Z M524 467 C419 579 263 499 263 340 C263 181 419 101 524 213', stroke * .72);
  add('©', 780, copyright);
  const font = new opentype.Font({ familyName: 'Aroli Sans', styleName: style, weightClass, unitsPerEm: 1000, ascender: 980, descender: -270, glyphs,
    copyright: 'Copyright 2026 Eduardo Augusto Lima Bueno. All rights reserved.',
    description: 'Original Aroli proportional sans. Prototype 0.1. No third-party text outlines.',
    license: 'Proprietary. See repository LICENSE.', version: 'Version 0.100',
  });
  font.tables.os2.usWeightClass = weightClass;
  font.tables.os2.sTypoAscender = 980;
  font.tables.os2.sTypoDescender = -270;
  font.tables.os2.sTypoLineGap = 0;
  font.tables.os2.usWinAscent = 980;
  font.tables.os2.usWinDescent = 270;
  font.tables.os2.sxHeight = 526;
  font.tables.os2.sCapHeight = 710;
  const file = join(out, `AroliSans-${style}.otf`);
  writeFileSync(file, Buffer.from(font.toArrayBuffer()));
  // GPOS is consumed by both browsers and HarfBuzz, unlike JS-only kerning.
  const pairs: [string, string, number][] = [['A', 'V', -48], ['A', 'W', -30], ['A', 'Y', -48], ['A', 'T', -35], ['T', 'a', -55], ['T', 'e', -55], ['T', 'o', -55], ['T', 'r', -32], ['V', 'a', -38], ['V', 'o', -38], ['W', 'a', -25], ['Y', 'a', -60], ['Y', 'o', -60], ['F', 'o', -30], ['L', 'T', -35], ['L', 'Y', -40], ['r', '.', -25], ['A', 'r', -12]];
  const features = 'languagesystem DFLT dflt;\nlanguagesystem latn dflt;\nfeature kern {\n' + pairs.flatMap(([left, right, value]) => {
    const variants = (base: string) => [...byCharacter.keys()].filter(ch => ch.normalize('NFD')[0] === base);
    return variants(left).flatMap(l => variants(right).map(r => `pos ${name(l.codePointAt(0)!)} ${name(r.codePointAt(0)!)} ${value};`));
  }).join('\n') + '\n} kern;\n';
  const fea = join(out, 'kerning.fea');
  writeFileSync(fea, features);
  run(['fonttools', 'feaLib', '-o', file, fea, file]);
  run(['fonttools', 'ttLib.woff2', 'compress', file, '-o', file.replace('.otf', '.woff2')]);
  console.log(`${style}: ${glyphs.length} glyphs, original outlines + GPOS kerning`);
}
