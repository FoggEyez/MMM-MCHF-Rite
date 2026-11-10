/* Original procedural vector details; no downloaded artwork or generation service. */
(function(root){
 'use strict';
 const ns='http://www.w3.org/2000/svg';let serial=0;
 const node=(tag,attrs={})=>{const e=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);return e;};
 function ornament(kind,color,accent,seed=1){
  const svg=node('svg',{viewBox:'0 0 120 120','aria-hidden':'true',focusable:'false'}),id='mischief-art-'+(++serial),defs=node('defs'),gradient=node('linearGradient',{id,x1:'0',y1:'0',x2:'1',y2:'1'});
  for(const [offset,stop]of [['0%',color],['45%',accent],['72%',color],['100%',accent]])gradient.append(node('stop',{offset,'stop-color':stop}));defs.append(gradient);svg.append(defs);
  const g=node('g',{fill:'url(#'+id+')',stroke:color,'stroke-width':.8,'stroke-linecap':'round','stroke-linejoin':'round'});svg.append(g);
  const path=(d,attrs={})=>g.append(node('path',{d,...attrs}));
  if(kind==='snow'){
   for(let arm=0;arm<6;arm++){const branch=node('g',{transform:`rotate(${arm*60} 60 60)`,fill:'none'});branch.append(node('path',{d:'M60 60V8M60 18 51 26M60 18 69 26M60 31 44 44M60 31 76 44M60 46 49 55M60 46 71 55','stroke-width':1.6}));g.append(branch);}
   g.append(node('circle',{cx:60,cy:60,r:5,fill:accent}));
  }else if(kind==='leaf'||kind==='holly'){
   for(const [x,y,angle,scale]of [[57,75,-38,1],[63,63,34,.9],[50,43,-68,.75]]){
    const leaf=node('g',{transform:`translate(${x} ${y}) rotate(${angle}) scale(${scale})`});
    const outline=kind==='holly'?'M0 0C-6-5-13-2-13-10C-8-12-17-19-16-25C-10-22-9-31-8-35C-3-34 0-42 2-47C9-41 5-30 12-29C19-25 10-18 15-15C12-9 4-10 0 0Z':'M0 0C-23-8-24-32 2-48C24-27 20-9 0 0Z';
    leaf.append(node('path',{d:outline}));leaf.append(node('path',{d:'M0-1 2-43M1-12-11-20M1-22-9-30M1-16 11-24M1-29 8-35',fill:'none','stroke-width':.8,opacity:.8}));g.append(leaf);
   }
   path('M42 109C57 92 57 64 68 31',{fill:'none','stroke-width':2});
   if(kind==='holly')for(const [cx,cy,r]of [[57,75,6],[68,80,5],[66,68,4]]){g.append(node('circle',{cx,cy,r,fill:accent}));g.append(node('circle',{cx:cx-1.7,cy:cy-2,r:r*.22,fill:'#fff',stroke:'none',opacity:.55}));}
  }else if(kind==='blossom'){
   path('M22 110C42 88 46 52 86 20',{fill:'none','stroke-width':1.8});
   for(const [cx,cy,size,angle]of [[48,72,15,14],[75,39,19,42],[31,94,8,-13]]){
    const flower=node('g',{transform:`translate(${cx} ${cy}) rotate(${angle})`});
    for(let i=0;i<5;i++)flower.append(node('ellipse',{cx:0,cy:-size*.58,rx:size*.40,ry:size*.64,transform:`rotate(${i*72})`,fill:i%2?color:accent,opacity:.9}));
    flower.append(node('circle',{cx:0,cy:0,r:size*.22,fill:'#ecd99e'}));for(let i=0;i<8;i++){const a=i*Math.PI/4;flower.append(node('circle',{cx:Math.cos(a)*size*.3,cy:Math.sin(a)*size*.3,r:.8,fill:'#fff'}));}g.append(flower);
   }
   path('M48 72C28 71 27 54 29 51C41 52 49 60 48 72M62 53C62 34 47 35 45 30C42 45 52 53 62 53');
  }else if(kind==='poppy'){
   path('M58 110C60 86 67 64 58 43',{fill:'none','stroke-width':2});
   for(let i=0;i<5;i++){const flower=node('g',{transform:`rotate(${i*72} 60 48)`});flower.append(node('path',{d:'M60 49C34 52 27 28 40 17C54 6 75 20 60 49Z',fill:accent}));flower.append(node('path',{d:'M60 47C52 36 47 31 43 26',fill:'none',stroke:color,opacity:.4}));g.append(flower);}
   g.append(node('circle',{cx:60,cy:48,r:10,fill:'#18221b',stroke:color}));for(let i=0;i<16;i++){const a=i*Math.PI/8;g.append(node('circle',{cx:60+Math.cos(a)*7,cy:48+Math.sin(a)*7,r:.9,fill:color,stroke:'none'}));}
   path('M62 85C77 70 88 74 94 73C86 90 72 94 62 85',{fill:color,opacity:.6});
  }else if(kind==='ribbon'){
   path('M39 13H80L73 54 96 106 61 88 27 106 48 54Z');path('M44 21H75M48 30H72M53 54 40 91M68 54 83 91',{fill:'none',stroke:accent,'stroke-width':2});
  }else if(kind==='egg'){
   path('M60 10C43 10 23 48 24 77C25 115 96 115 97 77C98 48 77 10 60 10Z');
   path('M30 53Q60 72 90 53M25 76Q60 92 96 76M31 91Q60 105 90 91',{fill:'none',stroke:accent,'stroke-width':3});
   for(let i=0;i<7;i++)g.append(node('circle',{cx:37+i*8,cy:41+Math.sin(i)*3,r:1.5,fill:accent,stroke:'none'}));path('M41 28Q33 40 33 47',{fill:'none',stroke:'#fff','stroke-width':2,opacity:.6});
  }else if(kind==='heart'){
   path('M60 101C48 89 17 68 18 43C18 17 46 13 60 34C74 13 102 17 102 43C103 68 72 89 60 101Z');
   path('M29 41C29 29 42 25 48 34M35 61C40 67 45 70 48 73',{fill:'none',stroke:'#fff','stroke-width':2,opacity:.5});
   for(let i=0;i<7;i++){const x=15+i*14,y=14+Math.sin(i*2)*7;g.append(node('circle',{cx:x,cy:y,r:1.2,fill:accent}));}
  }else if(kind==='pumpkin'){
   path('M60 32C30 15 10 39 17 71C22 98 43 107 60 98C80 110 104 91 105 65C106 39 86 21 65 33L71 14 58 13Z');
   path('M48 35C28 56 31 87 48 98M72 35C91 57 89 88 72 99M60 36V98',{fill:'none',stroke:accent,'stroke-width':2});
   path('M31 57 44 49 43 63ZM91 57 78 49 79 63ZM37 80 48 85 60 79 71 86 85 76 76 94 48 94Z',{fill:accent,stroke:'none'});
  }else{
   path('M60 10 72 44 108 45 80 67 90 103 60 82 30 103 40 67 12 45 48 44Z');
   path('M60 21V70M25 49 60 60 96 49M60 60 35 94M60 60 85 94',{fill:'none',stroke:'#fff',opacity:.35});
   for(let i=0;i<8;i++){const a=(i+seed%3)*Math.PI/4;g.append(node('circle',{cx:60+Math.cos(a)*51,cy:60+Math.sin(a)*51,r:i%2?1:1.7,fill:color,stroke:'none',opacity:.65}));}
  }
  return svg;
 }
 function frost(canvas,edge,color,accent,seed,strength,padding){
  const C=root.MischiefChristmasModel,w=canvas.width,h=canvas.height,ctx=canvas.getContext('2d'),horizontal=edge==='top'||edge==='bottom',length=horizontal?w:h;
  const depth=Math.min(72,(horizontal?h:w)*.25,18+strength*.5),profile={edge,roots:Math.min(24,Math.max(7,Math.round(length/25))),depth,fern:1.2,icicles:edge==='top'?Math.min(9,Math.round(w/65)):0};
  const geometry=C.geometry(profile,w,h,seed);ctx.clearRect(0,0,w,h);ctx.lineCap='round';ctx.lineJoin='round';
  for(const s of geometry.segments){ctx.strokeStyle=color;ctx.globalAlpha=.28+s.shine*.46;ctx.lineWidth=s.width;ctx.beginPath();ctx.moveTo(s.x1,s.y1);ctx.lineTo(s.x2,s.y2);ctx.stroke();if(s.shine>.75){ctx.strokeStyle='#fff';ctx.globalAlpha=.5;ctx.lineWidth=.45;ctx.beginPath();ctx.moveTo(s.x1+.7,s.y1-.6);ctx.lineTo(s.x2+.7,s.y2-.6);ctx.stroke();}}
  ctx.globalAlpha=.65;ctx.strokeStyle=color;ctx.lineWidth=1.2;ctx.beginPath();for(let i=0;i<=80;i++){const along=length*i/80,j=3+Math.sin(i*1.9+seed)*1.4,point=edge==='top'?[along,j]:edge==='bottom'?[along,h-j]:edge==='left'?[j,along]:[w-j,along];if(i)ctx.lineTo(...point);else ctx.moveTo(...point);}ctx.stroke();
  for(const ice of geometry.icicles){const gradient=ctx.createLinearGradient(ice.x,0,ice.x+ice.width,ice.length);gradient.addColorStop(0,color);gradient.addColorStop(.5,'#fff');gradient.addColorStop(1,accent);ctx.fillStyle=gradient;ctx.globalAlpha=.55;ctx.beginPath();ctx.moveTo(ice.x-ice.width,0);ctx.quadraticCurveTo(ice.x-ice.width/2,ice.length*.65,ice.x,ice.length);ctx.quadraticCurveTo(ice.x+ice.width/2,ice.length*.5,ice.x+ice.width,0);ctx.fill();}
  ctx.globalAlpha=1;
  // A hard transparent centre keeps content readable, independent of theme colors.
  if(padding>0){const x=Math.min(w*.32,padding+8),y=Math.min(h*.32,padding+8);ctx.clearRect(x,y,Math.max(0,w-2*x),Math.max(0,h-2*y));}
 }
 root.MischiefSceneArt={ornament,frost};
})(typeof window!=='undefined'?window:globalThis);
