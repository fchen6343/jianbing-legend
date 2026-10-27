# 美术方向与生成记录 / Art direction and generation record

v0.4.0 使用内置图片生成工具制作项目内原创素材，未调用付费 API 或第三方图片库。素材实际用于游戏，不只是效果图。原背景 street.png 沿用 v0.3.0。
v0.4.0 uses the built-in image generator for original project assets, without paid API calls or stock libraries. These are actual game assets, not just mockups. street.png is retained from v0.3.0.

- `assets/neighbors-v2.png`：四名街坊 / 老板，透明背景。1254 × 1254。
  Four neighbor/owner portraits on transparency, 1254 × 1254.
- `assets/kitchen-v2.png`：13 种食材、5 种操作物件、酱刷、金币，透明背景。1122 × 1402。
  Thirteen ingredients, five cooking/packing/discard objects, a brush and a coin, on transparency, 1122 × 1402.

图集使用源矩形在运行时读取，未重绘生成图片。生成网格并非绝对等高，裁切边界按透明间隔校正。当前只有静态角色姿势，进出和补货移动由代码实现；不声称已实现骨骼动作或面部口型。
The renderer samples atlas source rectangles without repainting the generated images. Unequal generated rows are handled with calibrated transparent gaps. Characters currently have static poses; code animates entry, exit and restocking, with no skeletal animation or lip sync claimed.

## 顾客图集提示词 / Character atlas prompt

Use case: stylized-concept. Production game asset for an original warm Chinese street-food cooking game, polished hand-painted 2D cartoon, soft painterly shading, clean warm brown outlines, believable friendly neighborhood people, slightly exaggerated but not geometric or chibi, golden-hour light from upper left. Create ONE TRANSPARENT sprite atlas in an exact 2 columns by 2 rows equal-cell square grid. Four separate front-facing waist-up characters, one centered per cell, isolated on real transparency, generous 8% transparent margins in every cell, no overlap, no text, no labels, no panels, no background, no tools or scenery. Top-left: Chinese university student young man, messy short black hair, round glasses, sage-green overshirt, backpack straps, happy attentive face. Top-right: Chinese young office woman, tied-back dark hair, cream cardigan over dusty coral blouse, warm confident smile. Bottom-left: elderly Chinese neighborhood man, gray hair, square glasses, dark teal traditional casual jacket, friendly amused smile. Bottom-right: middle-aged Chinese male stall owner, small moustache, orange-red apron over cream shirt, cloth cook's cap, friendly face, holding a small wooden ingredient crate at waist. All four have detailed expressive faces, naturally drawn hands at waist level, consistent head sizes and matching painterly illustration style. Each character fully contained in their own equal square cell, visible from above head to waist; do not crop any head or arm. Warm cream, rust, sage and teal palette. This is an in-game atlas, not a concept sheet; absolutely no typography.

## 食材工具图集提示词 / Ingredient and tool atlas prompt

Use case: stylized-concept. Production sprite atlas for an original polished Chinese jianbing stall cooking game. Warm hand-painted 2D cartoon, golden light upper left, appetizing soft painterly shading, clean brown contour, readable small silhouettes, consistent with a beautiful cozy illustrated Chinese street market. ONE atlas with EXACTLY 4 columns and 5 rows, TWENTY equal SQUARE cells. Portrait 4:5 overall composition. TRUE transparent background between isolated items, every sprite centered in own cell with 15% transparent margin, no overlap. NO TEXT, NO LABELS, NO borders, NO cards, NO checkerboard, NO shadows crossing cells. In READING ORDER left to right top to bottom: row1: (1) cream ceramic pitcher of yellow pancake batter with pouring lip, (2) two whole fresh eggs one cracked showing yolk, (3) pile of chopped green scallions, (4) fresh cilantro sprigs. Row2: (5) small mound of white sesame seeds, (6) glossy dark brown sweet bean sauce dollop with spoon, (7) red chili sauce dollop with spoon, (8) two golden bubbly rectangular fried cracker sheets. Row3: (9) neatly stacked pink ham slices, (10) caramelized grilled pork strips, (11) shiny reddish grilled sausage with grill marks, (12) fresh ruffled green lettuce leaves. Row4: (13) golden crumb-coated fried chicken strips, (14) wooden T-shaped pancake spreader, (15) broad stainless steel spatula with wooden handle, (16) folded golden triangular Chinese pancake. Row5: (17) upright open kraft paper food bag with orange sun emblem but no lettering, (18) small dark metal waste bucket, (19) traditional bamboo sauce brush, (20) gold coin with simple square hole. All food shown as loose food with NO dishes or containers except the batter pitcher; tools shown in angled three-quarter perspective. Precise regular aligned sprite grid for use via source rectangles in a real game. Original artwork, no branding, no typography, no full UI mockup.

上面保留原始英文提示词以便复现；实际输出尺寸及裁切以文件和渲染代码为准。
The original English prompts are retained for reproducibility; actual dimensions and sampling are defined by the saved files and renderer.

## v0.7.0 原生质感与动作 / Native finish and motion

本轮直接细化 `Scene.foodArt` 中的向量绘制：暖色渐变、食物表面纹理、起泡与叶脉；没有生成或下载新的位图。敲蛋、脆片碎屑、工具握持和折叠由 Canvas 动画绘制。所有音效在 `Sound` 内通过 Web Audio 噪声过滤、短音与包络合成，不使用第三方录音。
This iteration refines vector drawing in `Scene.foodArt` with warm gradients, surface textures, blisters and veins, with no generated/downloaded bitmaps. Canvas draws cracking eggs, crumbs, held tools and folding. `Sound` synthesizes effects using Web Audio filtered noise, tones and envelopes, without third-party recordings.


## v0.8.0 内置图片生成 / Built-in image generation

四套原创素材以新文件保存，保留已有历史素材。使用内置 image_gen，非 CLI；图集裁切在渲染时完成，未修改生成图像。
Four original sets are saved as sibling assets using built-in image_gen, not CLI. Atlas sampling occurs in the renderer; generated files are unmodified.

### toon_people_prompt

```text
Use case: stylized-concept. Asset type: production sprite atlas for a cheerful Chinese street food cooking game. Four original exaggerated 2D cartoon people, NOT realistic and NOT anime. Bold dark-brown ink outlines, chunky silhouettes, big heads, small expressive bodies, flat warm saturated colors, simple cel shading, hand-drawn casual mobile game style. STRICT square 2 by 2 evenly spaced grid on genuinely TRANSPARENT background, no text, no grid lines. Each cell contains exactly one waist-up person fully inside its cell with 12% empty margins. Top-left: goofy bespectacled Chinese male student with huge round head, small torso, green hoodie, excited grin. Top-right: cheerful Chinese female office worker, orange jacket, large playful eyes, round face. Bottom-left: funny elderly Chinese neighbor, bushy white eyebrows, blue jacket, broad round nose and happy smile. Bottom-right: jovial Chinese cook owner in red apron, tiny chef cap, curled moustache, short arms holding a vegetable basket. All face camera, same waist-up scale, simplified hands natural and rounded, readable at 150 pixels. Strongly caricatured cartoon proportions, clean polished outlined illustration. Avoid photographs, realistic skin, painterly rendering, detailed facial anatomy, 3D, gradients, watermarks, lettering.
```

### toon_food_prompt

```text
Use case: stylized-concept. Production game sprite atlas, 16 distinct appetizing CARTOON food assets in a STRICT evenly spaced 4 columns by 4 rows square grid, genuinely TRANSPARENT background. No text, no labels, no grid lines, no containers except batter pitcher and sauce bowls. All items entirely inside their own equal square cells with generous 18% transparent margin, no touching neighbors. Warm saturated casual 2D cooking game art, bold dark brown outlines, chunky readable silhouettes, simple cel highlights, hand illustrated, NOT realistic, NOT 3D, NOT tiny geometric placeholders. Readable when reduced to 64 pixels. Exact row-major order: row1 (1) cream batter pitcher with visible pour spout and handle, (2) ONE large uncracked tan chicken egg with shine, (3) pile of chopped green scallion RINGS with hollow pale centers, (4) cilantro bunch with distinct lobed leaves and stems. Row2: (5) mound of sesame seeds, (6) small shallow bowl of glossy dark brown sweet bean sauce, (7) small shallow bowl of red chili sauce with pepper flecks, (8) ONE large paper-thin irregular rectangular golden Chinese guobier fried crisp sheet with big bubbled surface and broken corner. Row3: (9) stacked pink ham slices, (10) browned pork strips with grill marks, (11) three reddish scored grilled sausages, (12) three broad ruffled lettuce leaves. Row4: (13) golden breaded chicken strips with crunchy crumbs, (14) ONE unmistakable YOUTIAO Chinese fried dough: TWO LONG THIN CONNECTED sticks, each 4 times longer than wide, vertical diagonal orientation, puffy bumpy fried surface, central seam; absolutely not biscuits or toast, (15) folded rectangular golden jianbing pancake with scallions and crisp visible at open end, (16) one cute kraft paper food bag with scalloped open mouth, no logo no letters. Uniform illustrated game art and consistent outline weight, warm natural colors, clean alpha edges.
```

### toon_hands_prompt

```text
Use case: stylized-concept. Production SPRITE ATLAS for a 2D cartoon cooking game. Wide horizontal image, exactly THREE equal columns in ONE row, generous transparent gutters, truly TRANSPARENT background. No words, no panels, no grid lines, no other objects. Original bold dark brown outlined cartoon art, warm friendly colors and clean cel shading; chunky natural rounded hands like hand-drawn casual mobile games, never photorealistic or 3D. Each column shows ONE correctly drawn hand with a short forearm in a rolled-up cream cook sleeve entering from the BOTTOM RIGHT of its own cell, fingers naturally wrapped around the object, consistent right hand and style across columns. Column1: right hand holding the wooden HANDLE of a traditional Chinese pancake T-shaped wooden spreader; the horizontal wooden scraping blade points toward upper LEFT, fingertips grip the long handle far away from the blade, tool and arm fully fit within cell. Column2: right hand holding the wooden handle of a food basting brush, brush head with short brown bristles pointing toward upper LEFT, thumb and fingers visibly grip handle, wrist connected to sleeve. Column3: empty sneaky hand reaching toward upper LEFT in a loose pinching gesture to grab a snack, visible separated index finger and thumb, playful blue sleeve instead of cream. Natural hand anatomy, exactly five fingers per hand, no disconnected fingers, no floating fist, no black glove, avoid overlapping columns. Large readable silhouettes, simple cartoon material shapes.
```

### toon_street_prompt

```text
Use case: stylized-concept. Asset type: full-screen 16:9 landscape background for an original Chinese street-food CARTOON cooking game, first-person standing behind a pancake stall. Fully opaque illustration. Strong bold dark brown outlines, simple rounded building shapes, cheerful saturated warm colors, clean flat cel shading, exaggerated cozy casual mobile-game cartoon design. Absolutely no realism, no painterly realistic textures, no 3D, no tiny photographic details. Composition crucial: upper 55 percent shows a cheerful Chinese neighborhood pedestrian street receding to a vanishing point at center, squat cozy storefronts on left and right with yellow awnings, red lanterns and rounded trees; keep central street empty and unobstructed for character sprites to be overlaid. LOWER 45 percent is a continuous warm honey-colored wooden stall countertop, viewed at a mild downward angle, nearly blank, with simple broad wood grain and dark bold front edge along bottom. No characters, no hands, no food, no griddle, no tools, no UI, no legible text, no logos, no watermark. Smooth ink outlines and simplified cartoon colors, daylight, friendly and playful.
```

