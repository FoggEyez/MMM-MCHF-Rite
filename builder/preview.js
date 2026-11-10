(function(){
 const host=document.getElementById('effects'),renderer=new MischiefSceneRenderer(host),origin=location.origin==='null'?'*':location.origin;
 window.addEventListener('message',event=>{
  if(event.source!==parent||event.origin!==location.origin&&!(event.origin==='null'&&location.protocol==='file:')||event.data?.source!=='mischief-scene-studio'||event.data.type!=='preview')return;
  const config=MischiefSceneModel.normalize(event.data.config),samples=['#sample-weather','#sample-calendar','#sample-clock','#sample-extra'];
  config.targets=config.targets.slice(0,4).map((t,i)=>({...t,selector:samples[i],index:0}));document.getElementById('sample-extra').style.display=config.targets.length>3?'block':'none';
  let date;try{date=event.data.date?MischiefSceneModel.previewInstant(event.data.date.slice(0,10),event.data.date.slice(11,16),config.timeZone):new Date(Date.now());}catch(error){parent.postMessage({source:'mischief-scene-preview',type:'error',message:error.message},origin);return;}renderer.update(config,date);
  parent.postMessage({source:'mischief-scene-preview',type:'rendered',scene:renderer.selected.scene?.name||'No active scene',reason:renderer.selected.reason,targets:renderer.items.length,motion:renderer.selected.motion},origin);
 });
 parent.postMessage({source:'mischief-scene-preview',type:'ready'},origin);
})();
