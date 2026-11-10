const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const H=require('../holiday-model.js');
const C=require('../christmas-model.js');
const day=s=>new Date(s+'T20:00:00Z');
test('holiday dates handle movable holidays, year boundaries, local dates and quiet ordinary days',()=>{
 for(const [date,theme]of [['2026-01-01','newyear'],['2026-01-04','christmas'],['2026-02-14','valentine'],['2026-03-17','stpatrick'],['2026-04-05','easter'],['2026-05-25','memorial'],['2026-07-04','independence'],['2026-09-07','labor'],['2026-10-31','halloween'],['2026-11-11','veterans'],['2026-11-26','thanksgiving'],['2026-12-25','christmas'],['2026-11-09','none'],['2027-03-28','easter']])assert.equal(H.choose(day(date)),theme,date);
 assert.equal(H.choose(new Date('2026-11-10T06:00:00Z'),'auto','America/Los_Angeles'),'none');assert.equal(H.choose(new Date('2026-11-10T09:00:00Z'),'auto','America/Los_Angeles'),'veterans');
 assert.equal(H.choose(new Date('2026-11-10T06:00:00Z'),'auto','UTC'),'veterans');
 assert.equal(H.choose(day('2026-06-01'),'christmas'),'christmas');assert.equal(H.choose(day('2026-12-25'),'off'),'none');assert.equal(H.choose(day('2026-12-25'),'auto','invalid-zone'),'none');
 for(const year of [2026,2027,2028,2029,2030]){const [m,d]=H.easter(year);assert.equal(new Date(Date.UTC(year,m-1,d)).getUTCDay(),0);}
});
test('every holiday has complete local artwork, with quiet remembrance themes and distinct seasonal motifs',()=>{
 for(const theme of H.themes){const p=H.profile(theme);assert.ok(H.paths[p.motif]&&H.paths[p.accent]);assert.equal(p.colors.length,3);if(!p.quiet)assert.ok(H.paths[p.particle]);}
 assert.equal(H.profile('memorial').quiet,true);assert.equal(H.profile('veterans').particle,null);assert.notEqual(H.profile('christmas').motif,H.profile('halloween').motif);assert.equal(H.profile('none'),null);
});
