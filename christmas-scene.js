/* global MischiefChristmasModel */
(function(root){
 'use strict';
 const M=MischiefChristmasModel;
 class ChristmasScene{
  constructor(owner){
   this.owner=owner;this.tiles=[];this.elapsed=0;this.last=performance.now();this.waveStart=-1;this.cycle=0;this.paused=false;this.stopped=false;
   this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
   this.motionChange=()=>{this.measure();this.triggerBreeze();};this.reduced.addEventListener('change',this.motionChange);
   this.texture=new Image();this.texture.onload=()=>{this.tiles.forEach(t=>this.material(t));this.draw();};this.texture.src=owner.file('assets/frost-study-atlas-v1.png');
   this.measure();this.nextBreeze=18000;this.tick();
  }
  options(){return {strength:this.owner.number('decorOpacity',0,85,55)/100,density:this.owner.number('frostStrength',20,100,68)/100};}
  measure(){
   if(this.stopped)return;
   for(const [index,profile]of (this.owner.config.frostTargets.length?this.owner.config.frostTargets:M.profiles).entries()){
    const host=document.querySelectorAll(profile.selector)[profile.index];if(!host)continue;
    let tile=this.tiles.find(t=>t.profile.name===profile.name);
    if(tile&&tile.host!==host){tile.canvas.remove();tile.host.classList.remove('winter-glass');this.tiles=this.tiles.filter(t=>t!==tile);tile=null;}
    if(!tile){
     const canvas=document.createElement('canvas');canvas.className='winter-freeze';canvas.setAttribute('aria-hidden','true');host.classList.add('winter-glass');host.prepend(canvas);
     tile={host,canvas,profile,index,mask:document.createElement('canvas'),material:document.createElement('canvas')};this.tiles.push(tile);
    }
    const r=host.getBoundingClientRect(),w=Math.round(r.width+28),h=Math.round(r.height+28);if(w<32||h<32)continue;
    if(tile.canvas.width!==w||tile.canvas.height!==h){
     for(const c of [tile.canvas,tile.mask,tile.material]){c.width=w;c.height=h;}
     tile.geometry=M.geometry(profile,w,h,4171+index*1093+this.cycle*7919);this.material(tile);
    }
   }
   // Remove canvases whose cards were removed/replaced. No observer on our canvas pixels.
   this.tiles=this.tiles.filter(tile=>{if(tile.host.isConnected)return true;tile.canvas.remove();return false;});
   this.draw();
  }
  material(tile){
   tile.lastGrowth=null;
   const ctx=tile.material.getContext('2d'),w=tile.material.width,h=tile.material.height,rnd=M.random(tile.geometry?.seed||1);
   const color=ctx.createLinearGradient(0,0,w,h);color.addColorStop(0,'#e1f2f5');color.addColorStop(.45,'#91b9c7');color.addColorStop(1,'#e9f0ec');ctx.fillStyle=color;ctx.fillRect(0,0,w,h);
   if(!this.texture.complete||!this.texture.naturalWidth)return;
   // Sample small photographic crystal patches as material, never stamp whole corners.
   const unit=this.texture.naturalWidth/2;
   ctx.globalAlpha=.48;
   for(let y=0;y<h;y+=38)for(let x=0;x<w;x+=42){const variant=Math.floor(rnd()*4),sx=(variant%2)*unit+8+rnd()*unit*.45,sy=Math.floor(variant/2)*unit+8+rnd()*unit*.10;ctx.drawImage(this.texture,sx,sy,58,45,x,y,43,39);}
   ctx.globalAlpha=1;
  }
  triggerBreeze(){this.waveStart=this.elapsed;this.nextBreeze=this.elapsed+this.owner.number('breezeEveryMinutes',2,15,4)*60000;this.cycle++;
   for(const t of this.tiles){t.geometry=M.geometry(t.profile,t.canvas.width,t.canvas.height,4171+t.index*1093+this.cycle*7919);this.material(t);}this.draw();
  }
  tick(){
   clearTimeout(this.timer);if(this.stopped||this.paused||document.hidden)return;
   const now=performance.now();this.elapsed+=now-this.last;this.last=now;
   if(this.elapsed>=this.nextBreeze)this.triggerBreeze();
   const age=this.waveStart<0?-100:(this.elapsed-this.waveStart)/1000;
   if(this.reduced.matches||age>=0&&age<102)this.draw();
   this.timer=setTimeout(()=>this.tick(),!this.reduced.matches&&age>=0&&age<102?125:1000);
  }
  draw(){
   if(this.stopped)return;const age=this.waveStart<0?-100:(this.elapsed-this.waveStart)/1000,options=this.options();
   for(const tile of this.tiles){
    if(!tile.geometry)continue;
    const state=M.state(age,tile.profile.delay,this.reduced.matches),amount=state.growth*options.density,mask=tile.mask.getContext('2d'),ctx=tile.canvas.getContext('2d'),g=tile.geometry,w=tile.canvas.width,h=tile.canvas.height;
    if(tile.lastGrowth===amount&&state.gust<=.01)continue;tile.lastGrowth=amount;
    ctx.clearRect(0,0,w,h);mask.clearRect(0,0,w,h);if(amount<=0)continue;
    mask.lineCap='round';mask.lineJoin='round';
    // Branch tips actually advance along individual crystal skeletons; no whole-layer fade.
    for(const s of g.segments){const progress=M.clamp((amount-s.birth)/.17);if(!progress)continue;mask.strokeStyle='rgba(255,255,255,'+(.35+s.shine*.55)+')';mask.lineWidth=s.width*(.7+progress*.5);mask.beginPath();mask.moveTo(s.x1,s.y1);mask.lineTo(s.x1+(s.x2-s.x1)*progress,s.y1+(s.y2-s.y1)*progress);mask.stroke();}
    const edge=tile.profile.edge;
    // Thin irregular ice lip, heavier on the forecast and quieter on smaller tiles.
    mask.strokeStyle='rgba(255,255,255,'+(amount*.65)+')';mask.lineWidth=2+amount*(tile.profile.icicles?6:2);mask.beginPath();
    for(let i=0;i<=32;i++){const a=i/32,j=2+Math.sin(i*1.7+tile.index)*1.3,p=edge==='top'?[a*w,12+j]:edge==='bottom'?[a*w,h-12-j]:edge==='left'?[12+j,a*h]:[w-12-j,a*h];if(i)mask.lineTo(...p);else mask.moveTo(...p);}mask.stroke();
    for(const ice of g.icicles){const progress=M.clamp((amount-ice.birth)/.3);if(!progress)continue;const y=12,tip=y+ice.length*progress;mask.fillStyle='rgba(255,255,255,.78)';mask.beginPath();mask.moveTo(ice.x-ice.width,y);mask.quadraticCurveTo(ice.x-ice.width*.4,tip-4,ice.x,tip);mask.quadraticCurveTo(ice.x+ice.width*.3,tip-5,ice.x+ice.width,y);mask.fill();}
    // A little light catches mature crystals as the front passes.
    if(!this.reduced.matches&&state.gust>.1){for(let i=0;i<2;i++){const s=g.segments[(Math.floor(age*3)+i*131+tile.index*31)%g.segments.length];if(s&&amount>s.birth+.1){mask.fillStyle='rgba(255,255,255,.9)';mask.fillRect(s.x2-.6,s.y2-.6,1.2,1.2);}}}
    ctx.drawImage(tile.material,0,0);ctx.globalCompositeOperation='destination-in';ctx.drawImage(tile.mask,0,0);ctx.globalCompositeOperation='source-over';
    tile.canvas.style.opacity=String(Math.min(.95,options.strength*1.55));tile.canvas.dataset.growth=amount.toFixed(3);tile.canvas.dataset.treatment=tile.profile.name;
   }
  }
  pause(value){if(this.stopped)return;if(value&&!this.paused){this.elapsed+=performance.now()-this.last;clearTimeout(this.timer);}this.paused=value;if(!value){this.last=performance.now();this.tick();}}
  stop(){this.stopped=true;clearTimeout(this.timer);this.reduced.removeEventListener('change',this.motionChange);for(const t of this.tiles){t.canvas.remove();t.host.classList.remove('winter-glass');}this.tiles=[];}
 }
 root.HolidayChristmasScene=ChristmasScene;
})(window);
