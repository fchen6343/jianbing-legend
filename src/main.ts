import {restoreProfile,decorations,charm,patienceMultiplier,purchase,openShop,Festival} from './systems/progress.js';
import {getLanguage,setLanguage,t} from './i18n.js';
import {Game,Cooking,Food} from './systems/game.js';
import {Sound} from './systems/audio.js';
import {Scene} from './render/scene.js';
import {insideGriddle} from './ui.js';
const canvas=document.querySelector<HTMLCanvasElement>('#game')!;
const languageButton=document.querySelector<HTMLButtonElement>('#language')!;
const pauseButton=document.querySelector<HTMLButtonElement>('#pause')!;
const soundButton=document.querySelector<HTMLButtonElement>('#sound')!;
const orientation=document.querySelector<HTMLElement>('#orientation')!;
const help=document.querySelector<HTMLElement>('#accessible')!;
const titleKey=document.title,ariaKey=canvas.getAttribute('aria-label')!,helpKey=help.textContent!;
const scene=new Scene(canvas),sound=new Sound();
let profile=restoreProfile(null);try{profile=restoreProfile(localStorage.getItem('jianbing-legend:progress'));}catch{}
let game=new Game(Math.random,profile),dragging=false,last={x:0,y:0},saved=false;
try{if(localStorage.getItem('jianbing-legend:language')==='en')setLanguage('en');scene.tutorialDone=profile.tutorial;sound.muted=localStorage.getItem('jianbing-legend:muted')==='true';}catch{}
function toolbar(){document.querySelector('#shop-open')!.textContent=t('装饰与经营');document.querySelector('#learn')!.textContent=t(game.tutorial&&game.started&&!game.ended?'退出教程':'新手教程');(document.querySelector('#learn') as HTMLButtonElement).disabled=game.started&&!game.ended&&!game.tutorial;document.querySelector('#toolbar')!.setAttribute('aria-label',t('游戏控制'));if(shopDialog.open)renderShop();document.documentElement.lang=getLanguage()==='en'?'en':'zh-CN';document.title=t(titleKey);canvas.setAttribute('aria-label',t(ariaKey));help.textContent=t(helpKey);languageButton.textContent=getLanguage()==='zh'?'EN / 中文':'中文 / EN';languageButton.setAttribute('aria-label',getLanguage()==='zh'?'Switch to English':'切换为中文');pauseButton.textContent=game.paused?'▶':'Ⅱ';pauseButton.setAttribute('aria-label',t(game.paused?'继续营业':'暂停'));pauseButton.disabled=!game.started||game.ended;soundButton.textContent=sound.muted?'♪ ×':'♪';soundButton.setAttribute('aria-label',t(sound.muted?'开启声音':'关闭声音'));soundButton.setAttribute('aria-pressed',String(!sound.muted));orientation.textContent=t('横屏体验更好，转动手机后再开摊');}
const shopDialog=document.querySelector<HTMLDialogElement>('#shop-dialog')!;
let resumeAfterShop=false,lastProgress='',storageFailed=false;
function saveProgress(){const raw=JSON.stringify(profile);if(raw===lastProgress)return;try{localStorage.setItem('jianbing-legend:progress',raw);lastProgress=raw;storageFailed=false;}catch{storageFailed=true;document.querySelector('#save-status')!.textContent=t('浏览器无法保存，进度仅在本次打开期间保留');}}
function begin(tutorial=false){game=new Game(Math.random,profile,tutorial);game.started=true;game.newCustomer();game.spawn=9;saved=false;scene.effects=[];scene.toastAge=0;scene.arrivals.clear();scene.previousCustomers=[];scene.tutorialDone=profile.tutorial&&!tutorial;sound.start();toolbar();}
const bi=(zh:string,en:string)=>getLanguage()==='zh'?zh:en;
function renderShop(){
 const active=game.started&&!game.ended;const title=bi('装饰与经营','Decorate & grow');const body=document.querySelector('#shop-body')!;
 document.querySelector('#shop-title')!.textContent=title;document.querySelector('#shop-close')!.textContent=bi('返回煎饼摊','Back to the stall');
 body.innerHTML=`<p class="shop-balance">${bi('钱包','Wallet')} ¥${profile.wallet} · ${bi('魅力','Charm')} ${charm(profile)} · ${bi('新顾客等待','New customer patience')} +${Math.round((patienceMultiplier(profile)-1)*100)}%</p>
 <p>${bi('魅力每点延长等待 2%，上限 50%；装饰可叠加，卸下后不再加成。','Each charm point adds 2% patience, up to 50%. Equipped decorations stack.')}</p>
 <section class="shop-settings"><div><h3>${bi('经营升级','Grow your business')}</h3><p>${profile.shop?bi('已开店：最多五位顾客，每五秒来客。','Shop open: five customers, arrivals every five seconds.'):bi('¥180 开店：三位顾客 → 五位，来客更快。','Open for ¥180: three → five customers, faster arrivals.')}</p><button data-action="upgrade" ${profile.shop||profile.wallet<180?'disabled':''}>${profile.shop?bi('已开店','Shop opened'):bi('开店 · ¥180','Open shop · ¥180')}</button></div>
 <div><h3>${bi('玩法模式','Recipe mode')}</h3><button data-action="mode" ${active?'disabled':''}>${profile.mode==='tianjin'?bi('纯血天津人模式 ✓','Tianjin Purist Mode ✓'):bi('经典模式 · 点击切换','Classic · Click to switch')}</button><p>${bi('天津模式：面糊、鸡蛋；只配果子、果篦儿、两种酱、葱花和香菜。模式与活动在两局之间切换。','Tianjin: batter, eggs; youtiao, guobier, two sauces, scallions and cilantro only. Switch modes/events between days.')}</p></div></section>
 <h3>${bi('节日活动','Festival events')}</h3><p>${bi('可随时选择主题体验，不受现实日期限制。当前主题正确出餐六份，即获限定奖励；进度跨局保留。','Choose any theme, regardless of the calendar. Serve six correct orders in a theme for its exclusive reward; progress carries over.')}</p><div class="festival-tabs">${(['spring','dragon','autumn'] as Festival[]).map((f,i)=>`<button data-festival="${f}" aria-pressed="${profile.festival===f}" ${active?'disabled':''}>${getLanguage()==='zh'?['春节','端午','中秋'][i]:['Spring Festival','Dragon Boat','Mid-Autumn'][i]} · ${Math.min(6,profile.events[f])}/6</button>`).join('')}</div>
 <div class="decor-grid">${decorations.filter(d=>!d.festival||d.festival===profile.festival).map(d=>{const owned=profile.owned.includes(d.id),on=profile.equipped.includes(d.id),reward=d.id.endsWith('-reward');return `<article><h3>${getLanguage()==='zh'?d.zh:d.en}</h3><p>+${d.charm} ${bi('魅力','charm')} · ${reward?bi('活动奖励','Event reward'):'¥'+d.cost}</p><button data-item="${d.id}" ${!owned&&(reward||profile.wallet<d.cost)?'disabled':''}>${owned?(on?bi('已装上 · 卸下','Equipped · Remove'):bi('装上','Equip')):reward?bi('六份正确订单解锁','Unlock: six correct orders'):bi('购买并装上','Buy & equip')}</button></article>`;}).join('')}</div>
 <p>${storageFailed?t('浏览器无法保存，进度仅在本次打开期间保留'):bi('钱包、装饰和活动进度自动保存在当前浏览器。教程不产生收入或活动进度。','Wallet, decorations and events save in this browser. Tutorials do not earn money or event progress.')}</p>`;
}
document.querySelector('#shop-open')!.addEventListener('click',()=>{resumeAfterShop=game.started&&!game.ended&&!game.paused;game.paused=game.started&&!game.ended;dragging=false;renderShop();shopDialog.showModal();toolbar();});
function closeShop(){shopDialog.close();if(resumeAfterShop)game.paused=false;toolbar();}
document.querySelector('#shop-close')!.addEventListener('click',closeShop);
shopDialog.addEventListener('cancel',e=>{e.preventDefault();closeShop();});
document.querySelector('#shop-body')!.addEventListener('click',e=>{const button=(e.target as HTMLElement).closest('button');if(!button||button.disabled)return;const id=button.dataset.item;
 if(id){if(profile.owned.includes(id)){profile.equipped=profile.equipped.includes(id)?profile.equipped.filter(v=>v!==id):[...profile.equipped,id];}else purchase(profile,id);}
 if(button.dataset.action==='upgrade')openShop(profile);
 if(!game.started||game.ended){if(button.dataset.action==='mode')profile.mode=profile.mode==='classic'?'tianjin':'classic';if(button.dataset.festival)profile.festival=button.dataset.festival as Festival;}
 saveProgress();renderShop();});
document.querySelector('#learn')!.addEventListener('click',()=>{if(game.tutorial&&game.started&&!game.ended){game=new Game(Math.random,profile);toolbar();}else if(!game.started||game.ended)begin(true);});
toolbar();
languageButton.addEventListener('click',()=>{setLanguage(getLanguage()==='zh'?'en':'zh');toolbar();try{localStorage.setItem('jianbing-legend:language',getLanguage());}catch{}});
pauseButton.addEventListener('click',()=>{if(game.started&&!game.ended){game.paused=!game.paused;dragging=false;toolbar();}});
soundButton.addEventListener('click',()=>{sound.muted=!sound.muted;if(!sound.muted)sound.start();toolbar();try{localStorage.setItem('jianbing-legend:muted',String(sound.muted));}catch{}});
function position(e:PointerEvent){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*1280/r.width,y:(e.clientY-r.top)*720/r.height};}
canvas.addEventListener('pointerdown',e=>{
 const p=position(e);last=p;scene.pointer=p;
 const hit=[...scene.hits].reverse().find(h=>p.x>=h.x&&p.x<h.x+h.w&&p.y>=h.y&&p.y<h.y+h.h);
 if(!game.started||game.ended||game.paused){if(hit?.id==='start'){begin(!profile.tutorial);}else if(hit?.id==='resume'){game.paused=false;toolbar();}return;}
 sound.start();let effect='',success=true;
 if(hit){const id=hit.id;
  if(id.startsWith('food:')){const food=id.slice(5) as Food,before=game.inventory.stock[food];game.message=game.addFood(food);success=game.inventory.stock[food]<before;effect=success?id:'';scene.touchFocus=id;scene.touchAge=1.5;}
  else if(id.startsWith('customer:')){game.next=Number(id.split(':')[1]);if(game.cooking.stage==='bagged'){success=game.serve();effect=success?'serve':'';sound.tone(success?660:160,.2);if(success&&game.tutorial){game.ended=true;scene.tutorialDone=true;toolbar();}saveProgress();}else game.message='已接单，请看铁板上方的完整订单';}
  else if(id==='boss')game.message=game.inventory.request()?'老板：来了来了，五秒补齐！':'老板：库存还满着，或正在路上！';
  else if(id==='flip'){success=game.cooking.flip();game.message=success?'翻面完成，开始刷酱加配料':'先加鸡蛋，并拖动抹匀蛋液';effect=success?id:'';}
  else if(id==='fold'){success=game.cooking.fold();game.message=success?'折起来，香气包住！':'先翻面；加酱后请拖动刷匀';}
  else if(id==='bag'){success=game.cooking.bag();game.message=success?'装袋完成，点击顾客交餐':'先折叠好，再装袋';}
  else if(id==='discard'){game.cooking=new Cooking();game.message='清空铁板，已用食材不会退回';}
  else if(id==='slap'){success=game.slap();game.message=success?'啪！小手收好，想吃得先点单！':game.message;sound.tone(100,.15,.12);}
  else if(id==='scrape')game.message='直接按住铁板移动，摊饼或刷酱';
  else if(id.startsWith('order:')){scene.touchFocus=id;scene.touchAge=2;return;}
  if(!id.startsWith('order:')){scene.notify(game.message,effect,game);if(!effect&&(id.startsWith('food:')||['scrape','flip','fold','bag','discard'].includes(id))){scene.touchFocus=id;scene.touchAge=1.5;}sound.tone(success?310:145,.05);}
 }
 if(insideGriddle(p.x,p.y)){dragging=true;canvas.setPointerCapture(e.pointerId);}
});
canvas.addEventListener('pointermove',e=>{const p=position(e);scene.pointer=p;if(dragging&&!game.paused&&insideGriddle(p.x,p.y))game.cooking.drag(p.x,p.y,Math.min(65,Math.hypot(p.x-last.x,p.y-last.y)));last=p;canvas.style.cursor=scene.hits.some(h=>p.x>=h.x&&p.x<h.x+h.w&&p.y>=h.y&&p.y<h.y+h.h)?'pointer':insideGriddle(p.x,p.y)?'crosshair':'default';});
canvas.addEventListener('pointerleave',()=>{if(!dragging)scene.pointer={x:-100,y:-100};});
for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>dragging=false);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!shopDialog.open&&game.started&&!game.ended){game.paused=!game.paused;dragging=false;toolbar();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.started&&!game.ended){game.paused=true;dragging=false;toolbar();}});
let previous=performance.now();
function frame(now:number){const dt=Math.min(.1,(now-previous)/1000);previous=now;if(!document.hidden){game.tick(dt);saveProgress();if(game.started&&!game.ended&&!game.paused)sound.tick(dt,game.cooking.stage!=='empty');scene.dragging=dragging;scene.muted=sound.muted;scene.draw(game,game.paused?0:dt);if(game.ended&&!saved){if(!game.tutorial){profile.days++;saveProgress();}try{localStorage.setItem('jianbing-legend:last-day',JSON.stringify({version:2,money:game.money,served:game.served,satisfaction:game.satisfaction,date:new Date().toISOString()}));}catch{}saved=true;toolbar();}}requestAnimationFrame(frame);}requestAnimationFrame(frame);
