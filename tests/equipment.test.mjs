import test from 'node:test';import assert from 'node:assert/strict';
import {Game} from '../dist/js/systems/game.js';
import {restoreProfile} from '../dist/js/systems/progress.js';
import {buyRotor,setRotor,rotorWorking,tickRotor} from '../dist/js/systems/equipment.js';
import {nextAction} from '../dist/js/ui.js';
import {setLanguage,t} from '../dist/js/i18n.js';
import {spreadBatter,crackEgg,spreadEgg,completeFold} from './helpers.mjs';
const tick=(g,n)=>{for(let i=0;i<n;i++)g.tick(.1);};

test('upgrade costs exactly 550 once, rejects insufficient or active service purchases, and saves ownership/switch',()=>{
 const g=new Game();g.profile.wallet=549;assert.equal(buyRotor(g),false);assert.equal(g.profile.wallet,549);assert.equal(setRotor(g,true),false);
 g.profile.wallet=800;g.started=true;assert.equal(buyRotor(g),false);g.started=false;assert.ok(buyRotor(g));assert.equal(g.profile.wallet,250);assert.equal(buyRotor(g),false);assert.equal(g.profile.wallet,250);assert.ok(g.profile.rotorOn);
 assert.ok(setRotor(g,false));assert.equal(g.profile.rotorOn,false);assert.deepEqual(restoreProfile(JSON.stringify(g.profile)),g.profile);g.started=true;assert.equal(setRotor(g,true),false);assert.equal(g.profile.rotorOn,false);g.ended=true;assert.ok(setRotor(g,true));
});
test('legacy profiles keep exact wallet/decor/events/mode/days; a switch without ownership is rejected',()=>{
 const p=restoreProfile(JSON.stringify({version:1,wallet:183,owned:['sign'],equipped:['sign'],events:{spring:7,dragon:2,autumn:1},shop:true,days:8,tutorial:true,mode:'tianjin'}));assert.equal(p.wallet,183);assert.deepEqual(p.owned,['sign']);assert.deepEqual(p.equipped,['sign']);assert.equal(p.days,8);assert.equal(p.mode,'tianjin');assert.equal(p.events.spring,7);assert.equal(p.rotorOwned,false);assert.equal(p.rotorOn,false);assert.equal(restoreProfile('{"version":1,"rotorOn":true}').rotorOn,false);
});
test('a visible rotor paints successive sectors, finishes only batter, retracts and never adds eggs or fillings',()=>{
 const g=new Game(()=>.2);g.profile.wallet=550;buyRotor(g);g.started=true;g.newCustomer();g.addFood('batter');const p=g.cooking;assert.ok(rotorWorking(g));assert.equal(p.spread,0);tick(g,10);assert.ok(p.spread>0&&p.spread<1);assert.ok(p.rotorAngle>0);assert.equal(p.rotorDeploy,1);assert.equal(p.stage,'batter');
 tick(g,35);assert.equal(p.stage,'egg');assert.equal(p.spread,1);assert.equal(rotorWorking(g),false);assert.equal(p.ingredients.egg,undefined);assert.equal(g.inventory.stock.egg,8);tick(g,8);assert.equal(p.rotorDeploy,0);assert.equal(p.stage,'egg');assert.equal(p.flip(),false);assert.equal(p.fold(),false);assert.equal(p.bag(),false);
});
test('unowned or disabled equipment leaves batter manual; enabling next service never selects a recipe',()=>{
 for(const owned of [false,true]){const g=new Game();g.profile.rotorOwned=owned;g.profile.rotorOn=false;g.started=true;g.addFood('batter');tick(g,50);assert.equal(g.cooking.stage,'batter');assert.equal(g.cooking.spread,0);spreadBatter(g.cooking);assert.equal(g.cooking.stage,'egg');}
});
test('pause and hidden-page pause freeze blade, deployment, coverage and customer timers',()=>{
 const g=new Game(()=>.2);g.profile.wallet=550;buyRotor(g);g.started=true;g.newCustomer();g.addFood('batter');tick(g,10);g.paused=true;const before=JSON.stringify(g);tick(g,30);assert.equal(JSON.stringify(g),before);tickRotor(g,.1);assert.equal(JSON.stringify(g),before);g.paused=false;tick(g,40);assert.equal(g.cooking.stage,'egg');
});
test('tutorial always preserves manual spreading even when purchased and enabled',()=>{
 const base=new Game();base.profile.wallet=550;buyRotor(base);const g=new Game(()=>.2,base.profile,true);g.started=true;g.newCustomer();g.addFood('batter');tick(g,60);assert.equal(g.cooking.spread,0);assert.equal(g.cooking.rotorDeploy,0);assert.equal(rotorWorking(g),false);assert.deepEqual(nextAction(g).focus,['scrape']);spreadBatter(g.cooking);assert.equal(g.cooking.stage,'egg');
});
test('machine-assisted whole order still requires actual egg opening, coating, sauce, folds and service',()=>{
 const g=new Game(()=>.8);g.profile.wallet=550;buyRotor(g);g.started=true;g.newCustomer();const p=g.cooking,c=g.target;g.addFood('batter');tick(g,45);assert.equal(p.stage,'egg');for(let n=0;n<c.recipe.egg;n++)crackEgg(p,g.inventory);assert.equal(p.flip(),false);spreadEgg(p);assert.ok(p.flip());for(const [id,n] of Object.entries(c.recipe))if(!['batter','egg'].includes(id))for(let i=0;i<n;i++)g.addFood(id);p.drag(640,502,500);assert.ok(p.fold());completeFold(p);p.tick(.3);assert.ok(p.bag());assert.ok(g.serve());assert.ok(g.money>3);assert.equal(g.profile.wallet,g.money);assert.ok(g.profile.rotorOwned);
});
test('invalid delta cannot corrupt machine state; new equipment guidance is bilingual',()=>{
 const g=new Game();g.profile.wallet=550;buyRotor(g);g.started=true;g.addFood('batter');for(const dt of [NaN,Infinity,-1,0])tickRotor(g,dt);assert.equal(g.cooking.rotorAngle,0);assert.equal(g.cooking.rotorDeploy,0);setLanguage('en');try{for(const key of ['厨具升级屋','自动旋转刮板','旋转刮板工作中','免费试用台 · 只比较摊糊，不扣钱或库存',nextAction(g).detail])assert.doesNotMatch(t(key),/\p{Script=Han}/u);}finally{setLanguage('zh');}
});
