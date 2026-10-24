import math
from PIL import Image, ImageDraw, ImageFilter

def create_photoready_app_icon(output_path="C:/Users/mohal/Documents/antigravity/MindSprint/public/AppIcon.png", size=1024):
    # Render at 2x for ultra-sharp downsampling (super-sampling antialiasing)
    canvas_size = size * 2
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    center = canvas_size / 2
    r_outer = canvas_size * 0.44
    corner_radius = canvas_size * 0.22

    # 1. Base Drop Shadow
    shadow = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    s_draw.rounded_rectangle(
        [(center - r_outer + 10, center - r_outer + 35), 
         (center + r_outer - 10, center + r_outer + 45)],
        radius=corner_radius,
        fill=(10, 15, 25, 140)
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(40))
    img = Image.alpha_composite(shadow, img)
    draw = ImageDraw.Draw(img)

    # 2. Main Icon Body - Warm Alabaster & Champagne Gradient
    # Squircle body
    body_box = [center - r_outer, center - r_outer, center + r_outer, center + r_outer]
    
    # Layered gradients
    for i in range(int(r_outer * 2)):
        y = (center - r_outer) + i
        ratio = i / (r_outer * 2)
        # Luxurious warm alabaster cream to rich satin ivory
        r = int(250 - ratio * 15)
        g = int(248 - ratio * 18)
        b = int(242 - ratio * 24)
        draw.line([(center - r_outer, y), (center + r_outer, y)], fill=(r, g, b, 255))

    # Mask to rounded rectangle
    mask = Image.new("L", (canvas_size, canvas_size), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.rounded_rectangle(body_box, radius=corner_radius, fill=255)
    
    base_body = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    base_body.paste(img, (0, 0), mask)
    img = base_body
    draw = ImageDraw.Draw(img)

    # 3. Outer Polished Chamfered Gold Rim
    for offset in range(6):
        alpha = int(180 - offset * 25)
        m_draw = ImageDraw.Draw(img)
        # Inner glowing border
        draw.rounded_rectangle(
            [center - r_outer + offset, center - r_outer + offset, 
             center + r_outer - offset, center + r_outer - offset],
            radius=corner_radius - offset,
            outline=(218, 175, 95, alpha),
            width=2
        )

    # 4. Subtle Radial Ambient Lighting Highlight from Top-Left
    highlight = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    h_draw = ImageDraw.Draw(highlight)
    for r in range(int(canvas_size * 0.7), 0, -4):
        alpha = int((1 - r / (canvas_size * 0.7)) * 45)
        h_draw.ellipse(
            [(canvas_size * 0.15 - r, canvas_size * 0.15 - r),
             (canvas_size * 0.15 + r, canvas_size * 0.15 + r)],
            fill=(255, 255, 255, alpha)
        )
    highlight = highlight.filter(ImageFilter.GaussianBlur(30))
    img = Image.alpha_composite(img, highlight)
    draw = ImageDraw.Draw(img)

    # 5. Central 3D Icon: Layered Winged Codex / MindSprint Neural Folio
    # Draw multiple 3D open book pages with champagne gold leafing
    pages_layer = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    p_draw = ImageDraw.Draw(pages_layer)

    # Spine Coordinates
    spine_x = center
    spine_top = center - canvas_size * 0.22
    spine_bottom = center + canvas_size * 0.24

    # Back Page Shadow
    p_draw.polygon([
        (spine_x - 10, spine_top + 40),
        (center - canvas_size * 0.28, center + canvas_size * 0.05),
        (spine_x - 10, spine_bottom + 15)
    ], fill=(180, 150, 100, 90))

    p_draw.polygon([
        (spine_x + 10, spine_top + 40),
        (center + canvas_size * 0.28, center + canvas_size * 0.05),
        (spine_x + 10, spine_bottom + 15)
    ], fill=(180, 150, 100, 90))

    # Left Wings / Pages (3 tiers of progressive depth)
    left_tiers = [
        # (width_ratio, height_ratio, y_shift, fill_color, border_color)
        (0.28, 0.24, 0, (230, 190, 110, 240), (255, 235, 175, 255)),
        (0.24, 0.21, 20, (215, 175, 95, 220), (245, 220, 150, 240)),
        (0.19, 0.17, 40, (195, 155, 80, 200), (235, 205, 130, 220))
    ]

    for w_ratio, h_ratio, y_shift, fill_c, border_c in left_tiers:
        pts = [
            (spine_x - 6, spine_top + y_shift),
            (center - canvas_size * w_ratio, center - canvas_size * 0.04 + y_shift),
            (center - canvas_size * (w_ratio * 0.85), center + canvas_size * 0.16 + y_shift),
            (spine_x - 6, spine_bottom + (y_shift * 0.5))
        ]
        p_draw.polygon(pts, fill=fill_c)
        p_draw.line(pts + [pts[0]], fill=border_c, width=4)

    # Right Wings / Pages (Symmetrical)
    for w_ratio, h_ratio, y_shift, fill_c, border_c in left_tiers:
        pts = [
            (spine_x + 6, spine_top + y_shift),
            (center + canvas_size * w_ratio, center - canvas_size * 0.04 + y_shift),
            (center + canvas_size * (w_ratio * 0.85), center + canvas_size * 0.16 + y_shift),
            (spine_x + 6, spine_bottom + (y_shift * 0.5))
        ]
        p_draw.polygon(pts, fill=fill_c)
        p_draw.line(pts + [pts[0]], fill=border_c, width=4)

    # Central Optical Ray-Traced Spine Column (Brushed Gold & Pure White Core)
    p_draw.rounded_rectangle(
        [(spine_x - 12, spine_top - 15), (spine_x + 12, spine_bottom + 10)],
        radius=12,
        fill=(255, 250, 235, 255),
        outline=(180, 140, 65, 255),
        width=3
    )

    # The MindSprint Cognitive Starburst / Apex Diamond at Top of Spine
    star_y = spine_top - 45
    star_r = 32
    p_draw.polygon([
        (spine_x, star_y - star_r),
        (spine_x + star_r * 0.45, star_y - star_r * 0.3),
        (spine_x + star_r, star_y),
        (spine_x + star_r * 0.45, star_y + star_r * 0.3),
        (spine_x, star_y + star_r),
        (spine_x - star_r * 0.45, star_y + star_r * 0.3),
        (spine_x - star_r, star_y),
        (spine_x - star_r * 0.45, star_y - star_r * 0.3)
    ], fill=(255, 255, 255, 255), outline=(225, 185, 105, 255))

    pages_layer = pages_layer.filter(ImageFilter.GaussianBlur(1))
    img = Image.alpha_composite(img, pages_layer)

    # 6. High-Precision Downsample to Target Size (1024x1024)
    final_icon = img.resize((size, size), Image.Resampling.LANCZOS)
    
    # Apple App Store standard: RGB with no alpha
    final_rgb = Image.new("RGB", (size, size), (250, 248, 244))
    final_rgb.paste(final_icon, (0, 0), final_icon)

    final_rgb.save(output_path, "PNG", quality=100)
    print(f"[OK] Master 1024x1024 photoready AppIcon generated: {output_path}")

    # Also save to logo.png for web
    web_logo_path = output_path.replace("AppIcon.png", "logo.png")
    final_icon.save(web_logo_path, "PNG")
    print(f"[OK] Web logo PNG generated: {web_logo_path}")

create_photoready_app_icon()
