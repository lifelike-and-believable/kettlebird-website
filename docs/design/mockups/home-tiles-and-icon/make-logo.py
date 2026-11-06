# Makes the proposed logo files in this folder from public/assets/images/kblogo.png: the mark lifted off its
# #ffbb58 square (kettlebird-mark.png), the bird alone (kettlebird-bird.png), and the icons. Run from the
# repository root: python3 docs/design/mockups/home-tiles-and-icon/make-logo.py
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
L=sys.argv[1] if len(sys.argv) > 1 else 'docs/design/mockups/home-tiles-and-icon'
im=Image.open('public/assets/images/kblogo.png').convert('RGBA'); a=np.asarray(im).astype(np.float32)
bg=np.array([255,187,88],np.float32); rgb=a[...,:3]
dist=np.abs(rgb-bg).max(-1)
core=Image.fromarray(((dist<12)*255).astype(np.uint8)).copy()
outer=np.asarray(core.filter(ImageFilter.MaxFilter(7)))>0
alpha=np.zeros(dist.shape,np.float32)
for c in range(3):
    p=rgb[...,c]; b=bg[c]
    alpha=np.maximum(alpha,np.where(p>b,(p-b)/max(255-b,1),(b-p)/max(b,1)))
alpha=np.clip(alpha,0,1)
fg=(rgb-bg)/np.maximum(alpha,1e-4)[...,None]+bg
out=a.copy()
out[...,:3]=np.where(outer[...,None],np.clip(fg,0,255),rgb)
out[...,3]=np.where(outer,alpha*255,255)
mark=Image.fromarray(out.astype(np.uint8),'RGBA')
solid=Image.fromarray(((out[...,3]>128)*255).astype(np.uint8)).copy()
ImageDraw.floodfill(solid,(800,500),100)
bird=np.asarray(solid)==100
birdm=np.asarray(Image.fromarray((bird*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9)))>0
o2=out.copy(); o2[...,3]=np.where(birdm,o2[...,3],0)
birdonly=Image.fromarray(o2.astype(np.uint8),'RGBA')
def trim(img,pad):
    x0,y0,x1,y1=img.getbbox(); w,h=x1-x0,y1-y0; s=max(w,h)+2*pad
    c=Image.new('RGBA',(s,s),(0,0,0,0)); c.paste(img.crop((x0,y0,x1,y1)),((s-w)//2,(s-h)//2)); return c
m=trim(mark,20); b=trim(birdonly,20)
m.save(L+'/kettlebird-mark.png',optimize=True); b.save(L+'/kettlebird-bird.png',optimize=True)
ORANGE=(255,187,88,255)
def icon(src,size,fill):
    c=Image.new('RGBA',(size,size),ORANGE); s=round(size*fill); g=src.resize((s,s),Image.LANCZOS); c.alpha_composite(g,((size-s)//2,(size-s)//2)); return c
for s in (16,32,48): icon(b,s,0.94).save(f'{L}/favicon-{s}.png')
for s in (180,192,512): icon(m,s,0.84).save(f'{L}/icon-{s}.png')
