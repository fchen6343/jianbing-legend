export function spreadBatter(p){for(let i=0;i<=32;i++){const a=i/32*Math.PI*2;p.drag(640+Math.cos(a)*135,505+Math.sin(a)*58,30);}}

export function crackEgg(p,inventory,x=585+(p.ingredients.egg||0)%3*55,y=487){
 p.add('egg',inventory);p.beginEgg(x,y);p.pullEgg(x+60,y,inventory);p.tick(.35);
}
export function spreadEgg(p){
 // Pick up each actual yolk, then sweep the centre and both sides of the pancake.
 for(const egg of p.eggLayers){
  p.endStroke();p.drag(egg.x,egg.y,1);
  const points=[...Array.from({length:33},(_,i)=>{const a=i/32*Math.PI*2;return{x:640+Math.cos(a)*145,y:502+Math.sin(a)*63};}),...Array.from({length:17},(_,i)=>{const a=i/16*Math.PI*2;return{x:640+Math.cos(a)*73,y:502+Math.sin(a)*32};}),{x:640,y:502}];
  // Connect the pickup to the ring using short movements, like real pointer events.
  let last={x:egg.x,y:egg.y};
  for(const point of points){const count=Math.max(1,Math.ceil(Math.hypot(point.x-last.x,(point.y-last.y)*2.2)/20));for(let k=1;k<=count;k++)p.drag(last.x+(point.x-last.x)*k/count,last.y+(point.y-last.y)*k/count,20);last=point;}
  p.endStroke();
 }
}
