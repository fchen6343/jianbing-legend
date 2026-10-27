# 体验优先阶段交付 / Experience-first delivery

## 最新用户原则 / Latest user priority

不得为赶完全部需求牺牲操作体验。摊面糊、打鸡蛋、折叠、设备自动化是核心乐趣。五十天内容可分阶段，但每阶段必须完整可运行、可测试。
Do not sacrifice interaction quality to finish a feature list. Batter, eggs, folding and tangible automation are the central pleasure. Fifty-day content may be phased, but each release must run and be testable end to end.

这是对原始总指令的优先级修订，不是取消其范围。参考原文：[完整版需求](MASTER_PLAN.zh-CN.md)。
This changes implementation priority without cancelling scope. The linked Chinese document preserves the user's original full specification.

## 当前差距 / Current gaps

| Area / 项目 | Actual state / 实际状态 | Gate still pending / 待验收 |
|---|---|---|
| Batter / 摊糊 | v0.10.0 introduces angular coverage, local spreading and circular guidance / 改为旋转覆盖、局部铺开、环形引导 | Representative mouse and touch play; user enjoyment / 鼠标触屏代表性试玩、趣味性反馈 |
| Eggs / 鸡蛋 | v0.11.0: pick, tap, pull shell, settle and spatially spread each egg / 手动拿蛋、敲壳、拉开、落液和逐蛋空间涂抹 | One real double-egg browser order passed; ten-order/human/touch review pending / 一张双蛋浏览器整单通过，十单/真人/触屏待验收 |
| Folding / 折叠 | v0.12.0: left/right/bottom drag folds, rollback, undo and filling-aware bag / 三边拖折、回落、撤回及按实际馅料装袋 | One double-egg browser order with rollback/undo passed; human/touch review pending / 一张双蛋整单含回落/撤回通过，真人/触屏待验收 |
| Automation / 设备 | v0.13.0: first working rotor, workshop/trial, ¥550, saved switch / 首台旋转刮板、厨具屋/试用、价格与开关存档 | Workshop/insufficient-funds/pause observed; completion/manual/purchase persistence blocked by browser timeout; seven other devices pending / 厨具屋/余额不足/暂停已观察；继续/手动/购买持久化因浏览器超时待验；另七类设备待做 |
| Saves / 存档 | One browser profile, no slots/import/export / 单个本机档案，无三槽导入导出 | Three isolated slots, migration and recovery / 三槽隔离、迁移、恢复 |
| Screens / 场景 | Cooking, decor dialog and first-device workshop / 制作、装饰弹窗和首台设备厨具屋 | Separate hub, full workshop, decor and other screens / 经营中心、完整厨具屋、装修等 |
| Long-term / 长线 | Wallet, simple decor/shop and three selectable festivals / 钱包、简易装修升级、三个节日 | 50-day progression, five buildings, story/relationships/economy / 五十天、五建筑、剧情关系、经济 |
| Characters / 角色 | Three neighbor looks and owner / 三个街坊形象与老板 | Eight distinct regulars with real story/choices / 八位熟客与实际剧情选择 |
| Completion / 完整版 | Playable prototype / 可玩原型 | Full specification acceptance / 总需求全部验收 |

## Implementation sequence / 实施顺序

1. **A1: Batter interaction release / 摊糊增量** — rotating coverage drives real geometry; tap/spam/linear scrubbing cannot substitute. Existing entire recipe-to-service loop remains playable. First release of this sequence is v0.10.0.
2. **A2: Egg interaction release / 打蛋增量** — consistent pick/crack/settle/spread controls, per-egg layers, correct underside; complete orders with single/double eggs and recovery.
3. **A3: Folding interaction release / 折叠增量** — interactively fold left/right/bottom with readable targets, actual occlusion and recovery. Packing and service still work.
4. **A4: First real automation release / 首个真实自动化增量** — one working rotating spreader with a visible working mechanism and off/on switch; it may assist spreading but must not choose fillings, fold everything or serve for the player. Verify cost, saved ownership, pause and manual fallback.
5. **B: Durable progression foundation / 持久经营基础** — menu/hub/three save slots, manual/auto saves, validated import/export and old-save migration. No loss of existing money/decor.
6. **C: First five complete days / 五日完整经营** — real preparation, service, costs/profit/results and meaningful device progression; 3–5 minute sessions. Fully playable before further days are added.
7. **D: Expand to 50 days / 扩展五十天** — add regulars, chapters, events, recipes, buildings and real rewards in coherent playable chapters, following the original scope.
8. **E: Full validation / 全量验收** — 50-day economic simulation, story unlocks/endgame, decor/franchises, three-slot recovery and device performance checks. Simulation does not replace player interaction review.

Every increment retains a complete cooking-to-service loop. Future screens/features stay out of the released UI until they have real behavior; no placeholder buttons.
每个增量保留完整制作交餐闭环；未实现的后续界面不放空按钮凑数量。

## Release gates / 每阶段门槛

- Build and relevant regressions pass; preserve language/modes/restock/claw and existing saves.
  编译及相关回归通过；保留双语、模式、补货、夹子和旧存档。
- Finish representative whole orders, including mistakes/discard/retry, pause and refresh behavior.
  完成代表性整单，检查错误、丢弃、重做、暂停与刷新。
- For the core-feel milestone, manually complete at least ten varied orders and record observations: clarity, control response, repetition, recovery, satisfaction. Only a real play record counts; do not infer fun from test count.
  核心手感里程碑须实际完成至少十个不同订单并记录理解、响应、重复、纠错和满足感；不能用测试数代替。
- Equipment must change the actual action, include animation and be switchable. Test manual, automated, disabled, unavailable funds, pause, reload and repeated input.
  设备要真实改变操作，有过程、可关闭；验证手动/自动/关闭、钱不足、暂停、刷新及重复输入。
- Update status/gaps, version, log, source/outputs and verify deployment. State untested parts plainly.
  更新差距、版本、日志、源码和构建产物，核实部署；明确未测试部分。

**Current acceptance / 当前验收**: v0.13.0 includes A1 batter, A2 manual eggs, A3 folds and the A4 first rotor. Seven other devices, three-slot saves and fifty-day content remain incomplete. Physical touch and the ten-order feel review remain pending.
**当前 A1–A4 首轮增量**：另七类设备、三存档及五十天内容未完成；实体触屏、十单手感和真人趣味性仍待验收。

全文逐项差距 / Full itemized audit: [REQUIREMENTS_STATUS.md](REQUIREMENTS_STATUS.md).

A4 线上完整验收因浏览器连接超时未完成；恢复连接后先补自动继续、手动对比和购买/整单路径，不得标为已通过。\
A4 full live acceptance is incomplete after browser connection timeouts. Verify automatic resume, manual comparison and purchase/whole-order paths before marking it passed.
