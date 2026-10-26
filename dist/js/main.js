import { getLanguage, setLanguage, t } from './i18n.js';
import { Game, Cooking } from './systems/game.js';
import { Sound } from './systems/audio.js';
import { Scene } from './render/scene.js';
import { insideGriddle } from './ui.js';
const canvas = document.querySelector('#game');
const languageButton = document.querySelector('#language');
const pauseButton = document.querySelector('#pause');
const soundButton = document.querySelector('#sound');
const orientation = document.querySelector('#orientation');
const help = document.querySelector('#accessible');
const titleKey = document.title, ariaKey = canvas.getAttribute('aria-label'), helpKey = help.textContent;
const scene = new Scene(canvas), sound = new Sound();
let game = new Game(), dragging = false, last = { x: 0, y: 0 }, saved = false;
try {
    if (localStorage.getItem('jianbing-legend:language') === 'en')
        setLanguage('en');
    scene.tutorialDone = localStorage.getItem('jianbing-legend:tutorial') === 'done';
    sound.muted = localStorage.getItem('jianbing-legend:muted') === 'true';
}
catch { }
function toolbar() { document.documentElement.lang = getLanguage() === 'en' ? 'en' : 'zh-CN'; document.title = t(titleKey); canvas.setAttribute('aria-label', t(ariaKey)); help.textContent = t(helpKey); languageButton.textContent = getLanguage() === 'zh' ? 'EN / 中文' : '中文 / EN'; languageButton.setAttribute('aria-label', getLanguage() === 'zh' ? 'Switch to English' : '切换为中文'); pauseButton.textContent = game.paused ? '▶' : 'Ⅱ'; pauseButton.setAttribute('aria-label', t(game.paused ? '继续营业' : '暂停')); pauseButton.disabled = !game.started || game.ended; soundButton.textContent = sound.muted ? '♪ ×' : '♪'; soundButton.setAttribute('aria-label', t(sound.muted ? '开启声音' : '关闭声音')); soundButton.setAttribute('aria-pressed', String(!sound.muted)); orientation.textContent = t('横屏体验更好，转动手机后再开摊'); }
toolbar();
languageButton.addEventListener('click', () => { setLanguage(getLanguage() === 'zh' ? 'en' : 'zh'); toolbar(); try {
    localStorage.setItem('jianbing-legend:language', getLanguage());
}
catch { } });
pauseButton.addEventListener('click', () => { if (game.started && !game.ended) {
    game.paused = !game.paused;
    dragging = false;
    toolbar();
} });
soundButton.addEventListener('click', () => { sound.muted = !sound.muted; if (!sound.muted)
    sound.start(); toolbar(); try {
    localStorage.setItem('jianbing-legend:muted', String(sound.muted));
}
catch { } });
function position(e) { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * 1280 / r.width, y: (e.clientY - r.top) * 720 / r.height }; }
canvas.addEventListener('pointerdown', e => {
    const p = position(e);
    last = p;
    scene.pointer = p;
    const hit = [...scene.hits].reverse().find(h => p.x >= h.x && p.x < h.x + h.w && p.y >= h.y && p.y < h.y + h.h);
    if (!game.started || game.ended || game.paused) {
        if (hit?.id === 'start') {
            game = new Game();
            game.started = true;
            game.newCustomer();
            game.spawn = 9;
            saved = false;
            scene.effects = [];
            scene.toastAge = 0;
            scene.arrivals.clear();
            scene.previousCustomers = [];
            sound.start();
            toolbar();
        }
        else if (hit?.id === 'resume') {
            game.paused = false;
            toolbar();
        }
        return;
    }
    sound.start();
    let effect = '', success = true;
    if (hit) {
        const id = hit.id;
        if (id.startsWith('food:')) {
            const food = id.slice(5), before = game.inventory.stock[food];
            game.message = game.cooking.add(food, game.inventory);
            success = game.inventory.stock[food] < before;
            effect = success ? id : '';
            scene.touchFocus = id;
            scene.touchAge = 1.5;
        }
        else if (id.startsWith('customer:')) {
            game.next = Number(id.split(':')[1]);
            if (game.cooking.stage === 'bagged') {
                success = game.serve();
                effect = success ? 'serve' : '';
                sound.tone(success ? 660 : 160, .2);
                scene.tutorialDone = true;
                try {
                    localStorage.setItem('jianbing-legend:tutorial', 'done');
                }
                catch { }
            }
            else
                game.message = '已接单，请看铁板上方的完整订单';
        }
        else if (id === 'boss')
            game.message = game.inventory.request() ? '老板：来了来了，五秒补齐！' : '老板：库存还满着，或正在路上！';
        else if (id === 'flip') {
            success = game.cooking.flip();
            game.message = success ? '翻面完成，开始刷酱加配料' : '先摊匀并加至少一个鸡蛋';
            effect = success ? id : '';
        }
        else if (id === 'fold') {
            success = game.cooking.fold();
            game.message = success ? '折起来，香气包住！' : '先翻面；加酱后请拖动刷匀';
        }
        else if (id === 'bag') {
            success = game.cooking.bag();
            game.message = success ? '装袋完成，点击顾客交餐' : '先折叠好，再装袋';
        }
        else if (id === 'discard') {
            game.cooking = new Cooking();
            game.message = '清空铁板，已用食材不会退回';
        }
        else if (id === 'slap') {
            success = game.slap();
            game.message = success ? '啪！小手收好，想吃得先点单！' : game.message;
            sound.tone(100, .15, .12);
        }
        else if (id === 'scrape')
            game.message = '直接按住铁板移动，摊饼或刷酱';
        else if (id.startsWith('order:')) {
            scene.touchFocus = id;
            scene.touchAge = 2;
            return;
        }
        if (!id.startsWith('order:')) {
            scene.notify(game.message, effect, game);
            if (!effect && (id.startsWith('food:') || ['scrape', 'flip', 'fold', 'bag', 'discard'].includes(id))) {
                scene.touchFocus = id;
                scene.touchAge = 1.5;
            }
            sound.tone(success ? 310 : 145, .05);
        }
    }
    if (insideGriddle(p.x, p.y)) {
        dragging = true;
        canvas.setPointerCapture(e.pointerId);
    }
});
canvas.addEventListener('pointermove', e => { const p = position(e); scene.pointer = p; if (dragging && !game.paused && insideGriddle(p.x, p.y))
    game.cooking.drag(p.x, p.y, Math.min(65, Math.hypot(p.x - last.x, p.y - last.y))); last = p; canvas.style.cursor = scene.hits.some(h => p.x >= h.x && p.x < h.x + h.w && p.y >= h.y && p.y < h.y + h.h) ? 'pointer' : insideGriddle(p.x, p.y) ? 'crosshair' : 'default'; });
canvas.addEventListener('pointerleave', () => { if (!dragging)
    scene.pointer = { x: -100, y: -100 }; });
for (const event of ['pointerup', 'pointercancel', 'lostpointercapture'])
    canvas.addEventListener(event, () => dragging = false);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && game.started && !game.ended) {
    game.paused = !game.paused;
    dragging = false;
    toolbar();
} });
document.addEventListener('visibilitychange', () => { if (document.hidden && game.started && !game.ended) {
    game.paused = true;
    dragging = false;
    toolbar();
} });
let previous = performance.now();
function frame(now) { const dt = Math.min(.1, (now - previous) / 1000); previous = now; if (!document.hidden) {
    game.tick(dt);
    if (game.started && !game.ended && !game.paused)
        sound.tick(dt, game.cooking.stage !== 'empty');
    scene.dragging = dragging;
    scene.muted = sound.muted;
    scene.draw(game, game.paused ? 0 : dt);
    if (game.ended && !saved) {
        try {
            localStorage.setItem('jianbing-legend:last-day', JSON.stringify({ version: 2, money: game.money, served: game.served, satisfaction: game.satisfaction, date: new Date().toISOString() }));
        }
        catch { }
        saved = true;
        toolbar();
    }
} requestAnimationFrame(frame); }
requestAnimationFrame(frame);
