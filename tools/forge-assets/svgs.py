"""Erzeugt die SVG-Rahmen und Deko-Grafiken für „Schmiede & Pergament“."""
import sys

OUT = sys.argv[1]
B64 = open(f"{OUT}/_beam.b64").read().strip()
B64V = open(f"{OUT}/_beam_v.b64").read().strip()

BRONZE_DEFS = """
    <linearGradient id="bz" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f0c27a"/>
      <stop offset="0.3" stop-color="#b07a38"/>
      <stop offset="0.65" stop-color="#5e3a16"/>
      <stop offset="1" stop-color="#c28c46"/>
    </linearGradient>
    <linearGradient id="bzd" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9a6a30"/>
      <stop offset="1" stop-color="#3e260e"/>
    </linearGradient>
    <radialGradient id="rivet" cx="0.35" cy="0.3" r="0.75">
      <stop offset="0" stop-color="#fff0c8"/>
      <stop offset="0.35" stop-color="#c8924a"/>
      <stop offset="1" stop-color="#2a1806"/>
    </radialGradient>
    <radialGradient id="iron" cx="0.35" cy="0.3" r="0.8">
      <stop offset="0" stop-color="#b9b4ac"/>
      <stop offset="0.4" stop-color="#55504a"/>
      <stop offset="1" stop-color="#141210"/>
    </radialGradient>"""


def beams(w, h, t):
    """Holzbalken rundum, Breite t."""
    return f"""
  <defs>
    <pattern id="ph" patternUnits="userSpaceOnUse" width="256" height="128">
      <image href="data:image/webp;base64,{B64}" width="256" height="128"/>
    </pattern>
    <pattern id="pv" patternUnits="userSpaceOnUse" width="128" height="256">
      <image href="data:image/webp;base64,{B64V}" width="128" height="256"/>
    </pattern>
    <linearGradient id="shadeH" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="0.5" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.32"/>
    </linearGradient>
    <linearGradient id="shadeV" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="0.5" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.32"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="{w}" height="{t}" fill="url(#ph)"/>
  <rect x="0" y="{h - t}" width="{w}" height="{t}" fill="url(#ph)"/>
  <rect x="0" y="0" width="{t}" height="{h}" fill="url(#pv)"/>
  <rect x="{w - t}" y="0" width="{t}" height="{h}" fill="url(#pv)"/>
  <rect x="0" y="0" width="{w}" height="{t}" fill="url(#shadeH)"/>
  <rect x="0" y="{h - t}" width="{w}" height="{t}" fill="url(#shadeH)"/>
  <rect x="0" y="0" width="{t}" height="{h}" fill="url(#shadeV)"/>
  <rect x="{w - t}" y="0" width="{t}" height="{h}" fill="url(#shadeV)"/>
  <rect x="0.75" y="0.75" width="{w - 1.5}" height="{h - 1.5}" fill="none" stroke="#0a0603" stroke-width="1.5"/>
  <rect x="2.5" y="2.5" width="{w - 5}" height="{h - 5}" fill="none" stroke="#e0b070" stroke-opacity="0.22" stroke-width="1"/>
  <rect x="{t - 0.75}" y="{t - 0.75}" width="{w - 2 * t + 1.5}" height="{h - 2 * t + 1.5}" fill="none" stroke="#060402" stroke-width="2.5"/>
  <rect x="{t + 1.5}" y="{t + 1.5}" width="{w - 2 * t - 3}" height="{h - 2 * t - 3}" fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="2"/>"""


def svg(w, h, body, defs=""):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
  <defs>{BRONZE_DEFS}{defs}
  </defs>{body}
</svg>
"""


# ------------------------------------------------------------------
# Schwerer Holzrahmen mit Bronze-Eckbeschlägen (Menü, Portrait, Planke, Tooltip)
# ------------------------------------------------------------------
def frame_heavy():
    W = H = 400
    T = 28
    S = 56  # Slice
    corner = """
    <g id="cb">
      <path d="M0 0 H54 L50 14 H16 Q14 14 14 16 V50 L0 54 Z" fill="url(#bz)" stroke="#120a03" stroke-width="1.6"/>
      <path d="M3 3 H49 L46 11 H13 Q11 11 11 13 V46 L3 49 Z" fill="none" stroke="#ffe0a0" stroke-opacity="0.4" stroke-width="1.1"/>
      <path d="M14 14 L34 14 L14 34 Z" fill="#000" opacity="0.4"/>
      <circle cx="8" cy="8" r="5.4" fill="url(#rivet)" stroke="#120a03" stroke-width="0.9"/>
      <circle cx="42" cy="7" r="3.2" fill="url(#rivet)" stroke="#120a03" stroke-width="0.7"/>
      <circle cx="7" cy="42" r="3.2" fill="url(#rivet)" stroke="#120a03" stroke-width="0.7"/>
      <path d="M24 5 l4 -4 l4 4 l-4 4 z" fill="url(#bz)" stroke="#120a03" stroke-width="0.7"/>
      <path d="M5 24 l-4 4 l4 4 l4 -4 z" fill="url(#bz)" stroke="#120a03" stroke-width="0.7"/>
    </g>
    <g id="mid">
      <rect x="-7" y="5" width="14" height="18" rx="2" fill="url(#bzd)" stroke="#120a03" stroke-width="0.9"/>
      <circle cx="0" cy="14" r="3.6" fill="url(#iron)" stroke="#0a0806" stroke-width="0.6"/>
    </g>"""
    body = beams(W, H, T) + f"""
  <use href="#mid" transform="translate({W/2} 0)"/>
  <use href="#mid" transform="translate({W/2} {H}) scale(1 -1)"/>
  <use href="#mid" transform="translate(0 {H/2}) rotate(-90)"/>
  <use href="#mid" transform="translate({W} {H/2}) rotate(90)"/>
  <use href="#cb"/>
  <use href="#cb" transform="translate({W} 0) scale(-1 1)"/>
  <use href="#cb" transform="translate(0 {H}) scale(1 -1)"/>
  <use href="#cb" transform="translate({W} {H}) scale(-1 -1)"/>"""
    return svg(W, H, body, corner)


# ------------------------------------------------------------------
# Knopfrahmen: schmales Holz, Bronze-Dornen oben, Nieten unten
# ------------------------------------------------------------------
def frame_spike():
    W = H = 96
    T = 12
    defs = """
    <g id="spike">
      <path d="M0 0 L22 5 L15 10 L10 15 L5 22 Z" fill="url(#bz)" stroke="#120a03" stroke-width="1.1"/>
      <path d="M1 1 L14 8" stroke="#ffe0a0" stroke-opacity="0.55" stroke-width="0.9"/>
      <circle cx="11" cy="11" r="3.4" fill="url(#rivet)" stroke="#120a03" stroke-width="0.6"/>
    </g>
    <g id="foot">
      <path d="M1 1 H18 V7 H7 V18 H1 Z" fill="url(#bz)" stroke="#120a03" stroke-width="0.9"/>
      <circle cx="7" cy="7" r="4.2" fill="url(#iron)" stroke="#0a0806" stroke-width="0.7"/>
    </g>"""
    body = beams(W, H, T) + f"""
  <use href="#spike"/>
  <use href="#spike" transform="translate({W} 0) scale(-1 1)"/>
  <use href="#foot" transform="translate(0 {H}) scale(1 -1)"/>
  <use href="#foot" transform="translate({W} {H}) scale(-1 -1)"/>"""
    return svg(W, H, body, defs)


# ------------------------------------------------------------------
# Tooltip-Rahmen: dunkles, schmaleres Holz mit eckigen Bronzewinkeln
# ------------------------------------------------------------------
def frame_tooltip():
    W = H = 120
    T = 18
    defs = """
    <g id="br">
      <path d="M0 0 H38 L33 8 H10 Q8 8 8 10 V33 L0 38 Z" fill="url(#bz)" stroke="#120a03" stroke-width="1.2"/>
      <path d="M2.5 2.5 H33 M2.5 2.5 V33" stroke="#ffe0a0" stroke-opacity="0.45" stroke-width="1"/>
      <circle cx="7.5" cy="7.5" r="4.4" fill="url(#iron)" stroke="#0a0806" stroke-width="0.7"/>
    </g>"""
    body = beams(W, H, T) + f"""
  <use href="#br"/>
  <use href="#br" transform="translate({W} 0) scale(-1 1)"/>
  <use href="#br" transform="translate(0 {H}) scale(1 -1)"/>
  <use href="#br" transform="translate({W} {H}) scale(-1 -1)"/>"""
    return svg(W, H, body, defs)


# ------------------------------------------------------------------
# Deko: Schriftrolle mit Seil und rotem Tuch (rechts an der Aktionsplanke)
# ------------------------------------------------------------------
def scroll_rope():
    return svg(110, 300, """
  <defs>
    <linearGradient id="roll" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6a4a22"/>
      <stop offset="0.25" stop-color="#e8d3a0"/>
      <stop offset="0.55" stop-color="#c9a76a"/>
      <stop offset="1" stop-color="#5a3c18"/>
    </linearGradient>
    <linearGradient id="cloth" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#4a0608"/>
      <stop offset="0.35" stop-color="#a3161a"/>
      <stop offset="0.7" stop-color="#7a0c10"/>
      <stop offset="1" stop-color="#3a0405"/>
    </linearGradient>
    <linearGradient id="rope" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d8b06a"/>
      <stop offset="1" stop-color="#7a5626"/>
    </linearGradient>
  </defs>
  <!-- rotes Tuch hinter der Rolle -->
  <path d="M22 40 C10 90 30 140 18 200 C10 240 26 270 30 296 L48 284 L60 298 C64 250 52 200 66 150 C76 110 60 70 70 36 Z" fill="url(#cloth)" stroke="#2a0203" stroke-width="1.2"/>
  <path d="M30 60 C26 110 40 160 30 220" fill="none" stroke="#d0303a" stroke-opacity="0.45" stroke-width="2"/>
  <!-- Rolle -->
  <rect x="40" y="6" width="34" height="270" rx="10" fill="url(#roll)" stroke="#2e1c08" stroke-width="1.5" transform="rotate(4 57 140)"/>
  <ellipse cx="58" cy="10" rx="17" ry="7" fill="#d9bf86" stroke="#2e1c08" stroke-width="1.2" transform="rotate(4 57 140)"/>
  <ellipse cx="58" cy="10" rx="10" ry="3.6" fill="#8a6a36" transform="rotate(4 57 140)"/>
  <ellipse cx="58" cy="10" rx="4" ry="1.6" fill="#4a3216" transform="rotate(4 57 140)"/>
  <path d="M45 40 Q56 46 72 40 M44 120 Q56 126 72 120 M44 200 Q56 206 71 200" stroke="#7a5626" stroke-opacity="0.5" fill="none" stroke-width="1.2" transform="rotate(4 57 140)"/>
  <!-- Seil -->
  <g transform="rotate(4 57 140)" stroke="#3a2608" stroke-width="0.8">
    <path d="M36 92 L80 100 L80 106 L36 98 Z" fill="url(#rope)"/>
    <path d="M36 102 L80 110 L80 116 L36 108 Z" fill="url(#rope)"/>
    <path d="M36 112 L80 120 L80 126 L36 118 Z" fill="url(#rope)"/>
    <path d="M78 118 C92 132 86 160 96 184" fill="none" stroke="url(#rope)" stroke-width="5"/>
    <path d="M40 116 C30 140 40 170 30 196" fill="none" stroke="url(#rope)" stroke-width="5"/>
    <path d="M96 184 l-2 10 l4 -2 l2 8" fill="none" stroke="#c9a060" stroke-width="2"/>
    <path d="M30 196 l-2 10 l4 -2 l2 8" fill="none" stroke="#c9a060" stroke-width="2"/>
  </g>
""")


# ------------------------------------------------------------------
# Deko: liegende Schriftrolle mit rotem Tuch (oben auf dem Menü)
# ------------------------------------------------------------------
def scroll_top():
    return svg(260, 70, """
  <defs>
    <linearGradient id="rollh" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#5a3c18"/>
      <stop offset="0.3" stop-color="#ead6a6"/>
      <stop offset="0.6" stop-color="#c4a066"/>
      <stop offset="1" stop-color="#4e3414"/>
    </linearGradient>
    <linearGradient id="clothh" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b81c22"/>
      <stop offset="0.5" stop-color="#7a0c10"/>
      <stop offset="1" stop-color="#3a0405"/>
    </linearGradient>
  </defs>
  <!-- Tuch -->
  <path d="M96 20 C130 10 170 26 206 14 C226 8 244 22 256 30 L246 44 C226 36 204 46 180 42 C150 38 124 52 100 46 Z" fill="url(#clothh)" stroke="#2a0203" stroke-width="1.2"/>
  <path d="M206 40 C214 52 222 58 232 66 L220 68 L214 60 L208 68 C206 58 202 50 198 44 Z" fill="#7a0c10" stroke="#2a0203" stroke-width="1"/>
  <path d="M110 30 C140 22 170 34 210 24" fill="none" stroke="#e0444c" stroke-opacity="0.45" stroke-width="2"/>
  <!-- Rolle -->
  <rect x="6" y="20" width="150" height="30" rx="9" fill="url(#rollh)" stroke="#2e1c08" stroke-width="1.5"/>
  <ellipse cx="10" cy="35" rx="7" ry="15" fill="#d9bf86" stroke="#2e1c08" stroke-width="1.2"/>
  <ellipse cx="10" cy="35" rx="3.6" ry="9" fill="#8a6a36"/>
  <ellipse cx="10" cy="35" rx="1.6" ry="4" fill="#4a3216"/>
  <!-- Bänder -->
  <rect x="40" y="18" width="7" height="34" fill="#7a5626" stroke="#3a2608" stroke-width="0.8"/>
  <rect x="112" y="18" width="7" height="34" fill="#7a5626" stroke="#3a2608" stroke-width="0.8"/>
""")


# ------------------------------------------------------------------
# Deko: hängende Eisenkette
# ------------------------------------------------------------------
def chain():
    links = []
    y = 4
    for i in range(14):
        if i % 2 == 0:
            links.append(f'<rect x="4" y="{y}" width="14" height="24" rx="7" fill="none" stroke="url(#iron)" stroke-width="4.5"/>'
                         f'<rect x="4" y="{y}" width="14" height="24" rx="7" fill="none" stroke="#0a0806" stroke-width="0.8"/>')
        else:
            links.append(f'<rect x="9" y="{y}" width="4" height="24" rx="2" fill="url(#iron)" stroke="#0a0806" stroke-width="0.8"/>')
        y += 17
    return svg(22, 250, "\n  " + "\n  ".join(links))


files = {
    "frame-heavy.svg": frame_heavy(),
    "frame-spike.svg": frame_spike(),
    "frame-tooltip.svg": frame_tooltip(),
    "scroll-rope.svg": scroll_rope(),
    "scroll-top.svg": scroll_top(),
    "chain.svg": chain(),
}
for name, data in files.items():
    open(f"{OUT}/{name}", "w").write(data)
print("ok", list(files))
