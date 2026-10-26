import {foodLabel,getLanguage} from '../i18n.js';
export const foods = [
 ['batter','面糊','#efcf84'],['egg','鸡蛋','#ffca46'],['scallion','葱花','#74a638'],['cilantro','香菜','#397842'],['sesame','芝麻','#f6dd9c'],['sweet','甜面酱','#814127'],['chili','辣椒酱','#ce472c'],['crisp','薄脆','#e5a243'],['ham','火腿','#d97d70'],['pork','里脊','#b97945'],['sausage','烤肠','#a94d30'],['lettuce','生菜','#83ad43'],['chicken','鸡柳','#dca154']
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
 stage:Stage='empty'; ingredients:Recipe={}; spread=0; sauce=0; strokes:{x:number,y:number}[]=[]; heat=0; foldTime=0;
 add(id:Food,inventory:Inventory):string {
  if(id==='batter'){if(this.stage!=='empty')return '先完成或丢弃这一张';}
  else if(id==='egg'){if(this.stage!=='egg')return '先倒面糊，拖动刮板摊匀';if((this.ingredients.egg||0)>=2)return '最多加两个鸡蛋';}
  else if(id==='scallion'||id==='sesame'){if(this.stage!=='egg'&&this.stage!=='flipped')return '摊开饼后再撒料';}
  else if(this.stage!=='flipped')return '先加鸡蛋，用铲子翻面';
  if(id!=='egg'&&this.ingredients[id])return '这一份已经加过啦';
  if(!inventory.take(id))return '用完了，叫右侧老板补货';
  this.ingredients[id]=(this.ingredients[id]||0)+1;
  if(id==='batter')this.stage='batter';
  return `${foods.find(f=>f[0]===id)![1]}，加好了`;
 }
 drag(x:number,y:number,distance:number){if(this.stage==='batter'){this.spread=Math.min(1,this.spread+distance/1200);if(this.spread>=1)this.stage='egg';}else if(this.stage==='flipped'&&(this.ingredients.sweet||this.ingredients.chili)){this.sauce=Math.min(1,this.sauce+distance/550);this.strokes.push({x,y});if(this.strokes.length>100)this.strokes.shift();}}
 flip(){if(this.stage!=='egg'||!this.ingredients.egg)return false;this.stage='flipped';return true;}
 fold(){if(this.stage!=='flipped'||((this.ingredients.sweet||this.ingredients.chili)&&this.sauce<1))return false;this.stage='folded';this.foldTime=0;return true;}
 bag(){if(this.stage!=='folded'||this.foldTime<.65)return false;this.stage='bagged';return true;}
 tick(dt:number){if(this.stage!=='empty'&&this.stage!=='bagged')this.heat+=dt;if(this.stage==='folded')this.foldTime+=dt;}
}
export interface Customer {id:number;look:number;recipe:Recipe;patience:number;max:number;noCilantro:boolean;}
export class Game {
 inventory=new Inventory(); cooking=new Cooking(); customers:Customer[]=[]; time=180; money=0; served=0; lost=0; ratings:number[]=[]; ended=false; started=false; paused=false; next=0; serial=0; spawn=0; theftIn=15; theft:{customer:number;food:Food;remaining:number;slapped:boolean}|null=null; message='开摊啦！点击顾客接单，照着订单做一张热煎饼。';
 constructor(public random= Math.random){}
 newCustomer(){let egg=this.random()<.3?2:1;const protein=(['ham','pork','sausage','chicken'] as Food[])[Math.floor(this.random()*4)];const recipe:Recipe={batter:1,egg,sweet:1,[protein]:1};for(const id of ['scallion','sesame','crisp','lettuce','chili','cilantro'] as Food[])if(this.random()<.35)recipe[id]=1;const c={id:++this.serial,look:this.serial%3,recipe,patience:100,max:100,noCilantro:!recipe.cilantro};this.customers.push(c);if(!this.next)this.next=c.id;}
 get target(){return this.customers.find(c=>c.id===this.next)||this.customers[0];}
 serve(){if(this.cooking.stage!=='bagged'||!this.target){this.message='先折叠装袋，再点顾客交餐';return false;}const c=this.target;const correct=foods.every(([id])=>(c.recipe[id]||0)===(this.cooking.ingredients[id]||0));const quality=Math.max(0,1-Math.max(0,this.cooking.heat-65)/70);const rating=correct?Math.round(65+25*c.patience/c.max+10*quality):20;const base=8+Object.values(c.recipe).reduce((a,b)=>a+(b||0),0);const earned=correct?Math.round(base*(.8+.2*quality)):3;this.money+=earned;this.served++;this.ratings.push(rating);this.message=correct?`真香！收到 ¥${earned}，满意度 ${rating}`:'配料不对哦……只付 ¥3，注意不要香菜和双蛋';this.customers=this.customers.filter(v=>v.id!==c.id);this.next=this.customers[0]?.id||0;this.cooking=new Cooking();return correct;}
 slap(){if(!this.theft||this.theft.slapped)return false;this.theft.slapped=true;this.theft.remaining=.65;this.message='啪！小手收好，想吃得先点单！';return true;}
 tick(dt:number){if(!this.started||this.ended||this.paused)return;dt=Math.min(dt,.1);this.time=Math.max(0,this.time-dt);this.inventory.tick(dt);this.cooking.tick(dt);this.spawn-=dt;if(this.customers.length<3&&this.spawn<=0){this.newCustomer();this.spawn=9;}
 for(const c of this.customers)c.patience-=dt*(c.id===this.next?.valueOf()? .72:.38);
 const leaving=this.customers.filter(c=>c.patience<=0);this.lost+=leaving.length;for(const c of leaving)this.ratings.push(0);this.customers=this.customers.filter(c=>c.patience>0);if(!this.customers.some(c=>c.id===this.next))this.next=this.customers[0]?.id||0;
 this.theftIn-=dt;if(!this.theft&&this.theftIn<=0&&this.customers.length){const choices=(['crisp','scallion','ham'] as Food[]).filter(id=>this.inventory.stock[id]>0);if(choices.length){this.theft={customer:this.customers[0].id,food:choices[Math.floor(this.random()*choices.length)],remaining:3,slapped:false};this.message='有人伸手偷吃！快拍回去！';}this.theftIn=22+this.random()*18;}
 if(this.theft){this.theft.remaining-=dt;if(this.theft.remaining<=0){if(!this.theft.slapped){const id=this.theft.food;this.inventory.take(id,Math.min(2,this.inventory.stock[id]));this.message='哎呀，被顺走两份小料！';}this.theft=null;}}
 if(!this.time)this.ended=true;
 }
 get satisfaction(){return this.ratings.length?Math.round(this.ratings.reduce((a,b)=>a+b,0)/this.ratings.length):100;}
}
export function recipeText(c:Customer){return foods.filter(([id])=>id!=='batter'&&c.recipe[id]).map(([id,label])=>`${c.recipe[id]===2?(getLanguage()==='en'?'Double ':'双份'):''}${foodLabel(id)}`).join(' · ');}
