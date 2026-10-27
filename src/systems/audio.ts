export type Cue='egg'|'crisp'|'pour'|'sprinkle'|'flip'|'fold'|'bag'|'coin'|'error'|'slap';
// All sounds are generated locally: filtered noise, envelopes and resonant tones.
export class Sound {
 ctx:AudioContext|null=null; private silent=false; beat=0;clock=0;
 private voices=new Set<AudioScheduledSourceNode>();
 private noise:AudioBuffer|null=null;private sizzle:AudioBufferSourceNode|null=null;private heatGain:GainNode|null=null;private heatFilter:BiquadFilterNode|null=null;
 get muted(){return this.silent;}
 set muted(value:boolean){this.silent=value;if(value){this.activity(false);for(const voice of this.voices){try{voice.stop();}catch{}voice.disconnect();}this.voices.clear();}}
 start(){try{if(!this.ctx&&typeof AudioContext!=='undefined')this.ctx=new AudioContext();if(this.ctx?.state==='suspended')void this.ctx.resume().catch(()=>{});}catch{/* Cooking remains playable without audio support. */}}
 tone(f=440,d=.1,volume=.035,delay=0){const ctx=this.ctx;if(!ctx||this.muted)return;const o=ctx.createOscillator(),g=ctx.createGain(),at=ctx.currentTime+delay;o.type='triangle';o.frequency.setValueAtTime(f,at);g.gain.setValueAtTime(.0001,at);g.gain.linearRampToValueAtTime(Math.min(.12,volume),at+.006);g.gain.exponentialRampToValueAtTime(.0001,at+d);o.connect(g).connect(ctx.destination);this.voices.add(o);o.onended=()=>{this.voices.delete(o);o.disconnect();g.disconnect();};o.start(at);o.stop(at+d+.01);}
 private noiseBuffer(){const ctx=this.ctx!;if(!this.noise){this.noise=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);const data=this.noise.getChannelData(0);let previous=0;for(let i=0;i<data.length;i++){previous=previous*.12+(Math.random()*2-1)*.88;data[i]=previous;}}return this.noise;}
 private burst(duration:number,frequency:number,volume:number,delay=0,band=false){const ctx=this.ctx;if(!ctx||this.muted)return;const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain(),at=ctx.currentTime+delay;src.buffer=this.noiseBuffer();filter.type=band?'bandpass':'highpass';filter.frequency.value=frequency;filter.Q.value=.7;gain.gain.setValueAtTime(.0001,at);gain.gain.linearRampToValueAtTime(volume,at+.008);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);src.connect(filter).connect(gain).connect(ctx.destination);this.voices.add(src);src.onended=()=>{this.voices.delete(src);src.disconnect();filter.disconnect();gain.disconnect();};src.start(at);src.stop(at+duration+.015);}
 play(cue:Cue){if(this.muted||!this.ctx)return;
 switch(cue){
 case 'egg':this.burst(.06,1900,.075,.46);this.tone(710,.045,.025,.46);this.burst(.23,550,.055,.54,true);break;
 case 'crisp':for(let n=0;n<4;n++)this.burst(.045+n*.015,2400+n*500,.06-n*.009,.4+n*.055);break;
 case 'pour':this.burst(.45,380,.07,0,true);break;
 case 'sprinkle':for(let n=0;n<3;n++)this.burst(.055,2700,.025,n*.045);break;
 case 'flip':this.burst(.15,850,.035,0,true);this.tone(1800,.07,.018,.1);break;
 case 'fold':this.burst(.28,750,.035,0,true);this.burst(.16,1050,.025,.2,true);break;
 case 'bag':this.burst(.36,1700,.055,0,true);this.burst(.18,3000,.035,.16);break;
 case 'coin':this.tone(1568,.2,.03);this.tone(2093,.28,.023,.075);this.tone(2637,.17,.013,.14);break;
 case 'slap':this.burst(.1,550,.08,0,true);break;
 case 'error':this.tone(160,.13,.025);break;
 }
 }
 activity(cooking:boolean,dragging=false,sauce=false){const ctx=this.ctx;if(!ctx)return;if(!cooking||this.muted){if(this.sizzle){this.sizzle.stop();this.sizzle.disconnect();this.heatFilter?.disconnect();this.heatGain?.disconnect();this.sizzle=null;this.heatGain=null;this.heatFilter=null;}return;}
 if(!this.sizzle){const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();src.buffer=this.noiseBuffer();src.loop=true;filter.type='highpass';filter.frequency.value=2600;gain.gain.value=0;src.connect(filter).connect(gain).connect(ctx.destination);src.start();this.sizzle=src;this.heatGain=gain;this.heatFilter=filter;}
 this.heatFilter!.frequency.setTargetAtTime(dragging?(sauce?900:1500):2600,ctx.currentTime,.08);this.heatGain!.gain.setTargetAtTime(dragging?.026:.011,ctx.currentTime,.08);
 }
 tick(dt:number,cooking:boolean,dragging=false,sauce=false){this.activity(cooking,dragging,sauce);this.clock-=dt;if(this.clock<=0){this.clock=.6;this.tone([262,330,392,440,392,330,294,330][this.beat++%8],.25,.004);}}
}
