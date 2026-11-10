/* global Module, MirrorHolidays, MischiefChristmasModel, HolidayChristmasScene */
Module.register('MMM-MischiefHolidayAccents',{
 requiresVersion:'2.38.0',
 defaults:{decorationSelectors:['.weather','.calendar','.MMM-OnSpotify','.lc-card','.hc-card'],frostTargets:[],holidayMode:'auto',timeZone:'',decorOpacity:55,motifSize:54,particleCount:8,motionDuration:45,showCornerDecorations:true,showClockAccents:true,showDrift:true,showFrost:true,frostStrength:68,breezeEveryMinutes:4},
 getScripts(){return [this.file('holiday-model.js'),this.file('christmas-model.js'),this.file('christmas-scene.js')];},
 getStyles(){return [this.file('MMM-MischiefHolidayAccents.css')];},
 start(){this.theme=null;this.signature=null;this.paused=false;this.artId=0;this.frame=null;this.previewPacket=null;this.onResize=()=>this.schedulePlace();this.onVisibility=()=>{this.pause();if(!document.hidden)this.refresh();};window.addEventListener('resize',this.onResize);document.addEventListener('visibilitychange',this.onVisibility);},
 getDom(){if(!this.root){this.root=document.createElement('div');this.root.className='holiday-accents';this.root.setAttribute('aria-hidden','true');}return this.root;},
 notificationReceived(name){if(name==='DOM_OBJECTS_CREATED'){this.refresh();clearInterval(this.timer);this.timer=setInterval(()=>this.refresh(),60000);if(!this.observer){this.observer=new ResizeObserver(()=>this.schedulePlace());for(const target of document.querySelectorAll('.weather,.calendar,.MMM-OnSpotify,.clock,.MMM-LocalConditions,.MMM-HomeCheck,.MMM-SystemWatch'))this.observer.observe(target);}}},
 suspend(){this.paused=true;clearInterval(this.timer);this.pause();},resume(){this.paused=false;this.refresh();clearInterval(this.timer);this.timer=setInterval(()=>this.refresh(),60000);},
 pause(){const paused=this.paused||document.hidden;if(this.root)this.root.classList.toggle('holiday-paused',paused);this.christmas?.pause(paused);},
 socketNotificationReceived(name,packet){if(name!=='HOLIDAY_PREVIEW')return;const next=MischiefChristmasModel.preview(packet);if(next?.nonce===this.previewPacket?.nonce)return;this.previewPacket=next;clearTimeout(this.previewTimer);if(this.previewPacket)this.previewTimer=setTimeout(()=>{this.previewPacket=null;this.refresh();},this.previewPacket.expiresAt-Date.now()+20);this.refresh();if(this.previewPacket)this.christmas?.triggerBreeze();},
 number(key,min,max,fallback){const n=Number(this.config[key]);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback;},
 art(kind){
  const ns='http://www.w3.org/2000/svg',node=(name,attrs={})=>{const n=document.createElementNS(ns,name);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;};
  const svg=node('svg',{viewBox:'0 0 64 64',focusable:'false','data-art':kind}),colors=MirrorHolidays.profile(this.theme)?.colors||['#d8c58e','#77623b','#bc8e80'];
  this.artId=(this.artId||0)+1;
  const id='holiday-metal-'+String(this.identifier||'mischief').replace(/[^a-z0-9_-]/gi,'')+'-'+this.artId,defs=node('defs'),gradient=node('linearGradient',{id,x1:'0',y1:'0',x2:'1',y2:'1'});
  for(const[offset,color]of [['0%',colors[0]],['54%',colors[1]],['100%',colors[0]]])gradient.append(node('stop',{offset,'stop-color':color}));defs.append(gradient);svg.append(defs);
  const path=MirrorHolidays.paths[kind];
  svg.append(node('path',{d:path,class:'holiday-relief',transform:'translate(1.3 1.6)'}));
  svg.append(node('path',{d:path,class:'holiday-face',fill:kind==='snow'?'none':'url(#'+id+')'}));
  const line=d=>svg.append(node('path',{d,class:'holiday-engraving'}));
  if(kind==='holly')for(const[x,y]of [[29,36],[36,39],[35,31]])svg.append(node('circle',{cx:x,cy:y,r:3.3,class:'holiday-berry'}));
  if(kind==='pumpkin'){line('M26 17C17 27 17 44 27 53M37 17C47 29 46 44 37 53M32 18V54');svg.append(node('path',{d:'M17 31 25 27 24 34ZM47 31 39 27 40 34ZM23 43 29 46 33 43 37 46 43 41 38 50 27 50Z',class:'holiday-inlay'}));}
  if(kind==='egg'){line('M13 31C25 41 42 41 52 31M12 44C25 53 41 53 52 43M22 17 28 22 34 17 40 22');}
  if(kind==='poppy')svg.append(node('circle',{cx:31,cy:34,r:7,class:'holiday-inlay'}));
  if(kind==='heart')line('M13 23C13 14 23 10 28 20');
  if(kind==='ribbon')line('M22 12H42M25 20H39M28 30 21 50M37 30 45 49');
  return svg;
 },
 ornament(selector,index,kind,extra=''){
  const ornament=document.createElement('div');ornament.className='holiday-corner '+extra;ornament.dataset.anchor=selector;ornament.dataset.index=String(index);ornament.append(this.art(kind));this.root.append(ornament);return ornament;
 },
 refresh(){
  if(!this.root?.isConnected||this.paused||document.hidden)return;
  const preview=MischiefChristmasModel.preview(this.previewPacket),theme=preview?.mode||MirrorHolidays.choose(new Date(Date.now()),this.config.holidayMode,this.config.timeZone||undefined);
  const signature=[theme,this.config.showCornerDecorations,this.config.showClockAccents,this.config.showDrift,this.config.showFrost,this.config.frostStrength,this.config.breezeEveryMinutes,this.number('particleCount',0,16,8),this.number('motionDuration',20,120,45)].join(':');
  this.root.style.setProperty('--holiday-opacity',this.number('decorOpacity',0,85,55)/100);this.root.style.setProperty('--holiday-size',this.number('motifSize',32,72,54)+'px');
  if(signature!==this.signature){this.christmas?.stop();this.christmas=null;this.signature=signature;this.theme=theme;this.root.replaceChildren();this.root.dataset.theme=theme;this.root.hidden=theme==='none';
   if(theme==='christmas'){
    this.root.classList.remove('holiday-quiet');
    if(this.config.showFrost!==false)this.christmas=new HolidayChristmasScene(this);
    if(preview)this.christmas?.triggerBreeze();
   }else if(theme!=='none'){
    const profile=MirrorHolidays.profile(theme);this.root.classList.toggle('holiday-quiet',!!profile.quiet);
    for(const[key,color]of [['--holiday-color',profile.colors[0]],['--holiday-accent',profile.colors[2]]])this.root.style.setProperty(key,color);
    if(this.config.showCornerDecorations!==false)for(const selector of this.config.decorationSelectors){
     document.querySelectorAll(selector).forEach((target,index)=>{const ornament=this.ornament(selector,index,profile.motif);const small=document.createElement('span');small.className='holiday-companion';small.append(this.art(profile.accent));ornament.append(small);});
    }
    if(this.config.showClockAccents!==false&&document.querySelector('.clock'))for(const side of ['left','right']){const ornament=this.ornament('.clock',0,profile.accent,'holiday-clock');ornament.dataset.side=side;}
    if(this.config.showDrift!==false&&!profile.quiet)for(let i=0;i<this.number('particleCount',0,16,8);i++){
     const particle=document.createElement('div');particle.className='holiday-particle';particle.style.left=(i%2?'calc(100% - 34px)':'14px');particle.style.setProperty('--holiday-duration',this.number('motionDuration',20,120,45)*(1+(i%3)*.17)+'s');particle.style.animationDelay=(-i*7.31)+'s';
     particle.append(this.art(profile.particle));this.root.append(particle);
    }
   }
  }
  this.schedulePlace();this.pause();
 },
 schedulePlace(){if(this.frame||this.theme==='none'||this.paused||document.hidden)return;this.frame=requestAnimationFrame(()=>{this.frame=null;this.place();});},
 place(){if(!this.root||this.theme==='none'||this.paused||document.hidden)return;
  if(this.christmas){this.christmas.measure();return;}
  const size=this.number('motifSize',32,72,54),bar=document.querySelector('.sw-panel')?.getBoundingClientRect();
  // Read all anchor geometry first, then write. No per-particle JS frame loop.
  const placements=[...this.root.querySelectorAll('.holiday-corner')].map(ornament=>{const target=document.querySelectorAll(ornament.dataset.anchor)[Number(ornament.dataset.index)],r=target?.getBoundingClientRect();return {ornament,r,visible:r&&r.width>0&&r.height>0&&getComputedStyle(target).display!=='none'};});
  this.root.style.setProperty('--holiday-floor',Math.max(0,Math.min(innerHeight-60,(bar?.top||innerHeight-90)-38))+'px');
  for(const {ornament,r,visible}of placements){ornament.hidden=!visible;if(!visible)continue;
   const clock=!!ornament.dataset.side,x=clock?(ornament.dataset.side==='left'?r.left-size-12:r.right+12):r.right-size*.58,y=clock?r.top+(r.height-size)/2:r.top-size*.36;
   const left=Math.round(Math.min(innerWidth-size,Math.max(0,x))),top=Math.round(Math.max(0,y)),key=left+':'+top;
   if(ornament.dataset.placed!==key){ornament.dataset.placed=key;ornament.style.left=left+'px';ornament.style.top=top+'px';}
  }
 }
});
