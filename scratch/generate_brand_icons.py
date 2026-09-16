import os
import math
import base64
from PIL import Image, ImageOps

light_src_path = r"C:\Users\Soham\.gemini\antigravity-ide\brain\f2f89514-117d-4835-9f65-d12c83959b8a\.user_uploaded\media_1789539440213.jpg"
dark_src_path = r"C:\Users\Soham\.gemini\antigravity-ide\brain\f2f89514-117d-4835-9f65-d12c83959b8a\.user_uploaded\media_1789539451400.png"

public_dir = r"D:\local2brand\frontend\public"

img_light = Image.open(light_src_path).convert("RGBA")
w, h = img_light.size
pixels = img_light.load()

# Create transparent image
transparent_img = Image.new("RGBA", (w, h))
t_pixels = transparent_img.load()

threshold_low = 14.0
threshold_high = 70.0

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        diff = math.sqrt((255 - r)**2 + (255 - g)**2 + (255 - b)**2)
        if diff <= threshold_low:
            t_pixels[x, y] = (0, 0, 0, 0)
        elif diff >= threshold_high:
            t_pixels[x, y] = (r, g, b, 255)
        else:
            alpha_factor = (diff - threshold_low) / (threshold_high - threshold_low)
            new_a = int(alpha_factor * 255)
            norm_a = max(alpha_factor, 0.001)
            nr = min(255, max(0, int((r - (1.0 - norm_a) * 255.0) / norm_a)))
            ng = min(255, max(0, int((g - (1.0 - norm_a) * 255.0) / norm_a)))
            nb = min(255, max(0, int((b - (1.0 - norm_a) * 255.0) / norm_a)))
            t_pixels[x, y] = (nr, ng, nb, new_a)

# Tight crop to remove all empty space
bbox = transparent_img.getbbox()
cropped_w = transparent_img.crop(bbox)
cw, ch = cropped_w.size

# Fit inside a square with minimal 2% padding so the logo ZOOMS and FILLS the circle/container
target_d = max(cw, ch)
pad = int(target_d * 0.04)
square_size = target_d + pad * 2

square_logo = Image.new("RGBA", (square_size, square_size), (0, 0, 0, 0))
offset_x = (square_size - cw) // 2
offset_y = (square_size - ch) // 2
square_logo.paste(cropped_w, (offset_x, offset_y), cropped_w)

print(f"Generated tight zoom square transparent logo: {square_logo.size}")

# 1. logo.png (1024x1024)
logo_1024 = square_logo.resize((1024, 1024), Image.Resampling.LANCZOS)
logo_1024.save(os.path.join(public_dir, "logo.png"), "PNG", optimize=True)

# 2. logo.jpg
logo_jpg = Image.new("RGB", (1024, 1024), (255, 255, 255))
logo_jpg.paste(logo_1024, (0, 0), logo_1024)
logo_jpg.save(os.path.join(public_dir, "logo.jpg"), "JPEG", quality=95)

# 3. Process Dark Logo
img_dark = Image.open(dark_src_path).convert("RGBA")
dw, dh = img_dark.size
dpixels = img_dark.load()
dark_trans = Image.new("RGBA", (dw, dh))
dt_pixels = dark_trans.load()

# Dark background color is around (1, 0, 14)
for y in range(dh):
    for x in range(dw):
        r, g, b, a = dpixels[x, y]
        diff_dark = math.sqrt((r - 1)**2 + (g - 0)**2 + (b - 14)**2)
        if diff_dark <= 12.0:
            dt_pixels[x, y] = (0, 0, 0, 0)
        elif diff_dark >= 55.0:
            dt_pixels[x, y] = (r, g, b, 255)
        else:
            af = (diff_dark - 12.0) / (55.0 - 12.0)
            na = int(af * 255)
            dt_pixels[x, y] = (r, g, b, na)

dark_bbox = dark_trans.getbbox()
if dark_bbox:
    dark_cropped = dark_trans.crop(dark_bbox)
    dcw, dch = dark_cropped.size
    d_target = max(dcw, dch)
    d_pad = int(d_target * 0.04)
    d_square_size = d_target + d_pad * 2
    dark_square = Image.new("RGBA", (d_square_size, d_square_size), (0, 0, 0, 0))
    d_offset = ((d_square_size - dcw) // 2, (d_square_size - dch) // 2)
    dark_square.paste(dark_cropped, d_offset, dark_cropped)
else:
    dark_square = dark_trans

dark_1024 = dark_square.resize((1024, 1024), Image.Resampling.LANCZOS)
dark_1024.save(os.path.join(public_dir, "logo-dark.png"), "PNG", optimize=True)

dark_jpg = Image.new("RGB", (1024, 1024), (7, 9, 14))
dark_jpg.paste(dark_1024, (0, 0), dark_1024)
dark_jpg.save(os.path.join(public_dir, "logo-dark.jpg"), "JPEG", quality=95)

# 4. Favicon 256x256, 128x128, 64x64, 48x48, 32x32, 16x16
fav_256 = square_logo.resize((256, 256), Image.Resampling.LANCZOS)
fav_256.save(os.path.join(public_dir, "favicon.png"), "PNG", optimize=True)

fav_jpg = Image.new("RGB", (256, 256), (255, 255, 255))
fav_jpg.paste(fav_256, (0, 0), fav_256)
fav_jpg.save(os.path.join(public_dir, "favicon.jpg"), "JPEG", quality=95)

fav_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
fav_icons = [square_logo.resize(s, Image.Resampling.LANCZOS) for s in fav_sizes]
fav_icons[0].save(
    os.path.join(public_dir, "favicon.ico"),
    format="ICO",
    sizes=fav_sizes,
    append_images=fav_icons[1:]
)

# 5. PWA Icons (192, 512, maskable)
icon_192 = square_logo.resize((192, 192), Image.Resampling.LANCZOS)
icon_192.save(os.path.join(public_dir, "icon-192.png"), "PNG", optimize=True)

icon_512 = square_logo.resize((512, 512), Image.Resampling.LANCZOS)
icon_512.save(os.path.join(public_dir, "icon-512.png"), "PNG", optimize=True)

# Maskable icons with Android safe zone
m_192 = square_logo.resize((160, 160), Image.Resampling.LANCZOS)
mask_192 = Image.new("RGBA", (192, 192), (7, 9, 14, 255))
mask_192.paste(m_192, (16, 16), m_192)
mask_192.save(os.path.join(public_dir, "icon-192-maskable.png"), "PNG", optimize=True)

m_512 = square_logo.resize((430, 430), Image.Resampling.LANCZOS)
mask_512 = Image.new("RGBA", (512, 512), (7, 9, 14, 255))
mask_512.paste(m_512, (41, 41), m_512)
mask_512.save(os.path.join(public_dir, "icon-512-maskable.png"), "PNG", optimize=True)

# 6. Favicon.svg - clean SVG embedding
with open(os.path.join(public_dir, "favicon.png"), "rb") as f:
    b64_data = base64.b64encode(f.read()).decode("utf-8")

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="100%" height="100%">
  <image href="data:image/png;base64,{b64_data}" x="0" y="0" width="256" height="256" />
</svg>'''

with open(os.path.join(public_dir, "favicon.svg"), "w", encoding="utf-8") as f:
    f.write(svg_content)

print("SUCCESS: Full edge-to-edge zoom W logos & favicons generated!")
