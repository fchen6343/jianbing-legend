import { t, getLanguage } from '../i18n.js';
import { foods, recipeText } from '../systems/game.js';
export class Scene {
    constructor(canvas) {
        this.canvas = canvas;
        this.background = new Image();
        this.hits = [];
        this.clock = 0;
        this.pointer = { x: 640, y: 460 };
        this.ctx = canvas.getContext('2d');
        this.background.src = './assets/street.png';
    }
    box(x, y, w, h, color, r = 12) { const c = this.ctx; c.fillStyle = color; c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); }
    text(s, x, y, size = 18, color = '#42281e', align = 'center', maxWidth = 1180) { const c = this.ctx; s = t(s); c.font = `${size >= 22 ? 'bold ' : ''}${size}px system-ui`; c.fillStyle = color; c.textAlign = align; c.fillText(s, x, y, maxWidth); }
    wrap(s, maxWidth, size) { const c = this.ctx; c.font = `${size}px system-ui`; const units = getLanguage() === 'en' ? s.split(' ') : Array.from(s); const join = getLanguage() === 'en' ? ' ' : ''; const lines = []; let line = ''; for (const unit of units) {
        const next = line ? line + join + unit : unit;
        if (line && c.measureText(next).width > maxWidth) {
            lines.push(line);
            line = unit;
        }
        else
            line = next;
    } if (line)
        lines.push(line); return lines; }
    ellipse(x, y, rx, ry, color) { const c = this.ctx; c.fillStyle = color; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); }
    hit(id, x, y, w, h) { this.hits.push({ id, x, y, w, h }); }
    path(points, fill, stroke = '#613e2a', width = 3) { const c = this.ctx; c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fillStyle = fill; c.fill(); c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
    person(x, y, look, scale = 1, mood = 1) { const c = this.ctx; c.save(); c.translate(x, y); c.scale(scale, scale); const colors = ['#407f91', '#d88451', '#89924c']; this.ellipse(0, 118, 54, 12, '#30231e40'); this.path([[-45, 110], [-47, 48], [-25, 29], [25, 29], [47, 48], [45, 110]], colors[look]); this.path([[-16, 33], [0, 53], [17, 33], [10, 27], [-10, 27]], '#fff0ce'); this.ellipse(0, -10, 37, 46, '#593d2f'); this.ellipse(0, 0, 34, 40, '#efb984'); this.ellipse(-35, 2, 7, 12, '#e8aa7b'); this.ellipse(35, 2, 7, 12, '#e8aa7b'); this.path([[-35, -13], [-26, -40], [13, -45], [34, -24], [22, -19], [3, -29], [-13, -13]], look === 2 ? '#c3b8a1' : '#49362e'); if (look === 0) {
        this.box(-42, -40, 79, 14, '#d5a946', 5);
        this.box(-30, -58, 60, 25, '#edc660', 7);
    } if (look === 1) {
        this.ellipse(32, -29, 15, 19, '#49362e');
        this.box(-28, -34, 50, 7, '#c65c42', 3);
    } this.ellipse(-13, -1, 3.4, 4, '#392820'); this.ellipse(13, -1, 3.4, 4, '#392820'); this.ellipse(-23, 13, 8, 4, '#df8a6b'); this.ellipse(23, 13, 8, 4, '#df8a6b'); c.strokeStyle = '#74452b'; c.lineWidth = 3; c.beginPath(); c.arc(0, 14, 10, mood > .3 ? 0 : Math.PI, mood > .3 ? Math.PI : Math.PI * 2); c.stroke(); if (look === 2) {
        c.strokeStyle = '#604b3b';
        c.lineWidth = 2;
        for (const xx of [-14, 14]) {
            c.beginPath();
            c.arc(xx, 0, 10, 0, 7);
            c.stroke();
        }
        c.beginPath();
        c.moveTo(-4, 0);
        c.lineTo(4, 0);
        c.stroke();
    } this.box(-32, 60, 64, 48, '#ede0bc', 5); this.text('煎饼真香', 0, 88, 12, '#42281e', 'center', 59); this.ellipse(-44, 89, 10, 16, '#efb984'); this.ellipse(44, 89, 10, 16, '#efb984'); c.restore(); }
    food(id, x, y, s = 1, seed = 0) { const c = this.ctx; c.save(); c.translate(x, y); c.scale(s, s); if (id === 'egg') {
        this.ellipse(0, 0, 12, 16, '#f7e4bb');
        this.ellipse(-4, -5, 3, 6, '#fff8dd');
    }
    else if (id === 'ham' || id === 'sausage') {
        c.rotate(-.4);
        this.box(-22, -7, 44, 14, id === 'ham' ? '#ce7a69' : '#a94d2c', 7);
        this.box(-17, -5, 32, 3, '#edaf82', 2);
        for (let i = 0; i < 3; i++) {
            c.strokeStyle = '#803f29';
            c.beginPath();
            c.moveTo(-9 + i * 9, -5);
            c.lineTo(-13 + i * 9, 4);
            c.stroke();
        }
    }
    else if (id === 'crisp' || id === 'chicken' || id === 'pork') {
        this.path([[-20, -9], [12, -13], [23, 5], [6, 12], [-17, 8]], id === 'crisp' ? '#e8ad46' : id === 'chicken' ? '#d99739' : '#b9794d', '#9e662b', 1.5);
        for (let i = 0; i < 9; i++)
            this.ellipse(Math.sin(i * 7 + seed) * 16, Math.cos(i * 3) * 7, 1.8, 1.1, '#9c642d');
    }
    else if (id === 'scallion' || id === 'cilantro' || id === 'lettuce') {
        for (let i = 0; i < 5; i++) {
            this.ellipse(Math.sin(i * 5) * 13, Math.cos(i * 4) * 7, id === 'scallion' ? 4 : 9, id === 'scallion' ? 3 : 6, i % 2 ? '#589342' : '#8cb654');
        }
        c.strokeStyle = '#bfd27c';
        c.beginPath();
        c.moveTo(-12, 4);
        c.lineTo(15, -4);
        c.stroke();
    }
    else if (id === 'sesame') {
        for (let i = 0; i < 9; i++)
            this.ellipse(Math.sin(i * 5) * 16, Math.cos(i * 4) * 9, 2, 1, '#f2d99c');
    }
    else {
        this.ellipse(0, 0, 20, 10, id === 'sweet' ? '#74391f' : id === 'chili' ? '#c54b2a' : '#efd596');
        this.ellipse(-6, -3, 9, 2, '#ffffff33');
    } c.restore(); }
    draw(g, dt) {
        this.clock += dt;
        this.hits = [];
        const c = this.ctx;
        c.clearRect(0, 0, 1280, 720);
        if (this.background.complete && this.background.naturalWidth)
            c.drawImage(this.background, 0, 0, 1280, 720);
        else {
            const grad = c.createLinearGradient(0, 0, 0, 720);
            grad.addColorStop(0, '#e5bd7e');
            grad.addColorStop(.4, '#c3a477');
            grad.addColorStop(1, '#94552c');
            c.fillStyle = grad;
            c.fillRect(0, 0, 1280, 720);
        }
        // Street canopy and a compact shop sign, leaving the street visible.
        this.box(18, 16, 242, 51, '#532d23e8', 8);
        this.text('煎 饼 摊 传 奇', 139, 49, 26, '#ffe5ad', 'center', 224);
        this.text('街 角 烟 火  ·  第一日', 140, 83, 14, '#fff3c9', 'center', 240);
        this.box(930, 18, 330, 46, '#fff0d9eb');
        this.text(`¥ ${g.money}   ·   ${Math.ceil(g.time)} 秒   ·   满意 ${g.satisfaction}`, 1095, 48, 19);
        this.box(1210, 78, 50, 33, '#fff0d9');
        this.text('声', 1235, 101, 18);
        this.hit('sound', 1210, 78, 50, 33);
        g.customers.forEach((v, i) => { const x = 400 + i * 220; const bob = Math.sin(this.clock * 2 + i) * 2; this.person(x, 226 + bob, v.look, .88, v.patience / v.max); this.box(x - 97, 105, 194, 75, v.id === g.next ? '#fff3d8' : '#eadbbf', 12); this.text(v.id === g.next ? '正在制作' : '点击接单', x, 127, 16, '#a2542b'); const label = recipeText(v); const chunks = this.wrap(label, 180, 12); chunks.slice(0, 2).forEach((line, j) => this.text(line, x, 149 + j * 17, 12, '#42281e', 'center', 180)); this.box(x - 74, 184, 148, 5, '#583f33'); this.box(x - 74, 184, 148 * v.patience / v.max, 5, v.patience > 30 ? '#86ac56' : '#d9633e'); this.hit('customer:' + v.id, x - 97, 105, 194, 210); });
        const refill = g.inventory.refill;
        const bossX = refill ? 1127 - Math.sin((5 - refill) / 5 * Math.PI) * 90 : 1170;
        this.person(bossX, 235 + Math.sin(this.clock * 3) * 2, 2, .76);
        this.box(1085, 321, 178, 34, '#fff0d9');
        this.text(refill ? `补货中 ${refill.toFixed(1)}s` : '老板，补个货！', 1174, 345, 17);
        this.hit('boss', 1070, 171, 200, 191);
        // Griddle with metal rim, reflected highlights and warm ring.
        this.ellipse(640, 505, 222, 119, '#462e22');
        this.ellipse(640, 489, 221, 119, '#c1c3b8');
        this.ellipse(640, 484, 215, 114, '#515857');
        this.ellipse(640, 480, 204, 107, '#252d2d');
        c.strokeStyle = '#899089';
        c.lineWidth = 2;
        c.beginPath();
        c.ellipse(640, 480, 197, 101, 0, 0, 7);
        c.stroke();
        for (let i = 0; i < foods.length; i++) {
            const [id, label] = foods[i];
            const left = i < 7;
            const n = left ? i : i - 7;
            const x = left ? 55 + (n % 3) * 115 : 909 + (n % 3) * 111;
            const y = left ? 357 + Math.floor(n / 3) * 79 : 389 + Math.floor(n / 3) * 87;
            this.box(x - 12, y - 11, 106, 72, '#613c27', 14);
            this.box(x - 10, y - 16, 102, 68, '#c8c8ac', 13);
            this.box(x - 3, y - 10, 88, 49, '#676c55', 10);
            this.box(x, y - 7, 82, 43, id === 'sweet' ? '#703c28' : id === 'chili' ? '#a6432b' : '#ddd0a1', 8);
            const count = g.inventory.stock[id];
            for (let z = 0; z < count; z++)
                this.food(id, x + 17 + (z % 3) * 23, y + 3 + Math.floor(z / 3) * 11, .62, z);
            if (!count)
                this.text('空', x + 41, y + 23, 17, '#6b604c');
            this.box(x - 3, y + 38, 90, 22, '#ffedc9', 4);
            this.text(`${label} ${count}`, x + 41, y + 54, 14, '#42281e', 'center', 86);
            this.hit('food:' + id, x - 12, y - 16, 106, 77);
        }
        const p = g.cooking;
        if (p.stage !== 'empty') {
            c.save();
            c.beginPath();
            c.ellipse(640, 478, 185, 92, 0, 0, 7);
            c.clip();
            if (p.stage === 'folded' || p.stage === 'bagged') {
                if (p.stage === 'bagged') {
                    this.path([[552, 426], [732, 426], [715, 533], [564, 533]], '#e8cd96');
                    for (let i = 0; i < 7; i++) {
                        c.strokeStyle = '#c0a371';
                        c.beginPath();
                        c.moveTo(560 + i * 22, 433);
                        c.lineTo(566 + i * 20, 526);
                        c.stroke();
                    }
                    this.text('街角煎饼', 640, 485, 25, '#9a4727');
                }
                else {
                    const t = Math.min(1, p.foldTime / .65);
                    this.path([[475 + 50 * t, 453], [805 - 50 * t, 453], [765 - 20 * t, 526], [515 + 20 * t, 526]], '#e7b951');
                    this.path([[475 + 50 * t, 453], [640, 423 + 30 * t], [805 - 50 * t, 453], [640, 493]], '#f2d286');
                }
            }
            else {
                const rx = p.stage === 'batter' ? 65 + 120 * p.spread : 185;
                this.ellipse(640, 478, rx, rx * .5, '#d99d45');
                this.ellipse(640, 474, rx - 3, rx * .49, '#ebca7d');
                for (let i = 0; i < 95; i++) {
                    const xx = Math.sin(i * 13.3) * rx * .94, yy = Math.cos(i * 7.1) * rx * .45;
                    if (xx * xx / (rx * rx) + yy * yy / (rx * rx * .25) < .9)
                        this.ellipse(640 + xx, 474 + yy, 1.4 + (i % 3), 1, '#b97f3b50');
                }
                for (let n = 0; n < (p.ingredients.egg || 0); n++) {
                    this.ellipse(603 + n * 75, 464, 60, 29, '#ffedaaab');
                    this.ellipse(602 + n * 75, 459, 16, 9, '#f7b823');
                }
                for (const v of p.strokes) {
                    this.ellipse(v.x, v.y, 22, 10, p.ingredients.chili ? '#ab492b80' : '#753d2675');
                }
                foods.filter(([id]) => !['batter', 'egg', 'sweet', 'chili'].includes(id) && p.ingredients[id]).forEach(([id], j) => { for (let n = 0; n < 4; n++)
                    this.food(id, 568 + (n % 2) * 105 + Math.sin(j) * 17, 446 + Math.floor(n / 2) * 41 + Math.cos(j) * 14, .8, n); });
            }
            c.restore();
            if (p.stage !== 'bagged') {
                for (let i = 0; i < 4; i++) {
                    const t = (this.clock * .5 + i / 4) % 1;
                    c.globalAlpha = (1 - t) * .28;
                    c.strokeStyle = '#fff8db';
                    c.lineWidth = 4;
                    c.beginPath();
                    c.moveTo(555 + i * 55, 435 - t * 60);
                    c.bezierCurveTo(535 + i * 55, 415 - t * 65, 575 + i * 55, 405 - t * 65, 555 + i * 55, 390 - t * 60);
                    c.stroke();
                }
                c.globalAlpha = 1;
            }
        }
        // Tool rail. Each hit region is an object and a short label.
        const toolNames = [['scrape', '刮板'], ['flip', '铲子 · 翻面'], ['fold', '折叠'], ['bag', '纸袋'], ['discard', '丢弃']];
        toolNames.forEach(([id, label], i) => { const x = 375 + i * 118; this.ellipse(x, 618, 48, 8, '#57331c55'); if (i < 2) {
            this.box(x - 5, 568, 10, 42, '#8b4b2a', 4);
            this.box(x - 31, 557, 62, i ? 22 : 9, i ? '#bec4b8' : '#d7b574', 4);
        }
        else if (i === 2) {
            this.path([[x - 31, 577], [x + 31, 577], [x + 21, 605], [x - 19, 605]], '#e4b15c');
        }
        else if (i === 3) {
            this.path([[x - 26, 558], [x + 28, 558], [x + 22, 610], [x - 22, 610]], '#ecd5a1');
            this.text('热', x, 591, 18, '#a45936');
        }
        else {
            this.box(x - 19, 565, 38, 42, '#657169', 5);
            this.box(x - 24, 559, 48, 7, '#adb7a6', 3);
        } this.text(label, x, 641, 15, '#fff0cc', 'center', 100); this.hit(id, x - 52, 550, 104, 100); });
        this.box(22, 603, 245, 58, '#fff0d9e8', 8);
        this.text('今日小账', 44, 625, 14, '#985e38', 'left');
        this.text(`出餐 ${g.served}  ·  离开 ${g.lost}`, 44, 649, 18, '#503929', 'left');
        if (g.theft) {
            const th = g.theft;
            const customer = g.customers.findIndex(v => v.id === th.customer);
            const sx = 400 + Math.max(0, customer) * 220;
            const target = this.hits.find(h => h.id === 'food:' + th.food);
            const travel = th.slapped ? Math.max(0, th.remaining / .65) : Math.min(1, (3 - th.remaining) / 1.1);
            const hx = sx + (target.x + 45 - sx) * travel, hy = 300 + (target.y + 20 - 300) * travel;
            this.path([[sx - 14, 285], [sx + 14, 285], [hx + 18, hy], [hx - 18, hy]], '#e4a67b', '#8e593a', 2);
            this.ellipse(hx, hy, 26, 19, '#efbc8b');
            for (let j = 0; j < 4; j++)
                this.box(hx - 23 + j * 12, hy, 10, 25 - j * 2, '#efbc8b', 5);
            this.box(hx - 79, hy - 59, 158, 27, th.slapped ? '#e0efb2' : '#ffe2a1');
            this.text(th.slapped ? '哎哟！不敢啦' : '快拍手！ ' + th.remaining.toFixed(1), hx, hy - 39, 16);
            this.hit('slap', hx - 43, hy - 33, 86, 82);
        }
        const help = p.stage === 'empty' ? '点击左侧面糊开始' : p.stage === 'batter' ? `按住铁板拖动摊开 ${Math.round(p.spread * 100)}%` : p.stage === 'egg' ? '加鸡蛋、葱花和芝麻 → 点铲子翻面' : p.stage === 'flipped' ? `照订单加配料 · 拖动刷酱 ${Math.round(p.sauce * 100)}% → 折叠` : p.stage === 'folded' ? '点击纸袋打包' : '点击目标顾客交餐';
        this.box(285, 663, 970, 44, '#452b22ed', 8);
        this.text(help, 770, 690, 18, '#ffe3ae');
        this.text(g.message, 640, 353, 18, '#fff5d7', 'center', 1050);
        if (g.target && g.started && !g.ended) {
            this.box(404, 365, 472, 55, '#fff4dcf2');
            const order = recipeText(g.target) + (g.target.noCilantro ? ' · ' + t('不要香菜') : '');
            this.wrap(order, 454, 12).forEach((line, i) => this.text(line, 640, 381 + i * 16, 12, '#42281e', 'center', 454));
        }
        if (!g.started || g.ended) {
            this.box(0, 0, 1280, 720, '#261c1ac9', 0);
            this.box(355, 160, 570, 398, '#fff0d8', 22);
            this.text(g.ended ? '今日收摊' : '街角烟火 · 煎饼摊传奇', 640, 218, 32, '#42281e', 'center', 530);
            if (g.ended) {
                this.text(`收入 ¥${g.money}  ·  出餐 ${g.served} 份`, 640, 280, 25);
                this.text(`顾客满意度 ${g.satisfaction} / 100`, 640, 322, 23);
                this.text('营业成绩已保存在本机（浏览器允许时）', 640, 368, 16);
            }
            else {
                ['1  点击面糊，按住铁板拖动摊匀', '2  加鸡蛋 → 铲子翻面 → 按订单加配料', '3  拖动刷酱 → 折叠 → 装袋 → 点顾客', '老板能补满食材；看到偷吃的手，快拍！'].forEach((s, i) => this.text(s, 640, 276 + i * 42, 19, '#42281e', 'center', 530));
            }
            this.box(495, 464, 290, 59, '#aa492d', 12);
            this.text(g.ended ? '再开一天' : '开摊，来一张热乎的', 640, 502, 23, '#fff0cd');
            this.hit('start', 495, 464, 290, 59);
        }
    }
}
