# Makes the proposed logo files in this folder from public/assets/images/kblogo.png: the mark lifted off its
# #ffbb58 square (kettlebird-mark.png), the bird alone (kettlebird-bird.png), and the icons. Run from the
# repository root: python3 docs/design/mockups/home-tiles-and-icon/make-logo.py
#
# The logo is flat colour: a #ffbb58 ground, the bird's purple, the letters' dark purple, and the eye's cream
# and oranges. Each edge pixel is a blend of the ground and one ink, so its alpha is how far it sits along the
# line from the ground to the nearest ink, and its colour is that ink: no colour fringe on any other ground.
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
L = sys.argv[1] if len(sys.argv) > 1 else 'docs/design/mockups/home-tiles-and-icon'
im = Image.open('public/assets/images/kblogo.png').convert('RGBA')
rgb = np.asarray(im).astype(np.float32)[..., :3]
GROUND = np.array([255, 187, 88], np.float32)
INKS = np.array([[89, 63, 94], [46, 20, 51]], np.float32)  # the bird's purple, the letters' and lines' dark purple

ground = np.abs(rgb - GROUND).max(-1) < 12
near = np.asarray(Image.fromarray((ground * 255).astype(np.uint8)).copy().filter(ImageFilter.MaxFilter(7))) > 0
edge = near & ~ground                     # the anti-aliased pixels between the ground and an ink
best_a = np.zeros(ground.shape, np.float32); best_err = np.full(ground.shape, np.inf, np.float32); best_ink = np.zeros(rgb.shape, np.float32)
for ink in INKS:
    d = ink - GROUND
    a = np.clip(((rgb - GROUND) * d).sum(-1) / (d * d).sum(), 0, 1)
    err = np.linalg.norm(rgb - (GROUND + a[..., None] * d), axis=-1)
    better = err < best_err
    best_a = np.where(better, a, best_a); best_err = np.where(better, err, best_err); best_ink = np.where(better[..., None], ink, best_ink)
alpha = np.where(ground, 0.0, np.where(edge, best_a, 1.0))
colour = np.where(edge[..., None], best_ink, rgb)
out = np.dstack([colour, alpha * 255]).astype(np.uint8)
mark = Image.fromarray(out, 'RGBA')

solid = Image.fromarray(((out[..., 3] > 128) * 255).astype(np.uint8)).copy()
ImageDraw.floodfill(solid, (800, 500), 100)   # the bird, its eye included; K and B are separate shapes
bird = np.asarray(Image.fromarray(((np.asarray(solid) == 100) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9))) > 0
o2 = out.copy(); o2[..., 3] = np.where(bird, o2[..., 3], 0)
birdonly = Image.fromarray(o2, 'RGBA')

def trim(img, pad):
    x0, y0, x1, y1 = img.getbbox(); w, h = x1 - x0, y1 - y0; s = max(w, h) + 2 * pad
    c = Image.new('RGBA', (s, s), (0, 0, 0, 0)); c.paste(img.crop((x0, y0, x1, y1)), ((s - w) // 2, (s - h) // 2)); return c
m = trim(mark, 20); b = trim(birdonly, 20)
m.save(f'{L}/kettlebird-mark.png', optimize=True); b.save(f'{L}/kettlebird-bird.png', optimize=True)

ORANGE = (255, 187, 88, 255)
def icon(src, size, fill):
    c = Image.new('RGBA', (size, size), ORANGE); s = round(size * fill)
    c.alpha_composite(src.resize((s, s), Image.LANCZOS), ((size - s) // 2, (size - s) // 2)); return c
small = {s: icon(b, s, 0.88) for s in (16, 32, 48)}          # the bird alone, clear of the edge
for s, i in small.items(): i.save(f'{L}/favicon-{s}.png')
small[48].save(f'{L}/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)], append_images=[small[16], small[32]])
for s in (180, 192, 512): icon(m, s, 0.84).save(f'{L}/icon-{s}.png')   # the full mark
icon(m, 512, 0.62).save(f'{L}/icon-maskable-512.png')                    # inside Android's round safe zone
