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

当前为 v0.5.0 可玩原型，仍在迭代美术、动作与触屏体验。
v0.5.0 is a playable prototype. Artwork, animation and touch controls are still being refined.

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
