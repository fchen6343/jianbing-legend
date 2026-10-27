# 操作与技术说明 / Gameplay and technical guide

当前版本 / Current version: **v0.13.0 · A1–A4 可玩增量 / playable increments**.

在线 / Online: https://fchen6343.github.io/jianbing-legend/ . 离线 / Offline: 下载项目后打开 / Download and open `play.html`.

## 操作 / Controls

| 步骤 / Step | 中文 | English |
|---|---|---|
| 接单 / Order | 点击顾客，看铁板上方的完整图标与已加/需要数量。 | Select a customer; check the full icon order and added/required counts. |
| 摊糊 / Batter | 点击面糊，在铁板内按住绕圈，铺开各个方向；原地刷距离无效。 | Tap batter and circle the griddle to spread every direction; stationary distance cannot finish it. |
| 打蛋 / Egg | 点蛋盘拿蛋，点饼面中央敲壳，再按住向左或右拉开。没打开前再点蛋盘可放回，不扣库存。 | Pick an egg, tap the pancake to crack, then hold and pull left or right. Return an unopened egg via the tray at no cost. |
| 摊蛋 / Spread egg | 从落稳的蛋黄开始拖动，将蛋液涂到整张饼；双蛋都要抹匀。松手可接着做。 | Start at a settled yolk and spread it over the pancake; coat both eggs when ordered. Lift and resume as needed. |
| 翻面 / Flip | 按订单加葱花等，蛋液摊好后点铲子；背面材料不再显示。 | Add ordered herbs, then flip when the eggs are spread. Underside ingredients become hidden. |
| 刷酱 / Sauce | 加入订单酱料和馅料，按住饼面刷匀。果子和果篦儿使用不同图标。 | Add ordered sauces/fillings and brush the pancake. Youtiao and guobier use distinct art. |
| 三折 / Folds | 点折叠，按箭头拖左、右、下边；不到位松手会回落。点折叠工具可退回上一折。 | Tap Fold, then drag left/right/bottom edges along the arrows. Short releases roll back; tap Fold again to undo an edge. |
| 交餐 / Serve | 三折完成后点纸袋，再点目标顾客。 | After all folds, tap Bag, then the selected customer. |
| 补货 / Restock | 点击右侧老板，五秒搬货补齐；库存不够时可在教程中补货。 | Ask the boss to fetch and refill stock in five seconds; practice also supports restocking. |
| 偷吃 / Theft | 点击夹头或握柄打断伸缩夹，避免丢失最多两份库存。 | Tap a claw tip or grip to stop theft of up to two portions. |
| 重做 / Retry | 丢弃清理当前饼，已用食材不退；拿起但未打开的蛋不扣库存。 | Discard clears the pancake without refunding used ingredients; unopened eggs use no stock. |
| 暂停 / Pause | 顶部暂停、Escape 或切到其他页面；回到游戏后手动继续。 | Use Pause, Escape or switch away. Resume manually on return. |
| 双语 / Language | 顶部中文/English 随时切换，保留当前制作；声音按钮统一静音。 | Switch Chinese/English mid-order without resetting; the sound control mutes all cues. |

新手教程为不限时完整双蛋、葱花、甜面酱、单片果篦儿订单，不减少耐心、不产生收入或活动奖励。可跳过、重玩、丢弃、补货、放回未开鸡蛋、退回上一折。
The untimed tutorial completes a two-egg/scallion/sweet-sauce/one-guobier order without patience loss, income or festival rewards. Skip, replay, discard, restock, return unopened eggs and undo folds are supported.

普通/天津模式在空锅且夹子收回时可切换；排队顾客重新点单，耐心、库存和金钱保留。节日只能在局间切换。装饰魅力延长新顾客耐心；当前简单开店仍为 ¥180。
Switch Classic/Tianjin on an empty griddle with no active claw. Customers reorder while keeping patience, stock and money. Festivals change between days. Charm increases new-customer patience; the current simple shop unlock still costs ¥180.

## 开发 / Development

```sh
npm ci
npm test
npm run dev
```

`npm run dev` 使用 Python 3 在 http://localhost:5173 提供 `dist`。`npm test` 先严格编译再运行规则回归。`npm run build` 同步生成 `dist`、离线 `play.html`、Pages `docs/index.html`；源码和发布产物一起提交。
The dev command uses Python 3 to serve `dist` at localhost:5173. Tests compile first. Build synchronizes dist, offline HTML and Pages; commit outputs with source.

| 路径 / Path | 职责 / Responsibility |
|---|---|
| `src/systems/game.ts` | 库存、烹饪状态与手势、订单、耐心、夹子、收入 / Stock, cooking/gestures, orders, patience, claw and revenue |
| `src/systems/progress.ts` | 一个本机档案的钱包、装饰、活动、模式 / Single local profile: wallet, decor, events and mode |
| `src/systems/audio.ts` | 有生命周期上限的本机 Web Audio 声音 / Local Web Audio with bounded lifetimes |
| `src/render/scene.ts` | 卡通 Canvas、实物命中、局部涂抹、折叠与遮挡 / Cartoon Canvas, physical hits, spatial coating, folds and occlusion |
| `src/ui.ts` | 可测试的引导、状态和几何 / Testable guidance, readiness and geometry |
| `src/main.ts` | 单指输入、捕获/释放、暂停、帧循环、存储 / Single-pointer input, capture/release, pause, loop and storage |
| `src/i18n.ts` | 中英文文字和动态消息 / Bilingual UI and dynamic messages |
| `assets/*-toon.png` | 原创卡通街景、四人、食材与短手工具图集 / Original street, four-character, food and short-hand atlases |
| `tools/build.mjs` | 具名导入 TS 产物的离线打包 / Offline packaging of compiled named-import modules |

实际运行时为 TypeScript 5.8 + Canvas 2D，无付费 API、广告或第三方运行时。Pages 使用 main 分支 `/docs`。当前核心资源内嵌单文件，尚未懒加载所有资源或完成性能/真机验收。
The actual stack is TypeScript 5.8 + Canvas 2D without paid APIs, ads or third-party runtime. Pages serves main `/docs`. Core art is embedded in one file; lazy loading and performance/device acceptance remain outstanding.

## 存档与限制 / Saves and limits

存档键 `jianbing-legend:progress`，版本 1，自动保存钱包、装饰装备、活动、模式、天数和教程标记。语言和静音单独保存。当前只有一个本机档案，不是三存档；刷新保留已保存经营进度，但不恢复正在制作的铁板。A2/A3/A4 不更换存储键、不重置旧钱包。
Key `jianbing-legend:progress`, version 1, saves wallet, equipped decorations, festivals, mode, days and tutorial completion. Language/mute are separate. There is only one local profile; reload retains saved progression, not the current pancake. A2/A3/A4 do not change the key or reset old wallets.

[全文差距 / Full audit](REQUIREMENTS_STATUS.md) · [体验门槛 / Quality gates](QUALITY_GATES.md) · [开发日志 / Development log](../DEVLOG.md).

## 首台厨具 / First device

营业前后进入厨具屋：免费试用台可选自动/手动、暂停、倒糊重试；手动时直接在试用铁板绕圈。试用使用隔离的钱包/库存对象。¥550 确认升级后默认启用，可在下次营业前关闭；教程不启用自动。设备只摊糊，打蛋、配料、刷酱、三折、交餐仍需操作。
Enter Workshop between services. The isolated free trial supports automatic/manual, pause and retry; circle its griddle in manual mode. Confirm the ¥550 upgrade to enable it next service, or switch it off before opening. Tutorials stay manual. The machine only spreads batter; eggs, fillings, sauce, folds and service remain interactive.

`src/systems/equipment.ts` 独立保存首台价格/转速及购买、配置、工作规则；`rotorOwned`/`rotorOn` 在旧档恢复时默认 false，不改动已有资产。详见 [SAVE_FORMAT.md](SAVE_FORMAT.md)。
The equipment module contains price/speed, purchase/configuration and working rules. Missing rotor fields default to false when restoring older saves, leaving existing assets intact. See the save format.
