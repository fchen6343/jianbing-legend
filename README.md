# jianbing-legend · 煎饼摊传奇

煎饼摊传奇 — 第一视角中文街头煎饼摊经营游戏 / TypeScript + Canvas

Jianbing Legend — a first-person Chinese street-food stall game built with TypeScript and Canvas.

**在线试玩 / Play online:** https://fchen6343.github.io/jianbing-legend/

点击左下角 **English / 中文** 随时切换语言；偏好保存在当前浏览器。推荐桌面横屏。
Use **English / 中文** in the bottom-left corner to switch languages at any time. Your browser remembers the choice. A landscape desktop screen is recommended.

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

当前为 v0.4.0 可玩原型，仍在迭代美术、动作与触屏体验。
v0.4.0 is a playable prototype. Artwork, animation and touch controls are still being refined.

## v0.4.0 · 暖色手作摊位 / Warm illustrated stall

- 统一绘制的街坊顾客、13 种食材与工具；直接点击实物，悬停或触摸时显示名称。
  Illustrated neighborhood characters, 13 ingredients and physical tools; names appear on hover or touch.
- 图标订单支持双蛋数量、完成勾选、额外配料警告和不要香菜；缺少的食材会发光提示。
  Icon orders show double eggs, completion checks, extra ingredients and no cilantro. Needed ingredients glow.
- 加料落下、翻面、折叠、收钱、入场和离场反馈；首次制作指导，之后保留简短下一步提示。
  Ingredient drops, flipping, folding, coin collection and customer transitions, with first-run coaching and compact next-action hints afterward.
- 顶部可暂停、切换声音与语言；Escape 暂停，切到其他页面自动暂停。
  Pause, sound and language controls are at the top. Escape pauses; switching away pauses automatically.

仍是可迭代原型；当前不包含商业游戏级的骨骼动画、专业配音或长期经营升级系统。
Still an iterative prototype, without production skeletal animation, professional voice acting or long-term stall upgrades.
