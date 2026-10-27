import { charm, patienceMultiplier } from '../systems/progress.js';
import { t, getLanguage, foodLabel } from '../i18n.js';
import { foods } from '../systems/game.js';
import { stationRect, toolRect, toolIds, nextAction, ingredientStatus, toolEnabled, customerX } from '../ui.js';
export class Scene {
    constructor(canvas) {
        this.canvas = canvas;
        this.background = new Image();
        this.neighbors = new Image();
        this.kitchen = new Image();
        this.hits = [];
        this.clock = 0;
        this.pointer = { x: -100, y: -100 };
        this.dragging = false;
        this.muted = false;
        this.tutorialDone = false;
        this.flipAge = 1;
        this.toast = '';
        this.toastAge = 0;
        this.touchFocus = '';
        this.touchAge = 0;
        this.effects = [];
        this.arrivals = new Map();
        this.departures = [];
        this.previousCustomers = [];
        this.ctx = canvas.getContext('2d');
        this.background.src = './assets/street.png';
        this.neighbors.src = './assets/neighbors-v2.png';
        this.kitchen.src = './assets/kitchen-v2.png';
    }
    box(x, y, w, h, color, r = 12) { const c = this.ctx; c.fillStyle = color; c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); }
    panel(x, y, w, h, color = '#fff3d9', r = 16) { const c = this.ctx; c.save(); c.shadowColor = '#2e170d55'; c.shadowBlur = 16; c.shadowOffsetY = 5; this.box(x, y, w, h, color, r); c.restore(); c.strokeStyle = '#fff9e955'; c.lineWidth = 1; c.beginPath(); c.roundRect(x + .5, y + .5, w - 1, h - 1, r); c.stroke(); }
    text(s, x, y, size = 18, color = '#452e25', align = 'center', maxWidth = 1180, bold = false) { const c = this.ctx; c.font = `${bold || size >= 22 ? '600 ' : ''}${size}px system-ui,-apple-system,sans-serif`; c.fillStyle = color; c.textAlign = align; c.fillText(t(s), x, y, maxWidth); }
    ellipse(x, y, rx, ry, color) { const c = this.ctx; c.fillStyle = color; c.beginPath(); c.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), 0, 0, Math.PI * 2); c.fill(); }
    path(points, fill, stroke = '#704632', width = 2) { const c = this.ctx; c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fillStyle = fill; c.fill(); c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
    hit(id, x, y, w, h) { this.hits.push({ id, x, y, w, h }); }
    hovered(id) { const h = this.hits.find(v => v.id === id); return !!h && this.pointer.x >= h.x && this.pointer.x <= h.x + h.w && this.pointer.y >= h.y && this.pointer.y <= h.y + h.h; }
    sprite(index, x, y, w, h = w) { if (index === 20) {
        const c = this.ctx;
        c.save();
        c.translate(x + w * .5, y + h * .5);
        c.rotate(-.25);
        for (let n = 0; n < 2; n++) {
            this.box(-w * .23 + n * w * .24, -h * .36, w * .23, h * .72, '#c28233', w * .08);
            this.box(-w * .20 + n * w * .24, -h * .34, w * .12, h * .65, '#edb95c', w * .06);
        }
        c.restore();
        return;
    } const im = this.kitchen, c = this.ctx; if (im.complete && im.naturalWidth) {
        const xs = [0, 294, 566, 846, 1122], ys = [0, 279, 538, 793, 1067, 1402], col = index % 4, row = Math.floor(index / 4), sx = im.naturalWidth / 1122, sy = im.naturalHeight / 1402;
        c.drawImage(im, xs[col] * sx, ys[row] * sy, (xs[col + 1] - xs[col]) * sx, (ys[row + 1] - ys[row]) * sy, x, y, w, h);
    }
    else {
        this.ellipse(x + w / 2, y + h / 2, w * .3, h * .28, foods[index]?.[2] || '#dcb569');
    } }
    foodArt(id, x, y, w, h) {
        const c = this.ctx;
        c.save();
        c.translate(x, y);
        c.scale(w / 100, h / 70);
        if (id === 'youtiao') {
            const grad = c.createLinearGradient(0, 0, 0, 70);
            grad.addColorStop(0, '#ffe29a');
            grad.addColorStop(.5, '#d9922f');
            grad.addColorStop(1, '#9d581f');
            for (let j = 0; j < 2; j++) {
                this.box(3, 15 + j * 21, 94, 25, grad, 12);
                for (let k = 0; k < 18; k++)
                    this.ellipse(9 + k * 17 % 81, 20 + j * 21 + k * 7 % 13, 3 + k % 3, 2, '#f6cb7c99');
            }
            c.strokeStyle = '#a36b2b';
            c.lineWidth = 2;
            c.beginPath();
            c.moveTo(13, 38);
            c.lineTo(89, 38);
            c.stroke();
        }
        else if (id === 'crisp') {
            this.path([[5, 18], [76, 3], [96, 18], [83, 61], [18, 66], [3, 48]], '#e8b457', '#a1692b', 2);
            this.path([[14, 23], [77, 10], [87, 20], [74, 53], [21, 57]], '#f5ce78', '#c08b3d', 1);
            for (let n = 0; n < 30; n++) {
                const px = 17 + n * 19 % 59, py = 19 + n * 13 % 31;
                this.ellipse(px, py, 2 + n % 3, 1 + n % 2, n % 2 ? '#ffe3a0' : '#c18a37');
            }
        }
        else if (id === 'scallion') {
            for (let n = 0; n < 24; n++) {
                const px = 9 + n * 23 % 82, py = 9 + n * 17 % 50;
                this.ellipse(px, py, 5, 4, '#79ac51');
                this.ellipse(px, py, 2.8, 2.2, '#d9e9a1');
            }
        }
        else if (id === 'cilantro' || id === 'lettuce') {
            for (let n = 0; n < (id === 'cilantro' ? 9 : 5); n++) {
                const px = 17 + n * 29 % 65, py = 12 + n * 13 % 40;
                c.strokeStyle = '#467739';
                c.lineWidth = 2;
                c.beginPath();
                c.moveTo(px, py + 16);
                c.lineTo(px + 6, py);
                c.stroke();
                for (let j = 0; j < 3; j++)
                    this.ellipse(px + j * 5 - 3, py + j * 3, id === 'lettuce' ? 17 : 7, id === 'lettuce' ? 9 : 5, j % 2 ? '#619843' : '#83b35a');
            }
        }
        else if (id === 'egg') {
            this.ellipse(52, 37, 22, 29, '#b49364');
            this.ellipse(50, 33, 21, 28, '#f5dfb8');
            this.ellipse(44, 22, 4, 9, '#fff2d5');
        }
        else if (id === 'batter') {
            this.box(21, 7, 52, 54, '#e2e8dc', 8);
            this.ellipse(47, 12, 25, 9, '#f2d395');
            this.path([[69, 15], [94, 11], [72, 36]], '#d7ded1', '#8a9d91');
            c.strokeStyle = '#dce4d7';
            c.lineWidth = 8;
            c.beginPath();
            c.ellipse(20, 32, 15, 18, 0, 1, 5);
            c.stroke();
        }
        else if (id === 'sweet' || id === 'chili') {
            this.ellipse(50, 35, 43, 24, id === 'sweet' ? '#6f3826' : '#c04229');
            for (let n = 0; n < 10; n++)
                this.ellipse(17 + n * 23 % 66, 23 + n * 11 % 25, 2, 1, id === 'sweet' ? '#a56b42' : '#f2c17c');
        }
        else if (id === 'sesame') {
            for (let n = 0; n < 50; n++)
                this.ellipse(7 + n * 31 % 86, 8 + n * 17 % 53, 2, 1, '#e5c888');
        }
        else if (id === 'ham') {
            for (let n = 0; n < 4; n++) {
                this.box(12 + n * 17, 15 + n * 4, 26, 36, '#bd6560', 7);
                this.box(14 + n * 17, 17 + n * 4, 22, 30, '#eea38c', 5);
            }
        }
        else if (id === 'sausage') {
            for (let n = 0; n < 3; n++) {
                this.box(8 + n * 28, 10 + n * 4, 24, 47, '#93412a', 11);
                c.strokeStyle = '#e2a06b';
                c.lineWidth = 2;
                for (let j = 0; j < 3; j++) {
                    c.beginPath();
                    c.moveTo(13 + n * 28, 20 + j * 11 + n * 4);
                    c.lineTo(26 + n * 28, 25 + j * 11 + n * 4);
                    c.stroke();
                }
            }
        }
        else {
            for (let n = 0; n < 5; n++)
                this.box(6 + n * 17, 10 + n % 2 * 12, 19, 44, id === 'chicken' ? '#dba23e' : '#b77749', 7);
        }
        c.restore();
    }
    person(look, x, y, w = 182, h = 208) { const im = this.neighbors, c = this.ctx; if (im.complete && im.naturalWidth) {
        const cw = im.naturalWidth / 2, ch = im.naturalHeight / 2;
        c.drawImage(im, look % 2 * cw, Math.floor(look / 2) * ch, cw, ch, x - w / 2, y, w, h);
    }
    else {
        this.ellipse(x, y + h * .25, w * .18, h * .2, '#e7b580');
        this.box(x - w * .27, y + h * .4, w * .54, h * .6, ['#68846a', '#ca8864', '#42756f', '#ca693c'][look]);
    } }
    focusRing(r, color = '#ffe29a') { const c = this.ctx; c.save(); c.shadowColor = color; c.shadowBlur = 10; c.strokeStyle = color; c.lineWidth = 2.2; c.beginPath(); c.roundRect(r.x - 3, r.y - 3, r.w + 6, r.h + 6, 12); c.stroke(); c.restore(); }
    notify(message, id = '', g) { this.toast = message; this.toastAge = 3; this.touchFocus = id; this.touchAge = 1.5; if (id === 'flip')
        this.flipAge = 0; if (id.startsWith('food:')) {
        const index = foods.findIndex(f => f[0] === id.slice(5)), r = stationRect(index);
        this.effects.push({ kind: 'food', age: 0, life: .44, x: r.x + 44, y: r.y + 32, tx: 630 + Math.sin(this.clock) * 62, ty: 497, index: index === 13 ? 20 : index });
    } if (id === 'serve' && g) {
        for (let n = 0; n < 5; n++)
            this.effects.push({ kind: 'coin', age: -n * .07, life: .9, x: 640 + n * 13, y: 295, tx: 654, ty: 49, index: 19 });
        this.effects.push({ kind: 'text', age: 0, life: 1.3, x: 640, y: 440, tx: 640, ty: 412, index: 0, label: message, color: '#fce4a6' });
    } }
    draw(g, dt) {
        const c = this.ctx;
        this.clock += dt;
        this.hits = [];
        this.flipAge += dt;
        this.toastAge = Math.max(0, this.toastAge - dt);
        this.touchAge = Math.max(0, this.touchAge - dt);
        c.clearRect(0, 0, 1280, 720);
        if (this.background.complete && this.background.naturalWidth)
            c.drawImage(this.background, 0, 0, 1280, 720);
        else
            this.box(0, 0, 1280, 720, '#8e724a', 0);
        const shade = c.createLinearGradient(0, 0, 0, 400);
        shade.addColorStop(0, '#35251b55');
        shade.addColorStop(1, '#6c432000');
        c.fillStyle = shade;
        c.fillRect(0, 0, 1280, 400);
        this.panel(20, 17, 310, 65, '#452d24ed', 15);
        this.text('煎饼摊传奇', 42, 49, 25, '#ffe4b2', 'left', 268);
        this.text((getLanguage() === 'zh' ? `第 ${g.profile.days} 天 · ` : `DAY ${g.profile.days} · `) + (g.profile.mode === 'tianjin' ? t('纯血天津人模式') : t(g.profile.shop ? '街角小店' : '街角煎饼摊')), 43, 69, 11, '#c7b197', 'left', 260);
        this.drawDecor(g);
        const stats = [['今日收入', '¥ ' + g.money, 567], ['剩余时间', `${Math.floor(Math.ceil(g.time) / 60)}:${String(Math.ceil(g.time) % 60).padStart(2, '0')}`, 716], ['顾客满意', String(g.satisfaction) + '%', 865]];
        for (const [label, value, x] of stats) {
            this.panel(x, 19, 136, 60, '#fff2dceF', 13);
            this.text(label, x + 16, 40, 11, '#8c6a4c', 'left', 106);
            this.text(value, x + 16, 66, 23, g.time < 30 && label === '剩余时间' ? '#b34e3a' : '#553529', 'left', 106);
        }
        const customers = g.started ? g.customers : ([{ id: -1, look: 0, patience: 100, max: 100 }, { id: -2, look: 1, patience: 100, max: 100 }, { id: -3, look: 2, patience: 100, max: 100 }]);
        for (const old of this.previousCustomers)
            if (!customers.some(v => v.id === old.id))
                this.departures.push({ look: old.look, x: old.x, age: 0 });
        const action = nextAction(g);
        customers.forEach((v, i) => {
            const x = customerX(i, g.profile.shop);
            let age = this.arrivals.get(v.id) ?? 0;
            age += dt;
            this.arrivals.set(v.id, age);
            const enter = Math.min(1, age / .4);
            c.save();
            c.globalAlpha = enter;
            const selected = v.id === g.target?.id;
            if (selected && g.started) {
                this.ellipse(x, 305, 88, 19, '#ffe0a060');
                this.panel(x - 61, 104, 122, 27, '#c25e38', 9);
                this.text('正在制作', x, 123, 12, '#fff5d6');
            }
            else {
                this.panel(x - 55, 104, 110, 27, '#fff1d7e8', 9);
                this.text(['学生', '上班族', '老街坊'][v.look], x, 123, 12, '#74513c');
            }
            this.person(v.look, x, 135 + (1 - enter) * 24 + Math.sin(this.clock * 1.6 + i) * 1.5, g.profile.shop ? 134 : 174, 191);
            if (g.started) {
                this.box(x - 53, 320, 106, 5, '#503c2b80', 3);
                this.box(x - 53, 320, 106 * Math.max(0, v.patience / v.max), 5, v.patience < 30 ? '#c6563f' : '#8ea968', 3);
                if (v.patience < 25)
                    this.text('!', x + 66, 171, 24, '#fff1cc');
                if ('recipe' in v) {
                    const entries = Object.entries(v.recipe).filter(([id]) => id !== 'batter').slice(0, 3);
                    this.panel(x - 59, 269, 118, 35, '#fff1d8eb', 8);
                    entries.forEach(([id, n], k) => { this.foodArt(id, x - 53 + k * 37, 271, 25, 22); this.text(String(n), x - 25 + k * 37, 297, 9, '#65462e'); });
                }
                this.hit('customer:' + v.id, x - (g.profile.shop ? 66 : 84), 102, g.profile.shop ? 132 : 168, 224);
                if (selected && g.cooking.stage === 'bagged')
                    this.focusRing({ x: x - 84, y: 134, w: 168, h: 184 });
            }
            c.restore();
        });
        this.previousCustomers = customers.map((v, i) => ({ id: v.id, look: v.look, x: customerX(i, g.profile.shop) }));
        this.departures = this.departures.filter(d => (d.age += dt) < .4);
        for (const d of this.departures) {
            c.save();
            c.globalAlpha = 1 - d.age / .4;
            this.person(d.look, d.x + d.age * 90, 135, 174, 191);
            c.restore();
        }
        const refill = g.inventory.refill, bossX = 1157 - (refill ? Math.sin((5 - refill) / 5 * Math.PI) * 60 : 0);
        this.person(3, bossX, 179, 166, 156);
        this.hit('boss', 1068, 177, 184, 186);
        this.panel(1075, 330, 177, 30, '#4b4934ed', 9);
        this.text(refill ? `补货中 ${refill.toFixed(1)}s` : '老板，补个货！', 1163, 350, 13, '#ffefcd', 'center', 159);
        // Stainless steel worktops and round ingredient pails, inspired by the reference photo.
        for (const x of [16, 952]) {
            const metal = c.createLinearGradient(x, 408, x + 312, 670);
            metal.addColorStop(0, '#e0e6df');
            metal.addColorStop(.25, '#8e9a94');
            metal.addColorStop(.6, '#c1cbc4');
            metal.addColorStop(1, '#64736f');
            this.panel(x, 408, 312, 264, metal, 9);
            for (let j = 0; j < 9; j++) {
                c.strokeStyle = '#edf7ef22';
                c.beginPath();
                c.moveTo(x + 12, 430 + j * 26);
                c.lineTo(x + 300, 426 + j * 26);
                c.stroke();
            }
        }
        this.ellipse(640, 544, 257, 105, '#2d201bbb');
        this.ellipse(640, 528, 248, 108, '#422c25');
        this.ellipse(640, 516, 248, 110, '#a6aaa0');
        this.ellipse(640, 512, 239, 104, '#646e65');
        const pan = c.createRadialGradient(600, 469, 20, 640, 505, 235);
        pan.addColorStop(0, '#414d45');
        pan.addColorStop(1, '#202e2a');
        c.fillStyle = pan;
        c.beginPath();
        c.ellipse(640, 505, 231, 100, 0, 0, 7);
        c.fill();
        c.strokeStyle = '#8b93825c';
        c.lineWidth = 2;
        c.stroke();
        this.ellipse(640, 627, 166, 5, '#ffa34d22');
        for (let i = 0; i < foods.length; i++) {
            const [id] = foods[i];
            if (!g.availableFoods.some(f => f[0] === id))
                continue;
            const r = stationRect(i), count = g.inventory.stock[id], need = action.focus.includes('food:' + id);
            this.hit('food:' + id, r.x, r.y, r.w, r.h);
            const hover = this.hovered('food:' + id);
            if (need && g.started && !g.ended)
                this.focusRing(r, `rgba(255,220,144,${.45 + Math.sin(this.clock * 3) * .18})`);
            if (hover)
                this.focusRing(r, '#fff1c5');
            const bucket = ['scallion', 'cilantro', 'sweet', 'chili'].includes(id);
            const steel = c.createLinearGradient(r.x, 0, r.x + r.w, 0);
            steel.addColorStop(0, '#64736e');
            steel.addColorStop(.3, '#f0f2e5');
            steel.addColorStop(.6, '#99aaa1');
            steel.addColorStop(1, '#566964');
            if (bucket) {
                this.box(r.x + 5, r.y + 17, 78, 38, steel, 10);
                this.ellipse(r.x + 44, r.y + 51, 39, 10, steel);
                this.ellipse(r.x + 44, r.y + 18, 43, 19, '#e2e9df');
                this.ellipse(r.x + 44, r.y + 18, 38, 15, '#35493e');
                c.save();
                c.beginPath();
                c.ellipse(r.x + 44, r.y + 18, 37, 14, 0, 0, 7);
                c.clip();
                if (count)
                    this.foodArt(id, r.x + 7, r.y + 1, 74, 34);
                c.restore();
            }
            else {
                this.box(r.x + 1, r.y + 2, 86, 54, id === 'egg' ? '#86745c' : '#d0d7cd', 8);
                this.box(r.x + 5, r.y + 6, 78, 43, id === 'egg' ? '#b5a386' : '#6f8175', 5);
                if (count)
                    this.foodArt(id, r.x + 5, r.y - 2, 78, 55);
            }
            this.box(r.x + 1, r.y + 55, 86, 18, '#fff0d0', 4);
            this.text(foodLabel(id, true), r.x + 35, r.y + 68, 10, '#62452d', 'center', 66);
            this.box(r.x + 70, r.y + 55, 18, 18, count < 3 ? '#ad4b35' : '#344a44', 4);
            this.text(String(count), r.x + 79, r.y + 68, 10, '#fff4d6');
            if (need && g.started)
                this.ellipse(r.x + 10, r.y + 11, 3, 3, '#ffe7a0');
        }
        // Actual pancake layers stay on the griddle; use generated food sprites for toppings.
        const p = g.cooking;
        if (p.stage !== 'empty') {
            c.save();
            let flip = this.flipAge < .46 ? Math.sin(this.flipAge / .46 * Math.PI) : 0;
            c.translate(640, 505 - flip * 44);
            c.scale(1, Math.max(.08, Math.abs(Math.cos(Math.min(1, this.flipAge / .46) * Math.PI))));
            c.translate(-640, -505);
            if (p.stage === 'bagged') {
                const bag = Math.min(1, p.foldTime / .65);
                this.box(603, 419 + bag * 37, 74, 65, '#e8b95f', 9);
                this.ellipse(640, 543, 77, 13, '#0003');
                this.box(588, 454, 104, 103, '#b4834e', 7);
                this.box(595, 460, 90, 90, '#e8c58b', 4);
                this.path([[595, 460], [607, 444], [675, 444], [685, 460]], '#f2d7a0', '#a77a48');
                this.text('热', 640, 513, 24, '#99653c');
                this.text('JIANBING', 640, 536, 10, '#99653c');
            }
            else if (p.stage === 'folded') {
                const f = Math.min(1, p.foldTime / .65), leftFold = Math.min(1, f / .33), rightFold = Math.max(0, Math.min(1, (f - .33) / .33)), width = 410 - 114 * leftFold - 114 * rightFold, height = 180 - 96 * Math.max(0, Math.min(1, (f - .6) / .4)), l = 640 - width / 2, r = 640 + width / 2, top = 505 - height / 2, bottom = 505 + height / 2;
                this.ellipse(640, 535, width * .48, 14, '#0003');
                if (f < .72) {
                    this.ellipse(640, 505, width / 2, height / 2, '#e6b968');
                    this.path([[l, 499], [l + width * .35 * leftFold, top + 7], [l + width * .35 * leftFold, bottom - 7], [l, 519]], '#f2d18a', '#bd8e47');
                    this.path([[r, 499], [r - width * .35 * rightFold, top + 7], [r - width * .35 * rightFold, bottom - 7], [r, 519]], '#e5b461', '#bd8e47');
                }
                else {
                    this.box(l, top + 5, width, height, '#b77a35', 12);
                    const crust = c.createLinearGradient(0, top, 0, bottom);
                    crust.addColorStop(0, '#f4d38b');
                    crust.addColorStop(.6, '#e8b95f');
                    crust.addColorStop(1, '#c69042');
                    this.box(l, top, width, height, crust, 12);
                    this.path([[l + 3, top + 16], [640, top + 43], [r - 3, top + 16], [r - 3, top + 27], [640, top + 49], [l + 3, top + 27]], '#c69249', '#c69249', 1);
                    for (let n = 0; n < 22; n++)
                        this.ellipse(l + 12 + (n * 31 % (width - 24)), top + 9 + (n * 17 % (height - 18)), 1 + n % 3, 1, '#aa703966');
                    c.strokeStyle = '#f8df9e';
                    c.lineWidth = 2;
                    c.beginPath();
                    c.moveTo(l + 9, bottom - 10);
                    c.lineTo(r - 9, bottom - 10);
                    c.stroke();
                }
            }
            else {
                const rx = p.stage === 'batter' ? 58 + 147 * p.spread : 205;
                this.ellipse(640, 505, rx, rx * .445, '#b77f3b');
                this.ellipse(640, 502, rx - 3, rx * .435, '#edca7c');
                for (let n = 0; n < 90; n++) {
                    const x = Math.sin(n * 13.3) * rx * .94, y = Math.cos(n * 7.1) * rx * .4;
                    if (x * x / (rx * rx) + y * y / (rx * rx * .2) < .9)
                        this.ellipse(640 + x, 502 + y, 1 + n % 3, 1, '#b4773e44');
                }
                if (p.stage === 'egg' && p.ingredients.egg) {
                    const spread = p.eggSpread;
                    this.ellipse(640, 502, 75 + spread * 124, 32 + spread * 54, '#ffd251bb');
                    for (let n = 0; n < (p.ingredients.egg || 0); n++) {
                        const x = 585 + (n % 3) * 55, y = 487 + Math.floor(n / 3) * 29;
                        this.ellipse(x, y, 25 * (1 - spread), 13 * (1 - spread), '#fff0b8');
                        this.ellipse(x, y, 11 * (1 - spread), 7 * (1 - spread), '#ffb62e');
                    }
                }
                // Bounded sauce strokes avoid an unbounded draw loop during long gestures.
                c.save();
                c.beginPath();
                c.ellipse(640, 502, 199, 85, 0, 0, 7);
                c.clip();
                c.strokeStyle = p.ingredients.chili ? '#a43e2390' : '#73402090';
                c.lineWidth = 27;
                c.lineCap = 'round';
                c.lineJoin = 'round';
                c.beginPath();
                p.strokes.forEach((v, i) => { if (!i || v.move)
                    c.moveTo(v.x, v.y);
                else
                    c.lineTo(v.x, v.y); });
                c.stroke();
                c.restore();
                foods.filter(([id]) => !['batter', 'egg', 'sweet', 'chili'].includes(id) && (p.ingredients[id] || 0) - (p.stage === 'flipped' ? (p.underside[id] || 0) : 0) > 0).forEach(([id], j) => { const index = id === 'youtiao' ? 20 : foods.findIndex(f => f[0] === id); for (let n = 0; n < Math.min(5, (p.ingredients[id] || 0) - (p.stage === 'flipped' ? (p.underside[id] || 0) : 0)); n++)
                    this.foodArt(id, 530 + (n % 3) * 76 + Math.sin(j * 3) * 14, 462 + Math.floor(n / 3) * 40 + Math.cos(j * 4) * 12, 72, 44); });
            }
            c.restore();
            if (p.stage !== 'bagged')
                for (let n = 0; n < 4; n++) {
                    const f = (this.clock * .35 + n * .25) % 1;
                    c.save();
                    c.globalAlpha = (1 - f) * .22;
                    c.strokeStyle = '#fff7df';
                    c.lineWidth = 3;
                    c.beginPath();
                    c.moveTo(555 + n * 56, 446 - f * 45);
                    c.bezierCurveTo(530 + n * 56, 427 - f * 45, 578 + n * 56, 416 - f * 45, 555 + n * 56, 395 - f * 45);
                    c.stroke();
                    c.restore();
                }
        }
        // Tools sit in a single physical rail and reveal names on hover/touch.
        this.panel(349, 614, 582, 66, '#563c2bea', 14);
        toolIds.forEach((id, i) => { const r = toolRect(i), enabled = toolEnabled(g, id); this.hit(id, r.x, r.y, r.w, r.h); const hover = this.hovered(id); this.ellipse(r.x + 52, r.y + 49, 31, 4, '#25180f66'); c.save(); c.globalAlpha = (enabled || !g.started) ? .98 : .47; this.sprite([13, 14, 15, 16, 17][i], r.x + 20, r.y - 2, 65, 58); c.restore(); if (hover)
            this.focusRing(r); if (action.focus.includes(id) && g.started && !g.ended)
            this.focusRing(r, '#e9c780'); });
        // The selected recipe is a single icon checklist, with the no-cilantro exception explicit.
        if (g.target && g.started && !g.ended) {
            this.panel(353, 335, 574, 70, '#fff4dbf8', 13);
            this.text('当前订单', 370, 354, 11, '#94714b', 'left', 130);
            if (g.target.noCilantro) {
                this.box(815, 342, 96, 17, '#f0ddd0', 5);
                this.text('不要香菜', 863, 355, 10, '#a44b36', 'center', 89);
            }
            const items = foods.filter(([id]) => id !== 'batter' && (g.target.recipe[id] || p.ingredients[id]));
            const cell = Math.min(46, 535 / Math.max(1, items.length));
            items.forEach(([id], i) => { const x = 374 + i * cell, status = ingredientStatus(g, id), index = id === 'youtiao' ? 20 : foods.findIndex(f => f[0] === id); this.hit('order:' + id, x - 4, 359, cell, 39); this.box(x - 1, 361, cell - 5, 35, status === 'done' ? '#e5ebd2' : status === 'extra' ? '#f5d4c6' : '#efe4c9', 8); this.foodArt(id, x + 2, 359, 30, 25); this.text(`${p.ingredients[id] || 0}/${g.target.recipe[id] || 0}`, x + 18, 393, 10, status === 'extra' ? '#b14e33' : '#3f7446'); });
        }
        // Bent sleeve + wrist + rotated fingers; a slapped arm retracts along the same route.
        if (g.theft) {
            const th = g.theft, ci = g.customers.findIndex(v => v.id === th.customer), sx = customerX(Math.max(0, ci), g.profile.shop), fi = foods.findIndex(v => v[0] === th.food), r = stationRect(fi);
            const travel = th.slapped ? Math.max(0, th.remaining / .65) * (th.reach ?? 1) : Math.min(1, (3 - th.remaining) / 1.1), e = travel * travel * (3 - 2 * travel);
            const hx = sx + (r.x + 44 - sx) * e, hy = 288 + (r.y + 26 - 288) * e;
            c.save();
            c.lineCap = 'round';
            c.lineJoin = 'round';
            c.beginPath();
            c.moveTo(sx, 266);
            c.quadraticCurveTo(sx + (hx - sx) * .25, hy - 35, hx, hy);
            c.strokeStyle = '#47372d';
            c.lineWidth = 29;
            c.stroke();
            c.strokeStyle = ['#66887c', '#c4815d', '#497873'][Math.max(0, ci) % 3];
            c.lineWidth = 23;
            c.stroke();
            c.translate(hx, hy);
            c.rotate(Math.atan2(hy - 288, hx - sx) - Math.PI / 2);
            this.box(-13, -20, 26, 30, '#efc399', 9);
            for (let j = 0; j < 4; j++)
                this.box(-14 + j * 8, -1, 7, 22 - Math.abs(j - 1) * 4, '#efc399', 4);
            this.box(-20, -10, 8, 19, '#e0a879', 4);
            c.restore();
            if (th.slapped) {
                c.strokeStyle = '#fff1be';
                c.lineWidth = 3;
                for (let j = 0; j < 5; j++) {
                    const a = j * 1.25;
                    c.beginPath();
                    c.moveTo(hx + Math.cos(a) * 29, hy + Math.sin(a) * 29);
                    c.lineTo(hx + Math.cos(a) * 39, hy + Math.sin(a) * 39);
                    c.stroke();
                }
            }
            this.panel(hx - 62, hy - 56, 124, 23, th.slapped ? '#e2ebc4' : '#ffe3ab', 7);
            this.text(th.slapped ? '哎哟！不敢啦' : '快拍手！ ' + th.remaining.toFixed(1), hx, hy - 40, 11, '#663b27', 'center', 114);
            this.hit('slap', hx - 43, hy - 30, 86, 78);
        }
        if (this.dragging && ['batter', 'egg', 'flipped'].includes(p.stage)) {
            c.save();
            c.translate(this.pointer.x, this.pointer.y);
            c.rotate(-.25);
            this.sprite(p.stage === 'flipped' ? 18 : 13, -14, -62, 84, 84);
            c.restore();
        }
        this.effects = this.effects.filter(f => (f.age += dt) < f.life);
        for (const f of this.effects) {
            if (f.age < 0)
                continue;
            const u = Math.min(1, f.age / f.life), ease = 1 - (1 - u) ** 2, x = f.x + (f.tx - f.x) * ease, y = f.y + (f.ty - f.y) * ease - Math.sin(u * Math.PI) * (f.kind === 'coin' ? 70 : 44);
            c.save();
            c.globalAlpha = f.kind === 'text' ? 1 - u : 1;
            if (f.kind === 'text')
                this.text(f.label || '', x, y, 17, f.color || '#fff');
            else if (f.kind === 'food')
                this.foodArt(f.index === 20 ? 'youtiao' : foods[f.index][0], x - 25, y - 18, 50, 36);
            else
                this.sprite(f.index, x - 20, y - 20, 40, 40);
            c.restore();
        }
        this.panel(351, 686, 578, 29, '#3c3028ef', 10);
        this.ellipse(370, 700, 8, 8, '#c38345');
        this.text(String(action.step), 370, 704, 10, '#fff4d9');
        this.text(this.tutorialDone ? action.key : action.detail, 389, 705, 12, '#ffedce', 'left', 522);
        if (action.progress > 0 && action.progress < 1)
            this.box(389, 711, 510 * action.progress, 2, '#e6bd78', 1);
        this.text(`出餐 ${g.served}  ·  离开 ${g.lost}`, 29, 699, 12, '#ffedcc', 'left', 280);
        this.text('手作热煎饼 · 现做现吃', 1248, 699, 11, '#ffedcc', 'right', 280);
        if (this.toastAge > 0 && this.toast) {
            this.panel(376, 409, 528, 29, '#463c30f0', 10);
            this.text(this.toast, 640, 428, 12, '#fff0d6', 'center', 504);
        }
        const hoverHit = [...this.hits].reverse().find(h => this.pointer.x >= h.x && this.pointer.x < h.x + h.w && this.pointer.y >= h.y && this.pointer.y < h.y + h.h);
        const tip = hoverHit?.id || (this.touchAge ? this.touchFocus : '');
        if (tip && (tip.startsWith('food:') || tip.startsWith('order:') || toolIds.includes(tip))) {
            const h = this.hits.find(v => v.id === tip) || { x: 550, y: 620, w: 180, h: 30 };
            const label = tip.includes(':') ? foodLabel(tip.split(':')[1], g.profile.mode === 'tianjin') : ['刮板', '铲子 · 翻面', '折叠', '纸袋', '丢弃'][toolIds.indexOf(tip)];
            const x = Math.min(1178, Math.max(102, h.x + h.w / 2));
            this.panel(x - 84, h.y - 32, 168, 25, '#332d25f5', 8);
            this.text(label, x, h.y - 15, 12, '#fff0cf', 'center', 154);
            if (tip.startsWith('food:')) {
                this.panel(x - 58, h.y - 114, 116, 78, '#fff1dbeF', 10);
                this.foodArt(tip.split(':')[1], x - 44, h.y - 111, 88, 51);
                this.text('点击加一份', x, h.y - 44, 10, '#72503b');
            }
        }
        if (g.tutorial && g.started && !g.paused && !g.ended) {
            this.panel(20, 110, 305, 230, '#fff5dfef', 16);
            this.text('实操新手教程', 40, 143, 21, '#6a432b', 'left', 265);
            this.text(`${action.step} / 12`, 40, 173, 14, '#b15a35', 'left', 265);
            this.text(action.key, 40, 207, 20, '#b15a35', 'left', 265);
            this.text(action.detail, 40, 239, 12, '#785c44', 'left', 265);
            this.text('练习不限时，可丢弃重来', 40, 275, 12, '#785c44', 'left', 265);
            this.text('跳过教程', 170, 312, 14, '#9f512f');
            this.hit('skip', 40, 288, 265, 40);
            const focus = action.focus[0], h = focus === 'scrape' ? { x: 575, y: 460, w: 130, h: 60 } : this.hits.find(v => v.id === focus);
            if (h) {
                const x = h.x + h.w / 2, y = h.y - 12 - Math.sin(this.clock * 4) * 4;
                this.path([[x - 10, y - 15], [x + 10, y - 15], [x, y]], '#fff1b5', '#a8662f');
                this.focusRing(h);
            }
        }
        if (!g.started || g.ended || g.paused)
            this.overlay(g);
    }
    drawDecor(g) { const p = g.profile, c = this.ctx; const owned = (id) => p.equipped.includes(id); if (p.shop) {
        this.box(333, 86, 609, 13, '#815233', 3);
        for (const x of [333, 930])
            this.box(x, 90, 12, 240, '#815233', 2);
        this.panel(488, 85, 290, 25, '#795134', 5);
        this.text('街角小店', 633, 104, 13, '#ffebc4');
    } if (owned('awning')) {
        for (let i = 0; i < 11; i++)
            this.box(334 + i * 56, 83, 56, 20, i % 2 ? '#e9cf92' : '#a95c41', 6);
    } if (owned('sign')) {
        this.panel(26, 336, 215, 53, '#745235', 6);
        this.text('手作热煎饼', 133, 369, 19, '#ffe8b5');
    } if (owned('plant'))
        for (const x of [50, 290]) {
            this.box(x - 13, 375, 26, 29, '#aa6843', 4);
            for (let j = 0; j < 5; j++)
                this.ellipse(x + Math.sin(j * 2) * 13, 367 - Math.abs(Math.cos(j)) * 18, 8, 15, '#698e4c');
        } if (owned('spring'))
        for (const x of [353, 918]) {
            this.box(x - 1, 107, 2, 25, '#e2b56c');
            this.ellipse(x, 151, 19, 25, '#b94836');
            this.box(x - 6, 173, 12, 5, '#e7b45e');
            this.box(x - 1, 178, 2, 18, '#e7b45e');
        } if (owned('dragon'))
        for (const x of [355, 916])
            this.path([[x, 119], [x - 22, 160], [x + 22, 160]], '#52774b', '#d5ba6b', 3); if (owned('autumn')) {
        this.ellipse(913, 150, 27, 27, '#fff0af');
        this.ellipse(907, 149, 8, 12, '#d1a75a');
        this.ellipse(902, 135, 3, 9, '#d1a75a');
        this.ellipse(910, 135, 3, 9, '#d1a75a');
    } if (owned('spring-reward')) {
        c.save();
        c.translate(284, 362);
        c.rotate(.785);
        this.box(-19, -19, 38, 38, '#bb4d36', 2);
        c.restore();
        this.text('福', 284, 369, 21, '#f8d67e');
    } if (owned('dragon-reward'))
        for (let j = 0; j < 5; j++)
            this.box(354 + j * 6, 180, 4, 55, ['#d16045', '#c7b951', '#53875e', '#618b9c', '#99647a'][j], 2); if (owned('autumn-reward'))
        for (let j = 0; j < 5; j++)
            this.text('✦', 380 + j * 115, 90, 18, '#ffe5a4'); this.text((getLanguage() === 'zh' ? `钱包 ¥${p.wallet} · 魅力 ${charm(p)} · 等待 +` : `Wallet ¥${p.wallet} · Charm ${charm(p)} · Wait +`) + Math.round((patienceMultiplier(p) - 1) * 100) + '%', 25, 96, 11, '#ffebc4', 'left', 300); }
    overlay(g) {
        const c = this.ctx;
        this.box(0, 0, 1280, 720, '#291e18a6', 0);
        this.panel(282, 146, 716, 431, '#fff1d6', 24);
        this.box(298, 161, 684, 399, '#fff8e9', 18);
        this.text(g.paused ? '休息一下' : g.ended ? (g.tutorial ? '教程完成' : '今日收摊') : '街角烟火', 326, 204, 12, '#a16f47', 'left', 580);
        this.text(g.paused ? '炉火等你回来' : g.ended ? (g.tutorial ? '完成练习，准备正式开摊！' : '辛苦啦，老板！') : '煎饼摊传奇', 326, 250, 36, '#553328', 'left', 610);
        if (g.ended) {
            const stats = [['今日收入', '¥ ' + g.money], ['完成订单', String(g.served)], ['顾客满意', g.satisfaction + '%']];
            stats.forEach(([label, value], i) => { this.box(326 + i * 207, 280, 192, 89, '#f0e4cd', 12); this.text(label, 343 + i * 207, 307, 12, '#927154', 'left', 158); this.text(value, 343 + i * 207, 346, 30, '#80513a', 'left', 156); });
            this.text(g.tutorial ? '练习不计收入，也不消耗顾客耐心' : '营业成绩已保存在本机（浏览器允许时）', 326, 411, 12, '#95795c', 'left', 620);
        }
        else if (g.paused) {
            this.text('时间、顾客耐心和补货都已暂停', 326, 298, 17, '#977154', 'left', 610);
            this.sprite(15, 747, 295, 135, 114);
        }
        else {
            this.text('一张热煎饼，留住街坊的好胃口。', 326, 282, 16, '#957052', 'left', 610);
            const steps = ['摊饼', '配料', '打包'];
            steps.forEach((s, i) => { this.ellipse(341 + i * 120, 329, 13, 13, '#ead4ad'); this.text(String(i + 1), 341 + i * 120, 334, 12, '#94643e'); this.text(s, 363 + i * 120, 334, 14, '#72503c', 'left', 84); });
            this.text('点击实物 · 拖动制作 · 按订单交餐', 326, 381, 13, '#a48360', 'left', 390);
            this.sprite(15, 766, 306, 155, 135);
            this.sprite(19, 874, 408, 36, 36);
        }
        const primary = g.paused ? '继续营业' : g.ended ? (g.tutorial ? '进入正式营业' : '再开一天') : '开始营业';
        this.panel(326, 456, 628, 65, '#b85e39', 15);
        this.text(primary, 640, 497, 23, '#fff4d9');
        this.hit(g.paused ? 'resume' : 'start', 326, 456, 628, 65);
        this.text('三分钟一局 · 中英双语 · 无需下载', 640, 548, 12, '#a28565', 'center', 630);
    }
}
