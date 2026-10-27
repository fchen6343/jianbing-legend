import {Profile,freshProfile,patienceMultiplier,rewardService} from './progress.js';
import {foodLabel,getLanguage} from '../i18n.js';
export const foods = [
 ['batter','面糊','#efcf84'],['egg','鸡蛋','#ffca46'],['scallion','葱花','#74a638'],['cilantro','香菜','#397842'],['sesame','芝麻','#f6dd9c'],['sweet','甜面酱','#814127'],['chili','辣椒酱','#ce472c'],['crisp','果篦儿','#e5a243'],['ham','火腿','#d97d70'],['pork','里脊','#b97945'],['sausage','烤肠','#a94d30'],['lettuce','生菜','#83ad43'],['chicken','鸡柳','#dca154'],['youtiao','果子','#dba751']
] as const;
export type Food = typeof foods[number][0];
export type Recipe = Partial<Record<Food,number>>;
export type Stage='empty'|'batter'|'egg'|'flipped'|'folded'|'bagged';
export class Inventory {
 stock=Object.fromEntries(foods.map(([id])=>[id,8])) as Record<Food,number>;
 refill=0;
 take(id:Food,n=1){if(this.stock[id]<n)return false;this.stock[id]-=n;return true;}
 request(){if(this.refill || !Object.values(this.stock).some(n=>n<8))return false;this.refill=5;return true;}
 tick(dt:number){if(this.refill>0){this.refill=Math.max(0,this.refill-dt);if(!this.refill)for(const [id] of foods)this.stock[id]=8;}}
}
export class Cooking {
 stage:Stage='empty'; ingredients:Recipe={}; underside:Recipe={}; eggSpread=0; spread=0; sauce=0; strokes:{x:number,y:number,move?:boolean}[]=[]; strokeBreak=true; heat=0; foldTime=0;
 add(id:Food,inventory:Inventory):string {
  if(id==='batter'){if(this.stage!=='empty')return '先完成或丢弃这一张';}
  else if(id==='egg'){if(this.stage!=='egg')return '先倒面糊，拖动刮板摊匀';}
  else if(id==='scallion'||id==='sesame'||id==='cilantro'){if(this.stage!=='egg'&&this.stage!=='flipped')return '摊开饼后再撒料';}
  else if(this.stage!=='flipped')return '先加鸡蛋，用铲子翻面';
  if((this.ingredients[id]||0)>=5)return '每种最多五份';
  if(!inventory.take(id))return '用完了，叫右侧老板补货';
  this.ingredients[id]=(this.ingredients[id]||0)+1;
  if(id==='batter')this.stage='batter';
  if(id==='egg')this.eggSpread=0;
  if(this.stage==='egg')this.underside[id]=(this.underside[id]||0)+1;
  return `${foods.find(f=>f[0]===id)![1]}，加好了`;
 }
 drag(x:number,y:number,distance:number){if(this.stage==='batter'){this.spread=Math.min(1,this.spread+distance/1200);if(this.spread>=1)this.stage='egg';}else if(this.stage==='egg'&&this.ingredients.egg){this.eggSpread=Math.min(1,this.eggSpread+distance/700);}else if(this.stage==='flipped'&&(this.ingredients.sweet||this.ingredients.chili)){this.sauce=Math.min(1,this.sauce+distance/550);this.strokes.push({x,y,move:this.strokeBreak});this.strokeBreak=false;if(this.strokes.length>100)this.strokes.shift();}}
 flip(){if(this.stage!=='egg'||!this.ingredients.egg||this.eggSpread<1)return false;this.stage='flipped';return true;}
 fold(){if(this.stage!=='flipped'||((this.ingredients.sweet||this.ingredients.chili)&&this.sauce<1))return false;this.stage='folded';this.foldTime=0;return true;}
 bag(){if(this.stage!=='folded'||this.foldTime<.65)return false;this.stage='bagged';this.foldTime=0;return true;}
 tick(dt:number){if(this.stage!=='empty'&&this.stage!=='bagged')this.heat+=dt;if(this.stage==='folded'||this.stage==='bagged')this.foldTime+=dt;}
}
export interface Customer {id:number;look:number;recipe:Recipe;patience:number;max:number;noCilantro:boolean;}
export class Game {
 inventory=new Inventory(); cooking=new Cooking(); customers:Customer[]=[]; time=180; money=0; served=0; lost=0; ratings:number[]=[]; ended=false; started=false; paused=false; next=0; serial=0; spawn=0; theftIn=15; theft:{customer:number;food:Food;remaining:number;slapped:boolean;reach?:number}|null=null; message='开摊啦！点击顾客接单，照着订单做一张热煎饼。';
 constructor(public random=Math.random,public profile:Profile=freshProfile(),public tutorial=false){}
 get availableFoods(){return foods.filter(([id])=>this.profile.mode!=='tianjin'||['batter','egg','scallion','cilantro','sweet','chili','crisp','youtiao'].includes(id));}
 addFood(id:Food){if(!this.availableFoods.some(f=>f[0]===id))return '天津模式不提供这种配料';const message=this.cooking.add(id,this.inventory);return this.profile.mode==='tianjin'?message.replace('薄脆','果篦儿'):message;}
 newCustomer(){const egg=this.random()<.3?2:1;const recipe:Recipe={batter:1,egg,sweet:1};
 if(this.profile.mode==='tianjin'){recipe[this.random()<.5?'youtiao':'crisp']=this.random()<.3?2:1;for(const id of ['scallion','cilantro','chili'] as Food[])if(this.random()<.4)recipe[id]=1;}
 else{const protein=(['ham','pork','sausage','chicken'] as Food[])[Math.floor(this.random()*4)];recipe[protein]=this.random()<.2?2:1;for(const id of ['scallion','sesame','crisp','lettuce','chili','cilantro'] as Food[])if(this.random()<.35)recipe[id]=this.random()<.15?3:1;}
 const max=100*patienceMultiplier(this.profile);const c={id:++this.serial,look:this.serial%3,recipe:this.tutorial?{batter:1,egg:2,scallion:1,sweet:1,crisp:1}:recipe,patience:max,max,noCilantro:!recipe.cilantro};if(this.tutorial)c.noCilantro=true;this.customers.push(c);if(!this.next)this.next=c.id;}

 get target(){return this.customers.find(c=>c.id===this.next)||this.customers[0];}
 serve(){if(this.cooking.stage!=='bagged'||!this.target){this.message='先折叠装袋，再点顾客交餐';return false;}const c=this.target;const correct=foods.every(([id])=>(c.recipe[id]||0)===(this.cooking.ingredients[id]||0));const quality=Math.max(0,1-Math.max(0,this.cooking.heat-65)/70);const rating=correct?Math.round(65+25*c.patience/c.max+10*quality):20;const base=8+Object.values(c.recipe).reduce((a,b)=>a+(b||0),0);const earned=correct?Math.round(base*(.8+.2*quality)):3;if(!this.tutorial){this.money+=earned;rewardService(this.profile,earned,correct);}else if(correct)this.profile.tutorial=true;this.served++;this.ratings.push(rating);this.message=this.tutorial?(correct?'完成练习，准备正式开摊！':'配料不对哦……请清空铁板重试'):correct?`真香！收到 ¥${earned}，满意度 ${rating}`:'配料不对哦……只付 ¥3，注意不要香菜和双蛋';this.customers=this.customers.filter(v=>v.id!==c.id);this.next=this.customers[0]?.id||0;this.cooking=new Cooking();return correct;}
 slap(){if(!this.theft||this.theft.slapped)return false;this.theft.reach=Math.min(1,(3-this.theft.remaining)/1.1);this.theft.slapped=true;this.theft.remaining=.65;this.message='啪！小手收好，想吃得先点单！';return true;}
 tick(dt:number){if(!this.started||this.ended||this.paused)return;dt=Math.min(dt,.1);if(this.tutorial){this.inventory.tick(dt);this.cooking.tick(dt);if(!this.customers.length)this.newCustomer();return;}this.time=Math.max(0,this.time-dt);this.inventory.tick(dt);this.cooking.tick(dt);this.spawn-=dt;if(this.customers.length<(this.profile.shop?5:3)&&this.spawn<=0){this.newCustomer();this.spawn=this.profile.shop?5:9;}
 for(const c of this.customers)c.patience-=dt*(c.id===this.next?.valueOf()? .72:.38);
 const leaving=this.customers.filter(c=>c.patience<=0);this.lost+=leaving.length;for(const c of leaving)this.ratings.push(0);this.customers=this.customers.filter(c=>c.patience>0);if(!this.customers.some(c=>c.id===this.next))this.next=this.customers[0]?.id||0;
 this.theftIn-=dt;if(!this.theft&&this.theftIn<=0&&this.customers.length){const choices=(this.profile.mode==='tianjin'?['crisp','scallion','youtiao'] as Food[]:['crisp','scallion','ham'] as Food[]).filter(id=>this.inventory.stock[id]>0);if(choices.length){this.theft={customer:this.customers[0].id,food:choices[Math.floor(this.random()*choices.length)],remaining:3,slapped:false};this.message='有人伸手偷吃！快拍回去！';}this.theftIn=22+this.random()*18;}
 if(this.theft){this.theft.remaining-=dt;if(this.theft.remaining<=0){if(!this.theft.slapped){const id=this.theft.food;this.inventory.take(id,Math.min(2,this.inventory.stock[id]));this.message='哎呀，被顺走两份小料！';}this.theft=null;}}
 if(!this.time)this.ended=true;
 }
 get satisfaction(){return this.ratings.length?Math.round(this.ratings.reduce((a,b)=>a+b,0)/this.ratings.length):100;}
}
export function recipeText(c:Customer){return foods.filter(([id])=>id!=='batter'&&c.recipe[id]).map(([id,label])=>`${foodLabel(id)} ×${c.recipe[id]}`).join(' · ');}
