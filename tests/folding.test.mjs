import test from 'node:test';
import assert from 'node:assert/strict';
import {Cooking,Game,foldTargets,foods} from '../dist/js/systems/game.js';
import {tutorialAction,tutorialAllows,toolEnabled} from '../dist/js/ui.js';
import {t,setLanguage} from '../dist/js/i18n.js';
import {spreadBatter,crackEgg,spreadEgg,completeFold} from './helpers.mjs';
function ready(){const g=new Game(()=>.2,undefined,true);g.started=true;g.newCustomer();const p=g.cooking;g.addFood('batter');spreadBatter(p);crackEgg(p,g.inventory);crackEgg(p,g.inventory);spreadEgg(p);g.addFood('scallion');p.flip();g.addFood('sweet');p.drag(640,502,500);g.addFood('crisp');return {g,p};}
const dragEdge=(p,index)=>{const h=foldTargets[index];assert.ok(p.beginFold(h.x,h.y));return p.pullFold(h.tx,h.ty);};

test('starting folding and waiting never substitutes for three manual folds',()=>{
 const {p}=ready();assert.ok(p.fold());assert.equal(p.stage,'folding');p.tick(30);assert.equal(p.foldStep,0);assert.equal(p.bag(),false);assert.equal(p.fold(),false);
 assert.equal(p.beginFold(810,502),false);assert.equal(p.beginFold(NaN,502),false);assert.equal(p.pullFold(620,502),false);assert.equal(p.foldStep,0);
});
test('partial release rolls back only the current fold and can be grabbed again',()=>{
 const {p}=ready();p.fold();assert.ok(dragEdge(p,0));assert.equal(p.foldStep,1);
 const h=foldTargets[1];p.beginFold(h.x,h.y);assert.equal(p.pullFold(755,502),false);assert.ok(p.foldProgress>0);p.releaseFold();p.tick(.1);assert.equal(p.foldProgress,0);assert.equal(p.foldStep,1);
 assert.ok(dragEdge(p,1));assert.equal(p.foldStep,2);assert.equal(p.stage,'folding');assert.equal(p.bag(),false);
});
test('wrong direction, misalignment and overshooting the griddle cannot finish a fold',()=>{
 const {p}=ready();p.fold();p.beginFold(470,502);assert.equal(p.pullFold(420,502),false);assert.equal(p.foldProgress,0);
 assert.equal(p.pullFold(620,590),false);assert.equal(p.foldStep,0);assert.equal(p.pullFold(900,502),false);assert.equal(p.foldStep,0);assert.equal(p.pullFold(Infinity,NaN),false);
 assert.ok(p.pullFold(620,502));assert.equal(p.foldStep,1);assert.equal(p.pullFold(660,502),false);
});
test('three directed folds retain exact ingredients, allow bagging only after settling, and complete a correct order',()=>{
 const {g,p}=ready(),recipe={...p.ingredients},stock={...g.inventory.stock};p.fold();for(let n=0;n<3;n++)assert.ok(dragEdge(p,n));assert.equal(p.stage,'folded');assert.equal(p.foldStep,3);assert.equal(p.bag(),false);assert.equal(p.undoFold(),true);assert.equal(p.foldStep,2);assert.equal(p.stage,'folding');
 assert.ok(dragEdge(p,2));p.tick(.23);assert.ok(p.bag());assert.equal(p.undoFold(),false);assert.deepEqual(p.ingredients,recipe);assert.deepEqual(g.inventory.stock,stock);assert.ok(g.serve());assert.equal(g.served,1);
});
test('undo goes back one completed edge without losing ingredients and permits a full retry',()=>{
 const {p}=ready();p.fold();assert.equal(p.undoFold(),false);dragEdge(p,0);dragEdge(p,1);const before={...p.ingredients};assert.ok(p.undoFold());assert.equal(p.foldStep,1);assert.ok(p.undoFold());assert.equal(p.foldStep,0);assert.equal(p.undoFold(),false);completeFold(p);assert.equal(p.stage,'folded');assert.deepEqual(p.ingredients,before);
});
test('pause freezes a partly dragged flap and return motion; discard removes fold state',()=>{
 const {g,p}=ready();p.fold();p.beginFold(470,502);p.pullFold(535,502);p.releaseFold();g.paused=true;const before=JSON.stringify(g);for(let n=0;n<20;n++)g.tick(.1);assert.equal(JSON.stringify(g),before);g.paused=false;g.tick(.1);assert.ok(p.foldProgress<.44);g.cooking=new Cooking();assert.equal(g.cooking.foldStep,0);assert.equal(g.cooking.foldProgress,0);assert.equal(g.cooking.stage,'empty');
});
test('tutorial stays on folding until all edges are done, with working undo and bilingual directions',()=>{
 const {g,p}=ready();assert.equal(tutorialAction(g).step,10);p.fold();assert.equal(tutorialAction(g).step,10);assert.deepEqual(tutorialAction(g).focus,['fold:edge']);assert.equal(toolEnabled(g,'bag'),false);dragEdge(p,0);assert.ok(toolEnabled(g,'fold'));assert.ok(tutorialAllows(g,'fold'));assert.equal(tutorialAction(g).key,'折起右边');completeFold(p);p.tick(.23);assert.equal(tutorialAction(g).step,11);assert.ok(toolEnabled(g,'bag'));
 setLanguage('en');try{for(const key of ['折起左边','折起右边','托起下边','从左边拖向中间，包住馅料','从右边拖向中间，盖好饼边','从下边向上托起，完成最后一折','退回上一折','三折完成，装进纸袋吧'])assert.doesNotMatch(t(key),/\p{Script=Han}/u);}finally{setLanguage('zh');}
});

test('normal and Tianjin single/double eggs still complete with three real folds',()=>{
 for(const mode of ['classic','tianjin'])for(const random of [.2,.8]){
  const g=new Game(()=>random);g.profile.mode=mode;g.started=true;g.newCustomer();const recipe={...g.target.recipe},p=g.cooking;g.addFood('batter');spreadBatter(p);for(let i=0;i<recipe.egg;i++)crackEgg(p,g.inventory);spreadEgg(p);assert.ok(p.flip());
  for(const [id] of foods)if(!['batter','egg'].includes(id))for(let i=0;i<(recipe[id]||0);i++)g.addFood(id);p.drag(640,502,500);assert.ok(p.fold());completeFold(p);p.tick(.23);assert.ok(p.bag());assert.ok(g.serve());assert.ok(g.money>3);assert.equal(g.cooking.stage,'empty');
 }
});
