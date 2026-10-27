import test from 'node:test';
import assert from 'node:assert/strict';
import {Cooking,Inventory,Game} from '../dist/js/systems/game.js';
import {nextAction,tutorialAction,tutorialAllows,toolEnabled} from '../dist/js/ui.js';
import {setLanguage,t} from '../dist/js/i18n.js';
import {spreadBatter,crackEgg,spreadEgg} from './helpers.mjs';
function ready(){const p=new Cooking(),stock=new Inventory();p.add('batter',stock);spreadBatter(p);return {p,stock};}

test('taking, tapping and partial shell opening consume nothing; only a completed pull commits once',()=>{
 const {p,stock}=ready();p.add('egg',stock);assert.equal(p.heldEgg.phase,'held');assert.equal(stock.stock.egg,8);assert.equal(p.ingredients.egg,undefined);
 assert.equal(p.beginEgg(840,580),false);assert.equal(p.beginEgg(NaN,500),false);assert.equal(p.pullEgg(700,500,stock),false);
 assert.ok(p.beginEgg(585,487));assert.equal(p.heldEgg.phase,'cracked');assert.equal(p.pullEgg(600,487,stock),false);assert.ok(p.heldEgg.open>0);
 p.endStroke();p.tick(5);assert.equal(stock.stock.egg,8);assert.equal(p.eggLayers.length,0);assert.ok(p.beginEgg(600,467));
 assert.ok(p.pullEgg(646,487,stock));assert.equal(stock.stock.egg,7);assert.equal(p.ingredients.egg,1);assert.equal(p.underside.egg,1);assert.equal(p.heldEgg,null);
 assert.equal(p.pullEgg(646,487,stock),false);assert.equal(stock.stock.egg,7);assert.equal(p.eggLayers.length,1);
});
test('returning a held or cracked egg costs nothing, held eggs prevent other ingredients and flipping',()=>{
 const {p,stock}=ready();crackEgg(p,stock);spreadEgg(p);p.add('egg',stock);const before=stock.stock.scallion;
 assert.equal(p.add('scallion',stock),'先打开手中的蛋，或再点蛋盘放回');assert.equal(stock.stock.scallion,before);assert.equal(p.flip(),false);
 p.beginEgg(640,502);p.pullEgg(655,502,stock);p.add('egg',stock);assert.equal(p.heldEgg,null);assert.equal(stock.stock.egg,7);assert.equal(p.ingredients.egg,1);assert.ok(p.flip());
});
test('egg liquid must settle and be picked up at its actual location before it can coat a different area',()=>{
 const {p,stock}=ready();p.add('egg',stock);p.beginEgg(550,480);p.pullEgg(610,480,stock);
 p.drag(550,480,1000);assert.equal(p.eggSpread,0);p.tick(.3);p.endStroke();
 for(let n=0;n<40;n++)p.drag(780,530,1000);assert.equal(p.eggSpread,0);assert.equal(p.eggLayers[0].broken,false);
 p.endStroke();p.drag(550,480,1);assert.ok(p.eggLayers[0].broken);assert.ok(p.eggSpread>0);
 const local=p.eggSpread;for(let n=0;n<40;n++)p.drag(550,480,1000);assert.equal(p.eggSpread,local);assert.equal(p.flip(),false);
 spreadEgg(p);assert.equal(p.eggSpread,1);assert.ok(p.flip());
});
test('lifting and jumping do not paint a bridge across untouched egg areas',()=>{
 const {p,stock}=ready();crackEgg(p,stock,495,502);p.drag(495,502,1);const first=p.eggSpread;p.endStroke();p.drag(780,502,10000);assert.equal(p.eggSpread,first);
 p.endStroke();p.drag(495,502,1);p.drag(780,502,10000);assert.equal(p.eggSpread,first);assert.equal(p.flip(),false);
 for(let n=0;n<1000;n++)p.drag(NaN,Infinity,1000);assert.equal(p.eggSpread,first);
 spreadEgg(p);assert.ok(p.flip());assert.ok(p.eggLayers[0].strokes.length<=320);
});
test('a second egg retains the first coating, needs its own pickup and uses one additional stock',()=>{
 const {p,stock}=ready();crackEgg(p,stock);spreadEgg(p);const first=JSON.stringify(p.eggLayers[0]);
 crackEgg(p,stock,695,510);assert.equal(p.eggLayers[0].spread,1);assert.equal(p.eggLayers[1].spread,0);assert.equal(stock.stock.egg,6);assert.equal(p.flip(),false);
 assert.deepEqual(p.eggLayers[0].strokes,JSON.parse(first).strokes);spreadEgg(p);assert.equal(p.eggSpread,1);assert.ok(p.flip());
});
test('five real eggs are allowed, empty stock blocks selection, and discarding clears pending input',()=>{
 const {p,stock}=ready();for(let n=0;n<5;n++)crackEgg(p,stock);assert.equal(stock.stock.egg,3);assert.equal(p.ingredients.egg,5);assert.equal(p.add('egg',stock),'每种最多五份');
 const {p:empty,stock:out}=ready();out.stock.egg=0;assert.equal(empty.add('egg',out),'用完了，叫右侧老板补货');assert.equal(empty.heldEgg,null);
 const g=new Game();g.cooking=p;g.cooking=new Cooking();assert.equal(g.cooking.heldEgg,null);assert.deepEqual(g.cooking.eggLayers,[]);
});
test('pause freezes partial opening and settling; guidance and cancellation stay available in both languages',()=>{
 const g=new Game(()=>.2,undefined,true);g.started=true;g.newCustomer();g.addFood('batter');spreadBatter(g.cooking);g.addFood('egg');
 assert.deepEqual(tutorialAction(g).focus,['egg:crack']);assert.ok(tutorialAllows(g,'food:egg'));assert.equal(toolEnabled(g,'flip'),false);
 g.cooking.beginEgg(585,487);g.cooking.pullEgg(610,487,g.inventory);assert.deepEqual(tutorialAction(g).focus,['egg:open']);assert.ok(tutorialAllows(g,'egg:open'));
 g.paused=true;const before=JSON.stringify(g);for(let i=0;i<50;i++)g.tick(.1);assert.equal(JSON.stringify(g),before);
 g.paused=false;assert.ok(g.cooking.pullEgg(650,487,g.inventory));const age=g.cooking.eggLayers[0].age;g.paused=true;g.tick(.1);assert.equal(g.cooking.eggLayers[0].age,age);
 setLanguage('en');try{for(const value of ['敲开鸡蛋','拉开蛋壳','点蛋盘拿蛋','先打开手中的蛋，或再点蛋盘放回','鸡蛋落到饼上了，从蛋黄开始摊匀',tutorialAction(g).detail])assert.doesNotMatch(t(value),/\p{Script=Han}/u);}finally{setLanguage('zh');}
});
