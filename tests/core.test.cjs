const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const code=html.match(/<script id="domain">([\s\S]*?)<\/script>/)[1];
const ctx={};vm.createContext(ctx);vm.runInContext(code,ctx);const C=ctx.IFCore;
const profile={name:'Test',weight:70,height:170,targetWeight:65,waterGoal:2100,sleepGoal:8,sex:'unspecified',morning:'05:00',morningEnd:'07:00',bedtime:'20:00',bedtimeEnd:'02:00'};
test('open ended fasting survives multiple days and ignores future clocks',()=>{
 assert.equal(C.elapsed('2026-10-18T00:00:00Z',Date.parse('2026-10-20T01:00:00Z')),49*3600000);
 assert.equal(C.elapsed('2026-10-21T00:00:00Z',Date.parse('2026-10-20T01:00:00Z')),0);
});
test('profile validates finite healthy input ranges without coercing garbage',()=>{
 assert.equal(C.validProfile(profile),true);assert.equal(C.validProfile({...profile,height:0}),false);assert.equal(C.validProfile({...profile,weight:NaN}),false);
 assert.equal(C.validProfile({...profile,waterGoal:999999}),false);
});
test('water sums only matching local date',()=>{
 const t=new Date(2026,9,20,9).toISOString(); const old=new Date(2026,9,19,23).toISOString();
 assert.equal(C.waterTotal([{ml:250,at:t},{ml:500,at:old}],C.dayKey(new Date(t))),250);
});
test('sleep duration crosses midnight; inverted dates fail',()=>{
 assert.equal(C.sleepHours('2026-10-19T16:00:00Z','2026-10-20T00:00:00Z'),8);
 assert.throws(()=>C.sleepHours('2026-10-20T01:00:00Z','2026-10-20T00:00:00Z'));
});
test('backup roundtrip and hostile imports',()=>{
 const s=C.empty();s.profile=profile;s.onboarded=true;
 s.water=[{id:'a',ml:250,at:'2026-10-20T00:00:00Z',updatedAt:'2026-10-20T00:00:00Z'}];
 assert.equal(C.validateBackup(JSON.parse(JSON.stringify(s))).water.length,1);
 assert.throws(()=>C.validateBackup({...s,schemaVersion:99}));
 assert.throws(()=>C.validateBackup({...s,water:[{id:'x',ml:-1,at:'not a date'}]}));
 assert.throws(()=>C.validateBackup({...s,water:[...s.water,...s.water]}));
 assert.throws(()=>C.validateBackup({...s,activeFast:{id:'x',start:'garbage'}}));
 assert.throws(()=>C.validateBackup({...s,onboarded:true,profile:null}));
});
test('merge deduplicates IDs and retains latest edit',()=>{
 const a=C.empty(), b=C.empty();
 a.water=[{id:'x',ml:100,at:'2026-10-19T00:00:00Z',updatedAt:'2026-10-19T00:00:00Z'}];
 b.water=[{id:'x',ml:300,at:'2026-10-19T00:00:00Z',updatedAt:'2026-10-20T00:00:00Z'}];
 assert.equal(C.merge(a,b).water.length,1);assert.equal(C.merge(a,b).water[0].ml,300);
});
test('overnight check-in windows support night shift settings',()=>{
 assert.equal(C.inWindow('01:00','20:00','02:00'),true);assert.equal(C.inWindow('12:00','20:00','02:00'),false);
});
test('reset and import preserve monotonically increasing local revision',()=>{
 const s=C.empty();s.revision=17;
 assert.equal(C.transition(s,x=>Object.assign(x,C.empty())).revision,18);
 const before=C.empty();before.revision=42;const incoming=C.empty();incoming.revision=2;
 assert.equal(C.transition(before,x=>Object.assign(x,incoming)).revision,43);
});
test('stale record edits and deletions reject newer data',()=>{
 const rows=[{id:'a',updatedAt:'2026-10-20T02:00:00Z',ml:500}];
 assert.throws(()=>C.assertUnchanged(rows,'a','2026-10-20T01:00:00Z'));
 assert.doesNotThrow(()=>C.assertUnchanged(rows,'a','2026-10-20T02:00:00Z'));
 assert.throws(()=>C.assertUnchanged(rows,'missing','2026-10-20T02:00:00Z'));
});
test('saving old profile form without changing weight cannot fabricate measurement',()=>{
 const s=C.empty();s.profile=profile;s.onboarded=true;
 s.weights=[{id:'new',kg:75,at:'2026-10-20T02:00:00Z',updatedAt:'2026-10-20T02:00:00Z'}];
 C.updateProfile(s,{...profile,waterGoal:2500},70,{id:'form',at:'2026-10-20T03:00:00Z'});
 assert.equal(s.weights.length,1);assert.equal(s.profile.weight,75);assert.equal(s.profile.waterGoal,2500);
 C.updateProfile(s,{...profile,weight:74},75,{id:'intentional',at:'2026-10-20T04:00:00Z'});
 assert.equal(s.weights.length,2);assert.equal(s.weights[1].kg,74);
});
