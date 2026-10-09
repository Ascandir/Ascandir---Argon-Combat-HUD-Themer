/**
 * Mitgelieferte Ascandir-Themes. Sie sind schreibgeschützt;
 * zum Anpassen im Editor "Duplizieren" verwenden.
 */
import { MODULE_ID, defaultTheme, normalizeTheme } from "./schema.js";

const ASSETS = `modules/${MODULE_ID}/assets`;

/** Baut aus einer kleinen Palette alle Argon-Farben. */
function palette(p) {
  const text = p.text;
  const border = p.border;
  const pair = (bg, hover, txt = text, brd = border, hoverBrd = p.hoverBorder ?? brd) => ({
    base: { background: bg, color: txt, border: brd },
    hover: { background: hover, color: p.hoverText ?? txt, border: hoverBrd },
  });
  const flat = {};
  const put = (prefix, obj) => {
    for (const [state, vals] of Object.entries(obj)) {
      for (const [prop, val] of Object.entries(vals)) flat[`${prefix}-${state}-${prop}`] = val;
    }
  };
  flat["portrait-base-background"] = p.portrait ?? p.panel;
  flat["portrait-base-color"] = text;
  flat["portrait-base-border"] = p.portraitBorder ?? border;
  flat["mainAction-background-color"] = p.container;
  put("mainAction", pair(p.panel, p.panelHover));
  put("bonusAction", pair(p.bonus, p.bonusHover));
  put("freeAction", pair(p.free, p.freeHover));
  put("reaction", pair(p.reaction, p.reactionHover));
  put("endTurn", pair(p.endTurn, p.endTurnHover));
  Object.assign(flat, {
    "tooltip-header-background": p.ttHeader,
    "tooltip-header-color": p.ttHeaderText,
    "tooltip-header-border": border,
    "tooltip-subtitle-background": p.ttSubtitle,
    "tooltip-subtitle-color": p.ttSubtitleText,
    "tooltip-subtitle-border": border,
    "tooltip-body-background": p.ttBody,
    "tooltip-body-color": p.ttBodyText,
    "tooltip-body-border": border,
    "abilityMenu-background": p.panel,
    "abilityMenu-color": text,
    "abilityMenu-border": border,
    "abilityMenu-base-color": text,
    "abilityMenu-base-boxShadow": p.textGlow,
    "abilityMenu-hover-color": p.hoverText ?? text,
    "abilityMenu-hover-boxShadow": p.accentGlow,
    "buttons-base-background": p.button,
    "buttons-base-color": p.buttonText,
    "buttons-base-border": p.button,
    "buttons-hover-background": p.buttonHover,
    "buttons-hover-color": p.buttonText,
    "buttons-hover-border": p.buttonHover,
    "movement-used-background": p.moveUsed,
    "movement-used-boxShadow": "#00000000",
    "movement-baseMovement-background": p.moveBase,
    "movement-baseMovement-boxShadow": p.moveBaseGlow,
    "movement-dashMovement-background": p.moveDash,
    "movement-dashMovement-boxShadow": p.moveDashGlow,
    "movement-dangerMovement-background": p.moveDanger,
    "movement-dangerMovement-boxShadow": p.moveDangerGlow,
  });
  return flat;
}

const RAW = [
  {
    id: "ascandir-schmiede",
    name: "Ascandir – Schmiede & Pergament",
    colors: palette({
      text: "#e8dcc4ff", hoverText: "#fff3dcff", border: "#8a6232ff", hoverBorder: "#e0a050ff",
      portrait: "#140e0ae6", container: "#1a120ce6",
      panel: "#1a130ef2", panelHover: "#3a2614f2",
      bonus: "#1e1530f2", bonusHover: "#3a2a58f2",
      free: "#16222af2", freeHover: "#2a4050f2",
      reaction: "#2a1320f2", reactionHover: "#4a2238f2",
      endTurn: "#1a2414f2", endTurnHover: "#2e4224f2",
      ttHeader: "#00000000", ttHeaderText: "#2a1a0cff",
      ttSubtitle: "#6b1a14ff", ttSubtitleText: "#f2e2c4ff",
      ttBody: "#00000000", ttBodyText: "#2b1d10ff",
      textGlow: "#00000099", accentGlow: "#e0a050cc",
      button: "#6b4a24ff", buttonHover: "#9a6a32ff", buttonText: "#f2e2c4ff",
      moveUsed: "#4a3d3080", moveBase: "#5ab4f0ff", moveBaseGlow: "#7ac8ffcc",
      moveDash: "#e0b040ff", moveDashGlow: "#f0c860cc", moveDanger: "#c23a2aff", moveDangerGlow: "#e05a4acc",
    }),
    extras: {
      accent: "#5ab4f0ff", hp: "#3ddc84ff", pip: "#5ab4f0ff", pipGlow: "#7ac8ffaa", pipUsed: "#3a332c99",
      statText: "#e8dcc4ff", statBackground: "#0d0906cc", panelText: "#e8dcc4ff",
    },
    style: { font: "Roboto Slab", fontScale: 100, radius: 0, borderWidth: 1, hoverGlow: true, glowColor: "#e0a050aa", glowSize: 12, textShadow: true, portraitFrame: false },
    textures: {
      panel: `${ASSETS}/forge/wood.svg`, panelSize: 256,
      tooltip: `${ASSETS}/forge/parchment.svg`,
      frame: `${ASSETS}/forge/frame-ornate.svg`, frameSlice: 40, frameWidth: 22,
      buttonFrame: `${ASSETS}/forge/frame-button.svg`, buttonFrameSlice: 12, buttonFrameWidth: 7,
      seal: `${ASSETS}/forge/seal.svg`,
    },
  },
  {
    id: "ascandir-drachenblut",
    name: "Ascandir – Drachenblut",
    colors: palette({
      text: "#f2e6d8ff", hoverText: "#ffffffff", border: "#8b1e1eff", hoverBorder: "#d43a2fff",
      portrait: "#1a1214e6", container: "#0d0a0b99",
      panel: "#231a1ce6", panelHover: "#5a1f22e6",
      bonus: "#3b1f33e6", bonusHover: "#6e2a55e6",
      free: "#2a2628e6", freeHover: "#4d4245e6",
      reaction: "#6b1414e6", reactionHover: "#a32020e6",
      endTurn: "#24301fe6", endTurnHover: "#3f5a33e6",
      ttHeader: "#2a1416f2", ttHeaderText: "#f2e6d8ff",
      ttSubtitle: "#8b1e1eff", ttSubtitleText: "#ffffffff",
      ttBody: "#1a1214e6", ttBodyText: "#eadccaff",
      textGlow: "#00000099", accentGlow: "#e0403fcc",
      button: "#8b1e1eff", buttonHover: "#c22b22ff", buttonText: "#ffffffff",
      moveUsed: "#4a3d3f80", moveBase: "#d9a441ff", moveBaseGlow: "#ffc861cc",
      moveDash: "#e06a2cff", moveDashGlow: "#ff8a4ccc", moveDanger: "#c21b1bff", moveDangerGlow: "#ff3b3bcc",
    }),
    extras: {
      accent: "#ff5a4aff", hp: "#7ee08aff", pip: "#f2c48dff", pipGlow: "#ff5a3ccc", pipUsed: "#4a3d3f99",
      statText: "#f2e6d8ff", statBackground: "#14090acc", panelText: "#d9b8a8ff",
    },
    style: { font: "Modesto Condensed", fontScale: 105, radius: 4, borderWidth: 2, hoverGlow: true, glowColor: "#ff3b2fb3", glowSize: 14, textShadow: true, portraitFrame: true },
  },
  {
    id: "ascandir-pergament",
    name: "Ascandir – Pergament & Tinte",
    colors: palette({
      text: "#2b1d10ff", hoverText: "#1a0f05ff", border: "#6b4a2bff", hoverBorder: "#3d2814ff",
      portrait: "#d9c7a3e6", container: "#5a412633",
      panel: "#dfcca6e6", panelHover: "#f0e2c2f2",
      bonus: "#d6b98ae6", bonusHover: "#ecd3a8f2",
      free: "#c9c7a2e6", freeHover: "#e2dfbaf2",
      reaction: "#cfa08ce6", reactionHover: "#e6bba8f2",
      endTurn: "#b2c296e6", endTurnHover: "#cad9adf2",
      ttHeader: "#e8d8b4f2", ttHeaderText: "#2b1d10ff",
      ttSubtitle: "#6b4a2bff", ttSubtitleText: "#f5ead2ff",
      ttBody: "#efe3c8f2", ttBodyText: "#2b1d10ff",
      textGlow: "#fff6e066", accentGlow: "#8b5a2bcc",
      button: "#6b4a2bff", buttonHover: "#8a6238ff", buttonText: "#f5ead2ff",
      moveUsed: "#8a7a6080", moveBase: "#4a6b8aff", moveBaseGlow: "#6a8bb0aa",
      moveDash: "#b08a2aff", moveDashGlow: "#d4aa44aa", moveDanger: "#9a2a1aff", moveDangerGlow: "#c44a3aaa",
    }),
    extras: {
      accent: "#7a1f12ff", hp: "#2f6b2aff", pip: "#6b4a2bff", pipGlow: "#f5ead266", pipUsed: "#a8987a80",
      statText: "#2b1d10ff", statBackground: "#efe3c8cc", panelText: "#3d2814ff",
    },
    style: { font: "Modesto Condensed", fontScale: 105, radius: 6, borderWidth: 2, hoverGlow: false, glowColor: "#8b5a2b99", glowSize: 10, textShadow: false, portraitFrame: true },
  },
  {
    id: "ascandir-arkane-nacht",
    name: "Ascandir – Arkane Nacht",
    colors: palette({
      text: "#cfd8ffff", hoverText: "#ffffffff", border: "#4b5bd6ff", hoverBorder: "#9a8cffff",
      portrait: "#10142ae6", container: "#05071466",
      panel: "#141a33e6", panelHover: "#2b3570e6",
      bonus: "#2a1650e6", bonusHover: "#4a2a8ae6",
      free: "#14304ae6", freeHover: "#22507ae6",
      reaction: "#4a1438e6", reactionHover: "#7a2460e6",
      endTurn: "#123a36e6", endTurnHover: "#1e5e57e6",
      ttHeader: "#1c2250f2", ttHeaderText: "#e6ebffff",
      ttSubtitle: "#4b5bd6ff", ttSubtitleText: "#ffffffff",
      ttBody: "#10142ae6", ttBodyText: "#d8deffff",
      textGlow: "#6a7cff66", accentGlow: "#9a8cffcc",
      button: "#4b5bd6ff", buttonHover: "#7a6cffff", buttonText: "#ffffffff",
      moveUsed: "#3a3f6080", moveBase: "#7aa2ffff", moveBaseGlow: "#9ab8ffcc",
      moveDash: "#c08aff", moveDashGlow: "#d6a8ffcc", moveDanger: "#ff5a8aff", moveDangerGlow: "#ff7aa2cc",
    }),
    extras: {
      accent: "#a8b8ffff", hp: "#6af0c8ff", pip: "#b4c4ffff", pipGlow: "#7a5cffcc", pipUsed: "#3a3f6099",
      statText: "#e6ebffff", statBackground: "#080b1ccc", panelText: "#aab4e6ff",
    },
    style: { font: "", fontScale: 100, radius: 10, borderWidth: 1, hoverGlow: true, glowColor: "#7a5cffcc", glowSize: 18, textShadow: true, portraitFrame: true },
  },
  {
    id: "ascandir-waldlaeufer",
    name: "Ascandir – Waldläufer",
    colors: palette({
      text: "#e2ead2ff", hoverText: "#ffffffff", border: "#6f8a4eff", hoverBorder: "#a8c770ff",
      portrait: "#1b2419e6", container: "#0a100866",
      panel: "#1d2a1ee6", panelHover: "#34502fe6",
      bonus: "#2d3a1ee6", bonusHover: "#4d6330e6",
      free: "#1f3330e6", freeHover: "#33554fe6",
      reaction: "#4a2a1ae6", reactionHover: "#734228e6",
      endTurn: "#26402ae6", endTurnHover: "#3e6644e6",
      ttHeader: "#2a3a22f2", ttHeaderText: "#eef4e0ff",
      ttSubtitle: "#5a7040ff", ttSubtitleText: "#ffffffff",
      ttBody: "#1b2419e6", ttBodyText: "#e2ead2ff",
      textGlow: "#00000099", accentGlow: "#b6d36bcc",
      button: "#5a7040ff", buttonHover: "#7a9452ff", buttonText: "#ffffffff",
      moveUsed: "#4a523f80", moveBase: "#8fc25aff", moveBaseGlow: "#a8dc70cc",
      moveDash: "#d4b44aff", moveDashGlow: "#ecd06acc", moveDanger: "#c2552aff", moveDangerGlow: "#e0744acc",
    }),
    extras: {
      accent: "#b6d36bff", hp: "#9ff07aff", pip: "#cfe3a4ff", pipGlow: "#9ccc5acc", pipUsed: "#4a523f99",
      statText: "#eef4e0ff", statBackground: "#0d140bcc", panelText: "#bccaa4ff",
    },
    style: { font: "", fontScale: 100, radius: 3, borderWidth: 1, hoverGlow: true, glowColor: "#9ccc5aaa", glowSize: 10, textShadow: true, portraitFrame: false },
  },
  {
    id: "ascandir-eisen-glut",
    name: "Ascandir – Eisen & Glut",
    colors: palette({
      text: "#e8e1d6ff", hoverText: "#ffffffff", border: "#6e6a66ff", hoverBorder: "#ff9a3cff",
      portrait: "#1c1d20e6", container: "#0a0a0b66",
      panel: "#1e1f22e6", panelHover: "#3a2a20e6",
      bonus: "#3b2b1ce6", bonusHover: "#6a4422e6",
      free: "#263038e6", freeHover: "#3c4c58e6",
      reaction: "#5a2014e6", reactionHover: "#8a3018e6",
      endTurn: "#22301fe6", endTurnHover: "#3a5234e6",
      ttHeader: "#2a2724f2", ttHeaderText: "#f4ece0ff",
      ttSubtitle: "#8a4a1aff", ttSubtitleText: "#ffffffff",
      ttBody: "#1c1d20e6", ttBodyText: "#e8e1d6ff",
      textGlow: "#00000099", accentGlow: "#ff9a3ccc",
      button: "#8a4a1aff", buttonHover: "#c4651fff", buttonText: "#ffffffff",
      moveUsed: "#4a464280", moveBase: "#ffb35cff", moveBaseGlow: "#ffc87acc",
      moveDash: "#e0d05aff", moveDashGlow: "#f0e07acc", moveDanger: "#e0402aff", moveDangerGlow: "#ff604acc",
    }),
    extras: {
      accent: "#ff9a3cff", hp: "#8ee07aff", pip: "#ffb35cff", pipGlow: "#ff6a00cc", pipUsed: "#4a464299",
      statText: "#f4ece0ff", statBackground: "#0e0e10cc", panelText: "#c8bcaaff",
    },
    style: { font: "", fontScale: 100, radius: 2, borderWidth: 2, hoverGlow: true, glowColor: "#ff7a1acc", glowSize: 14, textShadow: true, portraitFrame: true },
  },
];

export const BUILTIN_THEMES = Object.fromEntries(
  RAW.map((t) => {
    const base = defaultTheme();
    const theme = normalizeTheme({
      ...t,
      colors: { ...base.colors, ...t.colors },
      extras: { ...base.extras, ...t.extras },
      style: { ...base.style, ...t.style },
      textures: { ...base.textures, ...t.textures },
    });
    theme.builtin = true;
    return [theme.id, theme];
  })
);
