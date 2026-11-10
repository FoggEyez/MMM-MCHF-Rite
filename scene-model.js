/* Pure configuration and local-calendar rules, shared by mirror, builder and tests. */
(function(root){
 'use strict';
 const ids=['winter-glass','autumn-lanterns','spring-garden','celebration','starlit-evening','rose-garden'];
 const presets=[
  {id:ids[0],name:'Winter Glass',theme:'christmas',color:'#c8e9f3',accentColor:'#d7b67b',effect:'frost',ornament:'holly',particle:'snow',strength:68,particleCount:12,speed:42},
  {id:ids[1],name:'Autumn Lanterns',theme:'halloween',color:'#d9a76b',accentColor:'#c7733e',effect:'garland',ornament:'leaf',particle:'leaf',strength:65,particleCount:8,speed:48},
  {id:ids[2],name:'Spring Garden',theme:'easter',color:'#b1ceb2',accentColor:'#e5b9c8',effect:'garland',ornament:'blossom',particle:'petal',strength:62,particleCount:10,speed:45},
  {id:ids[3],name:'Celebration',theme:'birthday',color:'#dfc487',accentColor:'#a7ccc5',effect:'glow',ornament:'star',particle:'spark',strength:65,particleCount:12,speed:38},
  {id:ids[4],name:'Starlit Evening',theme:'night',color:'#b7c7e1',accentColor:'#e4d1a4',effect:'glow',ornament:'star',particle:'spark',strength:48,particleCount:8,speed:65},
  {id:ids[5],name:'Rose Garden',theme:'valentine',color:'#d9a5b0',accentColor:'#c8b17e',effect:'garland',ornament:'heart',particle:'petal',strength:60,particleCount:8,speed:52},
  {id:'halloween-night',name:'Halloween Night',theme:'halloween',color:'#d9a16a',accentColor:'#a65f35',effect:'glow',ornament:'pumpkin',particle:'leaf',strength:62,particleCount:8,speed:48},
  {id:'easter-garden',name:'Easter Garden',theme:'easter',color:'#d4dba9',accentColor:'#c6a8cb',effect:'garland',ornament:'egg',particle:'petal',strength:62,particleCount:8,speed:48},
  {id:'new-year',name:'New Year',theme:'newyear',color:'#e7cc8b',accentColor:'#baccc4',effect:'glow',ornament:'star',particle:'confetti',strength:62,particleCount:16,speed:42},
  {id:'remembrance',name:'Remembrance',theme:'veterans',color:'#b99887',accentColor:'#a85450',effect:'ornament',ornament:'poppy',particle:'none',strength:55,particleCount:0,speed:70}
 ];
 const defaults={sceneMode:'calendar',activeScene:'winter-glass',useBuiltInCalendar:true,timeZone:'',motion:'auto',readabilityPadding:24,
  quietHours:{enabled:false,start:'22:00',end:'07:00',mode:'still'},
  targets:[{name:'Weather',selector:'.weather',index:0,enabled:true,effect:'inherit',edge:'top',strength:100},{name:'Calendar',selector:'.calendar',index:0,enabled:true,effect:'inherit',edge:'bottom',strength:100},{name:'Clock',selector:'.clock',index:0,enabled:true,effect:'ornament',edge:'right',strength:75}],
  clearZones:[],occasions:[],scenes:presets};
 const clone=value=>JSON.parse(JSON.stringify(value));
 const choices={sceneMode:['calendar','manual','off'],motion:['auto','gentle','still'],effect:['inherit','frost','garland','glow','ornament','none'],edge:['top','bottom','left','right'],particle:['snow','leaf','petal','spark','confetti','none'],ornament:['holly','leaf','blossom','heart','star','pumpkin','snow','egg','poppy','ribbon']};
 const fields=Object.keys(defaults),hex=/^#[a-f\d]{6}$/i,time=/^(?:[01]\d|2[0-3]):[0-5]\d$/;
 const number=(v,min,max,otherwise)=>typeof v==='number'&&Number.isFinite(v)?Math.max(min,Math.min(max,v)):otherwise;
 const text=(v,max,fallback='')=>typeof v==='string'?v.slice(0,max):fallback;
 function validDate(value){
  if(typeof value!=='string'||! /^(?:\d{4}-)?\d{2}-\d{2}$/.test(value))return false;
  const parts=value.split('-').map(Number),year=parts.length===3?parts.shift():2000,[month,day]=parts,date=new Date(Date.UTC(year,month-1,day));
  return year>=1900&&year<=9999&&date.getUTCFullYear()===year&&date.getUTCMonth()===month-1&&date.getUTCDate()===day;
 }
 function validate(raw){
  const errors=[];if(!raw||typeof raw!=='object'||Array.isArray(raw))return ['Settings must be an object.'];
  for(const key of fields)if(Object.hasOwn(raw,key)){
   const value=raw[key];if(choices[key]&&!choices[key].includes(value))errors.push('Choose a valid '+key+'.');
   if(['targets','scenes','occasions','clearZones'].includes(key)&&(!Array.isArray(value)||value.length>({targets:24,scenes:24,occasions:50,clearZones:16}[key])))errors.push(key+' has an invalid list or too many entries.');
  }
  if(raw.timeZone){try{new Intl.DateTimeFormat('en',{timeZone:raw.timeZone});}catch{errors.push('Choose a valid IANA time zone, or leave it empty.');}}
  if(raw.readabilityPadding!==undefined&&(typeof raw.readabilityPadding!=='number'||raw.readabilityPadding<0||raw.readabilityPadding>80))errors.push('Readability padding must be 0–80 pixels.');
  const sceneIds=new Set();
  for(const s of Array.isArray(raw.scenes)?raw.scenes:[]){if(!s||typeof s!=='object'){errors.push('Every scene needs settings.');continue;}if(!/^[a-z0-9][a-z0-9-]{0,47}$/.test(s.id||'')||sceneIds.has(s.id))errors.push('Scene IDs must be unique lowercase words joined with hyphens.');sceneIds.add(s.id);if(s.color!==undefined&&!hex.test(s.color)||s.accentColor!==undefined&&!hex.test(s.accentColor))errors.push('Scene colors must be six-digit hex colors.');for(const key of ['effect','particle','ornament'])if(s[key]!==undefined&&(!choices[key].includes(s[key])||key==='effect'&&s[key]==='inherit'))errors.push('Choose a valid scene '+key+'.');}
  const known=Array.isArray(raw.scenes)?sceneIds:new Set(presets.map(s=>s.id));
  if(raw.activeScene!==undefined&&!known.has(raw.activeScene))errors.push('The selected scene does not exist.');
  for(const t of Array.isArray(raw.targets)?raw.targets:[]){if(!t||typeof t!=='object'||typeof t.selector!=='string'||!t.selector.trim()||t.selector.length>180)errors.push('Each target needs a CSS selector of up to 180 characters.');else if(/[{}<>]|url\s*\(/i.test(t.selector))errors.push('A target selector contains unsupported characters.');if(t?.effect!==undefined&&!choices.effect.includes(t.effect)||t?.edge!==undefined&&!choices.edge.includes(t.edge))errors.push('Choose a valid target effect and edge.');}
  for(const o of Array.isArray(raw.occasions)?raw.occasions:[]){if(!o||!validDate(o.date)||o.endDate&&!validDate(o.endDate))errors.push('Occasions need real dates: MM-DD yearly or YYYY-MM-DD once.');if(o?.endDate&&o.date?.length!==o.endDate.length)errors.push('An occasion date range must use the same date format.');if(o?.date?.length===10&&o.endDate&&o.endDate<o.date)errors.push('A one-time occasion must end on or after its start date.');if(o?.scene&&!known.has(o.scene))errors.push('An occasion refers to a scene that does not exist.');}
  if(raw.quietHours!==undefined&&(!raw.quietHours||typeof raw.quietHours!=='object'||!time.test(raw.quietHours.start)||!time.test(raw.quietHours.end)||!['still','off'].includes(raw.quietHours.mode)))errors.push('Quiet hours need valid start/end times and still or off mode.');
  for(const z of Array.isArray(raw.clearZones)?raw.clearZones:[]){if(!z||!['x','y','width','height'].every(k=>typeof z[k]==='number'&&Number.isFinite(z[k])&&z[k]>=0&&z[k]<=100)||z.x+z.width>100||z.y+z.height>100)errors.push('Clear areas must fit within the screen, using percentages.');}
  return [...new Set(errors)];
 }
 function normalize(raw={}){
  if(!raw||typeof raw!=='object')raw={};const config={...clone(defaults),...raw};
  for(const key of ['sceneMode','motion'])if(!choices[key].includes(config[key]))config[key]=defaults[key];
  config.timeZone=text(config.timeZone,80);try{new Intl.DateTimeFormat('en',{timeZone:config.timeZone||undefined});}catch{config.timeZone='';}
  config.readabilityPadding=number(config.readabilityPadding,0,80,24);
  config.scenes=(Array.isArray(config.scenes)?config.scenes:presets).slice(0,24).filter(s=>s&&/^[a-z0-9][a-z0-9-]{0,47}$/.test(s.id||'')).map(s=>{
   const base=presets.find(p=>p.id===s.id)||presets[3];return {...base,id:s.id,name:text(s.name,60,base.name),theme:text(s.theme,32,base.theme),color:hex.test(s.color)?s.color:base.color,accentColor:hex.test(s.accentColor)?s.accentColor:base.accentColor,effect:choices.effect.includes(s.effect)&&s.effect!=='inherit'?s.effect:base.effect,ornament:choices.ornament.includes(s.ornament)?s.ornament:base.ornament,particle:choices.particle.includes(s.particle)?s.particle:base.particle,strength:number(s.strength,0,100,base.strength),particleCount:Math.round(number(s.particleCount,0,24,base.particleCount)),speed:number(s.speed,12,120,base.speed)};
  });
  if(!config.scenes.length)config.scenes=clone(presets);if(!config.scenes.some(s=>s.id===config.activeScene))config.activeScene=config.scenes[0].id;
  config.targets=(Array.isArray(config.targets)?config.targets:defaults.targets).slice(0,24).filter(t=>t&&typeof t.selector==='string'&&t.selector.trim()&&t.selector.length<=180&&!/[{}<>]|url\s*\(/i.test(t.selector)).map(t=>({name:text(t.name,60,'Module'),selector:t.selector,index:Math.round(number(t.index,0,50,0)),enabled:t.enabled!==false,effect:choices.effect.includes(t.effect)?t.effect:'inherit',edge:choices.edge.includes(t.edge)?t.edge:'top',strength:number(t.strength,0,100,100)}));
  config.occasions=(Array.isArray(config.occasions)?config.occasions:[]).slice(0,50).filter(o=>o&&validDate(o.date)&&(!o.endDate||validDate(o.endDate)&&o.date.length===o.endDate.length)).map(o=>({name:text(o.name,60,'My occasion'),enabled:o.enabled!==false,date:o.date,endDate:o.endDate||o.date,scene:text(o.scene,48,'celebration'),priority:number(o.priority,0,100,50)}));
  config.clearZones=(Array.isArray(config.clearZones)?config.clearZones:[]).slice(0,16).filter(z=>z&&['x','y','width','height'].every(k=>typeof z[k]==='number'&&Number.isFinite(z[k])&&z[k]>=0&&z[k]<=100)&&z.x+z.width<=100&&z.y+z.height<=100).map(z=>({name:text(z.name,60,'Clear area'),enabled:z.enabled!==false,x:z.x,y:z.y,width:z.width,height:z.height}));
  const q=config.quietHours||{};config.quietHours={enabled:q.enabled===true,start:time.test(q.start)?q.start:'22:00',end:time.test(q.end)?q.end:'07:00',mode:q.mode==='off'?'off':'still'};
  return Object.fromEntries(fields.map(k=>[k,config[k]]));
 }
 function localParts(date,zone){const values=new Intl.DateTimeFormat('en-CA',{timeZone:zone||undefined,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date),get=k=>values.find(p=>p.type===k)?.value;return {date:get('year')+'-'+get('month')+'-'+get('day'),annual:get('month')+'-'+get('day'),minutes:Number(get('hour'))*60+Number(get('minute'))};}
 const minutes=s=>Number(s.slice(0,2))*60+Number(s.slice(3));
 function previewInstant(date,clock,zone){
  if(!validDate(date)||date.length!==10||!time.test(clock))throw Error('Choose a valid preview date and time.');
  const desired=Date.parse(date+'T'+clock+':00Z');let epoch=desired;
  for(let i=0;i<4;i++){const p=localParts(new Date(epoch),zone),actual=Date.parse(p.date+'T00:00:00Z')+p.minutes*60000;const delta=desired-actual;if(!delta)return new Date(epoch);epoch+=delta;}
  const p=localParts(new Date(epoch),zone);if(p.date!==date||p.minutes!==minutes(clock))throw Error('That local time is skipped by daylight saving. Choose another time.');return new Date(epoch);
 }
 function select(raw,date=new Date(Date.now()),holiday='none',reduced=false){
  const config=normalize(raw),local=localParts(date,config.timeZone),q=config.quietHours,start=minutes(q.start),end=minutes(q.end),quiet=q.enabled&&(start===end?true:start<end?local.minutes>=start&&local.minutes<end:local.minutes>=start||local.minutes<end);
  if(config.sceneMode==='off'||quiet&&q.mode==='off')return {scene:null,reason:quiet?'Quiet hours':'Scenes are off',motion:'still',config};
  let id=config.activeScene,reason='Manual scene';
  if(config.sceneMode==='calendar'){
   const matching=config.occasions.filter(o=>{if(!o.enabled)return false;const value=o.date.length===5?local.annual:local.date;return o.date<=o.endDate?value>=o.date&&value<=o.endDate:value>=o.date||value<=o.endDate;}).sort((a,b)=>b.priority-a.priority);
   if(matching.length){id=matching[0].scene;reason=matching[0].name;}
   else if(config.useBuiltInCalendar&&holiday!=='none'){id=({christmas:'winter-glass',newyear:'new-year',valentine:'rose-garden',stpatrick:'spring-garden',easter:'easter-garden',halloween:'halloween-night',thanksgiving:'autumn-lanterns',labor:'autumn-lanterns',memorial:'remembrance',veterans:'remembrance',independence:'celebration'})[holiday];reason='Holiday calendar';}
   else return {scene:null,reason:'No occasion today',motion:'still',config};
  }
  const scene=config.scenes.find(s=>s.id===id)||null;
  return {scene,reason:scene?reason:'The scheduled scene is missing',motion:scene?.theme==='veterans'||quiet||config.motion==='still'||reduced?'still':config.motion==='gentle'?'gentle':'auto',config};
 }
 function presetPack(raw,id){const c=normalize(raw),s=c.scenes.find(s=>s.id===id)||c.scenes[0];return {format:'mirror-mischief-scene',version:1,scene:clone(s),targets:clone(c.targets)};}
 function importPack(raw,pack){if(!pack||pack.format!=='mirror-mischief-scene'||pack.version!==1||!pack.scene)throw Error('Choose a Mischief scene preset (version 1).');const c=normalize(raw),scenes=c.scenes.filter(s=>s.id!==pack.scene.id);scenes.push(pack.scene);const next={...c,scenes,activeScene:pack.scene.id,...(pack.targets?{targets:pack.targets}:{})},errors=validate(next);if(errors.length)throw Error(errors.join(' '));return normalize(next);}
 const api={defaults,presets,fields,choices,clone,validate,normalize,select,localParts,previewInstant,validDate,presetPack,importPack};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MischiefSceneModel=api;
})(typeof window!=='undefined'?window:globalThis);
