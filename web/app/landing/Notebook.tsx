import Image from "next/image";

const KEY_ROWS = [
  ["esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "◯"],
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "−", "=", "delete"],
  ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "return"],
  ["shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "shift"],
  ["fn", "control", "option", "⌘", "space", "⌘", "option", "←", "↕", "→"],
];

function Keyboard() {
  return (
    <div className="notebook-keyboard">
      {KEY_ROWS.map((keys, row) => (
        <div className="notebook-key-row" key={row}>
          {keys.map((label, col) => (
            <i
              key={`${row}-${col}`}
              className={label === "space" ? "notebook-space-key" : undefined}
            >
              {label === "space" ? "" : label}
            </i>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Notebook() {
  return (
    <div className="continuity-surface">
      <div className="notebook">
        <div className="notebook-lid">
          <div className="notebook-camera" aria-hidden="true" />
          <div className="capture-frame notebook-display">
            <Image
              className="capture-vscode"
              src="/examples/vscode.png"
              alt="Tema Aroli no VS Code, na tela do notebook"
              fill
              sizes="(max-width: 760px) 88vw, 72vw"
              priority
            />
            <Image
              className="capture-zed"
              src="/examples/zed.png"
              alt="Tema Aroli no Zed, na tela do notebook"
              fill
              sizes="(max-width: 760px) 88vw, 72vw"
            />
            <Image
              className="capture-kitty"
              src="/examples/kitty.png"
              alt="Tema Aroli no Kitty, na tela do notebook"
              fill
              sizes="(max-width: 760px) 88vw, 72vw"
            />
          </div>
        </div>
        <div className="notebook-base" aria-hidden="true">
          <div className="notebook-hinge" />
          <div className="notebook-speaker notebook-speaker-left" />
          <Keyboard />
          <div className="notebook-speaker notebook-speaker-right" />
          <div className="notebook-trackpad" />
          <div className="notebook-front" />
        </div>
      </div>
    </div>
  );
}
