// Original production redraw of the approved ImageGen storyboard, 2026-09-20.
// Two filled masses; every size and product consumes this same geometry.
export const BODY =
  "M96 40 C100 40 102 43 102 49 C102 77 122 95 148 96 C155 96 157 101 156 109 C150 146 126 160 91 160 C53 160 26 137 26 102 C26 68 54 42 88 40 Z";
export const PIECE =
  "M122 25 C144 30 164 49 169 70 C171 80 162 87 153 82 C147 68 133 54 116 49 C107 46 106 39 110 32 C113 27 118 24 122 25 Z";
export const mark = (fill = "#C5C7C5") =>
  `<g fill="${fill}"><path d="${BODY}"/><path d="${PIECE}"/></g>`;
