# 开发日志 / Development log

## 2026-10-27 · v0.4.0 · 全 A 界面改造 / All-A UI redesign

### 实现 / Implementation

- 根据用户选定的 8 项 A 方案，保留第一视角、左右配料、下方工具，统一暖色手绘摊位风格。
  Followed the eight selected A options: first-person view, side ingredients and lower tools in a warm illustrated stall.
- 用内置图片生成制作原创四人顾客 / 老板图集和 20 格食材 / 工具图集，实际接入渲染、订单与制作动画；原背景沿用。运行时按透明间隔裁切，修复生成图集并非严格等高网格导致的相邻素材串入。
  Generated original four-character and 20-item atlases with the built-in image tool, used in rendering, orders and cooking feedback. Retained the background. Runtime sampling follows actual transparent gaps rather than assuming perfectly equal rows.
- 重做顶部 HUD、开始页、结算页、暂停页；原料与工具以实物呈现，悬停 / 触摸揭示名称。订单使用图标、双蛋数量、已完成勾选、额外配料警告和不要香菜标签。
  Redesigned HUD, start, results and pause screens. Physical ingredients/tools reveal names on hover/touch. Icon orders show double eggs, completion, extras and no cilantro.
- 加入首轮教学 / 后续简短提示、所需食材发光、拖动时贴手工具、加料抛落、翻面抛起、折叠、金币和顾客进出过渡。
  Added first-run coaching, compact later hints, needed-ingredient highlights, attached drag tools, ingredient drops, flips, folding, coins and customer transitions.
- 暂停冻结所有玩法计时，切出页面自动暂停；中英文切换和语言偏好保留。刷酱轨迹数量设上限，避免持续拖动无限增长。
  Pause freezes all gameplay timers; hiding the page pauses automatically. Language switching/preferences remain. Sauce stroke storage is bounded.
- 更新构建器，将所有图集复制到 dist 并嵌入离线版 / Pages；新增 ui.ts 分离可测试的引导与几何规则。
  Updated builds to copy atlases into dist and embed them in offline/Pages output. Added ui.ts for testable coaching and geometry.

### 验证与边界 / Validation and limits

严格编译和 8 项自动测试通过，覆盖原有玩法、双语、发布产物、暂停冻结和完整制作引导。使用真实 Canvas 渲染器预览中文 / 英文营业画面及菜单并修正图集串入；线上浏览器验收另行记录。
Strict compilation and eight automated tests passed: existing gameplay, bilingual output, publishing, pause and full cooking guidance. Rendered Chinese/English gameplay and menus with the actual Canvas renderer and corrected atlas bleed. Live browser acceptance is recorded separately.

本轮查询了设计插件，确认 Figma 已安装；现有图片生成、Canvas 和 GitHub 工具足以完成，未安装额外插件、未购买服务，也没有声称使用 Figma 生成当前画面。仍未达到《沙威玛传奇》商业成品的完整动作、音频和长期经营深度；骨骼动作、专业配音、更多姿势和升级系统仍待迭代。
Design-plugin discovery confirmed Figma is installed. Existing image generation, Canvas and GitHub tools were sufficient; no extra plugin or paid service was purchased, and Figma was not claimed as the source of this UI. Full commercial-quality animation, audio and long-term progression comparable to Shawarma Legend remain future work.


### 线上试玩验收 / Live browser acceptance

- v0.4.0 提交：410addd6979363cbc946d871a2e0ae6a76f02405；Pages 部署成功：https://github.com/fchen6343/jianbing-legend/actions/runs/40330252515 。37 个远端文件的路径、大小及 Blob SHA 均核对通过。
  Release commit: 410addd6979363cbc946d871a2e0ae6a76f02405. Successful Pages deployment: https://github.com/fchen6343/jianbing-legend/actions/runs/40330252515 . All 37 remote paths, sizes and blob SHAs matched.
- 真实 Chrome 检查了中英文开场与营业界面、语言切换、声音按钮、名称提示及暂停 / 继续；未观察到游戏自身的控制台错误。
  Checked Chinese/English start and gameplay screens, language switching, sound controls, name tooltips and pause/resume in Chrome. No game-origin console errors were observed.
- 使用真实指针操作完成一张正确订单：面糊、拖动摊匀、加蛋、翻面、香菜、甜面酱、辣椒酱、薄脆、火腿、拖动刷酱、折叠、装袋、交餐。实际收到 ¥15，满意度 97%，完成订单数 1。由此验证了规则之外的输入、图标核对与成功交餐路径。
  Completed one correct order using real pointer input: batter, spreading, egg, flip, cilantro, sweet sauce, chili sauce, crisp, ham, sauce brushing, fold, bag and service. Actual result: ¥15, 97% rating, one served order. This verifies input, checklist updates and successful service beyond unit tests.
- 本次没有宣称完成整局三分钟结算、手机真机或音频听感验收；这些仍需后续实际测试。
  A full three-minute day, physical mobile-device testing and listening-based audio acceptance were not claimed and remain pending.

## 2026-10-26 · v0.3.1 · 双语与在线发布 / Bilingual UI and online publishing

- 新增中文 / English 切换，保存语言偏好；在营业中切换不会重置进度，已有消息和订单也会即时翻译。
  Added Chinese/English switching with a saved language preference. Switching during play preserves progress and translates active messages and orders.
- 覆盖食材、订单、库存、补货、偷吃提示、工具、步骤、统计、开场、结算、页面标题和辅助说明。背景图片中的中文招牌保留为装饰。
  Covers ingredients, orders, inventory, restocking, theft hints, tools, steps, statistics, start/results screens, page title and accessible instructions. Chinese signs in the background remain decorative artwork.
- 订单按当前语言换行，完整订单栏加高，长英文标签限定宽度。README、项目说明、路线图和开发日志提供中英文。
  Orders wrap by language, the full-order panel is taller and English labels have width limits. README, guide, roadmap and development log provide both languages.
- 构建会同时生成 docs/index.html 和 docs/.nojekyll，使用 GitHub Pages 的 main /docs 发布源；保留根目录与 dist 的开发方式。
  Builds generate docs/index.html and docs/.nojekyll for GitHub Pages from main /docs, retaining the root and dist development layout.
- 自动测试：严格编译、4 项原有玩法测试及 2 项双语 / 发布文件测试通过。全面手机、音频和一整局操作验收仍待完成。
  Automated validation: strict compilation, four existing gameplay tests and two language/deployment-output tests pass. Full mobile, audio and complete-day manual review remains outstanding.


### 发布验收 / Deployment verification

- GitHub Pages 已启用，发布源为 main 分支 /docs，构建、部署和状态报告全部成功。在线地址：https://fchen6343.github.io/jianbing-legend/ 。
  GitHub Pages is enabled from main /docs. Build, deployment and status reporting all succeeded. Live URL: https://fchen6343.github.io/jianbing-legend/ .
- 已在真实 Chrome 打开线上页面，检查中文开场、英文开场与英文营业界面；营业中切回中文后进度继续，刷新后中文偏好保留。完整背景、食材、工具、订单、统计及双语按钮可见。
  Opened the live game in Chrome and checked Chinese/English start screens and English gameplay. Switching back to Chinese during play preserved progress; the language choice survived reload. Background, ingredients, tools, orders, statistics and the language button rendered.
- 未观察到游戏自身的控制台错误；日志中出现一条来自浏览器扩展的独立错误。未据此宣称完成全面音频或手机验收。
  No game-origin console errors were observed. One separate browser-extension error appeared. This does not establish full audio or mobile acceptance.
- 发布提交：bcd20521fc683845c3d7d34b9608ed8c3687bfbe；部署记录：https://github.com/fchen6343/jianbing-legend/actions/runs/40326147848 。远端 29 个文件的路径、大小与 Blob SHA 均匹配本地版本。
  Release commit: bcd20521fc683845c3d7d34b9608ed8c3687bfbe. Deployment: https://github.com/fchen6343/jianbing-legend/actions/runs/40326147848 . All 29 remote file paths, sizes and blob SHAs matched the local release.

## 2026-10-26 · v0.3.0 · 恢复并补齐 GitHub 上传

### 仓库核对

- 复用已有仓库 https://github.com/fchen6343/jianbing-legend ，没有新建仓库。
- 上传前 main 分支为 `6e80df2b1fe697914e8db146744ee73a793cad59`，完整递归文件树只有 README.md；游戏文件尚未进入分支。此前可能创建的孤立 Blob 不代表已提交的文件。
- 保留原有 README.md 的内容与 Blob SHA `efb2f268302852c35b90e2d38e08a6bc6c1a00bf`。
- 从 jianbing-legend-v0.3.0.zip 恢复 22 个文件。详细说明移至 docs/PROJECT_GUIDE.md 并修正相对链接、仓库状态；补齐原有 21 个其他文件，另加入 npm 安装生成的 package-lock.json 以锁定依赖。

### 验证与提交范围

- 从缓存安装 TypeScript 5.8.2，执行 `npm test`：严格编译、单文件构建及全部 4 项规则测试通过。
- 重建后的 play.html、dist 模块与背景图片逐字节匹配原压缩包。
- 本次提交只新增缺失路径，保留仓库原 README；以现有分支为父提交，并使用预期分支 SHA 防止覆盖并发更新。
- 上传后以递归树中的文件路径、Blob SHA 和大小核对完整性；无 node_modules 或压缩包进入仓库。

### 尚未完成

- GitHub Pages 未启用，仓库链接不等于在线试玩地址。
- 未完成真实浏览器视觉、触屏、音频与帧率验收；原版本路线图和功能边界仍有效。


## 2026-10-26 · v0.3.0 · 第一视角重构

### 问题与选择

旧版 jianbing-stall 将大部分操作摆成网页卡片，食材用 emoji 表示，与“真正站在摊位后制作”的目标不符。检查后保留旧目录作参考，新版本放入 jianbing-legend，不覆盖旧项目。

### 本次实现

- 建立 TypeScript 严格编译项目，分离玩法规则、渲染、声音与输入。
- 生成原创暖色中国街道背景，加入连续木台、中心鏊子、左右食材、前方工具的 16:9 场景。
- 13 种可操作原料/配料，库存余量影响容器内可见食材数。
- 三种人物造型，最多三名顾客；随机组合订单，支持双蛋、不要香菜与目标选择。
- 倒糊、拖动摊开、加蛋、翻面、配料、拖动刷酱、折叠、装袋、交餐完整规则。
- 饼面纹理、蛋与配料叠加、刷酱轨迹、蒸汽、折叠过渡。
- 老板五秒补货位移动画；顾客手臂伸向食材，限时拍手或失窃。
- 三分钟营业、配方核对、顾客耐心、收入、满意度、结算和再次营业。
- 点击激活的基础合成旋律及操作音；本地最近一次结算记录。
- 构建可直接打开的 play.html，另保留模块化 dist。

### 验证

`npm test`：严格 TypeScript 编译成功，4 项规则测试通过。未完成真实浏览器验收：本地监听端口被环境拒绝，浏览器本地文件导航不允许。不能用规则测试代替视觉和操作测试。

### 技术与发布阻塞

npm 无法解析 registry.npmjs.org，Phaser/Vite 未安装。使用已缓存的官方 TypeScript 5.8.2 编译器，实际渲染为 Canvas 2D。

用户已要求新建 GitHub 仓库。已打开 GitHub 新仓库入口，但落在登录页；尚未创建、推送或启用 Pages。仓库与在线地址必须等服务端成功后再记录，不能预填成功状态。

### 下轮重点

先完成浏览器实测并修复布局/手感，再统一人物与食材美术、补全动作和街道动态。不要将本版本描述成已达到《沙威玛传奇》成品质感。

## English record of earlier entries

### 2026-10-26 · v0.3.0 · GitHub upload recovery

Reused https://github.com/fchen6343/jianbing-legend without creating another repository. Before the upload, main was `6e80df2b1fe697914e8db146744ee73a793cad59`; its complete tree contained only README.md. Detached blobs, if previously created, were not committed files. The original README content and blob SHA `efb2f268302852c35b90e2d38e08a6bc6c1a00bf` were preserved in that upload.

Recovered 22 files from jianbing-legend-v0.3.0.zip. Moved the detailed guide to docs/PROJECT_GUIDE.md, corrected relative links and repository status, added the other 21 original files and included package-lock.json for reproducible dependencies. TypeScript 5.8.2 was installed from cache. `npm test` passed strict compilation, the standalone build and all four gameplay tests. Rebuilt play.html, dist modules and the background matched the archive byte for byte.

That commit added missing paths using the existing branch as parent, with an expected-head guard against concurrent updates. The final remote tree was verified by path, size and blob SHA: 24 files, including 23 additions, at commit `ae9ab628d557b6a154cbdc016dab362ac32deed7`. No node_modules or archive was uploaded. Pages had not yet been enabled at that stage, and browser, touch, audio and frame-rate acceptance remained outstanding.

### 2026-10-26 · v0.3.0 · First-person reconstruction

The older jianbing-stall version used page cards and emoji ingredients, missing the feeling of standing behind a real stall. It was retained as reference and the new game was placed in its own jianbing-legend directory.

The new implementation separated gameplay, rendering, audio and input in a strict TypeScript project. A generated warm-toned Chinese street background, continuous wooden worktop, central griddle, side ingredient containers and front tools formed the 16:9 first-person scene. Thirteen ingredients had visible inventory levels. Three character designs supported up to three customers, random orders, double eggs, no-cilantro requests and order selection.

The cooking loop included pouring batter, dragging to spread, adding eggs, flipping, adding ingredients, dragging to brush sauce, folding, bagging and serving. Rendering included pancake texture, egg and ingredient layers, brush strokes, steam and a folding transition. The boss restocked after a five-second movement; customers could reach for ingredients and had to be stopped in time. Three-minute days included recipe validation, patience, revenue, rating, results and replay. Click-activated synthesized audio and a locally stored latest-day result were included. Both standalone play.html and modular dist output were built.

Strict compilation and four gameplay tests passed. Real browser acceptance was not completed: local ports and local-file navigation were blocked in that environment. Rules tests were not treated as visual or interaction tests. The npm registry was unavailable at the time, so Phaser/Vite were not installed; the actual renderer used Canvas 2D and cached TypeScript 5.8.2. GitHub publishing was originally blocked at login and no repository or live URL was falsely recorded as complete.

The next priorities were browser testing, layout and input fixes, consistent character and ingredient artwork, fuller animation and a moving street. The prototype was not described as matching the finished quality of Shawarma Legend.


## 2026-10-27 · v0.5.0 · 制作修正与经营成长 / Cooking fixes and progression

- 根据用户九项反馈实现：折叠与偷吃手动作、小铁桶台面、鸡蛋抹匀门槛、翻面背面隐藏、单一装袋成品、多份配料、可重玩实操教程、天津限定菜单、持久经营与节日装饰。
  Implemented the nine requested areas: folds/hands, steel pails, egg spreading, hidden back-side toppings, single bagged output, multiple portions, replayable tutorial, Tianjin menu, persistent progression and festival decorations.
- 钱包逐单保存；装饰可装备/卸下，魅力每点 +2% 新顾客等待（最高 +50%）；¥180 开店扩展到五客、五秒来客。三节日按主题累计六份正确订单送限定装饰；教学不发钱或活动奖励。
  Wallet saves per order. Equipped charm adds 2% new-customer patience per point (max 50%). A ¥180 shop expands to five customers and five-second arrivals. Six correct themed orders grant a festival reward; tutorials cannot farm money or rewards.
- 模式及活动仅局间切换，商店打开自动暂停；损坏存档安全回退，未知装饰不会进入装备列表。
  Modes/events change between days; shopping pauses play. Corrupt saves fall back safely and unknown decorations are excluded.
- 13 项自动测试通过：原有制作、库存、偷吃、结算、翻译、暂停，加上持久购买/奖励、开店与耐心、天津菜单、重复鸡蛋抹匀、多份扣库存和完整教程；严格 TypeScript 编译通过。真实浏览器上线验收将在部署后补记。
  All 13 automated tests pass, including existing rules plus progression, purchases/rewards, shop/patience, Tianjin restrictions, repeated egg spreading, quantities and the complete tutorial. Strict TypeScript compilation passes. Live browser validation will be recorded after deployment.
- 新增造型使用原生 Canvas；未复制参考照片或商业游戏素材，未增加第三方运行库。手机实机、长时平衡性与音频体验仍待进一步测试。
  New shapes use native Canvas; no reference-photo or commercial-game assets were copied and no runtime dependency was added. Physical mobile, long-session balance and audio review remain pending.
