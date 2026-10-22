process.env.TZ='Asia/Bangkok';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {spawnSync}=require('node:child_process');
const code=fs.readFileSync('index.html','utf8').match(/<script id="domain">([\s\S]*?)<\/script>/)[1];
const ctx={};vm.createContext(ctx);vm.runInContext(code,ctx);const C=ctx.IFCore;
const end=(day,hour=8)=>new Date(2026,9,day,hour).toISOString();
const fast=(day,id='f',hour=8)=>({id,start:end(day-1,20),end:end(day,hour)});
const ref=new Date(2026,9,22,12).getTime();
test('streak deduplicates completion dates, carries yesterday until today completes, ignores active/future rounds',()=>{
 const rows=[fast(20,'a'),fast(21,'b'),fast(21,'c'),fast(23,'future'),{id:'active',start:end(21,20)}];
 const snapshot=JSON.stringify(rows),result=C.fastingStreak(rows,ref);
 assert.equal(result.count,2);assert.equal(result.completedToday,false);
 assert.equal(result.days.length,7);assert.equal(result.days.at(-1).day,'2026-10-22');
 assert.equal(result.days.at(-1).completed,false);assert.equal(JSON.stringify(rows),snapshot);
 rows.push(fast(22,'today'));assert.equal(C.fastingStreak(rows,ref).count,3);
});
test('streak resets after a missed day and empty records produce zero',()=>{
 assert.equal(C.fastingStreak([fast(20)],ref).count,0);
 assert.equal(C.fastingStreak([],ref).count,0);
 assert.equal(C.fastingStreak([fast(22)],ref).count,1);
});
test('a multi-day fast counts one completion day for streak, rather than days spent fasting',()=>{
 const rows=[{start:end(18,20),end:end(22,8)}];
 assert.equal(C.fastingStreak(rows,ref).count,1);
});
test('fasting graph splits midnight boundaries and uses union time for overlapping imports',()=>{
 const rows=[{start:end(20,20),end:end(21,8)},{start:end(20,22),end:end(21,6)}];
 const snapshot=JSON.stringify(rows),days=C.fastingDays(rows,7,'2026-10-22',ref);
 assert.equal(days.length,7);assert.equal(days[0].day,'2026-10-16');
 assert.equal(days.find(d=>d.day==='2026-10-20').hours,4);
 assert.equal(days.find(d=>d.day==='2026-10-21').hours,8);
 assert.equal(days.at(-1).hours,0);assert.equal(JSON.stringify(rows),snapshot);
});
test('month graph clips long rounds to the window and excludes unfinished or future-ended rounds',()=>{
 const rows=[{start:end(1,0),end:end(21,0)},{start:end(22,0),end:end(23,1)},{start:end(22,1)}];
 const days=C.fastingDays(rows,30,'2026-10-22',ref);
 assert.equal(days.length,30);assert.equal(days[0].day,'2026-09-23');
 assert.equal(days.reduce((n,d)=>n+d.hours,0),20*24);
 assert.equal(days.at(-1).hours,0);
 assert.throws(()=>C.fastingDays([],30,'2026-02-30',ref));
});
test('hourly water buckets use local date/hour, include zeros and combine multiple glasses',()=>{
 const rows=[{at:end(22,8),ml:250},{at:new Date(2026,9,22,8,45).toISOString(),ml:400},{at:end(22,9),ml:150},{at:end(21,8),ml:900}];
 const snapshot=JSON.stringify(rows),hours=C.waterHours(rows,'2026-10-22');
 assert.equal(hours.length,24);assert.equal(hours[8].ml,650);assert.equal(hours[9].ml,150);
 assert.equal(hours[0].ml,0);assert.equal(hours.reduce((n,h)=>n+h.ml,0),800);
 assert.equal(JSON.stringify(rows),snapshot);
});
test('calendar analytics respect 23/25-hour DST days and consecutive calendar dates',()=>{
 const script=`const vm=require('vm');const ctx={};vm.createContext(ctx);vm.runInContext(${JSON.stringify(code)},ctx);const C=ctx.IFCore;const ref=new Date(2026,10,3,12).getTime();const spring=[{start:new Date(2026,2,8).toISOString(),end:new Date(2026,2,9).toISOString()}];const fall=[{start:new Date(2026,10,1).toISOString(),end:new Date(2026,10,2).toISOString()}];const streak=[1,2,3].map(d=>({start:new Date(2026,9,31).toISOString(),end:new Date(2026,10,d,8).toISOString()}));console.log(JSON.stringify([C.fastingDays(spring,1,'2026-03-08',ref)[0].hours,C.fastingDays(fall,1,'2026-11-01',ref)[0].hours,C.fastingStreak(streak,ref).count]));`;
 const result=spawnSync(process.execPath,['-e',script],{env:{...process.env,TZ:'America/New_York'},encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);assert.deepEqual(JSON.parse(result.stdout),[23,25,3]);
});
