export type Festival='spring'|'dragon'|'autumn';
export type Mode='classic'|'tianjin';
export interface Profile {version:1;wallet:number;shop:boolean;owned:string[];equipped:string[];festival:Festival;events:Record<Festival,number>;mode:Mode;days:number;tutorial:boolean;rotorOwned:boolean;rotorOn:boolean;}
export const decorations=[
 {id:'sign',zh:'手写招牌',en:'Hand-painted sign',cost:35,charm:2,festival:''},
 {id:'plant',zh:'桌边绿植',en:'Counter plants',cost:60,charm:3,festival:''},
 {id:'awning',zh:'暖色遮阳棚',en:'Warm canvas awning',cost:100,charm:5,festival:''},
 {id:'spring',zh:'春节限定 · 红灯笼',en:'Spring Festival · Lanterns',cost:45,charm:4,festival:'spring'},
 {id:'dragon',zh:'端午限定 · 粽叶挂饰',en:'Dragon Boat · Leaf charms',cost:45,charm:4,festival:'dragon'},
 {id:'autumn',zh:'中秋限定 · 月兔灯',en:'Mid-Autumn · Moon lantern',cost:45,charm:4,festival:'autumn'},
 {id:'spring-reward',zh:'春节奖励 · 福字',en:'Spring reward · Fortune',cost:0,charm:3,festival:'spring'},
 {id:'dragon-reward',zh:'端午奖励 · 彩绳',en:'Dragon Boat reward · Ribbons',cost:0,charm:3,festival:'dragon'},
 {id:'autumn-reward',zh:'中秋奖励 · 星灯',en:'Mid-Autumn reward · Stars',cost:0,charm:3,festival:'autumn'}
] as const;
export function freshProfile():Profile{return {version:1,wallet:0,shop:false,owned:[],equipped:[],festival:'spring',events:{spring:0,dragon:0,autumn:0},mode:'classic',days:1,tutorial:false,rotorOwned:false,rotorOn:false};}
export function restoreProfile(raw:string|null):Profile{const p=freshProfile();try{const v=JSON.parse(raw||'null');if(!v||v.version!==1)return p;const n=(x:unknown)=>typeof x==='number'&&Number.isFinite(x)?Math.min(1e8,Math.max(0,Math.floor(x))):0;p.wallet=n(v.wallet);p.rotorOwned=v.rotorOwned===true;p.rotorOn=p.rotorOwned&&v.rotorOn===true;p.shop=v.shop===true;p.days=Math.max(1,n(v.days));p.tutorial=v.tutorial===true;p.mode=v.mode==='tianjin'?'tianjin':'classic';p.festival=['spring','dragon','autumn'].includes(v.festival)?v.festival:'spring';p.owned=Array.isArray(v.owned)?[...new Set<string>(v.owned.filter((id:unknown)=>decorations.some(d=>d.id===id)))]:[];p.equipped=Array.isArray(v.equipped)?[...new Set<string>(v.equipped.filter((id:string)=>p.owned.includes(id)))]:[];for(const f of ['spring','dragon','autumn'] as Festival[])p.events[f]=n(v.events?.[f]);return p;}catch{return p;}}
export function charm(p:Profile){return decorations.filter(d=>p.equipped.includes(d.id)).reduce((sum,d)=>sum+d.charm,0);}
export function patienceMultiplier(p:Profile){return 1+Math.min(50,charm(p)*2)/100;}
export function purchase(p:Profile,id:string){const d=decorations.find(d=>d.id===id);if(!d||p.owned.includes(id)||d.id.endsWith('-reward')||p.wallet<d.cost||(d.festival&&d.festival!==p.festival))return false;p.wallet-=d.cost;p.owned.push(id);p.equipped.push(id);return true;}
export function openShop(p:Profile){if(p.shop||p.wallet<180)return false;p.wallet-=180;p.shop=true;return true;}
export function rewardService(p:Profile,earned:number,correct:boolean){p.wallet+=earned;if(correct){p.events[p.festival]++;const id=p.festival+'-reward';if(p.events[p.festival]>=6&&!p.owned.includes(id)){p.owned.push(id);p.equipped.push(id);}}}
