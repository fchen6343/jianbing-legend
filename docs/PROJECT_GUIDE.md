# 煎饼摊传奇 · 街角烟火 / Jianbing Legend · Street Corner

第一视角煎饼摊经营网页游戏，当前版本 v0.3.1。游戏支持中英文切换，并记住当前浏览器的选择。
A first-person Chinese pancake-stall game, currently v0.3.1. Switch between Chinese and English at any time; the browser remembers your choice.

## 试玩 / Play

在线地址 / Online: https://fchen6343.github.io/jianbing-legend/

离线：下载项目，用桌面 Chrome / Edge 打开根目录 `play.html`，无需安装或服务器。推荐横屏。
Offline: download the project and open root-level `play.html` in desktop Chrome or Edge. No installation or server is required. Landscape is recommended.

开发：安装 Node.js 后执行 `npm ci`、`npm test`。`npm run dev` 使用 Python 3 启动 dist 目录，访问 http://localhost:5173 。
Development: install Node.js, run `npm ci`, then `npm test`. `npm run dev` serves `dist` using Python 3 at http://localhost:5173 .

## 操作 / Controls

| 步骤 / Step | 中文 | English |
| --- | --- | --- |
| 1 | 点击顾客接单，查看铁板上方完整清单。 | Select a customer and read the full order above the griddle. |
| 2 | 点击面糊，在铁板内按住拖动至摊匀。 | Click batter, then drag inside the griddle until evenly spread. |
| 3 | 按订单加入一或两个鸡蛋，可加葱花、芝麻，然后点击铲子翻面。 | Add one or two eggs as ordered, optionally add scallions or sesame, then flip. |
| 4 | 加入指定酱料、肉类、小料，在饼上拖动刷匀酱料。 | Add the requested sauces, proteins and toppings; drag to spread sauce. |
| 5 | 折叠，等待动作完成，装袋，点击顾客交餐。 | Fold, wait for the fold to finish, bag, then click a customer to serve. |
| 6 | 点击老板补货，耗时五秒；拍回伸来的手，否则最多损失两份库存。 | Ask the boss to restock in five seconds. Tap sneaking hands or lose up to two portions. |
| 7 | 三分钟收摊；错单只付 ¥3，丢弃不返还食材。右上“声 / SFX”切换声音。 | Each day lasts three minutes. Wrong orders pay ¥3; discarded ingredients are not refunded. Use “声 / SFX” to toggle sound. |
| 8 | 左下角 English / 中文 随时切换语言，不重置当前游戏。 | Use English / 中文 at bottom left without resetting the current game. |

## 架构 / Architecture

| 路径 / Path | 中文 | English |
| --- | --- | --- |
| `src/systems/game.ts` | 库存、烹饪状态机、订单、耐心、偷吃、收入与满意度。 | Inventory, cooking states, orders, patience, theft, revenue and ratings. |
| `src/systems/audio.ts` | 首次点击后激活的 Web Audio 旋律与提示音。 | Web Audio melody and cues, activated after the first click. |
| `src/render/scene.ts` | 1280×720 场景、人物、食材及命中区域。 | The 1280×720 scene, characters, ingredients and hit regions. |
| `src/main.ts` | 指针输入、帧循环、结算存储和语言按钮。 | Pointer input, frame loop, local results and the language button. |
| `src/i18n.ts` | 中英文文案、食材名和动态消息翻译。 | Chinese/English UI, ingredient names and dynamic messages. |
| `assets/street.png` | 本项目生成的卡通街景背景。 | The generated cartoon street background. |
| `tools/build.mjs` | 生成 dist、离线单文件和 Pages 入口。只支持当前具名导入形式。 | Builds dist, offline HTML and the Pages entry point; supports the current named-import format. |
| `tests/*.test.mjs` | 玩法规则、翻译及发布文件检查。 | Gameplay, translation and deployment-output checks. |

实际技术为 TypeScript 5.8 + Canvas 2D，暂无第三方运行时依赖、广告、付费服务或数据采集。原计划 Phaser/Vite 因当时下载受限未接入。
The actual stack is TypeScript 5.8 and Canvas 2D, with no third-party runtime, ads, paid services or data collection. Phaser/Vite were not added because downloads were blocked during the original build.

## 发布与验证 / Publishing and validation

GitHub Pages 使用 main 分支的 `/docs`；每次 `npm run build` 会把最新的离线游戏同步到 `docs/index.html`。提交更新时应包括构建产物。
GitHub Pages serves `/docs` on `main`. Each `npm run build` copies the latest standalone game to `docs/index.html`. Commit generated outputs with source changes.

`npm test` 执行严格编译和自动测试。语言切换覆盖界面、订单、食材、提示、结算、页面标题与辅助文字；保留背景图片里的装饰性中文招牌。
`npm test` runs strict compilation and automated tests. Switching language updates UI, orders, ingredients, hints, results, page title and accessible text. Decorative Chinese shop signs remain in the background artwork.

尚未完成全面手机、触屏、帧率和音频兼容验收；人物、食材的程序插画与背景风格仍有差距。动作需要完善，无真实蛋液物理或专业录音；存档仅记录最近一天结算，暂无长期升级，街道背景静态。
Full mobile, touch, frame-rate and audio compatibility testing remains outstanding. Procedural characters and ingredients still differ from the background style. Animations need refinement; there is no egg-fluid physics or professional audio. Storage records only the latest day, with no long-term upgrades. The street background is static.

[开发日志 / Development log](../DEVLOG.md) · [路线图 / Roadmap](ROADMAP.md)
