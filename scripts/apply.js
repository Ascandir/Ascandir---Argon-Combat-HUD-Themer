/**
 * Erzeugt aus einem Theme CSS und hängt es als <style> in die Seite.
 * Argon setzt seine Farben als Inline-Variablen auf <html>; Werte mit
 * !important in einem Stylesheet haben Vorrang davor, daher bleibt Argons
 * eigener Editor unangetastet und greift wieder, sobald kein Themer-Theme aktiv ist.
 */
import { MODULE_ID } from "./schema.js";

const STYLE_ID = `${MODULE_ID}-active-theme`;
const HUD = ".extended-combat-hud";

/** Entfernt alles, was aus einem <style>-Block ausbrechen könnte. */
function safeCss(text) {
  return String(text ?? "").replace(/<\/?style/gi, "");
}

function fontStack(font) {
  const clean = String(font).replace(/["\\;{}]/g, "").trim();
  return `"${clean}", var(--font-primary, "Signika"), sans-serif`;
}

export function buildThemeCss(theme) {
  if (!theme) return "";
  const { colors, extras, style } = theme;
  const out = [];

  // 1) Argon-Variablen
  const vars = Object.entries(colors).map(([k, v]) => `  --ech-${k}: ${v} !important;`);
  if (style.font) vars.push(`  --ech-font-family: ${fontStack(style.font)} !important;`);
  out.push(`:root {\n${vars.join("\n")}\n}`);

  // 2) Fest verdrahtete Argon-Farben
  out.push(`
${HUD} .portrait-hud .portrait-stat-block [data-ac-value]:after,
${HUD} .portrait-hud .portrait-stat-block [data-spell-dc]:after,
${HUD} .portrait-hud .portrait-stat-block span[style*="movement-baseMovement-background"],
${HUD} .movement-hud .movement-current { color: ${extras.accent} !important; }
${HUD} .portrait-hud .portrait-stat-block span[style*="rgb(0, 255, 170)"] { color: ${extras.hp} !important; }
${HUD} .portrait-hud .portrait-stat-block span[style*="rgb(255, 255, 255)"] { color: ${extras.statText} !important; }
${HUD} .portrait-hud .portrait-stat-block span[style*="rgb(255, 255, 255)"] { color: ${extras.statText} !important; }

${HUD} .actions-container.has-actions:after,
${HUD} .actions-container .action-pip,
${HUD} .feature-spell-slots .spell-slot.spell-available {
  background-color: ${extras.pip} !important;
  box-shadow: 0 0 10px 0 ${extras.pipGlow} !important;
}
${HUD} .actions-container.has-actions.actions-used:after,
${HUD} .actions-container .action-pip.actions-used,
${HUD} .feature-spell-slots .spell-slot.spell-used {
  background-color: ${extras.pipUsed} !important;
  box-shadow: none !important;
}
${HUD} .feature-spell-slots .spell-slot.spell-cantrip { color: ${extras.pip} !important; }

${HUD} .portrait-hud .portrait-stat-block,
${HUD} .portrait-hud .player-button,
${HUD} .weapon-sets .weapon-set { color: ${extras.statText} !important; }
${HUD} .portrait-hud .player-button:hover { color: ${colors["mainAction-hover-color"]} !important; }

${HUD} .portrait-hud .portrait-stat-block:not(.player-details):before,
${HUD} .portrait-hud .player-button:before,
${HUD} .weapon-sets .weapon-set { background-color: ${extras.statBackground} !important; }

${HUD} .actions-container:before,
${HUD} .feature-accordion-title,
${HUD} .movement-hud { color: ${extras.panelText} !important; }`);

  // 3) Schriftgröße
  if (style.fontScale !== 100) {
    const f = (style.fontScale / 100).toFixed(2);
    out.push(`
${HUD} .action-element-title,
${HUD} .feature-element-title,
${HUD} .feature-accordion-title,
${HUD} .portrait-stat-block,
${HUD} .player-button,
${HUD} .movement-hud,
${HUD} .actions-container:before { font-size: calc(1em * ${f}) !important; }
${HUD} .ability-menu ul { font-size: calc(1rem * ${f}) !important; }
${HUD} .portrait-hud .player-details .player-name { font-size: calc(1.15em * ${f}) !important; font-weight: 700; }
.ech-tooltip { font-size: calc(16px * ${f}) !important; }`);
  }

  // 4) Form: Ecken & Rahmen
  const r = `${style.radius}px`;
  out.push(`
${HUD} .action-element,
${HUD} .button-hud-button,
${HUD} .feature-element,
${HUD} .feature-accordion-title,
${HUD} .feature-spell-slots,
${HUD} .actions-container:before,
${HUD} .weapon-sets .weapon-set,
${HUD} .portrait-hud .player-button,
${HUD} .portrait-hud .player-button:before,
${HUD} .portrait-hud .portrait-stat-block:not(.player-details),
${HUD} .portrait-hud .portrait-stat-block:not(.player-details):before,
${HUD} .movement-hud,
${HUD} .ability-menu:before { border-radius: ${r} !important; }
${HUD} .portrait-hud,
${HUD} .portrait-hud .portrait-hud-image { border-radius: ${r} !important; }
.ech-tooltip { border-radius: ${r} !important; }

${HUD} .action-element,
${HUD} .button-hud-button,
${HUD} .weapon-sets .weapon-set,
${HUD} .portrait-hud .player-button,
${HUD} .movement-hud,
${HUD} .actions-container:before { border-width: ${style.borderWidth}px !important; border-style: solid !important; }`);

  if (style.portraitFrame) {
    out.push(`
${HUD} .portrait-hud {
  border: ${Math.max(1, style.borderWidth)}px solid ${colors["portrait-base-border"]} !important;
  box-shadow: 0 0 ${Math.max(6, style.glowSize)}px ${colors["portrait-base-border"]}, inset 0 0 18px #000000aa !important;
}`);
  }

  // 5) Effekte
  if (style.hoverGlow) {
    out.push(`
${HUD} .action-element:hover,
${HUD} .action-element.active,
${HUD} .button-hud-button:hover,
${HUD} .feature-element:hover,
${HUD} .portrait-hud .player-button:hover,
${HUD} .weapon-sets .weapon-set:hover {
  box-shadow: 0 0 ${style.glowSize}px ${style.glowColor}, inset 0 0 ${Math.round(style.glowSize / 2)}px ${style.glowColor} !important;
  transition: box-shadow 0.2s ease-in-out;
}`);
  }
  if (style.textShadow) {
    out.push(`
${HUD} .action-element-title,
${HUD} .feature-element-title,
${HUD} .feature-accordion-title,
${HUD} .portrait-stat-block,
${HUD} .player-button,
${HUD} .weapon-set,
${HUD} .movement-hud,
${HUD} .actions-container:before { text-shadow: 0 0 4px #000000, 0 1px 2px #000000 !important; }`);
  }

  // 6) Texturen & Rahmenbilder
  out.push(buildTextureCss(theme));

  // 7) Layout-Ausgleich für dickere Rahmen
  out.push(buildLayoutFixCss(theme));

  // 8) Zusatz-Funktionen (Icons, Menü, Punkte, Titelstreifen)
  out.push(buildFeatureCss(theme));

  // 9) Eigenes CSS
  if (theme.customCss?.trim()) out.push(`/* Eigenes CSS */\n${safeCss(theme.customCss)}`);

  return `/* ${MODULE_ID}: ${String(theme.name).replace(/\*\//g, "")} */\n${out.join("\n")}`;
}

/** Pfad -> url("..."). Relative Pfade (z. B. modules/…) lösen sich gegen die Foundry-Adresse auf. */
function cssUrl(path) {
  if (!path) return "none";
  let href = String(path);
  try { href = new URL(href, document.baseURI).href; } catch { /* Pfad unverändert */ }
  return `url("${href.replace(/["\\]/g, "")}")`;
}

function buildTextureCss({ textures: t, style }) {
  const out = [];
  if (t.panel) {
    out.push(`
${HUD} .ability-menu:before,
${HUD} .actions-container:before,
${HUD} .movement-hud,
${HUD} .feature-accordion-title,
${HUD} .feature-spell-slots,
${HUD} .portrait-hud .portrait-stat-block:not(.player-details):before,
${HUD} .portrait-hud .player-button:before,
${HUD} .weapon-sets .weapon-set {
  background-image: ${cssUrl(t.panel)} !important;
  background-size: ${t.panelSize}px !important;
  background-repeat: repeat !important;
}`);
  }
  if (t.tooltip) {
    out.push(`
.ech-tooltip {
  background-image: ${cssUrl(t.tooltip)} !important;
  background-size: 100% 100% !important;
  background-repeat: no-repeat !important;
}
.ech-tooltip .ech-tooltip-header { backdrop-filter: none !important; }
.ech-highjack-window .window-header,
.ech-highjack-window .window-content {
  background-image: ${cssUrl(t.tooltip)} !important;
  background-size: 100% 100% !important;
}`);
  }
  if (t.frame) {
    const w = `${t.frameWidth}px`;
    out.push(`
${HUD} .portrait-hud,
${HUD} .ability-menu:before,
.ech-tooltip {
  border-style: solid !important;
  border-width: ${w} !important;
  border-image: ${cssUrl(t.frame)} ${t.frameSlice} / ${w} / 0 stretch !important;
  border-radius: 0 !important;
}`);
  }
  if (t.buttonFrame) {
    const w = `${t.buttonFrameWidth}px`;
    out.push(`
${HUD} .action-element,
${HUD} .button-hud-button,
${HUD} .feature-element,
${HUD} .actions-container:before,
${HUD} .movement-hud,
${HUD} .weapon-sets .weapon-set,
${HUD} .portrait-hud .player-button,
${HUD} .portrait-hud .portrait-stat-block:not(.player-details) {
  border-style: solid !important;
  border-width: ${w} !important;
  border-image: ${cssUrl(t.buttonFrame)} ${t.buttonFrameSlice} / ${w} / 0 stretch !important;
  border-radius: 0 !important;
}`);
  }
  if (t.seal) {
    out.push(`
.ech-tooltip-container::after {
  content: "";
  position: absolute;
  top: -18px;
  right: -16px;
  width: 52px;
  height: 66px;
  background: ${cssUrl(t.seal)} center / contain no-repeat;
  pointer-events: none;
  z-index: 10001;
  filter: drop-shadow(0 2px 3px #000000aa);
}`);
  }
  return out.join("\n");
}

/**
 * Dickere Rahmen verkleinern die Innenfläche. Was Argon von dort aus nach außen
 * positioniert (Initiative-/Bogen-/Minimieren-Knöpfe) oder was mit fester Größe
 * gebaut ist (Quickslots), wird hier um die Mehrbreite zurückgeschoben.
 */
function buildLayoutFixCss({ textures: t, style }) {
  const out = [];
  const portraitBorder = t.frame ? t.frameWidth : style.portraitFrame ? Math.max(1, style.borderWidth) : 1;
  const extraP = portraitBorder - 1;
  if (extraP > 0) {
    out.push(`
${HUD} .portrait-hud .player-buttons {
  right: calc(-115px - ${extraP}px) !important;
  top: calc(-50px - 1rem - 37px - ${extraP}px) !important;
}
${HUD} .portrait-hud .portrait-actor-configuration { top: ${extraP}px !important; right: ${extraP}px !important; }`);
  }
  const setBorder = t.buttonFrame ? t.buttonFrameWidth : style.borderWidth;
  const extraS = Math.max(0, setBorder - 1) * 2;
  if (extraS > 0) {
    out.push(`
${HUD} .weapon-sets .weapon-set > .set {
  height: calc(50px - ${extraS}px) !important;
  min-width: calc(50px - ${extraS}px) !important;
}`);
  }
  return out.join("\n");
}

function buildFeatureCss({ style: s, textures: t, extras: x, colors: c }) {
  const out = [];
  if (s.titleStrip) {
    out.push(`
${HUD} .action-element .action-element-title,
${HUD} .feature-element .feature-element-title {
  background: linear-gradient(to bottom, transparent 0%, #000000b3 45%, #000000e6 100%) !important;
  backdrop-filter: none !important;
  border-top: none !important;
  color: ${c["mainAction-base-color"]} !important;
}`);
  }
  if (s.squarePips) {
    out.push(`
${HUD} .feature-spell-slots .spell-slot:not(.spell-cantrip) { border-radius: 3px !important; }
${HUD} .actions-container .action-pip { border-radius: 2px !important; }`);
  }
  if (s.ornateMenu) {
    out.push(`
${HUD} .ability-menu ul > li { border-top: 1px solid #00000099 !important; box-shadow: inset 0 1px 0 #ffffff0d; }
${HUD} .ability-menu ul > li.ability-title,
${HUD} .ability-menu ul.ability-toggle li {
  background: linear-gradient(to bottom, #ffffff12, #00000040) !important;
  letter-spacing: 0.06em;
  border-bottom: 2px solid ${c["abilityMenu-border"]} !important;
}
${HUD} .ability-menu ul > li:not(.ability-title) > span:not(:first-child),
${HUD} .ability-menu ul > li:not(.ability-title) > div > span {
  border-left: 1px solid #00000099;
  box-shadow: -1px 0 0 #ffffff0f;
}
${HUD} .ability-menu ul > li i.fa-check,
${HUD} .ability-menu ul > li i.fa-check-double,
${HUD} .ability-menu ul > li i.fa-adjust { color: ${x.accent} !important; }`);
    if (t.headerOrnament) {
      out.push(`
${HUD} .ability-menu ul.collapsible-panel > li.ability-title > span:first-child::after {
  content: "";
  display: inline-block;
  width: 2.6em;
  height: 1.1em;
  margin-left: 0.6em;
  vertical-align: middle;
  background: ${cssUrl(t.headerOrnament)} center / contain no-repeat;
}`);
    }
  }
  if (s.skillIcons) {
    out.push(`
${HUD} .ability-menu .asc-skill-icon {
  display: inline-block;
  width: 1.5em;
  margin-right: 0.5ch;
  text-align: center;
  color: inherit;
  opacity: 0.85;
  pointer-events: none;
}
.ech-tooltip .ech-tooltip-header .asc-skill-icon {
  margin-right: 0.5ch;
  color: ${c["tooltip-header-color"]};
}`);
  }
  return out.join("\n");
}

function styleElement(create = true) {
  let el = document.getElementById(STYLE_ID);
  if (!el && create) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    // ans Ende von <head>, damit es nach Argons Stylesheet geladen wird
    document.head.appendChild(el);
  }
  return el;
}

/** Wendet ein Theme an (oder entfernt das Themer-CSS bei null). */
export function applyTheme(theme) {
  if (!theme) {
    styleElement(false)?.remove();
    return;
  }
  const el = styleElement(true);
  el.textContent = buildThemeCss(theme);
  if (el !== document.head.lastElementChild) document.head.appendChild(el);
}

/** Schaltet das Themer-CSS kurz ab (z. B. um Argons eigene Werte auszulesen). */
export function withThemeDisabled(fn) {
  const el = styleElement(false);
  if (el) el.disabled = true;
  try {
    return fn();
  } finally {
    if (el) el.disabled = false;
  }
}
