import {Game,Food,foods} from './systems/game.js';
export interface Rect {x:number;y:number;w:number;h:number;}
export const griddle={x:640,y:505,rx:205,ry:94};
export function insideGriddle(x:number,y:number){return ((x-griddle.x)/griddle.rx)**2+((y-griddle.y)/griddle.ry)**2<=1;}
export function stationRect(index:number):Rect{const left=index<7,n=left?index:index-7;return {x:(left?28:964)+(n%3)*96,y:418+Math.floor(n/3)*84,w:88,h:74};}
export const toolIds=['scrape','flip','fold','bag','discard'] as const;
export function toolRect(index:number):Rect{return {x:364+index*112,y:619,w:104,h:58};}
export function nextAction(g:Game){
 const p=g.cooking,c=g.target;
 if(p.stage==='empty')return {step:1,key:'倒入面糊',detail:'点击面糊壶，开始制作',focus:['food:batter'],progress:0};
 if(p.stage==='batter')return {step:1,key:'摊开煎饼',detail:'按住铁板，来回拖动摊匀',focus:['scrape'],progress:p.spread};
 if(p.stage==='egg'){
  const needed=foods.filter(([id])=>['egg','scallion','sesame'].includes(id)&&(c?.recipe[id]||0)>(p.ingredients[id]||0)).map(([id])=>'food:'+id);
  return {step:2,key:needed.length?'加入蛋与小料':'可以翻面了',detail:needed.length?'按订单加入鸡蛋、葱花和芝麻':'点击铲子，把煎饼翻过来',focus:needed.length?needed:['flip'],progress:0};
 }
 if(p.stage==='flipped'){
  const needed=foods.filter(([id])=>id!=='batter'&&(c?.recipe[id]||0)>(p.ingredients[id]||0)).map(([id])=>'food:'+id);
  const brush=Boolean(p.ingredients.sweet||p.ingredients.chili)&&p.sauce<1;
  return {step:3,key:needed.length?'补齐订单配料':brush?'刷匀酱料':'可以折叠了',detail:needed.length?'发光的食材是这张订单还缺的':brush?'按住饼面拖动，将酱料刷匀':'点击折叠，准备打包',focus:needed.length?needed:brush?['scrape']:['fold'],progress:brush?p.sauce:0};
 }
 if(p.stage==='folded')return {step:4,key:p.foldTime<.65?'正在折叠':'装进纸袋',detail:p.foldTime<.65?'稍等一下，热煎饼马上包好':'点击纸袋，准备交给顾客',focus:p.foldTime<.65?[]:['bag'],progress:Math.min(1,p.foldTime/.65)};
 return {step:5,key:'交给这位顾客',detail:'点击正在制作的顾客完成交餐',focus:g.target?['customer:'+g.target.id]:[],progress:1};
}
export function ingredientStatus(g:Game,id:Food){const expected=g.target?.recipe[id]||0,actual=g.cooking.ingredients[id]||0;return actual>expected?'extra':actual>=expected&&expected>0?'done':'needed';}
export function toolEnabled(g:Game,id:string){const p=g.cooking;return id==='discard'?p.stage!=='empty':id==='scrape'?['batter','flipped'].includes(p.stage):id==='flip'?p.stage==='egg'&&!!p.ingredients.egg:id==='fold'?p.stage==='flipped'&&(!(p.ingredients.sweet||p.ingredients.chili)||p.sauce>=1):id==='bag'?p.stage==='folded'&&p.foldTime>=.65:true;}
