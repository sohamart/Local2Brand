import os
import math
import base64
from PIL import Image

light_src_path = r"C:\Users\Soham\.gemini\antigravity-ide\brain\f2f89514-117d-4835-9f65-d12c83959b8a\.user_uploaded\media_1789539440213.jpg"
dark_src_path = r"C:\Users\Soham\.gemini\antigravity-ide\brain\f2f89514-117d-4835-9f65-d12c83959b8a\.user_uploaded\media_1789539451400.png"

public_dir = r"D:\local2brand\frontend\public"

print("Light source exists:", os.path.exists(light_src_path))
print("Dark source exists:", os.path.exists(dark_src_path))

# Load images
img_light = Image.open(light_src_path).convert("RGBA")
img_dark = Image.open(dark_src_path).convert("RGBA")

w, h = img_light.size
print("Light size:", (w, h))

# Remove white background with pure Python / Pillow
pixels = img_light.load()
transparent_img = Image.new("RGBA", (w, h))
t_pixels = transparent_img.load()

# Thresholds for soft antialiased alpha extraction
threshold_low = 18.0
threshold_high = 75.0

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        # Distance from pure white (255, 255, 255)
        diff = math.sqrt((255 - r)**2 + (255 - g)**2 + (255 - b)**2)
        
        if diff <= threshold_low:
            t_pixels[x, y] = (0, 0, 0, 0)
        elif diff >= threshold_high:
            t_pixels[x, y] = (r, g, b, 255)
        else:
            alpha_factor = (diff - threshold_low) / (threshold_high - threshold_low)
            new_a = int(alpha_factor * 255)
            # Decontaminate white fringing
            norm_a = max(alpha_factor, 0.001)
            nr = min(255, max(0, int((r - (1.0 - norm_a) * 255.0) / norm_a)))
            ng = min(255, max(0, int((g - (1.0 - norm_a) * 255.0) / norm_a)))
            nb = min(255, max(0, int((b - (1.0 - norm_a) * 255.0) / norm_a)))
            t_pixels[x, y] = (nr, ng, nb, new_a)

# Crop to tight bounding box with comfortable padding
bbox = transparent_img.getbbox()
if bbox:
    cropped = transparent_img.crop(bbox)
    cw, ch = cropped.size
    max_d = max(cw, ch)
    target_d = int(max_d * 1.15)
    square_logo = Image.new("RGBA", (target_d, target_d), (0, 0, 0, 0))
    offset = ((target_d - cw) // 2, (target_d - ch) // 2)
    square_logo.paste(cropped, offset, cropped)
else:
    square_logo = transparent_img

print("Square transparent logo created:", square_logo.size)

# Output files in public directory:
# 1. logo.png (1024x1024 transparent)
logo_1024 = square_logo.resize((1024, 1024), Image.Resampling.LANCZOS)
logo_1024.save(os.path.join(public_dir, "logo.png"), "PNG", optimize=True)

# 2. logo.jpg (1024x1024 clean white background)
logo_jpg = Image.new("RGB", (1024, 1024), (255, 255, 255))
logo_jpg.paste(logo_1024, (0, 0), logo_1024)
logo_jpg.save(os.path.join(public_dir, "logo.jpg"), "JPEG", quality=95)

# 3. logo-dark.png & logo-dark.jpg (from dark_src)
dark_bbox = img_dark.getbbox()
if dark_bbox:
    dark_cropped = img_dark.crop(dark_bbox)
    dw, dh = dark_cropped.size
    d_max = max(dw, dh)
    d_target = int(d_max * 1.15)
    dark_square = Image.new("RGBA", (d_target, d_target), (3, 6, 17, 255))
    d_offset = ((d_target - dw) // 2, (d_target - dh) // 2)
    dark_square.paste(dark_cropped, d_offset, dark_cropped)
else:
    dark_square = img_dark

dark_1024 = dark_square.resize((1024, 1024), Image.Resampling.LANCZOS)
dark_1024.save(os.path.join(public_dir, "logo-dark.png"), "PNG", optimize=True)

dark_jpg = dark_1024.convert("RGB")
dark_jpg.save(os.path.join(public_dir, "logo-dark.jpg"), "JPEG", quality=95)

# 4. favicon.png (256x256 transparent)
fav_256 = square_logo.resize((256, 256), Image.Resampling.LANCZOS)
fav_256.save(os.path.join(public_dir, "favicon.png"), "PNG", optimize=True)

fav_jpg = Image.new("RGB", (256, 256), (255, 255, 255))
fav_jpg.paste(fav_256, (0, 0), fav_256)
fav_jpg.save(os.path.join(public_dir, "favicon.jpg"), "JPEG", quality=95)

# 5. favicon.ico (multi-resolution 16, 32, 48, 64, 128, 256)
fav_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
fav_icons = [square_logo.resize(s, Image.Resampling.LANCZOS) for s in fav_sizes]
fav_icons[0].save(
    os.path.join(public_dir, "favicon.ico"),
    format="ICO",
    sizes=fav_sizes,
    append_images=fav_icons[1:]
)

# 6. PWA Icons: icon-192.png, icon-512.png (Transparent background)
icon_192 = square_logo.resize((192, 192), Image.Resampling.LANCZOS)
icon_192.save(os.path.join(public_dir, "icon-192.png"), "PNG", optimize=True)

icon_512 = square_logo.resize((512, 512), Image.Resampling.LANCZOS)
icon_512.save(os.path.join(public_dir, "icon-512.png"), "PNG", optimize=True)

# 7. Maskable Icons (Safe padded zone on dark canvas for Android adaptive launcher icons)
icon_192_m = square_logo.resize((154, 154), Image.Resampling.LANCZOS)
maskable_192 = Image.new("RGBA", (192, 192), (7, 9, 14, 255))
maskable_192.paste(icon_192_m, (19, 19), icon_192_m)
maskable_192.save(os.path.join(public_dir, "icon-192-maskable.png"), "PNG", optimize=True)

icon_512_m = square_logo.resize((410, 410), Image.Resampling.LANCZOS)
maskable_512 = Image.new("RGBA", (512, 512), (7, 9, 14, 255))
maskable_512.paste(icon_512_m, (51, 51), icon_512_m)
maskable_512.save(os.path.join(public_dir, "icon-512-maskable.png"), "PNG", optimize=True)

# 8. Delete old whatsapp file
old_whatsapp = os.path.join(public_dir, "WhatsApp Image 2026-09-07 at 4.07.41 PM.jpeg")
if os.path.exists(old_whatsapp):
    os.remove(old_whatsapp)
    print("Deleted old WhatsApp image")

# 9. favicon.svg
with open(os.path.join(public_dir, "favicon.png"), "rb") as f:
    png_b64 = base64.b64encode(f.read()).decode("utf-8")

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,{png_b64}" x="0" y="0" width="512" height="512" />
</svg>'''

with open(os.path.join(public_dir, "favicon.svg"), "w", encoding="utf-8") as f:
    f.write(svg_content)

print("SUCCESS: All brand icons & favicons regenerated cleanly!")
