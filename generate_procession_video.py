import os
import math
import subprocess
from PIL import Image, ImageDraw, ImageFilter

def build_procession_animation():
    input_path = "assets/images/impact-cinematic-scene.jpg"
    clean_plate_path = "assets/images/impact-clean-plate.png"
    output_mp4 = "assets/videos/impact-cinematic.mp4"
    output_webm = "assets/videos/impact-cinematic.webm"
    
    # 1. Load clean plate or generate it if not present
    if not os.path.exists(clean_plate_path):
        base_img = Image.open(input_path).convert("RGB")
        clean = base_img.copy()
        for y in range(1060, 1145):
            left_samples = [base_img.getpixel((x, y)) for x in range(275, 295) if base_img.getpixel((x, y))[0] > 180]
            right_samples = [base_img.getpixel((x, y)) for x in range(395, 415) if base_img.getpixel((x, y))[0] > 180]
            col_l = [sum(s[i] for s in left_samples)/len(left_samples) for i in range(3)] if left_samples else [220, 218, 212]
            col_r = [sum(s[i] for s in right_samples)/len(right_samples) for i in range(3)] if right_samples else col_l
            for x in range(290, 405):
                r, g, b = clean.getpixel((x, y))
                if r < 140 and g < 140 and b < 140:
                    tx = (x - 290) / 115.0
                    r_val = int(col_l[0] * (1 - tx) + col_r[0] * tx)
                    g_val = int(col_l[1] * (1 - tx) + col_r[1] * tx)
                    b_val = int(col_l[2] * (1 - tx) + col_r[2] * tx)
                    clean.putpixel((x, y), (r_val, g_val, b_val))
        patch = clean.crop((285, 1055, 410, 1150)).filter(ImageFilter.GaussianBlur(1.2))
        clean.paste(patch, (285, 1055))
        clean.save(clean_plate_path)
    
    clean_img = Image.open(clean_plate_path).convert("RGB")
    W, H = clean_img.size # 768 x 1376
    
    # Pre-render Sun center & mist layers
    sun_x, sun_y = 531.0, 704.0
    sun_rad = 120.0
    
    # Soft mist layer 1
    mist_1 = Image.new("RGBA", (W + 160, H), (0, 0, 0, 0))
    d_m1 = ImageDraw.Draw(mist_1)
    for i in range(12):
        mx = i * 110
        d_m1.ellipse([mx - 60, 780, mx + 200, 850], fill=(245, 240, 230, 42))
        d_m1.ellipse([mx, 810, mx + 240, 875], fill=(240, 235, 222, 35))
    mist_1 = mist_1.filter(ImageFilter.GaussianBlur(28))

    # Soft mist layer 2
    mist_2 = Image.new("RGBA", (W + 200, H), (0, 0, 0, 0))
    d_m2 = ImageDraw.Draw(mist_2)
    for i in range(10):
        mx = i * 140
        d_m2.ellipse([mx - 80, 850, mx + 260, 920], fill=(248, 242, 235, 36))
    mist_2 = mist_2.filter(ImageFilter.GaussianBlur(32))

    # Load / create sprites
    sprite_files = ['sprite_fig1.png', 'sprite_fig2.png', 'sprite_fig3.png', 'sprite_fig4.png', 'sprite_fig5.png', 'sprite_fig6.png']
    sprites = []
    for sf in sprite_files:
        if os.path.exists(sf):
            sprites.append(Image.open(sf).convert("RGBA"))
        else:
            # Fallback simple elegant figure
            sp = Image.new("RGBA", (20, 50), (0, 0, 0, 0))
            d = ImageDraw.Draw(sp)
            d.ellipse([6, 2, 14, 10], fill=(35, 32, 30, 255))
            d.polygon([(4, 11), (16, 11), (18, 34), (2, 34)], fill=(35, 32, 30, 255))
            d.rectangle([5, 34, 9, 49], fill=(35, 32, 30, 255))
            d.rectangle([11, 34, 15, 49], fill=(35, 32, 30, 255))
            sprites.append(sp)

    # Flag sprite
    flag_sprite = None
    if os.path.exists('sprite_flag.png'):
        flag_sprite = Image.open('sprite_flag.png').convert("RGBA")
    else:
        flag_sprite = sprites[1].copy()

    # Road spline nodes: s in [0.0, 1.0]
    nodes = [
        (0.00, 640, 1370, 190, 1.38),
        (0.08, 510, 1310, 200, 1.28),
        (0.18, 340, 1255, 165, 1.18),
        (0.28, 245, 1200, 125, 1.10),
        (0.35, 250, 1165, 110, 1.04),
        (0.42, 310, 1135, 150, 0.98),
        (0.50, 360, 1105, 180, 0.94), # Start region of original figures
        (0.58, 430, 1075, 170, 0.86),
        (0.66, 510, 1045, 130, 0.78),
        (0.74, 430, 1005, 110, 0.70),
        (0.82, 370, 955, 140, 0.62),
        (0.89, 360, 920, 80, 0.54),
        (0.93, 395, 890, 80, 0.48),
        (0.97, 420, 855, 110, 0.43),
        (1.00, 430, 825, 130, 0.38)
    ]

    def get_road_data(s):
        s = max(0.0, min(1.0, s))
        for i in range(len(nodes)-1):
            s0, x0, y0, w0, sc0 = nodes[i]
            s1, x1, y1, w1, sc1 = nodes[i+1]
            if s0 <= s <= s1:
                t = (s - s0) / (s1 - s0)
                t_smooth = t * t * (3 - 2 * t)
                x = x0 + (x1 - x0) * t_smooth
                y = y0 + (y1 - y0) * t_smooth
                width = w0 + (w1 - w0) * t
                scale = sc0 + (sc1 - sc0) * t
                return x, y, width, scale
        return nodes[-1][1], nodes[-1][2], nodes[-1][3], nodes[-1][4]

    # Pre-render walk cycle deformations for each sprite
    # 8 phases per walk cycle
    walk_cache = {}
    def get_walk_sprite(sp, phase, flip=False, is_flag=False):
        key = (id(sp), int((phase % (2 * math.pi)) / (2 * math.pi) * 8), flip, is_flag)
        if key in walk_cache:
            return walk_cache[key]
        
        bw, bh = sp.size
        pad = 8
        canvas = Image.new('RGBA', (bw + pad * 2, bh + pad * 2), (0, 0, 0, 0))
        stride = math.sin(phase)
        # Gentle, graceful vertical bob for calm walking pace
        bob = abs(math.cos(phase)) * 1.2
        
        if is_flag:
            split_y = int(bh * 0.70)
        else:
            split_y = int(bh * 0.55)
            
        torso = sp.crop((0, 0, bw, split_y))
        legs = sp.crop((0, split_y, bw, bh))
        
        leg_w = max(4, int(bw * (1.0 + 0.11 * abs(stride))))
        legs_scaled = legs.resize((leg_w, bh - split_y), Image.Resampling.BILINEAR)
        
        sway = stride * 0.9
        torso_rot = torso.rotate(sway, resample=Image.Resampling.BICUBIC, expand=True)
        tw, th = torso_rot.size
        
        tx = pad + (bw - tw) // 2
        ty = pad - int(bob)
        canvas.paste(torso_rot, (tx, ty), torso_rot)
        
        lw, lh = legs_scaled.size
        lx = pad + (bw - lw) // 2 + int(stride * 0.9)
        ly = pad + split_y - int(bob * 0.4)
        canvas.paste(legs_scaled, (lx, ly), legs_scaled)
        
        bbox = canvas.getbbox()
        res = canvas.crop(bbox) if bbox else canvas
        if flip:
            res = res.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        walk_cache[key] = res
        return res

    # Define the community of walkers with stately, calm, graceful speeds:
    # 1. Core initial pioneers (6 original figures)
    # 2. Joiners from behind (followers catching up)
    # 3. Joiners from left hillside trail (banyan tree roots)
    # 4. Joiners from right mountain trail
    # 5. Subsequent waves of youths & citizens joining the march
    walkers = [
        # --- Group 1: Original 6 pioneers (already on road at t=0, walking slowly) ---
        {
            'id': 'lead_1', 'sprite_idx': 0, 'flip': False, 'is_flag': False,
            'entry': 'road', 's_start': 0.49, 'lane': -0.22, 'speed': 0.0125,
            't_join': 0.0, 'scale_mul': 1.0, 'phase_offset': 0.0
        },
        {
            'id': 'lead_2', 'sprite_idx': 1, 'flip': False, 'is_flag': False,
            'entry': 'road', 's_start': 0.50, 'lane': -0.05, 'speed': 0.0130,
            't_join': 0.0, 'scale_mul': 0.98, 'phase_offset': 1.2
        },
        {
            'id': 'lead_3', 'sprite_idx': 2, 'flip': False, 'is_flag': False,
            'entry': 'road', 's_start': 0.51, 'lane': 0.14, 'speed': 0.0125,
            't_join': 0.0, 'scale_mul': 0.95, 'phase_offset': 2.4
        },
        {
            'id': 'lead_4', 'sprite_idx': 3, 'flip': False, 'is_flag': False,
            'entry': 'road', 's_start': 0.48, 'lane': 0.26, 'speed': 0.0120,
            't_join': 0.0, 'scale_mul': 0.90, 'phase_offset': 3.6
        },
        {
            'id': 'lead_5', 'sprite_idx': 4, 'flip': True, 'is_flag': False,
            'entry': 'road', 's_start': 0.52, 'lane': -0.12, 'speed': 0.0135,
            't_join': 0.0, 'scale_mul': 0.92, 'phase_offset': 4.8
        },
        {
            'id': 'lead_6', 'sprite_idx': 5, 'flip': False, 'is_flag': False,
            'entry': 'road', 's_start': 0.53, 'lane': 0.08, 'speed': 0.0130,
            't_join': 0.0, 'scale_mul': 0.96, 'phase_offset': 0.8
        },

        # --- Group 2: First wave of joiners from behind catching up calmly ---
        {
            'id': 'join_rear_1', 'sprite_idx': 1, 'flip': False, 'is_flag': False,
            'entry': 'road', 's_start': 0.43, 'lane': -0.18, 'speed': 0.0165,
            't_join': 0.4, 'scale_mul': 1.02, 'phase_offset': 1.5
        },
        {
            'id': 'join_rear_2', 'sprite_idx': 0, 'flip': True, 'is_flag': False,
            'entry': 'road', 's_start': 0.41, 'lane': 0.12, 'speed': 0.0170,
            't_join': 0.6, 'scale_mul': 1.05, 'phase_offset': 2.7
        },
        {
            'id': 'join_rear_3', 'sprite_idx': 2, 'flip': False, 'is_flag': True, # Flag bearer!
            'entry': 'road', 's_start': 0.39, 'lane': -0.02, 'speed': 0.0160,
            't_join': 0.8, 'scale_mul': 0.96, 'phase_offset': 3.9
        },

        # --- Group 3: Side joiners stepping in gently from Left Hillside (Banyan Tree Path) ---
        {
            'id': 'join_left_1', 'sprite_idx': 3, 'flip': False, 'is_flag': False,
            'entry': 'side_left', 's_target': 0.46, 'lane_target': -0.25,
            'speed': 0.0135, 't_join': 1.5, 'scale_mul': 0.94, 'phase_offset': 0.5
        },
        {
            'id': 'join_left_2', 'sprite_idx': 4, 'flip': False, 'is_flag': False,
            'entry': 'side_left', 's_target': 0.44, 'lane_target': -0.08,
            'speed': 0.0140, 't_join': 2.0, 'scale_mul': 0.96, 'phase_offset': 2.1
        },

        # --- Group 4: Side joiners stepping in gently from Right Mountain Trail ---
        {
            'id': 'join_right_1', 'sprite_idx': 5, 'flip': True, 'is_flag': False,
            'entry': 'side_right', 's_target': 0.48, 'lane_target': 0.22,
            'speed': 0.0140, 't_join': 2.5, 'scale_mul': 0.95, 'phase_offset': 3.2
        },
        {
            'id': 'join_right_2', 'sprite_idx': 1, 'flip': True, 'is_flag': False,
            'entry': 'side_right', 's_target': 0.50, 'lane_target': 0.10,
            'speed': 0.0135, 't_join': 3.0, 'scale_mul': 0.98, 'phase_offset': 4.5
        },

        # --- Group 5: Second wave of youth coming up along the road ---
        {
            'id': 'wave2_1', 'sprite_idx': 0, 'flip': False, 'is_flag': False,
            'entry': 'road', 's_start': 0.33, 'lane': -0.20, 'speed': 0.0175,
            't_join': 2.2, 'scale_mul': 1.06, 'phase_offset': 0.3
        },
        {
            'id': 'wave2_2', 'sprite_idx': 2, 'flip': True, 'is_flag': False,
            'entry': 'road', 's_start': 0.31, 'lane': 0.05, 'speed': 0.0170,
            't_join': 2.5, 'scale_mul': 1.04, 'phase_offset': 1.7
        },
        {
            'id': 'wave2_3', 'sprite_idx': 3, 'flip': False, 'is_flag': False,
            'entry': 'road', 's_start': 0.29, 'lane': 0.24, 'speed': 0.0180,
            't_join': 2.8, 'scale_mul': 1.05, 'phase_offset': 2.9
        },
        {
            'id': 'wave2_4', 'sprite_idx': 4, 'flip': False, 'is_flag': True, # Second banner bearer!
            'entry': 'road', 's_start': 0.26, 'lane': -0.10, 'speed': 0.0165,
            't_join': 3.2, 'scale_mul': 1.02, 'phase_offset': 4.1
        },
        {
            'id': 'wave2_5', 'sprite_idx': 5, 'flip': True, 'is_flag': False,
            'entry': 'road', 's_start': 0.25, 'lane': 0.15, 'speed': 0.0175,
            't_join': 3.5, 'scale_mul': 1.05, 'phase_offset': 5.2
        },

        # --- Group 6: Grand procession joining from the lower road curves ---
        {
            'id': 'grand_1', 'sprite_idx': 1, 'flip': False, 'is_flag': False,
            'entry': 'road', 's_start': 0.21, 'lane': -0.25, 'speed': 0.0185,
            't_join': 3.8, 'scale_mul': 1.12, 'phase_offset': 0.6
        },
        {
            'id': 'grand_2', 'sprite_idx': 0, 'flip': True, 'is_flag': False,
            'entry': 'road', 's_start': 0.19, 'lane': 0.00, 'speed': 0.0180,
            't_join': 4.1, 'scale_mul': 1.15, 'phase_offset': 1.9
        },
        {
            'id': 'grand_3', 'sprite_idx': 2, 'flip': False, 'is_flag': False,
            'entry': 'road', 's_start': 0.17, 'lane': 0.22, 'speed': 0.0190,
            't_join': 4.4, 'scale_mul': 1.12, 'phase_offset': 3.1
        },
        {
            'id': 'grand_4', 'sprite_idx': 3, 'flip': True, 'is_flag': False,
            'entry': 'road', 's_start': 0.14, 'lane': -0.12, 'speed': 0.0175,
            't_join': 4.8, 'scale_mul': 1.18, 'phase_offset': 4.3
        },
        {
            'id': 'grand_5', 'sprite_idx': 4, 'flip': False, 'is_flag': True, # Banner in procession
            'entry': 'road', 's_start': 0.12, 'lane': 0.12, 'speed': 0.0185,
            't_join': 5.2, 'scale_mul': 1.14, 'phase_offset': 5.5
        },
        {
            'id': 'grand_6', 'sprite_idx': 5, 'flip': True, 'is_flag': False,
            'entry': 'road', 's_start': 0.09, 'lane': -0.22, 'speed': 0.0180,
            't_join': 5.6, 'scale_mul': 1.16, 'phase_offset': 0.9
        },
        {
            'id': 'grand_7', 'sprite_idx': 1, 'flip': False, 'is_flag': False,
            'entry': 'road', 's_start': 0.07, 'lane': 0.02, 'speed': 0.0185,
            't_join': 6.0, 'scale_mul': 1.14, 'phase_offset': 2.1
        },
        {
            'id': 'grand_8', 'sprite_idx': 0, 'flip': False, 'is_flag': False,
            'entry': 'road', 's_start': 0.05, 'lane': 0.25, 'speed': 0.0175,
            't_join': 6.3, 'scale_mul': 1.15, 'phase_offset': 3.3
        }
    ]

    fps = 24
    duration = 10.0
    total_frames = int(fps * duration) # 216 frames
    print(f"Starting cinematic procession rendering: {total_frames} frames ({duration}s @ {fps}fps)...")

    # Start ffmpeg pipe for MP4
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{W}x{H}",
        "-pix_fmt", "rgb24",
        "-r", str(fps),
        "-i", "-",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "18",
        "-preset", "medium",
        "-movflags", "+faststart",
        output_mp4
    ]
    pipe = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)

    # Pre-render frames in memory or stream directly
    # For seamless looping: blend last 1.2s (28 frames) into first 1.2s
    loop_blend_frames = 28

    # To do seamless loop blending, we can generate all frames into memory or a temporary buffer
    # 216 frames of 768x1376 RGB is ~ 650 MB RAM, easily handled in memory!
    all_frames = []

    for frame_idx in range(total_frames):
        t = frame_idx / fps # time in seconds
        t_norm = frame_idx / total_frames
        phase = t_norm * 2.0 * math.pi

        # 1. Slow camera push-in
        zoom = 1.0 + 0.030 * (1.0 - math.cos(phase)) / 2.0
        crop_w = int(W / zoom)
        crop_h = int(H / zoom)
        center_x = W * 0.5 + (sun_x - W * 0.5) * 0.22 * (zoom - 1.0) / 0.030
        center_y = H * 0.5 + (sun_y - H * 0.5) * 0.22 * (zoom - 1.0) / 0.030
        x0 = max(0, min(W - crop_w, int(center_x - crop_w / 2)))
        y0 = max(0, min(H - crop_h, int(center_y - crop_h / 2)))

        # Clean plate crop
        frame_crop = clean_img.crop((x0, y0, x0 + crop_w, y0 + crop_h)).resize((W, H), Image.Resampling.LANCZOS)
        frame_rgba = frame_crop.convert("RGBA")

        # 2. Golden sunlight pulse & rays
        sun_pulse = 0.5 + 0.5 * math.sin(phase)
        cur_sun_x = (sun_x - x0) * (W / crop_w)
        cur_sun_y = (sun_y - y0) * (H / crop_h)
        cur_sun_rad = sun_rad * zoom

        sun_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d_glow = ImageDraw.Draw(sun_layer)
        glow_rad = cur_sun_rad * (1.3 + 0.22 * sun_pulse)
        d_glow.ellipse(
            [cur_sun_x - glow_rad, cur_sun_y - glow_rad, cur_sun_x + glow_rad, cur_sun_y + glow_rad],
            fill=(255, 175, 50, int(32 + 25 * sun_pulse))
        )
        outer_rad = glow_rad * 1.55
        d_glow.ellipse(
            [cur_sun_x - outer_rad, cur_sun_y - outer_rad, cur_sun_x + outer_rad, cur_sun_y + outer_rad],
            fill=(255, 195, 75, int(16 + 14 * sun_pulse))
        )
        for r_i in range(12):
            ray_ang = (r_i / 12.0) * 2.0 * math.pi + 0.06 * math.sin(phase)
            rx = cur_sun_x + glow_rad * 1.7 * math.cos(ray_ang)
            ry = cur_sun_y + glow_rad * 1.7 * math.sin(ray_ang)
            if ry < cur_sun_y + 35:
                d_glow.line([(cur_sun_x, cur_sun_y), (rx, ry)], fill=(255, 185, 60, int(14 + 10 * sun_pulse)), width=6)
        sun_layer = sun_layer.filter(ImageFilter.GaussianBlur(16))
        frame_rgba = Image.alpha_composite(frame_rgba, sun_layer)

        # 3. Drifting mountain mists
        drift1 = int(math.sin(phase) * 32) + 32
        drift2 = int(math.cos(phase) * 40) + 40
        m1_crop = mist_1.crop((drift1, 0, drift1 + W, H)).crop((x0, y0, x0 + crop_w, y0 + crop_h)).resize((W, H), Image.Resampling.BILINEAR)
        m2_crop = mist_2.crop((drift2, 0, drift2 + W, H)).crop((x0, y0, x0 + crop_w, y0 + crop_h)).resize((W, H), Image.Resampling.BILINEAR)
        frame_rgba = Image.alpha_composite(frame_rgba, m1_crop)
        frame_rgba = Image.alpha_composite(frame_rgba, m2_crop)

        # 4. Procession of walking figures along the road
        # Create an overlay layer for figures & shadows
        figures_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d_fig = ImageDraw.Draw(figures_layer)

        # Compute position & state for each walker at time t
        active_walkers = []
        for wkr in walkers:
            if t < wkr['t_join']:
                continue # hasn't joined yet
            
            elapsed = t - wkr['t_join']
            
            if wkr['entry'] == 'road':
                # Continuous walk along road spline
                s_curr = wkr['s_start'] + elapsed * wkr['speed']
                if s_curr > 1.02:
                    continue # reached far horizon
                
                # Get road data
                cx, cy, rw, sc = get_road_data(s_curr)
                px = cx + wkr['lane'] * rw * 0.55
                py = cy
                
            elif wkr['entry'] == 'side_left':
                # Steps in from left hillside onto the road over 1.4 seconds
                # Steps in from left hillside onto the road over 2.2 seconds (slow, gentle pace)
                t_in = min(1.0, elapsed / 2.2)
                # Left origin point off-road: near banyan roots (x ~ 190, y ~ 1140)
                cx, cy, rw, sc = get_road_data(wkr['s_target'])
                target_x = cx + wkr['lane_target'] * rw * 0.55
                target_y = cy
                origin_x = target_x - 90
                origin_y = target_y + 15
                
                if t_in < 1.0:
                    # Walking onto the road
                    t_smooth = t_in * t_in * (3 - 2 * t_in)
                    px = origin_x + (target_x - origin_x) * t_smooth
                    py = origin_y + (target_y - origin_y) * t_smooth
                    s_curr = wkr['s_target']
                else:
                    # Joined road, continuing to walk forward along spline
                    post_elapsed = elapsed - 2.2
                    s_curr = wkr['s_target'] + post_elapsed * wkr['speed']
                    cx, cy, rw, sc = get_road_data(s_curr)
                    px = cx + wkr['lane_target'] * rw * 0.55
                    py = cy
                    
            elif wkr['entry'] == 'side_right':
                # Steps in from right mountain trail onto the road over 2.2 seconds (slow, gentle pace)
                t_in = min(1.0, elapsed / 2.2)
                cx, cy, rw, sc = get_road_data(wkr['s_target'])
                target_x = cx + wkr['lane_target'] * rw * 0.55
                target_y = cy
                origin_x = target_x + 85
                origin_y = target_y + 10
                
                if t_in < 1.0:
                    t_smooth = t_in * t_in * (3 - 2 * t_in)
                    px = origin_x + (target_x - origin_x) * t_smooth
                    py = origin_y + (target_y - origin_y) * t_smooth
                    s_curr = wkr['s_target']
                else:
                    post_elapsed = elapsed - 2.2
                    s_curr = wkr['s_target'] + post_elapsed * wkr['speed']
                    cx, cy, rw, sc = get_road_data(s_curr)
                    px = cx + wkr['lane_target'] * rw * 0.55
                    py = cy

            # Apply camera zoom & crop transformation
            screen_x = (px - x0) * (W / crop_w)
            screen_y = (py - y0) * (H / crop_h)
            total_scale = sc * wkr['scale_mul'] * zoom
            
            # Slow, graceful walking cadence: ~1.25 steps/sec
            walk_phase = (elapsed * 2.0 * math.pi * 1.25) + wkr['phase_offset']
            
            # Fade in newly joining figures over first 0.4s
            alpha_mul = min(1.0, elapsed / 0.45)
            # Fade out figures as they enter the distant mountain pass haze
            if s_curr > 0.88:
                alpha_mul *= max(0.0, (1.02 - s_curr) / 0.14)
                
            active_walkers.append({
                'sx': screen_x,
                'sy': screen_y,
                'scale': total_scale,
                'phase': walk_phase,
                'alpha': alpha_mul,
                'sprite_idx': wkr['sprite_idx'],
                'flip': wkr['flip'],
                'is_flag': wkr['is_flag']
            })

        # Sort active walkers by Y (back to front sorting for proper depth occlusion)
        active_walkers.sort(key=lambda w: w['sy'])

        # Draw contact shadows first (behind all feet)
        for w in active_walkers:
            if w['alpha'] <= 0.01:
                continue
            sw_rad = 14 * w['scale']
            sh_rad = 4 * w['scale']
            sh_alpha = int(48 * w['alpha'])
            d_fig.ellipse(
                [w['sx'] - sw_rad, w['sy'] - sh_rad, w['sx'] + sw_rad, w['sy'] + sh_rad],
                fill=(28, 25, 23, sh_alpha)
            )

        # Draw figures
        for w in active_walkers:
            if w['alpha'] <= 0.01:
                continue
            base_sp = flag_sprite if w['is_flag'] else sprites[w['sprite_idx']]
            walk_sp = get_walk_sprite(base_sp, w['phase'], flip=w['flip'], is_flag=w['is_flag'])
            
            # Scale sprite
            new_w = max(4, int(walk_sp.width * w['scale']))
            new_h = max(10, int(walk_sp.height * w['scale']))
            walk_scaled = walk_sp.resize((new_w, new_h), Image.Resampling.BILINEAR)
            
            # Adjust opacity if needed
            if w['alpha'] < 0.99:
                r, g, b, a = walk_scaled.split()
                a = a.point(lambda p: int(p * w['alpha']))
                walk_scaled.putalpha(a)
                
            # Place sprite so its feet touch screen_y
            pos_x = int(w['sx'] - new_w // 2)
            pos_y = int(w['sy'] - new_h + 3 * w['scale'])
            figures_layer.paste(walk_scaled, (pos_x, pos_y), walk_scaled)

        # Composite figures onto frame
        frame_rgba = Image.alpha_composite(frame_rgba, figures_layer)

        final_rgb = frame_rgba.convert("RGB")
        all_frames.append(final_rgb)

        if frame_idx % 48 == 0 or frame_idx == total_frames - 1:
            print(f"Generated frame {frame_idx + 1}/{total_frames} ({(frame_idx+1)/total_frames*100:.1f}%)")

    # Seamless loop smoothing: crossfade the last `loop_blend_frames` frames into the first frames
    print(f"Applying seamless loop crossfade over {loop_blend_frames} frames...")
    final_output_frames = []
    for i in range(total_frames):
        if i < loop_blend_frames:
            # Blend end of video into start
            blend_w = i / loop_blend_frames # 0 -> 1
            f_start = all_frames[i]
            f_end = all_frames[total_frames - loop_blend_frames + i]
            blended = Image.blend(f_end, f_start, blend_w)
            final_output_frames.append(blended)
        elif i >= total_frames - loop_blend_frames:
            # Smoothly matches the blended start
            blend_w = (total_frames - 1 - i) / loop_blend_frames
            f_start = all_frames[i - (total_frames - loop_blend_frames)]
            f_end = all_frames[i]
            blended = Image.blend(f_start, f_end, blend_w)
            final_output_frames.append(blended)
        else:
            final_output_frames.append(all_frames[i])

    # Pipe all frames to FFmpeg
    print("Encoding MP4 with FFmpeg...")
    for f in final_output_frames:
        pipe.stdin.write(f.tobytes())
    pipe.stdin.close()
    pipe.wait()
    print(f"MP4 successfully generated: {output_mp4}")

    # Generate WebM for optimal browser support
    print("Generating WebM version for browser compatibility...")
    webm_cmd = [
        "ffmpeg", "-y",
        "-i", output_mp4,
        "-c:v", "libvpx-vp9",
        "-b:v", "1200k",
        "-crf", "28",
        "-an",
        output_webm
    ]
    subprocess.run(webm_cmd, check=True)
    print(f"WebM successfully generated: {output_webm}")

if __name__ == "__main__":
    build_procession_animation()
