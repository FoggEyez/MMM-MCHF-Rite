/* Cached procedural details and compositor animations; no continuous JS drawing loop. */
(function(root){
 'use strict';
 class SceneRenderer{
  constructor(host){this.host=host;this.items=[];this.signature='';this.frame=null;this.reduced=window.matchMedia('(prefers-reduced-motion: reduce)');this.onMotion=()=>this.update(this.raw,this.date);this.onResize=()=>this.scheduleMeasure();this.onVisibility=()=>this.pause(document.hidden||this.moduleSuspended);this.reduced.addEventListener('change',this.onMotion);window.addEventListener('resize',this.onResize);document.addEventListener('visibilitychange',this.onVisibility);this.resizeObserver=new ResizeObserver(this.onResize);this.mutationObserver=new MutationObserver(records=>{if(records.some(r=>!this.host.contains(r.target)))this.scheduleMeasure();});this.mutationObserver.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','hidden']});}
  update(raw={},date){this.raw=raw;this.date=date;const now=date||new Date(Date.now()),holiday=root.MirrorHolidays.choose(now,raw.holidayMode||'auto',raw.timeZone||undefined),legacy=raw.holidayMode&& !['auto','off'].includes(raw.holidayMode),config={...raw};if(raw.holidayMode==='off')config.sceneMode='off';if(legacy){config.sceneMode='calendar';config.useBuiltInCalendar=true;}
   const selected=root.MischiefSceneModel.select(config,now,holiday,this.reduced.matches);this.selected=selected;const signature=JSON.stringify([selected.scene,selected.motion,selected.config.targets,selected.config.clearZones,selected.config.readabilityPadding]);
   this.host.className='mischief-scene-overlay motion-'+selected.motion;this.host.hidden=!selected.scene;this.host.dataset.scene=selected.scene?.id||'none';this.host.dataset.reason=selected.reason;
   if(signature!==this.signature){this.signature=signature;this.host.replaceChildren();this.items=[];this.resizeObserver.disconnect();if(selected.scene)this.build();}else this.scheduleMeasure();
   this.pause(document.hidden||this.moduleSuspended);
  }
  build(){const {scene,config}=this.selected;this.host.style.setProperty('--scene-color',scene.color);this.host.style.setProperty('--scene-accent',scene.accentColor);this.host.style.setProperty('--scene-strength',scene.strength/100);this.host.style.setProperty('--scene-speed',scene.speed+'s');
   for(const target of config.targets.filter(t=>t.enabled)){const frame=document.createElement('div');frame.className='mischief-target effect-'+(target.effect==='inherit'?scene.effect:target.effect)+' edge-'+target.edge;frame.style.setProperty('--target-strength',target.strength/100);frame.dataset.target=target.name;const effect=target.effect==='inherit'?scene.effect:target.effect;
    if(effect==='none')continue;
    if(effect==='frost'){const canvas=document.createElement('canvas');canvas.className='mischief-frost';frame.append(canvas);}
    if(['garland','ornament','glow'].includes(effect)){const ornament=document.createElement('div');ornament.className='mischief-ornament';ornament.append(root.MischiefSceneArt.ornament(scene.ornament,scene.color,scene.accentColor,this.items.length));frame.append(ornament);if(effect==='garland'){const pair=ornament.cloneNode(true);pair.classList.add('ornament-pair');frame.append(pair);}}
    if(effect==='glow'){const light=document.createElement('div');light.className='mischief-edge-light';frame.prepend(light);}
    if(effect==='garland'){const stem=document.createElement('div');stem.className='mischief-stem';frame.append(stem);}
    this.host.append(frame);this.items.push({frame,target,host:null,lastSize:''});
   }
   if(scene.particle!=='none')for(let i=0;i<scene.particleCount;i++){const p=document.createElement('div');p.className='mischief-drift particle-'+scene.particle;p.style.left=(i%2?96-(i%3)*2:1+(i%3)*2)+'%';p.style.setProperty('--duration',scene.speed*(.8+i%4*.18)+'s');p.style.setProperty('--delay',(-i*5.7)+'s');p.style.setProperty('--size',(9+i%4*3)+'px');p.style.setProperty('--sway',((i%2?-1:1)*(12+i%3*8))+'px');if(scene.particle!=='confetti')p.append(root.MischiefSceneArt.ornament(({snow:'snow',leaf:'leaf',petal:'blossom',spark:'star'})[scene.particle],scene.color,scene.accentColor,i));this.host.append(p);}
   this.measure();
  }
  scheduleMeasure(){if(this.frame||!this.selected?.scene||this.suspended||document.hidden)return;this.frame=requestAnimationFrame(()=>{this.frame=null;this.measure();});}
  measure(){if(!this.selected?.scene)return;const {scene,config}=this.selected,w=innerWidth,h=innerHeight;
   const measurements=this.items.map(item=>{let host;try{host=document.querySelectorAll(item.target.selector)[item.target.index];}catch{}if(host===this.host||host&&this.host.contains(host))host=null;return {item,host,rect:host?.getBoundingClientRect()};});
   for(const {item,host,rect:r}of measurements){item.frame.hidden=!r||r.width<=0||r.height<=0||!host.isConnected;if(item.frame.hidden)continue;
    if(item.host!==host){if(item.host)this.resizeObserver.unobserve(item.host);this.resizeObserver.observe(host);item.host=host;}
    const padding=14,box={left:Math.round(r.left-padding),top:Math.round(r.top-padding),width:Math.round(r.width+padding*2),height:Math.round(r.height+padding*2)};
    const position=JSON.stringify(box);if(position!==item.lastPosition){Object.assign(item.frame.style,{left:box.left+'px',top:box.top+'px',width:box.width+'px',height:box.height+'px'});item.lastPosition=position;}
    const canvas=item.frame.querySelector('canvas'),size=box.width+'x'+box.height;
    if(canvas&&size!==item.lastSize){canvas.width=Math.min(1200,box.width);canvas.height=Math.min(600,box.height);root.MischiefSceneArt.frost(canvas,item.target.edge,scene.color,scene.accentColor,4171+this.items.indexOf(item)*311,scene.strength,config.readabilityPadding);item.lastSize=size;}
   }
   const rects=config.clearZones.filter(z=>z.enabled).map(z=>`<rect x="${(w*z.x/100).toFixed(1)}" y="${(h*z.y/100).toFixed(1)}" width="${(w*z.width/100).toFixed(1)}" height="${(h*z.height/100).toFixed(1)}" fill="black"/>`).join('');
   const mask=rects?'url("data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="white"/>${rects}</svg>`)+'")':'none';
   if(mask!==this.lastMask){this.host.style.maskImage=mask;this.host.style.webkitMaskImage=mask;this.lastMask=mask;}
  }
  setSuspended(value){this.moduleSuspended=!!value;this.pause(this.moduleSuspended||document.hidden);}
  pause(value){this.suspended=!!value;this.host.classList.toggle('scene-paused',!!value);if(value&&this.frame){cancelAnimationFrame(this.frame);this.frame=null;}else if(!value)this.scheduleMeasure();}
  stop(){if(this.frame)cancelAnimationFrame(this.frame);this.resizeObserver.disconnect();this.mutationObserver.disconnect();this.reduced.removeEventListener('change',this.onMotion);window.removeEventListener('resize',this.onResize);document.removeEventListener('visibilitychange',this.onVisibility);this.host.replaceChildren();}
 }
 root.MischiefSceneRenderer=SceneRenderer;
})(window);
