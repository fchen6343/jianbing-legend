# 煎饼摊传奇 · 街角烟火 / Jianbing Legend · Street Corner

第一视角煎饼摊经营网页游戏，当前版本 v0.5.0。游戏支持中英文切换，并记住当前浏览器的选择。
A first-person Chinese pancake-stall game, currently v0.5.0. Switch between Chinese and English at any time; the browser remembers your choice.

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
| 3 | 按订单重复加鸡蛋和小料，拖动抹匀蛋液后点击铲子翻面。 | Add ordered portions of eggs and herbs, drag to spread the egg, then flip. |
| 4 | 加入指定酱料、肉类、小料，在饼上拖动刷匀酱料。 | Add the requested sauces, proteins and toppings; drag to spread sauce. |
| 5 | 折叠，等待动作完成，装袋，点击顾客交餐。 | Fold, wait for the fold to finish, bag, then click a customer to serve. |
| 6 | 点击老板补货，耗时五秒；拍回伸来的手，否则最多损失两份库存。 | Ask the boss to restock in five seconds. Tap sneaking hands or lose up to two portions. |
| 7 | 三分钟收摊；错单只付 ¥3，丢弃不返还食材。右上“声 / SFX”切换声音。 | Each day lasts three minutes. Wrong orders pay ¥3; discarded ingredients are not refunded. Use “声 / SFX” to toggle sound. |
| 8 | 右上角 English / 中文 随时切换语言，不重置当前游戏。 | Use English / 中文 at top right without resetting the current game. |

## 架构 / Architecture

| 路径 / Path | 中文 | English |
| --- | --- | --- |
| `src/systems/game.ts` | 库存、烹饪状态机、订单、耐心、偷吃、收入与满意度。 | Inventory, cooking states, orders, patience, theft, revenue and ratings. |
| `src/systems/audio.ts` | 首次点击后激活的 Web Audio 旋律与提示音。 | Web Audio melody and cues, activated after the first click. |
| `src/render/scene.ts` | 1280×720 场景、人物、食材及命中区域。 | The 1280×720 scene, characters, ingredients and hit regions. |
| `src/main.ts` | 指针输入、帧循环、结算存储和语言按钮。 | Pointer input, frame loop, local results and the language button. |
| `src/ui.ts` | 制作引导、工具状态、食材核对和点击几何。 | Cooking guidance, tool readiness, ingredient checks and hit geometry. |
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

尚未完成全面手机、触屏、帧率和音频兼容验收；人物、食材与工具已改为生成的统一手绘素材。动作仍需要完善，无真实蛋液物理或专业录音；钱包、装饰、模式和节日进度保存在本机；街道背景静态。
Full mobile, touch, frame-rate and audio compatibility testing remains outstanding. Characters, ingredients and tools now use consistent generated illustrations. Animations still need refinement; there is no egg-fluid physics or professional audio. Wallet, decorations, mode and festival progress save locally. The street background is static.

[开发日志 / Development log](../DEVLOG.md) · [路线图 / Roadmap](ROADMAP.md)

## v0.4.0 UI 与交互 / UI and interaction

订单栏只保留当前订单，用图标和数量展示；绿色勾表示已放够，红色警告表示额外配料。把指针移到食材、工具或订单图标上可查看名称；触屏点击后短暂显示名称。食材库存仍会消耗，丢弃仍不会返还。
The active order uses icons and quantities. Green checks mean enough has been added; red warnings mean an extra ingredient. Hover over ingredients, tools or order icons to see names; touch reveals names briefly. Ingredients are consumed and discarded stock is not refunded.

顶部按钮支持暂停、声音与中英文切换；暂停会冻结营业时间、顾客耐心、补货、烹饪和偷吃计时。Escape 可暂停或继续；切出页面自动暂停，返回后手动继续。
The top toolbar provides pause, sound and language controls. Pause freezes day time, patience, restocking, cooking and theft. Escape toggles pause; switching away pauses automatically and requires manual resume.

素材映射：`assets/neighbors-v2.png` 为四名街坊 / 老板图集；`assets/kitchen-v2.png` 为食材与工具图集。渲染器按实际透明间隙裁切，不依赖图片中的文字，游戏文案全部由代码绘制。
Asset mapping: `assets/neighbors-v2.png` holds four neighbor/owner portraits; `assets/kitchen-v2.png` holds ingredients and tools. The renderer samples actual transparent gaps. UI text is drawn in code rather than baked into images.

## 经营与教学 / Progression and tutorial

`src/systems/progress.ts` 管理钱包、装饰购买/装备、开店、魅力、节日奖励与经过校验的存档恢复。存档键为 `jianbing-legend:progress`，版本 1；旧版最近一日成绩保留，不作为累计资产导入。
`src/systems/progress.ts` handles wallet, purchases/equipment, shop upgrades, charm, event rewards and validated save restoration. The save key is `jianbing-legend:progress`, version 1. Older last-day records are retained but are not imported as cumulative assets.

商店打开时冻结游戏；关闭后恢复之前的暂停状态。玩法模式及活动只能在开局前或收摊后切换，避免订单途中改变规则。装饰的耐心加成在新顾客到来时计算。开店提高队列上限（三到五）并缩短来客间隔（九到五秒）。
The shop pauses play and restores the previous pause state on close. Modes and festivals change only before or after a day. Patience bonuses apply to newly arriving customers. A shop raises queue capacity from three to five and cuts arrival intervals from nine to five seconds.

教程使用固定双蛋、双脆、甜面酱订单，保留真实库存与制作动作，但不耗时间、耐心，不出现偷吃，不发收入或活动奖励；正确交餐后标记完成。可丢弃重做、补货，或退出重来。
The tutorial uses a fixed two-egg, two-crisp, sweet-sauce order with real inventory and cooking. It has no time/patience loss, theft, income or event rewards. Correct service marks completion. Discard, restock or exit to retry.
