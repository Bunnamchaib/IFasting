const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const ctx={};vm.createContext(ctx);vm.runInContext(html.match(/<script id="domain">([\s\S]*?)<\/script>/)[1],ctx);
const C=ctx.IFCore;
test('fasting stage boundaries are exact and never reset after 24 hours',()=>{
 for(const [hours,index] of [[0,0],[3.999,0],[4,1],[11.999,1],[12,2],[17.999,2],[18,3],[23.999,3],[24,4],[48,4],[96,4]])assert.equal(C.fastStage(hours*3600000),index,`${hours} hours`);
 assert.equal(C.fastStage(-1000),0);
});
test('open fasting screen updates its stage and highlight at time boundaries and clears when stopped',()=>{
 let current=0;
 const fields=Object.fromEntries(['data-stage-status','data-stage-title','data-stage-range','data-stage-description','data-live-phase'].map(k=>[`[${k}]`,[{textContent:''}]]));
 const items=Array.from({length:5},(_,i)=>({dataset:{stage:String(i)},attrs:{},badge:{hidden:true},current:false,setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];},querySelector(){return this.badge;},classList:{toggle(_,v){items[i].current=v;}}}));
 const ui={C:{...C,elapsed:start=>C.elapsed(start,current)},state:{activeFast:{start:'1970-01-01T00:00:00Z'},activeSleep:null},booted:true,t:s=>s,document:{hidden:false,querySelectorAll:s=>s==='[data-stage]'?items:fields[s]||[]}};
 vm.createContext(ui);
 const metadata=html.slice(html.indexOf(' function fastingStages(){'),html.indexOf('\n function fasting(){'));
 const live=html.slice(html.indexOf(' function phaseIndex(){'),html.indexOf('\n function showDialog('));
 vm.runInContext(metadata+live,ui);
 for(const [hours,index] of [[3.999,0],[4,1],[12,2],[18,3],[24,4],[49,4]]){
  current=hours*3600000;ui.updateLive();
  assert.match(fields['[data-stage-title]'][0].textContent,new RegExp(`Stage ${index+1}`));
  assert.match(fields['[data-live-phase]'][0].textContent,new RegExp(`Stage ${index+1}`));
  items.forEach((item,i)=>{assert.equal(item.current,i===index);assert.equal(item.badge.hidden,i!==index);assert.equal(item.attrs['aria-current'],i===index?'step':undefined);});
 }
 ui.state.activeFast=null;ui.updateLive();
 assert.equal(fields['[data-stage-range]'][0].textContent,'');
 assert.ok(items.every(item=>!item.current&&item.badge.hidden));
});
