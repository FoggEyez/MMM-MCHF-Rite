const {test}=require('node:test'),assert=require('node:assert/strict');
const C=require('../christmas-model.js');
test('six card treatments have different growth geometry and deterministic recovery-safe seeds',()=>{
 const programs=C.profiles.map((p,i)=>C.geometry(p,350,240,4171+i*1093));
 assert.equal(programs.length,6);assert.equal(new Set(programs.map(p=>JSON.stringify(p.segments))).size,6);
 assert.deepEqual(programs[0],C.geometry(C.profiles[0],350,240,4171));
 assert.ok(programs[1].icicles.length>0&&programs[0].icicles.length===0);
 for(const p of programs){assert.ok(p.segments.length>100&&p.segments.length<2500);for(const s of p.segments)for(const k of ['x1','x2','y1','y2','width','birth'])assert.ok(Number.isFinite(s[k]));}
});
test('freezing front grows, holds and thaws in sequence; reduced motion is still',()=>{
 assert.equal(C.state(1,5).growth,0);assert.ok(C.state(10).growth>C.state(4).growth);assert.equal(C.state(25).growth,1);
 assert.ok(C.state(65).growth<C.state(45).growth);assert.equal(C.state(90).growth,0);
 assert.deepEqual(C.state(1,0,true),C.state(100,0,true));assert.equal(C.state(10,0,true).active,false);
});
test('temporary scene preview expires and rejects invalid modes/nonces/long lifetimes',()=>{
 const now=1000000,p={mode:'christmas',expiresAt:now+300000,nonce:'a'.repeat(32)};
 assert.equal(C.preview(p,now).mode,'christmas');assert.equal(C.preview(p,now+300001),null);
 assert.equal(C.preview({...p,mode:'anything'},now),null);assert.equal(C.preview({...p,nonce:'../path'},now),null);assert.equal(C.preview({...p,expiresAt:now+9999999},now),null);
});
