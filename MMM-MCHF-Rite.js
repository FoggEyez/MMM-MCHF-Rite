/* global Module, MischiefSceneRenderer */
Module.register('MMM-MCHF-Rite', {
 requiresVersion: '2.38.0',
 defaults: {
  "sceneMode": "calendar",
  "activeScene": "winter-glass",
  "useBuiltInCalendar": true,
  "timeZone": "",
  "motion": "auto",
  "readabilityPadding": 24,
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "07:00",
    "mode": "still"
  },
  "targets": [
    {
      "name": "Weather",
      "selector": ".weather",
      "index": 0,
      "enabled": true,
      "effect": "inherit",
      "edge": "top",
      "strength": 100
    },
    {
      "name": "Calendar",
      "selector": ".calendar",
      "index": 0,
      "enabled": true,
      "effect": "inherit",
      "edge": "bottom",
      "strength": 100
    },
    {
      "name": "Clock",
      "selector": ".clock",
      "index": 0,
      "enabled": true,
      "effect": "ornament",
      "edge": "right",
      "strength": 75
    }
  ],
  "clearZones": [],
  "occasions": [],
  "scenes": [
    {
      "id": "winter-glass",
      "name": "Winter Glass",
      "theme": "christmas",
      "color": "#c8e9f3",
      "accentColor": "#d7b67b",
      "effect": "frost",
      "ornament": "holly",
      "particle": "snow",
      "strength": 68,
      "particleCount": 12,
      "speed": 42
    },
    {
      "id": "autumn-lanterns",
      "name": "Autumn Lanterns",
      "theme": "halloween",
      "color": "#d9a76b",
      "accentColor": "#c7733e",
      "effect": "garland",
      "ornament": "leaf",
      "particle": "leaf",
      "strength": 65,
      "particleCount": 8,
      "speed": 48
    },
    {
      "id": "spring-garden",
      "name": "Spring Garden",
      "theme": "easter",
      "color": "#b1ceb2",
      "accentColor": "#e5b9c8",
      "effect": "garland",
      "ornament": "blossom",
      "particle": "petal",
      "strength": 62,
      "particleCount": 10,
      "speed": 45
    },
    {
      "id": "celebration",
      "name": "Celebration",
      "theme": "birthday",
      "color": "#dfc487",
      "accentColor": "#a7ccc5",
      "effect": "glow",
      "ornament": "star",
      "particle": "spark",
      "strength": 65,
      "particleCount": 12,
      "speed": 38
    },
    {
      "id": "starlit-evening",
      "name": "Starlit Evening",
      "theme": "night",
      "color": "#b7c7e1",
      "accentColor": "#e4d1a4",
      "effect": "glow",
      "ornament": "star",
      "particle": "spark",
      "strength": 48,
      "particleCount": 8,
      "speed": 65
    },
    {
      "id": "rose-garden",
      "name": "Rose Garden",
      "theme": "valentine",
      "color": "#d9a5b0",
      "accentColor": "#c8b17e",
      "effect": "garland",
      "ornament": "heart",
      "particle": "petal",
      "strength": 60,
      "particleCount": 8,
      "speed": 52
    },
    {
      "id": "halloween-night",
      "name": "Halloween Night",
      "theme": "halloween",
      "color": "#d9a16a",
      "accentColor": "#a65f35",
      "effect": "glow",
      "ornament": "pumpkin",
      "particle": "leaf",
      "strength": 62,
      "particleCount": 8,
      "speed": 48
    },
    {
      "id": "easter-garden",
      "name": "Easter Garden",
      "theme": "easter",
      "color": "#d4dba9",
      "accentColor": "#c6a8cb",
      "effect": "garland",
      "ornament": "egg",
      "particle": "petal",
      "strength": 62,
      "particleCount": 8,
      "speed": 48
    },
    {
      "id": "new-year",
      "name": "New Year",
      "theme": "newyear",
      "color": "#e7cc8b",
      "accentColor": "#baccc4",
      "effect": "glow",
      "ornament": "star",
      "particle": "confetti",
      "strength": 62,
      "particleCount": 16,
      "speed": 42
    },
    {
      "id": "remembrance",
      "name": "Remembrance",
      "theme": "veterans",
      "color": "#b99887",
      "accentColor": "#a85450",
      "effect": "ornament",
      "ornament": "poppy",
      "particle": "none",
      "strength": 55,
      "particleCount": 0,
      "speed": 70
    }
  ],
  "holidayMode": "auto"
},
 getScripts(){return ['holiday-model.js','christmas-model.js','scene-model.js','scene-art.js','scene-renderer.js'].map(f=>this.file(f));},
 getStyles(){return [this.file('mischief-surfaces.css'),this.file('MMM-MCHF-Rite.css')];},
 start(){this.paused=false;this.refresh=()=>{if(this.renderer&&!this.paused)this.renderer.update(this.config);};},
 getDom(){if(!this.root){this.root=document.createElement('div');this.root.className='mischief-scene-overlay';this.root.setAttribute('aria-hidden','true');}return this.root;},
 notificationReceived(name){if(name==='DOM_OBJECTS_CREATED'){if(!this.renderer)this.renderer=new MischiefSceneRenderer(this.getDom());this.refresh();clearInterval(this.timer);this.timer=setInterval(this.refresh,30000);}},
 suspend(){this.paused=true;clearInterval(this.timer);this.renderer?.setSuspended(true);},
 resume(){this.paused=false;this.renderer?.setSuspended(false);this.refresh();clearInterval(this.timer);this.timer=setInterval(this.refresh,30000);}
});
