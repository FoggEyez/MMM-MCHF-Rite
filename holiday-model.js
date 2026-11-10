/* Local decorative calendar; original vector art, no requests or event/calendar access. */
(function(root){
 const themes=['newyear','valentine','stpatrick','easter','memorial','independence','labor','halloween','veterans','thanksgiving','christmas'];
 function easter(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m+114)/31);return [month,(h+l-7*m+114)%31+1];}
 function choose(date=new Date(Date.now()),mode='auto',zone=undefined){
  if(mode==='off')return 'none';if(themes.includes(mode))return mode;
  let parts;try{parts=new Intl.DateTimeFormat('en-US',{timeZone:zone,year:'numeric',month:'numeric',day:'numeric'}).formatToParts(date);}catch{return 'none';}
  const get=t=>Number(parts.find(p=>p.type===t).value),y=get('year'),m=get('month'),d=get('day'),today=Date.UTC(y,m-1,d),near=(month,day,before,after)=>today>=Date.UTC(y,month-1,day-before)&&today<=Date.UTC(y,month-1,day+after),nth=(month,weekday,n)=>1+(weekday-new Date(Date.UTC(y,month-1,1)).getUTCDay()+7)%7+7*(n-1);
  if(m===12&&d>=31||m===1&&d<=2)return 'newyear';
  if(m===12||m===1&&d<=5)return 'christmas';
  if(near(2,14,2,1))return 'valentine';if(near(3,17,2,1))return 'stpatrick';
  const [em,ed]=easter(y);if(near(em,ed,3,1))return 'easter';
  const lastMayMonday=31-(new Date(Date.UTC(y,4,31)).getUTCDay()+6)%7;
  if(near(5,lastMayMonday,3,0))return 'memorial';
  if(near(7,4,3,1))return 'independence';if(near(9,nth(9,1,1),3,0))return 'labor';
  if(m===10&&d>=24)return 'halloween';if(near(11,11,1,1))return 'veterans';
  if(near(11,nth(11,4,4),5,3))return 'thanksgiving';return 'none';
 }
 const paths={
  star:'M32 4 39 23 59 24 44 37 49 58 32 46 15 58 20 37 5 24 25 23Z',
  leaf:'M32 58C10 48 5 26 19 6 28 13 29 4 35 2 38 13 53 11 56 23 56 40 40 49 32 58ZM32 58 34 18M33 36 19 27M33 43 46 30',
  heart:'M32 55C25 48 5 34 5 20 5 4 24 1 32 16 40 1 59 4 59 20 59 34 39 48 32 55Z',
  holly:'M31 35C14 38 11 20 3 11L18 14 23 3 27 19 38 16 31 35ZM34 33C40 16 54 16 61 7L57 23 63 31 48 31 49 43 34 33Z',
  blossom:'M32 26C13 9 43-7 38 21 59 6 72 39 43 36 61 57 30 69 29 44 11 63-4 32 23 31 0 18 22 1 32 26Z',
  clover:'M32 32C7 32 7 4 22 5 35 5 35 21 32 32 32 7 60 6 59 21 59 34 43 35 32 32 57 32 58 60 43 59 30 59 29 43 32 32 32 57 4 58 5 43 5 30 21 29 32 32ZM32 32 42 62',
  bat:'M32 24 25 16 25 29C17 19 8 19 1 20 8 29 5 39 5 44 14 37 21 40 24 47L32 53 40 47C43 40 50 37 59 44 59 39 56 29 63 20 56 19 47 19 39 29L39 16 32 24Z',
  snow:'M32 3V61M7 17 57 47M7 47 57 17M24 10 32 18 40 10M24 54 32 46 40 54M9 27 20 25 18 14M46 50 44 39 55 37M9 37 20 39 18 50M46 14 44 25 55 27',
  pumpkin:'M31 15C14 5 3 22 7 40 10 56 24 59 32 55 43 61 57 51 58 36 59 20 47 9 35 15L37 5 29 4Z',
  egg:'M32 5C23 5 9 29 10 43 11 62 52 62 54 43 55 29 41 5 32 5Z',
  poppy:'M32 23C18-1 2 14 9 29-7 43 13 64 29 47 36 70 64 53 51 37 70 18 46-2 32 23Z',
  ribbon:'M18 5H46L40 28 51 56 33 47 16 58 24 29Z',
  spark:'M32 3 36 26 56 16 40 32 61 39 37 37 32 61 27 39 5 48 24 33 5 23 27 27Z',
  sprig:'M10 57 52 6M18 47 7 32 22 40 17 20 29 33 28 11 36 23 40 4 42 18 58 16 45 26 62 30 39 35 54 44 31 44 37 59 22 52Z'
 };
 const profiles={
  christmas:{motif:'holly',accent:'sprig',particle:'snow',colors:['#b9d0aa','#365440','#b57569']},
  newyear:{motif:'spark',accent:'ribbon',particle:'star',colors:['#e5d5a2','#7e6844','#c5d6c6']},
  valentine:{motif:'heart',accent:'blossom',particle:'heart',colors:['#d7a29c','#754b50','#d5bd89']},
  stpatrick:{motif:'clover',accent:'sprig',particle:'clover',colors:['#b8d19d','#3e6651','#d6c38e']},
  easter:{motif:'egg',accent:'blossom',particle:'blossom',colors:['#d5d2ab','#7c8b75','#c5a5b5']},
  memorial:{motif:'poppy',accent:'ribbon',particle:null,quiet:true,colors:['#be9288','#64464a','#d2c293']},
  independence:{motif:'star',accent:'ribbon',particle:'star',colors:['#d7c99d','#657883','#bb8c83']},
  labor:{motif:'leaf',accent:'star',particle:'leaf',colors:['#cfb887','#776443','#a8bc9b']},
  halloween:{motif:'pumpkin',accent:'bat',particle:'bat',colors:['#d1a16b','#6b4c38','#cbbb8d']},
  veterans:{motif:'poppy',accent:'star',particle:null,quiet:true,colors:['#b58b80','#624c48','#dac999']},
  thanksgiving:{motif:'leaf',accent:'pumpkin',particle:'leaf',colors:['#d1b276','#74533a','#b9bc8f']}
 };
 function profile(theme){return profiles[theme]||null;}
 function artwork(theme){return profile(theme)?.motif||'star';}
 const api={themes,easter,choose,paths,artwork,profile};root.MirrorHolidays=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
