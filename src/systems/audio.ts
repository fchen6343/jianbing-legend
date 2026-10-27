export class Sound {
 ctx:AudioContext|null=null; muted=false; beat=0; clock=0;
 start(){this.ctx ||= new AudioContext();void this.ctx.resume();}
 tone(f=440,d=.1,volume=.035){if(!this.ctx||this.muted)return;const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(volume,this.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+d);o.connect(g).connect(this.ctx.destination);o.start();o.stop(this.ctx.currentTime+d);}
 tick(dt:number,cooking:boolean){this.clock-=dt;if(this.clock<=0){this.clock=.38;this.tone([262,330,392,440,392,330,294,330][this.beat++%8],.3,.012);if(cooking)this.tone(90+Math.random()*100,.07,.008);}}
}
