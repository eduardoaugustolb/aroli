# Instalar o Umbra Cursor

## 1. Gerar e instalar o tema

Na raiz do repositório:

```sh
make -C themes/cursor/umbra build
mkdir -p ~/.local/share/icons
cp -r themes/cursor/umbra ~/.local/share/icons/Umbra
```

O diretório final precisa conter `index.theme` e `cursors/`. Não renomeie
`Umbra`: os exemplos abaixo usam esse nome.

Para gerar localmente, instale librsvg, ImageMagick, um compilador C e headers
de libXcursor. No Arch/Omarchy:

```sh
sudo pacman -S --needed librsvg imagemagick libxcursor base-devel
```

Em distribuição que já ofereça o tema compilado, copie somente a pasta
`Umbra` para `~/.local/share/icons/`.

## 2. Escolher o ambiente

Use uma única seção correspondente à sessão atual e termine a sessão ou reinicie
os aplicativos já abertos. `32` é o tamanho padrão; escolha `24` ou `48`
quando a escala do monitor exigir.

### GNOME e apps GTK

```sh
gsettings set org.gnome.desktop.interface cursor-theme 'Umbra'
gsettings set org.gnome.desktop.interface cursor-size 32
```

Abra **Configurações → Aparência** para confirmar. A mudança é por usuário e
normalmente exige relogar para alcançar todos os processos já iniciados.

### KDE Plasma

Abra **Configurações do Sistema → Aparência → Cursores**, selecione **Umbra**,
escolha o tamanho e clique em **Aplicar**. O Plasma também aceita instalação de
um arquivo de tema nessa tela, mas a pasta já copiada deve aparecer na lista.

### Hyprland

Umbra é um tema XCursor. Em instalações atuais com UWSM, crie ou atualize
`~/.config/uwsm/env`:

```sh
export XCURSOR_THEME=Umbra
export XCURSOR_SIZE=32
```

Se a sessão usa a configuração Lua do Hyprland sem UWSM, defina antes do
servidor iniciar:

```lua
hl.env("XCURSOR_THEME", "Umbra")
hl.env("XCURSOR_SIZE", "32")
```

Relogue depois da alteração. Não defina `HYPRCURSOR_THEME`: Umbra não é um
tema hyprcursor. O Hyprland usa o fallback XCursor quando não há hyprcursor.

### Sway

Em `~/.config/sway/config`:

```text
seat seat0 xcursor_theme Umbra 32
```

Recarregue a configuração com `swaymsg reload`. Para descobrir o seat quando
`seat0` não funcionar, use `swaymsg -t get_seats`; `seat *` aplica a todos.

### XFCE, Cinnamon, MATE e sessões X11

Selecione **Umbra** no painel de aparência do ambiente. Para aplicativos GTK
que não acompanhem a seleção, exporte antes de iniciar a sessão:

```sh
export XCURSOR_THEME=Umbra
export XCURSOR_SIZE=32
```

Coloque essas linhas no mecanismo de inicialização da sua sessão, não em
`/etc/environment`; isso evita vazar uma escolha de sessão para todos os
usuários e tipos de login.

## Flatpak e apps isolados

Apps em sandbox podem não enxergar `~/.local/share/icons`. Prefira instalar o
tema também em um local compartilhado pela sandbox ou conceder acesso somente
ao diretório de ícones necessário. Confira o comportamento no aplicativo alvo;
não use overrides amplos sem necessidade.

## Diagnóstico

- Confirme `~/.local/share/icons/Umbra/index.theme`.
- Verifique se `~/.local/share/icons/Umbra/cursors/default` existe.
- Feche e abra novamente o aplicativo que mantém o cursor anterior.
- Em Wayland, configure o compositor e, se necessário, o toolkit do aplicativo.
- O aplicativo escolhe estados como `grab`, `grabbing`, `copy` e
  `no-drop`; o tema não consegue forçar uma transição.

## Fontes

- [GTK: configurações de tema e tamanho do cursor](https://gnome.pages.gitlab.gnome.org/gtk/gtk4/class.Settings.html)
- [Hyprland: variáveis de ambiente](https://wiki.hypr.land/Configuring/Advanced-and-Cool/Environment-variables/)
- [Hyprland: fallback XCursor](https://wiki.hypr.land/0.37.0/Hypr-Ecosystem/hyprcursor/)
- [Sway: configuração de seat e XCursor](https://man.archlinux.org/man/sway-input.5)
- [KDE Plasma: selecionar tema e tamanho](https://docs.kde.org/stable_kf6/en/plasma-workspace/kcontrol/cursortheme/)
