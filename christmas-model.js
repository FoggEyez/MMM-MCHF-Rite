/* Individual ice-growth programs. Geometry is deterministic; no copied corner silhouettes. */
(function(root){
 'use strict';
 const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
 function random(seed){let n=seed>>>0;return ()=>{n+=0x6D2B79F5;let t=n;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
 const profiles=[
  {name:'weather',selector:'.weather',index:0,edge:'top',roots:13,depth:42,fern:1,icicles:0,delay:0},
  {name:'forecast',selector:'.weather',index:1,edge:'top',roots:7,depth:24,fern:.55,icicles:7,delay:2.7},
  {name:'conditions',selector:'.lc-card',index:0,edge:'left',roots:8,depth:27,fern:.8,icicles:0,delay:5.8},
  {name:'calendar',selector:'.calendar',index:0,edge:'bottom',roots:11,depth:38,fern:1.2,icicles:0,delay:9.3},
  {name:'network',selector:'.hc-card',index:0,edge:'right',roots:12,depth:32,fern:.65,icicles:0,delay:11},
  {name:'music',selector:'.MMM-OnSpotify .ONSP-Base',index:0,edge:'bottom',roots:6,depth:32,fern:.8,icicles:0,delay:15}
 ];
 function state(seconds,delay=0,reduced=false){
  if(reduced)return {growth:.38,gust:0,active:false};
  const t=seconds-delay;
  if(t<0||t>=84)return {growth:0,gust:0,active:false};
  const grow=clamp(t/13),thaw=clamp((t-43)/41);
  return {growth:grow*(1-thaw*thaw),gust:Math.sin(clamp(t/10)*Math.PI)*clamp(1-t/28),active:true};
 }
 function geometry(profile,width,height,seed){
  const rnd=random(seed),segments=[],icicles=[],horizontal=['top','bottom'].includes(profile.edge),length=horizontal?width:height;
  const point=(along,depth)=>profile.edge==='top'?[along,depth]:profile.edge==='bottom'?[along,height-depth]:profile.edge==='left'?[depth,along]:[width-depth,along];
  function branch(x,y,angle,size,birth,level){
   const steps=5,step=size/steps;let ax=x,ay=y;
   for(let i=0;i<steps;i++){
    const a=angle+(rnd()-.5)*.18,bx=ax+Math.cos(a)*step,by=ay+Math.sin(a)*step;
    segments.push({x1:ax,y1:ay,x2:bx,y2:by,birth:clamp(birth+i*.045,0,.88),width:Math.max(.35,level*.52),shine:rnd()});
    if(level>0&&i%2===1)for(const side of [-1,1])branch(ax,ay,a+side*(.68+rnd()*.26),size*(.23+rnd()*.12),birth+i*.045+.045,level-1);
    ax=bx;ay=by;
   }
  }
  for(let i=0;i<profile.roots;i++){
   const along=8+(i+.25+rnd()*.5)*(length-16)/profile.roots,depth=profile.depth*(.4+rnd()*.6),p=point(along,3+rnd()*5);
   const angle={top:Math.PI/2,bottom:-Math.PI/2,left:0,right:Math.PI}[profile.edge]+(rnd()-.5)*.9;
   branch(...p,angle,depth,.05+rnd()*.32,profile.fern>.9?2:1);
  }
  for(let i=0;i<profile.icicles;i++)icicles.push({x:24+(i+rnd())*(width-48)/profile.icicles,length:9+rnd()*24,width:2+rnd()*5,birth:.2+rnd()*.45});
  return {segments,icicles,seed,width,height};
 }
 function preview(packet,now=Date.now()){
  if(!packet||packet.mode!=='christmas'||!Number.isFinite(packet.expiresAt)||packet.expiresAt<=now||packet.expiresAt>now+310000||typeof packet.nonce!=='string'||!/^[a-f0-9]{32}$/.test(packet.nonce))return null;
  return {mode:'christmas',expiresAt:packet.expiresAt,nonce:packet.nonce};
 }
 const api={clamp,random,profiles,state,geometry,preview};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MischiefChristmasModel=api;
})(typeof window!=='undefined'?window:globalThis);
