import test from 'node:test';
import assert from 'node:assert/strict';
import {Cooking,Game,Inventory,foldTargets} from '../dist/js/systems/game.js';
import {setLanguage} from '../dist/js/i18n.js';
import {spreadBatter} from './helpers.mjs';

test('a shallow circle spreads batter while preserving the circular coverage gate',()=>{
 const cooking=new Cooking();
 cooking.add('batter',new Inventory());
 for(let i=0;i<=32;i++){
  const angle=i/32*Math.PI*2;
  cooking.drag(640+42*Math.cos(angle),505+19.3*Math.sin(angle),8);
 }
 assert.equal(cooking.stage,'egg');
});

test('regrabbing the shell measures travel from the new contact and never spends twice',()=>{
 const cooking=new Cooking(), inventory=new Inventory();
 cooking.add('batter',inventory);
 spreadBatter(cooking);
 cooking.pickEgg(inventory);
 assert.ok(cooking.beginEgg(640,490));
 assert.equal(cooking.pullEgg(670,490,inventory),false);
 cooking.releaseEgg();
 assert.equal(cooking.heldEgg.open,0);
 assert.equal(cooking.pullEgg(700,490,inventory),false);
 assert.ok(cooking.beginEgg(695,470));
 assert.equal(cooking.pullEgg(698,470,inventory),false);
 assert.ok(cooking.pullEgg(651,470,inventory));
 assert.equal(cooking.pullEgg(640,470,inventory),false);
 assert.equal(inventory.stock.egg,7);
});

test('folding accepts an off-center grip and requires travel in the intended direction',()=>{
 const cooking=new Cooking();
 cooking.stage='flipped';
 assert.ok(cooking.fold());
 const edge=foldTargets[0];
 assert.ok(cooking.beginFold(edge.x-25,edge.y+25));
 assert.equal(cooking.pullFold(edge.x-45,edge.y+25),false);
 assert.equal(cooking.foldProgress,0);
 assert.ok(cooking.pullFold(edge.x+90,edge.y+44));
 assert.equal(cooking.foldStep,1);
});

test('wrong orders name missing and extra portions in both languages',()=>{
 try{
  for(const [language,expected] of [['zh',/少1份鸡蛋.*多1份香菜/],['en',/Egg ×1 missing.*Cilantro ×1 extra/i]]){
   setLanguage(language);
   const game=new Game();
   game.newCustomer();
   game.target.recipe={batter:1,egg:2};
   game.cooking.ingredients={batter:1,egg:1,cilantro:1};
   game.cooking.stage='bagged';
   assert.equal(game.serve(),false);
   assert.match(game.message,expected);
   assert.equal(game.money,3);
  }
 }finally{setLanguage('zh');}
});
