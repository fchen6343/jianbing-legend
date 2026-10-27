# jianbing-legend · 煎饼摊传奇

煎饼摊传奇 — 第一视角中文街头煎饼摊经营游戏 / TypeScript + Canvas

Jianbing Legend — a first-person Chinese street-food stall game built with TypeScript and Canvas.

**在线试玩 / Play online:** https://fchen6343.github.io/jianbing-legend/

点击右上角 **English / 中文** 随时切换语言；偏好保存在当前浏览器。推荐桌面横屏。
Use **English / 中文** in the top-right corner to switch languages at any time. Your browser remembers the choice. A landscape desktop screen is recommended.

下载项目后打开 `play.html`，也可离线游玩。在线页面由 `docs/index.html` 提供；运行构建会同步更新。
For offline play, download the project and open `play.html`. GitHub Pages serves `docs/index.html`, refreshed by the build.

```sh
npm ci
npm test
npm run dev
```

开发服务器 / Development server: http://localhost:5173 (requires Python 3).

- [玩法与技术说明 / Gameplay and technical guide](docs/PROJECT_GUIDE.md)
- [开发日志 / Development log](DEVLOG.md)
- [路线图与已知限制 / Roadmap and known limitations](docs/ROADMAP.md)

当前为 v0.9.0 可玩原型，仍在迭代美术、动作与触屏体验。
v0.9.0 is a playable prototype. Artwork, animation and touch controls are still being refined.

## v0.4.0 · 暖色手作摊位 / Warm illustrated stall

- 统一绘制的街坊顾客、13 种食材与工具；直接点击实物，悬停或触摸时显示名称。
  Illustrated neighborhood characters, 13 ingredients and physical tools; names appear on hover or touch.
- 图标订单支持双蛋数量、完成勾选、额外配料警告和不要香菜；缺少的食材会发光提示。
  Icon orders show double eggs, completion checks, extra ingredients and no cilantro. Needed ingredients glow.
- 加料落下、翻面、折叠、收钱、入场和离场反馈；首次制作指导，之后保留简短下一步提示。
  Ingredient drops, flipping, folding, coin collection and customer transitions, with first-run coaching and compact next-action hints afterward.
- 顶部可暂停、切换声音与语言；Escape 暂停，切到其他页面自动暂停。
  Pause, sound and language controls are at the top. Escape pauses; switching away pauses automatically.

仍是可迭代原型；已加入本机经营存档与升级，尚无商业游戏级的骨骼动画或专业配音。
Still an iterative prototype, with local progression and upgrades, but without production skeletal animation or professional voice acting.

## v0.5.0 · 摊位经营 / Stall progression

- 首次开摊进入不限时实操教程；右上“新手教程”可重玩。练习不赚钱，完成后正式营业。
  First-time play starts a guided, untimed practice order. Replay it from Tutorial. Practice earns no money; real service follows.
- 鸡蛋也要拖动抹匀，翻面会隐藏背面材料；可重复加料（每种最多五份），订单会标出数量。
  Spread eggs before flipping. Back-side toppings are hidden after the flip. Add up to five portions of each ingredient; quantities are shown in orders.
- 参考真实摊位的小铁桶操作台，改进折叠、独立纸袋和偷吃手的收回动作。
  Stainless steel ingredient pails, improved folding, a single filled-bag drawing and retracting sneaky hands.
- 每单收入加入持久钱包，购买装饰提升魅力；每点魅力为新顾客增加 2% 等待，上限 50%。¥180 开店后最多五位顾客。
  Every paid order adds to the persistent wallet. Equipped decorations add 2% new-customer patience per charm point, capped at 50%. Open a shop for ¥180 to serve up to five customers.
- 春节、端午、中秋主题可在两局之间切换；当前活动正确出餐六份获得限定装扮，也有活动限定购买。
  Switch between Spring Festival, Dragon Boat and Mid-Autumn themes between days. Six correct orders earn the selected event's exclusive decoration; seasonal purchases are also available.
- “装饰与经营”中切换纯血天津人模式：配料只提供果子、果篦儿、甜面酱、辣椒酱、葱花和香菜，保留面糊与鸡蛋。
  Select Tianjin Purist Mode in Decorate & grow: youtiao, guobier, sweet sauce, chili sauce, scallions and cilantro, plus batter and eggs.

进度只存于当前浏览器；不跨设备同步，不涉及真实支付。旧版没有累计钱包，此版本从 ¥0 开始。
Progress is local to this browser, without cross-device sync or real payments. Earlier versions had no cumulative wallet; this version starts at ¥0.

## v0.6.0 · 清晰食材与十二步教程 / Clear food and twelve-step practice

果子、果篦儿及其他食材使用独立实物造型、不同容器和固定名牌；悬停/触摸显示大图。订单显示已加/需要，顾客有简短订单气泡。只有葱花、香菜和酱料在铁桶中。
Foods now have distinct shapes, appropriate containers and fixed labels with enlarged hover/touch previews. Orders show added/required counts, with short customer bubbles. Only scallions, cilantro and sauces use pails.

教程逐步指引完成双蛋、葱花、甜酱、果篦儿煎饼：倒糊、摊开、双蛋、抹蛋、葱花、翻面、加酱、刷匀、脆片、折叠、装袋、交餐。每步有箭头，可跳过或重玩。经营页提供免费装饰预览与开店差额。界面继续支持中英文。
The tutorial guides a complete pancake: batter, spread, two eggs, spread egg, scallions, flip, sauce, brush, crisp, fold, bag and serve. Each step has an arrow; skip or replay anytime between days. The shop offers free decoration previews and the remaining upgrade cost. Chinese and English remain available.

## v0.7.0 · 制作与声音 / Cooking and sound

敲蛋裂壳、脆片碎裂、铲子翻面、跟手工具与可见馅料折叠；食材增加渐变、纹理和统一光影。新音效包括敲蛋、脆片、纸袋和收钱，制作时有持续铁板滋滋声。右上声音按钮可全部静音。
Cracking shells, breaking crisps, spatula flips, held tools and filling-aware folds, with textured, shaded foods. New effects include egg cracks, crisps, paper and coins, plus continuous cooking sizzle. The sound button mutes everything.

声音均由浏览器本机合成，无需下载录音；真实手机听感和性能仍待测试。
Audio is generated locally in the browser with no recording downloads. Physical-phone sound and performance remain to be tested.


## v0.8.0 · 卡通重绘与更快节奏 / Cartoon rebuild and faster pacing

重新生成并接入卡通顾客、街景、十四种食材和自然握持工具的手；替换写实人物及拼接手掌。原图保留用于历史版本，当前使用 `*-toon.png`。食材采用实际插画并保留中英文标签。
New cartoon neighbors, street, fourteen ingredients and illustrated tool-holding hands replace realistic characters and assembled palms. Original assets remain for history; the active version uses `*-toon.png`, with bilingual labels.

摊饼/抹蛋/刷酱拖动距离缩短约一半，仍须真实操作完成。连续快速正确出餐获得小费，逐单增加，最高 ¥5；错单、超时制作或顾客离开会中断连单。教学不发钱。
Spreading/egg/sauce gestures require roughly half the former distance while retaining real action gates. Consecutive correct fast orders earn increasing tips, capped at ¥5; incorrect/slow orders or departing customers reset the streak. Tutorials earn no money.

## v0.9.0 · 双模式与摊位动作 / Modes and stall actions

主界面“普通模式 / 天津模式”入口直接打开两个选择按钮。空锅时可双向切换，顾客重新点单，保留收入、库存、营业时间与队列耐心；有煎饼或偷吃夹子时先完成处理。收摊后也可切换。
The main mode shortcut opens explicit Classic/Tianjin choices. Switch both ways on an empty griddle: customers reorder while income, stock, time and queue patience remain. Finish the pancake or retract a sneaky claw first; switching also works after closing.

老板补货有取货、搬箱、倒料、食材飞入及补满闪光，实际库存仍在五秒结束时补齐。每颗蛋分别绘制蛋白、蛋黄、落下与拖动摊开的笔触；新加蛋不会让旧蛋液重新收回。偷吃使用伸缩金属夹，点击夹头或握柄阻止，顾客离开时工具一起消失。
Restocking animates fetching, a crate, pouring, ingredient deliveries and full-stock flashes; inventory still refills after five seconds. Each egg has independent whites/yolk, settling and spreading paths; a new egg does not shrink the previous coat. Sneaky customers use telescoping metal claws: tap the tip or grip to stop them, and departing customers take the tool away.
