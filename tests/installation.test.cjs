const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
function environment(){
 const shown=[];
 const ctx={navigator:{standalone:false},matchMedia:()=>({matches:false}),installedSession:false,installEvent:null,t:s=>s,icon:()=>'',btn:(label,action)=>`<button data-action="${action}">${label}</button>`,showDialog:(title,body)=>shown.push({title,body})};
 vm.createContext(ctx);
 const start=html.indexOf(' function isInstalled(){');assert.ok(start>=0,'installation helpers must exist');
 vm.runInContext(html.slice(start,html.indexOf('\n function resetDialog(){',start)),ctx);
 return {ctx,shown};
}
test('welcome and home offer installation; standalone mode hides prompts',()=>{
 const {ctx}=environment();
 assert.match(ctx.installShortcut(true),/Safari/);
 assert.match(ctx.installShortcut(false),/data-action="install"/);
 ctx.navigator.standalone=true;assert.equal(ctx.installShortcut(true),'');
 ctx.navigator.standalone=false;ctx.matchMedia=()=>({matches:true});assert.equal(ctx.installShortcut(false),'');
 ctx.matchMedia=()=>({matches:false});ctx.installedSession=true;assert.equal(ctx.installShortcut(false),'');
});
test('iPhone fallback explains manual steps and links to Apple instructions',async()=>{
 const {ctx,shown}=environment();await ctx.install();
 assert.match(shown[0].body,/Safari/);assert.match(shown[0].body,/Add to Home Screen/);assert.match(shown[0].body,/Open as Web App/);
 assert.match(shown[0].body,/support.apple.com/);
});
test('native install prompt is consumed once and failure falls back to instructions',async()=>{
 const {ctx,shown}=environment();let prompts=0;
 ctx.installEvent={prompt:async()=>prompts++};await ctx.install();
 assert.equal(prompts,1);assert.equal(ctx.installEvent,null);assert.equal(shown.length,0);
 await ctx.install();assert.equal(shown.length,1);
 ctx.installEvent={prompt:async()=>{throw Error('not available');}};await ctx.install();assert.equal(shown.length,2);
});
