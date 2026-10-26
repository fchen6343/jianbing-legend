import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {t,setLanguage,foodLabel,getLanguage} from '../dist/js/i18n.js';
import {Game,foods,recipeText} from '../dist/js/systems/game.js';

test('switching language translates active messages, all ingredients and a full double-egg order',()=>{
 const game=new Game(()=>.2);game.newCustomer();
 const message=game.message;
 setLanguage('en');
 try{
  assert.equal(getLanguage(),'en');
  assert.equal(t('真香！收到 ¥18，满意度 95'),'Delicious! Earned ¥18 · Rating 95');
  assert.equal(t('¥ 18   ·   120 秒   ·   满意 95'),'¥ 18 · 120s · Rating 95');
  for(const [id,label] of foods){
   assert.doesNotMatch(foodLabel(id),/\p{Script=Han}/u);
   assert.equal(t(label+'，加好了'),foodLabel(id)+' added');
   assert.equal(t(label+' 8'),foodLabel(id)+' 8');
  }
  assert.doesNotMatch(t(game.message),/\p{Script=Han}/u);
  assert.match(recipeText(game.target),/Double Egg/);
  assert.doesNotMatch(recipeText(game.target),/\p{Script=Han}/u);
  setLanguage('zh');
  assert.equal(t(message),message);
  assert.match(recipeText(game.target),/双份鸡蛋/);
  assert.equal(game.message,message);
 }finally{setLanguage('zh');}
});

test('Pages output matches the offline game and has an independent bilingual entry point',()=>{
 const html=fs.readFileSync('docs/index.html','utf8');
 assert.equal(html,fs.readFileSync('play.html','utf8'));
 assert.match(html,/id="language"/);
 assert.match(html,/data:image\/png;base64,/);
 assert.doesNotMatch(html,/<script[^>]+src=/);
 assert.doesNotMatch(html,/^import .+from /m);
 assert.ok(fs.existsSync('docs/.nojekyll'));
});
