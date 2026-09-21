import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { REPO } from "./content";

const PROJECT_LINKS = [
  { label: "Documentação", href: `${REPO}#readme` },
  { label: "GitHub", href: REPO },
  { label: "Licença", href: `${REPO}/blob/main/LICENSE` },
];

export function SiteFooter() {
  return (
    <footer>
      <a className="wordmark" href="#inicio">
        <img src="/aroli-lockup.svg" width="140" height="40" alt="Aroli" />
      </a>
      <p>
        Tudo encontra seu lugar. Temas, tipografia, ponteiros e fundos
        para um ambiente que se adapta a você.
      </p>
      <nav aria-label="Links do projeto">
        {PROJECT_LINKS.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}{" "}
            <ArrowUpRightIcon size={11} aria-hidden="true" />
          </a>
        ))}
      </nav>
      <span className="footer-note">UM AMBIENTE EM CONSTRUÇÃO / 2026</span>
    </footer>
  );
}
