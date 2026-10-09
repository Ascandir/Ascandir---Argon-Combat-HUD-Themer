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
${HUD} .actions-container:before { font-size: calc(1em * ${f}) !important; }`);
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
${HUD} .weapon-sets .weapon-set:before,
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

  // 7) Eigenes CSS
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
