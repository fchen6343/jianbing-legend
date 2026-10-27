let language = 'zh';
export function getLanguage() { return language; }
export function setLanguage(value) { language = value; }
const english = {
    "点击加一份": "Tap to add one portion", "请先完成箭头指向的步骤": "Follow the arrow to finish this step first", "练习不限时，可丢弃重来": "Untimed practice. Discard to start again.", "跳过教程": "Skip tutorial", "点击面糊壶，开始制作": "Tap the batter pitcher to begin", "加入双蛋": "Add two eggs", "点击鸡蛋两次，订单需要两个蛋": "Tap eggs twice: this order needs two", "撒上葱花": "Add scallions", "点击葱花桶，加一份葱花": "Tap scallions to add one portion", "加入甜面酱": "Add sweet sauce", "点击甜面酱桶，加一份酱": "Tap sweet sauce to add one portion", "放入果篦儿": "Add guobier crisp", "点击脆片托盘，加一片果篦儿": "Tap the crisp tray to add one sheet",
    "配料不对哦……请清空铁板重试": "Wrong recipe. Try another pancake.", "果篦儿，加好了": "Guobier crisp added", "装饰与经营": "Decorate & grow", "新手教程": "Tutorial", "退出教程": "Exit tutorial", "游戏控制": "Game controls", "每种最多五份": "Up to five portions of each ingredient", "天津模式不提供这种配料": "This ingredient is unavailable in Tianjin mode", "纯血天津人模式": "Tianjin Purist Mode", "街角小店": "Neighborhood shop", "街角煎饼摊": "Street stall", "手作热煎饼": "Fresh Jianbing", "实操新手教程": "HANDS-ON TUTORIAL", "抹匀鸡蛋": "Spread the egg", "按住饼面来回拖动，把蛋液抹匀再翻面": "Drag over the pancake to spread the egg before flipping", "先加鸡蛋，并拖动抹匀蛋液": "Add egg, then drag to spread it evenly", "浏览器无法保存，进度仅在本次打开期间保留": "Storage unavailable: progress lasts only while this page is open", "教程完成": "Tutorial complete", "完成练习，准备正式开摊！": "Practice complete. Ready for business!", "练习不计收入，也不消耗顾客耐心": "Practice has no income or patience loss", "进入正式营业": "Start real service", "福": "FU",
    "煎饼摊传奇": "JIANBING LEGEND",
    "街角烟火 · 第一天": "STREET CORNER · DAY 1",
    "今日收入": "REVENUE",
    "剩余时间": "TIME LEFT",
    "顾客满意": "RATING",
    "学生": "Student",
    "上班族": "Office worker",
    "老街坊": "Neighbor",
    "当前订单": "CURRENT ORDER",
    "手作热煎饼 · 现做现吃": "HANDCRAFTED · FRESH FROM THE GRIDDLE",
    "街角烟火": "A LITTLE STALL. A WARM NEIGHBORHOOD.",
    "一张热煎饼，留住街坊的好胃口。": "Good food. Familiar faces. Your corner of the street.",
    "摊饼": "Spread",
    "配料": "Fill",
    "打包": "Serve",
    "点击实物 · 拖动制作 · 按订单交餐": "Tap ingredients · Drag to cook · Serve their order",
    "开始营业": "OPEN THE STALL",
    "三分钟一局 · 中英双语 · 无需下载": "3-minute days · Chinese / English · Play in your browser",
    "休息一下": "TAKE A BREATHER",
    "炉火等你回来": "Your stall will be waiting.",
    "时间、顾客耐心和补货都已暂停": "Time, patience and restocking are paused.",
    "继续营业": "RESUME COOKING",
    "暂停": "Pause",
    "辛苦啦，老板！": "A good day’s work.",
    "完成订单": "ORDERS SERVED",
    "开启声音": "Turn sound on",
    "关闭声音": "Turn sound off",
    "横屏体验更好，转动手机后再开摊": "Turn your phone sideways for a better cooking experience",
    "倒入面糊": "Pour the batter",
    "点击面糊桶，开始制作": "Tap the batter pail to begin",
    "摊开煎饼": "Spread the pancake",
    "按住铁板，来回拖动摊匀": "Hold and drag across the griddle to spread evenly",
    "加入蛋与小料": "Add egg and toppings",
    "可以翻面了": "Ready to flip",
    "按订单加入鸡蛋和小料": "Add the ordered eggs and herbs",
    "点击铲子，把煎饼翻过来": "Tap the spatula to flip the pancake",
    "补齐订单配料": "Complete the filling",
    "刷匀酱料": "Brush the sauce",
    "可以折叠了": "Ready to fold",
    "发光的食材是这张订单还缺的": "Glowing ingredients are still needed for this order",
    "按住饼面拖动，将酱料刷匀": "Hold and drag on the pancake to brush the sauce",
    "点击折叠，准备打包": "Tap the folded pancake tool to wrap it up",
    "正在折叠": "Folding…",
    "装进纸袋": "Bag it up",
    "稍等一下，热煎饼马上包好": "Just a moment while the pancake folds",
    "点击纸袋，准备交给顾客": "Tap the paper bag, then serve your customer",
    "交给这位顾客": "Serve your customer",
    "点击正在制作的顾客完成交餐": "Tap the selected customer to hand over their order",
    "煎饼摊传奇 · 街角烟火": "Jianbing Legend · Street Corner",
    "煎 饼 摊 传 奇": "JIANBING LEGEND",
    "街 角 烟 火  ·  第一日": "STREET CORNER · DAY 1",
    "煎饼真香": "So tasty!",
    "声": "SFX",
    "正在制作": "Preparing",
    "点击接单": "Select order",
    "老板，补个货！": "Boss, restock!",
    "空": "Empty",
    "街角煎饼": "Jianbing",
    "刮板": "Spreader",
    "铲子 · 翻面": "Flip",
    "折叠": "Fold",
    "纸袋": "Bag",
    "丢弃": "Discard",
    "热": "HOT",
    "今日小账": "Today’s tally",
    "哎哟！不敢啦": "Ouch! I’ll stop!",
    "点击左侧面糊开始": "Click the batter on the left to begin",
    "加鸡蛋、葱花和芝麻 → 点铲子翻面": "Add egg, scallions or sesame as ordered → Flip",
    "点击纸袋打包": "Click the paper bag to pack",
    "点击目标顾客交餐": "Click the selected customer to serve",
    "今日收摊": "Day complete",
    "街角烟火 · 煎饼摊传奇": "Jianbing Legend · Street Corner",
    "营业成绩已保存在本机（浏览器允许时）": "Day saved locally when browser storage is available",
    "1  点击面糊，按住铁板拖动摊匀": "1  Click batter, then drag on the griddle to spread",
    "2  加鸡蛋 → 铲子翻面 → 按订单加配料": "2  Add egg → Flip → Add the ordered ingredients",
    "3  拖动刷酱 → 折叠 → 装袋 → 点顾客": "3  Drag to brush sauce → Fold → Bag → Serve",
    "老板能补满食材；看到偷吃的手，快拍！": "Ask the boss to restock. Tap sneaking hands!",
    "再开一天": "Play another day",
    "开摊，来一张热乎的": "Open the stall",
    "先完成或丢弃这一张": "Finish or discard this pancake first",
    "先倒面糊，拖动刮板摊匀": "Pour batter, then drag to spread it evenly",
    "最多加两个鸡蛋": "Two eggs maximum",
    "摊开饼后再撒料": "Spread the pancake before adding toppings",
    "先加鸡蛋，用铲子翻面": "Add egg, then use the spatula to flip",
    "这一份已经加过啦": "You already added that ingredient",
    "用完了，叫右侧老板补货": "Out of stock. Ask the boss on the right to restock",
    "开摊啦！点击顾客接单，照着订单做一张热煎饼。": "Open for business! Select a customer and follow their order.",
    "先折叠装袋，再点顾客交餐": "Fold and bag first, then click a customer to serve",
    "配料不对哦……只付 ¥3，注意不要香菜和双蛋": "Wrong ingredients: ¥3 only. Check no cilantro and double eggs!",
    "啪！小手收好，想吃得先点单！": "Slap! Keep your hands back and place an order!",
    "有人伸手偷吃！快拍回去！": "A sneaking hand! Tap it before food goes missing!",
    "哎呀，被顺走两份小料！": "Oh no! Up to two portions were stolen!",
    "已接单，请看铁板上方的完整订单": "Order selected. Check the full list above the griddle.",
    "老板：来了来了，五秒补齐！": "Boss: On my way! Restocked in five seconds.",
    "老板：库存还满着，或正在路上！": "Boss: Stock is full, or I’m already on my way!",
    "翻面完成，开始刷酱加配料": "Flipped! Brush sauce and add ingredients.",
    "先摊匀并加至少一个鸡蛋": "Spread evenly and add at least one egg first",
    "折起来，香气包住！": "Folded! All that aroma wrapped inside.",
    "先翻面；加酱后请拖动刷匀": "Flip first; drag to spread any sauce evenly",
    "装袋完成，点击顾客交餐": "Bagged! Click a customer to serve.",
    "先折叠好，再装袋": "Let the fold finish before bagging",
    "清空铁板，已用食材不会退回": "Griddle cleared. Used ingredients are not refunded.",
    "直接按住铁板移动，摊饼或刷酱": "Drag on the griddle to spread batter or brush sauce",
    "不要香菜": "NO cilantro",
    "煎饼摊传奇：点击食材、拖动摊饼、点击工具和顾客": "Jianbing Legend: select ingredients, drag to spread, and click tools or customers",
    "鼠标或触屏操作。点击面糊，在铁板上拖动摊饼，加蛋后拖动抹匀，再点击铲子翻面，添加订单配料并拖动刷酱，折叠、装袋后点击顾客。点击老板补货，点击偷吃的手阻止偷吃。": "Use a mouse or touchscreen. Click batter and drag on the griddle. Add egg, drag to spread it, flip, add ordered toppings, drag to brush sauce, fold, bag, and serve. Click the boss to restock and tap sneaking hands."
};
const foodEnglish = { batter: 'Batter', egg: 'Egg', scallion: 'Scallions', cilantro: 'Cilantro', sesame: 'Sesame', sweet: 'Sweet sauce', chili: 'Chili sauce', crisp: 'Guobier crisp', ham: 'Ham', pork: 'Pork', sausage: 'Sausage', lettuce: 'Lettuce', chicken: 'Chicken', youtiao: 'Youtiao' };
const foodChinese = { batter: '面糊', egg: '鸡蛋', scallion: '葱花', cilantro: '香菜', sesame: '芝麻', sweet: '甜面酱', chili: '辣椒酱', crisp: '果篦儿', ham: '火腿', pork: '里脊', sausage: '烤肠', lettuce: '生菜', chicken: '鸡柳', youtiao: '果子' };
export function foodLabel(id, tianjin = false) { if (tianjin && id === 'crisp')
    return language === 'en' ? 'Guobier' : '果篦儿'; return (language === 'en' ? foodEnglish : foodChinese)[id] || id; }
export function t(text) {
    if (language === 'zh')
        return text;
    if (english[text])
        return english[text];
    for (const [id, label] of Object.entries(foodChinese)) {
        if (text === label + '，加好了')
            return foodEnglish[id] + ' added';
        if (text.startsWith(label + ' ') && /^\d+$/.test(text.slice(label.length + 1)))
            return foodEnglish[id] + text.slice(label.length);
    }
    let m;
    if ((m = text.match(/^¥ (\d+)   ·   (\d+) 秒   ·   满意 (\d+)$/)))
        return `¥ ${m[1]} · ${m[2]}s · Rating ${m[3]}`;
    if ((m = text.match(/^补货中 ([\d.]+)s$/)))
        return `Restocking ${m[1]}s`;
    if ((m = text.match(/^出餐 (\d+)  ·  离开 (\d+)$/)))
        return `Served ${m[1]} · Left ${m[2]}`;
    if ((m = text.match(/^快拍手！ ([\d.]+)$/)))
        return `Tap hand! ${m[1]}s`;
    if ((m = text.match(/^按住铁板拖动摊开 (\d+)%$/)))
        return `Drag on the griddle to spread · ${m[1]}%`;
    if ((m = text.match(/^照订单加配料 · 拖动刷酱 (\d+)% → 折叠$/)))
        return `Add ordered toppings · Drag to brush sauce ${m[1]}% → Fold`;
    if ((m = text.match(/^收入 ¥(\d+)  ·  出餐 (\d+) 份$/)))
        return `Revenue ¥${m[1]} · Served ${m[2]}`;
    if ((m = text.match(/^顾客满意度 (\d+) \/ 100$/)))
        return `Customer rating ${m[1]} / 100`;
    if ((m = text.match(/^真香！收到 ¥(\d+)，满意度 (\d+)$/)))
        return `Delicious! Earned ¥${m[1]} · Rating ${m[2]}`;
    return text;
}
