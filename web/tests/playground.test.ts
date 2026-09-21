import { test } from "node:test";
import assert from "node:assert/strict";
import { CursorShake } from "../app/aroli-cursor";
import {
  INITIAL_WORKSPACE,
  execute,
  resolvePath,
  runDemo,
} from "../app/landing/mock-workspace";

test("rapid reversals find the cursor; slow movement and a sweep do not", () => {
  const shake = new CursorShake();
  const shakes = [100, 180, 100, 180, 100, 180].map((x, i) =>
    shake.sample(x, 100, 1000 + i * 50),
  );
  assert(shakes.includes(true));
  shake.reset();
  assert.equal(
    [100, 180, 100, 180, 100, 180].some((x, i) =>
      shake.sample(x, 100, 1000 + i * 250),
    ),
    false,
  );
  shake.reset();
  assert.equal(
    [100, 180, 260, 340, 420, 500].some((x, i) =>
      shake.sample(x, 100, 1000 + i * 50),
    ),
    false,
  );
});
test("terminal files persist, paths normalize, and source state is immutable", () => {
  let state = execute(
    'echo "ação e espaço" > note.txt',
    INITIAL_WORKSPACE,
  ).workspace;
  assert.deepEqual(execute("cat note.txt", state).output, ["ação e espaço\n"]);
  assert.equal(INITIAL_WORKSPACE.files["/aroli/note.txt"], undefined);
  state = execute("cd docs", state).workspace;
  assert.equal(state.cwd, "/aroli/docs");
  assert.match(execute("cat ../note.txt", state).output[0], /ação/);
  assert.equal(resolvePath("/aroli", "../../../../"), "/");
  assert.match(execute("cat missing.txt", state).output[0], /Erro/);
});
test("mock runner prints edited literals, reports unsupported code, never evaluates JS", () => {
  assert.deepEqual(
    runDemo('const nome = "Aroli";\nconsole.log("Olá, " + nome);'),
    ["Olá, Aroli"],
  );
  assert.match(runDemo('fetch("https://example.com")')[0], /Erro/);
  assert.match(runDemo("console.log(missing);")[0], /desconhecida/);
  assert.deepEqual(execute("bun hello.js", INITIAL_WORKSPACE).output, [
    "Olá, Aroli",
    "Menos ruído. Mais espaço.",
  ]);
});
