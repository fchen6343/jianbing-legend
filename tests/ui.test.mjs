import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,foods} from '../dist/js/systems/game.js';
import {nextAction,toolEnabled,ingredientStatus,insideGriddle} from '../dist/js/ui.js';

test('pause freezes the whole service, including patience, cooking, refill and theft',()=>{
 const g=new Game(()=>.2);g.started=true;g.newCustomer();g.inventory.take('egg');g.inventory.request();g.cooking.add('batter',g.inventory);g.theft={customer:g.target.id,food:'crisp',remaining:2,slapped:false};g.paused=true;
 const before=JSON.stringify(g);for(let i=0;i<50;i++)g.tick(.1);assert.equal(JSON.stringify(g),before);
 g.paused=false;g.tick(.1);assert.ok(g.time<180);assert.ok(g.inventory.refill<5);assert.ok(g.target.patience<100);assert.ok(g.cooking.heat>0);assert.ok(g.theft.remaining<2);
});

test('coaching follows a real double-egg order through spread, flip, sauce, bag and service',()=>{
 const g=new Game(()=>.2);g.newCustomer();
 assert.deepEqual(nextAction(g).focus,['food:batter']);
 g.cooking.add('batter',g.inventory);assert.deepEqual(nextAction(g).focus,['scrape']);
 g.cooking.drag(640,505,1200);assert.ok(nextAction(g).focus.includes('food:egg'));
 for(const id of ['egg','egg','scallion','sesame','cilantro'])g.cooking.add(id,g.inventory);
 g.cooking.drag(640,505,700);assert.equal(ingredientStatus(g,'egg'),'done');assert.deepEqual(nextAction(g).focus,['flip']);
 assert.ok(toolEnabled(g,'flip'));assert.ok(g.cooking.flip());
 for(const [id] of foods)if(g.target.recipe[id]&&!g.cooking.ingredients[id])g.cooking.add(id,g.inventory);
 assert.deepEqual(nextAction(g).focus,['scrape']);assert.equal(toolEnabled(g,'fold'),false);
 g.cooking.drag(640,505,550);assert.deepEqual(nextAction(g).focus,['fold']);assert.ok(g.cooking.fold());
 assert.equal(toolEnabled(g,'bag'),false);g.cooking.tick(.7);assert.deepEqual(nextAction(g).focus,['bag']);assert.ok(g.cooking.bag());
 assert.deepEqual(nextAction(g).focus,['customer:'+g.target.id]);assert.ok(g.serve());
 assert.ok(insideGriddle(640,505));assert.equal(insideGriddle(850,610),false);
});
