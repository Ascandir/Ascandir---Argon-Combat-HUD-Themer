"""Erzeugt die Raster-Texturen für den Skin „Schmiede & Pergament“."""
import base64, io, sys
import numpy as np
from PIL import Image, ImageFilter

OUT = sys.argv[1]
rng = np.random.default_rng(42)


def periodic_noise(h, w, scale_y, scale_x, seed):
    """Kachelbares Rauschen über FFT-Filterung (wrap-around)."""
    r = np.random.default_rng(seed)
    n = r.standard_normal((h, w))
    fy = np.fft.fftfreq(h)[:, None]
    fx = np.fft.fftfreq(w)[None, :]
    filt = np.exp(-((fy * scale_y) ** 2 + (fx * scale_x) ** 2))
    out = np.real(np.fft.ifft2(np.fft.fft2(n) * filt))
    out -= out.min()
    out /= out.max()
    return out


def fractal(h, w, seed, base_y, base_x, octaves=5):
    acc = np.zeros((h, w))
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        acc += amp * periodic_noise(h, w, base_y / 2 ** o, base_x / 2 ** o, seed + o)
        tot += amp
        amp *= 0.55
    return acc / tot


def to_img(rgb, alpha=None):
    rgb = np.clip(rgb, 0, 255).astype(np.uint8)
    if alpha is None:
        return Image.fromarray(rgb, "RGB")
    a = np.clip(alpha, 0, 255).astype(np.uint8)
    return Image.fromarray(np.dstack([rgb, a]), "RGBA")


def lerp(c1, c2, t):
    c1, c2 = np.array(c1, float), np.array(c2, float)
    return c1 + (c2 - c1) * t[..., None]


# ------------------------------------------------------------------
# 1) Dunkle Holzplanken (kachelbar), Maserung horizontal
# ------------------------------------------------------------------
def wood(h=512, w=512, plank=64, seed=1, dark=(26, 16, 9), light=(78, 50, 28)):
    grain = fractal(h, w, seed, 5, 220, 5)                # lange horizontale Fasern
    fine = periodic_noise(h, w, 25, 700, seed + 20)       # feine Linien
    knots = fractal(h, w, seed + 40, 30, 60, 3)
    t = 0.55 * grain + 0.25 * fine + 0.2 * knots
    # Ringe/Maserung verstärken
    rings = 0.5 + 0.5 * np.sin(t * 38)
    t = 0.65 * t + 0.35 * rings * t
    # Pro Planke Helligkeit variieren
    rows = np.arange(h)[:, None] // plank
    var = rng.uniform(0.82, 1.12, size=h // plank + 1)[rows]
    t = np.clip(t * var, 0, 1)
    img = lerp(dark, light, t ** 1.4)
    # Fugen zwischen Planken
    y = np.arange(h)[:, None] % plank
    seam = np.where(y < 2, 0.35, np.where(y < 4, 0.75, 1.0))
    hi = np.where((y >= 4) & (y < 6), 1.12, 1.0)
    img = img * seam[..., None] * hi[..., None] * np.ones((1, w, 1))
    # Versetzte Stoßfugen
    for k in range(h // plank):
        x0 = int(rng.uniform(0.15, 0.85) * w)
        y0, y1 = k * plank, (k + 1) * plank
        img[y0:y1, x0:x0 + 2] *= 0.35
        img[y0:y1, x0 + 2:x0 + 3] *= 1.1
    return to_img(img)


# ------------------------------------------------------------------
# 2) Pergament mit verbrannten, unregelmäßigen Rändern
# ------------------------------------------------------------------
def parchment(h=600, w=760, seed=7):
    mott = fractal(h, w, seed, 18, 18, 6)
    fib = periodic_noise(h, w, 6, 200, seed + 9)
    base = lerp((176, 140, 92), (240, 224, 188), np.clip(-0.1 + 1.25 * mott, 0, 1))
    base *= (0.97 + 0.04 * fib)[..., None]
    # Flecken
    stains = fractal(h, w, seed + 3, 10, 10, 4)
    base *= (1 - 0.22 * np.clip((stains - 0.58) * 4, 0, 1))[..., None]
    # Vergilbung zum Rand hin (unabhängig vom Brandrand)
    yy0, xx0 = np.mgrid[0:h, 0:w]
    rr = np.sqrt(((xx0 - w / 2) / (w / 2)) ** 2 + ((yy0 - h / 2) / (h / 2)) ** 2)
    base = base * (1 - 0.28 * np.clip(rr - 0.55, 0, 1) ** 1.3)[..., None] + np.array((60, 30, 0)) * (0.25 * np.clip(rr - 0.6, 0, 1))[..., None]

    yy, xx = np.mgrid[0:h, 0:w]
    # Abstand zum Rand (normiert), mit Rauschen verwackelt -> unregelmäßige Kante
    d = np.minimum.reduce([xx, w - 1 - xx, yy, h - 1 - yy]).astype(float)
    wobble = (fractal(h, w, seed + 5, 30, 30, 5) - 0.5) * 26
    d = d + wobble
    burn_w = 46.0
    t = np.clip(d / burn_w, 0, 1)                 # 0 = Rand, 1 = innen
    burnt = np.array((70, 38, 14), float)
    edge = np.array((128, 86, 42), float)
    k = (0.55 + 0.45 * np.clip((t - 0.35) / 0.65, 0, 1))[..., None]
    inner = edge * (1 - k) + base * k
    outer = lerp(burnt, edge, np.clip(t / 0.35, 0, 1))
    col = np.where(t[..., None] < 0.35, outer, inner)
    # Alpha: ausgefranste Kante
    alpha = np.clip((d + 2) / 4, 0, 1) * 255
    img = to_img(col, alpha)
    return img.filter(ImageFilter.GaussianBlur(0.6))


# ------------------------------------------------------------------
# 3) Dunkles Paneel (Menü-/Portrait-Hintergrund): fast schwarzes Holz
# ------------------------------------------------------------------
def panel(h=512, w=512, seed=3):
    return wood(h, w, plank=128, seed=seed, dark=(14, 10, 7), light=(40, 28, 18))


def save(img, name, q=88):
    img.save(f"{OUT}/{name}", "WEBP", quality=q, method=6)


save(wood(), "wood-dark.webp")
save(panel(), "panel-dark.webp")
save(parchment(), "parchment-burnt.webp", q=90)

# Kleine Holzkachel zum Einbetten in die SVG-Rahmen (vertikal & horizontal)
beam = wood(128, 256, plank=128, seed=11, dark=(58, 34, 16), light=(150, 98, 52))
buf = io.BytesIO(); beam.save(buf, "WEBP", quality=82)
open(f"{OUT}/_beam.b64", "w").write(base64.b64encode(buf.getvalue()).decode())
beam_v = beam.rotate(90, expand=True)
buf = io.BytesIO(); beam_v.save(buf, "WEBP", quality=82)
open(f"{OUT}/_beam_v.b64", "w").write(base64.b64encode(buf.getvalue()).decode())
print("ok")
