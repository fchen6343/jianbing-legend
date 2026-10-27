import {restoreProfile,decorations,charm,patienceMultiplier,purchase,openShop,Festival,Mode} from './systems/progress.js';
import {getLanguage,setLanguage,t} from './i18n.js';
import {rotorEquipment,buyRotor,setRotor,equipmentPreparation,tickRotor,rotorWorking} from './systems/equipment.js';
import {Game,Cooking,Food} from './systems/game.js';
import {Sound} from './systems/audio.js';
import {Scene} from './render/scene.js';
import {insideGriddle,nextAction,tutorialAllows} from './ui.js';
const canvas=document.querySelector<HTMLCanvasElement>('#game')!;
const languageButton=document.querySelector<HTMLButtonElement>('#language')!;
const pauseButton=document.querySelector<HTMLButtonElement>('#pause')!;
const soundButton=document.querySelector<HTMLButtonElement>('#sound')!;
const orientation=document.querySelector<HTMLElement>('#orientation')!;
const help=document.querySelector<HTMLElement>('#accessible')!;
const titleKey=document.title,ariaKey=canvas.getAttribute('aria-label')!,helpKey=help.textContent!;
const scene=new Scene(canvas),sound=new Sound();
let profile=restoreProfile(null);try{profile=restoreProfile(localStorage.getItem('jianbing-legend:progress'));}catch{}
let game=new Game(Math.random,profile),dragging=false,eggDragging=false,foldDragging=false,activePointer:number|null=null,last={x:0,y:0},saved=false;
try{if(localStorage.getItem('jianbing-legend:language')==='en')setLanguage('en');scene.tutorialDone=profile.tutorial;sound.muted=localStorage.getItem('jianbing-legend:muted')==='true';}catch{}
function toolbar(){const equipButton=document.querySelector<HTMLButtonElement>('#equipment-open')!;equipButton.textContent=bi('厨具屋','Workshop');equipButton.hidden=!equipmentPreparation(game);if(equipmentDialog.open)renderEquipment();document.querySelector('#mode-open')!.textContent=bi(profile.mode==='classic'?'普通模式 ▾':'天津模式 ▾',profile.mode==='classic'?'Classic ▾':'Tianjin ▾');document.querySelector('#shop-open')!.textContent=t('装饰与经营');document.querySelector('#learn')!.textContent=t(game.tutorial&&game.started&&!game.ended?'退出教程':'新手教程');(document.querySelector('#learn') as HTMLButtonElement).disabled=game.started&&!game.ended&&!game.tutorial;document.querySelector('#toolbar')!.setAttribute('aria-label',t('游戏控制'));if(shopDialog.open)renderShop();document.documentElement.lang=getLanguage()==='en'?'en':'zh-CN';document.title=t(titleKey);canvas.setAttribute('aria-label',t(ariaKey));help.textContent=t(helpKey);languageButton.textContent=getLanguage()==='zh'?'EN / 中文':'中文 / EN';languageButton.setAttribute('aria-label',getLanguage()==='zh'?'Switch to English':'切换为中文');pauseButton.textContent=game.paused?'▶':'Ⅱ';pauseButton.setAttribute('aria-label',t(game.paused?'继续营业':'暂停'));pauseButton.disabled=!game.started||game.ended;soundButton.textContent=sound.muted?'♪ ×':'♪';soundButton.setAttribute('aria-label',t(sound.muted?'开启声音':'关闭声音'));soundButton.setAttribute('aria-pressed',String(!sound.muted));orientation.textContent=t('横屏体验更好，转动手机后再开摊');}
const equipmentDialog=document.querySelector<HTMLDialogElement>('#equipment-dialog')!;
let benchGame:Game|null=null,benchScene:Scene|null=null,benchPaused=false,benchPointer:number|null=null,benchLast={x:0,y:0};
const shopDialog=document.querySelector<HTMLDialogElement>('#shop-dialog')!;
let previewItem='';
let resumeAfterShop=false,lastProgress='',storageFailed=false;
function saveProgress(){const raw=JSON.stringify(profile);if(raw===lastProgress)return;try{localStorage.setItem('jianbing-legend:progress',raw);lastProgress=raw;storageFailed=false;}catch{storageFailed=true;document.querySelector('#save-status')!.textContent=t('浏览器无法保存，进度仅在本次打开期间保留');}}
function stopGesture(){dragging=false;eggDragging=false;foldDragging=false;game.cooking.releaseFold();activePointer=null;game.cooking.endStroke();}
function begin(tutorial=false){stopGesture();game=new Game(Math.random,profile,tutorial);game.started=true;game.newCustomer();game.spawn=9;saved=false;scene.effects=[];scene.eggAge=2;scene.crispAge=2;scene.flipAge=1;scene.toastAge=0;scene.arrivals.clear();scene.previousCustomers=[];scene.tutorialDone=profile.tutorial&&!tutorial;sound.start();toolbar();}
const bi=(zh:string,en:string)=>getLanguage()==='zh'?zh:en;
function renderShop(){
 const active=game.started&&!game.ended;const title=bi('装饰与经营','Decorate & grow');const body=document.querySelector('#shop-body')!;
 document.querySelector('#shop-title')!.textContent=title;document.querySelector('#shop-close')!.textContent=bi('返回煎饼摊','Back to the stall');
 body.innerHTML=`<p class="shop-balance">${bi('钱包','Wallet')} ¥${profile.wallet} · ${bi('魅力','Charm')} ${charm(profile)} · ${bi('新顾客等待','New customer patience')} +${Math.round((patienceMultiplier(profile)-1)*100)}%</p>
 <p>${profile.shop?bi('已完成开店目标','Shop goal complete'):bi('距离开店还差 ¥','Remaining to open: ¥')+Math.max(0,180-profile.wallet)}</p><p>${previewItem?bi('正在预览：','Previewing: ')+(getLanguage()==='zh'?decorations.find(d=>d.id===previewItem)?.zh:decorations.find(d=>d.id===previewItem)?.en):bi('当前摊位','Current stall')}</p><canvas id="decor-preview" width="640" height="360" aria-label="${bi('摊位装饰预览','Stall decoration preview')}"></canvas><p>${bi('预览不花钱，购买后才扣款。','Preview is free. Only buying spends coins.')}</p><p>${bi('魅力每点延长等待 2%，上限 50%；装饰可叠加，卸下后不再加成。','Each charm point adds 2% patience, up to 50%. Equipped decorations stack.')}</p>
 <section class="shop-settings"><div><h3>${bi('经营升级','Grow your business')}</h3><p>${profile.shop?bi('已开店：最多五位顾客，每五秒来客。','Shop open: five customers, arrivals every five seconds.'):bi('¥180 开店：三位顾客 → 五位，来客更快。','Open for ¥180: three → five customers, faster arrivals.')}</p><button data-action="upgrade" ${profile.shop||profile.wallet<180?'disabled':''}>${profile.shop?bi('已开店','Shop opened'):bi('开店 · ¥180','Open shop · ¥180')}</button></div>
 <div id="mode-settings"><h3>${bi('玩法模式','Recipe mode')}</h3><div role="group" aria-label="${bi('选择玩法模式','Choose recipe mode')}">${(['classic','tianjin'] as Mode[]).map(mode=>`<button data-mode="${mode}" aria-pressed="${profile.mode===mode}" ${game.canSwitchMode()?'':'disabled'}>${mode==='classic'?bi('普通模式','Classic mode'):bi('纯血天津人模式','Tianjin Purist Mode')}</button>`).join(' ')}</div><p>${bi('普通模式提供全部配料；天津模式仅果子、果篦儿、酱料和葱花香菜（保留面糊、鸡蛋）。空锅时可切换，排队顾客会重新点单，收入和库存保留。','Classic offers all ingredients. Tianjin restricts fillings to youtiao, guobier, sauces and herbs, plus batter and eggs. Switch on an empty griddle; waiting customers reorder, while income and stock stay.')}</p>${!game.canSwitchMode()?`<p role="status">${bi('请先交餐或清空铁板，并收回偷吃夹子，再切换。','Serve or discard the current pancake and retract the sneaky claw before switching.')}</p>`:''}</div></section>
 <h3>${bi('节日活动','Festival events')}</h3><p>${bi('可随时选择主题体验，不受现实日期限制。当前主题正确出餐六份，即获限定奖励；进度跨局保留。','Choose any theme, regardless of the calendar. Serve six correct orders in a theme for its exclusive reward; progress carries over.')}</p><div class="festival-tabs">${(['spring','dragon','autumn'] as Festival[]).map((f,i)=>`<button data-festival="${f}" aria-pressed="${profile.festival===f}" ${active?'disabled':''}>${getLanguage()==='zh'?['春节','端午','中秋'][i]:['Spring Festival','Dragon Boat','Mid-Autumn'][i]} · ${Math.min(6,profile.events[f])}/6</button>`).join('')}</div>
 <div class="decor-grid">${decorations.filter(d=>!d.festival||d.festival===profile.festival).map(d=>{const owned=profile.owned.includes(d.id),on=profile.equipped.includes(d.id),reward=d.id.endsWith('-reward');return `<article><h3>${getLanguage()==='zh'?d.zh:d.en}</h3><p>+${d.charm} ${bi('魅力','charm')} · ${reward?bi('活动奖励','Event reward'):'¥'+d.cost}</p><button data-preview="${d.id}">${bi('预览','Preview')}</button> <button data-item="${d.id}" ${!owned&&(reward||profile.wallet<d.cost)?'disabled':''}>${owned?(on?bi('已装上 · 卸下','Equipped · Remove'):bi('装上','Equip')):reward?bi('六份正确订单解锁','Unlock: six correct orders'):bi('购买并装上','Buy & equip')}</button></article>`;}).join('')}</div>
 <p>${storageFailed?t('浏览器无法保存，进度仅在本次打开期间保留'):bi('钱包、装饰和活动进度自动保存在当前浏览器。教程不产生收入或活动进度。','Wallet, decorations and events save in this browser. Tutorials do not earn money or event progress.')}</p>`;
 const previewCanvas=document.querySelector<HTMLCanvasElement>('#decor-preview')!;const previewProfile={...profile,equipped:[...profile.equipped]};if(previewItem&&!previewProfile.equipped.includes(previewItem))previewProfile.equipped.push(previewItem);const previewGame=new Game(()=>.5,previewProfile);const previewScene=new Scene(previewCanvas);previewScene.background=scene.background;previewScene.neighbors=scene.neighbors;previewScene.kitchen=scene.kitchen;previewScene.foodAtlas=scene.foodAtlas;previewScene.hands=scene.hands;previewScene.ctx.scale(.5,.5);previewGame.started=true;previewScene.draw(previewGame,0);
}
function showShop(){resumeAfterShop=game.started&&!game.ended&&!game.paused;game.paused=game.started&&!game.ended;stopGesture();renderShop();shopDialog.showModal();toolbar();}
document.querySelector('#shop-open')!.addEventListener('click',showShop);
document.querySelector('#mode-open')!.addEventListener('click',()=>{showShop();document.querySelector('#mode-settings')!.scrollIntoView({block:'center'});});
function closeShop(){previewItem='';shopDialog.close();if(resumeAfterShop)game.paused=false;toolbar();}
document.querySelector('#shop-close')!.addEventListener('click',closeShop);
shopDialog.addEventListener('cancel',e=>{e.preventDefault();closeShop();});
document.querySelector('#shop-body')!.addEventListener('click',e=>{const button=(e.target as HTMLElement).closest('button');if(!button||button.disabled)return;if(button.dataset.preview){previewItem=button.dataset.preview;renderShop();document.querySelector('#decor-preview')!.scrollIntoView({block:'center',behavior:'smooth'});return;}const id=button.dataset.item;
 if(id){if(profile.owned.includes(id)){profile.equipped=profile.equipped.includes(id)?profile.equipped.filter(v=>v!==id):[...profile.equipped,id];}else purchase(profile,id);}
 if(button.dataset.action==='upgrade')openShop(profile);
 if(button.dataset.mode==='classic'||button.dataset.mode==='tianjin'){game.switchMode(button.dataset.mode);scene.notify(game.message);}
 if((!game.started||game.ended)&&button.dataset.festival)profile.festival=button.dataset.festival as Festival;
 saveProgress();toolbar();});
function copyArtwork(target:Scene){target.background=scene.background;target.neighbors=scene.neighbors;target.kitchen=scene.kitchen;target.foodAtlas=scene.foodAtlas;target.hands=scene.hands;}
function benchReset(){if(!benchGame)return;benchGame.cooking=new Cooking();benchGame.inventory.stock.batter=8;benchGame.addFood('batter');benchPaused=false;benchPointer=null;if(benchScene)benchScene.dragging=false;}
function renderEquipment(){
 if(!benchGame){benchGame=new Game(()=>.5,{...profile,owned:[...profile.owned],equipped:[...profile.equipped],events:{...profile.events},rotorOwned:true,rotorOn:true});benchGame.started=true;benchReset();}
 benchPointer=null;benchGame.cooking.endStroke();
 const owned=profile.rotorOwned,canBuy=equipmentPreparation(game)&&!owned&&profile.wallet>=rotorEquipment.cost,auto=benchGame.profile.rotorOn;
 document.querySelector('#equipment-title')!.textContent=bi('厨具升级屋','Equipment workshop');document.querySelector('#equipment-close')!.textContent=bi('返回煎饼摊','Back to the stall');
 document.querySelector('#equipment-body')!.innerHTML=`<section class="equipment-details"><div><h3>${bi('自动旋转刮板','Rotating spreader')}</h3><p>${bi('当前等级','Current level')} ${owned?'1':'0'} → ${bi('试用外观 Lv.1','Trial appearance Lv.1')} · ${bi('钱包','Wallet')} ¥${profile.wallet}</p><p>${bi('约四秒自动绕圈摊糊；腾出手接单、补货和拦夹子。打蛋、配料和折叠由你完成。','Circles the batter in about four seconds, freeing your hand for customers, restock and claws. Eggs, fillings and folding stay yours.')}</p></div><div><button id="buy-rotor" ${canBuy?'':'disabled'}>${owned?bi('已安装 Lv.1','Installed Lv.1'):bi('确认升级 · ¥','Confirm upgrade · ¥')+rotorEquipment.cost}</button> <button id="rotor-switch" aria-pressed="${owned&&profile.rotorOn}" ${owned&&equipmentPreparation(game)?'':'disabled'}>${profile.rotorOn?bi('下次营业：自动开启','Next service: automatic ON'):bi('下次营业：手动制作','Next service: manual')}</button><p>${owned?bi('开关与设备自动保存；教程始终手动。','Ownership and switch save automatically. Tutorial stays manual.'):bi('还差 ¥','Need ¥')+Math.max(0,rotorEquipment.cost-profile.wallet)}</p></div></section>
 <h3>${bi('免费比较手动 / 自动','Compare manual / automatic for free')}</h3><p>${bi('下方仅是摊糊试用台，不会购买设备、花钱、消耗真实库存或产生收入。可暂停观察，倒面糊重试。','This batter-only trial does not buy equipment, spend money, use real stock or earn income. Pause to inspect; pour again to retry.')}</p><canvas id="equipment-preview" width="1280" height="720" aria-label="${bi('旋转刮板免费试用台','Free rotating-spreader trial')}"></canvas>
 <div class="bench-controls" role="group" aria-label="${bi('选择试用方式','Choose trial method')}"><button id="bench-auto" aria-pressed="${auto}">${bi('自动试用','Try automatic')}</button><button id="bench-manual" aria-pressed="${!auto}">${bi('手动试用','Try manual')}</button><button id="bench-pour">${bi('倒面糊重试','Pour and retry')}</button><button id="bench-pause">${benchPaused?bi('继续试用','Resume trial'):bi('暂停试用','Pause trial')}</button></div><p id="bench-status" role="status"></p>`;
 const el=document.querySelector<HTMLCanvasElement>('#equipment-preview')!;benchScene=new Scene(el);copyArtwork(benchScene);
 const point=(e:PointerEvent)=>{const r=el.getBoundingClientRect();return {x:(e.clientX-r.left)*1280/r.width,y:(e.clientY-r.top)*720/r.height};};
 el.addEventListener('pointerdown',e=>{if(!benchGame||!benchScene||benchPaused||benchGame.profile.rotorOn||benchPointer!==null)return;const p=point(e);if(!insideGriddle(p.x,p.y))return;benchGame.cooking.endStroke();benchPointer=e.pointerId;benchLast=p;benchScene.dragging=true;benchScene.pointer=p;el.setPointerCapture(e.pointerId);});
 el.addEventListener('pointermove',e=>{if(!benchGame||!benchScene||benchPaused||benchPointer!==e.pointerId)return;const p=point(e);benchScene.pointer=p;benchGame.cooking.drag(p.x,p.y,Math.hypot(p.x-benchLast.x,p.y-benchLast.y));benchLast=p;});
 const release=(e:Event)=>{if(benchPointer===null||benchPointer===(e as PointerEvent).pointerId){benchPointer=null;benchGame?.cooking.endStroke();if(benchScene)benchScene.dragging=false;}};
 for(const name of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(name,release);
 const select=(auto:boolean)=>{if(!benchGame)return;benchGame.profile.rotorOn=auto;benchReset();renderEquipment();};
 document.querySelector('#bench-auto')!.addEventListener('click',()=>select(true));document.querySelector('#bench-manual')!.addEventListener('click',()=>select(false));document.querySelector('#bench-pour')!.addEventListener('click',()=>{benchReset();renderEquipment();});document.querySelector('#bench-pause')!.addEventListener('click',()=>{benchPaused=!benchPaused;renderEquipment();});
 document.querySelector('#buy-rotor')!.addEventListener('click',()=>{if(buyRotor(game)){saveProgress();sound.start();sound.play('coin');benchReset();renderEquipment();if(benchScene)benchScene.upgradeAge=1.2;}});
 document.querySelector('#rotor-switch')!.addEventListener('click',()=>{if(setRotor(game,!profile.rotorOn)){saveProgress();renderEquipment();}});
 updateBenchStatus();benchScene.drawWorkshop(benchGame,0);
}
function updateBenchStatus(){if(!benchGame)return;const message=benchScene&&benchScene.upgradeAge>0?bi('正在安装旋转刮板…','Installing the rotating spreader…'):benchPaused?bi('试用已暂停，面糊与设备保持当前位置','Trial paused: batter and machine stay in place'):benchGame.cooking.stage==='egg'?bi('摊好了！可以换一种方式比较，或倒面糊重试。','Batter spread! Compare the other method, or pour again.'):benchGame.profile.rotorOn?bi('正在自动摊糊，等待刮板绕完一圈','Spreading automatically; let the blade complete its circle'):bi('按住试用铁板绕圈摊开面糊','Hold and circle the trial griddle to spread the batter');const status=document.querySelector('#bench-status');if(status&&status.textContent!==message)status.textContent=message;}
function closeEquipment(){equipmentDialog.close();benchGame=null;benchScene=null;benchPointer=null;benchPaused=false;toolbar();}
document.querySelector('#equipment-open')!.addEventListener('click',()=>{if(!equipmentPreparation(game))return;stopGesture();sound.start();renderEquipment();equipmentDialog.showModal();});document.querySelector('#equipment-close')!.addEventListener('click',closeEquipment);equipmentDialog.addEventListener('cancel',e=>{e.preventDefault();closeEquipment();});
document.querySelector('#learn')!.addEventListener('click',()=>{if(game.tutorial&&game.started&&!game.ended){game=new Game(Math.random,profile);toolbar();}else if(!game.started||game.ended)begin(true);});
toolbar();
languageButton.addEventListener('click',()=>{setLanguage(getLanguage()==='zh'?'en':'zh');toolbar();try{localStorage.setItem('jianbing-legend:language',getLanguage());}catch{}});
pauseButton.addEventListener('click',()=>{if(game.started&&!game.ended){game.paused=!game.paused;stopGesture();toolbar();}});
soundButton.addEventListener('click',()=>{sound.muted=!sound.muted;if(!sound.muted)sound.start();toolbar();try{localStorage.setItem('jianbing-legend:muted',String(sound.muted));}catch{}});
function position(e:PointerEvent){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*1280/r.width,y:(e.clientY-r.top)*720/r.height};}
canvas.addEventListener('pointerdown',e=>{
 if(activePointer!==null)return;
 const p=position(e);last=p;scene.pointer=p;
 const hit=[...scene.hits].reverse().find(h=>p.x>=h.x&&p.x<h.x+h.w&&p.y>=h.y&&p.y<h.y+h.h);
 if(!game.started||game.ended||game.paused){if(hit?.id==='start'){begin(!profile.tutorial);}else if(hit?.id==='resume'){game.paused=false;toolbar();}return;}
 if(hit?.id==='skip'){begin(false);return;}
 sound.start();
 if(game.cooking.heldEgg&&insideGriddle(p.x,p.y)){
  const held=game.cooking.heldEgg,focus=held.phase==='held'?'egg:crack':'egg:open';
  if(!tutorialAllows(game,focus))return;
  if(game.cooking.beginEgg(p.x,p.y)){
   if(focus==='egg:crack')sound.play('egg');
   game.message='按住蛋壳，向左或右拉开';scene.notify(game.message);
   eggDragging=true;activePointer=e.pointerId;canvas.setPointerCapture(e.pointerId);
  }else scene.notify(held.phase==='held'?'点饼面中央敲蛋，边缘容易滑落':'按住蛋壳，向左或右拉开');
  return;
 }
 if(game.cooking.stage==='folding'&&insideGriddle(p.x,p.y)){
  if(game.cooking.beginFold(p.x,p.y)){foldDragging=true;activePointer=e.pointerId;canvas.setPointerCapture(e.pointerId);}
  else scene.notify('按住发光的饼边，沿箭头拖到圆点');
  return;
 }
 let effect='',success=true;
 if(hit){const id=hit.id;
  if(!tutorialAllows(game,id)){scene.notify('请先完成箭头指向的步骤');return;}
  if(id.startsWith('food:')){const food=id.slice(5) as Food,before=game.inventory.stock[food],held=game.cooking.heldEgg;game.message=game.addFood(food);success=food==='egg'?held!==game.cooking.heldEgg:game.inventory.stock[food]<before;effect=success&&food!=='egg'?id:'';scene.touchFocus=id;scene.touchAge=1.5;}
  else if(id.startsWith('customer:')){game.next=Number(id.split(':')[1]);if(game.cooking.stage==='bagged'){success=game.serve();effect=success?'serve':'';sound.play(success?'coin':'error');if(success&&game.tutorial){game.ended=true;scene.tutorialDone=true;toolbar();}saveProgress();}else game.message='已接单，请看铁板上方的完整订单';}
  else if(id==='boss'){success=game.inventory.request();game.message=success?'老板：来了来了，五秒补齐！':'老板：库存还满着，或正在路上！';if(success)sound.play('fold');}
  else if(id==='flip'){success=game.cooking.flip();game.message=success?'翻面完成，开始刷酱加配料':nextAction(game).detail;effect=success?id:'';}
  else if(id==='fold'){const undo=['folding','folded'].includes(game.cooking.stage);success=undo?game.cooking.undoFold():game.cooking.fold();game.message=success?(undo?'已退回上一折，可以重新拖折':'按住发光的饼边，沿箭头拖到圆点'):nextAction(game).detail;}
  else if(id==='bag'){success=game.cooking.bag();effect=success?'bag':'';game.message=success?'装袋完成，点击顾客交餐':nextAction(game).detail;}
  else if(id==='discard'){stopGesture();game.cooking=new Cooking();game.message='清空铁板，已用食材不会退回';}
  else if(id==='slap'){success=game.slap();game.message=success?'叮！夹子收回去，想吃得先点单！':game.message;sound.play('flip');}
  else if(id==='scrape')game.message=nextAction(game).detail;
  else if(id.startsWith('order:')){scene.touchFocus=id;scene.touchAge=2;return;}
  if(!id.startsWith('order:')){scene.notify(game.message,effect,game);if(!effect&&(id.startsWith('food:')||['scrape','flip','fold','bag','discard'].includes(id))){scene.touchFocus=id;scene.touchAge=1.5;}if(!success)sound.play('error');else if(id.startsWith('food:')&&id!=='food:egg')sound.play(id==='food:crisp'?'crisp':id==='food:batter'||id==='food:sweet'||id==='food:chili'?'pour':'sprinkle');else if(id==='flip'||id==='fold'||id==='bag')sound.play(id);}
 }
 if(!game.cooking.heldEgg&&game.cooking.stage!=='folding'&&insideGriddle(p.x,p.y)&&tutorialAllows(game,'scrape')){game.cooking.endStroke();dragging=true;activePointer=e.pointerId;canvas.setPointerCapture(e.pointerId);}
});
canvas.addEventListener('pointermove',e=>{const p=position(e);if(activePointer!==null&&activePointer!==e.pointerId)return;scene.pointer=p;const canCook=game.started&&!game.ended&&!game.paused;if(foldDragging&&canCook&&game.cooking.pullFold(p.x,p.y)){foldDragging=false;game.message=game.cooking.stage==='folded'?'三折完成，装进纸袋吧':'这一边折好了，接着拖下一边';scene.notify(game.message);sound.play('fold');}if(eggDragging&&canCook&&game.cooking.pullEgg(p.x,p.y,game.inventory)){eggDragging=false;game.message='鸡蛋落到饼上了，从蛋黄开始摊匀';scene.notify(game.message);sound.play('pour');}if(dragging&&canCook&&insideGriddle(p.x,p.y))game.cooking.drag(p.x,p.y,Math.min(65,Math.hypot(p.x-last.x,p.y-last.y)));if(dragging)scene.toolAngle+=((Math.max(-.5,Math.min(.5,(p.x-last.x)*.04)))-scene.toolAngle)*.25;last=p;canvas.style.cursor=scene.hits.some(h=>p.x>=h.x&&p.x<h.x+h.w&&p.y>=h.y&&p.y<h.y+h.h)?'pointer':insideGriddle(p.x,p.y)?'crosshair':'default';});
canvas.addEventListener('pointerleave',()=>{if(!dragging&&!eggDragging&&!foldDragging)scene.pointer={x:-100,y:-100};});
for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,(e)=>{if(activePointer===null||activePointer===(e as PointerEvent).pointerId)stopGesture();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!shopDialog.open&&!equipmentDialog.open&&game.started&&!game.ended){game.paused=!game.paused;stopGesture();toolbar();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&equipmentDialog.open){benchPaused=true;benchPointer=null;benchGame?.cooking.endStroke();if(benchScene)benchScene.dragging=false;renderEquipment();}if(document.hidden){sound.activity(false);sound.motorActivity(false);}if(document.hidden&&game.started&&!game.ended){game.paused=true;stopGesture();toolbar();}});
let previous=performance.now();
function frame(now:number){const dt=Math.min(.1,(now-previous)/1000);previous=now;if(!document.hidden){if(equipmentDialog.open&&benchGame&&benchScene){if(!benchPaused&&benchScene.upgradeAge<=0){tickRotor(benchGame,dt);benchGame.cooking.tick(dt);}benchScene.drawWorkshop(benchGame,benchPaused?0:dt);updateBenchStatus();}const wasRefilling=game.inventory.refill>0;game.tick(dt);if(wasRefilling&&!game.inventory.refill)sound.play('sprinkle');saveProgress();if(game.started&&!game.ended&&!game.paused)sound.tick(dt,!['empty','bagged','folded'].includes(game.cooking.stage),dragging,game.cooking.stage==='flipped');else sound.activity(false);sound.motorActivity(equipmentDialog.open?!!benchGame&&!benchPaused&&rotorWorking(benchGame):game.started&&!game.ended&&!game.paused&&rotorWorking(game));scene.dragging=dragging;scene.muted=sound.muted;scene.draw(game,game.paused?0:dt);if(game.ended&&!saved){stopGesture();if(!game.tutorial){profile.days++;saveProgress();}try{localStorage.setItem('jianbing-legend:last-day',JSON.stringify({version:2,money:game.money,served:game.served,satisfaction:game.satisfaction,date:new Date().toISOString()}));}catch{}saved=true;toolbar();}}requestAnimationFrame(frame);}requestAnimationFrame(frame);
