import { foods, theftReach, foldTargets } from './systems/game.js';
export const griddle = { x: 640, y: 505, rx: 205, ry: 94 };
export function insideGriddle(x, y) { return ((x - griddle.x) / griddle.rx) ** 2 + ((y - griddle.y) / griddle.ry) ** 2 <= 1; }
export function stationRect(index) { const left = index < 7, n = left ? index : index - 7; return { x: (left ? 28 : 964) + (n % 3) * 96, y: 418 + Math.floor(n / 3) * 84, w: 88, h: 74 }; }
export const toolIds = ['scrape', 'flip', 'fold', 'bag', 'discard'];
export function toolRect(index) { return { x: 364 + index * 112, y: 619, w: 104, h: 58 }; }
export function nextAction(g) {
    if (g.tutorial)
        return tutorialAction(g);
    const p = g.cooking, c = g.target;
    if (p.heldEgg)
        return eggAction(g, 2);
    if (p.stage === 'empty')
        return { step: 1, key: '倒入面糊', detail: '点击面糊壶，开始制作', focus: ['food:batter'], progress: 0 };
    if (p.stage === 'batter')
        return { step: 1, key: '摊开煎饼', detail: '按住铁板绕圈移动，让面糊铺满', focus: ['scrape'], progress: p.spread };
    if (p.stage === 'egg') {
        const needed = foods.filter(([id]) => ['egg', 'scallion', 'sesame', 'cilantro'].includes(id) && (c?.recipe[id] || 0) > (p.ingredients[id] || 0)).map(([id]) => 'food:' + id);
        if (!needed.length && p.eggSpread < 1)
            return { step: 2, key: '抹匀鸡蛋', detail: '从蛋黄开始拖动，把蛋液涂到整张饼', focus: ['scrape'], progress: p.eggSpread };
        return { step: 2, key: needed.length ? '加入蛋与小料' : '可以翻面了', detail: needed.length ? '按订单加入鸡蛋和小料' : '点击铲子，把煎饼翻过来', focus: needed.length ? needed : ['flip'], progress: 0 };
    }
    if (p.stage === 'flipped') {
        const needed = foods.filter(([id]) => id !== 'batter' && (c?.recipe[id] || 0) > (p.ingredients[id] || 0)).map(([id]) => 'food:' + id);
        const brush = Boolean(p.ingredients.sweet || p.ingredients.chili) && p.sauce < 1;
        return { step: 3, key: needed.length ? '补齐订单配料' : brush ? '刷匀酱料' : '可以折叠了', detail: needed.length ? '发光的食材是这张订单还缺的' : brush ? '按住饼面拖动，将酱料刷匀' : '点击折叠，开始三步拖折', focus: needed.length ? needed : brush ? ['scrape'] : ['fold'], progress: brush ? p.sauce : 0 };
    }
    if (p.stage === 'folding')
        return foldAction(g);
    if (p.stage === 'folded')
        return { step: 4, key: p.foldTime < .22 ? '正在折叠' : '装进纸袋', detail: p.foldTime < .22 ? '稍等一下，热煎饼马上包好' : '点击纸袋，准备交给顾客', focus: p.foldTime < .22 ? [] : ['bag'], progress: Math.min(1, p.foldTime / .22) };
    return { step: 5, key: '交给这位顾客', detail: '点击正在制作的顾客完成交餐', focus: g.target ? ['customer:' + g.target.id] : [], progress: 1 };
}
export function ingredientStatus(g, id) { const expected = g.target?.recipe[id] || 0, actual = g.cooking.ingredients[id] || 0; return actual > expected ? 'extra' : actual >= expected && expected > 0 ? 'done' : 'needed'; }
export function toolEnabled(g, id) { const p = g.cooking; if (p.heldEgg)
    return id === 'discard'; return id === 'discard' ? p.stage !== 'empty' : id === 'scrape' ? ['batter', 'egg', 'flipped'].includes(p.stage) : id === 'flip' ? p.stage === 'egg' && !!p.ingredients.egg && p.eggSpread >= 1 : id === 'fold' ? (['folding', 'folded'].includes(p.stage) ? p.foldStep > 0 : p.stage === 'flipped' && (!(p.ingredients.sweet || p.ingredients.chili) || p.sauce >= 1)) : id === 'bag' ? p.stage === 'folded' && p.foldTime >= .22 : true; }
export function customerX(index, shop) { return shop ? 373 + index * 137 : 445 + index * 190; }
export function eggAction(g, step) { const egg = g.cooking.heldEgg; return { step, key: egg.phase === 'held' ? '敲开鸡蛋' : '拉开蛋壳', detail: egg.phase === 'held' ? '点饼面中央敲蛋，再按住向两侧拉开' : '按住蛋壳，向左或右拉开', focus: [egg.phase === 'held' ? 'egg:crack' : 'egg:open'], progress: 0 }; }
export function foldAction(g) { const p = g.cooking; return { step: g.tutorial ? 10 : 4, key: ['折起左边', '折起右边', '托起下边'][p.foldStep], detail: ['从左边拖向中间，包住馅料', '从右边拖向中间，盖好饼边', '从下边向上托起，完成最后一折'][p.foldStep], focus: ['fold:edge'], progress: p.foldProgress }; }
export function foldTarget(g) { return foldTargets[g.cooking.foldStep]; }
export function tutorialAction(g) {
    const p = g.cooking;
    if (p.heldEgg)
        return eggAction(g, 3);
    if (p.stage === 'folding')
        return foldAction(g);
    const steps = [
        ['倒入面糊', '点击面糊壶，开始制作', 'food:batter'], ['摊开煎饼', '按住铁板绕圈移动，让面糊铺满', 'scrape'], ['加入双蛋', '点蛋盘拿蛋，敲开并拉开蛋壳；共两个', 'food:egg'], ['抹匀鸡蛋', '从蛋黄开始拖动，把蛋液涂到整张饼', 'scrape'], ['撒上葱花', '点击葱花桶，加一份葱花', 'food:scallion'], ['可以翻面了', '点击铲子，把煎饼翻过来', 'flip'], ['加入甜面酱', '点击甜面酱桶，加一份酱', 'food:sweet'], ['刷匀酱料', '按住饼面拖动，将酱料刷匀', 'scrape'], ['放入果篦儿', '点击脆片托盘，加一片果篦儿', 'food:crisp'], ['可以折叠了', '点击折叠，开始三步拖折', 'fold'], ['装进纸袋', '点击纸袋，准备交给顾客', 'bag'], ['交给这位顾客', '点击正在制作的顾客完成交餐', 'customer:' + g.target?.id]
    ];
    let i = p.stage === 'empty' ? 0 : p.stage === 'batter' ? 1 : p.stage === 'egg' ? ((p.ingredients.egg || 0) < 2 ? 2 : p.eggSpread < 1 ? 3 : !p.ingredients.scallion ? 4 : 5) : p.stage === 'flipped' ? (!p.ingredients.sweet ? 6 : p.sauce < 1 ? 7 : !p.ingredients.crisp ? 8 : 9) : p.stage === 'folded' ? 10 : 11;
    return { step: i + 1, key: steps[i][0], detail: steps[i][1], focus: p.stage === 'folded' && p.foldTime < .22 ? [] : [steps[i][2]], progress: i === 1 ? p.spread : i === 3 ? p.eggSpread : i === 7 ? p.sauce : 0 };
}
export function tutorialAllows(g, id) { return !g.tutorial || (id === 'fold' && ['folding', 'folded'].includes(g.cooking.stage)) || (id === 'food:egg' && !!g.cooking.heldEgg) || ['discard', 'boss'].includes(id) || tutorialAction(g).focus.includes(id); }
export function restockPhase(remaining) { return remaining <= 0 ? 'ready' : remaining > 3.7 ? 'fetch' : remaining > 2.5 ? 'carry' : 'pour'; }
export function clawGeometry(g) { const th = g.theft; if (!th)
    return null; const ci = g.customers.findIndex(c => c.id === th.customer), sx = customerX(Math.max(0, ci), g.profile.shop), sy = 286, r = stationRect(foods.findIndex(f => f[0] === th.food)); const extension = th.slapped ? Math.max(0, th.remaining / .65) * (th.reach ?? 1) : theftReach(th.remaining), e = extension * extension * (3 - 2 * extension); return { sx, sy, hx: sx + (r.x + 44 - sx) * e, hy: sy + (r.y + 25 - sy) * e, extension }; }
