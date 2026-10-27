# 全文需求核对 / Full specification audit

核对版本 / Audited release: **v0.12.0 · A3**. 原文 / Original: [MASTER_PLAN.zh-CN.md](MASTER_PLAN.zh-CN.md). 优先级 / Priority: [QUALITY_GATES.md](QUALITY_GATES.md).

**结论：尚未完成全文要求，仍是可玩原型。** “已有”只表示当前功能存在，不代表整个章节达标；代码测试通过不代表趣味性验收通过。
**Conclusion: the full specification is not complete.** This remains a playable prototype. An existing feature does not establish completion of its chapter; automated tests do not establish enjoyment.

| 原文范围 / Requested area | 当前可用内容 / Working today | 缺口 / Remaining work |
|---|---|---|
| 1. 总体目标 / Overall goal | 第一人称卡通煎饼制作、订单、钱包 / First-person cartoon cooking, orders, wallet | 完整长期经营及结局后持续经营 / Full progression and post-ending play |
| 2. 主菜单 / Main menu | 开始、暂停、结果覆盖页，语言和声音 / Start, pause and result overlays; language and sound | 独立主菜单、继续、选档、剧情回顾、版本设置 / Separate menu, continue, slots, replay, settings |
| 2. 经营中心 / Hub | “装饰与经营”弹窗 / Decorate & grow dialog | 独立经营中心及全部独立管理场景 / Hub and separate management scenes |
| 3. 日循环 / Day loop | 180 秒营业、顾客、收摊后再开 / 180-second service and restart | 默认 240 秒、清晨准备、每日预告、收摊互动、10–14 顾客节奏 / 240-second default, preparation, forecast, after-hours interactions and pacing |
| 3. 结算 / Results | 收入、出餐、满意度 / Revenue, served count and rating | 成本、净利润、小费明细、好感、解锁、事件、三星评价 / Costs, net profit, tips, affection, unlocks, events and stars |
| 4. 面糊 / Batter | 旋转覆盖驱动局部铺开，拒绝原地刷距离 / Circular coverage drives local geometry, rejects distance spam | 十单体验与真机触屏验收 / Ten-order feel review and physical touch testing |
| 4. 打蛋 / Eggs | A2 手动拿蛋、敲壳、拉开、落液；触及蛋黄后按真实位置涂抹；每蛋独立 / A2 pick, tap, pull, drop and spatial spreading per egg | 真人手感反馈、触屏验收与后续辅助设备 / Human feedback, physical touch and egg-assist device |
| 4. 刷酱 / Sauce | 跟随拖动留下轨迹 / Pointer-following sauce strokes | 完成判定仍依赖累计距离，需继续改为空间涂抹 / Completion still uses distance; spatial coating remains |
| 4. 折叠 / Folding | A3 左/右/下三步拖折，回落和退回上一折 / A3 manual left/right/bottom folds, rollback and undo | 浏览器整单、十单体验与真机触屏验收 / Browser whole orders, ten-order feel and physical touch |
| 4. 食材层次 / Food layers | 果子与果篦儿分开，铁桶与托盘，翻面隐藏背面材料，独立袋子 / Distinct youtiao/guobier, pails/trays, underside hiding and separate bag | 折叠成品已沿用实际馅料和纸袋前后遮挡，完整视觉审校待做 / Actual fillings and paper-bag occlusion now retained; full visual review pending |
| 4. 保留玩法 / Existing mechanics | 普通/天津切换、伸缩夹、五秒老板补货、库存、双蛋完整教程 / Modes, telescoping claw, boss restock, stock and full double-egg tutorial | 随后阶段持续回归 / Preserve through future stages |
| 5. 厨具屋 / Workshop | 无 / None | 独立厨房、等级/前后外观/价格/效果、购买及升级演出 / Room, levels, previews, prices, effects, purchase and upgrade animation |
| 5. 八类厨具 / Eight devices | 无真实设备 / No actual equipment | 高级刮板、旋转刮板、蛋辅助、刷酱、配料盒、折叠辅助、加热、收银 / Spreader, rotor, egg assist, sauce, ingredient box, folding assist, heating and register |
| 5. 自动化 / Automation | 无 / None | 可见运转、准备期开关、真实成本与保存、手动回退和保留关键选择 / Visible operation, prep switches, costs, persistence, manual fallback and retained choices |
| 6. 建筑 / Buildings | 现有 ¥180 简单开店提升客流 / A simple ¥180 shop unlock increases traffic | 五阶段建筑、天数/营收/剧情门槛和升级花费 / Five buildings with day/revenue/story gates and costs |
| 6. 装修 / Decoration | 9 件装饰、购买/装备/卸下、免费预览、魅力延长耐心 / Nine decorations, buy/equip/remove, preview and patience buffs | 独立设计室、拖放/旋转/碰撞/确认/收回/保存位置及更多品类 / Studio, placement, rotation, collision, confirmation, storage and more types |
| 7. 熟客 / Regulars | 三种顾客外观和老板 / Three customer appearances and owner | 八名有姓名、口味、好感、专属资料的熟客 / Eight named regulars, tastes, affection and profiles |
| 7. 对话任务 / Dialogue and quests | 无 / None | 每人 5 闲聊、3 剧情、2 分支事件、完整任务链和独特奖励，防重复刷取 / Per-person chats, scenes, branches, quest chain, reward and replay protection |
| 8. 主线 / Main story | 无 / None | 五章剧情、重要选择、结局反馈、结局后经营 / Five chapters, choices, ending consequences and endless play |
| 9. 事件 / Events | 一类夹子偷吃；三个可选节日主题和出餐奖励 / Claw theft, three festival themes and service rewards | 至少 15 类有条件/概率/操作/结果/冷却的事件及记录 / At least 15 full event types and records |
| 10. 每日庆祝 / Day celebrations | 每单金币反馈和静态结算 / Per-order coins and static results | 3–6 秒可跳过每日演出 / Skippable 3–6-second day-end sequence |
| 10. 剪彩 / Ribbon cutting | 无 / None | 五阶段递增演出、跳过、剧情回顾、观看状态存档和计时冻结 / Five growing celebrations, skip, replay, saved viewing state and frozen service time |
| 11. 经济 / Economy | 每单入钱包、小费连单、装饰扣款 / Wallet revenue, streak tips and decoration costs | 初始 300、配方售价/成本/净利、采购/设备/任务收入、无死局与 50 天模拟 / Starting 300, pricing, costs, purchasing, devices, quests, recovery and 50-day simulation |
| 12. 连锁 / Franchises | 无 / None | 天津/北京/上海、等级/效率/装修/配方、游戏日收益上限 / Three regions, levels, efficiency, decor, recipes and capped daily income |
| 13. 图鉴 / Encyclopedia | 当前订单与食材名牌 / Current order and ingredient labels | 12 解锁配方、8 熟客、15 事件、5 建筑纪念和剧情收藏 / Unlockable recipes, regulars, events, building mementos and story collections |
| 13. 成就 / Achievements | 无 / None | 20 项基于真实行为的成就及奖励 / Twenty behavior-based achievements and rewards |
| 14. 三存档 / Three saves | 一个本机档案自动保存钱包、装饰、节日、模式、天数 / One local profile saves wallet, decor, festivals, mode and days | 三槽隔离、元数据、手动保存、删除确认、JSON 导入/导出、版本校验和旧档迁移 / Slots, metadata, manual save, delete confirmation, import/export, validation and migration |
| 14. 营业恢复 / In-service recovery | 刷新后恢复已保存经营进度，未保存当前铁板 / Saved progression returns after reload; the current griddle is not saved | 库存与全部新增系统可靠保存；损坏档明确提示 / Stock, all future systems and explicit corruption recovery |
| 15. 美术 / Art | 原创卡通街景、四人图集、食材、工具、跟手制作 / Original cartoon street, four-character atlas, foods and tools | 八名熟客、全部场景/建筑/设备/节日/表情动画及统一审校 / Full cast, scenes, buildings, devices, festivals and expressions |
| 15. 音频 / Audio | 本机合成制作音、收钱、夹子、滋滋声，统一静音 / Local cooking/coin/claw/sizzle cues and mute | 三种氛围、欢呼、设备/剪彩声音、独立音量及实际听感 / Three atmospheres, cheers, upgrades, celebrations, separate volumes and listening review |
| 16. 技术 / Architecture | TS 模块、纯本地核心、资源失败降级、笔触上限、暂停 / TS modules, offline core, fallback drawing, bounded strokes and pause | 数据驱动长线系统、场景管理、懒加载、完整资源生命周期与性能测量 / Data-driven progression, scene management, lazy loading, lifecycle and performance |
| 17–18. 阶段/最终验收 / Acceptance | 编译、当前回归、部分实际整单操作 / Build, regressions and some real whole orders | 十单手感、移动真机、三槽、50 天、全部剧情和设备；不可称完整版 / Ten-order feel, mobile hardware, saves, 50 days, stories and devices |
| 19. 交付 / Delivery | GitHub 源码/资源、离线 HTML、Pages、双语 README、DEVLOG、总需求与验收表 / Source/assets, offline HTML, Pages, bilingual docs, original scope and quality gates | 存档格式和最终全量报告随系统完成补全 / Save format and final report as systems land |
| 20. 最终质量 / Final quality | 核心交互分阶段改善 / Core interactions improving in stages | 新鲜感、升级价值、长期目标、真人趣味性反馈；不能以数量代替 / Novelty, upgrade value, long-term goals and human enjoyment |

## 当前执行顺序 / Current sequence

A1 摊糊 → A2 打蛋 → **A3 分步折叠** → A4 首台真实设备 → B 场景与三存档 → C 五日完整经营 → D 分章节扩展五十天 → E 全量验收。
A1 batter → A2 eggs → **A3 folding** → A4 first working machine → B scenes/saves → C five complete days → D fifty days in playable chapters → E full acceptance.

这张表记录尚未完成的范围，不取消任何原需求，也不把原型功能改名视为完成。
This records outstanding scope without cancelling it or treating renamed prototype features as finished.
