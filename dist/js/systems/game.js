import { freshProfile, patienceMultiplier, rewardService } from './progress.js';
import { foodLabel } from '../i18n.js';
export const foods = [
    ['batter', '面糊', '#efcf84'], ['egg', '鸡蛋', '#ffca46'], ['scallion', '葱花', '#74a638'], ['cilantro', '香菜', '#397842'], ['sesame', '芝麻', '#f6dd9c'], ['sweet', '甜面酱', '#814127'], ['chili', '辣椒酱', '#ce472c'], ['crisp', '果篦儿', '#e5a243'], ['ham', '火腿', '#d97d70'], ['pork', '里脊', '#b97945'], ['sausage', '烤肠', '#a94d30'], ['lettuce', '生菜', '#83ad43'], ['chicken', '鸡柳', '#dca154'], ['youtiao', '果子', '#dba751']
];
export class Inventory {
    constructor() {
        this.stock = Object.fromEntries(foods.map(([id]) => [id, 8]));
        this.refill = 0;
        this.refillFoods = [];
    }
    take(id, n = 1) { if (this.stock[id] < n)
        return false; this.stock[id] -= n; return true; }
    request() { if (this.refill || !Object.values(this.stock).some(n => n < 8))
        return false; this.refillFoods = foods.filter(([id]) => this.stock[id] < 8).map(([id]) => id); this.refill = 5; return true; }
    tick(dt) { if (this.refill > 0) {
        this.refill = Math.max(0, this.refill - dt);
        if (!this.refill)
            for (const [id] of foods)
                this.stock[id] = 8;
    } }
}
// Twenty-five sample areas describe the real coating, independent of input distance.
export const eggAreas = [{ x: 640, y: 502 }, ...Array.from({ length: 8 }, (_, i) => ({ x: 640 + Math.cos(i / 8 * Math.PI * 2) * 73, y: 502 + Math.sin(i / 8 * Math.PI * 2) * 32 })), ...Array.from({ length: 16 }, (_, i) => ({ x: 640 + Math.cos(i / 16 * Math.PI * 2) * 145, y: 502 + Math.sin(i / 16 * Math.PI * 2) * 63 }))];
export function theftReach(remaining) { return remaining < .8 ? Math.max(0, remaining / .8) : Math.min(1, (3 - remaining) / 1.1); }
export class Cooking {
    constructor() {
        this.stage = 'empty';
        this.ingredients = {};
        this.underside = {};
        this.eggLayers = [];
        this.heldEgg = null;
        this.eggLast = null;
        this.eggStrokeBreak = true;
        this.spread = 0;
        this.batterSectors = Array(16).fill(false);
        this.batterAngle = null;
        this.sauce = 0;
        this.strokes = [];
        this.strokeBreak = true;
        this.heat = 0;
        this.foldTime = 0;
    }
    get eggSpread() { return this.eggLayers.length ? Math.min(...this.eggLayers.map(e => e.spread)) : 0; }
    add(id, inventory) {
        if (id === 'egg')
            return this.pickEgg(inventory);
        if (this.heldEgg)
            return '先打开手中的蛋，或再点蛋盘放回';
        if (id === 'batter') {
            if (this.stage !== 'empty')
                return '先完成或丢弃这一张';
        }
        else if (id === 'scallion' || id === 'sesame' || id === 'cilantro') {
            if (this.stage !== 'egg' && this.stage !== 'flipped')
                return '摊开饼后再撒料';
        }
        else if (this.stage !== 'flipped')
            return '先加鸡蛋，用铲子翻面';
        if ((this.ingredients[id] || 0) >= 5)
            return '每种最多五份';
        if (!inventory.take(id))
            return '用完了，叫右侧老板补货';
        this.ingredients[id] = (this.ingredients[id] || 0) + 1;
        if (id === 'batter')
            this.stage = 'batter';
        if (this.stage === 'egg')
            this.underside[id] = (this.underside[id] || 0) + 1;
        return `${foods.find(f => f[0] === id)[1]}，加好了`;
    }
    pickEgg(inventory) {
        if (this.heldEgg) {
            this.heldEgg = null;
            return '鸡蛋已放回，没有消耗库存';
        }
        if (this.stage !== 'egg')
            return '先倒面糊，拖动刮板摊匀';
        if ((this.ingredients.egg || 0) >= 5)
            return '每种最多五份';
        if (inventory.stock.egg < 1)
            return '用完了，叫右侧老板补货';
        this.heldEgg = { phase: 'held', x: 640, y: 490, open: 0 };
        this.endStroke();
        return '拿好鸡蛋了，点饼面敲一下';
    }
    beginEgg(x, y) {
        const egg = this.heldEgg;
        if (!egg || !Number.isFinite(x) || !Number.isFinite(y))
            return false;
        if (egg.phase === 'held') {
            if (((x - 640) / 172) ** 2 + ((y - 502) / 72) ** 2 > 1)
                return false;
            egg.phase = 'cracked';
            egg.x = x;
            egg.y = y;
            egg.open = 0;
            return true;
        }
        return Math.abs(x - egg.x) <= 85 && Math.abs(y - (egg.y - 20)) <= 65;
    }
    pullEgg(x, y, inventory) {
        const held = this.heldEgg;
        if (!held || held.phase !== 'cracked' || !Number.isFinite(x) || !Number.isFinite(y) || Math.abs(y - held.y) > 85)
            return false;
        held.open = Math.min(1, Math.abs(x - held.x) / 58);
        if (held.open < 1)
            return false;
        // Stock and recipe change together only after a complete manual opening.
        if (!inventory.take('egg')) {
            this.heldEgg = null;
            return false;
        }
        this.ingredients.egg = (this.ingredients.egg || 0) + 1;
        this.underside.egg = (this.underside.egg || 0) + 1;
        this.eggLayers.push({ x: held.x, y: held.y, age: 0, spread: 0, broken: false, loaded: false, covered: eggAreas.map(() => false), strokes: [] });
        this.heldEgg = null;
        this.endStroke();
        return true;
    }
    endStroke() { this.strokeBreak = true; this.eggStrokeBreak = true; this.eggLast = null; this.batterAngle = null; for (const egg of this.eggLayers)
        egg.loaded = false; }
    drag(x, y, distance) {
        if (this.heldEgg)
            return;
        if (this.stage === 'batter')
            this.spreadBatter(x, y, distance);
        else if (this.stage === 'egg' && this.ingredients.egg)
            this.spreadEgg(x, y, distance);
        else if (this.stage === 'flipped' && (this.ingredients.sweet || this.ingredients.chili)) {
            this.sauce = Math.min(1, this.sauce + distance / 300);
            this.strokes.push({ x, y, move: this.strokeBreak });
            this.strokeBreak = false;
            if (this.strokes.length > 100)
                this.strokes.shift();
        }
    }
    spreadEgg(x, y, distance) {
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(distance) || distance <= 0 || ((x - 640) / 202) ** 2 + ((y - 502) / 88) ** 2 > 1) {
            this.endStroke();
            return;
        }
        const last = this.eggStrokeBreak ? null : this.eggLast;
        const length = last ? Math.hypot(x - last.x, (y - last.y) * 2.2) : 0;
        if (last && length < .5)
            return;
        // Lifting or jumping never draws a line across untouched food.
        const connected = !!last && length <= 180, steps = connected ? Math.max(1, Math.ceil(length / 10)) : 1;
        for (const egg of this.eggLayers) {
            if (egg.age < .28 || egg.spread >= 1)
                continue;
            if (!connected)
                egg.loaded = false;
            let move = !connected || !egg.loaded;
            for (let n = 1; n <= steps; n++) {
                const px = connected ? last.x + (x - last.x) * n / steps : x, py = connected ? last.y + (y - last.y) * n / steps : y;
                const near = (ax, ay) => Math.hypot(px - ax, (py - ay) * 2.2) < 42;
                if (!egg.loaded && (near(egg.x, egg.y) || eggAreas.some((a, i) => egg.covered[i] && near(a.x, a.y)))) {
                    egg.loaded = true;
                    egg.broken = true;
                    move = true;
                }
                if (!egg.loaded)
                    continue;
                eggAreas.forEach((area, i) => { if (Math.hypot(px - area.x, (py - area.y) * 2.2) < 47)
                    egg.covered[i] = true; });
                egg.strokes.push({ x: px, y: py, move });
                move = false;
                if (egg.strokes.length > 320)
                    egg.strokes.shift();
            }
            egg.spread = Math.min(1, egg.covered.filter(Boolean).length / 23);
        }
        this.eggLast = { x, y };
        this.eggStrokeBreak = false;
    }
    spreadBatter(x, y, distance) { const dx = (x - 640) / 205, dy = (y - 505) / 94, r = Math.hypot(dx, dy); if (!Number.isFinite(r) || !Number.isFinite(distance) || distance <= 0 || r < .25 || r > .98) {
        this.batterAngle = null;
        return;
    } const angle = Math.atan2(dy, dx); const mark = (a) => { const positive = (a + Math.PI * 2) % (Math.PI * 2); this.batterSectors[Math.floor(positive / (Math.PI * 2) * 16) % 16] = true; }; mark(angle); if (this.batterAngle !== null) {
        let delta = angle - this.batterAngle;
        delta = Math.atan2(Math.sin(delta), Math.cos(delta));
        if (Math.abs(delta) <= Math.PI / 2) {
            const steps = Math.ceil(Math.abs(delta) / (Math.PI / 32));
            for (let i = 1; i <= steps; i++)
                mark(this.batterAngle + delta * i / steps);
        }
    } this.batterAngle = angle; this.spread = this.batterSectors.filter(Boolean).length / 16; if (this.spread === 1)
        this.stage = 'egg'; }
    flip() { if (this.heldEgg || this.stage !== 'egg' || !this.ingredients.egg || this.eggSpread < 1)
        return false; this.stage = 'flipped'; return true; }
    fold() { if (this.stage !== 'flipped' || ((this.ingredients.sweet || this.ingredients.chili) && this.sauce < 1))
        return false; this.stage = 'folded'; this.foldTime = 0; return true; }
    bag() { if (this.stage !== 'folded' || this.foldTime < .65)
        return false; this.stage = 'bagged'; this.foldTime = 0; return true; }
    tick(dt) { for (const egg of this.eggLayers)
        egg.age += dt; if (this.stage !== 'empty' && this.stage !== 'bagged')
        this.heat += dt; if (this.stage === 'folded' || this.stage === 'bagged')
        this.foldTime += dt; }
}
export class Game {
    constructor(random = Math.random, profile = freshProfile(), tutorial = false) {
        this.random = random;
        this.profile = profile;
        this.tutorial = tutorial;
        this.inventory = new Inventory();
        this.cooking = new Cooking();
        this.customers = [];
        this.time = 180;
        this.money = 0;
        this.served = 0;
        this.streak = 0;
        this.lost = 0;
        this.ratings = [];
        this.ended = false;
        this.started = false;
        this.paused = false;
        this.next = 0;
        this.serial = 0;
        this.spawn = 0;
        this.theftIn = 15;
        this.theft = null;
        this.message = '开摊啦！点击顾客接单，照着订单做一张热煎饼。';
    }
    get availableFoods() { return foods.filter(([id]) => this.profile.mode !== 'tianjin' || ['batter', 'egg', 'scallion', 'cilantro', 'sweet', 'chili', 'crisp', 'youtiao'].includes(id)); }
    addFood(id) { if (!this.availableFoods.some(f => f[0] === id))
        return '天津模式不提供这种配料'; const message = this.cooking.add(id, this.inventory); return this.profile.mode === 'tianjin' ? message.replace('薄脆', '果篦儿') : message; }
    makeRecipe() {
        const egg = this.random() < .3 ? 2 : 1;
        const recipe = { batter: 1, egg, sweet: 1 };
        if (this.profile.mode === 'tianjin') {
            recipe[this.random() < .5 ? 'youtiao' : 'crisp'] = this.random() < .3 ? 2 : 1;
            for (const id of ['scallion', 'cilantro', 'chili'])
                if (this.random() < .4)
                    recipe[id] = 1;
        }
        else {
            const protein = ['ham', 'pork', 'sausage', 'chicken'][Math.floor(this.random() * 4)];
            recipe[protein] = this.random() < .2 ? 2 : 1;
            for (const id of ['scallion', 'sesame', 'crisp', 'lettuce', 'chili', 'cilantro'])
                if (this.random() < .35)
                    recipe[id] = this.random() < .15 ? 3 : 1;
        }
        return this.tutorial ? { batter: 1, egg: 2, scallion: 1, sweet: 1, crisp: 1 } : recipe;
    }
    newCustomer() {
        const recipe = this.makeRecipe();
        const max = 100 * patienceMultiplier(this.profile);
        const c = { id: ++this.serial, look: this.serial % 3, recipe, patience: max, max, noCilantro: !recipe.cilantro };
        if (this.tutorial)
            c.noCilantro = true;
        this.customers.push(c);
        if (!this.next)
            this.next = c.id;
    }
    canSwitchMode() { return !this.started || this.ended || (this.cooking.stage === 'empty' && !this.theft); }
    switchMode(mode) { if (mode === this.profile.mode)
        return true; if (!this.canSwitchMode()) {
        this.message = '请先交餐或清空铁板，再切换模式';
        return false;
    } this.profile.mode = mode; for (const c of this.customers) {
        c.recipe = this.makeRecipe();
        c.noCilantro = !c.recipe.cilantro;
    } this.message = '模式已切换，顾客已重新点单'; return true; }
    get target() { return this.customers.find(c => c.id === this.next) || this.customers[0]; }
    serve() { if (this.cooking.stage !== 'bagged' || !this.target) {
        this.message = '先折叠装袋，再点顾客交餐';
        return false;
    } const c = this.target; const correct = foods.every(([id]) => (c.recipe[id] || 0) === (this.cooking.ingredients[id] || 0)); const quality = Math.max(0, 1 - Math.max(0, this.cooking.heat - 65) / 70); const rating = correct ? Math.round(65 + 25 * c.patience / c.max + 10 * quality) : 20; const base = 8 + Object.values(c.recipe).reduce((a, b) => a + (b || 0), 0); this.streak = correct && this.cooking.heat < 40 ? this.streak + 1 : 0; const tip = correct && !this.tutorial ? Math.min(5, Math.max(0, this.streak - 1)) : 0; const earned = correct ? Math.round(base * (.8 + .2 * quality)) + tip : 3; if (!this.tutorial) {
        this.money += earned;
        rewardService(this.profile, earned, correct);
    }
    else if (correct)
        this.profile.tutorial = true; this.served++; this.ratings.push(rating); this.message = this.tutorial ? (correct ? '完成练习，准备正式开摊！' : '配料不对哦……请清空铁板重试') : correct ? `真香！收到 ¥${earned}，满意度 ${rating}` : '配料不对哦……只付 ¥3，注意不要香菜和双蛋'; this.customers = this.customers.filter(v => v.id !== c.id); this.next = this.customers[0]?.id || 0; this.cooking = new Cooking(); return correct; }
    slap() { if (!this.theft || this.theft.slapped)
        return false; this.theft.reach = theftReach(this.theft.remaining); this.theft.slapped = true; this.theft.remaining = .65; this.message = '叮！夹子收回去，想吃得先点单！'; return true; }
    tick(dt) {
        if (!this.started || this.ended || this.paused)
            return;
        dt = Math.min(dt, .1);
        if (this.tutorial) {
            this.inventory.tick(dt);
            this.cooking.tick(dt);
            if (!this.customers.length)
                this.newCustomer();
            return;
        }
        this.time = Math.max(0, this.time - dt);
        this.inventory.tick(dt);
        this.cooking.tick(dt);
        this.spawn -= dt;
        if (this.customers.length < (this.profile.shop ? 5 : 3) && this.spawn <= 0) {
            this.newCustomer();
            this.spawn = this.profile.shop ? 5 : 9;
        }
        for (const c of this.customers)
            c.patience -= dt * (c.id === this.next?.valueOf() ? .72 : .38);
        const leaving = this.customers.filter(c => c.patience <= 0);
        this.lost += leaving.length;
        if (leaving.length)
            this.streak = 0;
        for (const c of leaving)
            this.ratings.push(0);
        this.customers = this.customers.filter(c => c.patience > 0);
        if (this.theft && !this.customers.some(c => c.id === this.theft.customer))
            this.theft = null;
        if (!this.customers.some(c => c.id === this.next))
            this.next = this.customers[0]?.id || 0;
        this.theftIn -= dt;
        if (!this.theft && this.theftIn <= 0 && this.customers.length) {
            const choices = (this.profile.mode === 'tianjin' ? ['crisp', 'scallion', 'youtiao'] : ['crisp', 'scallion', 'ham']).filter(id => this.inventory.stock[id] > 0);
            if (choices.length) {
                this.theft = { customer: this.customers[0].id, food: choices[Math.floor(this.random() * choices.length)], remaining: 3, slapped: false };
                this.message = '有人用夹子偷吃！快点夹子！';
            }
            this.theftIn = 22 + this.random() * 18;
        }
        if (this.theft) {
            this.theft.remaining -= dt;
            if (this.theft.remaining <= 0) {
                if (!this.theft.slapped) {
                    const id = this.theft.food;
                    this.inventory.take(id, Math.min(2, this.inventory.stock[id]));
                    this.message = '哎呀，被顺走两份小料！';
                }
                this.theft = null;
            }
        }
        if (!this.time)
            this.ended = true;
    }
    get satisfaction() { return this.ratings.length ? Math.round(this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length) : 100; }
}
export function recipeText(c) { return foods.filter(([id]) => id !== 'batter' && c.recipe[id]).map(([id, label]) => `${foodLabel(id)} ×${c.recipe[id]}`).join(' · '); }
